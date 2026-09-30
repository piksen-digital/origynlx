/**
 * USMCA Live Animals / Animal Products Rules of Origin —
 * HS Chapters 1-5 pass, unified-schema sector file for OrigynLX.
 * Modeled on the automotive sector file (AUTOMOTIVE_SECTOR_FILE) template.
 * REVISION 1: transcribed VERBATIM from HTSUS General Note 11 (2026
 * Revision 15), as supplied in the official USITC PDF
 * ("General Note 11_2026HTSRev15.pdf"): the complete GN 11(o)
 * Chapters 1-5 product-specific rules of origin tables (pp. 24-25).
 *
 * CHAPTERS COVERED BY THIS FILE (for the calculator's chapter routing):
 *   01 Live animals
 *   02 Meat and edible meat offal
 *   03 Fish and crustaceans, molluscs and other aquatic invertebrates
 *   04 Dairy produce; birds' eggs; natural honey
 *   05 Products of animal origin, not elsewhere specified
 *
 * WHAT IS IN THIS PASS:
 *  - Chapter 1: single rule, headings 0101-0106 from any other chapter.
 *  - Chapter 2: single rule, headings 0201-0210 from any other chapter.
 *  - Chapter 3: chapter rule 1 (a fish/crustacean/mollusc/other aquatic
 *    invertebrate OBTAINED in USMCA territory is originating EVEN IF
 *    obtained from imported immature stock at a post-larval stage) +
 *    rules 1-2, incl. the two-branch 0306.11-0308.90 rule (smoked goods
 *    may shift from non-smoked goods WITHIN those subheadings; all other
 *    goods shift from any other chapter).
 *  - Chapter 4: rules 1-3, each blocking shifts from enumerated Chapter 19
 *    and Chapter 21 dairy-substitute tariff items (1901.90.xx and
 *    2106.90.xx lists) — the lists differ between rule 2 (butter, longest
 *    list) and rules 1/3 (identical shorter list).
 *  - Chapter 5: single rule, headings 0501-0511 from any other chapter.
 *
 * NO RVC ANYWHERE IN CHAPTERS 1-5. No phased rules. No GN 11(n) general
 * (non-PSR) rules print for these chapters (unlike chapters 28-40): the
 * only route is the PSR below plus the wholly-obtained / GN 11(b) core
 * rules owned by the core types file.
 *
 * OVERLAP RULE (do not create two-files-two-numbers bugs):
 *   - De minimis (GN 11(e), 10 percent) is OWNED by the core types file.
 *   - GN 11(b)(iv) fallback (60 TV / 50 NC) is OWNED by the core types file.
 *   - The Chapter 4 exception tariff items are classified in chapters 19
 *     and 21 (foodstuffs sector file) — they are listed HERE as shift
 *     exceptions only; their own rules live in the foodstuffs pass.
 *   - GN 11(o) Chapter 7 and Chapter 8 subheading rules (truffles/capers/
 *     macadamia) are NOT in this file (vegetable products pass).
 */
import type { UsmcaRule, UsmcaSectorFile, UsmcaSource } from "../usmca-rule-types";

const HTS_GN11_2026: UsmcaSource = {
  authority: "USITC",
  title: "Harmonized Tariff Schedule of the United States (2026) Revision 15 — General Note 11, United States-Mexico-Canada Agreement, subdivision (o) (Chapters 1-5 product-specific rules of origin tables)",
  url: "https://hts.usitc.gov/download",
  reference: "GN 11(o) Ch. 1 (rule 1), Ch. 2 (rule 1), Ch. 3 (chapter rule 1 and rules 1-2), Ch. 4 (rules 1-3 with 1901.90/2106.90 exception lists), Ch. 5 (rule 1) — pp. 24-25",
};

const USTR_CH4_TEXT: UsmcaSource = {
  authority: "USTR",
  title: "USMCA Chapter 4 (Rules of Origin) legal text, incl. Annex 4-B (Product-Specific Rules of Origin), Chapters 1-5",
  url: "https://ustr.gov/sites/default/files/files/agreements/FTA/USMCA/Text/04-Rules-of-Origin.pdf",
  reference: "Annex 4-B Chapters 1-5 — treaty source of the same rules",
};

