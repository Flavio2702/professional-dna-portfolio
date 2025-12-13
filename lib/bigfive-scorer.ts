import { BigFiveScores } from '@/types/portfolio';
import questions from '@/data/bigfive-questions.json';

export function calculateBigFiveScores(
  answers: Record<string, 1 | 2 | 3 | 4 | 5>
): BigFiveScores {
  const dimensions = ['O', 'C', 'E', 'A', 'N'] as const;
  const scores: Partial<BigFiveScores> = {};

  for (const dimension of dimensions) {
    // Filter questions for this dimension
    const dimensionQuestions = questions.filter((q) => q.dimension === dimension);

    // Calculate raw score
    let rawScore = 0;
    for (const question of dimensionQuestions) {
      const answer = answers[question.id];
      if (answer) {
        // If reverse-scored, invert the answer (6 - answer)
        const score = question.reverse ? 6 - answer : answer;
        rawScore += score;
      }
    }

    // Normalize to 0-100 scale
    // Min possible: 5 questions x 1 = 5
    // Max possible: 5 questions x 5 = 25
    // Range: 20
    const normalizedScore = ((rawScore - 5) / 20) * 100;
    scores[dimension] = Math.round(normalizedScore);
  }

  return scores as BigFiveScores;
}

export function getTraitLevel(score: number): {
  emoji: string;
  label: 'Dominant' | 'Active' | 'Developing';
  description: string;
} {
  if (score >= 70) {
    return {
      emoji: 'fire',
      label: 'Dominant',
      description: 'naturally excel',
    };
  } else if (score >= 40) {
    return {
      emoji: 'zap',
      label: 'Active',
      description: 'capable',
    };
  } else {
    return {
      emoji: 'bulb',
      label: 'Developing',
      description: 'growing',
    };
  }
}
