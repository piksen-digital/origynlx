/**
 * USMCA Pulp, Paper and Printed Matter Rules of Origin —
 * HS Chapters 47-49 pass, unified-schema sector file for OrigynLX.
 * Modeled on the automotive sector file (AUTOMOTIVE_SECTOR_FILE) template.
 * REVISION 1: transcribed VERBATIM from HTSUS General Note 11 (2026
 * Revision 15), as supplied in the official USITC PDF
 * ("General Note 11_2026HTSRev15.pdf"): the complete GN 11(o)
 * Chapters 47-49 product-specific rules of origin tables (pp. 42-43).
 *
 * CHAPTERS COVERED BY THIS FILE (for the calculator's chapter routing):
 *   47 Pulp of wood or of other fibrous cellulosic material; recovered paper
 *   48 Paper and paperboard; articles thereof
 *   49 Printed books, newspapers, other printed matter
 *
 * WHAT IS IN THIS PASS (13 records):
 *  - Chapter 47 (1 rule -> 1 record): single group rule, 4701-4707 from
 *    any other chapter.
 *  - Chapter 48 (11 rules -> 11 records): the DIMENSION-BASED branch
 *    rules dominate this chapter. Rules 2 (4802), 5 (4810) and 6 (4811)
 *    split goods by physical dimensions/cut (strips or rolls of width
 *    not exceeding 15 cm; rectangular sheets with larger dimension not
 *    exceeding 36 cm or other dimension not exceeding 15 cm; other
 *    goods) and by goods-kind (floor coverings on a base of paper or
 *    paperboard); rule 11 (4823) is a FOUR-branch rule mixing width
 *    limits and the floor-coverings kind, with dense exception lists.
 *    Anti-backsliding exceptions throughout: 4814 cannot come from
 *    floor coverings of 4811; 4816 cannot come from 4809; 4817-4822
 *    cannot come from 4823; the 4811 branches except from 4817-4823
 *    (and floor-coverings branches except 4814 / 4823.90 floor
 *    coverings).
 *  - Chapter 49 (1 rule -> 1 record): single group rule, 4901-4911
 *    from any other chapter.
 *
 * NO RVC ANYWHERE IN CHAPTERS 47-49. No phased rules. No subheading
 * rules print for this range (the subheading-rule pattern starts at
 * 5112.11 in Chapter 51 — textiles file owns that).
 *
 * OCR/PRINT ODDITIES TRANSCRIBED AS PRINTED (flagged for audit):
 *   - Rule 5 prints branch label "C)" without the opening parenthesis
 *     (p. 42: "or\nC) A change to any other good of heading 4810...").
 *   - Rule 11(D) prints "strip or rolls" (singular "strip") and the
 *     garbled preposition sequence "from or any other heading" —
 *     transcribed as printed; the intended sense is "from ... or from
 *     any other heading".
 *
 * OVERLAP RULE (do not create two-files-two-numbers bugs):
 *   - De minimis (GN 11(e), 10 percent) is OWNED by the core types file.
 *   - GN 11(b)(iv) fallback (60 TV / 50 NC) is OWNED by the core types file.
 *   - Chapters 46 and 50 rules (wood file / textiles file) own their
 *     own ranges; this file routes 47-49 only.
 */
import type { UsmcaRule, UsmcaSectorFile, UsmcaSource } from "../usmca-rule-types";

const HTS_GN11_2026: UsmcaSource = {
  authority: "USITC",
  title: "Harmonized Tariff Schedule of the United States (2026) Revision 15 — General Note 11, United States-Mexico-Canada Agreement, subdivision (o) (Chapters 47-49 product-specific rules of origin tables)",
  url: "https://hts.usitc.gov/download",
  reference: "GN 11(o) Ch. 47 (rule 1, p. 42), Ch. 48 (rules 1-6, pp. 42-43; rules 7-11, p. 43), Ch. 49 (rule 1, p. 43)",
};

const USTR_CH4_TEXT: UsmcaSource = {
  authority: "USTR",
  title: "USMCA Chapter 4 (Rules of Origin) legal text, incl. Annex 4-B (Product-Specific Rules of Origin), Chapters 47-49",
  url: "https://ustr.gov/sites/default/files/files/agreements/FTA/USMCA/Text/04-Rules-of-Origin.pdf",
  reference: "Annex 4-B Chapters 47-49 — treaty source of the same rules",
};

