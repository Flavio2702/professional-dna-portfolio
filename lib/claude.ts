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

function isLikelyModelError(error: unknown): boolean {
  const status = (error as any)?.status ?? (error as any)?.statusCode;
  const message = String((error as any)?.message ?? error);
  return (
    status === 404 ||
    status === 400 ||
    (/model/i.test(message) && /not found|unknown|invalid/i.test(message))
  );
}

function isInsufficientCreditError(error: unknown): boolean {
  const message = String((error as any)?.message ?? error).toLowerCase();
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
        max_tokens: 4096,
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
**Excel**: Environments where trait combination is an advantage
- Specify context dependencies: "Assumes X, struggles if Y"
- Identify amplifiers: "Thrives when..."

**Capable**: Trait-neutral or manageable challenge contexts
- Explain energy cost: "Can do X but requires Y to sustain"
- Clarify boundaries: "Effective when Z is limited"

**Developing**: Trait creates friction or requires active management
- Frame as integration, not opposition: "Learning to apply High C selectively, not universally"
- Evidence of growth: Behavior changes while maintaining core trait

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
    "lastUpdated": "ISO date string"
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
    "excel": [{ "name": "string", "basis": "string", "inPractice": "string", "bestApplied": "string" }],
    "capable": [{ "name": "string", "basis": "string", "inPractice": "string", "bestApplied": "string" }],
    "developing": [{ "name": "string", "basis": "string", "myApproach": "string", "growth": "string" }],
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