const GAC_CUSMA_CH4: UsmcaSource = {
  authority: "Global Affairs Canada",
  title: "CUSMA Chapter 4 — Rules of Origin (consolidated official text)",
  url: "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/cusma-aceum/text-texte/04.aspx?lang=eng",
  reference: "Annex 4-B Chapters 1-5 rules (corroborating official text)",
};

const SRC = [HTS_GN11_2026, USTR_CH4_TEXT, GAC_CUSMA_CH4];

export const LIVE_ANIMALS_RULES: UsmcaRule[] = [
  // ---------------- Chapter 1 ----------------
  {
    id: "liveanimals-01-0101-0106",
    sector: "live-animals-animal-products",
    chapters: ["01"],
    hsRange: "Headings 0101 through 0106",
    label: "Live animals (horses, bovines, swine, poultry etc.) (0101-0106) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 0101 through 0106 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "primary_sourced_audited",
    sources: SRC,
  },
  // ---------------- Chapter 2 ----------------
  {
    id: "liveanimals-02-0201-0210",
    sector: "live-animals-animal-products",
    chapters: ["02"],
    hsRange: "Headings 0201 through 0210",
    label: "Meat and edible meat offal (0201-0210) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 0201 through 0210 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "primary_sourced_audited",
    sources: SRC,
  },
  // ---------------- Chapter 3 ----------------
  {
    id: "liveanimals-03-chapter-rule-1",
    sector: "live-animals-animal-products",
    chapters: ["03"],
    hsRange: "Chapter 03 (chapter rule)",
    label: "Chapter 3 chapter rule: aquatic goods OBTAINED in USMCA territory are originating even from imported immature stock (post-larval stage)",
    ruleBasis: "process-requirement",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 3, chapter rule 1): 'A fish, crustacean, mollusc or other aquatic invertebrate obtained in the territory of a USMCA country is originating even if obtained from eggs, larvae, fry, fingerlings, parr, smolts or other immature fish at a post-larval stage that are imported from a non-USMCA country.' TERRITORY-OF-OB TAINMENT rule — origin attaches to where the animal is OBTAINED (raised/harvested), not to the origin of the immature stock. The enumerated immature stages are eggs, larvae, fry, fingerlings, parr, smolts or other immature fish at a POST-LARVAL stage. This is a stand-alone origin route for chapter 3 goods, independent of the tariff-shift rules 1-2.",
    sources: SRC,
  },
  {
    id: "liveanimals-03-0301-0305",
    sector: "live-animals-animal-products",
    chapters: ["03"],
    hsRange: "Headings 0301 through 0305",
    label: "Live fish; fresh/chilled/frozen fish; dried/salted/smoked fish; crustaceans/molluscs, flours and meals (0301-0305) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 0301 through 0305 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "liveanimals-03-0306-11-0308-90",
    sector: "live-animals-animal-products",
    chapters: ["03"],
    hsRange: "Subheadings 0306.11 through 0308.90",
    label: "Crustaceans, molluscs and other aquatic invertebrates, prepared/preserved fish (0306.11-0308.90) — TWO-BRANCH rule: smoked goods may shift from non-smoked goods WITHIN the group",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 3, rule 2): '2. (A) A change to a smoked good of subheadings 0306.11 through 0308.90 from a non-smoked good within those subheadings or any other subheading; or (B) A change to any other good of subheadings 0306.11 through 0308.90 from any other chapter.' GOODS-KIND ROUTING: branch (A) applies to SMOKED goods only and expressly allows a shift from a NON-SMOKED good within those same subheadings (intra-group processing shift — smoking confers origin even within 0306.11-0308.90); branch (B) covers all other goods of the subheadings with a standard any-other-chapter shift. No RVC in this rule.",
    sources: SRC,
  },
  // ---------------- Chapter 4 ----------------
  {
    id: "liveanimals-04-0401-0404",
    sector: "live-animals-animal-products",
    chapters: ["04"],
    hsRange: "Headings 0401 through 0404",
    label: "Milk and cream; yoghurt; buttermilk; whey; natural honey (0401-0404) — tariff shift from any other chapter EXCEPT the seven 1901.90.xx tariff items",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 0401 through 0404 from any other chapter, except from tariff items 1901.90.32, 1901.90.33, 1901.90.34, 1901.90.36, 1901.90.38, 1901.90.42 or 1901.90.43.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 4, rule 1): '1. A change to headings 0401 through 0404 from any other chapter, except from tariff items 1901.90.32, 1901.90.33, 1901.90.34, 1901.90.36, 1901.90.38, 1901.90.42 or 1901.90.43.' The exceptions are DAIRY-SUBSTITUTE tariff items of chapter 19 (foodstuffs file owns their own rules; here they are shift exceptions only). Per GN 11(o) preamble (viii), a rule requiring a change to tariff ITEMS applies at the 8-digit level — the exception blocks those inputs from conferring origin on dairy goods of 0401-0404.",
    sources: SRC,
  },
  {
    id: "liveanimals-04-0405",
    sector: "live-animals-animal-products",
    chapters: ["04"],
    hsRange: "Heading 0405",
    label: "Butter and other fats and oils derived from milk (0405) — tariff shift EXCEPT from the seven 1901.90.xx AND seventeen 2106.90.xx tariff items (LONGEST exception list in this file)",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 0405 from any other chapter, except from tariff items 1901.90.32, 1901.90.33, 1901.90.34, 1901.90.36, 1901.90.38, 1901.90.42, 1901.90.43, 2106.90.03, 2106.90.06, 2106.90.09, 2106.90.22, 2106.90.24, 2106.90.26, 2106.90.28, 2106.90.62, 2106.90.64, 2106.90.66, 2106.90.68, 2106.90.72, 2106.90.74, 2106.90.76, 2106.90.78, 2106.90.80 or 2106.90.82.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 4, rule 2): '2. A change to heading 0405 from any other chapter, except from tariff items 1901.90.32, 1901.90.33, 1901.90.34, 1901.90.36, 1901.90.38, 1901.90.42, 1901.90.43, 2106.90.03, 2106.90.06, 2106.90.09, 2106.90.22, 2106.90.24, 2106.90.26, 2106.90.28, 2106.90.62, 2106.90.64, 2106.90.66, 2106.90.68, 2106.90.72, 2106.90.74, 2106.90.76, 2106.90.78, 2106.90.80 or 2106.90.82.' NOTE: this printed rule ends WITHOUT a period after '2106.90.82' (transcribed as printed). LONGEST exception list in this pass: seven 1901.90.xx dairy-substitute items PLUS seventeen 2106.90.xx food-preparation items. Word-for-word verification of every tariff item is a mandatory human-audit item — a single dropped digit would silently narrow the exception.",
    sources: SRC,
  },
  {
    id: "liveanimals-04-0406-0410",
    sector: "live-animals-animal-products",
    chapters: ["04"],
    hsRange: "Headings 0406 through 0410",
    label: "Cheese and curd; birds' eggs; natural honey (0406-0410) — tariff shift from any other chapter EXCEPT the seven 1901.90.xx tariff items",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 0406 through 0410 from any other chapter, except from tariff items 1901.90.32, 1901.90.33, 1901.90.34, 1901.90.36, 1901.90.38, 1901.90.42 or 1901.90.43.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 4, rule 3): '3. A change to headings 0406 through 0410 from any other chapter, except from tariff items 1901.90.32, 1901.90.33, 1901.90.34, 1901.90.36, 1901.90.38, 1901.90.42 or 1901.90.43.' Same seven-item exception list as rule 1 — unlike rule 2 (butter), this rule blocks NO 2106.90.xx items.",
    sources: SRC,
  },
  // ---------------- Chapter 5 ----------------
  {
    id: "liveanimals-05-0501-0511",
    sector: "live-animals-animal-products",
    chapters: ["05"],
    hsRange: "Headings 0501 through 0511",
    label: "Products of animal origin: hair, bristles, feathers, bones, ivory, shells, coral, amber etc. (0501-0511) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 0501 through 0511 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
];

