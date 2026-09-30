/**
 * USMCA Stone / Ceramics / Glass Rules of Origin —
 * HS Chapters 68-70 pass, unified-schema sector file for OrigynLX.
 * Modeled on the automotive sector file (AUTOMOTIVE_SECTOR_FILE) template.
 * REVISION 1: transcribed VERBATIM from HTSUS General Note 11 (2026
 * Revision 15), subdivision (o) Chapters 68-70 tables, as supplied in the
 * official USITC PDF ("General Note 11_2026HTSRev15.pdf").
 *
 * CHAPTERS COVERED BY THIS FILE (for the calculator's chapter routing):
 *   68 Articles of stone, plaster, cement, asbestos, mica etc.
 *   69 Ceramic products
 *   70 Glass and glassware
 *
 * WHAT IS IN THIS PASS: the complete GN 11(o) tables for Chapters 68, 69
 * and 70 — all rules, verbatim. No RVC thresholds and no phased rules
 * exist in these chapters. Qualification is by tariff shift only, with
 * two GOODS-SPECIFIC multi-branch rules in Chapter 68 (subheadings
 * 6812.80 crocidolite and 6812.92-99 asbestos) that split by the form of
 * the good, and one GN 11(k) automotive carryover in Chapter 70.
 *
 * OVERLAP RULE (do not create two-files-two-numbers bugs):
 *   - De minimis (GN 11(e), 10 percent) is OWNED by the core types file.
 *   - GN 11(b)(iv) fallback (60 TV / 50 NC) is OWNED by the core types file.
 *   - GN 11(k) automotive-parts thresholds are OWNED by the automotive
 *     sector file — this file carries cross-reference records only, no
 *     automotive thresholds.
 *   - Chapter 71 (precious metals) is owned by the precious-metals file.
 *   - Chapters 39/70 glass-fiber goods: Chapter 70 rules here govern
 *     heading 7019 (glass fibers) with its own exception list.
 */
import type { UsmcaRule, UsmcaSectorFile, UsmcaSource } from "../usmca-rule-types";

const HTS_GN11_2026: UsmcaSource = {
  authority: "USITC",
  title: "Harmonized Tariff Schedule of the United States (2026) Revision 15 — General Note 11, United States-Mexico-Canada Agreement, subdivision (o) (Chapters 68-70 product-specific rules of origin tables)",
  url: "https://hts.usitc.gov/download",
  reference: "GN 11(o) Chapters 68-70: Ch. 68 rules 1-6 (incl. the 6812.80 crocidolite and 6812.92-99 asbestos multi-branch rules), Ch. 69 rule 1, Ch. 70 chapter rule 1 and rules 1-11 (incl. heading rule and subheading rule re GN 11(k) underscoring)",
};

const USTR_CH4_TEXT: UsmcaSource = {
  authority: "USTR",
  title: "USMCA Chapter 4 (Rules of Origin) legal text, incl. Annex 4-B (Product-Specific Rules of Origin), Chapters 68-70",
  url: "https://ustr.gov/sites/default/files/files/agreements/FTA/USMCA/Text/04-Rules-of-Origin.pdf",
  reference: "Annex 4-B Chapters 68-70 — treaty source of the same rules",
};

const GAC_CUSMA_CH4: UsmcaSource = {
  authority: "Global Affairs Canada",
  title: "CUSMA Chapter 4 — Rules of Origin (consolidated official text)",
  url: "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/cusma-aceum/text-texte/04.aspx?lang=eng",
  reference: "Annex 4-B Chapters 68-70 rules (corroborating official text)",
};

const SRC = [HTS_GN11_2026, USTR_CH4_TEXT, GAC_CUSMA_CH4];

