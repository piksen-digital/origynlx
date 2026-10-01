/**
 * USMCA Automotive Rules of Origin — unified schema, sample/template file.
 *
 * Source: the "automotive correction pass" supplied 2026-08, which itself
 * corrected two errors in the original OrigynLX automotive data (heavy
 * trucks were NOT flatly at 70% - they're staged at 64% NC / 74% TV until
 * July 2027; heavy-truck complementary parts are a separate 54%/64%
 * category, not the passenger-vehicle 65% figure).
 *
 * Chapters: vehicle-level rules are Chapter 87. The core/principal/
 * complementary PARTS categories are defined lists that span multiple
 * chapters (engines, batteries, electronics, chassis, etc. sit in
 * different chapters) - this file marks them with the broad chapter set
 * they're known to span rather than inventing a false single-chapter
 * precision. Resolving the exact chapter-by-chapter parts breakdown
 * against the Uniform Regulations' parts tables is flagged as open work.
 */
import type { UsmcaRule, UsmcaSectorFile, UsmcaSource } from "../usmca-rule-types";

const UNIFORM_REGULATIONS: UsmcaSource = {
  authority: "USTR",
  title: "USTR - Uniform Regulations Regarding Rules of Origin",
  url: "https://ustr.gov/sites/default/files/files/agreements/usmca/UniformROO.pdf",
  reference: "Uniform Regulations",
};

const USITC_2023_REPORT: UsmcaSource = {
  authority: "USITC",
  title: "USITC - USMCA Automotive Rules of Origin: Economic Impact and Operations, 2023 Report",
  url: "https://www.usitc.gov/publications/332/pub5443.pdf",
};

const USTR_WHITE_PAPER: UsmcaSource = {
  authority: "USTR",
  title: "USTR - USMCA Automotive Rules of Origin White Paper",
  url: "https://ustr.gov/sites/default/files/files/Press/Releases/USTR%20USMCA%20Autos%20White%20Paper.pdf",
};

