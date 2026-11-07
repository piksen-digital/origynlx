import type { BOMLineItem, RVCInput, RVCResult } from "./rvc-calculator";

/**
 * Origin engineering - the "what would make this qualify?" view.
 *
 * Pure arithmetic over the BOM the user already entered: which single
 * non-originating component, if swapped for a USMCA-originating source,
 * closes the RVC gap, ranked cheapest first; how many dollars of extra
 * originating content the gap needs; and for qualifying goods, how much
 * non-originating content could be absorbed before failing (stress test).
 *
 * This is decision support, not a determination: the replacement input
 * must itself qualify as originating, and swaps can change the tariff-shift
 * side of the rule independently of RVC.
 */

export interface SwapCandidate {
  id: string;
  description: string;
  value: number;
  newRvcPercent: number;
  rvcGainPercent: number;
  closesGap: boolean;
}

export interface OriginEngineeringResult {
  mode: "fix-it" | "stress-test";
  qualifiesNow: boolean;
  basis: "transaction-value" | "net-cost";
  denominator: number;
  dollarGap: number | null;
  headroomValue: number | null;
  swapCandidates: SwapCandidate[];
  cheapestQualifyingSwaps: SwapCandidate[];
  notes: string[];
}

export function analyzeOriginEngineering(
  input: RVCInput,
  result: RVCResult
): OriginEngineeringResult {
  const denominator =
    result.basis === "net-cost" && result.netCost !== null
      ? result.netCost
      : result.transactionValue;
  const threshold = result.thresholdPercent;
  const notes: string[] = [];

  const nonOriginating = input.lineItems.filter(
    (it: BOMLineItem) => !it.originating && it.value > 0
  );

  const candidates: SwapCandidate[] = nonOriginating.map((it: BOMLineItem) => {
    const newVnm = result.nonOriginatingValue - it.value;
    const newRvc = denominator > 0 ? ((denominator - newVnm) / denominator) * 100 : 0;
    return {
      id: it.id,
      description: it.description || "Unnamed component",
      value: it.value,
      newRvcPercent: round2(newRvc),
      rvcGainPercent: round2(newRvc - result.rvcPercent),
      closesGap: newRvc >= threshold,
    };
  });

  const cheapestQualifyingSwaps = candidates
    .filter((c: SwapCandidate) => c.closesGap)
    .sort((a: SwapCandidate, b: SwapCandidate) => a.value - b.value);

  if (result.qualifies) {
    const maxVnm = denominator * (1 - threshold / 100);
    const headroom = Math.max(0, maxVnm - result.nonOriginatingValue);
    notes.push(
      "This good already qualifies. The headroom is how much more non-originating content it could absorb before falling below the threshold, holding the denominator constant."
    );
    notes.push(
      "Headroom assumes transaction value (or net cost) does not change when sourcing changes - if a swap changes the denominator, re-run the full calculation."
    );
    return {
      mode: "stress-test",
      qualifiesNow: true,
      basis: result.basis,
      denominator,
      dollarGap: null,
      headroomValue: round2(headroom),
      swapCandidates: candidates.sort(
        (a: SwapCandidate, b: SwapCandidate) => b.rvcGainPercent - a.rvcGainPercent
      ),
      cheapestQualifyingSwaps,
      notes,
    };
  }

  const requiredOriginating = denominator * (threshold / 100);
  const dollarGap = round2(
    Math.max(0, requiredOriginating - (denominator - result.nonOriginatingValue))
  );

  notes.push(
    "Swap suggestions are arithmetic what-ifs: replacing a non-originating input with one that is itself USMCA-originating. The replacement input must actually qualify as originating - imported parts from Canada or Mexico do not qualify automatically."
  );
  notes.push(
    "A swap can also change whether the tariff-shift test is satisfied - re-check the tariff-shift side separately."
  );
  notes.push(
    "If the only failing part is a tariff shift on a small input, the Article 4.12 de minimis allowance (10%) may rescue the qualification without any sourcing change."
  );
  if (cheapestQualifyingSwaps.length === 0) {
    notes.push(
      "No single component swap closes the gap - it will take a combination. The dollar gap below is the total originating value to add."
    );
  }

  return {
    mode: "fix-it",
    qualifiesNow: false,
    basis: result.basis,
    denominator,
    dollarGap,
    headroomValue: null,
    swapCandidates: candidates.sort(
      (a: SwapCandidate, b: SwapCandidate) => b.rvcGainPercent - a.rvcGainPercent
    ),
    cheapestQualifyingSwaps,
    notes,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
