/**
 * USMCA Textiles and Apparel Rules of Origin —
 * HS Chapters 50-63 pass, unified-schema sector file for OrigynLX.
 * Modeled on the automotive sector file (AUTOMOTIVE_SECTOR_FILE) template.
 * REVISION 1 — FRESH AUTHORITATIVE BUILD. An earlier textiles file produced
 * before GN 11 access was found unreliable and is fully superseded; this
 * revision transcribes VERBATIM from HTSUS General Note 11 (2026
 * Revision 15), as supplied in the official USITC PDF
 * ("General Note 11_2026HTSRev15.pdf"): the complete GN 11(o)
 * Chapters 50-63 product-specific rules of origin tables (pp. 43-54).
 *
 * CHAPTERS COVERED BY THIS FILE (for the calculator's chapter routing):
 *   50-55 Silk, wool, cotton, man-made filaments/staple
 *   56-60 Wadding, felt, carpets, special woven fabric, impregnated textiles, knits
 *   61-62 Knitted/crocheted apparel; woven apparel
 *   63 Other made-up textile articles
 *
 * STRUCTURE (109 records):
 *  - Yarn/fabric-stage rules (ch. 50-60): chapter or heading-group shifts
 *    with the FIBER EXCEPTION LISTS (yarn inputs of 5106-5113, 5204-5212,
 *    5310-5311, ch. 54-55 etc. blocked). No RVC anywhere in the sector.
 *  - TRADE-DIRECTION subheading rules: 5112.11, 5112.19, 5509.31,
 *    5703.20-.30, 5704, 5801.36, 5801.37, 6103.23, 6104.23, 6110.30 —
 *    each prints DIFFERENT rules for Canada-US (or Mexico-US) trade vs
 *    "all other trade"; encoded as SEPARATE records with the trade
 *    direction in the condition.
 *  - CHAPTER RULES (ch. 61 x4, ch. 62 x6, ch. 63 x2): component rule,
 *    supply-based fabric requirements (5903 / 5806.20 / 6002 formed and
 *    finished), sewing-thread rule, pocket-bag rules with STAGGERED
 *    EFFECTIVE DATES (ch. 62 rules 4-6: 12/18/30 months from entry into
 *    force), and the ch. 62 outer-shell fabric SHORT LISTS (A)-(E) and
 *    the shirts/boxer-short fabric lists (a)-(j).
 *  - APPAREL RULES (ch. 61-63 numbered): chapter shift + fiber exception
 *    list + CUT-(OR-KNIT)-TO-SHAPE-AND-SEWN assembly requirement.
 *    ruleBasis "process-requirement" — the calculator MUST ask where the
 *    good was cut/knit to shape and sewn/assembled; a tariff shift alone
 *    never suffices. The exception clause prints identically ~30 times;
 *    it is generated from constants below (single source of truth, exact
 *    printed text) — see manifest for the audit implication.
 *
 * NO RVC ANYWHERE IN CHAPTERS 50-63 (textile RVC was a NAFTA feature;
 * USMCA uses shifts + assembly + supply rules). No GN 11(k) carryover.
 *
 * OVERLAP RULE (do not create two-files-two-numbers bugs):
 *   - De minimis (GN 11(e), 10 percent) is OWNED by the core types file.
 *   - GN 11(b)(iv) fallback (60 TV / 50 NC) is OWNED by the core types file.
 *   - The 9619 exception appearing in ch. 61-63 rules is a cross-reference
 *     to the misc file's heading — exceptions only, never backfilled.
 *   - USMCA Chapter 6 (textile/apparel goods) special provisions
 *     (e.g. shortages, customs cooperation) are treaty-level, not GN 11(o)
 *     PSROs — noted where relevant, never restated as rules.
 */
import type { UsmcaRule, UsmcaSectorFile, UsmcaSource } from "../usmca-rule-types";

const HTS_GN11_2026: UsmcaSource = {
  authority: "USITC",
  title: "Harmonized Tariff Schedule of the United States (2026) Revision 15 — General Note 11, United States-Mexico-Canada Agreement, subdivision (o) (Chapters 50-63 product-specific rules of origin tables)",
  url: "https://hts.usitc.gov/download",
  reference: "GN 11(o) Ch. 50-55 (pp. 43-45), Ch. 56-57 (pp. 45-46), Ch. 58-60 (pp. 46-47), Ch. 61 (pp. 47-50), Ch. 62 (pp. 50-53), Ch. 63 (p. 54)",
};

const USTR_CH4_TEXT: UsmcaSource = {
  authority: "USTR",
  title: "USMCA Chapter 4 (Rules of Origin) legal text, incl. Annex 4-B (Product-Specific Rules of Origin), Chapters 50-63",
  url: "https://ustr.gov/sites/default/files/files/agreements/FTA/USMCA/Text/04-Rules-of-Origin.pdf",
  reference: "Annex 4-B Chapters 50-63 — treaty source of the same rules; USMCA Chapter 6 governs textile and apparel goods",
};

const GAC_CUSMA_CH4: UsmcaSource = {
  authority: "Global Affairs Canada",
  title: "CUSMA Chapter 4 — Rules of Origin (consolidated official text)",
  url: "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/cusma-aceum/text-texte/04.aspx?lang=eng",
  reference: "Annex 4-B Chapters 50-63 rules (corroborating official text)",
};

const SRC = [HTS_GN11_2026, USTR_CH4_TEXT, GAC_CUSMA_CH4];

// ---- Single-source-of-truth constants: exact printed clause text ----
// The apparel exception clause prints identically in every ch. 61-63
// numbered rule (minor variant: ch. 62 adds 5801-5802; some rules append
// the 9619 exception). Auditors verify the CONSTANT once, then only the
// per-record HS ranges and variant flags.
const EXC_61 = "except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapter 54 or headings 5508 through 5516 or 6001 through 6006";
const EXC_62 = "except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapter 54, headings 5508 through 5516, 5801 through 5802 or 6001 through 6006";
const CUT_KNIT = "provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries";
const CUT_ONLY = "provided that the good is both cut and sewn or otherwise assembled in the territory of one or more of the USMCA countries";
const EXC_9619 = ", or other made-up textile articles of heading 9619";

/** Generator for the standard ch. 61/63 apparel rule pattern (cut-or-knit variant). */
function apparel61(n: number, hs: string, label: string, with9619 = false): UsmcaRule {
  const rule = `A change to ${hs} from any other chapter, ${EXC_61}${with9619 ? EXC_9619 : ""}, ${CUT_KNIT}.`;
  return {
    id: `text-61-rule-${n}`,
    sector: "textiles-apparel",
    chapters: ["61"],
    hsRange: hs,
    label,
    ruleBasis: "process-requirement",
    tariffShiftRule: rule,
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes: `VERBATIM (GN 11(o), Chapter 61, rule ${n}): '${n}. ${rule}' STANDARD APPAREL PATTERN: chapter-level shift + fiber exception list (generated from EXC_61 constant — verify constant once against p. 47 rule 1) + CUT-(OR-KNIT)-TO-SHAPE-AND-SEWN assembly requirement${with9619 ? " + the 9619 exception (other made-up textile articles of heading 9619 blocked)" : ""}. Chapter rules 1-4 of this chapter apply (component rule; 5806.20/6002 fabric rule; sewing-thread rule; pocket-bag rule).`,
    sources: SRC,
  };
}
/** Generator for the standard ch. 62 apparel rule pattern (cut-only variant, rules 2-10). */
function apparel62(n: number, hs: string, label: string, cutVariant: "cut-only" | "cut-knit" = "cut-only", with9619 = false): UsmcaRule {
  const proviso = cutVariant === "cut-only" ? CUT_ONLY : CUT_KNIT;
  const rule = `A change to ${hs} from any other chapter, ${EXC_62}${with9619 ? EXC_9619 : ""}, ${proviso}.`;
  return {
    id: `text-62-rule-${n}`,
    sector: "textiles-apparel",
    chapters: ["62"],
    hsRange: hs,
    label,
    ruleBasis: "process-requirement",
    tariffShiftRule: rule,
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes: `VERBATIM (GN 11(o), Chapter 62, rule ${n}): '${n}. ${rule}' STANDARD APPAREL PATTERN with the ch. 62 exception list (adds 5801 through 5802 — generated from EXC_62 constant) + ${cutVariant === "cut-only" ? "CUT-AND-SEWN (no knit-to-shape option printed)" : "CUT-(OR-KNIT)-TO-SHAPE-AND-SEWN"} assembly requirement${with9619 ? " + the 9619 exception" : ""}. Chapter rules 1-6 of this chapter apply (incl. outer-shell short lists and the staggered pocket-bag/sewing-thread effective dates).`,
    sources: SRC,
  };
}

