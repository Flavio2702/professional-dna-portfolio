import Anthropic from '@anthropic-ai/sdk';
import { ProfessionalDNA, FormData, BigFiveScores } from '@/types/portfolio';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generatePortfolio(
  formData: FormData,
  bigFiveScores: BigFiveScores
): Promise<ProfessionalDNA> {
  const prompt = buildPrompt(formData, bigFiveScores);

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract text from response
    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    if (!responseText) {
      throw new Error('No response from Claude');
    }

    // Parse JSON from response
    const portfolio = parsePortfolioJSON(responseText);
    return portfolio;
  } catch (error) {
    console.error('Error generating portfolio:', error);
    throw new Error(`Failed to generate portfolio: ${error}`);
  }
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
**Problem-Solving Approach:** ${philosophy.problemSolving}

**Significant Failure:** ${philosophy.failure}

**What I Love:** ${philosophy.love}

**What I Struggle With:** ${philosophy.hate}

**Ideal Work Style:** ${philosophy.workStyle}

## Big Five Personality Scores (0-100 scale)
- Openness: ${bigFiveScores.O}
- Conscientiousness: ${bigFiveScores.C}
- Extraversion: ${bigFiveScores.E}
- Agreeableness: ${bigFiveScores.A}
- Neuroticism: ${bigFiveScores.N}

# YOUR TASK

Generate a complete Professional DNA Portfolio in JSON format. This is an ANTI-PORTFOLIO - radical honesty over self-promotion.

# CRITICAL RULES

1. **NO NUMBERS in prose** - Never write "improved by 40%" or "led team of 5". Use qualitative descriptions.
2. **First person voice** - "I solve problems by..." not "They solve problems by..."
3. **Evidence-based** - Every trait needs concrete evidence from the input data
4. **Radical honesty** - Include weaknesses, struggles, and developing areas
5. **Map Big Five to behaviors:**
   - Score >=70: Dominant trait (naturally excel) - use fire emoji
   - Score 40-69: Active trait (capable) - use lightning emoji
   - Score <40: Developing trait (growing) - use lightbulb emoji

6. **DNA Metaphor throughout** - Use genetic/biological language creatively

# JSON STRUCTURE

Generate a valid JSON object with this exact structure:

{
  "metadata": {
    "name": "string (extract from CV)",
    "title": "string (current role)",
    "sequencedFrom": {
      "projects": number,
      "skills": number,
      "experiences": number
    },
    "rarityScore": number (1-100, how unique this combo is),
    "lastUpdated": "ISO date string"
  },
  "genomeOverview": {
    "tagline": "One punchy sentence capturing their essence",
    "dominantTraits": ["trait1", "trait2", "trait3"],
    "dnaSequence": "Creative code like 'ATCG-PROB-SOLV-EMPTH-LEARN'"
  },
  "chromosomes": [
    {
      "id": "technical-dna",
      "name": "Technical DNA",
      "genes": [
        {
          "name": "Gene name (e.g., 'Systems Thinking')",
          "dominance": "🔥 Dominant" | "⚡ Active" | "💡 Developing",
          "basis": "Which Big Five trait or evidence this comes from",
          "expression": "First person: how this shows up in their work",
          "evidence": ["specific example from CV/projects", "another example"]
        }
      ]
    },
    {
      "id": "behavioral-dna",
      "name": "Behavioral DNA",
      "genes": [
        // Map Big Five scores to behavioral genes
        // High O -> "Intellectual Curiosity", "Creative Problem-Solving"
        // High C -> "Systematic Execution", "Detail Orientation"
        // High E -> "Collaborative Energy", "External Processing"
        // High A -> "Empathetic Design", "Consensus Building"
        // Low N -> "Stress Resilience", "Emotional Stability"
      ]
    }
  ],
  "mutations": [
    {
      "year": number,
      "title": "Pivot point title",
      "description": "What happened",
      "mutation": "What changed in their DNA",
      "newTrait": "New capability unlocked",
      "evidence": ["proof from their story"]
    }
    // Include 2-3 major career pivot points
  ],
  "projects": [
    {
      "geneId": "which gene this proves",
      "title": "Project name",
      "context": "The problem/situation",
      "approach": ["step 1", "step 2", "step 3"],
      "outcome": {
        "metric": "Qualitative outcome (no numbers!)",
        "secondary": "Additional impact"
      },
      "proof": {
        "liveLink": "URL if provided",
        "testimonial": {
          "quote": "Extract if available",
          "author": "Person name"
        }
      },
      "insight": "What this reveals about how they work"
    }
    // Extract 3-4 best projects from case studies
  ],
  "uniqueSequence": {
    "combinations": [
      "Rare combo 1: X + Y",
      "Rare combo 2: A + B"
    ],
    "statement": "Why this combination is powerful/unique",
    "whyRare": ["reason 1", "reason 2"],
    "evidence": ["proof from their work"]
  },
  "compatibility": {
    "excel": [
      {
        "name": "Environment/role type",
        "basis": "Which dominant gene drives this",
        "inPractice": "How this shows up",
        "bestApplied": "Ideal context"
      }
    ],
    "capable": [
      {
        "name": "Environment/role type",
        "basis": "Which active gene supports this",
        "inPractice": "How this shows up",
        "bestApplied": "When to use this"
      }
    ],
    "developing": [
      {
        "name": "Area of growth",
        "basis": "What's being developed",
        "myApproach": "How they're working on it",
        "growth": "Progress so far"
      }
    ],
    "thrivingEnvironments": [
      {
        "title": "Environment type",
        "why": "Why this energizes them (cite philosophy input)"
      }
    ],
    "strugglingEnvironments": [
      {
        "title": "Environment type",
        "why": "Why this drains them (cite 'hate' input)"
      }
    ],
    "idealHabitat": "One paragraph describing their perfect work environment"
  }
}

# IMPORTANT
- Return ONLY valid JSON, no markdown formatting, no explanation text
- Use exact field names as specified
- Ensure all arrays have at least 1 item
- Be specific and evidence-based
- Remember: radical honesty, first person, no numbers in prose

Generate the complete JSON now:`;
}

function parsePortfolioJSON(responseText: string): ProfessionalDNA {
  try {
    // Remove markdown code blocks if present
    let jsonText = responseText.trim();

    // Remove ```json and ``` if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.slice(7);
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.slice(3);
    }

    if (jsonText.endsWith('```')) {
      jsonText = jsonText.slice(0, -3);
    }

    jsonText = jsonText.trim();

    // Parse JSON
    const portfolio = JSON.parse(jsonText) as ProfessionalDNA;

    // Validate required fields
    if (!portfolio.metadata || !portfolio.genomeOverview || !portfolio.chromosomes) {
      throw new Error('Missing required fields in portfolio JSON');
    }

    return portfolio;
  } catch (error) {
    console.error('Failed to parse portfolio JSON:', error);
    console.error('Response text:', responseText);
    throw new Error(`Invalid JSON response from Claude: ${error}`);
  }
}
