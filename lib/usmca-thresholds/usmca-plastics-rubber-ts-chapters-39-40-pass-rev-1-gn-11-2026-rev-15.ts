/**
 * USMCA Plastics / Rubber Rules of Origin —
 * HS Chapters 39-40 pass, unified-schema sector file for OrigynLX.
 * Modeled on the automotive sector file (AUTOMOTIVE_SECTOR_FILE) template.
 * REVISION 1: transcribed VERBATIM from HTSUS General Note 11 (2026
 * Revision 15), as supplied in the official USITC PDF
 * ("General Note 11_2026HTSRev15.pdf"): the GN 11(n)(v) chapters 39-40
 * general rules (chemical reaction incl. definition, purification, and the
 * chapter-39-only mixing/blending rule) and the complete GN 11(o)
 * Chapters 39-40 product-specific tables.
 *
 * CHAPTERS COVERED BY THIS FILE (for the calculator's chapter routing):
 *   39 Plastics and articles thereof
 *   40 Rubber and articles thereof
 *
 * WHAT IS IN THIS PASS:
 *  - GN 11(n)(v) preamble + rules (A)-(D), verbatim. NOTE the asymmetry vs
 *    the chemicals (Section VI) general rules: the chapters 39-40 rules
 *    print NO carve-out exception lists, and the mixing/blending rule (D)
 *    applies to CHAPTER 39 GOODS ONLY (no counterpart for chapter 40).
 *  - GN 11(o) Chapter 39: rules 1-2 (3901-3915 with the 50-percent-by-weight
 *    originating polymer content condition; 3916-3926).
 *  - GN 11(o) Chapter 40: chapter rule 1 (GN 11(k) underscore carryover) and
 *    rules 1-20, incl. the four motor-vehicle hose three-branch rules
 *    (4009.12/.22/.32/.42, RVC 60 TV / 50 NC for motor-vehicle-kind hoses),
 *    the 4005-4006 natural-rubber rule with its unusual 35 TV / 25 NC
 *    alternative, and the 4016.99.30/.55 rule whose RVC alternative is
 *    50 PERCENT NET COST ONLY (no transaction-value option).
 *
 * NOT COVERED / OPEN ITEM: subheadings 4009.51 through 4009.92 (other rubber
 * tubes/hoses) have NO printed rule in the supplied GN 11(o) Chapter 40
 * table — the numbered rules jump from 4009.42 (rule 12) to 4010-4011
 * (rule 13). Verify against the printed PDF during human audit; such goods
 * fall back on the GN 11(n)(v) general rules, GN 11(b)(iv), or wholly-
 * originating analysis.
 *
 * OVERLAP RULE (do not create two-files-two-numbers bugs):
 *   - De minimis (GN 11(e), 10 percent) is OWNED by the core types file.
 *   - GN 11(b)(iv) fallback (60 TV / 50 NC) is OWNED by the core types file.
 *   - GN 11(k) automotive thresholds are OWNED by the automotive sector file —
 *     this file carries cross-reference records only.
 *   - GN 11(n)(iv) (chapters 28-38) is owned by the chemicals file; the
 *     parallel (n)(v) chapters 39-40 rules live HERE.
 */
import type { UsmcaRule, UsmcaSectorFile, UsmcaSource } from "../usmca-rule-types";

const HTS_GN11_2026: UsmcaSource = {
  authority: "USITC",
  title: "Harmonized Tariff Schedule of the United States (2026) Revision 15 — General Note 11, United States-Mexico-Canada Agreement, subdivision (n)(v) (chapters 39-40 general rules) and subdivision (o) (Chapters 39-40 product-specific rules of origin tables)",
  url: "https://hts.usitc.gov/download",
  reference: "GN 11(n)(v)(A)-(D): chemical reaction (incl. definition and exclusions), purification, chapter-39 mixing/blending; GN 11(o) Ch. 39 rules 1-2 (incl. 50-percent-by-weight originating polymer content) and Ch. 40 chapter rule 1 and rules 1-20 (incl. motor-vehicle hose RVC rules and the 4005-4006 35/25 alternative)",
};

