export function calculateGreenScore(
  improvementPercentage,
  tokensSaved
) {
  const improvementScore =
    Math.min(improvementPercentage, 50) * 1.4;

  const tokenImpactScore =
    Math.min(tokensSaved / 100, 30);

  const score = Math.round(
    improvementScore + tokenImpactScore
  );

  return Math.min(score, 100);
}