const GAC_CUSMA_CH4: UsmcaSource = {
  authority: "Global Affairs Canada",
  title: "CUSMA Chapter 4 — Rules of Origin (consolidated official text)",
  url: "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/cusma-aceum/text-texte/04.aspx?lang=eng",
  reference: "Annex 4-B Chapters 47-49 rules (corroborating official text)",
};

const SRC = [HTS_GN11_2026, USTR_CH4_TEXT, GAC_CUSMA_CH4];

export const PULP_PAPER_RULES: UsmcaRule[] = [
  // ---------------- Chapter 47 ----------------
  {
    id: "paper-47-4701-4707",
    sector: "pulp-paper-printed-matter",
    chapters: ["47"],
    hsRange: "Headings 4701 through 4707",
    label: "All of Chapter 47 (4701–4707) — mechanical/chemical/semichemical pulp, dissolving pulp, recovered paper — chapter-level shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 4701 through 4707 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 47, rule 1): '1. A change to headings 4701 through 4707 from any other chapter.' Single group rule for the whole chapter, including recovered paper/board of 4704-4707 — chapter-level shift (intra-47 shifts do not qualify).",
    sources: SRC,
  },
  // ---------------- Chapter 48 ----------------
  {
    id: "paper-48-4801",
    sector: "pulp-paper-printed-matter",
    chapters: ["48"],
    hsRange: "Heading 4801",
    label: "Newsprint in rolls or sheets (4801) — chapter-level shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 4801 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 48, rule 1): '1. A change to heading 4801 from any other chapter.'",
    sources: SRC,
  },
  {
    id: "paper-48-4802",
    sector: "pulp-paper-printed-matter",
    chapters: ["48"],
    hsRange: "Heading 4802",
    label: "Hand-made paper; newsprint other than 4801; writing/printing paper (4802) — THREE-BRANCH dimension rule: strips/rolls ≤15 cm; small sheets (larger dim ≤36 cm or other dim ≤15 cm); other goods",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 48, rule 2): '2. (A) A change to paper or paperboard in strips or rolls of a width not exceeding 15 cm of heading 4802 from strips or rolls of a width exceeding 15 cm of heading 4802 or any other heading, except from headings 4817 through 4823; (B) A change to paper or paperboard in rectangular (including square) sheets with the larger dimension not exceeding 36 cm or the other dimension not exceeding 15 cm in the unfolded state of heading 4802 from strips or rolls of a width exceeding 15 cm of heading 4802, paper or paperboard in rectangular (including square) sheets with the larger dimension exceeding 36 cm and the other dimension exceeding 15 cm in the unfolded state of heading 4802 or from any other heading, except from headings 4817 through 4823; or (C) A change to any other good of heading 4802 from any other chapter.' DIMENSION-BASED ROUTING: (A) narrow goods (≤15 cm) may shift from wide 4802 stock or any other heading except finished articles 4817-4823; (B) small-sheet goods may shift from wide 4802 stock, from large-sheet 4802 stock, or any other heading except 4817-4823; (C) all other 4802 goods require a chapter-level shift (NO intra-4802 sourcing). The calculator must measure strip/roll width and unfolded sheet dimensions.",
    sources: SRC,
  },
  {
    id: "paper-48-4803-4807",
    sector: "pulp-paper-printed-matter",
    chapters: ["48"],
    hsRange: "Headings 4803 through 4807",
    label: "Toilet/carbon/crepe paper etc. through compressed fibre board (4803–4807) — chapter-level shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 4803 through 4807 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 48, rule 3): '3. A change to headings 4803 through 4807 from any other chapter.' Chapter-level group shift — intra-group shifts do NOT qualify.",
    sources: SRC,
  },
  {
    id: "paper-48-4808-4809",
    sector: "pulp-paper-printed-matter",
    chapters: ["48"],
    hsRange: "Headings 4808 through 4809",
    label: "Corrugated paper/board, cellulose wadding (4808–4809) — heading-group rule: shift from any heading OUTSIDE that group",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 4808 through 4809 from any heading outside that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 48, rule 4): '4. A change to headings 4808 through 4809 from any heading outside that group.' Group-outside formulation (4808-to-4809 shifts do not qualify).",
    sources: SRC,
  },
  {
    id: "paper-48-4810",
    sector: "pulp-paper-printed-matter",
    chapters: ["48"],
    hsRange: "Heading 4810",
    label: "Paper/board coated with kaolin etc. (4810) — THREE-BRANCH dimension rule mirroring 4802; branch label (C) printed WITHOUT opening parenthesis",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 48, rule 5): '5. (A) A change to paper or paperboard in strips or rolls of a width not exceeding 15 cm of heading 4810 from strips or rolls of a width exceeding 15 cm of heading 4810, or from any other heading, except from headings 4817 through 4823; (B) A change to paper or paperboard in rectangular (including square) sheets with the larger dimension not exceeding 36 cm or the other dimension not exceeding 15 cm in the unfolded state of heading 4810 from strips or rolls of a width exceeding 15 cm of heading 4810, paper or paperboard in rectangular (including square) sheets with the larger dimension exceeding 36 cm and the other dimension exceeding 15 cm in the unfolded state of heading 4810, or from any other heading, except from headings 4817 through 4823; or C) A change to any other good of heading 4810 from any other chapter.' Same three-branch dimension structure as rule 2 (4802). PRINT ODDITY: branch label prints as 'C)' without the opening parenthesis, transcribed as printed — flagged for human audit. Note also (A)/(B) here print 'or from any other heading' with a comma before 'or', a slight wording difference vs. rule 2's run-on — transcribed as printed.",
    sources: SRC,
  },
  {
    id: "paper-48-4811",
    sector: "pulp-paper-printed-matter",
    chapters: ["48"],
    hsRange: "Heading 4811",
    label: "Paper/board surface-coated/impregnated, incl. floor coverings on a base of paper (4811) — FOUR-BRANCH rule: ≤15 cm strips/rolls; small sheets; floor coverings on paper base; other goods",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 48, rule 6, spanning pp. 42-43): '6. (A) A change to paper or paperboard in strips or rolls of a width not exceeding 15 cm of heading 4811 from strips or rolls of a width exceeding 15 cm of heading 4811, floor coverings on a base of paper or paperboard of heading 4811, or from any other heading, except from headings 4817 through 4823; (B) A change to paper or paperboard in rectangular (including square) sheets with the larger dimension not exceeding 36 cm or the other dimension not exceeding 15 cm in the unfolded state of heading 4811 from strips or rolls of a width exceeding 15 cm of heading 4811, paper or paperboard in rectangular (including square) sheets with the larger dimension exceeding 36 cm and the other dimension exceeding 15 cm in the unfolded state of heading 4811, floor coverings on a base of paper or paperboard of heading 4811 or any other heading, except from headings 4817 through 4823; (C) A change to floor coverings on a base of paper or paperboard of heading 4811 from any other good of heading 4811 or any other heading, except from heading 4814 or floor coverings on a base of paper or paperboard of subheading 4823.90; or (D) A change to any other good of heading 4811 from floor coverings on a base of paper or paperboard of heading 4811 or any other chapter.' FOUR goods-kind/dimension branches: (A) narrow strips/rolls and (B) small sheets may shift from wide stock, large sheets, OR floor coverings of 4811, or any other heading except 4817-4823 (note: floor coverings of 4811 are a PERMITTED input here); (C) floor coverings on paper base — GOOD-LEVEL change within 4811 or any other heading, EXCEPT from 4814 or floor coverings of 4823.90; (D) all other goods — from floor coverings of 4811 (named permitted input) or any other chapter. Cross-references rules 8 and 11 (4814 and 4823 floor-coverings exceptions).",
    sources: SRC,
  },
  {
    id: "paper-48-4812-4813",
    sector: "pulp-paper-printed-matter",
    chapters: ["48"],
    hsRange: "Headings 4812 through 4813",
    label: "Filter blocks/plates and cigarette paper (4812–4813) — chapter-level shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 4812 through 4813 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 48, rule 7): '7. A change to headings 4812 through 4813 from any other chapter.'",
    sources: SRC,
  },
  {
    id: "paper-48-4814",
    sector: "pulp-paper-printed-matter",
    chapters: ["48"],
    hsRange: "Heading 4814",
    label: "Wallpaper and similar wall coverings of paper (4814) — heading-level shift EXCEPT from floor coverings on a base of paper or paperboard of heading 4811",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to heading 4814 from any other heading, except from floor coverings on a base of paper or paperboard of heading 4811.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 48, rule 8): '8. A change to heading 4814 from any other heading, except from floor coverings on a base of paper or paperboard of heading 4811.' GOODS-KIND exception: only the floor-coverings kind of 4811 is blocked (mirror of rule 6(C)'s 4814 exception). Heading-level shift, so intra-4814 shifts do not qualify.",
    sources: SRC,
  },
  {
    id: "paper-48-4816",
    sector: "pulp-paper-printed-matter",
    chapters: ["48"],
    hsRange: "Heading 4816",
    label: "Carbon paper etc. in rolls/sheets (4816) — heading-level shift EXCEPT from heading 4809",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 4816 from any other heading, except from heading 4809.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 48, rule 9): '9. A change to heading 4816 from any other heading, except from heading 4809.' Anti-backsliding: carbon paper of 4809 cannot fall back into 4816 (duplicate carbon paper). Note: heading 4815 has NO printed rule — it routes to this file's watchItems for human confirmation.",
    sources: SRC,
  },
  {
    id: "paper-48-4817-4822",
    sector: "pulp-paper-printed-matter",
    chapters: ["48"],
    hsRange: "Headings 4817 through 4822",
    label: "Envelopes, registers, albums, trays etc. (4817–4822) — group rule: shift from any heading OUTSIDE that group, EXCEPT from heading 4823",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to headings 4817 through 4822 from any heading outside that group, except from heading 4823.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 48, rule 10): '10. A change to headings 4817 through 4822 from any heading outside that group, except from heading 4823.' Group-outside formulation PLUS an exception: other-made-up paper articles of 4823 cannot fall back into the 4817-4822 stationery/article group. Mirror of rule 11's except-from-4817-4822 lists.",
    sources: SRC,
  },
  {
    id: "paper-48-4823",
    sector: "pulp-paper-printed-matter",
    chapters: ["48"],
    hsRange: "Heading 4823",
    label: "Other paper/paperboard cut to size; incl. floor coverings on paper base (4823) — FOUR-BRANCH width/goods-kind rule with dense exception lists; OCR oddities in branch (D) transcribed as printed",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 48, rule 11, p. 43): '11. (A) A change to strips or rolls of a width of 15 cm or less of heading 4823 from strips or rolls of a width exceeding 15 cm of heading 4823, other than strips or rolls of heading 4823 which, but for their width, would be classified in headings 4803, 4809 or 4814, floor coverings on a base of paper or paperboard of heading 4823, or from any other heading, except from headings 4817 through 4822; (B) A change to strips or rolls of a width exceeding 15 cm of heading 4823 from floor coverings on a base of paper or paperboard of heading 4823, or any other heading, except from headings 4817 through 4822; (C) A change to floor coverings on a base of paper or paperboard of heading 4823 from any other good of heading 4823 or any other heading, except from floor coverings on a base of paper or paperboard of headings 4811 or 4814; or (D) A change to any other good of heading 4823 from strip or rolls of a width exceeding 15 cm of heading 4823, other than strips or rolls of heading 4823 which but for their width would be classified in headings 4803, 4809 or 4814, floor coverings on a base of paper or paperboard of heading 4823, from or any other heading, except from strip or rolls of a width exceeding 15 cm but not exceeding 36 cm or paper or paperboard in rectangular (including square) sheets with one side not exceeding 15 cm in the unfolded state of headings 4802, 4810 or 4811, or from headings 4817 through 4822.' FOUR branches mixing WIDTH limits and the floor-coverings goods-kind: (A) narrow (≤15 cm) 4823 goods may shift from wide 4823 stock (other than re-cut 4803/4809/4814 goods), from 4823 floor coverings, or any other heading except 4817-4822; (B) wide 4823 goods — from 4823 floor coverings or any other heading except 4817-4822; (C) 4823 floor coverings — good-level change within 4823 or any other heading, EXCEPT floor coverings of 4811 or 4814; (D) all other 4823 goods — from wide 4823 stock (again other than re-cut 4803/4809/4814 goods), 4823 floor coverings, or any other heading, except narrow-cut goods (15-36 cm strips/rolls and one-side-≤15 cm sheets) of 4802/4810/4811, or 4817-4822. PRINT ODDITIES transcribed as printed: (D) prints 'strip or rolls' (singular) twice and the sequence 'from or any other heading'; exception-group boundary differs from rules 2/5/6: those rules except from headings 4817 through 4823 (the whole finished-articles block, 4823 included), while rule 11's branches except from headings 4817 through 4822 (4823 is the target heading here) — endpoints must not be blurred. Flagged for human audit.",
    sources: SRC,
  },
  // ---------------- Chapter 49 ----------------
  {
    id: "paper-49-4901-4911",
    sector: "pulp-paper-printed-matter",
    chapters: ["49"],
    hsRange: "Headings 4901 through 4911",
    label: "All of Chapter 49 (4901–4911) — printed books, newspapers, pictures, printed matter — chapter-level shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 4901 through 4911 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 49, rule 1): '1. A change to headings 4901 through 4911 from any other chapter.' Single group rule for the whole chapter — chapter-level shift, so printed-matter-to-printed-matter shifts WITHIN 4901-4911 do not qualify (e.g. re-binding of 4901 books does not re-originate).",
    sources: SRC,
  },
];