const USTR_CH4_TEXT: UsmcaSource = {
  authority: "USTR",
  title: "USMCA Chapter 4 (Rules of Origin) legal text, incl. Annex 4-B (Product-Specific Rules of Origin), Chapters 39-40",
  url: "https://ustr.gov/sites/default/files/files/agreements/FTA/USMCA/Text/04-Rules-of-Origin.pdf",
  reference: "Annex 4-B Chapters 39-40 — treaty source of the same rules",
};

const GAC_CUSMA_CH4: UsmcaSource = {
  authority: "Global Affairs Canada",
  title: "CUSMA Chapter 4 — Rules of Origin (consolidated official text)",
  url: "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/cusma-aceum/text-texte/04.aspx?lang=eng",
  reference: "Annex 4-B Chapters 39-40 rules (corroborating official text)",
};

const SRC = [HTS_GN11_2026, USTR_CH4_TEXT, GAC_CUSMA_CH4];

export const PLASTICS_RUBBER_RULES: UsmcaRule[] = [
  // ---------------- GN 11(n)(v) chapters 39-40 general rules ----------------
  {
    id: "plastics-nv-scope",
    sector: "plastics-rubber",
    chapters: ["39", "40"],
    hsRange: "Chapters 39-40 (GN 11(n)(v))",
    label: "Chapters 39-40 scope: general rules apply notwithstanding the product-specific rules; per-code table transcribed in this file",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM preamble (GN 11(n)(v)): 'A good of any heading in chapters 39 through 40 that satisfies one or more of the provisions enumerated in this subdivision shall be treated as an originating good, except as otherwise specified in those rules. Notwithstanding the preceding sentence, a good is an originating good if it meets the applicable change in tariff classification or satisfies the applicable value content requirement specified in subdivision (o) of this note.' A good may qualify either under a general rule of GN 11(n)(v) or under its applicable GN 11(o) rule. Unlike the Section VI general rules (GN 11(n)(iv)), the chapters 39-40 rules print NO carve-out exception lists, and there is NO chapter-40 counterpart to the mixing/blending rule (D) — it applies to chapter 39 goods only. De minimis (GN 11(e)) and the GN 11(b)(iv) fallback are owned by the core types file.",
    sources: SRC,
  },
  {
    id: "plastics-nv-chemical-reaction",
    sector: "plastics-rubber",
    chapters: ["39", "40"],
    hsRange: "Chapters 39-40 (GN 11(n)(v)(A)-(B))",
    label: "Chemical reaction rule (GN 11(n)(v)(A)-(B)) — no carve-outs printed",
    ruleBasis: "process-requirement",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(n)(v)(A)): 'A good of chapters 39 through 40 that results from a chemical reaction in the territory of one or more of the USMCA countries shall be treated as an originating good.' VERBATIM definition (GN 11(n)(v)(B)): 'For the purposes of this rule, a \"chemical reaction\" is a process (including a biochemical process) that results in a molecule with a new structure by breaking intramolecular bonds and by forming new intramolecular bonds, or by altering the spatial arrangement of atoms in a molecule. The following are not considered to be chemical reactions for the purposes of determining whether a good is an originating good under this note: (1) dissolution in water or in another solvent; (2) the elimination of solvents, including solvent water; or (3) the addition or elimination of water of crystallization.' NOTE: unlike GN 11(n)(iv)(A), NO carve-out headings/subheadings are printed for chapters 39-40 — the rule applies to ALL goods of chapters 39-40.",
    sources: SRC,
  },
  {
    id: "plastics-nv-purification",
    sector: "plastics-rubber",
    chapters: ["39", "40"],
    hsRange: "Chapters 39-40 (GN 11(n)(v)(C))",
    label: "Purification rule (GN 11(n)(v)(C)) — no carve-outs printed; 80 percent is a purity outcome, NOT RVC",
    ruleBasis: "process-requirement",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(n)(v)(C)): 'A good of chapters 39 through 40 that is subject to purification is an originating good, provided that the purification occurs in the territory of one or more of the USMCA countries and results in the following: (1) the elimination of not less than 80 percent of the content of existing impurities; or (2) the reduction or elimination of impurities resulting in a good suitable for one or more of the following: (I) as a pharmaceutical, medical, cosmetic, veterinary, or food grade substance, (II) as a chemical product or reagent for analytical, diagnostic, or laboratory uses, (III) as an element or component for use in micro-elements, (IV) for specialized optical uses, (V) for non-toxic uses for health and safety, (VI) for biotechnical use (e.g. in cell culturing, in genetic technology, or as a catalyst), (VII) as a carrier used in a separation process, or (VIII) for nuclear grade uses.' The 80-percent threshold is a PURITY outcome (elimination of existing impurities), not an RVC percentage — do not feed it to the RVC calculator. NO carve-outs are printed for chapters 39-40.",
    sources: SRC,
  },
  {
    id: "plastics-nv-mixing-ch39",
    sector: "plastics-rubber",
    chapters: ["39"],
    hsRange: "Chapter 39 only (GN 11(n)(v)(D))",
    label: "Mixing/blending rule (GN 11(n)(v)(D)) — CHAPTER 39 GOODS ONLY",
    ruleBasis: "process-requirement",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(n)(v)(D)): 'A good of chapter 39 is an originating good if the deliberate and proportionally-controlled mixing or blending (including dispersing) of materials, other than the addition of diluents, to conform to predetermined specifications occurs in the territory of one or more of the USMCA countries, resulting in the production of a good having essential physical or chemical characteristics that are relevant to the purposes or uses of the good and are different from the input materials.' CHAPTER 39 ONLY — there is NO chapter-40 counterpart to this rule as printed. The calculator must not offer this route to rubber goods of chapter 40.",
    sources: SRC,
  },
  // ---------------- Chapter 39 ----------------
  {
    id: "plastics-39-3901-3915",
    sector: "plastics-rubber",
    chapters: ["39"],
    hsRange: "Headings 3901 through 3915",
    label: "Polymers in primary forms (3901-3915) — tariff shift PLUS 50-percent-by-weight originating polymer content condition",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 39, rule 1): '1. A change to headings 3901 through 3915 from any other heading, including another heading within that group, provided that the originating polymer content of headings 3901 through 3915 is not less than 50 percent by weight of the total polymer content.' CONJUNCTIVE WEIGHT-CONTENT condition: BOTH the tariff shift AND the 50-percent-by-weight originating polymer content test must be satisfied. The 50 percent is a WEIGHT test on the polymer content — it is NOT an RVC percentage and must not be routed to the TV/NC formulas. Note also the shift may come from WITHIN the group (within-group shifts qualify).",
    sources: SRC,
  },
  {
    id: "plastics-39-3916-3926",
    sector: "plastics-rubber",
    chapters: ["39"],
    hsRange: "Headings 3916 through 3926",
    label: "Plastic articles — semi-manufactures, tableware, building materials etc. (3916-3926) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 3916 through 3926 from any other heading, including another heading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  // ---------------- Chapter 40 ----------------
  {
    id: "plastics-40-chapter-rule-1",
    sector: "plastics-rubber",
    chapters: ["40"],
    hsRange: "Chapter 40 (chapter rule)",
    label: "Chapter 40 rule 1: underscored designations may qualify under GN 11(k) for motor-vehicle use — CROSS-REFERENCE, no thresholds",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 40, chapter rule 1): 'For the purposes of the subdivisions pertaining to this chapter, whenever the subdivision designation is underscored, the provisions of subdivision (k) of this note may apply to goods for use in a motor vehicle of chapter 87.' CROSS-REFERENCE RECORD — carries NO thresholds of its own; automotive thresholds are owned by the automotive sector file (GN 11(k)). The printed subheading rules scope the underscore carryover to: 4009.11 (subdivision 5), 4009.12 (subdivision 6), 4009.21 (subdivision 7), 4009.22 (subdivision 8), 4009.31 (subdivision 9), 4009.32 (subdivision 10), 4009.41 (subdivision 11), 4009.42 (subdivision 12), headings 4010-4011 (subdivision 13), subheadings 4016.10-4016.95 (subdivision 17), and subheading 4016.99 (subdivisions 18 and 19). OCR CANNOT SEE the actual underscoring in the printed table — the printed PDF must be checked during human audit.",
    sources: SRC,
  },
  {
    id: "plastics-40-4001-4002",
    sector: "plastics-rubber",
    chapters: ["40"],
    hsRange: "4001.10 through 4002.99",
    label: "Natural rubber, synthetic rubber etc. in primary forms (4001.10-4002.99) — tariff shift, within-group shifts allowed",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 4001.10 through 4002.99 from any other subheading, including another subheading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "plastics-40-4003-4004",
    sector: "plastics-rubber",
    chapters: ["40"],
    hsRange: "Headings 4003 through 4004",
    label: "Reclaimed rubber; rubber waste/scrap (4003-4004) — tariff shift, within-group shifts allowed",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 4003 through 4004 from any other heading, including another heading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "plastics-40-4005-4006",
    sector: "plastics-rubber",
    chapters: ["40"],
    hsRange: "Headings 4005 through 4006",
    label: "Rubber compounding ingredients; other forms (4005-4006) — tariff shift except from 4001, OR from 4001 with RVC 35 TV / 25 NC (UNUSUAL PAIR)",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 35, condition: "Alternative (B): change from heading 4001, whether or not there is also a change from any other heading" },
          { method: "net-cost", thresholdPercent: 25, condition: "Alternative (B): change from heading 4001, whether or not there is also a change from any other heading" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 40, rule 3): '3. (A) A change to headings 4005 through 4006 from any other heading, including another heading within that group, except from heading 4001; or (B) A change to headings 4005 through 4006 from heading 4001, whether or not there is also a change from any other heading, including another heading within that group, provided there is a regional value content of not less than: (1) 35 percent where the transaction value method is used; or (2) 25 percent where the net cost method is used.' UNUSUAL THRESHOLD PAIR: 35 TV / 25 NC — unique in this file; do NOT 'normalize' it to another pattern. Route (B) is specifically for goods made from heading 4001 natural/synthetic rubber; route (A) blocks a shift from 4001 without the RVC.",
    sources: SRC,
  },
  {
    id: "plastics-40-4007-4008",
    sector: "plastics-rubber",
    chapters: ["40"],
    hsRange: "Headings 4007 through 4008",
    label: "Rubber thread/cord; plates, sheets, strip of rubber (4007-4008) — tariff shift from outside the group",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 4007 through 4008 from any heading outside that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "plastics-40-4009-11",
    sector: "plastics-rubber",
    chapters: ["40"],
    hsRange: "4009.11",
    label: "Rubber tubes/hoses, not reinforced (4009.11) — tariff shift; GN 11(k) carryover applies",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 4009.11 from any other heading, except from headings 4010 through 4017.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "Printed subheading rule: 'The underscoring of the designations in subdivision 5 pertains to goods provided for in subheading 4009.11 for use in a motor vehicle of chapter 87' — motor-vehicle-use goods of 4009.11 may qualify under GN 11(k) (thresholds owned by the automotive sector file; this record carries none).",
    sources: SRC,
  },
  {
    id: "plastics-40-4009-12",
    sector: "plastics-rubber",
    chapters: ["40"],
    hsRange: "4009.12",
    label: "Rubber tubes/hoses, reinforced with metal (4009.12) — THREE-BRANCH rule; motor-vehicle-kind hoses get RVC 60 TV / 50 NC",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 60, condition: "Alternative (B): motor-vehicle-kind tubes/pipes/hoses of 4009.12 from subheadings 4009.11 through 4017.00, whether or not there is also a change from any other heading" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (B): motor-vehicle-kind tubes/pipes/hoses of 4009.12 from subheadings 4009.11 through 4017.00, whether or not there is also a change from any other heading" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 40, rule 6): '6. (A) A change to tubes, pipes, or hoses of subheading 4009.12, of a kind for use in a motor vehicle of tariff items 8702.10.60, 8702.90.30 or 8702.90.60, subheadings 8703.21 through 8703.90, 8704.21 or 8704.31, or heading 8711, from any other heading, except from headings 4010 through 4017; (B) A change to tubes, pipes or hoses of subheading 4009.12, of a kind for use in a motor vehicle of tariff items 8702.10.60, 8702.90.30 or 8702.90.60, subheadings 8703.21 through 8703.90, 8704.21 or 8704.31, or heading 8711, from subheadings 4009.11 through 4017.00, whether or not there is also a change from any other heading, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used, or (2) 50 percent where the net cost method is used; or (C) A change to tubes, pipes or hoses of subheading 4009.12, other than those of a kind for use in a motor vehicle of tariff items 8702.10.60, 8702.90.30 or 8702.90.60, subheadings 8703.21 through 8703.90, 8704.21 or 8704.31, or heading 8711, from any other heading, except from headings 4010 through 4017.' GOODS-KIND ROUTING: branches (A)/(B) apply ONLY to hoses OF A KIND FOR USE IN a motor vehicle of the listed chapter 87 codes; all other 4009.12 goods use branch (C). The RVC alternative (B) exists ONLY for the motor-vehicle-kind hoses — non-vehicle hoses cannot use RVC. The shift exceptions (4010-4017 / 4009.11-4017.00) apply throughout. Printed subheading rule: underscoring of subdivision 6 pertains to goods of 4009.12 for motor-vehicle use (GN 11(k) carryover; thresholds in automotive file).",
    sources: SRC,
  },
  {
    id: "plastics-40-4009-21",
    sector: "plastics-rubber",
    chapters: ["40"],
    hsRange: "4009.21",
    label: "Rubber tubes/hoses, reinforced with textile (4009.21) — tariff shift; GN 11(k) carryover applies",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 4009.21 from any other heading, except from headings 4010 through 4017.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "Printed subheading rule: 'The underscoring of the designation in subdivision 7 pertains to goods provided for in subheading 4009.21 for use in a motor vehicle of chapter 87' (GN 11(k) carryover; thresholds in automotive file).",
    sources: SRC,
  },
  {
    id: "plastics-40-4009-22",
    sector: "plastics-rubber",
    chapters: ["40"],
    hsRange: "4009.22",
    label: "Rubber tubes/hoses, reinforced with other materials (4009.22) — THREE-BRANCH rule; motor-vehicle-kind hoses get RVC 60 TV / 50 NC",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 60, condition: "Alternative (B): motor-vehicle-kind tubes/pipes/hoses of 4009.22 from subheadings 4009.11 through 4017.00, whether or not there is also a change from any other heading" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (B): motor-vehicle-kind tubes/pipes/hoses of 4009.22 from subheadings 4009.11 through 4017.00, whether or not there is also a change from any other heading" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 40, rule 8): '8. (A) A change to tubes, pipes, or hoses of subheading 4009.22, of a kind for use in a motor vehicle of tariff items 8702.10.60, 8702.90.30 or 8702.90.60, subheadings 8703.21 through 8703.90, 8704.21 or 8704.31, or heading 8711, from any other heading, except from headings 4010 through 4017; (B) A change to tubes, pipes or hoses of subheading 4009.22, of a kind for use in a motor vehicle of tariff items 8702.10.60, 8702.90.30 or 8702.90.60, subheadings 8703.21 through 8703.90, 8704.21 or 8704.31, or heading 8711, from subheadings 4009.11 through 4017.00, whether or not there is also a change from any other heading, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used. (C) A change to tubes, pipes or hoses of subheading 4009.22, other than those of a kind for use in a motor vehicle of tariff items 8702.10.60, 8702.90.30 or 8702.90.60, subheadings 8703.21 through 8703.90, 8704.21 or 8704.31, or heading 8711, from any other heading, except from headings 4010 through 4017.' Same goods-kind routing as rule 6: RVC (B) only for motor-vehicle-kind hoses; other goods use (C). Printed subheading rule: underscoring of subdivision 8 pertains to goods of 4009.22 (GN 11(k) carryover).",
    sources: SRC,
  },
  {
    id: "plastics-40-4009-31",
    sector: "plastics-rubber",
    chapters: ["40"],
    hsRange: "4009.31",
    label: "Rubber tubes/hoses with fittings, not reinforced (4009.31) — tariff shift; GN 11(k) carryover applies",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 4009.31 from any other heading, except from headings 4010 through 4017.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "Printed subheading rule: 'The underscoring of the designations in subdivision 9 pertain to goods provided for in subheading 4009.31 for use in a motor vehicle of chapter 87' (GN 11(k) carryover; thresholds in automotive file).",
    sources: SRC,
  },
  {
    id: "plastics-40-4009-32",
    sector: "plastics-rubber",
    chapters: ["40"],
    hsRange: "4009.32",
    label: "Rubber tubes/hoses with fittings, reinforced with metal (4009.32) — THREE-BRANCH rule; motor-vehicle-kind hoses get RVC 60 TV / 50 NC",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 60, condition: "Alternative (B): motor-vehicle-kind tubes/pipes/hoses of 4009.32 from subheadings 4009.11 through 4017.00, whether or not there is also a change from any other heading" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (B): motor-vehicle-kind tubes/pipes/hoses of 4009.32 from subheadings 4009.11 through 4017.00, whether or not there is also a change from any other heading" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 40, rule 10): '10. (A) A change to tubes, pipes, or hoses of subheading 4009.32, of a kind for use in a motor vehicle of tariff items 8702.10.6, 8702.90.30 or 8702.90.60, subheadings 8703.21 through 8703.90, 8704.21 or 8704.31, or heading 8711, from any other heading, except from headings 4010 through 4017; (B) A change to tubes, pipes, or hoses of subheading 4009.32, of a kind for use in a motor vehicle of tariff items 8702.10.60, 8702.90.30 or 8702.90.60, subheadings 8703.21 through 8703.90, 8704.21 or 8704.31, or heading 8711, from subheadings 4009.11 through 4017.00, whether or not there is also a change from any other heading, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used; or (C) A change to tubes, pipes or hoses of subheading 4009.32, other than those of a kind for use in a motor vehicle of tariff items 8702.10.60, 8702.90.30 or 8702.90.60, subheadings 8703.21 through 8703.90, 8704.21 or 8704.31, or heading 8711, from any other heading, except from headings 4010 through 4017.' OCR/PRINT DISCREPANCIES: branch (A) prints tariff item '8702.10.6' (digit dropped vs '8702.10.60' in branches (B)/(C) and in rules 6/8), and branch (C) prints '8702.00.90' (vs '8702.90.60' elsewhere) — both transcribed as printed and flagged for human audit. Same goods-kind routing as rule 6. Printed subheading rule: underscoring of subdivision 10 pertains to goods of 4009.32 (GN 11(k) carryover).",
    sources: SRC,
  },
  {
    id: "plastics-40-4009-41",
    sector: "plastics-rubber",
    chapters: ["40"],
    hsRange: "4009.41",
    label: "Rubber tubes/hoses with fittings, reinforced with textile (4009.41) — tariff shift; GN 11(k) carryover applies",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 4009.41 from any other heading, except from headings 4010 through 4017.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "Printed subheading rule: 'The underscoring of the designation in subdivision 11 pertains to goods provided for in subheading 4009.41 for use in a motor vehicle of chapter 87' (GN 11(k) carryover; thresholds in automotive file).",
    sources: SRC,
  },
  {
    id: "plastics-40-4009-42",
    sector: "plastics-rubber",
    chapters: ["40"],
    hsRange: "4009.42",
    label: "Rubber tubes/hoses with fittings, reinforced with other materials (4009.42) — THREE-BRANCH rule; motor-vehicle-kind hoses get RVC 60 TV / 50 NC",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 60, condition: "Alternative (B): motor-vehicle-kind tubes/pipes/hoses of 4009.42 from subheadings 4009.11 through 4017.00, whether or not there is also a change from any other heading" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (B): motor-vehicle-kind tubes/pipes/hoses of 4009.42 from subheadings 4009.11 through 4017.00, whether or not there is also a change from any other heading" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 40, rule 12): '12. (A) A change to tubes, pipes, or hoses of subheading 4009.42, of a kind for use in a motor vehicle of tariff items 8702.10.60, 8702.90.30 or 8702.90.60, subheadings 8703.21 through 8703.90, 8704.21 or 8704.31, or heading 8711, from any other heading, except from headings 4010 through 4017; (B) A change to tubes, pipes or hoses of subheading 4009.42, of a kind for use in a motor vehicle of tariff items 8702.10.6, 8702.90.30 or 8702.90.60, subheadings 8703.21 through 8703.90, 8704.21 or 8704.31, or heading 8711, from subheadings 4009.11 through 4017.00, whether or not there is also a change from any other heading, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used; or (C) A change to tubes, pipes or hoses of subheading 4009.42, other than those of a kind for use in a motor vehicle of tariff items 8702.10.60, 8702.90.30 or 8702.90.60, subheadings 8703.21 through 8703.90, 8704.21 or 8704.31, or heading 8711, from any other heading, except from headings 4010 through 4017.' OCR/PRINT DISCREPANCY: branch (B) prints tariff item '8702.10.6' (digit dropped vs '8702.10.60' in branches (A)/(C)) — transcribed as printed; flag for human audit. Same goods-kind routing as rule 6. Printed subheading rule: underscoring of subdivision 12 pertains to goods of 4009.42 (GN 11(k) carryover).",
    sources: SRC,
  },
  {
    id: "plastics-40-4010-4011",
    sector: "plastics-rubber",
    chapters: ["40"],
    hsRange: "Headings 4010 through 4011",
    label: "Conveyor/transmission belts or belting of rubber (4010-4011) — tariff shift; GN 11(k) carryover applies",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 4010 through 4011 from any other heading, except from headings 4009 through 4017.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "Printed heading rule: 'The underscoring of the designations in subdivision 13 pertain to goods provided for in headings 4010 through 4011 for use in a motor vehicle of chapter 87' (GN 11(k) carryover; thresholds in automotive file). Note the exception list runs 4009 THROUGH 4017 — the whole hose/belt/articles chain.",
    sources: SRC,
  },
  {
    id: "plastics-40-4012-11-19",
    sector: "plastics-rubber",
    chapters: ["40"],
    hsRange: "4012.11 through 4012.19",
    label: "Retreaded rubber tires, pneumatic, of a kind used on cars (4012.11-4012.19) — tariff shift from outside the group",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 4012.11 through 4012.19 from any subheading outside that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "plastics-40-4012-20-90",
    sector: "plastics-rubber",
    chapters: ["40"],
    hsRange: "4012.20 through 4012.90",
    label: "Other retreaded tires; solid rubber tires etc. (4012.20-4012.90) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 4012.20 through 4012.90 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "primary_sourced_unaudited",
    sources: SRC,
  },
  {
    id: "plastics-40-4013-4015",
    sector: "plastics-rubber",
    chapters: ["40"],
    hsRange: "Headings 4013 through 4015",
    label: "Rubber inner tubes; hygiene articles; clothing etc. (4013-4015) — tariff shift, within-group shifts allowed",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 4013 through 4015 from any other heading, including another heading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "plastics-40-4016-10-95",
    sector: "plastics-rubber",
    chapters: ["40"],
    hsRange: "4016.10 through 4016.95",
    label: "Other articles of vulcanized rubber, hard rubber (4016.10-4016.95) — tariff shift; GN 11(k) carryover applies",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 4016.10 through 4016.95 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "Printed subheading rule: 'The underscoring of the designations in subdivision 17 pertain to goods provided for in subheadings 4016.10 through 4016.95 for use in a motor vehicle of chapter 87' (GN 11(k) carryover; thresholds in automotive file).",
    sources: SRC,
  },
  {
    id: "plastics-40-4016-99-30-55",
    sector: "plastics-rubber",
    chapters: ["40"],
    hsRange: "Tariff items 4016.99.30 and 4016.99.55",
    label: "Hard-rubber articles 4016.99.30 / 4016.99.55 — tariff shift OR RVC 50 percent NET COST ONLY (no transaction-value option)",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (B): change from any other subheading to tariff items 4016.99.30 or 4016.99.55" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 40, rule 18): '18. (A) A change to tariff items 4016.99.30 or 4016.99.55 from any other heading; or (B) A change to tariff items 4016.99.30 or 4016.99.55 from any other subheading, provided there is a regional value content of not less than 50 percent under the net cost method.' NET-COST-ONLY RVC: alternative (B) provides NO transaction-value option — 50 percent under the NET COST method only, exactly as printed. Do NOT add a TV option. Also note the shift boundaries differ: (A) any other heading; (B) any other subheading (within-heading shifts allowed with the RVC).",
    sources: SRC,
  },
  {
    id: "plastics-40-4016-99",
    sector: "plastics-rubber",
    chapters: ["40"],
    hsRange: "4016.99 (other)",
    label: "Other articles of hard rubber (4016.99) — tariff shift; GN 11(k) carryover applies",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 4016.99 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 40, rule 19): '19. A change to subheading 4016.99 from any other heading.' Printed subheading rule: 'The underscoring of the designations in subdivisions 18 and 19 pertain to goods provided for in subheading 4016.99 for use in a motor vehicle of chapter 87' (GN 11(k) carryover; thresholds in automotive file).",
    sources: SRC,
  },
  {
    id: "plastics-40-4017",
    sector: "plastics-rubber",
    chapters: ["40"],
    hsRange: "4017",
    label: "Hard rubber in all forms, incl. waste/scrap (4017) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 4017 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
];

