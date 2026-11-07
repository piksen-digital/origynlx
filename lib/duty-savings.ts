import type { RVCResult } from "./rvc-calculator";

/**
 * Duty-savings estimator - the "what is this worth?" view.
 *
 * USMCA qualification converts into money three ways for a US importer:
 *   1. MFN duty: qualifying goods enter duty-free instead of the General
 *      rate for the 10-digit HTSUS tariff item.
 *   2. Surcharge layers: every universal surcharge regime of 2025-2026
 *      (the IEEPA border tariffs, then the Section 122 10% surcharge of
 *      Feb 24 - Jul 24, 2026) explicitly exempted USMCA-originating goods.
 *   3. Merchandise Processing Fee: US entries of USMCA-originating goods
 *      from Canada or Mexico are MPF-exempt (19 U.S.C. 58c; 19 CFR 24.23).
 *
 * The user supplies their own tariff rate and volume; this module never
 * guesses a duty rate. FY 2026 MPF figures per CBP COBRA/FAST Act annual
 * adjustment (effective Oct 1, 2025): 0.3464%, min $33.58, max $651.50.
 */

export const MPF_RATE_PERCENT = 0.3464;
export const MPF_MIN_PER_ENTRY = 33.58;
export const MPF_MAX_PER_ENTRY = 651.5;

export interface DutySavingsInput {
  annualImportValue: number;
  mfnDutyRatePercent: number;
  surchargeRatePercent: number;
  entriesPerYear: number;
  importingParty: string;
  exportCountry: string;
  qualifies: boolean;
}

export interface DutySavingsResult {
  applies: boolean;
  annualDutyAvoided: number;
  annualSurchargeAvoided: number;
  annualMpfAvoided: number;
  totalAnnualAvoided: number;
  mpfPerEntry: number;
  mpfRatePercent: number;
  mpfMinPerEntry: number;
  mpfMaxPerEntry: number;
  mpfApplies: boolean;
  notes: string[];
  warnings: string[];
}

export function calculateDutySavings(input: DutySavingsInput): DutySavingsResult {
  const notes: string[] = [];
  const warnings: string[] = [];

  const annual = Math.max(0, input.annualImportValue || 0);
  const mfn = Math.max(0, input.mfnDutyRatePercent || 0);
  const surcharge = Math.max(0, input.surchargeRatePercent || 0);
  const entries = Math.max(1, Math.round(input.entriesPerYear || 1));
  const mpfApplies = input.importingParty === "United States";

  const mpfPerEntry = Math.min(
    MPF_MAX_PER_ENTRY,
    Math.max(MPF_MIN_PER_ENTRY, ((annual / entries) * MPF_RATE_PERCENT) / 100)
  );

  if (!input.qualifies) {
    warnings.push(
      "This good did not meet the threshold in the calculation above - savings only apply once it qualifies as USMCA-originating and a valid certification of origin accompanies the entry."
    );
  }

  const dutyAvoided = (annual * mfn) / 100;
  const surchargeAvoided = (annual * surcharge) / 100;
  const mpfAvoided = mpfApplies && input.qualifies ? mpfPerEntry * entries : 0;
  const total = dutyAvoided + surchargeAvoided + mpfAvoided;

  notes.push(
    "MFN duty: enter the General (column 1) rate from the HTSUS for your 10-digit tariff item. USMCA-qualifying goods enter duty-free instead."
  );
  notes.push(
    "Surcharge layer: enter any universal import surcharge currently in force, 0 if none. For reference, the Section 122 10% surcharge (Feb 24 - Jul 24, 2026) explicitly exempted USMCA-qualifying goods and expired July 24, 2026 by operation of law."
  );
  if (mpfApplies) {
    notes.push(
      "Merchandise Processing Fee: US entries pay 0.3464% ad valorem with a minimum of $33.58 and a maximum of $651.50 per entry (FY 2026 figures). USMCA-originating goods from Canada or Mexico are exempt from MPF."
    );
  } else {
    notes.push(
      "The Merchandise Processing Fee is shown as zero because the importing party is not the United States. Canada and Mexico apply their own import processing fees, which this estimate does not model."
    );
  }
  notes.push(
    "USMCA preference does NOT waive Section 232 steel/aluminum duties, Section 301 China-action duties, or antidumping/countervailing duties - those still apply to USMCA-originating goods."
  );
  notes.push(
    "Estimate only. Actual landed cost depends on your entered rate, valuation basis and current trade actions - confirm with your customs broker before relying on these figures."
  );

  return {
    applies: input.qualifies,
    annualDutyAvoided: round2(dutyAvoided),
    annualSurchargeAvoided: round2(surchargeAvoided),
    annualMpfAvoided: round2(mpfAvoided),
    totalAnnualAvoided: round2(total),
    mpfPerEntry: round2(mpfPerEntry),
    mpfRatePercent: MPF_RATE_PERCENT,
    mpfMinPerEntry: MPF_MIN_PER_ENTRY,
    mpfMaxPerEntry: MPF_MAX_PER_ENTRY,
    mpfApplies,
    notes,
    warnings,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