export const LIVE_ANIMALS_SECTOR_FILE: UsmcaSectorFile = {
  sector: "live-animals-animal-products",
  chaptersCovered: ["01", "02", "03", "04", "05"],
  dataAsOf: "2026-09-28",
  mergeEligible: true,
  auditStatus: "human_verified",
  rules: LIVE_ANIMALS_RULES,
  watchItems: [
    "NO RVC ANYWHERE in Chapters 1-5 — all rules are tariff shifts except the Chapter 3 chapter rule (territory-of-obtainment process rule) and the Chapter 3 rule 2 two-branch rule. Never offer TV/NC for these chapters except via the core file's GN 11(b)(iv) fallback.",
    "Chapter 3 chapter rule 1 is a STAND-ALONE origin route: an aquatic animal OBTAINED in USMCA territory is originating even from imported eggs/larvae/fry/fingerlings/parr/smolts/other immature fish at a POST-LARVAL stage. Independent of the tariff-shift rules.",
    "Chapter 3 rule 2 branch (A) allows SMOKED goods of 0306.11-0308.90 to shift from NON-SMOKED goods WITHIN those same subheadings — an intra-group processing shift; branch (B) is the standard any-other-chapter shift for all other goods.",
    "Chapter 4 exception lists differ: rules 1 and 3 block the SAME seven 1901.90.xx dairy-substitute tariff items; rule 2 (butter, 0405) blocks those seven PLUS seventeen 2106.90.xx items (24 exceptions total). The lists must be verified word-for-word — a dropped digit silently narrows the exception. The printed rule 2 ends without a period (transcribed as printed).",
    "The 1901.90.xx and 2106.90.xx exception tariff items are classified in chapters 19 and 21 — their own rules live in the prepared-foodstuffs pass; here they are shift exceptions only.",
    "Per GN 11(o) preamble (viii), rules requiring a change to TARIFF ITEMS apply at the 8-digit level and preempt subheading/heading-level rules for those goods.",
    "No GN 11(n) general (non-PSR) rules print for chapters 1-5 (unlike chapters 28-40): routes are wholly-obtained (GN 11(b), core file), the Chapter 3 chapter rule, and these PSRs.",
    "De minimis (GN 11(e), 10 percent) and the GN 11(b)(iv) fallback (60 TV / 50 NC) are owned by the core types file — never restated here.",
    "USMCA joint review (around 2026) may revise rules of origin — re-verify against the current HTSUS GN 11 revision before relying on this file for new claim periods.",
  ],
  sourceFirewall: {
    treatyBaseline: "USMCA Chapter 4 / Annex 4-B, Chapters 1-5 (Live animals; Meat; Fish and aquatic invertebrates; Dairy produce, birds' eggs, natural honey; Products of animal origin)",
    usImplementation: "HTSUS General Note 11 (2026 Revision 15), subdivision (o) Chapters 1-5 / 19 CFR Part 182 / SOR-2020-155 Schedule 1 (Canada)",
    excludedAgreements: [
      "NAFTA (superseded — GN 12(t) Chapters 1-5 rules differ, e.g. no counterpart chapter rule for chapter 3 aquatic obtainment; never backfill)",
      "KORUS, CAFTA-DR and other FTAs with agricultural rules — never backfill",
      "Chapters 19 and 21 rules for the 1901.90.xx / 2106.90.xx exception items (prepared-foodstuffs pass owns them)",
      "Chapter 7 and Chapter 8 subheading rules (truffles/capers/macadamia — vegetable products pass)",
      "Chapters 6+ product rules (separate passes)",
    ],
  },
};

export default LIVE_ANIMALS_SECTOR_FILE;