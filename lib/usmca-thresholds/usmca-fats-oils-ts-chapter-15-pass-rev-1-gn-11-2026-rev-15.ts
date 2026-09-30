/**
 * USMCA Animal or Vegetable Fats and Oils Rules of Origin —
 * HS Chapter 15 pass, unified-schema sector file for OrigynLX.
 * Modeled on the automotive sector file (AUTOMOTIVE_SECTOR_FILE) template.
 * REVISION 1: transcribed VERBATIM from HTSUS General Note 11 (2026
 * Revision 15), as supplied in the official USITC PDF
 * ("General Note 11_2026HTSRev15.pdf"): the complete GN 11(o)
 * Chapter 15 product-specific rules of origin table (p. 27).
 *
 * CHAPTER COVERED BY THIS FILE (for the calculator's chapter routing):
 *   15 Animal or vegetable fats and oils and their cleavage products;
 *     prepared edible fats; animal or vegetable waxes
 *
 * WHAT IS IN THIS PASS (3 records):
 *  - Rule 1: headings 1501-1518 from any other chapter, except from
 *    heading 3823 (industrial monobasic acids etc.).
 *  - Rule 2: heading 1520 from ANY OTHER HEADING (not chapter), except
 *    from heading 3823. Note the shift level differs from rules 1 and 3:
 *    a within-chapter heading change qualifies for 1520.
 *  - Rule 3: headings 1521-1522 from any other chapter.
 *
 * NO RVC ANYWHERE IN CHAPTER 15. No phased rules. No subheading rules.
 *
 * OVERLAP RULE (do not create two-files-two-numbers bugs):
 *   - De minimis (GN 11(e), 10 percent) is OWNED by the core types file.
 *   - GN 11(b)(iv) fallback (60 TV / 50 NC) is OWNED by the core types file.
 *   - Heading 3823 (industrial fatty acids, acid oils) is classified in
 *     chapter 38 (chemicals file owns its rule); it appears here as a shift
 *     exception only — never backfill a chapter 38 rule from this file.
 *   - Chapters 1-14 and 16+ product rules live in their own files.
 */
import type { UsmcaRule, UsmcaSectorFile, UsmcaSource } from "../usmca-rule-types";

const HTS_GN11_2026: UsmcaSource = {
  authority: "USITC",
  title: "Harmonized Tariff Schedule of the United States (2026) Revision 15 — General Note 11, United States-Mexico-Canada Agreement, subdivision (o) (Chapter 15 product-specific rules of origin table)",
  url: "https://hts.usitc.gov/download",
  reference: "GN 11(o) Ch. 15 rules 1-3 (1501-1518 and 1520 with the heading 3823 exception; 1521-1522) — p. 27",
};

const USTR_CH4_TEXT: UsmcaSource = {
  authority: "USTR",
  title: "USMCA Chapter 4 (Rules of Origin) legal text, incl. Annex 4-B (Product-Specific Rules of Origin), Chapter 15",
  url: "https://ustr.gov/sites/default/files/files/agreements/FTA/USMCA/Text/04-Rules-of-Origin.pdf",
  reference: "Annex 4-B Chapter 15 — treaty source of the same rules",
};

const GAC_CUSMA_CH4: UsmcaSource = {
  authority: "Global Affairs Canada",
  title: "CUSMA Chapter 4 — Rules of Origin (consolidated official text)",
  url: "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/cusma-aceum/text-texte/04.aspx?lang=eng",
  reference: "Annex 4-B Chapter 15 rules (corroborating official text)",
};

const SRC = [HTS_GN11_2026, USTR_CH4_TEXT, GAC_CUSMA_CH4];

