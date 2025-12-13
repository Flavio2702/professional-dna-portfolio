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
  bigFiveScores: BigFiveScores
): Promise<ProfessionalDNA> {
  const prompt = buildPrompt(formData, bigFiveScores);
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

function buildPrompt(formData: FormData, bigFiveScores: BigFiveScores): string {
  const { cv, projects, philosophy } = formData;

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
Neuroticism: ${bigFiveScores.N}

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