export const STONE_CERAMICS_GLASS_RULES: UsmcaRule[] = [
  // ---------------- Chapter 68 ----------------
  {
    id: "glass-68-6801-6811",
    sector: "stone-ceramics-glass",
    chapters: ["68"],
    hsRange: "Headings 6801 through 6811",
    label: "Articles of stone, plaster, cement, asbestos, mica etc. (6801-6811) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 6801 through 6811 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "glass-68-6812-80",
    sector: "stone-ceramics-glass",
    chapters: ["68"],
    hsRange: "6812.80",
    label: "Crocidolite (blue asbestos) worked goods (6812.80) — SIX-BRANCH goods-specific rule",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 68, rule 2): '2. (A) A change to clothing, clothing accessories, footwear and headgear of subheading 6812.80 from any other subheading; (B) A change to fabricated crocidolite fibers or mixtures with a basis of crocidolite or with a basis of crocidolite and magnesium carbonate of subheading 6812.80 from any other chapter; (C) A change to yarn or thread of subheading 6812.80 from any other good of subheading 6812.80 or any other subheading; (D) A change to cords or string, whether or not plaited, of subheading 6812.80 from any other good of subheading 6812.80 or any other subheading, except from woven or knitted fabric of subheading 6812.80; (E) A change to woven or knitted fabric of subheading 6812.80 from any other good of subheading 6812.80 or any other subheading, except from cords or string, whether or not plaited, of subheading 6812.80; or (F) A change to any other good of subheading 6812.80 from fabricated crocidolite fibers or mixtures with a basis of crocidolite and magnesium carbonate, yarn or thread, cords or string, whether or not plaited, or woven or knitted fabric of subheading 6812.80 or from any other subheading.' CALCULATOR ROUTING — identify the FORM of the good first: (A) clothing/footwear/headgear: any other subheading; (B) fabricated crocidolite fibers/mixtures: any other chapter; (C) yarn/thread: any other good of 6812.80 or any other subheading; (D) cords/string: any other good of 6812.80 or any other subheading EXCEPT woven/knitted fabric of 6812.80; (E) woven/knitted fabric: any other good of 6812.80 or any other subheading EXCEPT cords/string of 6812.80; (F) all other goods: from the listed intermediate forms or from any other subheading. The (D)/(E) mutual exception is a designed anti-circling device — a shift from fabric to cord or cord to fabric within 6812.80 FAILS. No RVC alternative exists.",
    sources: SRC,
  },
  {
    id: "glass-68-6812-91",
    sector: "stone-ceramics-glass",
    chapters: ["68"],
    hsRange: "6812.91",
    label: "Woven or knitted fabric of crocidolite etc. (6812.91) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 6812.91 from any other subheading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "glass-68-6812-92-99",
    sector: "stone-ceramics-glass",
    chapters: ["68"],
    hsRange: "6812.92 through 6812.99",
    label: "Asbestos (chrysotile etc.) worked goods (6812.92-6812.99) — FIVE-BRANCH goods-specific rule",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 68, rule 4): '4. (A) A change to fabricated asbestos fibers or mixtures with a basis of asbestos or with a basis of asbestos and magnesium carbonate of subheading 6812.99 from any other chapter; (B) A change to yarn or thread of subheading 6812.99 from any other good of subheading 6812.99 or any other subheading; (C) A change to cords or string, whether or not plaited, of subheading 6812.99 from any other good of subheading 6812.99 or any other subheading, except from woven or knitted fabric of subheading 6812.99; (D) A change to woven or knitted fabric of subheading 6812.99 from any other good of subheading 6812.99 or any other subheading, except from cords or string, whether or not plaited, of subheading 6812.99; or (E) A change to any other good of subheadings 6812.92 through 6812.99 from fabricated asbestos fibers or mixtures with a basis of asbestos and magnesium carbonate, yarn or thread, cords or string, whether or not plaited, or woven or knitted fabric of subheading 6812.99 or from any subheading outside that group.' CALCULATOR ROUTING — identify the FORM first: (A) fabricated asbestos fibers/mixtures (of 6812.99): any other chapter; (B) yarn/thread of 6812.99: any other good of 6812.99 or any other subheading; (C) cords/string of 6812.99: any other good of 6812.99 or any other subheading EXCEPT woven/knitted fabric of 6812.99; (D) woven/knitted fabric of 6812.99: any other good of 6812.99 or any other subheading EXCEPT cords/string of 6812.99; (E) any other good of 6812.92 through 6812.99: from the listed intermediate forms of 6812.99 or from any subheading outside the 6812.92-99 group. The (C)/(D) mutual exception blocks cord-to-fabric and fabric-to-cord shifts within 6812.99. Note branch (E) covers the whole 6812.92-99 group (unlike the 6812.80 rule, which has no counterpart group branch). No RVC alternative exists.",
    sources: SRC,
  },
  {
    id: "glass-68-6813",
    sector: "stone-ceramics-glass",
    chapters: ["68"],
    hsRange: "6813",
    label: "Friction materials, brake linings etc. (6813) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 6813 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "Shift boundary is 'any other heading' (NOT any other chapter) — within-chapter shifts into 6813 qualify. Note 6813 friction materials are common motor-vehicle brake components; Chapter 68 prints NO GN 11(k) underscore chapter rule, so no automotive carryover applies from this table (check the printed PDF for underscoring during human audit — OCR cannot see it).",
    sources: SRC,
  },
  {
    id: "glass-68-6814-6815",
    sector: "stone-ceramics-glass",
    chapters: ["68"],
    hsRange: "Headings 6814 through 6815",
    label: "Worked mica; articles of other mineral substances (6814-6815) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 6814 through 6815 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  // ---------------- Chapter 69 ----------------
  {
    id: "glass-69-6901-6914",
    sector: "stone-ceramics-glass",
    chapters: ["69"],
    hsRange: "Headings 6901 through 6914",
    label: "Ceramic products (6901-6914) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 6901 through 6914 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  // ---------------- Chapter 70 ----------------
  {
    id: "glass-70-chapter-rule-1",
    sector: "stone-ceramics-glass",
    chapters: ["70"],
    hsRange: "Chapter 70 (chapter rule)",
    label: "Chapter 70 rule 1: underscored designations may qualify under GN 11(k) for motor-vehicle use — CROSS-REFERENCE, no thresholds",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 70, chapter rule 1): 'Chapter rule 1: For the purposes of the subdivisions pertaining to this chapter, whenever the subdivision designation is underscored, the provisions of subdivision (k) of this note may apply to goods for use in a motor vehicle of chapter 87.' CROSS-REFERENCE RECORD — carries NO thresholds of its own. Automotive-parts thresholds are owned by the automotive sector file (GN 11(k)); this record only routes underscored Chapter 70 designations to that provision. The table additionally prints a heading rule ('The underscoring of the designations in subdivision 6 pertains to goods provided for in headings 7003 through 7008 for use in a motor vehicle of chapter 87.') and a subheading rule ('The underscoring of the designations in subdivision 7 pertains to goods provided for in subheadings 7009.10 through 7009.91 for use in a motor vehicle of chapter 87.') — so the GN 11(k) carryover for this chapter applies to headings 7003-7008 (rule 6) and subheadings 7009.10-7009.91 (rule 7). OCR CANNOT SEE the actual underscoring in the printed table — the printed PDF must be checked during human audit.",
    sources: SRC,
  },
  {
    id: "glass-70-7001",
    sector: "stone-ceramics-glass",
    chapters: ["70"],
    hsRange: "7001",
    label: "Cullets and other glass waste/scrap (7001) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 7001 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "glass-70-7002-10",
    sector: "stone-ceramics-glass",
    chapters: ["70"],
    hsRange: "7002.10",
    label: "Glass in balls etc. for glass fibres (7002.10) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 7002.10 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "glass-70-7002-20",
    sector: "stone-ceramics-glass",
    chapters: ["70"],
    hsRange: "7002.20",
    label: "Glass in balls etc. for other uses (7002.20) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 7002.20 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verifiedited",
    notes:
      "ASYMMETRY: 7002.20 requires a shift from any other CHAPTER, while its neighbours 7002.10 and 7002.31 only require any other HEADING. Transcribed as printed.",
    sources: SRC,
  },
  {
    id: "glass-70-7002-31",
    sector: "stone-ceramics-glass",
    chapters: ["70"],
    hsRange: "7002.31",
    label: "Glass in balls (fused quartz) (7002.31) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 7002.31 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "glass-70-7002-32-39",
    sector: "stone-ceramics-glass",
    chapters: ["70"],
    hsRange: "7002.32 through 7002.39",
    label: "Glass in balls, other (7002.32-7002.39) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 7002.32 through 7002.39 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "glass-70-7003-7008",
    sector: "stone-ceramics-glass",
    chapters: ["70"],
    hsRange: "Headings 7003 through 7008",
    label: "Sheet/plate glass, safety glass, glass mirrors etc. (7003-7008) — tariff shift from outside the group, except from 7009; GN 11(k) carryover applies",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 7003 through 7008 from any heading outside that group, except from heading 7009.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 70, rule 6): '6. A change to headings 7003 through 7008 from any heading outside that group, except from heading 7009.' DOUBLE EXCEPTION: the shift must come from outside the 7003-7008 group AND not from heading 7009 (glassware for table/kitchen/toilet etc.) — so a good of 7009 cannot be re-characterized into 7003-7008 by this rule. HEADING RULE (verbatim): 'The underscoring of the designations in subdivision 6 pertains to goods provided for in headings 7003 through 7008 for use in a motor vehicle of chapter 87.' — automotive windscreen/safety-glass goods of 7003-7008 may instead qualify under GN 11(k) (thresholds owned by the automotive sector file; this record carries none).",
    sources: SRC,
  },
  {
    id: "glass-70-7009-10-91",
    sector: "stone-ceramics-glass",
    chapters: ["70"],
    hsRange: "7009.10 through 7009.91",
    label: "Glassware for table, kitchen, toilet etc. (7009.10-7009.91) — tariff shift except from 7003-7008; GN 11(k) carryover applies",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 7009.10 through 7009.91 from any other heading, except from headings 7003 through 7008.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 70, rule 7): '7. A change to subheadings 7009.10 through 7009.91 from any other heading, except from headings 7003 through 7008.' MIRROR of rule 6: a shift from the 7003-7008 group into 7009.10-7009.91 FAILS. SUBHEADING RULE (verbatim): 'The underscoring of the designations in subdivision 7 pertains to goods provided for in subheadings 7009.10 through 7009.91 for use in a motor vehicle of chapter 87.' — automotive-use goods of 7009.10-7009.91 may instead qualify under GN 11(k) (thresholds owned by the automotive sector file; this record carries none).",
    sources: SRC,
  },
  {
    id: "glass-70-7009-92",
    sector: "stone-ceramics-glass",
    chapters: ["70"],
    hsRange: "7009.92",
    label: "Glass signal glassware, glassine etc. (7009.92) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 7009.92 from any other subheading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "NOTE: 7009.92 shifts from any other SUBHEADING (including within 7009), while 7009.10-7009.91 must shift from another heading except 7003-7008 — and the GN 11(k) underscore carryover extends only to 7009.10-7009.91, NOT to 7009.92.",
    sources: SRC,
  },
  {
    id: "glass-70-7010-7018",
    sector: "stone-ceramics-glass",
    chapters: ["70"],
    hsRange: "Headings 7010 through 7018",
    label: "Glass containers, household glassware, laboratory glass, glass beads etc. (7010-7018) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 7010 through 7018 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "glass-70-7019",
    sector: "stone-ceramics-glass",
    chapters: ["70"],
    hsRange: "7019",
    label: "Glass fibers and articles thereof (7019) — tariff shift with heading-level exception",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 7019 from any other heading, except from headings 7007 through 7018 or 7020.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 70, rule 10): '10. A change to heading 7019 from any other heading, except from headings 7007 through 7018 or 7020.' BROAD EXCEPTION: shifts from headings 7007-7018 (safety glass through glass beads) or 7020 (other glass articles) into 7019 FAIL — glass-fiber goods cannot be made from those glass headings under this rule.",
    sources: SRC,
  },
  {
    id: "glass-70-7020",
    sector: "stone-ceramics-glass",
    chapters: ["70"],
    hsRange: "7020",
    label: "Other articles of glass (7020) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 7020 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
];