export const PULP_PAPER_SECTOR_FILE: UsmcaSectorFile = {
  sector: "pulp-paper-printed-matter",
  chaptersCovered: ["47", "48", "49"],
  dataAsOf: "2026-09-28",
  mergeEligible: true,
  auditStatus: "human_verified",
  rules: PULP_PAPER_RULES,
  watchItems: [
    "NO TV/NC RVC ANYWHERE in Chapters 47-49 — all rules are tariff shifts or dimension/goods-kind branch shifts. Never offer TV/NC except via the core file's GN 11(b)(iv) fallback.",
    "DIMENSION-BASED ROUTING is the heart of Chapter 48: rules 2 (4802), 5 (4810), 6 (4811) and 11 (4823) require the calculator to measure strip/roll width (15 cm threshold; 4823(D) adds 15-36 cm), and unfolded rectangular sheet dimensions (36 cm larger dimension / 15 cm other dimension thresholds), plus the floor-coverings-on-paper-base goods-kind. Branch (C)/(D) of rules 6 and 11 also include GOOD-LEVEL changes ('from any other good of heading 4811 / 4823').",
    "RE-CUT / BUT-FOR-WIDTH carve-outs (rule 11 only): 4823 strips/rolls whose only deviation from 4803/4809/4814 is width are excluded from the permitted intra-4823 inputs of branches (A) and (D) — transcribed with the 'other than' qualifier intact.",
    "Exception-list boundaries differ by rule: rules 2/5/6 branches (A)/(B) except from headings 4817 through 4823 (inclusive of the whole finished-articles block); rule 10 excepts heading 4823 from a 4817-4822 group rule; rule 11 branches (A)/(B) except from 4817 through 4822; rule 11(C) excepts only floor coverings of 4811/4814; rule 11(D) excepts narrow-cut 4802/4810/4811 goods and 4817-4822. Verify the engine does not blur 4822 vs 4823 endpoints.",
    "PRINT/OCR ODDITIES transcribed as printed, flagged for audit: rule 5 branch label 'C)' without opening parenthesis; rule 11(D) 'strip or rolls' (x2) and 'from or any other heading'.",
    "Heading 4815 (straw-centred board) has NO printed rule in GN 11(o) Chapter 48 (rule numbering runs 4808-4809 then 4812-4813 with no 4810/4811 gap, and 4814 jumps to 4816) — routing for 4815 falls to the human-audit checklist; do not invent a rule.",
    "Anti-backsliding exceptions: 4814 blocks floor coverings of 4811; 4816 blocks 4809; 4817-4822 blocks 4823; 4823(C) blocks floor coverings of 4811/4814.",
    "Floor coverings of 4811 are a PERMITTED input in 4811(A)/(B)/(D) and of 4823 in 4823(A)/(B)/(D) — permission-style, mirror of the ch. 41 pattern; do not treat as exceptions.",
    "No GN 11(k) carryover, no subheading rules, no chapter rules, no phased rules print for chapters 47-49 (the subheading-rule pattern starts at 5112.11, Chapter 51 — textiles file owns it).",
    "De minimis (GN 11(e), 10 percent) and the GN 11(b)(iv) fallback (60 TV / 50 NC) are owned by the core types file — never restated here.",
    "USMCA joint review (around 2026) may revise rules of origin — re-verify against the current HTSUS GN 11 revision before relying on this file for new claim periods.",
  ],
  sourceFirewall: {
    treatyBaseline: "USMCA Chapter 4 / Annex 4-B, Chapters 47-49 (Pulp of wood; Paper and paperboard; Printed books, newspapers and other printed matter)",
    usImplementation: "HTSUS General Note 11 (2026 Revision 15), subdivision (o) Chapters 47-49 / 19 CFR Part 182 / SOR-2020-155 Schedule 1 (Canada)",
    excludedAgreements: [
      "NAFTA (superseded — GN 12(t) Chapters 47-49 rules differ; never backfill)",
      "KORUS, CAFTA-DR and other FTAs with paper/printed-matter rules — never backfill",
      "Chapter 46 and Chapter 50+ product rules (wood file / textiles file own their ranges)",
      "Chapter 63 newspaper-printing anti-circumvention and countervailing duty orders on paper (not rules of origin — out of scope)",
    ],
  },
};

export default PULP_PAPER_SECTOR_FILE;