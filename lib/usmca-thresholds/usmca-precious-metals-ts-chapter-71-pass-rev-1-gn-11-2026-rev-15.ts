/**
 * USMCA Precious / Semi-Precious Metals, Stones & Pearls Rules of Origin —
 * HS Chapter 71 pass, unified-schema sector file for OrigynLX.
 * Modeled on the automotive sector file (AUTOMOTIVE_SECTOR_FILE) template.
 * REVISION 1: transcribed VERBATIM from HTSUS General Note 11 (2026
 * Revision 15), subdivision (o) Chapter 71 table, as supplied in the
 * official USITC PDF ("General Note 11_2026HTSRev15.pdf").
 *
 * CHAPTERS COVERED BY THIS FILE (for the calculator's chapter routing):
 *   71 Pearls, precious/semi-precious stones, precious metals,
 *      rolled precious metals, imitations thereof; coins
 *
 * WHAT IS IN THIS PASS: the complete GN 11(o) Chapter 71 table — all nine
 * rules, verbatim. The chapter contains NO RVC thresholds and NO phased
 * rules; qualification is by tariff shift only, except for two
 * process-based no-change alternatives (rules 2(B) and 4(B)) for
 * subheadings 7106.91 (silver semi-manufactures) and 7108.12 (gold
 * semi-manufactures) — conditioned on electrolytic, thermal or chemical
 * separation or alloying, NOT on RVC.
 *
 * NO CHAPTER RULE (GN 11(k) automotive underscore carryover) is printed for
 * Chapter 71 in the supplied GN 11(o) table — unlike Chapters 70, 72 and
 * others. If the printed PDF shows underscoring on any Chapter 71
 * designation, human audit must add the cross-reference; OCR cannot see
 * underscoring (see audit checklist).
 *
 * OVERLAP RULE (do not create two-files-two-numbers bugs):
 *   - De minimis (GN 11(e), 10 percent) is OWNED by the core types file.
 *   - GN 11(b)(iv) fallback (60 TV / 50 NC) is OWNED by the core types file.
 *   - Chapters 68-70 (stone/ceramic/glass) are outside this pass.
 *   - Chapter 72+ (base metals) is owned by the base-metals sector file.
 *   - Section 232 and other special-duty regimes are separate from origin.
 */
import type { UsmcaRule, UsmcaSectorFile, UsmcaSource } from "../usmca-rule-types";

const HTS_GN11_2026: UsmcaSource = {
  authority: "USITC",
  title: "Harmonized Tariff Schedule of the United States (2026) Revision 15 — General Note 11, United States-Mexico-Canada Agreement, subdivision (o) (Chapter 71 product-specific rules of origin table)",
  url: "https://hts.usitc.gov/download",
  reference: "GN 11(o) Chapter 71, rules 1-9: headings 7101-7118, incl. the process-based no-change alternatives for subheadings 7106.91 and 7108.12 (electrolytic, thermal or chemical separation or alloying)",
};

const USTR_CH4_TEXT: UsmcaSource = {
  authority: "USTR",
  title: "USMCA Chapter 4 (Rules of Origin) legal text, incl. Annex 4-B (Product-Specific Rules of Origin), Chapter 71",
  url: "https://ustr.gov/sites/default/files/files/agreements/FTA/USMCA/Text/04-Rules-of-Origin.pdf",
  reference: "Annex 4-B Chapter 71 — treaty source of the same rules",
};

const GAC_CUSMA_CH4: UsmcaSource = {
  authority: "Global Affairs Canada",
  title: "CUSMA Chapter 4 — Rules of Origin (consolidated official text)",
  url: "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/cusma-aceum/text-texte/04.aspx?lang=eng",
  reference: "Annex 4-B Chapter 71 rules (corroborating official text)",
};

const SRC = [HTS_GN11_2026, USTR_CH4_TEXT, GAC_CUSMA_CH4];

