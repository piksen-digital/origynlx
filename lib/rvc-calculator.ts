/**
 * Regional Value Content calculator - Transaction Value and Net Cost methods.
 *
 * Transaction Value method: RVC = (Transaction Value - Value of
 * Non-Originating Materials) / Transaction Value x 100, where TV is the
 * transaction value of the good adjusted to exclude costs incurred in its
 * international shipment (USMCA Article 4.5(1)).
 *
 * Net Cost method: RVC = (Net Cost - VNM) / Net Cost x 100, where NC is
 * the net cost of the good - total cost less sales promotion, marketing
 * and after-sales service costs, royalties, shipping and packing costs,
 * and non-allowable interest costs (USMCA Article 4.5(2); non-allowable
 * interest is interest more than 700 basis points above the applicable
 * federal government rate). Cost allocation and fiscal-year averaging
 * under the Uniform Regulations are outside this tool's scope - the
 * producer supplies a net cost already allocated to the single good.
 *
 * Net cost is MANDATORY for finished motor vehicles under the USMCA
 * automotive appendix: vehicle-level rules carry no transaction-value
 * alternative (SOR/2020-155 s.13). Tariff-shift qualification depends on
 * the specific HS classification of every input and is flagged for manual
 * review rather than guessed at - that determination belongs to a
 * licensed customs broker.
 */

export interface BOMLineItem {
  id: string;
  description: string;
  hsCode: string;
  countryOfOrigin: string;
  value: number;
  originating: boolean;
  /** Optional USMCA-specific metadata. Existing saved BOMs remain compatible. */
  tariffItem?: string;
  originStatus?: "originating" | "non-originating" | "undetermined";
}

export interface RVCInput {
  productName: string;
  transactionValue: number;
  /**
   * Net cost of the good (total cost less the Article 4.5(2) excluded
   * costs). Required for a valid net-cost method calculation; without a
   * positive net cost the tool falls back to transaction value and warns.
   */
  netCost?: number;
  method: "transaction-value" | "net-cost";
  thresholdPercent: number; // default 60 for TV method, 50 for net cost, 75 for automotive vehicles (net cost only)
  lineItems: BOMLineItem[];
}

export interface RVCResult {
  transactionValue: number;
  netCost: number | null;
  /** Formula actually used for the percentage. "net-cost" only when a
   * positive net cost was supplied with the net-cost method selected. */
  basis: "transaction-value" | "net-cost";
  originatingValue: number;
  nonOriginatingValue: number;
  rvcPercent: number;
  thresholdPercent: number;
  qualifies: boolean;
  marginPercent: number; // how far above/below the threshold
  warnings: string[];
}