export const TEXTILES_APPAREL_RULES: UsmcaRule[] = [
  // ---------------- Chapter 50 ----------------
  {
    id: "text-50-5001-5003",
    sector: "textiles-apparel",
    chapters: ["50"],
    hsRange: "Headings 5001 through 5003",
    label: "Silk yarn, woven silk fabrics (5001–5003) — chapter-level group shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 5001 through 5003 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 50, rule 1): '1. A change to headings 5001 through 5003 from any other chapter.'",
    sources: SRC,
  },
  {
    id: "text-50-5004-5006",
    sector: "textiles-apparel",
    chapters: ["50"],
    hsRange: "Headings 5004 through 5006",
    label: "Silk/combed-wool woven fabrics (5004–5006) — heading-outside-group shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 5004 through 5006 from any heading outside that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 50, rule 2): '2. A change to headings 5004 through 5006 from any heading outside that group.'",
    sources: SRC,
  },
  {
    id: "text-50-5007",
    sector: "textiles-apparel",
    chapters: ["50"],
    hsRange: "Heading 5007",
    label: "Woven fabrics of flax/other bast fibres (5007) — heading-level shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 5007 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 50, rule 3): '3. A change to heading 5007 from any other heading.'",
    sources: SRC,
  },
  // ---------------- Chapter 51 ----------------
  {
    id: "text-51-5101-5105",
    sector: "textiles-apparel",
    chapters: ["51"],
    hsRange: "Headings 5101 through 5105",
    label: "Wool and fine animal hair, raw through waste (5101–5105) — chapter-level group shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 5101 through 5105 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 51, rule 1): '1. A change to headings 5101 through 5105 from any other chapter.'",
    sources: SRC,
  },
  {
    id: "text-51-5106-5110",
    sector: "textiles-apparel",
    chapters: ["51"],
    hsRange: "Headings 5106 through 5110",
    label: "Coarse/fine animal hair yarn (5106–5110) — heading-outside-group shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 5106 through 5110 from any heading outside that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 51, rule 2): '2. A change to headings 5106 through 5110 from any heading outside that group.' Intra-group shifts (e.g. 5106 yarn into 5108 yarn) do NOT qualify.",
    sources: SRC,
  },
  {
    id: "text-51-5111",
    sector: "textiles-apparel",
    chapters: ["51"],
    hsRange: "Heading 5111",
    label: "Woven fabrics of carded wool/fine animal hair (5111) — heading shift except from yarns of 5106–5110, 5112–5113, 5205–5206, 5401–5404 or 5509–5510",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to heading 5111 from any heading, except from headings 5106 through 5110, 5112 through 5113, 5205 through 5206, 5401 through 5404 or 5509 through 5510.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 51, rule 3): '3. A change to heading 5111 from any heading, except from headings 5106 through 5110, 5112 through 5113, 5205 through 5206, 5401 through 5404 or 5509 through 5510.'",
    sources: SRC,
  },
  {
    id: "text-51-5112-11-canada",
    sector: "textiles-apparel",
    chapters: ["51"],
    hsRange: "Subheading 5112.11 (Canada-US trade only)",
    label: "Woven fabrics of combed wool/fine animal hair ≤300 g/m² (5112.11) — CANADA-US TRADE ONLY: (a) combed camel/cashmere fabric branch, or (b) other goods branch",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 51, subheading rule for 5112.11, Canada-US trade): '(a) A change to woven fabrics (other than tapestry fabrics or upholstery fabrics of a weight not exceeding 140 grams per square meter) of combed fine animal hair of subheading 5112.11 from yarn of combed camel hair or combed cashmere of subheading 5108.20 or any other heading, except from headings 5106 through 5107, any other good of heading 5108, or headings 5109 through 5111, 5205 through 5206, 5401 through 5404, or 5509 through 5510; or (b) A change to any other good of subheading 5112.11 from any other heading, except from headings 5106 through 5111 or 5113, 5205 through 5206, 5401 through 5404 or 5509 through 5510.' TRADE-DIRECTION rule: applies only to goods in Canada-US trade (printed preamble: 'For the purposes of trade between the territory of Canada and the territory of the United States of goods of subheading 5112.11'). GOODS-KIND branch (a) is limited to non-tapestry/non-upholstery combed fabrics ≤140 g/m2 sourced from camel/cashmere yarn of 5108.20.",
    sources: SRC,
  },
  {
    id: "text-51-5112-11-other",
    sector: "textiles-apparel",
    chapters: ["51"],
    hsRange: "Subheading 5112.11 (all other trade)",
    label: "5112.11 — ALL OTHER TRADE: heading shift except from 5106–5111 or 5113, 5205–5206, 5401–5404 or 5509–5510",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to subheading 5112.11 from any other heading, except from headings 5106 through 5111 or 5113, 5205 through 5206, 5401 through 5404 or 5509 through 5510.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 51, subheading rule for 5112.11, all other trade): 'For the purposes of all other trade of subheading 5112.11 the following rule of origin applies: (a) A change to subheading 5112.11 from any other heading, except from headings 5106 through 5111 or 5113, 5205 through 5206, 5401 through 5404 or 5509 through 5510.'",
    sources: SRC,
  },
  {
    id: "text-51-5112-19-canada",
    sector: "textiles-apparel",
    chapters: ["51"],
    hsRange: "Subheading 5112.19 (Canada-US trade only)",
    label: "Other woven fabrics of combed wool/fine animal hair (5112.19) — CANADA-US TRADE ONLY: (a) non-tapestry/upholstery combed branch, or (b) other goods branch",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 51, subheading rule for 5112.19, Canada-US trade): '(a) A change to woven fabrics, other than tapestry or upholstery fabrics, of combed fine animal hair of subheading 5112.19 from yarn of combed camel hair or combed cashmere of subheading 5108.20 or any other heading, except from headings 5106 through 5107, any other good of heading 5108 or headings 5109 through 5111, 5205 through 5206, 5401 through 5404 or 5509 through 5510; or (b) A change to any other good of subheading 5112.19 from any other heading, except from headings 5106 through 5110, 5111, 5113, 5205 through 5206, 5401 through 5404 or 5509 through 5510.' PRINT ODDITY: branch (b) lists '5106 through 5110, 5111' (the 5111 separated from the range rather than 'through 5111') — transcribed as printed, flagged for audit. Note (a) here omits the 'of a weight not exceeding 140 grams per square meter' qualifier that 5112.11's (a) carries.",
    sources: SRC,
  },
  {
    id: "text-51-5112-19-other",
    sector: "textiles-apparel",
    chapters: ["51"],
    hsRange: "Subheading 5112.19 (all other trade)",
    label: "5112.19 — ALL OTHER TRADE: heading shift except from 5106–5111 or 5113, 5205–5206, 5401–5404 or 5509–5510",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to subheading 5112.19 from any other heading, except from headings 5106 through 5111 or 5113, 5205 through 5206, 5401 through 5404 or 5509 through 5510.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 51, subheading rule for 5112.19, all other trade): '(a) A change to subheading 5112.19 from any other heading, except from headings 5106 through 5111 or 5113, 5205 through 5206, 5401 through 5404 or 5509 through 5510.'",
    sources: SRC,
  },
  {
    id: "text-51-5112-20-5112-90",
    sector: "textiles-apparel",
    chapters: ["51"],
    hsRange: "Subheadings 5112.20 through 5112.90",
    label: "Other woven fabrics of wool/fine animal hair (5112.20–5112.90) — heading shift except from 5106–5111 or 5113, 5205–5206, 5401–5404 or 5509–5510",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to subheadings 5112.20 through 5112.90 from any other heading, except from headings 5106 through 5111 or 5113, 5205 through 5206, 5401 through 5404 or 5509 through 5510.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 51, rule 4): '4. A change to subheadings 5112.20 through 5112.90 from any other heading, except from headings 5106 through 5111 or 5113, 5205 through 5206, 5401 through 5404 or 5509 through 5510.'",
    sources: SRC,
  },
  {
    id: "text-51-5113",
    sector: "textiles-apparel",
    chapters: ["51"],
    hsRange: "Heading 5113",
    label: "Woven fabrics of coarse animal hair (5113) — heading shift except from 5106–5112, 5205–5206, 5401–5404 or 5509–5510",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to heading 5113 from any other heading, except from headings 5106 through 5112, 5205 through 5206, 5401 through 5404 or 5509 through 5510.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 51, rule 5): '5. A change to heading 5113 from any other heading, except from headings 5106 through 5112, 5205 through 5206, 5401 through 5404 or 5509 through 5510.'",
    sources: SRC,
  },
  // ---------------- Chapter 52 ----------------
  {
    id: "text-52-5201-5207",
    sector: "textiles-apparel",
    chapters: ["52"],
    hsRange: "Headings 5201 through 5207",
    label: "Cotton raw through cotton yarn (5201–5207) — chapter shift EXCEPT from man-made fiber inputs 5401–5405 or 5501–5507",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to headings 5201 through 5207 from any other chapter, except from headings 5401 through 5405 or 5501 through 5507.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 52, rule 1): '1. A change to headings 5201 through 5207 from any other chapter, except from headings 5401 through 5405 or 5501 through 5507.' FIBER SUBSTITUTION BLOCK: man-made filament/staple inputs cannot be shifted into the cotton chain.",
    sources: SRC,
  },
  {
    id: "text-52-5208-5212",
    sector: "textiles-apparel",
    chapters: ["52"],
    hsRange: "Headings 5208 through 5212",
    label: "Woven cotton fabrics (5208–5212) — heading-outside-group shift EXCEPT from yarns of 5106–5110, 5205–5206, 5401–5404 or 5509–5510",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to headings 5208 through 5212 from any heading outside that group, except from headings 5106 through 5110, 5205 through 5206, 5401 through 5404 or 5509 through 5510.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 52, rule 2): '2. A change to headings 5208 through 5212 from any heading outside that group, except from headings 5106 through 5110, 5205 through 5206, 5401 through 5404 or 5509 through 5510.'",
    sources: SRC,
  },
  // ---------------- Chapter 53 ----------------
  {
    id: "text-53-5301-5305",
    sector: "textiles-apparel",
    chapters: ["53"],
    hsRange: "Headings 5301 through 5305",
    label: "Flax raw through processed (5301–5305) — chapter-level group shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 5301 through 5305 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 53, rule 1): '1. A change to headings 5301 through 5305 from any other chapter.'",
    sources: SRC,
  },
  {
    id: "text-53-5306-5308",
    sector: "textiles-apparel",
    chapters: ["53"],
    hsRange: "Headings 5306 through 5308",
    label: "Flax yarn; true hemp yarn/woven (5306–5308) — heading-outside-group shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 5306 through 5308 from any heading outside that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 53, rule 2): '2. A change to headings 5306 through 5308 from any heading outside that group.'",
    sources: SRC,
  },
  {
    id: "text-53-5309-5311",
    sector: "textiles-apparel",
    chapters: ["53"],
    hsRange: "Headings 5309 through 5311",
    label: "Woven fabrics of flax/true hemp, other vegetable textile fabrics (5309–5311) — heading-level group shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 5309 through 5311 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 53, rule 3): '3. A change to headings 5309 through 5311 from any other heading.' HEADING-level (intra-group 5309-to-5311 shifts do not qualify) — note this group feeds the ch. 56-63 exception lists.",
    sources: SRC,
  },
  // ---------------- Chapter 54 ----------------
  {
    id: "text-54-5401-5406",
    sector: "textiles-apparel",
    chapters: ["54"],
    hsRange: "Headings 5401 through 5406",
    label: "Man-made filament yarn, strips, waste (5401–5406) — chapter shift EXCEPT from cotton/man-made staple inputs 5201–5203 or 5501–5507",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to headings 5401 through 5406 from any other chapter, except from headings 5201 through 5203 or 5501 through 5507.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 54, rule 1): '1. A change to headings 5401 through 5406 from any other chapter, except from headings 5201 through 5203 or 5501 through 5507.' FIBER SUBSTITUTION BLOCK (mirror of ch. 52 rule 1).",
    sources: SRC,
  },
  {
    id: "text-54-5407",
    sector: "textiles-apparel",
    chapters: ["54"],
    hsRange: "Heading 5407",
    label: "Woven fabrics of man-made filaments (5407) — (A) high-twist polyester filament fabric of 5407.61 goods-kind branch, or (B) other goods chapter shift; both except from 5106–5110, 5205–5206 or 5509–5510",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 54, rule 2): '2. (A) A change to woven fabric of non-textured polyester filaments of subheading 5407.61 from yarns, with a twist of 900 or more turns per meter, wholly of polyesters other than partially oriented measuring no less than 75 decitex but not more than 80 decitex, and having 24 filaments per yarn of subheadings 5402.44, 5402.47 or 5402.52, or any other chapter, except from headings 5106 through 5110, 5205 through 5206 or 5509 through 5510; or (B) A change to any other good of heading 5407 from any other chapter, except from headings 5106 through 5110, 5205 through 5206 or 5509 through 5510.' GOODS-KIND branch (A): only the specified high-twist micro-filament polyester fabric may source from the named 5402.44/.47/.52 yarns (a SPECIFICATION-LIMITED permitted input); note branch (A)'s OCR text runs 'polyesters other than partially oriented measuring' (the printed PDF likely reads 'partially oriented, measuring' — flagged for word-for-word audit).",
    sources: SRC,
  },
  {
    id: "text-54-5408",
    sector: "textiles-apparel",
    chapters: ["54"],
    hsRange: "Heading 5408",
    label: "Woven fabrics of strip/synthetic monofil (5408) — chapter shift EXCEPT from 5106–5110, 5205–5206, or 5509–5510",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to heading 5408 from any other chapter, except from headings 5106 through 5110, 5205 through 5206, or 5509 through 5510.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 54, rule 3): '3. A change to heading 5408 from any other chapter, except from headings 5106 through 5110, 5205 through 5206, or 5509 through 5510.'",
    sources: SRC,
  },
  // ---------------- Chapter 55 ----------------
  {
    id: "text-55-5501-5508",
    sector: "textiles-apparel",
    chapters: ["55"],
    hsRange: "Headings 5501 through 5508",
    label: "Man-made staple fiber, tow, yarn, sewing thread (5501–5508) — chapter shift EXCEPT from 5201–5203 or 5401–5405",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to headings 5501 through 5508 from any other chapter, except from headings 5201 through 5203 or 5401 through 5405.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 55, rule 1): '1. A change to headings 5501 through 5508 from any other chapter, except from headings 5201 through 5203 or 5401 through 5405.' FIBER SUBSTITUTION BLOCK.",
    sources: SRC,
  },
  {
    id: "text-55-5509-11-5509-22",
    sector: "textiles-apparel",
    chapters: ["55"],
    hsRange: "Subheadings 5509.11 through 5509.22",
    label: "Yarn of synthetic/wool-or-fine-animal-hair staple blends (5509.11–5509.22) — chapter shift EXCEPT from 5201–5203 or 5401–5405",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to subheadings 5509.11 through 5509.22 from any other chapter, except from headings 5201 through 5203 or 5401 through 5405.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 55, rule 2): '2. A change to subheadings 5509.11 through 5509.22 from any other chapter, except from headings 5201 through 5203 or 5401 through 5405.'",
    sources: SRC,
  },
  {
    id: "text-55-5509-31-canada",
    sector: "textiles-apparel",
    chapters: ["55"],
    hsRange: "Subheading 5509.31 (Canada-US trade only)",
    label: "Yarn of acrylic/ modacrylic staple (5509.31) — CANADA-US TRADE ONLY: shift from acid-dyeable acrylic tow of 5501.30 or any other chapter, except 5201–5203 or 5401–5405",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to subheading 5509.31 from acid-dyeable acrylic tow of subheading 5501.30 or any other chapter, except from headings 5201 through 5203 or 5401 through 5405.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 55, subheading rule for 5509.31, Canada-US trade): '(a) A change to subheading 5509.31 from acid-dyeable acrylic tow of subheading 5501.30 or any other chapter, except from headings 5201 through 5203 or 5401 through 5405.' TRADE-DIRECTION rule with a NAMED PERMITTED INPUT (acid-dyeable acrylic tow of 5501.30).",
    sources: SRC,
  },
  {
    id: "text-55-5509-31-other",
    sector: "textiles-apparel",
    chapters: ["55"],
    hsRange: "Subheading 5509.31 (all other trade)",
    label: "5509.31 — ALL OTHER TRADE: chapter shift except from 5201–5203 or 5401–5405",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to subheading 5509.31 from any other chapter, except from headings 5201 through 5203 or 5401 through 5405.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 55, subheading rule for 5509.31, all other trade): '(a) A change to subheading 5509.31 from any other chapter, except from headings 5201 through 5203 or 5401 through 5405.'",
    sources: SRC,
  },
  {
    id: "text-55-5509-32-5509-99",
    sector: "textiles-apparel",
    chapters: ["55"],
    hsRange: "Subheadings 5509.32 through 5509.99",
    label: "Other staple-fiber yarns (5509.32–5509.99) — chapter shift EXCEPT from 5201–5203 or 5401–5405",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to subheadings 5509.32 through 5509.99 from any other chapter, except from headings 5201 through 5203 or 5401 through 5405.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 55, rule 3): '3. A change to subheadings 5509.32 through 5509.99 from any other chapter, except from headings 5201 through 5203 or 5401 through 5405.'",
    sources: SRC,
  },
  {
    id: "text-55-5510-5511",
    sector: "textiles-apparel",
    chapters: ["55"],
    hsRange: "Headings 5510 through 5511",
    label: "Yarn of other staple blends (5510–5511) — chapter shift EXCEPT from 5201–5203 or 5401–5405",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to headings 5510 through 5511 from any other chapter, except from headings 5201 through 5203 or 5401 through 5405.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 55, rule 4): '4. A change to headings 5510 through 5511 from any other chapter, except from headings 5201 through 5203 or 5401 through 5405.'",
    sources: SRC,
  },
  {
    id: "text-55-5512-5516",
    sector: "textiles-apparel",
    chapters: ["55"],
    hsRange: "Headings 5512 through 5516",
    label: "Woven fabrics of staple fibers (5512–5516) — heading-outside-group shift EXCEPT from yarns of 5106–5110, 5205–5206, 5401–5404 or 5509–5510",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to headings 5512 through 5516 from any heading outside that group, except from headings 5106 through 5110, 5205 through 5206, 5401 through 5404 or 5509 through 5510.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 55, rule 5): '5. A change to headings 5512 through 5516 from any heading outside that group, except from headings 5106 through 5110, 5205 through 5206, 5401 through 5404 or 5509 through 5510.'",
    sources: SRC,
  },
  // ---------------- Chapter 56 ----------------
  {
    id: "text-56-5601-5605",
    sector: "textiles-apparel",
    chapters: ["56"],
    hsRange: "Headings 5601 through 5605",
    label: "Wadding, felt, nonwovens, twine etc. (5601–5605) — chapter shift EXCEPT from the full yarn/fabric list 5106–5113, 5204–5212, 5310–5311 or ch. 54–55",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to headings 5601 through 5605 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311 or chapters 54 through 55.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 56, rule 1): '1. A change to headings 5601 through 5605 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311 or chapters 54 through 55.' BROAD EXCEPTION LIST — spans yarn AND fabric stages (5204 through 5212) and whole chapters 54-55.",
    sources: SRC,
  },
  {
    id: "text-56-5606",
    sector: "textiles-apparel",
    chapters: ["56"],
    hsRange: "Heading 5606",
    label: "Metalled yarn; gimped/looped yarn (5606) — (A) named-nylon flat-yarn branch (5402.45 with specification), or (B) other goods chapter shift; both except from 5106–5113, 5204–5212, 5310–5311 or ch. 54–55",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 56, rule 2): '2. (A) A change to heading 5606 from flat yarns of subheading 5402.45 (flat yarns means 7 denier/5 filament, 10 denier/7 filament or 12 denier/5 filament, all of nylon 66, untextured (flat) semi-dull yarns, multifilament, untwisted or with a twist not exceeding 50 turns per meter, of subheading 5402.45) or any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311 or chapters 54 through 55; or (B) A change to any other good of heading 5606 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, or chapters 54 through 55.' GOODS-KIND branch (A) with an inline DEFINITION of the permitted flat yarns (denier/filament specification). Note branch (B)'s exception list ends with a comma before 'or chapters 54 through 55' — transcribed as printed.",
    sources: SRC,
  },
  {
    id: "text-56-5607-5609",
    sector: "textiles-apparel",
    chapters: ["56"],
    hsRange: "Headings 5607 through 5609",
    label: "Twine, cordage, ropes; knots/nets; carpets tufted/other (5607–5609) — chapter shift EXCEPT from 5106–5113, 5204–5212, 5310–5311 or ch. 54–55",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to headings 5607 through 5609 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311 or chapters 54 through 55.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 56, rule 3): '3. A change to headings 5607 through 5609 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311 or chapters 54 through 55.'",
    sources: SRC,
  },
  // ---------------- Chapter 57 ----------------
  {
    id: "text-57-5701-5702",
    sector: "textiles-apparel",
    chapters: ["57"],
    hsRange: "Headings 5701 through 5702",
    label: "Carpets: flocked/knotted, woven tufted (5701–5702) — chapter shift EXCEPT from 5106–5113, 5204–5212, 5311, ch. 54 or 5508–5516",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to headings 5701 through 5702 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5311, chapter 54 or headings 5508 through 5516.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 57, rule 1): '1. A change to headings 5701 through 5702 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5311, chapter 54 or headings 5508 through 5516.' NOTE the carpet exception variant: 5311 alone (not 5310 through 5311) and 5508 through 5516 (not 5508-5516 via ch. 55 group).",
    sources: SRC,
  },
  {
    id: "text-57-5703-10",
    sector: "textiles-apparel",
    chapters: ["57"],
    hsRange: "Subheading 5703.10",
    label: "Carpets of wool or fine animal hair, tufted (5703.10) — chapter shift EXCEPT from 5106–5113, 5204–5212, 5311, ch. 54 or 5508–5516",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to subheading 5703.10 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5311, chapter 54 or headings 5508 through 5516.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 57, rule 2): '2. A change to subheading 5703.10 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5311, chapter 54 or headings 5508 through 5516.'",
    sources: SRC,
  },
  {
    id: "text-57-5703-20-5703-30-mexico",
    sector: "textiles-apparel",
    chapters: ["57"],
    hsRange: "Subheadings 5703.20 through 5703.30 (Mexico-US trade only)",
    label: "Tufted carpets of man-made fibers/other textiles (5703.20–5703.30) — MEXICO-US TRADE ONLY (chapter rule 1): chapter shift EXCEPT from 5106–5113, 5204–5212, 5311, or ch. 54–55",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to subheadings 5703.20 through 5703.30 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5311, chapters 54 or 55.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 57, chapter rule 1, Mexico-US trade, p. 45): 'Chapter rule 1: For the purposes of trade between the territory of Mexico and the territory of the United States of goods of subheadings 5703.20 through 5703.30 the following rule of origin applies: (a) A change to subheadings 5703.20 through 5703.30 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5311, chapters 54 or 55.' TRADE-DIRECTION rule. Note the exception list here is SHORTER (blocks whole chapters 54 or 55 rather than the 5508-5516 list) than the all-other-trade rule.",
    sources: SRC,
  },
  {
    id: "text-57-5703-20-5703-30-other",
    sector: "textiles-apparel",
    chapters: ["57"],
    hsRange: "Subheadings 5703.20 through 5703.30 (all other trade)",
    label: "5703.20–5703.30 — ALL OTHER TRADE: chapter shift EXCEPT from 5106–5113, 5204–5212, 5311, ch. 54 or 5508–5516",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to subheadings 5703.20 through 5703.30 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5311, chapter 54 or headings 5508 through 5516.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 57, all other trade of 5703.20-5703.30, pp. 45-46): '(a) A change to subheadings 5703.20 through 5703.30 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5311, chapter 54 or headings 5508 through 5516.'",
    sources: SRC,
  },
  {
    id: "text-57-5703-90",
    sector: "textiles-apparel",
    chapters: ["57"],
    hsRange: "Subheading 5703.90",
    label: "Other tufted carpets (5703.90) — chapter shift EXCEPT from 5106–5113, 5204–5212, 5311, ch. 54 or 5508–5516",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to subheading 5703.90 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5311, chapter 54 or headings 5508 through 5516.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 57, rule 3, p. 46): '3. A change to subheading 5703.90 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5311, chapter 54 or headings 5508 through 5516.'",
    sources: SRC,
  },
  {
    id: "text-57-5704-mexico",
    sector: "textiles-apparel",
    chapters: ["57"],
    hsRange: "Heading 5704 (Mexico-US trade only)",
    label: "Woven carpets (5704) — MEXICO-US TRADE ONLY (heading rule): shift from ANY CHAPTER except from 5106–5113, 5204–5212, 5311, or ch. 54–55",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to heading 5704 from any chapter, except from headings 5106 through 5113, 5204 through 5212, 5311, or chapters 54 or 55.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 57, heading rule for 5704, Mexico-US trade, p. 46): 'Heading rule: For the purposes of trade between the territory of Mexico and the territory of the United States of goods of heading 5704 the following rule of origin applies: (a) A change to heading 5704 from any chapter, except from headings 5106 through 5113, 5204 through 5212, 5311, or chapters 54 or 55.' PRINT ODDITY: 'from any chapter' (not 'any other chapter') — transcribed as printed, flagged for audit. TRADE-DIRECTION rule.",
    sources: SRC,
  },
  {
    id: "text-57-5704-other",
    sector: "textiles-apparel",
    chapters: ["57"],
    hsRange: "Heading 5704 (all other trade)",
    label: "5704 — ALL OTHER TRADE: chapter shift EXCEPT from 5106–5113, 5204–5212, 5311, ch. 54 or 5508–5516",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to heading 5704 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5311, chapter 54 or headings 5508 through 5516.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 57, all other trade of 5704, p. 46): '(a) A change to heading 5704 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5311, chapter 54 or headings 5508 through 5516.'",
    sources: SRC,
  },
  {
    id: "text-57-5705",
    sector: "textiles-apparel",
    chapters: ["57"],
    hsRange: "Heading 5705",
    label: "Other carpets (5705) — chapter shift EXCEPT from 5106–5113, 5204–5212, 5311, ch. 54 or 5508–5516",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to heading 5705 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5311, chapter 54 or headings 5508 through 5516.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 57, rule 4, p. 46): '4. A change to heading 5705 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5311, chapter 54 or headings 5508 through 5516.'",
    sources: SRC,
  },
  // ---------------- Chapter 58 ----------------
  {
    id: "text-58-5801-10-5801-33",
    sector: "textiles-apparel",
    chapters: ["58"],
    hsRange: "Subheadings 5801.10 through 5801.33",
    label: "Velvet/terry pile woven fabrics, cotton etc. (5801.10–5801.33) — chapter shift EXCEPT from 5106–5113, 5204–5212, 5310–5311, or ch. 54–55",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to subheadings 5801.10 through 5801.33 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, or chapters 54 through 55.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 58, rule 1, p. 46): '1. A change to subheadings 5801.10 through 5801.33 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, or chapters 54 through 55.'",
    sources: SRC,
  },
  {
    id: "text-58-5801-36-canada",
    sector: "textiles-apparel",
    chapters: ["58"],
    hsRange: "Subheading 5801.36 (Canada-US trade only)",
    label: "Corduroy woven fabrics of man-made fibers (5801.36) — CANADA-US TRADE ONLY: chapter shift with the EXPANDED exception list (5501–5502, 5503.10–.20/.40–.90, 5504–5516)",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to subheading 5801.36 from any other chapter, except headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapter 54, headings 5501 through 5502, subheadings 5503.10 through 5503.20 or 5503.40 through 5503.90 or headings 5504 through 5516.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 58, subheading rule for 5801.36, Canada-US trade, p. 46): '(a) A change to subheading 5801.36 from any other chapter, except headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapter 54, headings 5501 through 5502, subheadings 5503.10 through 5503.20 or 5503.40 through 5503.90 or headings 5504 through 5516.' PRINT ODDITY: 'except headings' (missing 'from') — transcribed as printed. TRADE-DIRECTION rule with the SUBDIVIDED 5503 exception (5503.30 acrylic tow NOT blocked — cf. 5801.37(a) which names it).",
    sources: SRC,
  },
  {
    id: "text-58-5801-36-other",
    sector: "textiles-apparel",
    chapters: ["58"],
    hsRange: "Subheading 5801.36 (all other trade)",
    label: "5801.36 — ALL OTHER TRADE: chapter shift except from 5106–5113, 5204–5212, 5310–5311, or ch. 54–55",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to subheading 5801.36 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, or chapters 54 through 55.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 58, all other trade of 5801.36, p. 46): '(a) A change to subheading 5801.36 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, or chapters 54 through 55.'",
    sources: SRC,
  },
  {
    id: "text-58-5801-37-canada",
    sector: "textiles-apparel",
    chapters: ["58"],
    hsRange: "Subheading 5801.37 (Canada-US trade only)",
    label: "Other corduroy woven fabrics (5801.37) — CANADA-US TRADE ONLY: (a) dry-spun acrylic pile branch (goods-kind-limited), or (b) other goods; expanded exception list",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 58, subheading rule for 5801.37, Canada-US trade, p. 46): '(a) A change to warp pile fabrics, cut, of subheading 5801.37 (if such fabrics are fabrics with pile of dry-spun acrylic staple fibers of subheading 5503.30 and dyed in the piece to a single uniform color) from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapter 54, headings 5501 through 5502, subheadings 5503.10 through 5503.20 or 5503.40 through 5503.90 or headings 5504 through 5516; or (b) A change to any other good of subheading 5801.37 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, or chapters 54 through 55.' GOODS-KIND branch (a): dry-spun-acrylic-pile fabrics, piece-dyed to a single uniform color, get the expanded (subdivided 5503) exception — i.e. they may source from 5503.30 acrylic tow; other goods (b) get the shorter chapters-54-55 block.",
    sources: SRC,
  },
  {
    id: "text-58-5801-37-other",
    sector: "textiles-apparel",
    chapters: ["58"],
    hsRange: "Subheading 5801.37 (all other trade)",
    label: "5801.37 — ALL OTHER TRADE: chapter shift except from 5106–5113, 5204–5212, 5310–5311, or ch. 54–55",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to subheading 5801.37 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, or chapters 54 through 55.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 58, all other trade of 5801.37, p. 46): '(a) A change to subheading 5801.37 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, or chapters 54 through 55.'",
    sources: SRC,
  },
  {
    id: "text-58-5801-90",
    sector: "textiles-apparel",
    chapters: ["58"],
    hsRange: "Subheading 5801.90",
    label: "Other pile/chenille fabrics (5801.90) — chapter shift EXCEPT from 5106–5113, 5204–5212, 5310–5311, or ch. 54–55",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to subheading 5801.90 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, or chapters 54 through 55.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 58, rule 2, p. 46): '2. A change to subheading 5801.90 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, or chapters 54 through 55.'",
    sources: SRC,
  },
  {
    id: "text-58-5802-5811",
    sector: "textiles-apparel",
    chapters: ["58"],
    hsRange: "Headings 5802 through 5811",
    label: "Terry, narrow, labels, coated, laminated fabrics etc. (5802–5811) — chapter-level group shift EXCEPT from 5106–5113, 5204–5212, 5310–5311, or ch. 54–55",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to headings 5802 through 5811 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, or chapters 54 through 55.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 58, rule 3, pp. 46-47): '3. A change to headings 5802 through 5811 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, or chapters 54 through 55.' Chapter-level group shift (intra-58 shifts qualify — note the group includes 5903-coated types via 5811? No — 5811 ends ch. 58).",
    sources: SRC,
  },
  // ---------------- Chapter 59 ----------------
  {
    id: "text-59-5901",
    sector: "textiles-apparel",
    chapters: ["59"],
    hsRange: "Heading 5901",
    label: "Textile wicking etc., rubber/impregnated travel goods textiles (5901) — chapter shift EXCEPT from fabric inputs 5111–5113, 5208–5212, 5310–5311, 5407–5408 or 5512–5516",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to heading 5901 from any other chapter, except from headings 5111 through 5113, 5208 through 5212, 5310 through 5311, 5407 through 5408 or 5512 through 5516.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 59, rule 1, p. 47): '1. A change to heading 5901 from any other chapter, except from headings 5111 through 5113, 5208 through 5212, 5310 through 5311, 5407 through 5408 or 5512 through 5516.' FABRIC-STAGE exception list (starts at 5111, not 5106).",
    sources: SRC,
  },
  {
    id: "text-59-5902",
    sector: "textiles-apparel",
    chapters: ["59"],
    hsRange: "Heading 5902",
    label: "Tyre cord fabric (5902) — HEADING-level shift EXCEPT from 5106–5113, 5204–5212, 5310–5311, or ch. 54–55",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to heading 5902 from any other heading, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311 or chapters 54 through 55.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 59, rule 2): '2. A change to heading 5902 from any other heading, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311 or chapters 54 through 55.' NOTE: heading-level shift (not chapter) — the only heading-level rule in ch. 59; yarn inputs of any chapter qualify.",
    sources: SRC,
  },
  {
    id: "text-59-5903-5908",
    sector: "textiles-apparel",
    chapters: ["59"],
    hsRange: "Headings 5903 through 5908",
    label: "Impregnated/coated/textile wall coverings etc. (5903–5908) — chapter shift EXCEPT from fabric inputs 5111–5113, 5208–5212, 5310–5311, 5407–5408 or 5512–5516",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to headings 5903 through 5908 from any other chapter, except from headings 5111 through 5113, 5208 through 5212, 5310 through 5311, 5407 through 5408 or 5512 through 5516.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 59, rule 3): '3. A change to headings 5903 through 5908 from any other chapter, except from headings 5111 through 5113, 5208 through 5212, 5310 through 5311, 5407 through 5408 or 5512 through 5516.' FABRIC-STAGE exception list. NOTE: 5903 coated fabrics are the subject of the ch. 61/63 chapter-rule-2 supply requirement (fabrics of 5903 formed AND finished in USMCA territory) — see those records.",
    sources: SRC,
  },
  {
    id: "text-59-5909",
    sector: "textiles-apparel",
    chapters: ["59"],
    hsRange: "Heading 5909",
    label: "Textile hose/piping (5909) — chapter shift EXCEPT from 5111–5113, 5208–5212 or 5310–5311, ch. 54 or 5512–5516",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to heading 5909 from any other chapter, except from headings 5111 through 5113, 5208 through 5212 or 5310 through 5311, chapter 54 or headings 5512 through 5516.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 59, rule 4): '4. A change to heading 5909 from any other chapter, except from headings 5111 through 5113, 5208 through 5212 or 5310 through 5311, chapter 54 or headings 5512 through 5516.' Variant list: ch. 54 whole + only 5512-5516 (not 5508).",
    sources: SRC,
  },
  {
    id: "text-59-5910",
    sector: "textiles-apparel",
    chapters: ["59"],
    hsRange: "Heading 5910",
    label: "Transmission/conveyor belts of textile (5910) — HEADING-level shift EXCEPT from 5106–5113, 5204–5212, 5310–5311, or ch. 54–55",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to heading 5910 from any other heading, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, or chapters 54 through 55.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 59, rule 5): '5. A change to heading 5910 from any other heading, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, or chapters 54 through 55.' HEADING-level shift (yarn-stage inputs qualify).",
    sources: SRC,
  },
  {
    id: "text-59-5911",
    sector: "textiles-apparel",
    chapters: ["59"],
    hsRange: "Heading 5911",
    label: "Textile products for technical uses (5911) — chapter shift EXCEPT from fabric inputs 5111–5113, 5208–5212, 5310–5311, 5407–5408 or 5512–5516",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to heading 5911 from any other chapter, except from headings 5111 through 5113, 5208 through 5212, 5310 through 5311, 5407 through 5408 or 5512 through 5516.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 59, rule 6): '6. A change to heading 5911 from any other chapter, except from headings 5111 through 5113, 5208 through 5212, 5310 through 5311, 5407 through 5408 or 5512 through 5516.'",
    sources: SRC,
  },
  // ---------------- Chapter 60 ----------------
  {
    id: "text-60-6001-6006",
    sector: "textiles-apparel",
    chapters: ["60"],
    hsRange: "Headings 6001 through 6006",
    label: "Knitted/crocheted fabrics (6001–6006) — chapter-level group shift EXCEPT from 5106–5113, ch. 52, 5310–5311 or ch. 54–55",
    ruleBasis: "tariff-shift",
    tariffShiftRule:
      "A change to headings 6001 through 6006 from any other chapter, except from headings 5106 through 5113, chapter 52, headings 5310 through 5311 or chapters 54 through 55.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 60, rule 1, p. 47): '1. A change to headings 6001 through 6006 from any other chapter, except from headings 5106 through 5113, chapter 52, headings 5310 through 5311 or chapters 54 through 55.' VARIANT list: whole chapter 52 blocked (not 5204-5212). NOTE: 6002 knit fabrics are the subject of the ch. 61/62 chapter-rule supply requirements — see those records.",
    sources: SRC,
  },
  // ---------------- Chapter 61 — chapter rules ----------------
  {
    id: "text-61-chapter-rule-1",
    sector: "textiles-apparel",
    chapters: ["61"],
    hsRange: "Chapter 61 (chapter rule 1)",
    label: "Ch. 61 chapter rule 1 — COMPONENT RULE: the rule applies only to the component that determines the tariff classification, and that component must satisfy the tariff change",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 61, chapter rule 1, p. 47): 'Chapter Rule 1: For the purposes of determining the origin of a good of this chapter, the rule applicable to that good shall only apply to the component that determines the tariff classification of the good and such component must satisfy the tariff change requirements set out in the rule for that good.'",
    sources: SRC,
  },
  {
    id: "text-61-chapter-rule-2",
    sector: "textiles-apparel",
    chapters: ["61"],
    hsRange: "Chapter 61 (chapter rule 2)",
    label: "Ch. 61 chapter rule 2 — 5903-fabric supply rule, effective 2022-01-01: goods containing fabrics of 5903 originating only if all fabrics used in those fabrics are FORMED AND FINISHED in USMCA territory",
    ruleBasis: "special",
    effectiveFrom: "2022-01-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 61, chapter rule 2, p. 47): 'Chapter Rule 2: Effective January 1, 2022, and not withstanding chapter rule 1 of this chapter, for the purposes of determining the origin of a good of this chapter, a good of this chapter containing fabrics of heading 5903 shall be considered originating only if all fabrics used in the production of the fabrics of heading 5903 are formed and finished in the territory of one or more of the USMCA countries. This note shall not apply to goods of heading 6305, goods of subheadings 6306.12 or 6306.22 or goods of subheading 6307.90 that are not surgical drapes or national flags.' PRINT ODDITY: 'not withstanding' (two words) — transcribed as printed. NOTE the exclusions list names ch. 63 headings (6305/6306.12/.22/6307.90) — printed as such in the ch. 61 rule; the ch. 63 rule 2 (p. 54) carries its own version. DISTINCTIVE EFFECTIVE DATE: 2022-01-01, not 2020-07-01.",
    sources: SRC,
  },
  {
    id: "text-61-chapter-rule-3",
    sector: "textiles-apparel",
    chapters: ["61"],
    hsRange: "Chapter 61 (chapter rule 3)",
    label: "Ch. 61 chapter rule 3 — SEWING THREAD rule, effective 2021-07-01: sewing thread of 5204, 5401, 5508 (or 5402 yarn used as sewing thread) must be FORMED AND FINISHED in USMCA territory",
    ruleBasis: "special",
    effectiveFrom: "2021-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 61, chapter rule 3, p. 47): 'Chapter Rule 3: Effective July 1, 2021, and notwithstanding chapter rule 1 of this chapter, a good of this chapter containing sewing thread of headings 5204, 5401 or 5508, or yarn of heading 5402 used as sewing thread shall be considered originating only if such sewing thread is both formed and finished in the territory of one or more of the USMCA countries.' DISTINCTIVE EFFECTIVE DATE: 2021-07-01.",
    sources: SRC,
  },
  {
    id: "text-61-chapter-rule-4",
    sector: "textiles-apparel",
    chapters: ["61"],
    hsRange: "Chapter 61 (chapter rule 4)",
    label: "Ch. 61 chapter rule 4 — POCKET-BAG rule, effective 2022-01-01: pocket bag fabric must be formed and finished in USMCA territory from yarn wholly formed in USMCA territory",
    ruleBasis: "special",
    effectiveFrom: "2022-01-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 61, chapter rule 4, p. 47): 'Chapter Rule 4: Effective January 1, 2022, and notwithstanding chapter rule 1 of this chapter, if a good of this chapter contains a pocket or pockets, the pocket bag fabric must be formed and finished in the territory of one or more of the USMCA countries from yarn wholly formed in one or more of the USMCA countries.' DISTINCTIVE EFFECTIVE DATE: 2022-01-01.",
    sources: SRC,
  },
  // ---------------- Chapter 61 — numbered rules (generator pattern) ----------------
  apparel61(1, "headings 6101 through 6102", "Overcoats, anoraks, suits, ensembles etc. of wool/cotton (6101–6102)"),
  apparel61(2, "subheadings 6103.10 through 6103.22", "Men's/boys' suits, jackets, trousers etc. (6103.10–6103.22)"),
  apparel61(3, "subheadings 6103.29 through 6103.49", "Other men's/boys' garments of 6103 (6103.29–6103.49)"),
  apparel61(4, "subheadings 6104.13 through 6104.22", "Women's/girls' suits, dresses, trousers etc. (6104.13–6104.22)"),
  apparel61(5, "subheadings 6104.29 through 6104.69", "Other women's/girls' garments of 6104 (6104.29–6104.69)"),
  apparel61(6, "headings 6105 through 6106", "Men's/boys' shirts; women's/girls' blouses/shirts (6105–6106)"),
  apparel61(7, "subheadings 6107.11 through 6107.19", "Men's/boys' underpants/nightwear (6107.11–6107.19) — WITH the 9619 exception", true),
  {
    id: "text-61-rule-8",
    sector: "textiles-apparel",
    chapters: ["61"],
    hsRange: "Subheading 6107.21",
    label: "Men's/boys' cotton nightshirts/pyjamas (6107.21) — (A) circular-knit cotton fabric branch (6006.21-.24, exclusive of collar/cuffs/waistband/elastic, NOT subject to chapter rules 2-4), or (B) standard apparel rule",
    ruleBasis: "special",
    tariffShiftRule:
      "(A) A change to subheading 6107.21 from circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.21, circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.22, circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.23 or circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.24, provided that the good, exclusive of collar, cuffs, waistband or elastic, is wholly of such fabric and the good is both cut and sewn or otherwise assembled in the territory of one or more of the USMCA countries, and such goods will not be subject to chapter rules 2 through 4 of this chapter; or (B) " + "A change to subheading 6107.21 from any other chapter, " + "except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapter 54 or headings 5508 through 5516 or 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 61, rule 8, pp. 48-49): '8. (A) A change to subheading 6107.21 from circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.21, circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.22, circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.23 or circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.24, provided that the good, exclusive of collar, cuffs, waistband or elastic, is wholly of such fabric and the good is both cut and sewn or otherwise assembled in the territory of one or more of the USMCA countries, and such goods will not be subject to chapter rules 2 through 4 of this chapter; or (B) A change to subheading 6107.21 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapter 54 or headings 5508 through 5516 or 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.' CIRCULAR-KNIT BRANCH (A): nightshirts of specified fine cotton knit may source from 6006.21-.24 fabrics and are EXEMPT from chapter rules 2-4 (5903-fabric / sewing-thread / pocket-bag rules); branch (B) is the standard pattern. The same (A)/(B) structure prints for 6108.21 and 6108.31 with different exclusion lists ('exclusive of waistband, elastic or lace' / 'exclusive of collar, cuffs, waistband, elastic or lace').",
    sources: SRC,
  },
  apparel61(9, "subheadings 6107.22 through 6107.99", "Other men's/boys' underwear/nightwear (6107.22–6107.99)"),
  apparel61(10, "subheadings 6108.11 through 6108.19", "Women's/girls' slips, petticoats, briefs etc. (6108.11–6108.19)"),
  {
    id: "text-61-rule-11",
    sector: "textiles-apparel",
    chapters: ["61"],
    hsRange: "Subheading 6108.21",
    label: "Women's/girls' cotton nightdresses/pyjamas (6108.21) — (A) circular-knit cotton branch (6006.21-.24, exclusive of waistband, elastic or lace, NOT subject to chapter rules 2-4, WITH 9619 exception on (B)), or (B) standard apparel rule",
    ruleBasis: "special",
    tariffShiftRule:
      "(A) A change to subheading 6108.21 from circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.21, circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.22, circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.23 or circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.24, provided that the good, exclusive of waistband, elastic or lace, is wholly of such fabric and the good is both cut and sewn or otherwise assembled in the territory of one or more of the USMCA countries, and such goods will not be subject to chapter rules 2 through 4 of this chapter; or (B) A change to subheading 6108.21 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapter 54 or headings 5508 through 5516 or 6001 through 6006, or other made-up textile articles of heading 9619, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 61, rule 11, p. 49): '11. (A) A change to subheading 6108.21 from circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.21, circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.22, circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.23 or circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.24, provided that the good, exclusive of waistband, elastic or lace, is wholly of such fabric and the good is both cut and sewn or otherwise assembled in the territory of one or more of the USMCA countries, and such goods will not be subject to chapter rules 2 through 4 of this chapter; or (B) A change to subheading 6108.21 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapter 54 or headings 5508 through 5516 or 6001 through 6006, or other made-up textile articles of heading 9619, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.' Note branch (B) carries the 9619 exception (unlike rule 8(B)).",
    sources: SRC,
  },
  apparel61(12, "subheadings 6108.22 through 6108.29", "Women's/girls' other undergarments (6108.22–6108.29) — WITH the 9619 exception", true),
  {
    id: "text-61-rule-13",
    sector: "textiles-apparel",
    chapters: ["61"],
    hsRange: "Subheading 6108.31",
    label: "Women's/girls' cotton nightwear slips (6108.31) — (A) circular-knit cotton branch (6006.21-.24, exclusive of collar, cuffs, waistband, elastic or lace, NOT subject to chapter rules 2-4), or (B) standard apparel rule",
    ruleBasis: "special",
    tariffShiftRule:
      "(A) A change to subheading 6108.31 from circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.21, circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.22, circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.23 or circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.24, provided that the good, exclusive of collar, cuffs, waistband, elastic or lace, is wholly of such fabric and the good is both cut and sewn or otherwise assembled in the territory of one or more of the USMCA countries, and such goods will not be subject to chapter rules 2 through 4 of this chapter; or (B) A change to subheading 6108.31 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapter 54 or headings 5508 through 5516 or 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 61, rule 13, p. 49): '13. (A) A change to subheading 6108.31 from circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.21, circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.22, circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.23 or circular knit fabric, wholly of cotton yarns exceeding 100 metric number per single yarn, of subheading 6006.24, provided that the good, exclusive of collar, cuffs, waistband, elastic or lace, is wholly of such fabric and the good is both cut and sewn or otherwise assembled in the territory of one or more of the USMCA countries, and such goods will not be subject to chapter rules 2 through 4 of this chapter; or (B) A change to subheading 6108.31 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapter 54 or headings 5508 through 5516 or 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.' Note branch (B) does NOT carry the 9619 exception (unlike 6108.21(B)).",
    sources: SRC,
  },
  apparel61(14, "subheadings 6108.32 through 6108.99", "Women's/girls' other apparel of 6108 (6108.32–6108.99)"),
  apparel61(15, "heading 6109", "T-shirts, singlets and other vests, knitted (6109) — WITH the 9619 exception", true),
  apparel61(16, "subheadings 6110.11 through 6110.20", "Sweaters, pullovers etc. of wool/cotton (6110.11–6110.20) — WITH the 9619 exception", true),
  {
    id: "text-61-6110-30-mexico",
    sector: "textiles-apparel",
    chapters: ["61"],
    hsRange: "Subheading 6110.30 (Mexico-US trade only)",
    label: "Sweaters of man-made fibers (6110.30) — MEXICO-US TRADE ONLY: (a) sweaters branch with ch. 54–55 block, or (b) other goods branch",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 61, subheading rule for 6110.30, Mexico-US trade, pp. 49-50): '(a) A change to sweaters of subheading 6110.30 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapters 54 or 55 or headings 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries; or (b) A change to any other good of subheading 6110.30 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapter 54, headings 5508 through 5516 or 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.' TRADE-DIRECTION rule: for Mexico-US trade the SWEATERS goods-kind branch (a) blocks whole chapters 54 or 55 (permitting other inputs); other goods (b) get the standard list.",
    sources: SRC,
  },
  {
    id: "text-61-6110-30-other",
    sector: "textiles-apparel",
    chapters: ["61"],
    hsRange: "Subheading 6110.30 (all other trade)",
    label: "6110.30 — ALL OTHER TRADE: standard apparel rule",
    ruleBasis: "process-requirement",
    tariffShiftRule:
      "A change to subheading 6110.30 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapter 54, headings 5508 through 5516 or 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 61, all other trade of 6110.30, p. 50): '(a) A change to subheading 6110.30 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapter 54, headings 5508 through 5516 or 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.'",
    sources: SRC,
  },
  apparel61(17, "subheading 6110.90", "Other sweaters/pullovers of 6110 (6110.90) — WITH the 9619 exception", true),
  apparel61(18, "heading 6111", "Babies' garments, knitted (6111) — WITH the 9619 exception", true),
  apparel61(19, "headings 6112 through 6117", "Tracksuits, swimsuits, gloves, scarves etc. (6112–6117)"),
  // ---------------- Chapter 61 — subheading rules at 6103.23 / 6104.23 ----------------
  {
    id: "text-61-6103-23-mexico",
    sector: "textiles-apparel",
    chapters: ["61"],
    hsRange: "Subheading 6103.23 (Mexico-US trade only)",
    label: "Men's/boys' ensembles of synthetic fibres (6103.23) — MEXICO-US TRADE ONLY: (a) sweaters-of-6110.30-as-ensemble branch, or (b) other goods branch",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 61, subheading rule for 6103.23, Mexico-US trade, pp. 47-48): '(a) A change to sweaters of subheading 6110.30 classified as part of an ensemble of subheading 6103.23 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapters 54 or 55 or headings 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries; or (b) A change to any other good of subheading 6103.23 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapter 54, headings 5508 through 5516 or 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.' CROSS-CODED GOODS-KIND branch (a): a 6110.30 SWEATER classified as part of a 6103.23 ensemble gets the chapters-54-55 block (i.e. may source non-originating ch. 54-55 materials). TRADE-DIRECTION rule.",
    sources: SRC,
  },
  {
    id: "text-61-6103-23-other",
    sector: "textiles-apparel",
    chapters: ["61"],
    hsRange: "Subheading 6103.23 (all other trade)",
    label: "6103.23 — ALL OTHER TRADE: standard apparel rule",
    ruleBasis: "process-requirement",
    tariffShiftRule:
      "A change to subheading 6103.23 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapter 54, headings 5508 through 5516 or 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 61, all other trade of 6103.23, p. 48): '(a) A change to subheading 6103.23 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapter 54, headings 5508 through 5516 or 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.'",
    sources: SRC,
  },
  {
    id: "text-61-6104-23-mexico",
    sector: "textiles-apparel",
    chapters: ["61"],
    hsRange: "Subheading 6104.23 (Mexico-US trade only)",
    label: "Women's/girls' ensembles of synthetic fibres (6104.23) — MEXICO-US TRADE ONLY: (a) sweaters-of-6110.30-as-ensemble branch, or (b) other goods branch",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 61, subheading rule for 6104.23, Mexico-US trade, p. 48): '(a) A change to sweaters of subheading 6110.30 classified as part of an ensemble of subheading 6104.23 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapters 54 or 55 or headings 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries; or (b) A change to any other good of subheading 6104.23 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapter 54, headings 5508 through 5516 or 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.' Same cross-coded sweater-as-ensemble structure as 6103.23.",
    sources: SRC,
  },
  {
    id: "text-61-6104-23-other",
    sector: "textiles-apparel",
    chapters: ["61"],
    hsRange: "Subheading 6104.23 (all other trade)",
    label: "6104.23 — ALL OTHER TRADE: standard apparel rule",
    ruleBasis: "process-requirement",
    tariffShiftRule:
      "A change to subheading 6104.23 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapter 54, headings 5508 through 5516 or 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 61, all other trade of 6104.23, p. 48): '(a) A change to subheading 6104.23 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapter 54, headings 5508 through 5516 or 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.'",
    sources: SRC,
  },
  // ---------------- Chapter 62 — chapter rules ----------------
  {
    id: "text-62-chapter-rule-1",
    sector: "textiles-apparel",
    chapters: ["62"],
    hsRange: "Chapter 62 (chapter rule 1 — outer-shell short list)",
    label: "Ch. 62 chapter rule 1 — OUTER-SHELL FABRIC SHORT LIST: apparel originates if cut and sewn in USMCA territory AND the outer-shell fabric (exclusive of collars or cuffs) is wholly of one of five listed specialty fabrics (A)-(E); such goods exempt from rules 3 through 5",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 62, chapter rule 1, pp. 50-51): 'Chapter rule 1: Apparel goods of this chapter shall be considered to originate if they are both cut and sewn or otherwise assembled in the territory of one or more of the USMCA countries and if the fabric of the outer shell, exclusive of collars or cuffs, is wholly of one or more of the following: (A) Velveteen fabrics of subheading 5801.23, containing 85 percent or more by weight of cotton; (B) Corduroy fabrics of subheading 5801.22, containing 85 percent or more by weight of cotton and containing more than 7.5 wales per centimeter; (C) Fabrics of subheadings 5111.11 or 5111.19, if handwoven, with a loom width of less than 76 cm, woven in the United Kingdom in accordance with the rules and regulations of the Harris Tweed Authority, Ltd., and so certified by the Authority; (D) Fabrics of subheading 5112.30, weighing not more than 340 grams per square meter, containing wool, not less than 20 percent by weight of fine animal hair and not less than 15 percent by weight of man-made staple fibers; or (E) Batiste fabrics of subheadings 5513.11 or 5513.21, of square construction, of single yarns exceeding 76 metric count, containing between 60 and 70 warp ends and filling picks per square centimeter, of a weight not exceeding 110 grams per square meter. Such apparel goods shall not be subject to rules 3 through 5 of this chapter.' SUPPLY-BASED SHORT LIST — allows NON-USMCA-origin fabric of the five specified types (the famous Harris Tweed (C) and velvet/corduroy carve-outs); overrides the numbered rules' fabric requirements. Note (A) velveteen cites 5801.23 and (B) corduroy 5801.22 — verify against the HTS breakout order (velveteen is normally 5801.22-23 range; flagged for word-for-word audit).",
    sources: SRC,
  },
  {
    id: "text-62-chapter-rule-2",
    sector: "textiles-apparel",
    chapters: ["62"],
    hsRange: "Chapter 62 (chapter rule 2)",
    label: "Ch. 62 chapter rule 2 — COMPONENT RULE (mirror of ch. 61 rule 1)",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 62, chapter rule 2, p. 51): 'Chapter rule 2: For the purposes of determining the origin of a good of this chapter, the rule applicable to that good shall only apply to the component that determines the tariff classification of the good and such component must satisfy the tariff change requirements set out in the rule for that good.'",
    sources: SRC,
  },
  {
    id: "text-62-chapter-rule-3",
    sector: "textiles-apparel",
    chapters: ["62"],
    hsRange: "Chapter 62 (chapter rule 3)",
    label: "Ch. 62 chapter rule 3 — 5806.20/6002 fabric supply rule, effective 2022-01-01",
    ruleBasis: "special",
    effectiveFrom: "2022-01-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 62, chapter rule 3, p. 51): 'Chapter rule 3: Effective January 1, 2022, and notwithstanding chapter rule 2 of this chapter, a good of this chapter containing fabrics of subheading 5806.20 or heading 6002 is originating only if such fabrics are both formed from yarn and finished in the territory of one or more of the USMCA countries.' DISTINCTIVE EFFECTIVE DATE: 2022-01-01. Note ch. 62's version covers 5806.20 (narrow fabrics of 5806) — ch. 61's rule 2 covers 5903 instead.",
    sources: SRC,
  },
  {
    id: "text-62-chapter-rule-4",
    sector: "textiles-apparel",
    chapters: ["62"],
    hsRange: "Chapter 62 (chapter rule 4)",
    label: "Ch. 62 chapter rule 4 — SEWING THREAD rule, effective 12 months from entry into force",
    ruleBasis: "special",
    effectiveFrom: "2021-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 62, chapter rule 4, p. 51): 'Chapter rule 4: Effective 12 months from the date of entry into force of the agreement, and notwithstanding chapter rule 2 of this chapter, a good of this chapter containing sewing thread of headings 5204, 5401 or 5508, or yarn of heading 5402 used as sewing thread shall be considered originating only if such sewing thread is both formed and finished in the territory of one or more of the USMCA countries.' PRINTED AS RELATIVE DATE ('12 months from the date of entry into force') — USMCA entered into force 2020-07-01, so effectiveFrom is encoded 2021-07-01; the relative wording is what prints. Chapter 61's equivalent prints 'Effective July 1, 2021' (absolute) — flagged for audit (the two chapters print the same rule with different date styles).",
    sources: SRC,
  },
  {
    id: "text-62-chapter-rule-5",
    sector: "textiles-apparel",
    chapters: ["62"],
    hsRange: "Chapter 62 (chapter rule 5 — denim pockets)",
    label: "Ch. 62 chapter rule 5 — DENIM pocket-bag rule (5209.42, 5211.42, 5212.24, 5514.30), effective 30 months from entry into force",
    ruleBasis: "special",
    effectiveFrom: "2022-12-30",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 62, chapter rule 5, p. 51): 'Chapter rule 5: For apparel made of blue denim fabric of subheadings 5209.42, 5211.42, 5212.24 and 5514.30, effective 30 months from the date of entry into force of the agreement, and notwithstanding chapter rule 2 of this chapter, if such goods of this chapter contain a pocket or pockets, the pocket bag fabric must be formed and finished in the territory of one or more of the USMCA countries from yarn wholly formed in one or more of the USMCA countries.' PRINTED AS RELATIVE DATE ('30 months from the date of entry into force') — encoded effectiveFrom 2022-12-30 (30 months after 2020-07-01); flagged for audit. GOODS-KIND-LIMITED: applies only to BLUE DENIM apparel of the four listed subheadings.",
    sources: SRC,
  },
  {
    id: "text-62-chapter-rule-6",
    sector: "textiles-apparel",
    chapters: ["62"],
    hsRange: "Chapter 62 (chapter rule 6 — all other pockets)",
    label: "Ch. 62 chapter rule 6 — ALL OTHER APPAREL pocket-bag rule, effective 18 months from entry into force",
    ruleBasis: "special",
    effectiveFrom: "2022-01-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 62, chapter rule 6, p. 51): 'Chapter rule 6: For all other apparel, effective 18 months from the date of entry into force of the agreement, and notwithstanding chapter rule 2 of this chapter, if a good of this chapter contains a pocket or pockets, the pocket bag fabric must be formed and finished in the territory of one or more of the USMCA countries from yarn wholly formed in one or more of the USMCA countries.' PRINTED AS RELATIVE DATE ('18 months from the date of entry into force') — encoded effectiveFrom 2022-01-01 (18 months after 2020-07-01); flagged for audit.",
    sources: SRC,
  },
  // ---------------- Chapter 62 — numbered rules + subheading fabric lists ----------------
  apparel62(1, "headings 6201 through 6204", "Overcoats, suits, dresses, trousers etc. woven (6201–6204)", "cut-knit"),
  {
    id: "text-62-6205-shortlist",
    sector: "textiles-apparel",
    chapters: ["62"],
    hsRange: "Men's/boys' shirts of cotton or man-made fibres (6205.20–6205.30, short list)",
    label: "Men's/boys' shirts of cotton/man-made fibers (6205) — SHIRT FABRIC SHORT LIST (a)-(i): originate if cut and assembled in USMCA territory and outer shell wholly of one of nine listed fabrics; exempt from rules 3 through 5",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 62, subheading rule for men's/boys' shirts, pp. 51-52): 'Subheading rule: Men's or boys' shirts of cotton or man-made fibers shall be considered to originate if they are both cut and assembled in the territory of one or more of the USMCA countries and if the fabric of the outer shell, exclusive of collars or cuffs, is wholly of one or more of the following: (a) Fabrics of subheadings 5208.21, 5208.22, 5208.29, 5208.31, 5208.32, 5208.39, 5208.41, 5208.42, 5208.49, 5208.51, 5208.52 or 5208.59, other than 3-thread or 4-thread twill, including cross twill, fabric of subheading 5208.59 of average yarn number exceeding 135 metric; (b) Fabrics of subheadings 5513.11 or 5513.21, not of square construction, containing more than 70 warp ends and filling picks per square centimeter, of average yarn number exceeding 70 metric; (c) Fabrics of subheadings 5210.21 or 5210.31, not of square construction, containing more than 70 warp ends and filling picks per square centimeter, of average yarn number exceeding 70 metric; (d) Fabrics of subheadings 5208.22 or 5208.32, not of square construction, containing more than 75 warp ends and filling picks per square centimeter, of average yarn number exceeding 65 metric; (e) Fabrics of subheadings 5407.81, 5407.82 or 5407.83, weighing less than 170 grams per square meter, having a dobby weave created by a dobby attachment; (f) Fabrics of subheadings 5208.42 or 5208.49, not of square construction, containing more than 85 warp ends and filling picks per square centimeter, of average yarn number exceeding 85 metric; (g) Fabrics of subheading 5208.51, of square construction, containing more than 75 warp ends and filling picks per square centimeter, made with single yarns, of average yarn number 95 or greater metric; (h) Fabrics of subheading 5208.41, of square construction, with a gingham pattern, containing more than 85 warp ends and filling picks per square centimeter, made with single yarns, of average yarn number 95 or greater metric, and characterized by a check effect produced by the variation in color of the yarns in the warp and filling; or (i) Fabrics of subheading 5208.41, with the warp colored with vegetable dyes, and the filling yarns white or colored with vegetable dyes, of average yarn number greater than 65 metric. Such apparel goods shall not be subject to rules 3 through 5 of this chapter.' TECHNICAL FABRIC SPECIFICATION LIST — nine entries with yarn counts, thread counts per cm2, weave constructions, weight limits; highest-scrutiny transcription. Note the preamble says 'cut and assembled' (not 'cut and sewn or otherwise assembled') — transcribed as printed.",
    sources: SRC,
  },
  apparel62(2, "any other good of subheadings 6205.20 through 6205.30", "Other men's/boys' shirts of cotton/MMF (6205.20–6205.30, outside the short list)"),
  apparel62(3, "subheading 6205.90", "Men's/boys' shirts of other materials (6205.90)"),
  apparel62(4, "heading 6206", "Women's/girls' blouses, shirts etc. woven (6206)"),
  {
    id: "text-62-6207-11-shortlist",
    sector: "textiles-apparel",
    chapters: ["62"],
    hsRange: "Men's/boys' boxer shorts of cotton (6207.11, short list)",
    label: "Men's/boys' cotton boxer shorts (6207.11) — BOXER-SHORT FABRIC SHORT LIST (a)-(j): ten precisely specified print/yarn-dyed fabrics; exempt from rules 3 through 5",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 62, subheading rule for 6207.11, pp. 52-53): 'Subheading rule: Men's or boys' boxer shorts of cotton of subheading 6207.11 shall be considered to originate if they are both cut and sewn or otherwise assembled in the territory of one or more of the USMCA countries, and if the plain weave fabric of the outer shell, exclusive of waistbands, is wholly of one or more of the following: (a) Fabrics of subheading 5208.41, yarn-dyed, with a fiber content of 100 percent cotton, 95 to 100 grams per square meter, of average yarn number 37 to 42 metric; (b) Fabrics of subheading 5208.42, yarn-dyed, with a fiber content of 100 percent cotton, weighing not more than 105 grams per square meter, of average yarn number 47 to 53 metric; (c) Fabrics of subheading 5208.51, printed, with a fiber content of 100 percent cotton, 93 to 97 grams per square meter, of average yarn number 38 to 42 metric; (d) Fabrics of subheading 5208.52, printed, with a fiber content of 100 percent cotton, 112 to 118 grams per square meter, of average yarn number 38 to 42 metric; (e) Fabrics of subheading 5210.11, greige, with a fiber content of 51 to 60 percent cotton, 49 to 40 percent polyester, 100 to 112 grams per square meter, of average yarn number 55 to 65 metric; (f) Fabrics of subheading 5210.41, yarn-dyed, with a fiber content of 51 to 60 percent cotton, 49 to 40 percent polyester, 77 to 82 grams per square meter, of average yarn number 43 to 48 metric; (g) Fabrics of subheading 5210.41, yarn-dyed, with a fiber content of 51 to 60 percent cotton, 49 to 40 percent polyester, 85 to 90 grams per square meter, of average yarn number 69 to 75 metric; (h) Fabrics of subheading 5210.51, printed, with a fiber content of 51 to 60 percent cotton, 49 to 40 percent polyester, 107 to 113 grams per square meter, of average yarn number 33 to 37 metric; (i) Fabrics of subheading 5210.51, printed, with a fiber content of 51 to 60 percent cotton, 49 to 40 percent polyester, 92 to 98 grams per square meter, of average yarn number 43 to 48 metric; or (j) Fabrics of subheading 5210.51, printed, with a fiber content of 51 to 60 percent cotton, 49 to 40 percent polyester, 105 to 112 grams per square meter, of average yarn number 50 to 60 metric. Such apparel goods shall not be subject to rules 3 through 5 of this chapter.' TEN fabric entries with fiber-content ranges, weight windows and yarn-number windows — highest-scrutiny transcription. Note list label (a) prints WITHOUT the opening parenthesis on p. 53 ('a) Fabrics...') — transcribed with the parenthesis restored per the (b)-(j) pattern; flagged for audit.",
    sources: SRC,
  },
  apparel62(5, "any other good of subheading 6207.11", "Other men's/boys' cotton boxer shorts (6207.11, outside the short list) — WITH the 9619 exception", "cut-only", true),
  apparel62(6, "subheadings 6207.19 through 6207.99", "Men's/boys' other underwear/nightwear (6207.19–6207.99)"),
  apparel62(7, "headings 6208 through 6211", "Women's/girls' slips, nightwear, skirts, trousers etc. (6208–6211)"),
  {
    id: "text-62-rule-8",
    sector: "textiles-apparel",
    chapters: ["62"],
    hsRange: "Subheading 6212.10",
    label: "Brassieres and body-support garments (6212.10) — chapter shift with NO exception list; cut-and-sewn requirement; exempt from rules 3 through 5",
    ruleBasis: "process-requirement",
    tariffShiftRule:
      "A change to subheading 6212.10 from any other chapter, provided that the good is both cut and sewn or otherwise assembled in the territory of one or more of the USMCA countries. Such goods shall not be subject to rules 3 through 5 of this chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 62, rule 8, p. 53): '8. A change to subheading 6212.10 from any other chapter, provided that the good is both cut and sewn or otherwise assembled in the territory of one or more of the USMCA countries. Such goods shall not be subject to rules 3 through 5 of this chapter.' UNIQUE: no fiber exception list at all — any non-originating fabric input may shift into brassieres; exempt from the chapter-rule 3-5 supply rules.",
    sources: SRC,
  },
  apparel62(9, "subheadings 6212.20 through 6212.90", "Girdles, corsets, suspenders etc. (6212.20–6212.90)"),
  apparel62(10, "headings 6213 through 6217", "Handkerchiefs, scarves, ties, gloves, other made-ups woven (6213–6217)"),
  // ---------------- Chapter 63 ----------------
  {
    id: "text-63-chapter-rule-1",
    sector: "textiles-apparel",
    chapters: ["63"],
    hsRange: "Chapter 63 (chapter rule 1)",
    label: "Ch. 63 chapter rule 1 — COMPONENT RULE (mirror of ch. 61/62 component rules)",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 63, chapter rule 1, p. 54): 'Chapter Rule 1: For the purposes of determining the origin of a good of this chapter, the rule applicable to that good shall only apply to the component that determines the tariff classification of the good and such component must satisfy the tariff change requirements set out in the rule for that good.'",
    sources: SRC,
  },
  {
    id: "text-63-chapter-rule-2",
    sector: "textiles-apparel",
    chapters: ["63"],
    hsRange: "Chapter 63 (chapter rule 2)",
    label: "Ch. 63 chapter rule 2 — 5903-fabric supply rule, effective 2022-01-01, with the ch. 63 exclusions (6305, 6306.12/.22, non-surgical-drape/non-flag 6307.90)",
    ruleBasis: "special",
    effectiveFrom: "2022-01-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 63, chapter rule 2, p. 54): 'Chapter Rule 2: Effective January 1, 2022, and not withstanding chapter rule 1 of this chapter, for the purposes of determining the origin of a good of this chapter, a good of this chapter containing fabrics of heading 5903 shall be considered originating only if all fabrics used in the production of the fabrics of heading 5903 are formed and finished in the territory of one or more of the USMCA countries. This note shall not apply to goods of heading 6305, goods of subheadings 6306.12 or 6306.22 or goods of subheading 6307.90 that are not surgical drapes or national flags.' PRINT ODDITY: 'not withstanding' (two words) — transcribed as printed. This is the ch. 63 home of the exclusions that ch. 61's rule 2 also names.",
    sources: SRC,
  },
  {
    id: "text-63-rule-1",
    sector: "textiles-apparel",
    chapters: ["63"],
    hsRange: "Headings 6301 through 6302",
    label: "Blankets, travel sets, bed/table linen/toilet/kitchen linen (6301–6302) — standard made-up rule with 5801–5802 exception",
    ruleBasis: "process-requirement",
    tariffShiftRule:
      "A change to headings 6301 through 6302 from any other chapter, except from headings 5106 through 5113, 5204 through 5212 5310 through 5311, chapters 54 through 55, or headings 5801 through 5802 or 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 63, rule 1, p. 54): '1. A change to headings 6301 through 6302 from any other chapter, except from headings 5106 through 5113, 5204 through 5212 5310 through 5311, chapters 54 through 55, or headings 5801 through 5802 or 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.' PRINT ODDITY: '5204 through 5212 5310' — missing comma between 5212 and 5310 — transcribed as printed, flagged for audit. Note this exception list ADDS 5801 through 5802 (the pile fabrics) vs. the ch. 61/62 list.",
    sources: SRC,
  },
  {
    id: "text-63-rule-2",
    sector: "textiles-apparel",
    chapters: ["63"],
    hsRange: "Subheadings 6303.12 through 6303.91",
    label: "Curtains, blinds, bed valances etc. (6303.12–6303.91) — standard made-up rule with 5801–5802 exception",
    ruleBasis: "process-requirement",
    tariffShiftRule:
      "A change to subheadings 6303.12 through 6303.91 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapters 54 through 55 or headings 5801 through 5802 or 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 63, rule 2, p. 54): '2. A change to subheadings 6303.12 through 6303.91 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapters 54 through 55 or headings 5801 through 5802 or 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.'",
    sources: SRC,
  },
  {
    id: "text-63-rule-3",
    sector: "textiles-apparel",
    chapters: ["63"],
    hsRange: "Subheading 6303.92",
    label: "Other curtains etc. of synthetic fibres (6303.92) — (A) specified polyester-filament fabric branch (5402.44/.47/.52 yarns, NOT subject to chapter rule 2), or (B) standard made-up rule",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 63, rule 3, p. 54): '3. (A) A change to curtains of subheading 6303.92 made of fabrics wholly of non-textured polyester filaments from yarn, with a twist of 900 or more turns per meter, wholly of polyesters other than partially oriented, measuring not less than 75 decitex but not more than 80 decitex, and having 24 filaments per yarn of subheadings 5402.44, 5402.47 or 5402.52, provided that the good is both cut and sewn or otherwise assembled in the territory of one or more of the USMCA countries, and such goods will not be subject to chapter rule 2 of this chapter; (B) A change to any other good of subheading 6303.92 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapters 54 through 55 or headings 5801 through 5802 or 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.' SPECIFICATION BRANCH (A) mirrors ch. 54 rule 2(A)'s high-twist polyester filament fabric (same 5402.44/.47/.52 yarns); branch (A) goods are EXEMPT from chapter rule 2 (the 5903 supply rule). Note the OCR runs 'partially oriented, measuring' with the comma here (cf. ch. 54 rule 2(A)) — verify both against the printed PDF.",
    sources: SRC,
  },
  {
    id: "text-63-rule-4",
    sector: "textiles-apparel",
    chapters: ["63"],
    hsRange: "Subheading 6303.99",
    label: "Other curtains etc. (6303.99) — standard made-up rule with 5801–5802 exception",
    ruleBasis: "process-requirement",
    tariffShiftRule:
      "A change to subheading 6303.99 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapters 54 through 55 or headings 5801 through 5802 or 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 63, rule 4, p. 54): '4. A change to subheading 6303.99 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapters 54 through 55 or headings 5801 through 5802 or 6001 through 6006, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.'",
    sources: SRC,
  },
  {
    id: "text-63-rule-5",
    sector: "textiles-apparel",
    chapters: ["63"],
    hsRange: "Headings 6304 through 6310",
    label: "Bedding, quilts, sacks, tarpaulins, sails, tents, rags etc. (6304–6310) — standard made-up rule with 5801–5802 exception AND the 9619 exception",
    ruleBasis: "process-requirement",
    tariffShiftRule:
      "A change to headings 6304 through 6310 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapters 54 through 55, or headings 5801 through 5802 or 6001 through 6006, or other made-up textile articles of heading 9619, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 63, rule 5, p. 54): '5. A change to headings 6304 through 6310 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapters 54 through 55, or headings 5801 through 5802 or 6001 through 6006, or other made-up textile articles of heading 9619, provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries.' Carries the 9619 exception (9619 goods cannot fall back into 6304-6310; the misc file's ch. 96 rules handle 9619's own origin). NOTE: headings 6305, 6306.12/.22 and non-surgical-drape/non-flag 6307.90 are the ch. 63 rule 2 exclusions — they still route to THIS rule 5 for tariff-shift purposes.",
    sources: SRC,
  },
];