export const PRECIOUS_RULES: UsmcaRule[] = [
  {
    id: "jewels-71-7101-7105",
    sector: "precious-metals",
    chapters: ["71"],
    hsRange: "Headings 7101 through 7105",
    label: "Pearls, precious/semi-precious stones (natural or synthetic), dust, powder (7101-7105) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 7101 through 7105 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "primary_sourced_unaudited",
    sources: SRC,
  },
  {
    id: "jewels-71-7106",
    sector: "precious-metals",
    chapters: ["71"],
    hsRange: "7106.10 through 7106.92",
    label: "Silver unwrought/platinum unwrought etc. (7106.10-7106.92) — tariff shift OR process-based no-change alternative for 7106.91",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 71, rule 2): '2. (A) A change to subheadings 7106.10 through 7106.92 from any other subheading, including another subheading within that group; or (B) No change in tariff classification to a good of subheading 7106.91, whether or not there is also a change from another subheading, provided that the nonoriginating materials undergo electrolytic, thermal or chemical separation or alloying.' TWO-ROUTE RULE, NO RVC: route (A) is a pure tariff shift (within-group shifts allowed); route (B) is a PROCESS-based no-change alternative available ONLY for subheading 7106.91 — the nonoriginating materials must undergo electrolytic, thermal or chemical separation or alloying. There is NO value-content requirement anywhere in this rule; the calculator must not apply any RVC threshold. GOODS-SPECIFIC ROUTING: only 7106.91 gets route (B); all other 7106 goods must qualify under (A).",
    sources: SRC,
  },
  {
    id: "jewels-71-7107",
    sector: "precious-metals",
    chapters: ["71"],
    hsRange: "7107",
    label: "Base metals clad with silver (7107) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 7107 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "jewels-71-7108",
    sector: "precious-metals",
    chapters: ["71"],
    hsRange: "7108.11 through 7108.20",
    label: "Gold unwrought/semi-manufactured, platinum etc. (7108.11-7108.20) — tariff shift OR process-based no-change alternative for 7108.12",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 71, rule 4): '4. (A) A change to subheadings 7108.11 through 7108.20 from any other subheading, including another subheading within that group; or (B) No change in tariff classification to a good of subheading 7108.12, whether or not there is also a change from another subheading, provided that the nonoriginating materials undergo electrolytic, thermal or chemical separation or alloying.' TWO-ROUTE RULE, NO RVC: route (A) is a pure tariff shift (within-group shifts allowed); route (B) is a PROCESS-based no-change alternative available ONLY for subheading 7108.12 (gold in semi-manufactured forms) — the nonoriginating materials must undergo electrolytic, thermal or chemical separation or alloying. NO value-content requirement; do not apply any RVC threshold. GOODS-SPECIFIC ROUTING: only 7108.12 gets route (B); all other 7108 goods must qualify under (A).",
    sources: SRC,
  },
  {
    id: "jewels-71-7109",
    sector: "precious-metals",
    chapters: ["71"],
    hsRange: "7109",
    label: "Base metals clad with gold (7109) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 7109 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "jewels-71-7110",
    sector: "precious-metals",
    chapters: ["71"],
    hsRange: "7110.11 through 7110.49",
    label: "Platinum unwrought/semi-manufactured, palladium/rhodium etc. (7110.11-7110.49) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 7110.11 through 7110.49 from any other subheading, including another subheading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "jewels-71-7111",
    sector: "precious-metals",
    chapters: ["71"],
    hsRange: "7111",
    label: "Base metals clad with platinum (7111) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 7111 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "jewels-71-7112",
    sector: "precious-metals",
    chapters: ["71"],
    hsRange: "7112",
    label: "Waste and scrap of precious metal; other waste containing precious metal (7112) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 7112 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "Note the shift boundary is 'any other heading' (NOT any other chapter) — a change from within Chapter 71 (e.g., from 7108 to 7112) QUALIFIES, but a change from within heading 7112 itself does not.",
    sources: SRC,
  },
  {
    id: "jewels-71-7113-7118",
    sector: "precious-metals",
    chapters: ["71"],
    hsRange: "Headings 7113 through 7118",
    label: "Jewelry, articles of precious metal, coins (7113-7118) — tariff shift from outside the group",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 7113 through 7118 from any heading outside that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 71, rule 9): '9. A change to headings 7113 through 7118 from any heading outside that group.' The shift must come from OUTSIDE the 7113-7118 group — a change from within the group (e.g., 7113 to 7117 imitation jewelry) does NOT qualify. This is the ONLY tabular rule for all jewelry and articles headings; finished-jewelry qualification therefore requires non-originating materials classified outside 7113-7118 entirely.",
    sources: SRC,
  },
];

export const PRECIOUS_SECTOR_FILE: UsmcaSectorFile = {
  sector: "precious-metals",
  chaptersCovered: ["71"],
  dataAsOf: "2026-09-28",
  mergeEligible: true,
  auditStatus: "human_verified",
  rules: PRECIOUS_RULES,
  watchItems: [
    "NO RVC THRESHOLDS and NO phased rules exist anywhere in GN 11(o) Chapter 71 — the calculator must never emit a value-content requirement for Chapter 71 goods from this table. The only non-shift routes are the two process-based no-change alternatives (rules 2(B) and 4(B)).",
    "The process alternatives are SUBHEADING-SPECIFIC: 2(B) covers only 7106.91 and 4(B) covers only 7108.12 — not the whole 7106/7108 groups. Both require the nonoriginating materials to undergo electrolytic, thermal or chemical separation or alloying.",
    "No GN 11(k) automotive-underscore chapter rule is printed for Chapter 71 in the supplied table (unlike Chapters 70, 72, 73, 83, etc.). If the printed PDF shows underscored Chapter 71 designations, add the cross-reference during human audit — OCR cannot see underscoring.",
    "De minimis (GN 11(e), 10 percent) and the GN 11(b)(iv) fallback (60 TV / 50 NC) are owned by the core types file — never restated here.",
    "Separate regimes not encoded here: Kimberly Process / rough-diamond controls, U.S. coinage and bullion tariff treatments, and any precious-metals reporting requirements — all outside rules of origin.",
    "USMCA joint review (around 2026) may revise rules of origin — re-verify against the current HTSUS GN 11 revision before relying on this file for new claim periods.",
  ],
  sourceFirewall: {
    treatyBaseline: "USMCA Chapter 4 / Annex 4-B, Chapter 71 (Pearls, precious stones, precious metals; coins)",
    usImplementation: "HTSUS General Note 11 (2026 Revision 15), subdivision (o) Chapter 71 / 19 CFR Part 182 / SOR-2020-155 Schedule 1 (Canada)",
    excludedAgreements: [
      "NAFTA (superseded — GN 12(t) Chapter 71 rules differ; never backfill)",
      "KORUS, CAFTA-DR and other FTAs with lookalike jewelry/precious-metal rules — never backfill",
      "Chapters 68-70 (stone/ceramic/glass) and Chapter 72+ (base metals) — owned by their own sector files",
      "Kimberley Process Certification Scheme and bullion/coin duty regimes — not origin rules",
    ],
  },
};

export default PRECIOUS_SECTOR_FILE;