export const FATS_OILS_RULES: UsmcaRule[] = [
  {
    id: "fats-15-1501-1518",
    sector: "fats-oils",
    chapters: ["15"],
    hsRange: "Headings 1501 through 1518",
    label: "Fats and oils: lard, tallow, fish oils, soya-bean, palm, sunflower, rapeseed oils etc.; margarine (1501-1518) — tariff shift from any other chapter EXCEPT heading 3823",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 1501 through 1518 from any other chapter, except from heading 3823.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 15, rule 1): '1. A change to headings 1501 through 1518 from any other chapter, except from heading 3823.' The exception blocks fatty-acid goods of heading 3823 (chapter 38 — chemicals file owns that rule; here an exception only) from conferring origin on fats/oils of 1501-1518.",
    sources: SRC,
  },
  {
    id: "fats-15-1520",
    sector: "fats-oils",
    chapters: ["15"],
    hsRange: "Heading 1520",
    label: "Glycerol, crude and glycerol waters (1520) — tariff shift from ANY OTHER HEADING (within-chapter changes qualify), EXCEPT heading 3823",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 1520 from any other heading, except from heading 3823.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 15, rule 2): '2. A change to heading 1520 from any other heading, except from heading 3823.' SHIFT-LEVEL DIFFERENCE: this rule allows a change from ANY OTHER HEADING — including a within-chapter heading change — unlike rules 1 and 3 which require a change FROM ANY OTHER CHAPTER. A glycerol-good whose input was another heading within chapter 15 (or any other chapter's heading, except 3823) qualifies. Verify the calculator's shift engine honors the heading-level (not chapter-level) shift here.",
    sources: SRC,
  },
  {
    id: "fats-15-1521-1522",
    sector: "fats-oils",
    chapters: ["15"],
    hsRange: "Headings 1521 through 1522",
    label: "Vegetable waxes; beeswax; degumming wastes; animal/vegetable fats n.e.s. (1521-1522) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 1521 through 1522 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
];

export const FATS_OILS_SECTOR_FILE: UsmcaSectorFile = {
  sector: "fats-oils",
  chaptersCovered: ["15"],
  dataAsOf: "2026-09-28",
  mergeEligible: true,
  auditStatus: "human_verified",
  rules: FATS_OILS_RULES,
  watchItems: [
    "NO TV/NC RVC ANYWHERE in Chapter 15 — all three rules are tariff shifts; the calculator should only reach GN 11(b)(iv) via the core file.",
    "SHIFT-LEVEL ASYMMETRY: rule 2 (1520 glycerol) allows a change from ANY OTHER HEADING (within-chapter heading changes qualify), while rules 1 and 3 require a change FROM ANY OTHER CHAPTER. Do not normalize rule 2 to a chapter-level shift.",
    "HEADING 3823 EXCEPTION: rules 1 and 2 block shifts from heading 3823 (industrial fatty acids, acid oils — chapter 38). The chemicals file owns the 3823 rule; here it is a shift exception only, never backfilled. Rule 3 (1521-1522) has NO 3823 exception.",
    "No phased rules, no subheading rules, and no de minimis method-flips exist for Chapter 15.",
    "De minimis (GN 11(e), 10 percent) and the GN 11(b)(iv) fallback (60 TV / 50 NC) are owned by the core types file — never restated here.",
    "USMCA joint review (around 2026) may revise rules of origin — re-verify against the current HTSUS GN 11 revision before relying on this file for new claim periods.",
  ],
  sourceFirewall: {
    treatyBaseline: "USMCA Chapter 4 / Annex 4-B, Chapter 15 (Animal or vegetable fats and oils and their cleavage products; prepared edible fats; animal or vegetable waxes)",
    usImplementation: "HTSUS General Note 11 (2026 Revision 15), subdivision (o) Chapter 15 / 19 CFR Part 182 / SOR-2020-155 Schedule 1 (Canada)",
    excludedAgreements: [
      "NAFTA (superseded — GN 12(t) Chapter 15 rules differ; never backfill)",
      "KORUS, CAFTA-DR and other FTAs with fats/oils rules — never backfill",
      "Heading 3823 rule (owned by the chemicals file; here an exception only)",
      "Chapters 1-14 and 16+ product rules (own files)",
    ],
  },
};

export default FATS_OILS_SECTOR_FILE;