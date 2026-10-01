/**
 * USMCA rule library registry.
 *
 * This is the "compile pass" - the one place that knows about every
 * sector file. Adding a future sector means adding two lines here, not
 * touching any component that consumes ALL_USMCA_RULES.
 *
 * mergeEligible is respected here, not ignored: ALL_USMCA_RULES includes
 * every sector's rules regardless of status (useful for review/search),
 * but LIVE_USMCA_RULES filters to only sectors marked mergeEligible,
 * which is what any live product feature should actually read from.
 * Right now that excludes chemicals-plastics until its audit is done.
 */
import type { UsmcaRule, UsmcaSectorFile } from "./usmca-rule-types";
import { AUTOMOTIVE_SECTOR_FILE } from "./usmca-thresholds/automotive";
import { CHEMICALS_PLASTICS_SECTOR_FILE } from "./usmca-thresholds/usmca-chemicals-ts-chapters-28-38-pass-rev-3-gn-11-2026-rev-15.ts";
import { ELECTRONICS_MACHINERY_SECTOR_FILE } from "./usmca-thresholds/usmca-machinery-electrical-ts-chapters-84-85-pass-rev-3-gn-11-2026-rev-15-rebuilt-on-the-automotive-optics-record-template.ts";
import { TEXTILE_SECTOR_FILE } from "./usmca-thresholds/usmca-textiles-apparel-ts-chapters-50-63-pass-rev-1-gn-11-2026-rev-15-fresh-authoritative-build.ts";

export const ALL_SECTOR_FILES: UsmcaSectorFile[] = [
  AUTOMOTIVE_SECTOR_FILE,
  CHEMICALS_PLASTICS_SECTOR_FILE,
  ELECTRONICS_MACHINERY_SECTOR_FILE,
  TEXTILE_SECTOR_FILE,
];

/** Every rule from every sector, regardless of audit/merge status. */
export const ALL_USMCA_RULES: UsmcaRule[] = ALL_SECTOR_FILES.flatMap((f) => f.rules);

/** Only rules from sectors cleared for live use. This is what the
 * calculator (or any other live feature) should actually read. */
export const LIVE_USMCA_RULES: UsmcaRule[] = ALL_SECTOR_FILES
  .filter((f) => f.mergeEligible)
  .flatMap((f) => f.rules);

/** Sectors currently held back, and why - surface this in any admin/status view. */
export const PENDING_SECTORS: { sector: string; reason: string }[] = ALL_SECTOR_FILES
  .filter((f) => !f.mergeEligible)
  .map((f) => ({
    sector: f.sector,
    reason: `auditStatus: ${f.auditStatus}`,
  }));
