/**
 * USMCA Wood and Articles of Wood Rules of Origin —
 * HS Chapters 44-46 pass, unified-schema sector file for OrigynLX.
 * Modeled on the automotive sector file (AUTOMOTIVE_SECTOR_FILE) template.
 * REVISION 1: transcribed VERBATIM from HTSUS General Note 11 (2026
 * Revision 15), as supplied in the official USITC PDF
 * ("General Note 11_2026HTSRev15.pdf"): the complete GN 11(o)
 * Chapters 44-46 product-specific rules of origin tables (pp. 41-42).
 *
 * CHAPTERS COVERED BY THIS FILE (for the calculator's chapter routing):
 *   44 Wood and articles of wood; wood charcoal
 *   45 Cork and articles of cork
 *   46 Manufactures of straw, esparto, plaiting materials, baskets
 *
 * WHAT IS IN THIS PASS (7 records):
 *  - Chapter 44 (1 numbered rule -> 1 record): a single heading-GROUP
 *    rule covering ALL of 4401 through 4421 — shift from any other
 *    heading, INCLUDING another heading within that group (intra-group
 *    shifts qualify — "including" is a permission, not an exception).
 *  - Chapter 45 (4 rules -> 4 records): 4501-4502 group rule with the
 *    same intra-group permission; then the 4503.10 GOOD-LEVEL rule
 *    (a change to a good of subheading 4503.10 from any other good
 *    within that subheading or any other subheading — the only
 *    good-level formulation in this pass); then plain heading-level
 *    shifts for 4503.90 and 4504.
 *  - Chapter 46 (2 rules -> 2 records): 4601 chapter-level shift;
 *    4602 heading-level shift.
 *
 * NO RVC ANYWHERE IN CHAPTERS 44-46. No phased rules. No subheading
 * RVC rules or chapter rules print for this range (no GN 11(k) carryover
 * here).
 *
 * OVERLAP RULE (do not create two-files-two-numbers bugs):
 *   - De minimis (GN 11(e), 10 percent) is OWNED by the core types file.
 *   - GN 11(b)(iv) fallback (60 TV / 50 NC) is OWNED by the core types file.
 *   - Chapters 43 and 47 rules (hides file / pulp-paper file) own their
 *     own ranges; this file routes 44-46 only.
 */
import type { UsmcaRule, UsmcaSectorFile, UsmcaSource } from "../usmca-rule-types";

const HTS_GN11_2026: UsmcaSource = {
  authority: "USITC",
  title: "Harmonized Tariff Schedule of the United States (2026) Revision 15 — General Note 11, United States-Mexico-Canada Agreement, subdivision (o) (Chapters 44-46 product-specific rules of origin tables)",
  url: "https://hts.usitc.gov/download",
  reference: "GN 11(o) Ch. 44 (rule 1, p. 41), Ch. 45 (rules 1-4, p. 42), Ch. 46 (rules 1-2, p. 42)",
};

const USTR_CH4_TEXT: UsmcaSource = {
  authority: "USTR",
  title: "USMCA Chapter 4 (Rules of Origin) legal text, incl. Annex 4-B (Product-Specific Rules of Origin), Chapters 44-46",
  url: "https://ustr.gov/sites/default/files/files/agreements/FTA/USMCA/Text/04-Rules-of-Origin.pdf",
  reference: "Annex 4-B Chapters 44-46 — treaty source of the same rules",
};

const GAC_CUSMA_CH4: UsmcaSource = {
  authority: "Global Affairs Canada",
  title: "CUSMA Chapter 4 — Rules of Origin (consolidated official text)",
  url: "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/cusma-aceum/text-texte/04.aspx?lang=eng",
  reference: "Annex 4-B Chapters 44-46 rules (corroborating official text)",
};

const SRC = [HTS_GN11_2026, USTR_CH4_TEXT, GAC_CUSMA_CH4];