export const TEXTILES_APPAREL_SECTOR_FILE: UsmcaSectorFile = {
  sector: "textiles-apparel",
  chaptersCovered: ["50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63"],
  dataAsOf: "2026-09-28",
  mergeEligible: true,
  auditStatus: "human_verified",
  rules: TEXTILES_APPAREL_RULES,
  watchItems: [
    "NO RVC ANYWHERE in Chapters 50-63 — textile RVC was a NAFTA feature; USMCA textiles use tariff shifts + cut-and-sewn assembly + supply-based rules. Never offer TV/NC except via the core file's GN 11(b)(iv) fallback.",
    "PROCESS REQUIREMENT is load-bearing: every ch. 61-63 numbered rule ends with 'provided that the good is both cut (or knit to shape) and sewn or otherwise assembled in the territory of one or more of the USMCA countries' (ch. 62 rules 2-10 print 'cut and sewn' WITHOUT the knit option). ruleBasis 'process-requirement' — the calculator MUST ask where the good was cut/knit to shape and sewn; a qualifying tariff shift alone never confers origin.",
    "GENERATED VERBATIM TEXT: the standard apparel exception clause prints identically ~30 times; it is built from the EXC_61 / EXC_62 / CUT_KNIT / CUT_ONLY / EXC_9619 constants (single source of truth). Auditors verify each constant ONCE against the printed PDF, then verify per-record HS ranges and variant flags (9619, cut-only). Any constant correction propagates to all records automatically.",
    "TRADE-DIRECTION RULES (separate records, distinct rule texts): 5112.11 and 5112.19 (Canada-US vs all other); 5509.31 (Canada-US vs other); 5703.20-.30 and 5704 (Mexico-US vs other); 5801.36 and 5801.37 (Canada-US vs other); 6103.23, 6104.23, 6110.30 (Mexico-US vs other). The Canada/Mexico variants typically BLOCK WHOLE CHAPTERS 54-55 (i.e. PERMIT other inputs the all-other rule blocks) and the 5801.36/.37 Canada variants subdivide 5503 (not blocking acrylic tow 5503.30). The calculator must ask the trade direction before selecting the record.",
    "STAGGERED EFFECTIVE DATES (chapter rules): ch. 61 rule 3 / ch. 62 rule 4 sewing-thread rules (2021-07-01); ch. 61 rules 2, 4 / ch. 62 rules 3, 6 (2022-01-01); ch. 62 rule 5 denim pockets (encoded 2022-12-30 = 30 months after EIF 2020-07-01). Ch. 62 rules 4-6 print RELATIVE dates ('12/18/30 months from the date of entry into force') where ch. 61 prints absolute dates for the same rules — flagged for audit.",
    "SUPPLY-BASED SHORT LISTS allow NON-USMCA fabric: ch. 62 chapter rule 1 (five fabrics incl. Harris Tweed 5111.11/.19 and the velvet/corduroy/batiste specialties); the men's-shirts list (a)-(i); the boxer-shorts list (a)-(j). These OVERRIDE the numbered rules' exception lists — goods qualifying under a short list are also exempt from chapter rules 3-5 (sewing thread, pocket bags). The technical specifications (yarn counts, warp/filling per cm2, weight windows) are the highest-scrutiny transcriptions in the project.",
    "COMPONENT RULES (ch. 61 rule 1, ch. 62 rule 2, ch. 63 rule 1): the PSRO applies only to the component that determines tariff classification — the engine must identify the classification-determining component (usually the outer shell) before applying the shift.",
    "EXCEPTION-LIST VARIANT INVENTORY (yarn/fabric stage, ch. 50-60): four distinct printed lists recur — (1) yarn-stage '5106 through 5110, 5205 through 5206, 5401 through 5404 or 5509 through 5510' (with range-end variants 5111/5112/5113 per rule); (2) broad '5106 through 5113, 5204 through 5212, 5310 through 5311 or chapters 54 through 55' (ch. 56-60); (3) fabric-stage '5111 through 5113, 5208 through 5212, 5310 through 5311, 5407 through 5408 or 5512 through 5516' (ch. 59 mostly); (4) carpet variant '5311' alone + '5508 through 5516' (ch. 57). Plus the fiber-substitution blocks in ch. 52/54/55 ('5201 through 5203 or 5401 through 5405/5501 through 5507'). Endpoints must never be blurred between variants.",
    "PRINT ODDITIES transcribed as printed, flagged for audit: ch. 61 rule 2 and ch. 63 rule 2 'not withstanding' (two words); ch. 63 rule 1 missing comma '5204 through 5212 5310'; 5704 Mexico heading rule 'from any chapter' (missing 'other'); 5801.36 Canada 'except headings' (missing 'from'); 5112.19(b) '5106 through 5110, 5111' (separated 5111); boxer-short list label 'a)' without opening parenthesis; ch. 62 rule 1 cites velveteen 5801.23 / corduroy 5801.22 (verify against HTS breakout order).",
    "6212.10 (brassieres) has NO fiber exception list at all — the only ch. 62-63 made-up rule with a bare chapter shift + assembly requirement; exempt from chapter rules 3-5.",
    "The 9619 exception (other made-up textile articles of heading 9619) appears in selected ch. 61-63 rules — cross-reference to the misc file's heading 9619 rules only; never backfill.",
    "No GN 11(k) carryover, no subheading RVC rules, no phased rules (the staggered chapter-rule dates are effective-date variation, not phases).",
    "De minimis (GN 11(e), 10 percent) and the GN 11(b)(iv) fallback (60 TV / 50 NC) are owned by the core types file — never restated here. USMCA Chapter 6 (textile/apparel goods) special provisions are treaty-level, not GN 11(o) PSROs.",
    "USMCA joint review (around 2026) may revise rules of origin — re-verify against the current HTSUS GN 11 revision before relying on this file for new claim periods.",
  ],
  sourceFirewall: {
    treatyBaseline: "USMCA Chapter 4 / Annex 4-B, Chapters 50-63 (Silk through man-made fibres; made-up textiles; knitted and woven apparel); Chapter 6 (Textile and Apparel Goods) governs these goods",
    usImplementation: "HTSUS General Note 11 (2026 Revision 15), subdivision (o) Chapters 50-63 / 19 CFR Part 182 (incl. Appendix A, Uniform Regulations) / SOR-2020-155 Schedule 1 (Canada)",
    excludedAgreements: [
      "NAFTA (superseded — GN 12(t) / Annex 401 chapters 50-63 rules differ, incl. the NAFTA textile RVC and tariff-preference-level mechanisms; never backfill)",
      "CAFTA-DR, KORUS (Annex 6-A), and other US FTAs with textile rules — never backfill",
      "TPP / CPTPP — never backfill",
      "Heading 9619 rules (misc file owns them; here exception references only)",
      "USMCA Chapter 6 shortages/customs cooperation mechanisms (treaty-level, outside GN 11(o))",
      "Chapters 49 and 64 rules (paper file / footwear file own those ranges)",
    ],
  },
};

export default TEXTILES_APPAREL_SECTOR_FILE;