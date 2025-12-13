import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { generatePortfolio } from '@/lib/claude';
import { calculateBigFiveScores } from '@/lib/bigfive-scorer';
import { FormData } from '@/types/portfolio';

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

    console.log('Generating portfolio with Big Five scores:', bigFiveScores);

    // Generate portfolio using Claude AI
    const portfolioData = await generatePortfolio(formData, bigFiveScores);

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

    // Return error response
    return NextResponse.json(
      {
        error: 'Failed to generate portfolio',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
