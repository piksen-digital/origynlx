/**
 * USMCA Arms and Ammunition; Works of Art Rules of Origin —
 * HS Chapters 93 and 97 pass, unified-schema sector file for OrigynLX.
 * Modeled on the automotive sector file (AUTOMOTIVE_SECTOR_FILE) template.
 * REVISION 1: transcribed VERBATIM from HTSUS General Note 11 (2026
 * Revision 15), as supplied in the official USITC PDF
 * ("General Note 11_2026HTSRev15.pdf"): the complete GN 11(o)
 * Chapters 93 and 97 product-specific rules of origin tables
 * (Ch. 93 rules 1-3, p. 133; Ch. 97 rule 1, p. 136).
 *
 * CHAPTERS COVERED BY THIS FILE (for the calculator's chapter routing):
 *   93 Arms and ammunition; parts and accessories thereof
 *   97 Works of art, collectors' pieces and antiques
 *
 * WHAT IS IN THIS PASS (4 records):
 *  - Chapter 93 (3 rules -> 3 records): 9301-9304 (A) chapter shift or
 *    (B) from parts of 9305 + RVC 60/50 (the classic watch/musical-
 *    instrument parts-fallback pattern); 9305 heading-level shift;
 *    9306-9307 chapter-level shift.
 *  - Chapter 97 (1 rule -> 1 record): single group rule, 9701-9706
 *    from any other chapter.
 *
 * ONE RVC PAIR ONLY: 60 TV / 50 NC, at 9301-9304 branch (B). No
 * other thresholds. No phased rules. No subheading rules or chapter
 * rules print for this range (no GN 11(k) carryover).
 *
 * NOTE ON CHAPTER GAPS: chapters 94-96 (misc manufactured goods) are
 * OWNED BY THE MISC FILE (usmca-misc-ch94-96, 36 records) and chapter
 * 98/99 (special classification provisions) are not GN 11(o) goods —
 * this file deliberately jumps 93 -> 97 with no 94-96 content.
 *
 * OVERLAP RULE (do not create two-files-two-numbers bugs):
 *   - De minimis (GN 11(e), 10 percent) is OWNED by the core types file.
 *   - GN 11(b)(iv) fallback (60 TV / 50 NC) is OWNED by the core types file.
 *   - Chapters 92 and 98+ rules are not restated here.
 */
import type { UsmcaRule, UsmcaSectorFile, UsmcaSource } from "../usmca-rule-types";

const HTS_GN11_2026: UsmcaSource = {
  authority: "USITC",
  title: "Harmonized Tariff Schedule of the United States (2026) Revision 15 — General Note 11, United States-Mexico-Canada Agreement, subdivision (o) (Chapters 93 and 97 product-specific rules of origin tables)",
  url: "https://hts.usitc.gov/download",
  reference: "GN 11(o) Ch. 93 (rules 1-3, p. 133), Ch. 97 (rule 1, p. 136)",
};

const USTR_CH4_TEXT: UsmcaSource = {
  authority: "USTR",
  title: "USMCA Chapter 4 (Rules of Origin) legal text, incl. Annex 4-B (Product-Specific Rules of Origin), Chapters 93 and 97",
  url: "https://ustr.gov/sites/default/files/files/agreements/FTA/USMCA/Text/04-Rules-of-Origin.pdf",
  reference: "Annex 4-B Chapters 93 and 97 — treaty source of the same rules",
};

const GAC_CUSMA_CH4: UsmcaSource = {
  authority: "Global Affairs Canada",
  title: "CUSMA Chapter 4 — Rules of Origin (consolidated official text)",
  url: "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/cusma-aceum/text-texte/04.aspx?lang=eng",
  reference: "Annex 4-B Chapters 93 and 97 rules (corroborating official text)",
};

const SRC = [HTS_GN11_2026, USTR_CH4_TEXT, GAC_CUSMA_CH4];

