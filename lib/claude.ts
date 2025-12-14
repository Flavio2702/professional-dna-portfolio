import Anthropic from '@anthropic-ai/sdk';
import { BigFiveScores, FormData, ProfessionalDNA } from '@/types/portfolio';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name} (set it in .env.local or environment variables).`);
  }
  return value;
}

function getAnthropicClient(): Anthropic {
  return new Anthropic({ apiKey: requireEnv('ANTHROPIC_API_KEY') });
}

function getModelCandidates(): string[] {
  const candidates = [
    process.env.ANTHROPIC_MODEL,
    'claude-sonnet-4-20250514',
    'claude-3-5-sonnet-20241022',
  ].filter(Boolean) as string[];

  return Array.from(new Set(candidates));
}

function getErrorStatus(error: unknown): number | undefined {
  if (typeof error === 'object' && error !== null) {
    const { status, statusCode } = error as { status?: number; statusCode?: number };
    return status ?? statusCode;
  }
  return undefined;
}

function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message?: unknown }).message);
  }
  return String(error);
}

function isLikelyModelError(error: unknown): boolean {
  const status = getErrorStatus(error);
  const message = getErrorMessage(error);
  return (
    status === 404 ||
    status === 400 ||
    (/model/i.test(message) && /not found|unknown|invalid/i.test(message))
  );
}

function isInsufficientCreditError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes('credit balance') ||
    message.includes('insufficient funds') ||
    message.includes('not enough credits')
  );
}

export async function generatePortfolio(
  formData: FormData,
  bigFiveScores: BigFiveScores,
  assessmentConfidence?: 'high' | 'medium' | 'low'
): Promise<ProfessionalDNA> {
  const prompt = buildPrompt(formData, bigFiveScores, assessmentConfidence);
  const anthropic = getAnthropicClient();

  let lastError: unknown;
  for (const model of getModelCandidates()) {
    try {
      const message = await anthropic.messages.create({
        model,
        // Output JSON regularly exceeds 4k tokens after compatibility/context additions,
        // so give Claude extra room to finish the object without truncation.
        max_tokens: 6000,
        temperature: 0.2,
        messages: [{ role: 'user', content: prompt }],
      });

      const responseText = message.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('\n')
        .trim();

      if (!responseText) throw new Error('No text response from Claude.');
      return parsePortfolioJSON(responseText);
    } catch (error) {
      if (isInsufficientCreditError(error)) {
        throw new Error(
          'Anthropic API credits are exhausted. Visit Plans & Billing to top up your balance.'
        );
      }
      lastError = error;
      if (!isLikelyModelError(error)) throw error;
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(message || 'Claude request failed.');
}

function buildPrompt(
  formData: FormData,
  bigFiveScores: BigFiveScores,
  assessmentConfidence?: 'high' | 'medium' | 'low'
): string {
  const { cv, projects, philosophy } = formData;

  // Confidence warning if applicable
  const confidenceWarning =
    assessmentConfidence === 'low'
      ? '\n⚠️ CAUTION: Low confidence assessment (response patterns detected). Use scores as rough indicators only.'
      : assessmentConfidence === 'medium'
      ? '\n⚠️ NOTE: Medium confidence assessment. Interpret scores with some caution.'
      : '';

  return `You are an expert career analyst creating a "Professional DNA Anti-Portfolio" - a radically honest, evidence-based professional profile.

# INPUT DATA

## CV/Background
${cv}

## Projects
${projects.github ? `GitHub: ${projects.github}` : ''}
${projects.portfolio ? `Portfolio: ${projects.portfolio}` : ''}

Case Studies:
${projects.caseStudies}

## Philosophy
Problem-Solving Approach: ${philosophy.problemSolving}
Significant Failure: ${philosophy.failure}
What I Love: ${philosophy.love}
What I Struggle With: ${philosophy.hate}
Ideal Work Style: ${philosophy.workStyle}

## Big Five Personality Scores (0-100 scale)
Openness: ${bigFiveScores.O}
Conscientiousness: ${bigFiveScores.C}
Extraversion: ${bigFiveScores.E}
Agreeableness: ${bigFiveScores.A}
Neuroticism: ${bigFiveScores.N}${confidenceWarning}