export const AUTOMOTIVE_RULES: UsmcaRule[] = [
  {
    id: "auto-passenger-light-truck",
    sector: "automotive",
    chapters: ["87"],
    hsRange: "87.01-87.05 (vehicle level)",
    label: "Passenger vehicle / light truck",
    ruleBasis: "rvc",
    rvcOptions: [
      { method: "net-cost", thresholdPercent: 75 },
      { method: "transaction-value", thresholdPercent: 85 },
    ],
    effectiveFrom: "2023-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "Final vehicle RVC requirement, up from 62.5% under NAFTA, phased in from 66% (2020) to 75% (2023). This is the vehicle-level RVC only - it does not by itself satisfy the separate core/principal/complementary parts, Labor Value Content, or steel/aluminum purchasing requirements below.",
    sources: [USTR_WHITE_PAPER, USITC_2023_REPORT, UNIFORM_REGULATIONS],
  },
  {
    id: "auto-heavy-truck",
    sector: "automotive",
    chapters: ["87"],
    hsRange: "87.04 heavy trucks (vehicle level)",
    label: "Heavy truck",
    ruleBasis: "rvc",
    rvcOptions: [
      { method: "net-cost", thresholdPercent: 64 },
      { method: "transaction-value", thresholdPercent: 74 },
    ],
    phases: [
      {
        effectiveFrom: "2020-07-01",
        effectiveTo: "2024-06-30",
        rvcOptions: [
          { method: "net-cost", thresholdPercent: 60 },
          { method: "transaction-value", thresholdPercent: 70 },
        ],
      },
      {
        effectiveFrom: "2024-07-01",
        effectiveTo: "2027-06-30",
        rvcOptions: [
          { method: "net-cost", thresholdPercent: 64 },
          { method: "transaction-value", thresholdPercent: 74 },
        ],
      },
      {
        effectiveFrom: "2027-07-01",
        rvcOptions: [
          { method: "net-cost", thresholdPercent: 70 },
          { method: "transaction-value", thresholdPercent: 80 },
        ],
      },
    ],
    effectiveFrom: "2024-07-01",
    effectiveTo: "2027-06-30",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "As of the current staging period, the applicable requirement is 64% NC / 74% TV - NOT the final 70%/80% figure, which only begins July 1, 2027. Check the current date against the phases array before relying on a single number.",
    sources: [UNIFORM_REGULATIONS, USITC_2023_REPORT],
  },
  {
    id: "auto-core-parts",
    sector: "automotive",
    chapters: ["84", "85", "87", "90"],
    hsRange: "core parts list (multi-chapter, see notes)",
    label: "Core parts (engine, transmission, body/chassis, axles, suspension, steering, advanced battery)",
    ruleBasis: "rvc",
    rvcOptions: [
      { method: "net-cost", thresholdPercent: 75 },
      { method: "transaction-value", thresholdPercent: 85 },
    ],
    effectiveFrom: "2023-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "Applies to passenger vehicles/light trucks only - heavy trucks have no separate core-parts category (see auto-heavy-truck-principal-parts). Chapters listed are the broad set core parts are known to span (84 engines/transmissions, 85 batteries/electrical, 87 chassis/body, 90 some instrumentation) - exact per-part chapter/heading mapping against the Uniform Regulations' parts tables is open work, not yet resolved to tariff-item precision.",
    sources: [USITC_2023_REPORT, UNIFORM_REGULATIONS],
  },
  {
    id: "auto-principal-parts",
    sector: "automotive",
    chapters: ["84", "85", "87", "90"],
    hsRange: "principal parts list (multi-chapter, see notes)",
    label: "Principal parts, passenger vehicle / light truck (brakes, tires, seats, fuel system, etc.)",
    ruleBasis: "rvc",
    rvcOptions: [
      { method: "net-cost", thresholdPercent: 70 },
      { method: "transaction-value", thresholdPercent: 80 },
    ],
    effectiveFrom: "2023-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "Table B principal-parts category for passenger vehicles/light trucks specifically. Heavy-truck principal parts are a separate staged requirement (see auto-heavy-truck-principal-parts) - do not apply this figure to heavy trucks.",
    sources: [UNIFORM_REGULATIONS, USITC_2023_REPORT],
  },
  {
    id: "auto-complementary-parts",
    sector: "automotive",
    chapters: ["83", "84", "85", "87"],
    hsRange: "complementary parts list (multi-chapter, see notes)",
    label: "Complementary parts, passenger vehicle / light truck (audio, lighting, wipers, locks, etc.)",
    ruleBasis: "rvc",
    rvcOptions: [
      { method: "net-cost", thresholdPercent: 65 },
      { method: "transaction-value", thresholdPercent: 75 },
    ],
    effectiveFrom: "2023-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "This 65%/75% figure applies to passenger-vehicle/light-truck complementary parts only. Do NOT apply it to heavy trucks, which use a separate staged requirement (see auto-heavy-truck-complementary-parts) - this was a real error in the original single-pass data that this correction fixes.",
    sources: [UNIFORM_REGULATIONS, USITC_2023_REPORT, {
      authority: "CBP",
      title: "CBP CROSS Ruling H350927 - USMCA Rule of Origin for Automotive Lamps",
      url: "https://rulings.cbp.gov/ruling/H350927",
    }],
  },
  {
    id: "auto-heavy-truck-principal-parts",
    sector: "automotive",
    chapters: ["84", "85", "87", "90"],
    hsRange: "heavy truck principal parts list (multi-chapter, see notes)",
    label: "Heavy truck principal parts",
    ruleBasis: "rvc",
    rvcOptions: [
      { method: "net-cost", thresholdPercent: 64 },
      { method: "transaction-value", thresholdPercent: 74 },
    ],
    phases: [
      {
        effectiveFrom: "2020-07-01",
        effectiveTo: "2024-06-30",
        rvcOptions: [
          { method: "net-cost", thresholdPercent: 60 },
          { method: "transaction-value", thresholdPercent: 70 },
        ],
      },
      {
        effectiveFrom: "2024-07-01",
        effectiveTo: "2027-06-30",
        rvcOptions: [
          { method: "net-cost", thresholdPercent: 64 },
          { method: "transaction-value", thresholdPercent: 74 },
        ],
      },
      {
        effectiveFrom: "2027-07-01",
        rvcOptions: [
          { method: "net-cost", thresholdPercent: 70 },
          { method: "transaction-value", thresholdPercent: 80 },
        ],
      },
    ],
    effectiveFrom: "2024-07-01",
    effectiveTo: "2027-06-30",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "Heavy trucks have no separate core-parts list - this category folds in the parts treated as core parts for light vehicles, plus the heavy-truck principal parts. Same staging pattern as the heavy-truck vehicle-level rule.",
    sources: [USITC_2023_REPORT, UNIFORM_REGULATIONS],
  },
  {
    id: "auto-heavy-truck-complementary-parts",
    sector: "automotive",
    chapters: ["83", "84", "85", "87"],
    hsRange: "heavy truck complementary parts list (multi-chapter, see notes)",
    label: "Heavy truck complementary parts",
    ruleBasis: "rvc",
    rvcOptions: [
      { method: "net-cost", thresholdPercent: 54 },
      { method: "transaction-value", thresholdPercent: 64 },
    ],
    phases: [
      {
        effectiveFrom: "2024-07-01",
        effectiveTo: "2027-06-30",
        rvcOptions: [
          { method: "net-cost", thresholdPercent: 54 },
          { method: "transaction-value", thresholdPercent: 64 },
        ],
      },
      {
        effectiveFrom: "2027-07-01",
        rvcOptions: [
          { method: "net-cost", thresholdPercent: 60 },
          { method: "transaction-value", thresholdPercent: 70 },
        ],
      },
    ],
    effectiveFrom: "2024-07-01",
    effectiveTo: "2027-06-30",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "A genuinely separate category from the passenger-vehicle 65% complementary-parts figure - do not conflate the two.",
    sources: [UNIFORM_REGULATIONS, USITC_2023_REPORT],
  },
];

export const AUTOMOTIVE_SECTOR_FILE: UsmcaSectorFile = {
  sector: "automotive",
  chaptersCovered: ["83", "84", "85", "87", "90"],
  dataAsOf: "2026-08-11",
  mergeEligible: true,
  auditStatus: "human_verified",
  rules: AUTOMOTIVE_RULES,
  watchItems: [],
  sourceFirewall: {
    treatyBaseline: "USTR USMCA Chapter 4 / Annex 4-B, Automotive Appendix",
    usImplementation: "HTSUS General Note 11 / Uniform Regulations",
    excludedAgreements: ["NAFTA (superseded)", "CAFTA-DR", "CPTPP", "other FTAs"],
  },
};

/**
 * Requirements intentionally NOT folded into these RVC entries - they are
 * not percentage thresholds and need separate rule/compliance fields:
 * - Labor Value Content (40% passenger vehicles / 45% trucks)
 * - North American steel purchasing requirement (70%)
 * - North American aluminum purchasing requirement (70%)
 * - Tariff-shift/product-specific rules for individual parts
 * - Core-parts origination averaging mechanics
 */

export default AUTOMOTIVE_SECTOR_FILE;
