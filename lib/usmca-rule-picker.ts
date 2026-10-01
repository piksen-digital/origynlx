import {
  LIVE_USMCA_RULES,
  type UsmcaRule,
} from "./usmca-rule-registry";
import type { RvcOption } from "./usmca-rule-types";

/** Rule bases that expose a percentage the calculator can actually set. */
const SETTABLE_RVC_BASES = new Set([
  "rvc",
  "tariff-shift-or-rvc",
  "tariff-shift-and-rvc",
]);

export interface ThresholdPickerReference {
  id: string;
  sector: string;
  hsRange: string;
  label: string;
  method: RvcOption["method"];
  thresholdPercent: number;
  verified: boolean;
  notes?: string;
  sources: UsmcaRule["sources"];
  ruleId: string;
}

export interface GroupedThresholdPickerOptions {
  sector: string;
  options: ThresholdPickerReference[];
}

function isSettableRvcRule(rule: UsmcaRule): boolean {
  // Keep this as a string check so the adapter remains compatible with the
  // registry if the shared schema adds another combined RVC rule basis.
  return SETTABLE_RVC_BASES.has(String(rule.ruleBasis)) &&
    Boolean(rule.rvcOptions?.length || rule.phases?.some((phase) => phase.rvcOptions.length));
}

function toDate(value: string | undefined): number {
  return value ? Date.parse(value) : Number.NEGATIVE_INFINITY;
}

function isInPhase(rule: UsmcaRule, effectiveFrom: number, effectiveTo: number, now: number): boolean {
  return effectiveFrom <= now && now <= effectiveTo;
}

/**
 * Select the threshold phase applicable today.
 *
 * Sector files keep their final/current option in `rvcOptions` and staged
 * values in `phases`. A phase wins when it covers today's date; otherwise the
 * rule-level options are used as the safe fallback.
 */
function activeRvcOptions(rule: UsmcaRule, now = Date.now()): RvcOption[] {
  const activePhase = rule.phases
    ?.filter((phase) => isInPhase(
      rule,
      toDate(phase.effectiveFrom),
      toDate(phase.effectiveTo) || Number.POSITIVE_INFINITY,
      now,
    ))
    .sort((a, b) => toDate(b.effectiveFrom) - toDate(a.effectiveFrom))[0];

  return activePhase?.rvcOptions ?? rule.rvcOptions ?? [];
}

function makeReference(rule: UsmcaRule, option: RvcOption): ThresholdPickerReference {
  return {
    id: `${rule.id}-${option.method}`,
    ruleId: rule.id,
    sector: rule.sector,
    hsRange: rule.hsRange,
    label: `${rule.sector} — HS ${rule.hsRange}: ${rule.label}`,
    method: option.method,
    thresholdPercent: option.thresholdPercent,
    verified: rule.verified && rule.auditStatus !== "pending_human_audit",
    notes: rule.notes,
    sources: rule.sources,
  };
}

/**
 * Flat list consumed by the existing CalculatorTool select.
 *
 * Only live sectors are used, so a sector remains invisible until it has been
 * deliberately added to the registry and marked mergeEligible.
 */
export const THRESHOLD_PICKER_OPTIONS: ThresholdPickerReference[] = LIVE_USMCA_RULES
  .filter(isSettableRvcRule)
  .flatMap((rule) => activeRvcOptions(rule).map((option) => makeReference(rule, option)));

/**
 * Same options grouped for an optgroup-based picker. The flat export is kept
 * for backwards compatibility with the current CalculatorTool implementation.
 */
export function buildGroupedThresholdPickerOptions(
  options: ThresholdPickerReference[] = THRESHOLD_PICKER_OPTIONS,
): GroupedThresholdPickerOptions[] {
  const groups = new Map<string, ThresholdPickerReference[]>();

  for (const option of options) {
    const existing = groups.get(option.sector);
    if (existing) existing.push(option);
    else groups.set(option.sector, [option]);
  }

  return Array.from(groups, ([sector, groupedOptions]) => ({
    sector,
    options: groupedOptions,
  }));
}