# BIG FIVE INTERPRETATION RULES

## Score Thresholds & Labels
- **High (≥70)**: Use labels like "naturally excel", "strong tendency", "dominant trait"
- **Moderate (40-69)**: Use labels like "capable", "balanced", "active"
- **Low (<40)**: Use labels like "developing", "emerging", "growing area"

## Behavior Anchors by Dimension

### Openness (O) - Intellectual Curiosity & Creativity
- **High O**: Abstract thinking, enjoys complexity, seeks novelty, creative problem-solving, comfortable with ambiguity, broad interests
- **Low O**: Prefers concrete/practical, values tradition/routine, focused interests, systematic approaches
- **Behavioral signals**: Exploration of new ideas, artistic interests, philosophical thinking, comfort with change

### Conscientiousness (C) - Organization & Discipline
- **High C**: Systematic, detail-oriented, planful, reliable, disciplined, perfectionist tendencies, follows processes
- **Low C**: Spontaneous, flexible, comfortable with disorder, may struggle with deadlines, prefers improvisation
- **Behavioral signals**: Project completion rates, documentation habits, process adherence, planning behaviors

### Extraversion (E) - Social Energy & Assertiveness
- **High E**: Energized by interaction, seeks collaboration, comfortable with attention, vocal in groups, extensive networks
- **Low E**: Energized by solitude, prefers smaller groups, reflective, observational, deep one-on-one connections
- **Behavioral signals**: Meeting preferences (sync vs async), communication style, team size comfort, recharge methods

### Agreeableness (A) - Cooperation & Empathy
- **High A**: Cooperative, empathetic, conflict-avoidant, team-first, trusting, supportive
- **Low A**: Direct, competitive, willing to challenge, skeptical, prioritizes goals over harmony
- **Behavioral signals**: Feedback delivery style, conflict navigation, stakeholder management approach

### Neuroticism (N) - Emotional Reactivity & Stress Response
- **High N**: Heightened sensitivity to stress, perfectionism, anxiety under pressure, emotionally reactive
- **Low N**: Calm under pressure, emotionally stable, resilient, comfortable with uncertainty
- **Behavioral signals**: Response to setbacks, stress management, feedback sensitivity, risk tolerance

## BASIS FIELD REQUIREMENTS
1. **MUST reference actual provided scores** - Never invent personality scores not in the input
2. **Use explicit format**: "Dimension: XX/100" (e.g., "Conscientiousness: 88/100")
3. **Combine traits when relevant**: "E:32/100 + C:88/100" for cross-trait patterns
4. **basis field is REQUIRED** when a gene relates to personality - use null ONLY for pure technical skills
5. **Cross-validate with CV/projects**: If score conflicts with evidence, acknowledge the nuance

## MULTI-SOURCE PERSONALITY INFERENCE (Cross-Validation)
⚠️ **CRITICAL**: Self-reported Big Five scores can diverge from behavioral evidence in CV/projects/philosophy

### Cross-Validation Process
1. **Analyze CV/Projects for personality signals**:
   - Solo vs collaborative work patterns → Extraversion indicators
   - Systematic documentation, process adherence → Conscientiousness indicators
   - Creative exploration, diverse projects → Openness indicators
   - Conflict handling, team dynamics → Agreeableness indicators
   - Handling setbacks, stress responses → Neuroticism indicators

2. **Flag discrepancies** (add to metadata.personalityCalibration.discrepancies):
   - Example: "Scored Low E (32) but CV shows extensive public speaking, conference talks, team leadership"
   - Example: "Scored High C (88) but projects show pattern of pivoting mid-stream without completion"
   - Example: "Scored Low O (35) but philosophy answers show abstract thinking and comfort with ambiguity"

3. **Calibration approach** (choose ONE):
   - **Trust behavioral evidence**: "While you scored X, your work history suggests Y - using Y for compatibility"
   - **Acknowledge context**: "Score shows X in general, but work context reveals Y tendency"
   - **Note social desirability bias**: "Self-assessment may reflect aspirational vs actual behavior"