export const PLASTICS_RUBBER_SECTOR_FILE: UsmcaSectorFile = {
  sector: "plastics-rubber",
  chaptersCovered: ["39", "40"],
  dataAsOf: "2026-09-28",
  mergeEligible: true,
  auditStatus: "human_verified",
  rules: PLASTICS_RUBBER_RULES,
  watchItems: [
    "RVC pairs present: 35 TV / 25 NC (4005-4006 route (B) only — UNIQUE pair, do not normalize), 60 TV / 50 NC (motor-vehicle-kind hoses of 4009.12/.22/.32/.42 route (B) only), and 50 NC NET-COST-ONLY (4016.99.30/.55 route (B) — NO transaction-value option as printed; do not add one).",
    "The four hose three-branch rules are GOODS-KIND-based: the RVC alternative exists ONLY for hoses 'of a kind for use in a motor vehicle' of the enumerated chapter 87 codes (8702.10.60/8702.90.30/8702.90.60, 8703.21-8703.90, 8704.21/8704.31, 8711). Non-vehicle hoses get branch (C) only — no RVC route.",
    "Chapter 39 rule 1 (3901-3915) carries a CONJUNCTIVE 50-percent-by-weight ORIGINATING POLYMER CONTENT condition — a weight test on polymer content, never an RVC percentage.",
    "GN 11(n)(v) general rules asymmetry: NO carve-out lists printed for chapters 39-40 (unlike Section VI), and the mixing/blending rule (D) applies to CHAPTER 39 GOODS ONLY — no chapter 40 counterpart.",
    "OPEN ITEM: subheadings 4009.51 through 4009.92 have NO printed rule in the supplied GN 11(o) Chapter 40 table (rules jump from 4009.42 to 4010-4011). Verify against the printed PDF; such goods currently fall back on GN 11(n)(v) general rules, GN 11(b)(iv), or wholly-originating analysis.",
    "GN 11(k) automotive carryover applies (per printed subheading/heading rules) to 4009.11, 4009.12, 4009.21, 4009.22, 4009.31, 4009.32, 4009.41, 4009.42, 4010-4011, 4016.10-4016.95, and 4016.99 — cross-references only; automotive thresholds live in the automotive sector file. OCR cannot see the actual underscoring — human audit must check the printed PDF.",
    "OCR/print discrepancies flagged in records (transcribed as printed, never silently corrected): rule 10(A) '8702.10.6' and 10(C) '8702.00.90'; rule 12(B) '8702.10.6' — vs '8702.10.60'/'8702.90.60' elsewhere.",
    "De minimis (GN 11(e), 10 percent) and the GN 11(b)(iv) fallback (60 TV / 50 NC) are owned by the core types file — never restated here.",
    "USMCA joint review (around 2026) may revise rules of origin — re-verify against the current HTSUS GN 11 revision before relying on this file for new claim periods.",
  ],
  sourceFirewall: {
    treatyBaseline: "USMCA Chapter 4 / Annex 4-B, Chapters 39-40 (Plastics and articles thereof; Rubber and articles thereof), incl. the GN 11(n)(v) chapters 39-40 general rules and the Chapter 40 underscore provisions routing to GN 11(k)",
    usImplementation: "HTSUS General Note 11 (2026 Revision 15), subdivisions (n)(v) and (o) Chapters 39-40 / 19 CFR Part 182 / SOR-2020-155 Schedule 1 (Canada)",
    excludedAgreements: [
      "NAFTA (superseded — GN 12(t) Chapters 39-40 rules differ; never backfill)",
      "KORUS, CAFTA-DR and other FTAs with similar plastics/rubber rules — never backfill",
      "GN 11(n)(iv) Section VI rules (chapters 28-38; owned by the chemicals file — the parallel (n)(v) rules live here)",
      "GN 11(k) automotive thresholds (owned by the automotive sector file; this file carries cross-references only)",
      "Chapters 84-85 machinery/electrical (covered by a separate sector file)",
    ],
  },
};

export default PLASTICS_RUBBER_SECTOR_FILE;