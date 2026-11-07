import { LIVE_USMCA_RULES } from "./usmca-rule-registry";
import type { AuditStatus, RvcOption, RuleBasis, UsmcaRule } from "./usmca-rule-types";

/**
 * Rule bases that expose a percentage the calculator can actually set.
 * "special" is included because several sector files encode combined rules
 * (a tariff shift AND an RVC floor, or no-shift RVC branches) under that
 * basis while still carrying settable rvcOptions/phases.
 */
const SETTABLE_RVC_BASES = new Set<RuleBasis>([
  "rvc",
  "tariff-shift-or-rvc",
  "special",
]);

export interface ThresholdPickerReference {
  id: string;
  ruleId: string;
  sector: string;
  chapters: string[];
  hsRange: string;
  label: string;
  ruleBasis: RuleBasis;
  tariffShiftRule?: string;
  method: RvcOption["method"];
  thresholdPercent: number;
  /** Condition attached to this RVC option (e.g. the alternative-branch or
   * no-shift conditions recorded in the sector files). */
  condition?: string;
  /** Rule-level validity window, e.g. the 8504 steel-exception rules that
   * changed on 2025-07-01, or automotive staging periods. */
  ruleEffectiveFrom?: string;
  ruleEffectiveTo?: string;
  verified: boolean;
  auditStatus: AuditStatus;
  notes?: string;
  sources: UsmcaRule["sources"];
}

export interface GroupedThresholdPickerOptions {
  sector: string;
  options: ThresholdPickerReference[];
}

function isSettableRvcRule(rule: UsmcaRule): boolean {
  return SETTABLE_RVC_BASES.has(rule.ruleBasis) &&
    Boolean(rule.rvcOptions?.length || rule.phases?.some((phase) => phase.rvcOptions.length));
}

function toDate(value: string | undefined): number {
  return value ? Date.parse(value) : Number.NEGATIVE_INFINITY;
}

/**
 * Rule-level validity window. Records split into time windows (e.g. the
 * 8504.21-34 and 8504.90 65/55 rules effective 2025-07-01, with their
 * pre-2025 counterparts) only appear while actually in force.
 */
function ruleInForce(rule: UsmcaRule, now: number): boolean {
  return toDate(rule.effectiveFrom) <= now &&
    (rule.effectiveTo ? Date.parse(rule.effectiveTo) : Number.POSITIVE_INFINITY) >= now;
}

/**
 * Select the threshold phase applicable today.
 *
 * Sector files keep their final/current option in `rvcOptions` and staged
 * values in `phases`. A phase wins when it covers today's date; an undated
 * phase (the rev.3 record template stores always-available alternative
 * branches that way) always covers. Otherwise the rule-level options are
 * used as the safe fallback.
 */
function activeRvcOptions(rule: UsmcaRule, now = Date.now()): RvcOption[] {
  const activePhase = rule.phases
    ?.filter((phase) => {
      const from = toDate(phase.effectiveFrom);
      const to = phase.effectiveTo ? Date.parse(phase.effectiveTo) : Number.POSITIVE_INFINITY;
      return from <= now && now <= to;
    })
    .sort((a, b) => toDate(b.effectiveFrom) - toDate(a.effectiveFrom))[0];

  return activePhase?.rvcOptions ?? rule.rvcOptions ?? [];
}

function makeReference(rule: UsmcaRule, option: RvcOption): ThresholdPickerReference {
  return {
    id: `${rule.id}-${option.method}`,
    ruleId: rule.id,
    sector: rule.sector,
    chapters: rule.chapters,
    hsRange: rule.hsRange,
    label: `${rule.sector} — HS ${rule.hsRange}: ${rule.label}`,
    ruleBasis: rule.ruleBasis,
    tariffShiftRule: rule.tariffShiftRule,
    method: option.method,
    thresholdPercent: option.thresholdPercent,
    condition: option.condition,
    ruleEffectiveFrom: rule.effectiveFrom,
    ruleEffectiveTo: rule.effectiveTo,
    verified: rule.verified && rule.auditStatus !== "pending_human_audit",
    auditStatus: rule.auditStatus,
    notes: rule.notes,
    sources: rule.sources,
  };
}

/**
 * Flat list consumed by the calculator's grouped select: one entry per
 * (rule, method) pair in force today, across every mergeEligible sector
 * file in lib/usmca-thresholds.
 */
export const THRESHOLD_PICKER_OPTIONS: ThresholdPickerReference[] = LIVE_USMCA_RULES
  .filter(isSettableRvcRule)
  .filter((rule) => ruleInForce(rule, Date.now()))
  .flatMap((rule) => activeRvcOptions(rule).map((option) => makeReference(rule, option)));

/**
 * Same options grouped by sector for an optgroup-based picker. The flat
 * export is kept for direct lookups by option id.
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
