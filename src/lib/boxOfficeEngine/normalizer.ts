import { RawProviderReport, NormalizedReport, CurrencyCode } from "@/types/boxOffice";

// Standard foreign exchange rates to INR
const FX_RATES: Record<CurrencyCode, number> = {
  INR: 1.0,
  USD: 84.0, // 1 USD = ₹84.0 INR
  AED: 22.8, // 1 AED = ₹22.8 INR
  GBP: 107.5, // 1 GBP = ₹107.5 INR
};

/**
 * Normalizes any currency and unit representation into standard INR Crores (₹ Cr).
 * 1 Crore = 10,000,000 INR = 100 Lakhs.
 */
export function convertToINRCrores(
  amount: number,
  unit: "crores" | "lakhs" | "millions" | "exact",
  currency: CurrencyCode = "INR"
): number {
  if (!amount || isNaN(amount) || amount <= 0) return 0;

  const fxRate = FX_RATES[currency] || 1.0;
  let inrTotal = 0;

  switch (unit) {
    case "crores":
      // If already in Crores, just apply FX rate if non-INR
      return Number((amount * fxRate).toFixed(2));
    case "lakhs":
      // 100 Lakhs = 1 Crore
      inrTotal = (amount * 100_000) * fxRate;
      break;
    case "millions":
      // 1 Million = 10 Lakhs = 0.1 Crore
      inrTotal = (amount * 1_000_000) * fxRate;
      break;
    case "exact":
      inrTotal = amount * fxRate;
      break;
  }

  const crores = inrTotal / 10_000_000;
  return Number(crores.toFixed(2));
}

/**
 * Calculates Net from Gross assuming standard Indian entertainment tax / GST rates.
 * Cinema tickets > ₹100 have 18% GST (Net = Gross / 1.18).
 */
export function deriveNetFromGross(grossInCrores: number): number {
  if (grossInCrores <= 0) return 0;
  // Standard statutory deduction: ~18% GST on average
  const net = grossInCrores / 1.18;
  return Number(net.toFixed(2));
}

/**
 * Calculates Distributor Share from Net Collection.
 * In Indian theatrical distribution, distributor share ranges between 45% and 52% of Net.
 */
export function deriveDistributorShare(netInCrores: number, territory = "domestic"): number {
  if (netInCrores <= 0) return 0;
  // Domestic distributor share: 48.5% average; Overseas: ~42%
  const shareRatio = territory === "overseas" ? 0.42 : 0.485;
  const share = netInCrores * shareRatio;
  return Number(share.toFixed(2));
}

/**
 * Calculates freshness multiplier based on time elapsed since report.
 * Reports within 2 hours retain full 1.0 weight; gradually decays over 48h.
 * Final audited statements do not decay.
 */
export function calculateFreshnessMultiplier(reportedAt: string, isAudited = false): number {
  if (isAudited) return 1.0; // Audited figures remain authoritative

  const reportTime = new Date(reportedAt).getTime();
  const now = Date.now();
  const hoursElapsed = Math.max(0, (now - reportTime) / (1000 * 60 * 60));

  if (hoursElapsed <= 2) return 1.0;
  // Exponential half-life decay of 36 hours
  const decay = Math.exp(-hoursElapsed / 36);
  return Math.max(0.35, Number(decay.toFixed(3)));
}

/**
 * Normalizes a raw provider ingest report into standard INR Crores format.
 */
export function normalizeRawReport(raw: RawProviderReport): NormalizedReport {
  const grossInCrores = convertToINRCrores(
    raw.figures.rawGross,
    raw.figures.unit,
    raw.currency
  );

  const netInCrores =
    raw.figures.rawNet !== undefined
      ? convertToINRCrores(raw.figures.rawNet, raw.figures.unit, raw.currency)
      : deriveNetFromGross(grossInCrores);

  const distributorShareInCrores =
    raw.figures.rawDistributorShare !== undefined
      ? convertToINRCrores(raw.figures.rawDistributorShare, raw.figures.unit, raw.currency)
      : deriveDistributorShare(netInCrores);

  const overseasGrossInCrores =
    raw.figures.rawOverseasGross !== undefined
      ? convertToINRCrores(raw.figures.rawOverseasGross, raw.figures.unit, raw.currency)
      : 0;

  const freshnessMultiplier = calculateFreshnessMultiplier(
    raw.reportedAt,
    raw.isAuditedStatement
  );

  // Classification based on provider category
  const sourceClassification =
    raw.providerType === "exhibitor_telemetry"
      ? "measured"
      : raw.providerType === "distributor_statement" || raw.isAuditedStatement
      ? "reported"
      : "estimated";

  return {
    reportId: raw.id,
    movieId: raw.movieId,
    reportDate: raw.reportDate,
    grossInCrores,
    netInCrores,
    distributorShareInCrores,
    overseasGrossInCrores,
    theatreShows: raw.theatreTelemetry?.trackedShows,
    occupancyPercent: raw.theatreTelemetry?.trackedOccupancyPercent,
    weight: raw.reliabilityScore,
    freshnessMultiplier,
    isOutlier: false,
    sourceClassification,
  };
}

