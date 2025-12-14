import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { generatePortfolio } from '@/lib/claude';
import { calculateBigFiveScores } from '@/lib/bigfive-scorer';
import { validateResponseQuality } from '@/lib/bigfive-validator';
import { FormData } from '@/types/portfolio';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // Parse request body
    const formData: FormData = await request.json();

    // Validate required fields
    if (!formData.cv || !formData.philosophy || !formData.bigFive) {
      return NextResponse.json(
        { error: 'Missing required form data' },
        { status: 400 }
      );
    }

    // Calculate Big Five personality scores
    const bigFiveScores = calculateBigFiveScores(formData.bigFive);

    // Validate response quality and get confidence score
    const validation = validateResponseQuality(formData.bigFive);

    console.log('Generating portfolio with Big Five scores:', bigFiveScores);
    console.log('Assessment confidence:', validation.confidence);
    if (validation.warnings.length > 0) {
      console.log('Validation warnings:', validation.warnings);
    }

    // Generate portfolio using Claude AI (pass confidence for prompt adjustment)
    const portfolioData = await generatePortfolio(formData, bigFiveScores, validation.confidence);

    // Add assessment confidence to metadata
    portfolioData.metadata.assessmentConfidence = validation.confidence;

    // Generate unique ID for this portfolio
    const id = nanoid(10);

    console.log(`Portfolio generated successfully with ID: ${id}`);

    // Return the generated portfolio with ID
    return NextResponse.json({
      id,
      data: portfolioData,
    });
  } catch (error) {
    console.error('Error generating portfolio:', error);

    const message = error instanceof Error ? error.message : 'Unknown error';
    const status =
      /Missing ANTHROPIC_API_KEY/i.test(message) ? 500 :
      /credits are exhausted/i.test(message) ? 402 :
      /invalid json/i.test(message) ? 502 :
      500;

    return NextResponse.json(
      { error: 'Failed to generate portfolio', message },
      { status }
    );
  }
}