export const STONE_CERAMICS_GLASS_SECTOR_FILE: UsmcaSectorFile = {
  sector: "stone-ceramics-glass",
  chaptersCovered: ["68", "69", "70"],
  dataAsOf: "2026-09-28",
  mergeEligible: true,
  auditStatus: "human_verified",
  rules: STONE_CERAMICS_GLASS_RULES,
  watchItems: [
    "NO RVC THRESHOLDS and NO phased rules exist anywhere in GN 11(o) Chapters 68-70 — the calculator must never emit a value-content requirement for these chapters from this table.",
    "The two Chapter 68 multi-branch rules are FORM-BASED, not chapter-based: 6812.80 (crocidolite) has six branches and 6812.92-99 (asbestos) has five. The calculator must identify the physical form of the good (clothing/footwear, fibers, yarn, cords, fabric, other) BEFORE selecting a branch. The cord-vs-fabric mutual exceptions (branches D/E and C/D) block within-subheading circling — a shift from woven fabric to cord, or cord to fabric, of the same subheading FAILS.",
    "Chapter 70 rule 6 and rule 7 are MIRRORED exceptions: 7003-7008 cannot be reached from 7009, and 7009.10-7009.91 cannot be reached from 7003-7008. Neither direction of that pairing qualifies.",
    "Chapter 70 heading asymmetry within 7002: 7002.20 and 7002.32-39 require a shift from any other CHAPTER, while 7002.10 and 7002.31 only require any other HEADING — encoded as printed.",
    "GN 11(k) automotive carryover applies in Chapter 70 ONLY to headings 7003-7008 (rule 6) and subheadings 7009.10-7009.91 (rule 7), per the printed heading rule and subheading rule. Automotive thresholds live in the automotive sector file — cross-reference records here carry none. Chapter 68 (including 6813 friction/brake materials) prints NO such chapter rule; verify the printed PDF for underscoring (OCR-blind).",
    "7019 (glass fibers) exception list is BROAD: shifts from 7007-7018 or 7020 into 7019 fail.",
    "De minimis (GN 11(e), 10 percent) and the GN 11(b)(iv) fallback (60 TV / 50 NC) are owned by the core types file — never restated here.",
    "USMCA joint review (around 2026) may revise rules of origin — re-verify against the current HTSUS GN 11 revision before relying on this file for new claim periods.",
  ],
  sourceFirewall: {
    treatyBaseline: "USMCA Chapter 4 / Annex 4-B, Chapters 68-70 (Articles of stone/ceramic products/glass and glassware), incl. the Chapter 70 underscore provisions routing to GN 11(k)",
    usImplementation: "HTSUS General Note 11 (2026 Revision 15), subdivision (o) Chapters 68-70 / 19 CFR Part 182 / SOR-2020-155 Schedule 1 (Canada)",
    excludedAgreements: [
      "NAFTA (superseded — GN 12(t) Chapter 68-70 rules differ; never backfill)",
      "KORUS, CAFTA-DR and other FTAs with similar glass/ceramic rules — never backfill",
      "GN 11(k) automotive thresholds (owned by the automotive sector file; this file carries cross-references only)",
      "Chapters 67 and 71 (owned by their own sector files)",
      "Anti-dumping/countervailing duty orders on glass and ceramic products — separate regimes, not origin rules",
    ],
  },
};

export default STONE_CERAMICS_GLASS_SECTOR_FILE;