import questions from '@/data/bigfive-questions.json';

export interface ValidationResult {
  confidence: 'high' | 'medium' | 'low';
  flags: string[];
  warnings: string[];
}

/**
 * Validates Big Five response quality to detect low-engagement patterns
 * and provide confidence scoring for AI-generated insights.
 */
export function validateResponseQuality(
  answers: Record<string, 1 | 2 | 3 | 4 | 5>
): ValidationResult {
  const flags: string[] = [];
  const warnings: string[] = [];

  // Extract answer values
  const values = Object.values(answers);

  if (values.length === 0) {
    return {
      confidence: 'low',
      flags: ['no_responses'],
      warnings: ['No responses provided'],
    };
  }

  // 1. STRAIGHT-LINING DETECTION
  // Check if all answers are the same (or nearly the same)
  const uniqueValues = new Set(values);
  if (uniqueValues.size === 1) {
    flags.push('straight_lining_complete');
    warnings.push('All responses are identical. This may indicate low engagement with the assessment.');
  } else if (uniqueValues.size <= 2 && values.length >= 20) {
    flags.push('straight_lining_partial');
    warnings.push('Very limited response variation detected.');
  }

  // Check variance per dimension
  const dimensions = ['O', 'C', 'E', 'A', 'N'] as const;
  let lowVarianceDimensions = 0;

  for (const dimension of dimensions) {
    const dimensionQuestions = questions.filter((q) => q.dimension === dimension);
    const dimensionAnswers = dimensionQuestions
      .map((q) => answers[q.id])
      .filter((a) => a !== undefined);

    if (dimensionAnswers.length >= 3) {
      const mean = dimensionAnswers.reduce((sum, val) => sum + val, 0) / dimensionAnswers.length;
      const variance =
        dimensionAnswers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        dimensionAnswers.length;

      if (variance < 0.5) {
        lowVarianceDimensions++;
      }
    }
  }

  if (lowVarianceDimensions >= 3) {
    flags.push('low_variance_multiple_dimensions');
    warnings.push('Low response variation across multiple personality dimensions.');
  }

  // 2. ACQUIESCENCE BIAS (tendency to agree/disagree with everything)
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

  if (mean >= 4.5) {
    flags.push('acquiescence_bias_high');
    warnings.push('Strong tendency to agree with all statements. Consider more nuanced responses.');
  } else if (mean <= 1.5) {
    flags.push('acquiescence_bias_low');
    warnings.push('Strong tendency to disagree with all statements. Consider more nuanced responses.');
  }

  // 3. REVERSE-ITEM CONSISTENCY CHECK
  // For each dimension, check if reverse-scored items show expected patterns
  let inconsistentDimensions = 0;

  for (const dimension of dimensions) {
    const normalItems = questions.filter((q) => q.dimension === dimension && !q.reverse);
    const reverseItems = questions.filter((q) => q.dimension === dimension && q.reverse);

    if (normalItems.length > 0 && reverseItems.length > 0) {
      const normalAnswers = normalItems
        .map((q) => answers[q.id])
        .filter((a) => a !== undefined);
      const reverseAnswers = reverseItems
        .map((q) => answers[q.id])
        .filter((a) => a !== undefined);

      if (normalAnswers.length > 0 && reverseAnswers.length > 0) {
        const normalMean = normalAnswers.reduce((sum, val) => sum + val, 0) / normalAnswers.length;
        const reverseMean = reverseAnswers.reduce((sum, val) => sum + val, 0) / reverseAnswers.length;

        // Expected: normal items and reverse items should show opposite patterns
        // If someone scores high on "I am organized" they should score low on "I often leave tasks unfinished"
        // After reverse scoring, they align, but RAW answers should diverge
        // High correlation in raw answers = inconsistency
        const rawCorrelation = Math.abs(normalMean - 3) - Math.abs(reverseMean - 3);

        // If both are on the same side of neutral (both > 3 or both < 3), that's suspicious
        if ((normalMean > 3.5 && reverseMean > 3.5) || (normalMean < 2.5 && reverseMean < 2.5)) {
          inconsistentDimensions++;
        }
      }
    }
  }

  if (inconsistentDimensions >= 2) {
    flags.push('reverse_item_inconsistency');
    warnings.push('Inconsistent responses detected between related questions. Please review your answers carefully.');
  }

  // 4. MIDPOINT CLUSTERING (all answers are 3 = neutral)
  const neutralCount = values.filter((v) => v === 3).length;
  const neutralRatio = neutralCount / values.length;

  if (neutralRatio >= 0.7) {
    flags.push('midpoint_clustering');
    warnings.push('Most responses are neutral. Consider taking a clearer stance on questions.');
  }

  // 5. DETERMINE CONFIDENCE LEVEL
  let confidence: 'high' | 'medium' | 'low' = 'high';

  // Critical flags → low confidence
  if (
    flags.includes('straight_lining_complete') ||
    flags.includes('no_responses') ||
    (flags.includes('acquiescence_bias_high') && flags.includes('midpoint_clustering'))
  ) {
    confidence = 'low';
  }
  // Multiple warning flags → medium confidence
  else if (flags.length >= 2) {
    confidence = 'medium';
  }
  // Single minor flag → still high confidence
  else if (flags.length === 1) {
    // Some flags are more serious than others
    if (
      flags.includes('straight_lining_partial') ||
      flags.includes('low_variance_multiple_dimensions')
    ) {
      confidence = 'medium';
    }
  }

  return {
    confidence,
    flags,
    warnings,
  };
}

/**
 * Get a human-readable explanation of the confidence level
 */
export function getConfidenceExplanation(confidence: 'high' | 'medium' | 'low'): string {
  switch (confidence) {
    case 'high':
      return 'Response patterns show good variation and consistency. Results are reliable.';
    case 'medium':
      return 'Some response patterns detected that may affect accuracy. Results are generally reliable but interpret with care.';
    case 'low':
      return 'Response patterns suggest low engagement or inconsistency. Results may not accurately reflect personality. Consider retaking the assessment.';
  }
}
