/**
 * Shared USMCA rule schema, v1.
 *
 * Every sector file (lib/usmca-thresholds/*.ts) exports rules in this
 * shape. This is a superset of the four schemas found across the
 * automotive/chemicals-plastics/electronics-machinery/textiles passes -
 * nothing from any of them had to be dropped to fit this.
 *
 * Design notes:
 * - `ruleBasis` finally separates HOW a good qualifies. Most Annex 4-B
 *   rules are tariff-shift; RVC is often an alternative that only applies
 *   when the shift fails ("tariff-shift-or-rvc"), not a parallel path.
 * - `rvcOptions` is an array, not a single method/threshold pair, because
 *   a single rule can offer both TV and NC alternatives simultaneously.
 * - `phases` carries staged/future threshold changes (e.g. the 2027 heavy
 *   truck step) without needing a schema change when they arrive.
 * - `auditStatus` is adopted from the chemicals-plastics pass's
 *   certification-gate discipline - every rule says plainly whether a
 *   human has actually checked it.
 * - `chapters` is always explicit and always an array, since a single
 *   rule-family sometimes spans more than one HS chapter (e.g. automotive
 *   parts categories aren't confined to Chapter 87).
 */

export type RuleBasis =
  | "tariff-shift"
  | "rvc"
  | "tariff-shift-or-rvc"
  | "yarn-forward"
  | "fiber-forward"
  | "process-requirement"
  | "weight-content"
  | "special";

export type AuditStatus =
  | "human_verified"
  | "pending_human_audit"
  | "primary_sourced_unaudited";

export interface UsmcaSource {
  authority: string; // "USTR" | "USITC" | "CBP" | "CANADA_CUSTOMS" | ...
  title: string;
  url: string;
  reference?: string; // e.g. "Annex 4-B", "Section 15", "GN 11(o)"
}

export interface RvcOption {
  method: "transaction-value" | "net-cost";
  thresholdPercent: number;
  /** e.g. "No required change in tariff classification" - when the RVC
   * path is conditional on the tariff-shift path failing. */
  condition?: string;
}

export interface ThresholdPhase {
  effectiveFrom: string;
  effectiveTo?: string;
  rvcOptions: RvcOption[];
  notes?: string;
}

export interface WeightContentRule {
  minimumOriginatingPercentByWeight: number;
  description: string;
}

export interface DeMinimisRule {
  maxNonOriginatingWeightPercent: number;
  maxElastomericWeightPercent?: number;
  basis: string;
  appliesWhenTariffShiftOtherwiseFails: boolean;
}

export interface WatchItem {
  id: string;
  description: string;
  status: "under_negotiation" | "proposed" | "not_yet_binding";
  sourceRefs: UsmcaSource[];
}

export interface UsmcaRule {
  id: string;
  sector: string;
  /** Always explicit, always an array - never inferred from the sector name. */
  chapters: string[];
  hsRange: string;
  label: string;
  ruleBasis: RuleBasis;
  tariffShiftRule?: string;
  rvcOptions?: RvcOption[];
  weightContent?: WeightContentRule;
  deMinimis?: DeMinimisRule;
  phases?: ThresholdPhase[];
  effectiveFrom?: string;
  effectiveTo?: string;
  verified: boolean;
  auditStatus: AuditStatus;
  notes?: string;
  sources: UsmcaSource[];
  /** id of an earlier rule this one corrects/replaces, if applicable. */
  supersedes?: string;
}

export interface UsmcaSectorFile {
  sector: string;
  chaptersCovered: string[];
  dataAsOf: string;
  mergeEligible: boolean;
  auditStatus: AuditStatus;
  rules: UsmcaRule[];
  watchItems?: WatchItem[];
  sourceFirewall?: {
    treatyBaseline: string;
    usImplementation: string;
    excludedAgreements: string[];
  };
}