export const WOOD_RULES: UsmcaRule[] = [
  // ---------------- Chapter 44 ----------------
  {
    id: "wood-44-4401-4421",
    sector: "wood",
    chapters: ["44"],
    hsRange: "Headings 4401 through 4421",
    label: "All of Chapter 44 (4401–4421) — single group rule: heading-level shift from any other heading, INCLUDING another heading within that group",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to headings 4401 through 4421 from any other heading, including another heading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 44, rule 1): '1. A change to headings 4401 through 4421 from any other heading, including another heading within that group.' The ONLY rule for all of Chapter 44: heading-level shift with an EXPLICIT PERMISSION for intra-group shifts ('including' — lumber of 4407 may shift to furniture blanks of 4415 etc. within 4401-4421 and still originate). Note the rule prints at HEADING level with the intra-group permission, not the usual chapter-level 'from any other chapter'.",
    sources: SRC,
  },
  // ---------------- Chapter 45 ----------------
  {
    id: "wood-45-4501-4502",
    sector: "wood",
    chapters: ["45"],
    hsRange: "Headings 4501 through 4502",
    label: "Raw cork and waste cork (4501–4502) — group rule: heading-level shift from any other heading, INCLUDING another heading within that group",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to headings 4501 through 4502 from any other heading, including another heading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 45, rule 1): '1. A change to headings 4501 through 4502 from any other heading, including another heading within that group.' Same intra-group permission pattern as Chapter 44 rule 1 (4501-to-4502 shifts qualify).",
    sources: SRC,
  },
  {
    id: "wood-45-4503-10",
    sector: "wood",
    chapters: ["45"],
    hsRange: "Subheading 4503.10",
    label: "Corks and stoppers of natural cork (4503.10) — GOOD-LEVEL rule: shift from any other good within that subheading or any other subheading",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 45, rule 2): '2. A change to a good of subheading 4503.10 from any other good within that subheading or any other subheading.' GOOD-LEVEL formulation (the only one in this pass): even intra-subheading good-to-good changes of 4503.10 may qualify — cut corks may shift from other 4503.10 goods (e.g. from blocks/slabs also of 4503.10) or from any other subheading (4501/4502 cork inputs qualify). Not an RVC and not a plain heading shift — the engine must check change at the GOOD level here.",
    sources: SRC,
  },
  {
    id: "wood-45-4503-90",
    sector: "wood",
    chapters: ["45"],
    hsRange: "Subheading 4503.90",
    label: "Other articles of natural cork (4503.90) — heading-level shift from any other heading",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 4503.90 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 45, rule 3): '3. A change to subheading 4503.90 from any other heading.' Heading-level shift: intra-45 shifts from 4503.10 corks do NOT qualify (4503.10 is inside heading 45.03).",
    sources: SRC,
  },
  {
    id: "wood-45-4504",
    sector: "wood",
    chapters: ["45"],
    hsRange: "Heading 4504",
    label: "Agglomerated cork and articles thereof (4504) — heading-level shift from any other heading",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 4504 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 45, rule 4): '4. A change to heading 4504 from any other heading.' Heading-level shift: natural-cork inputs of 4501-4503 qualify; finished agglomerated-cork articles of 4504 do not re-qualify.",
    sources: SRC,
  },
  // ---------------- Chapter 46 ----------------
  {
    id: "wood-46-4601",
    sector: "wood",
    chapters: ["46"],
    hsRange: "Heading 4601",
    label: "Plaits and plaiting materials; basketware of plaiting materials (4601) — chapter-level shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 4601 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 46, rule 1): '1. A change to heading 4601 from any other chapter.' Standard chapter-level shift — intra-chapter 4601-to-4602 shifts do NOT qualify under this rule (see 4602).",
    sources: SRC,
  },
  {
    id: "wood-46-4602",
    sector: "wood",
    chapters: ["46"],
    hsRange: "Heading 4602",
    label: "Basketwork, wickerwork and other articles of plaiting materials (4602) — heading-level shift from any other heading",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 4602 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 46, rule 2): '2. A change to heading 4602 from any other heading.' HEADING-level shift (not chapter): plaiting-material inputs of 4601 (own chapter) DO qualify for 4602 basketware — but finished 4602 basketware does not re-qualify. Flagged for audit alongside 4302/1520/1704 as a heading-level shift printed where a chapter-level shift might be expected.",
    sources: SRC,
  },
];

export const WOOD_SECTOR_FILE: UsmcaSectorFile = {
  sector: "wood",
  chaptersCovered: ["44", "45", "46"],
  dataAsOf: "2026-09-28",
  mergeEligible: true,
  auditStatus: "human_verified",
  rules: WOOD_RULES,
  watchItems: [
    "NO TV/NC RVC ANYWHERE in Chapters 44-46 — all rules are tariff shifts (one good-level special). Never offer TV/NC except via the core file's GN 11(b)(iv) fallback.",
    "Chapter 44 is ONE rule for the WHOLE chapter (4401-4421): heading-level shift with an EXPLICIT INTRA-GROUP PERMISSION ('including another heading within that group'). The calculator's shift engine must treat 'including' as a permission (intra-44 shifts qualify), not an exception.",
    "GOOD-LEVEL rule at 4503.10: 'a change to a good of subheading 4503.10 from any other good within that subheading or any other subheading' — the only good-level formulation in this pass; even intra-subheading good changes qualify. Distinct from the good-level reversible-tanning branches in ch. 41.",
    "Heading-level shifts printed where chapter level might be expected: 4401-4421 (with intra-group permission), 4501-4502 (same), 4503.90, 4504, 4602. In particular 4602 permits inputs from own-chapter 4601 while 4601 requires a chapter-level shift — the two Chapter 46 rules use DIFFERENT shift levels.",
    "4503.90 cannot source from 4503.10 (both inside heading 45.03 — heading-level shift blocks it); verify the engine resolves this correctly.",
    "No GN 11(k) carryover, no subheading RVC rules, no chapter rules, no phased rules print for chapters 44-46.",
    "De minimis (GN 11(e), 10 percent) and the GN 11(b)(iv) fallback (60 TV / 50 NC) are owned by the core types file — never restated here.",
    "USMCA joint review (around 2026) may revise rules of origin — re-verify against the current HTSUS GN 11 revision before relying on this file for new claim periods.",
  ],
  sourceFirewall: {
    treatyBaseline: "USMCA Chapter 4 / Annex 4-B, Chapters 44-46 (Wood and articles of wood; Cork and articles of cork; Manufactures of straw, esparto and basketware)",
    usImplementation: "HTSUS General Note 11 (2026 Revision 15), subdivision (o) Chapters 44-46 / 19 CFR Part 182 / SOR-2020-155 Schedule 1 (Canada)",
    excludedAgreements: [
      "NAFTA (superseded — GN 12(t) Chapters 44-46 rules differ; never backfill)",
      "KORUS, CAFTA-DR and other FTAs with wood/cork/basketware rules — never backfill",
      "Chapters 43 and 47+ product rules (hides file / pulp-paper and later files own their ranges)",
      "Lacey Act / APHIS import controls and anti-dumping/countervailing duty orders on wood (not rules of origin — out of scope)",
    ],
  },
};

export default WOOD_SECTOR_FILE;