4. **Metadata field** (REQUIRED if discrepancies found):
   - Populate metadata.personalityCalibration
   - crossValidated: true/false
   - discrepancies: Array of specific conflicts observed
   - calibrationNotes: How you resolved conflicts (1-2 sentences)

### When NOT to flag discrepancies
- Minor variations (±10 points) are normal
- Context-dependent traits (e.g., introverted socially but collaborative at work)
- Recent mutations (person changed, old CV doesn't reflect current state)

## ANTI-STEREOTYPE RULES
1. **Avoid deterministic language**: Never "introverts always...", "highly conscientious people never..."
2. **Add context qualifiers**: "In deep work contexts...", "When working solo...", "Under deadlines..."
3. **Acknowledge exceptions**: "While low E suggests X, evidence shows Y in collaborative contexts"
4. **Avoid pathologizing**: High/low scores are tendencies, not deficits
5. **Respect trait interactions**: Low E + High C ≠ sum of parts; explain the unique combination

## EVIDENCE STRUCTURE REQUIREMENTS
For each gene with personality basis:
- **Behavior evidence**: How the trait manifests in observable actions (e.g., "Compulsively profiles code", "Schedules solo deep work blocks")
- **Outcome evidence**: What the behavior achieved (e.g., "Reduced load time by X", "Shipped Y projects")
- **Counter-evidence (for developing traits)**: Situations where trait created challenges

Separate behavior from outcome - don't conflate "I am conscientious" with "I reduced TTI by X ms"

## TRAIT INTERACTION PATTERNS
Identify 2-3 dominant trait combinations and explain synergies:
- Low E + High C: Solo systematic work, async communication strength
- High O + High E: Collaborative innovation, brainstorming energy
- High C + High N: Perfectionism with anxiety; quality focus but stress sensitivity
- Low A + High O: Willing to challenge norms; strategic disagreement

## COMPATIBILITY MAPPING RULES

### Excel Traits (Unique Strengths)
- **Context Dependencies** (REQUIRED): Use 'contextDependencies.assumes[]' / 'strugglesIf[]' with concrete statements ("Async-first culture", "Real-time crisis mode")
- **Environmental Factors** (REQUIRED): Fill 'environmentalFactors' with 'thrivesWhen[]' / 'strugglesWhen[]'; add 'amplifiers' / 'suppressors' when relevant

### Capable Traits (Manageable with Energy Cost)
- Explain energy cost: "Can do X but requires Y to sustain"
- Clarify boundaries: "Effective when Z is limited"
- **Context Dependencies** (REQUIRED): Spell out the assumptions vs breaking points
- **Environmental Factors**: Include 'thrivesWhen' / 'strugglesWhen' even if short

### Developing Traits (Growth Through Integration, Not Replacement)
?s???? **CRITICAL REFRAME**: Developing ?%? "Fix weakness" or "Become opposite trait"
- **Integration Goal**: How to apply the trait more skillfully, not change it
  - High C doesn't become Low C; learns when to loosen perfectionism
  - Low E doesn't become High E; finds async ways to collaborate
  - Frame as: "Learning to modulate X in Y contexts" NOT "Overcoming X"
- **Growth Evidence**: Behavior changes while maintaining core trait
  - Example: "Still introverted (E:32), but now run async office hours instead of avoiding mentoring"
  - Example: "Still conscientious (C:88), but learning to ship MVPs without over-engineering"
- **Integration Goal Field**: REQUIRED - describe the modulation skill being developed
- **Context Dependencies + Environmental Factors**: Same requirements as Excel/Capable to show "assumes X, struggles when Y"

# OUTPUT RULES
- Return ONLY valid JSON (no markdown, no code fences, no commentary).
- Use first-person voice ("I...").
- Be evidence-based and radically honest.
- Do not include numeric claims in prose (avoid percentages, team sizes, etc).
- For gene.dominance use exactly: "Dominant", "Active", or "Developing".

# JSON SCHEMA (return this exact shape)
{
  "metadata": {
    "name": "string",
    "title": "string",
    "sequencedFrom": { "projects": 0, "skills": 0, "experiences": 0 },
    "rarityScore": 0,
    "lastUpdated": "ISO date string",
    "assessmentConfidence": "high|medium|low (optional)",
    "personalityCalibration": {
      "crossValidated": true,
      "discrepancies": ["string"],
      "calibrationNotes": "string"
    }
  },
  "genomeOverview": {
    "tagline": "string",
    "dominantTraits": ["string"],
    "dnaSequence": "string"
  },
  "chromosomes": [
    {
      "id": "technical-dna",
      "name": "Technical DNA",
      "genes": [
        {
          "name": "string",
          "dominance": "Dominant",
          "basis": "string or null",
          "expression": "string",
          "evidence": ["string"]
        }
      ]
    }
  ],
  "mutations": [
    {
      "year": 0,
      "title": "string",
      "description": "string",
      "mutation": "string",
      "newTrait": "string",
      "evidence": ["string"]
    }
  ],
  "projects": [
    {
      "geneId": "string",
      "title": "string",
      "context": "string",
      "approach": ["string"],
      "outcome": { "metric": "string", "secondary": "string" },
      "proof": { "liveLink": "string", "testimonial": { "quote": "string", "author": "string" } },
      "insight": "string"
    }
  ],
  "uniqueSequence": {
    "combinations": ["string"],
    "statement": "string",
    "whyRare": ["string"],
    "evidence": ["string"]
  },
  "compatibility": {
    "excel": [{
      "name": "string",
      "basis": "string",
      "inPractice": "string",
      "bestApplied": "string",
      "contextDependencies": { "assumes": ["string"], "strugglesIf": ["string"] },
      "environmentalFactors": {
        "thrivesWhen": ["string"],
        "strugglesWhen": ["string"],
        "amplifiers": ["string"],
        "suppressors": ["string"]
      }
    }],
    "capable": [{
      "name": "string",
      "basis": "string",
      "inPractice": "string",
      "bestApplied": "string",
      "contextDependencies": { "assumes": ["string"], "strugglesIf": ["string"] },
      "environmentalFactors": {
        "thrivesWhen": ["string"],
        "strugglesWhen": ["string"],
        "amplifiers": ["string"],
        "suppressors": ["string"]
      }
    }],
    "developing": [{
      "name": "string",
      "basis": "string",
      "myApproach": "string",
      "growth": "string",
      "integrationGoal": "string",
      "contextDependencies": { "assumes": ["string"], "strugglesIf": ["string"] },
      "environmentalFactors": {
        "thrivesWhen": ["string"],
        "strugglesWhen": ["string"],
        "amplifiers": ["string"],
        "suppressors": ["string"]
      }
    }],
    "thrivingEnvironments": [{ "title": "string", "why": "string" }],
    "strugglingEnvironments": [{ "title": "string", "why": "string" }],
    "idealHabitat": "string"
  }
}

Return the JSON now.`;
}

function parsePortfolioJSON(responseText: string): ProfessionalDNA {
  const stripCodeFences = (text: string) => {
    let t = text.trim();
    if (t.startsWith('```json')) t = t.slice(7);
    else if (t.startsWith('```')) t = t.slice(3);
    if (t.endsWith('```')) t = t.slice(0, -3);
    return t.trim();
  };

  const cleaned = stripCodeFences(responseText);
  const attempts: string[] = [cleaned];

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    attempts.push(cleaned.slice(firstBrace, lastBrace + 1));
  }

  let lastError: unknown;
  for (const attempt of attempts) {
    try {
      const parsed = JSON.parse(attempt) as ProfessionalDNA;
      if (!parsed?.metadata || !parsed?.genomeOverview || !parsed?.chromosomes) {
        throw new Error('Missing required fields in portfolio JSON.');
      }
      return parsed;
    } catch (error) {
      lastError = error;
    }
  }

  console.error('Failed to parse portfolio JSON:', lastError);
  console.error('Claude response (first 800 chars):', responseText.slice(0, 800));
  throw new Error('Claude returned invalid JSON.');
}