export function calculateRVC(input: RVCInput): RVCResult {
  const warnings: string[] = [];

  const lineItemTotal = input.lineItems.reduce((sum, item) => sum + item.value, 0);
  const nonOriginatingValue = input.lineItems
    .filter((item) => !item.originating)
    .reduce((sum, item) => sum + item.value, 0);
  const originatingValue = lineItemTotal - nonOriginatingValue;

  const usingNetCost =
    input.method === "net-cost" && typeof input.netCost === "number" && input.netCost > 0;

  if (input.method === "net-cost" && !usingNetCost) {
    warnings.push(
      "Net cost method selected but no net cost was provided - this result is computed on transaction value and is NOT a valid net-cost calculation (USMCA Article 4.5(2): net cost = total cost less sales promotion, marketing and after-sales service costs, royalties, shipping and packing costs, and non-allowable interest costs)."
    );
  }

  if (usingNetCost && input.transactionValue > 0 && input.netCost! > input.transactionValue) {
    warnings.push(
      "Net cost is higher than the transaction value - net cost excludes profit, so it usually sits below the sale price. Double-check which figure was entered where."
    );
  }

  if (!usingNetCost) {
    if (input.transactionValue <= 0) {
      warnings.push("Transaction value must be greater than zero.");
    }

    if (Math.abs(lineItemTotal - input.transactionValue) / (input.transactionValue || 1) > 0.02) {
      warnings.push(
        "Line item values differ from transaction value by more than 2% - double check your BOM totals before relying on this result."
      );
    }
  }

  const denominator = usingNetCost ? input.netCost! : input.transactionValue;
  const rvcPercent =
    denominator > 0 ? ((denominator - nonOriginatingValue) / denominator) * 100 : 0;

  const qualifies = rvcPercent >= input.thresholdPercent;
  const marginPercent = rvcPercent - input.thresholdPercent;

  if (Math.abs(marginPercent) < 3) {
    warnings.push(
      "This result is within 3 percentage points of the threshold - a small sourcing change could flip the outcome. Consider a wider margin before certifying."
    );
  }

  const missingHsCodes = input.lineItems.filter((item) => !item.hsCode.trim());
  if (missingHsCodes.length > 0) {
    warnings.push(
      `${missingHsCodes.length} line item(s) are missing an HS code - required for the certificate and for any tariff-shift determination.`
    );
  }

  return {
    transactionValue: input.transactionValue,
    netCost: usingNetCost ? input.netCost! : null,
    basis: usingNetCost ? "net-cost" : "transaction-value",
    originatingValue,
    nonOriginatingValue,
    rvcPercent: round2(rvcPercent),
    thresholdPercent: input.thresholdPercent,
    qualifies,
    marginPercent: round2(marginPercent),
    warnings,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function emptyLineItem(id: string): BOMLineItem {
  return {
    id,
    description: "",
    hsCode: "",
    countryOfOrigin: "US",
    value: 0,
    originating: true,
    tariffItem: "",
    originStatus: "originating",
  };
}

export const DEFAULT_THRESHOLDS: Record<RVCInput["method"], number> = {
  "transaction-value": 60,
  "net-cost": 50,
};

/**
 * De minimis check (USMCA Article 4.12).
 *
 * This is NOT an alternative RVC threshold. De minimis is a separate
 * allowance that applies when a good fails a required tariff-shift test:
 * if the non-originating materials that caused the failure are worth no
 * more than 10% of the good's transaction value (adjusted to exclude
 * international shipment costs) - or 10% of the good's total cost, where
 * the net cost method applies to the good - the good can still be
 * treated as originating for tariff-shift purposes. Those materials
 * still count as non-originating in the RVC calculation above - de
 * minimis does not change that number. Because this tool cannot know
 * which individual materials fail the tariff-shift test, it measures
 * ALL non-originating materials against the 10% limit: a conservative
 * upper bound (if all non-originating material is within 10%, de minimis
 * is certainly available; if not, some inputs may still qualify).
 * Treat this as a supporting reference check, not a determination.
 */
export interface DeMinimisResult {
  nonOriginatingValue: number;
  transactionValue: number;
  nonOriginatingPercent: number;
  withinDeMinimis: boolean;
  thresholdPercent: number;
  notes: string[];
}

export function checkDeMinimis(input: {
  transactionValue: number;
  lineItems: BOMLineItem[];
}): DeMinimisResult {
  const nonOriginatingValue = input.lineItems
    .filter((item) => !item.originating)
    .reduce((sum, item) => sum + item.value, 0);

  const thresholdPercent = 10;
  const nonOriginatingPercent =
    input.transactionValue > 0 ? (nonOriginatingValue / input.transactionValue) * 100 : 0;

  return {
    nonOriginatingValue,
    transactionValue: input.transactionValue,
    nonOriginatingPercent: round2(nonOriginatingPercent),
    withinDeMinimis: nonOriginatingPercent <= thresholdPercent,
    thresholdPercent,
    notes: [
      "De minimis (USMCA Article 4.12) applies only to the non-originating materials that fail a required tariff-shift test - it doesn't raise your RVC threshold, and those materials still count as non-originating in the RVC result above.",
      "The treaty test is 10% of the transaction value (adjusted to exclude international shipment costs) or, where the net cost method applies, 10% of the total cost of the good - this check uses transaction value as a conservative reference.",
      "Textiles and apparel (HS chapters 50-63) use a different, weight-based de minimis test instead of this value-based one (10% of total weight, with elastomeric content capped at 7% of total weight).",
      "Certain dairy products and infant formula used as inputs are excluded from de minimis treatment entirely.",
    ],
  };
}