export const ARMS_ART_RULES: UsmcaRule[] = [
  // ---------------- Chapter 93 ----------------
  {
    id: "arms-93-9301-9304",
    sector: "arms-and-works-of-art",
    chapters: ["93"],
    hsRange: "Headings 9301 through 9304",
    label: "Arms of 9301–9304 (artillery, revolvers/rifles, other arms, spring/air guns) — (A) chapter shift, or (B) from parts/accessories of 9305 + RVC 60/50",
    ruleBasis: "tariff-shift-or-rvc",
    tariffShiftRule: "A change to headings 9301 through 9304 from any other chapter.",
    phases: [{ rvcOptions: [
      { method: "transaction-value", thresholdPercent: 60, condition: "Alternative branch: from heading 9305, whether or not there is also a change from any other chapter — RVC not less than 60 percent by transaction value" },
      { method: "net-cost", thresholdPercent: 50, condition: "Alternative branch: from heading 9305, whether or not there is also a change from any other chapter — RVC not less than 50 percent by net cost" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 93, rule 1): '1. (A) A change to headings 9301 through 9304 from any other chapter; or (B) A change to headings 9301 through 9304 from heading 9305, whether or not there is also a change from any other chapter, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.' Parts-fallback branch — ch. 93's OWN parts of 9305 (the same pattern as ch. 91's 9114 movements and ch. 92's 9209 parts) qualify only with RVC. THE ONLY RVC IN THIS FILE.",
    sources: SRC,
  },
  {
    id: "arms-93-9305",
    sector: "arms-and-works-of-art",
    chapters: ["93"],
    hsRange: "Heading 9305",
    label: "Parts and accessories of arms (9305) — heading-level shift from any other heading",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 9305 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 93, rule 2): '2. A change to heading 9305 from any other heading.' HEADING-level (not chapter): finished arms of 9301-9304 cannot fall back into parts; intra-9305 shifts also do not qualify.",
    sources: SRC,
  },
  {
    id: "arms-93-9306-9307",
    sector: "arms-and-works-of-art",
    chapters: ["93"],
    hsRange: "Headings 9306 through 9307",
    label: "Bombs, grenades, cartridges (9306) and swords/bayonets etc. (9307) — chapter-level group shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 9306 through 9307 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 93, rule 3): '3. A change to headings 9306 through 9307 from any other chapter.' Chapter-level group shift — intra-group 9306-to-9307 shifts do NOT qualify.",
    sources: SRC,
  },
  // ---------------- Chapter 97 ----------------
  {
    id: "art-97-9701-9706",
    sector: "arms-and-works-of-art",
    chapters: ["97"],
    hsRange: "Headings 9701 through 9706",
    label: "All of Chapter 97 (9701–9706) — paintings, original engravings/sculpture, collectors' pieces, antiques — chapter-level shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 9701 through 9706 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 97, rule 1, p. 136): '1. A change to headings 9701 through 9706 from any other chapter.' Single group rule for the WHOLE chapter — chapter-level shift, so 9701-to-9706 shifts WITHIN the chapter do not qualify (e.g. re-framing or restoration that reclassifies a painting as a collector's piece does not re-originate). The only numbered rule printed for chapter 97; p. 136 then continues into GN 11(p) (deemed-originating ADP goods list — 8471.30/.41/.49 etc.) and GN 11(q) exceptions, which are CORE-FILE territory, never restated here.",
    sources: SRC,
  },
];

export const ARMS_ART_SECTOR_FILE: UsmcaSectorFile = {
  sector: "arms-and-works-of-art",
  chaptersCovered: ["93", "97"],
  dataAsOf: "2026-09-28",
  mergeEligible: true,
  auditStatus: "human_verified",
  rules: ARMS_ART_RULES,
  watchItems: [
    "ONE RVC pair only in this file: 60 TV / 50 NC at 9301-9304 branch (B). No 45/35, no 40/30, no no-shift branches. Never offer TV/NC except via the core file's GN 11(b)(iv) fallback.",
    "Parts-fallback pattern (9305 -> 9301-9304 with RVC) mirrors ch. 91 (9114) and ch. 92 (9209): own-chapter parts qualify ONLY with RVC; verify the engine applies the same fallback logic across all three files.",
    "Shift-level matrix: 9301-9304 (A) CHAPTER-level; 9305 HEADING-level (finished arms cannot fall back into parts); 9306-9307 CHAPTER-level group (intra-group shifts blocked); 9701-9706 CHAPTER-level group (intra-chapter shifts blocked).",
    "Chapter gap is deliberate: 94-96 rules live in the misc file (usmca-misc-ch94-96) and chapters 98/99 are special-classification provisions outside GN 11(o) — this file routes 93 and 97 only; do not treat the gap as a missing-rules error.",
    "GN 11(p) (deemed-originating ADP goods) and GN 11(q) (exceptions incl. sugar-confectionery Mexico rules) print immediately after ch. 97 on p. 136 — they are CORE-FILE territory (whole-note scope), never restated here.",
    "No GN 11(k) carryover, no subheading rules, no chapter rules, no phased rules print for chapters 93 and 97.",
    "De minimis (GN 11(e), 10 percent) and the GN 11(b)(iv) fallback (60 TV / 50 NC) are owned by the core types file — never restated here.",
    "USMCA joint review (around 2026) may revise rules of origin — re-verify against the current HTSUS GN 11 revision before relying on this file for new claim periods.",
  ],
  sourceFirewall: {
    treatyBaseline: "USMCA Chapter 4 / Annex 4-B, Chapters 93 and 97 (Arms and ammunition; Works of art, collectors' pieces and antiques)",
    usImplementation: "HTSUS General Note 11 (2026 Revision 15), subdivision (o) Chapters 93 and 97 / 19 CFR Part 182 / SOR-2020-155 Schedule 1 (Canada)",
    excludedAgreements: [
      "NAFTA (superseded — GN 12(t) Chapters 93/97 rules differ; never backfill)",
      "KORUS, CAFTA-DR and other FTAs with arms or works-of-art rules — never backfill",
      "ATF import controls (National Firearms Act, GCA) — regulatory, not rules of origin; out of scope",
      "Cultural property import restrictions (CPIA, UNESCO 1970 convention) — not rules of origin; out of scope",
      "Chapters 92 and 94-96 product rules (optics file / misc file own those ranges); GN 11(p)/(q) (core file)",
    ],
  },
};

export default ARMS_ART_SECTOR_FILE;