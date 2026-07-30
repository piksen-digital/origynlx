/**
 * Regional Value Content calculator - Transaction Value method.
 *
 * RVC = (Transaction Value - Value of Non-Originating Materials) / Transaction Value x 100
 *
 * This is one of two ways USMCA lets a producer qualify a good (the other is
 * the Net Cost method, and certain product categories additionally require a
 * tariff-shift test under Annex 4-B). This tool implements the Transaction
 * Value RVC calculation, which is the piece that is genuinely just arithmetic.
 * Tariff-shift qualification depends on the specific HS classification of
 * every input and is flagged for manual review rather than guessed at -
 * that determination belongs to a licensed customs broker.
 */

export interface BOMLineItem {
  id: string;
  description: string;
  hsCode: string;
  countryOfOrigin: string;
  value: number;
  originating: boolean;
}

export interface RVCInput {
  productName: string;
  transactionValue: number;
  method: "transaction-value" | "net-cost";
  thresholdPercent: number; // default 60 for TV method, 50 for net cost, 75 for automotive core parts
  lineItems: BOMLineItem[];
}

export interface RVCResult {
  transactionValue: number;
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

  if (input.transactionValue <= 0) {
    warnings.push("Transaction value must be greater than zero.");
  }

  if (Math.abs(lineItemTotal - input.transactionValue) / (input.transactionValue || 1) > 0.02) {
    warnings.push(
      "Line item values differ from transaction value by more than 2% - double check your BOM totals before relying on this result."
    );
  }

  const rvcPercent =
    input.transactionValue > 0
      ? ((input.transactionValue - nonOriginatingValue) / input.transactionValue) * 100
      : 0;

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
  };
}

export const DEFAULT_THRESHOLDS: Record<RVCInput["method"], number> = {
  "transaction-value": 60,
  "net-cost": 50,
};
