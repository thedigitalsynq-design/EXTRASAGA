import { NormalizedReport } from "@/types/boxOffice";

/**
 * Statistical Outlier Detection Engine.
 * Filters out abnormal figures (such as exaggerated producer PR claims
 * or erroneous early estimates) before weighted consolidation.
 */
export function detectAndFlagOutliers(reports: NormalizedReport[]): NormalizedReport[] {
  if (!reports || reports.length < 3) {
    // Insufficient sample size for robust IQR, return as is
    return reports.map((r) => ({ ...r, isOutlier: false }));
  }

  // Sort reports by grossInCrores
  const values = reports.map((r) => r.grossInCrores).sort((a, b) => a - b);
  const n = values.length;

  const median = getMedian(values);

  let q1: number;
  let q3: number;

  if (n >= 4) {
    const mid = Math.floor(n / 2);
    const lowerHalf = values.slice(0, mid);
    const upperHalf = n % 2 === 0 ? values.slice(mid) : values.slice(mid + 1);
    q1 = getMedian(lowerHalf);
    q3 = getMedian(upperHalf);
  } else {
    // 3 elements: Q1 is min, Q3 is max
    q1 = values[0];
    q3 = values[2];
  }

  const iqr = q3 - q1;
  // If IQR is very small (all sources tightly agree), use a percentage-based threshold from median
  const dynamicTolerance = Math.max(iqr * 1.5, median * 0.25);
  const lowerBound = Math.max(0, median - dynamicTolerance);
  const upperBound = median + dynamicTolerance;

  return reports.map((report) => {
    const val = report.grossInCrores;
    const isOutlier = val < lowerBound || val > upperBound;

    return {
      ...report,
      isOutlier,
      // If it's an outlier, severely down-weight its influence (by 85%) instead of dropping completely
      weight: isOutlier ? Number((report.weight * 0.15).toFixed(3)) : report.weight,
    };
  });
}

function getMedian(sortedArr: number[]): number {
  const len = sortedArr.length;
  if (len === 0) return 0;
  const mid = Math.floor(len / 2);
  if (len % 2 !== 0) {
    return sortedArr[mid];
  }
  return (sortedArr[mid - 1] + sortedArr[mid]) / 2;
}

/**
 * Calculates variance and standard deviation of reports to measure source agreement.
 * Returns dispersion ratio (standard deviation / median).
 */
export function calculateSourceDispersion(reports: NormalizedReport[]): number {
  if (reports.length <= 1) return 0;

  const valid = reports.filter((r) => !r.isOutlier);
  const grossValues = valid.map((r) => r.grossInCrores);
  const mean = grossValues.reduce((sum, v) => sum + v, 0) / grossValues.length;
  const variance =
    grossValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / grossValues.length;
  const stdDev = Math.sqrt(variance);

  if (mean === 0) return 0;
  return Number((stdDev / mean).toFixed(3));
}

