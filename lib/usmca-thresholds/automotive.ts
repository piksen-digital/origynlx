/**
 * USMCA Automotive Rules of Origin — unified schema, sample/template file.
 *
 * Source: the "automotive correction pass" supplied 2026-08, which itself
 * corrected two errors in the original OrigynLX automotive data (heavy
 * trucks were NOT flatly at 70% - they're staged at 64% NC until July
 * 2027; heavy-truck complementary parts are a separate 54%/64%
 * category, not the passenger-vehicle 65% figure).
 *
 * REVISION 2 (treaty verification pass): USMCA vehicle-level rules for
 * finished motor vehicles are NET-COST-ONLY - the product-specific rules
 * for 8701-8705 specify RVC "under the net cost method" with no
 * transaction-value alternative (CUSMA Rules of Origin Regulations
 * SOR/2020-155 s.13; HTSUS GN 11(o) ch. 87). The transaction-value
 * thresholds previously encoded on the two vehicle-level rules below were
 * removed as unsupported. PARTS rules are different: the core/principal/
 * complementary parts thresholds carry both methods (SOR/2020-155
 * s.14(13)/15: e.g. core parts 75% NC / 85% TV), so those keep both.
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

const CUSMA_ROO_REGS: UsmcaSource = {
  authority: "CANADA_DOJ",
  title: "CUSMA Rules of Origin Regulations (SOR/2020-155), ss.13-15 - vehicle PSROs and heavy-truck parts RVC staging",
  url: "https://laws-lois.justice.gc.ca/eng/regulations/SOR-2020-155/section-13.html",
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
    ],
    effectiveFrom: "2023-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "Final vehicle RVC requirement, up from 62.5% under NAFTA, phased in from 66% (2020) to 75% (2023), increasing 3 points per year. Net cost method only - USMCA provides no transaction-value alternative for finished vehicles (SOR/2020-155 s.13: 8703.21-.90 require RVC under the net cost method); the 85% TV option previously encoded here was removed after treaty verification. This is the vehicle-level RVC only - it does not by itself satisfy the separate core/principal/complementary parts, Labor Value Content, or steel/aluminum purchasing requirements below.",
    sources: [USTR_WHITE_PAPER, USITC_2023_REPORT, UNIFORM_REGULATIONS, CUSMA_ROO_REGS],
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
    ],
    phases: [
      {
        effectiveFrom: "2020-07-01",
        effectiveTo: "2024-06-30",
        rvcOptions: [
          { method: "net-cost", thresholdPercent: 60 },
        ],
      },
      {
        effectiveFrom: "2024-07-01",
        effectiveTo: "2027-06-30",
        rvcOptions: [
          { method: "net-cost", thresholdPercent: 64 },
        ],
      },
      {
        effectiveFrom: "2027-07-01",
        rvcOptions: [
          { method: "net-cost", thresholdPercent: 70 },
        ],
      },
    ],
    effectiveFrom: "2024-07-01",
    effectiveTo: "2027-06-30",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "As of the current staging period the applicable requirement is 64% net cost - NOT the final 70% figure, which only begins July 1, 2027. Check the current date against the phases array before relying on a single number. Vehicle-level rules are net-cost-only under USMCA (SOR/2020-155 s.13, mirroring the 8701.20 heavy-vehicle staging 60/64/70); the transaction-value options previously encoded here were removed after treaty verification.",
    sources: [UNIFORM_REGULATIONS, USITC_2023_REPORT, CUSMA_ROO_REGS],
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
      "Applies to passenger vehicles/light trucks only - heavy trucks have no separate core-parts category (see auto-heavy-truck-principal-parts). Chapters listed are the broad set core parts are known to span (84 engines/transmissions, 85 batteries/electrical, 87 chassis/body, 90 some instrumentation) - exact per-part chapter/heading mapping against the Uniform Regulations' parts tables is open work, not yet resolved to tariff-item precision. Both methods verified: SOR/2020-155 s.14(13) stages Table A.1/A.2 core parts 66/76 (2020) up to 75% NC / 85% TV final.",
    sources: [USITC_2023_REPORT, UNIFORM_REGULATIONS, CUSMA_ROO_REGS],
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
      "Heavy trucks have no separate core-parts list - this category folds in the parts treated as core parts for light vehicles, plus the heavy-truck principal parts. Same staging pattern as the heavy-truck vehicle-level rule. Verified against SOR/2020-155 s.15(2) (Table D heavy-truck parts: 60/70, 64/74, 70/80 NC/TV, July-to-June windows); the transaction-value figures apply because the corresponding Schedule 1 rules include a transaction-value method.",
    sources: [USITC_2023_REPORT, UNIFORM_REGULATIONS, CUSMA_ROO_REGS],
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
      "A genuinely separate category from the passenger-vehicle 65% complementary-parts figure - do not conflate the two. Verified against SOR/2020-155 s.15(3) (Table E heavy-truck parts staging, NC with TV where the corresponding rule includes a transaction-value method).",
    sources: [UNIFORM_REGULATIONS, USITC_2023_REPORT, CUSMA_ROO_REGS],
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
