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
import { ARMS_WORKS_OF_ART_SECTOR_FILE } from "./usmca-thresholds/usmca-arms-and-works-of-art-ts-chapters-93-&-97-pass-rev-1-gn-11-2026-rev-15.ts";
import { BASEMETALS_SECTOR_FILE } from "./usmca-thresholds/usmca-basemetals-ts-chapters-72-83-pass.ts";
import { FATS_OILS_SECTOR_FILE } from "./usmca-thresholds/usmca-fats-oils-ts-chapter-15-pass-rev-1-gn-11-2026-rev-15.ts";
import { LIVE_ANIMALS_SECTOR_FILE } from "./usmca-thresholds/usmca-live-animals-animal-products-ts-chapters-1-5-pass-rev-1-gn-11-2026-rev-15.ts";
import { MINERAL_PRODUCTS_SECTOR_FILE } from "./usmca-thresholds/usmca-mineral-products-ts-chapters-25-27-pass-rev-1-gn-11-2026-rev-15.ts";
import { MISC_MANUFACTURED_SECTOR_FILE } from "./usmca-thresholds/usmca-misc-manufactured-ts-chapters-94-96-pass-rev-1-gn-11-2026-rev-15.ts";
import { OPTICAL_PHOTOGRAPHIC_SECTOR_FILE } from "./usmca-thresholds/usmca-optical-photographic-medical-clocks-ts-chapters-90-92-pass-rev-1-gn-11-2026-rev-15.ts";
import { PLASTICS_RUBBER_SECTOR_FILE } from "./usmca-thresholds/usmca-plastics-rubber-ts-chapters-39-40-pass-rev-1-gn-11-2026-rev-15.ts";
import { PRECIOUS_METALS_SECTOR_FILE } from "./usmca-thresholds/usmca-precious-metals-ts-chapter-71-pass-rev-1-gn-11-2026-rev-15.ts";
import { PREPARED_FOODSTUFFS_SECTOR_FILE } from "./usmca-thresholds/usmca-prepared-foodstuffs-ts-chapters-16-24-pass-rev-1-gn-11-2026-rev-15.ts";
import { PULP_PAPER_SECTOR_FILE } from "./usmca-thresholds/usmca-pulp-paper-printed-matter-ts-chapters-47-49-pass-rev-1-gn-11-2026-rev-15.ts";
import { RAW_HIDES_SECTOR_FILE } from "./usmca-thresholds/usmca-raw-hides-leather-furs-ts-chapters-41-43-pass-rev-1-gn-11-2026-rev-15.ts";
import { STONE_CERAMICS_SECTOR_FILE } from "./usmca-thresholds/usmca-stone-ceramics-glass-ts-chapters-68-70-pass-rev-1-gn-11-2026-rev-15.ts";
import { TRANSPORT_SECTOR_FILE } from "./usmca-thresholds/usmca-transport-ts-chapters-86-89-pass-rev-3-gn-11-2026-rev-15-rebuilt-on-the-automotive-optics-record-template.ts";
import { VEGETABLE_PRODUCTS_SECTOR_FILE } from "./usmca-thresholds/usmca-vegetable-products-ts-chapters-6-14-pass-rev-1-gn-11-2026-rev-15.ts";
import { WOOD_ARTICLES_SECTOR_FILE } from "./usmca-thresholds/usmca-wood-and-article-thereof-ts-chapters-44-46-pass-rev-1-gn-11-2026-rev-15.ts";

export const ALL_SECTOR_FILES: UsmcaSectorFile[] = [
  AUTOMOTIVE_SECTOR_FILE,
  CHEMICALS_PLASTICS_SECTOR_FILE,
  ELECTRONICS_MACHINERY_SECTOR_FILE,
  TEXTILE_SECTOR_FILE,
  ARMS_WORKS_OF_ART_SECTOR_FILE,
  BASEMETALS_SECTOR_FILE,
  FATS_OILS_SECTOR_FILE,
  LIVE_ANIMALS_SECTOR_FILE,
  MINERAL_PRODUCTS_SECTOR_FILE,
  MISC_MANUFACTURED_SECTOR_FILE,
  OPTICAL_PHOTOGRAPHIC_SECTOR_FILE,
  PLASTICS_RUBBER_SECTOR_FILE,
  PRECIOUS_METALS_SECTOR_FILE,
  PREPARED_FOODSTUFFS_SECTOR_FILE,
  PULP_PAPER_SECTOR_FILE,
  RAW_HIDES_SECTOR_FILE,
  STONE_CERAMICS_SECTOR_FILE,
  TRANSPORT_SECTOR_FILE,
  VEGETABLE_PRODUCTS_SECTOR_FILE,
  WOOD_ARTICLES_SECTOR_FILE,
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
