/**
 * USMCA Raw Hides, Skins, Leather and Furs Rules of Origin —
 * HS Chapters 41-43 pass, unified-schema sector file for OrigynLX.
 * Modeled on the automotive sector file (AUTOMOTIVE_SECTOR_FILE) template.
 * REVISION 1: transcribed VERBATIM from HTSUS General Note 11 (2026
 * Revision 15), as supplied in the official USITC PDF
 * ("General Note 11_2026HTSRev15.pdf"): the complete GN 11(o)
 * Chapters 41-43 product-specific rules of origin tables (pp. 40-41).
 *
 * CHAPTERS COVERED BY THIS FILE (for the calculator's chapter routing):
 *   41 Raw hides and skins, leather and articles thereof
 *   42 Articles of leather; travel goods, handbags etc.
 *   43 Furskins and artificial fur; manufactures thereof
 *
 * WHAT IS IN THIS PASS (32 records):
 *  - Chapter 41 (18 numbered rules -> 18 records): reversible-tanning
 *    two-branch rules for 4101/4102 and the THREE-branch 4103 rule (with
 *    the camel/dromedary branch except from chapter 43); then a cascade
 *    of leather-preparation shift rules each EXPRESSLY PERMITTING named
 *    intra-chapter inputs ("from heading 4101 or any other chapter",
 *    "from subheading 4103.10 or any other chapter" etc.) — inputs from
 *    EARLIER stages of the chapter's own chain qualify.
 *  - Chapter 42 (11 rules -> 11 records): travel-goods splits with the
 *    TEXTILE-EXCEPTION LIST (5407/5408/5512-5516 + man-made-fiber fabrics
 *    of 5903.10/.20/.90, 5906.99, 5907.00) blocking four subheadings
 *    (4202.12, 4202.22, 4202.32, 4202.92).
 *  - Chapter 43 (3 rules -> 3 records): 4301; 4302 heading-level; 4303-4304
 *    from any heading outside that group.
 *
 * NO RVC ANYWHERE IN CHAPTERS 41-43. No phased rules. No subheading rules
 * or chapter rules print for this range (no GN 11(k) carryover here).
 *
 * OVERLAP RULE (do not create two-files-two-numbers bugs):
 *   - De minimis (GN 11(e), 10 percent) is OWNED by the core types file.
 *   - GN 11(b)(iv) fallback (60 TV / 50 NC) is OWNED by the core types file.
 *   - The textile headings/subheadings named in the Chapter 42 exception
 *     list (5407-5516, 5903/5906/5907 fabrics) are classified in chapters
 *     54-59 — textiles file owns their rules; here they are shift exceptions
 *     only, never backfilled.
 *   - Chapter 43 named in the 4103 camel-branch exception — cross-reference
 *     only (chapter 43's own rules live in this same file).
 */
import type { UsmcaRule, UsmcaSectorFile, UsmcaSource } from "../usmca-rule-types";

const HTS_GN11_2026: UsmcaSource = {
  authority: "USITC",
  title: "Harmonized Tariff Schedule of the United States (2026) Revision 15 — General Note 11, United States-Mexico-Canada Agreement, subdivision (o) (Chapters 41-43 product-specific rules of origin tables)",
  url: "https://hts.usitc.gov/download",
  reference: "GN 11(o) Ch. 41 (rules 1-18, pp. 40-41), Ch. 42 (rules 1-11, p. 41), Ch. 43 (rules 1-3, p. 41)",
};

const USTR_CH4_TEXT: UsmcaSource = {
  authority: "USTR",
  title: "USMCA Chapter 4 (Rules of Origin) legal text, incl. Annex 4-B (Product-Specific Rules of Origin), Chapters 41-43",
  url: "https://ustr.gov/sites/default/files/files/agreements/FTA/USMCA/Text/04-Rules-of-Origin.pdf",
  reference: "Annex 4-B Chapters 41-43 — treaty source of the same rules",
};

const GAC_CUSMA_CH4: UsmcaSource = {
  authority: "Global Affairs Canada",
  title: "CUSMA Chapter 4 — Rules of Origin (consolidated official text)",
  url: "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/cusma-aceum/text-texte/04.aspx?lang=eng",
  reference: "Annex 4-B Chapters 41-43 rules (corroborating official text)",
};

const SRC = [HTS_GN11_2026, USTR_CH4_TEXT, GAC_CUSMA_CH4];

export const HIDES_LEATHER_FURS_RULES: UsmcaRule[] = [
  // ---------------- Chapter 41 ----------------
  {
    id: "hides-41-4101",
    sector: "hides-leather-furs",
    chapters: ["41"],
    hsRange: "Heading 4101",
    label: "Raw hides and skins of bovine/equine animals (4101) — TWO-BRANCH rule: reversible-tanned hides may shift from any other good OF THE SAME heading",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 41, rule 1): '1. (A) A change to hides or skins of heading 4101 which have undergone a tanning (including pre-tanning) process which is reversible from any other good of heading 4101 or any other chapter; or (B) A change to any other good of heading 4101 from any other chapter.' GOODS-KIND ROUTING: branch (A) — reversible-tanned hides/skins of 4101 may shift from ANY OTHER GOOD OF HEADING 4101 (intra-heading good-level change) or any other chapter; branch (B) — all other 4101 goods shift from any other chapter.",
    sources: SRC,
  },
  {
    id: "hides-41-4102",
    sector: "hides-leather-furs",
    chapters: ["41"],
    hsRange: "Heading 4102",
    label: "Raw hides and skins of sheep/lambs (4102) — TWO-BRANCH rule: reversible-tanned hides may shift from any other good OF THE SAME heading",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 41, rule 2): '2. (A) A change to hides or skins of heading 4102 which have undergone a tanning (including pre-tanning) process which is reversible from any other good of heading 4102 or any other chapter; or (B) A change to any other good of heading 4102 from any other chapter.' Same structure as rule 1.",
    sources: SRC,
  },
  {
    id: "hides-41-4103",
    sector: "hides-leather-furs",
    chapters: ["41"],
    hsRange: "Heading 4103",
    label: "Raw hides and skins of other animals (4103) — THREE-BRANCH rule: reversible-tanned hides; camel/dromedary hides EXCEPT FROM CHAPTER 43; other goods",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 41, rule 3): '3. (A) A change to hides or skins of heading 4103, except hides or skins of camels or dromedaries of heading 4103, which have undergone a tanning (including pre-tanning) process which is reversible from any other good of heading 4103 or any other chapter; (B) A change to hides or skins of camels or dromedaries of heading 4103 from any other chapter, except from chapter 43; or (C) A change to any other good of heading 4103 from any other chapter.' THREE GOODS-KIND branches: (A) reversible-tanned hides/skins OTHER THAN camel/dromedary — intra-heading good-level change allowed; (B) camel/dromedary hides/skins ONLY — chapter-level shift EXCEPT FROM CHAPTER 43 (furskins of 4301 dressed as 4103-type camel skins cannot shift back); (C) all other goods from any other chapter. Note the printed branch (A) ends with a semicolon, not semicolon+'or' — transcribed as printed.",
    sources: SRC,
  },
  {
    id: "hides-41-4104",
    sector: "hides-leather-furs",
    chapters: ["41"],
    hsRange: "Heading 4104",
    label: "Tanned or crust hides/skins of bovine/equine animals, without hair on (4104) — tariff shift from any other heading EXCEPT from 4107",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 4104 from any other heading, except from 4107.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 41, rule 4): '4. A change to heading 4104 from any other heading, except from 4107.' DOWNWARD-shift block: finished leather of 4107 cannot fall back into 4104 crust. Heading-level shift with a heading-level exception.",
    sources: SRC,
  },
  {
    id: "hides-41-4105-10",
    sector: "hides-leather-furs",
    chapters: ["41"],
    hsRange: "Subheading 4105.10",
    label: "Sheep/lamb skin leather, pretanned (wet-blue) (4105.10) — shift from heading 4102 OR any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 4105.10 from heading 4102 or any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 41, rule 5): '5. A change to subheading 4105.10 from heading 4102 or any other chapter.' EXPRESSLY PERMITS the intra-chapter input (raw sheep skins of 4102) in addition to any other chapter — permission-style formulation, not an exception.",
    sources: SRC,
  },
  {
    id: "hides-41-4105-30",
    sector: "hides-leather-furs",
    chapters: ["41"],
    hsRange: "Subheading 4105.30",
    label: "Sheep/lamb skin leather other (4105.30) — shift from 4102, 4105.10 OR any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 4105.30 from heading 4102, subheading 4105.10 or any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 41, rule 6): '6. A change to subheading 4105.30 from heading 4102, subheading 4105.10 or any other chapter.' Chain permission: raw skins (4102) OR wet-blue (4105.10) inputs qualify.",
    sources: SRC,
  },
  {
    id: "hides-41-4106-21",
    sector: "hides-leather-furs",
    chapters: ["41"],
    hsRange: "Subheading 4106.21",
    label: "Goat/kid leather, pretanned (wet-blue) (4106.21) — shift from 4103.10 OR any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 4106.21 from subheading 4103.10 or any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 41, rule 7): '7. A change to subheading 4106.21 from subheading 4103.10 or any other chapter.'",
    sources: SRC,
  },
  {
    id: "hides-41-4106-22",
    sector: "hides-leather-furs",
    chapters: ["41"],
    hsRange: "Subheading 4106.22",
    label: "Goat/kid leather other (4106.22) — shift from 4103.10, 4106.21 OR any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 4106.22 from subheadings 4103.10 or 4106.21 or any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 41, rule 8): '8. A change to subheading 4106.22 from subheadings 4103.10 or 4106.21 or any other chapter.'",
    sources: SRC,
  },
  {
    id: "hides-41-4106-31",
    sector: "hides-leather-furs",
    chapters: ["41"],
    hsRange: "Subheading 4106.31",
    label: "Pig leather, pretanned (wet-blue) (4106.31) — shift from 4103.30 OR any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 4106.31 from subheading 4103.30 or any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 41, rule 9): '9. A change to subheading 4106.31 from subheading 4103.30 or any other chapter.'",
    sources: SRC,
  },
  {
    id: "hides-41-4106-32",
    sector: "hides-leather-furs",
    chapters: ["41"],
    hsRange: "Subheading 4106.32",
    label: "Pig leather other (4106.32) — shift from 4103.30, 4106.31 OR any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 4106.32 from subheadings 4103.30 or 4106.31 or any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 41, rule 10): '10. A change to subheading 4106.32 from subheadings 4103.30 or 4106.31 or any other chapter.'",
    sources: SRC,
  },
  {
    id: "hides-41-4106-40",
    sector: "hides-leather-furs",
    chapters: ["41"],
    hsRange: "Subheading 4106.40",
    label: "Reptile leather (4106.40) — TWO-BRANCH: wet-state (incl. wet-blue) from 4103.20 or chapter; CRUST from 4103.20, wet-state 4106.40 or chapter",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 41, rule 11): '11. (A) A change to tanned hides and skins in the wet state (including wet-blue) of subheading 4106.40 from subheading 4103.20 or any other chapter; or (B) A change to crust hides and skins of subheading 4106.40 from subheading 4103.20 or tanned hides and skins in the wet state (including wet-blue) of subheading 4106.40 or any other chapter.' GOODS-KIND ROUTING: (A) wet-state tanned reptile leather from raw reptile skins (4103.20) or chapter; (B) CRUST from 4103.20, from wet-state 4106.40 (intra-subheading stage change), or any other chapter.",
    sources: SRC,
  },
  {
    id: "hides-41-4106-91",
    sector: "hides-leather-furs",
    chapters: ["41"],
    hsRange: "Subheading 4106.91",
    label: "Leather of other animals, pretanned (wet-blue) (4106.91) — shift from 4103.90 OR any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 4106.91 from subheading 4103.90 or any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 41, rule 12): '12. A change to subheading 4106.91 from subheading 4103.90 or any other chapter.'",
    sources: SRC,
  },
  {
    id: "hides-41-4106-92",
    sector: "hides-leather-furs",
    chapters: ["41"],
    hsRange: "Subheading 4106.92",
    label: "Leather of other animals (4106.92) — shift from 4103.90, 4106.91 OR any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 4106.92 from subheadings 4103.90 or 4106.91 or any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 41, rule 13): '13. A change to subheading 4106.92 from subheadings 4103.90 or 4106.91 or any other chapter.'",
    sources: SRC,
  },
  {
    id: "hides-41-4107",
    sector: "hides-leather-furs",
    chapters: ["41"],
    hsRange: "Heading 4107",
    label: "Leather further prepared after tanning or crusting of bovine/equine animals, without hair on (4107) — shift from 4101 OR any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 4107 from heading 4101 or any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 41, rule 14): '14. A change to heading 4107 from heading 4101 or any other chapter.' Note the rule 4 mirror: 4104 blocks shifts FROM 4107, and this rule permits shifts FROM 4101 (skipping the 4104 stage).",
    sources: SRC,
  },
  {
    id: "hides-41-4112",
    sector: "hides-leather-furs",
    chapters: ["41"],
    hsRange: "Heading 4112",
    label: "Leather further prepared after tanning or crusting of sheep/lamb (4112) — shift from 4102, 4105.10 OR any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 4112 from heading 4102, subheading 4105.10 or any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 41, rule 15): '15. A change to heading 4112 from heading 4102, subheading 4105.10 or any other chapter.'",
    sources: SRC,
  },
  {
    id: "hides-41-4113",
    sector: "hides-leather-furs",
    chapters: ["41"],
    hsRange: "Heading 4113",
    label: "Leather further prepared after tanning/crusting of other animals (4113) — shift from 4103, 4106.21/.31, wet-state 4106.40, 4106.91 OR chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 4113 from heading 4103, subheadings 4106.21 or 4106.31, tanned hides and skins in the wet state (including wet-blue) of subheading 4106.40, subheading 4106.91 or any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 41, rule 16): '16. A change to heading 4113 from heading 4103, subheadings 4106.21 or 4106.31, tanned hides and skins in the wet state (including wet-blue) of subheading 4106.40, subheading 4106.91 or any other chapter.' FIVE named permitted inputs (incl. a goods-kind-specific input: wet-state 4106.40 only, not crust 4106.40).",
    sources: SRC,
  },
  {
    id: "hides-41-4114",
    sector: "hides-leather-furs",
    chapters: ["41"],
    hsRange: "Heading 4114",
    label: "Chamois leather; composition leather (4114) — shift from 4101-4103, 4105.10, 4106.21/.31/.91 OR any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 4114 from headings 4101 through 4103, subheadings 4105.10, 4106.21, 4106.31 or 4106.91 or any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 41, rule 17): '17. A change to heading 4114 from headings 4101 through 4103, subheadings 4105.10, 4106.21, 4106.31 or 4106.91 or any other chapter.' SEVEN named permitted inputs.",
    sources: SRC,
  },
  {
    id: "hides-41-4115-10-20",
    sector: "hides-leather-furs",
    chapters: ["41"],
    hsRange: "Subheadings 4115.10 through 4115.20",
    label: "Parings and other waste of leather; leather dust/powder/flour (4115.10-4115.20) — shift from 4101-4103 OR any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 4115.10 through 4115.20 from headings 4101 through 4103 or any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 41, rule 18): '18. A change to subheadings 4115.10 through 4115.20 from headings 4101 through 4103 or any other chapter.'",
    sources: SRC,
  },
  // ---------------- Chapter 42 ----------------
  {
    id: "hides-42-4201",
    sector: "hides-leather-furs",
    chapters: ["42"],
    hsRange: "Heading 4201",
    label: "Saddlery and harness for animals (4201) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 4201 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "hides-42-4202-11",
    sector: "hides-leather-furs",
    chapters: ["42"],
    hsRange: "Subheading 4202.11",
    label: "Trunks/suitcases, leather/composition leather (4202.11) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 4202.11 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "hides-42-4202-12",
    sector: "hides-leather-furs",
    chapters: ["42"],
    hsRange: "Subheading 4202.12",
    label: "Trunks/suitcases, plastic/textile outer surface (4202.12) — tariff shift EXCEPT from the textile-fabric exception list (5407/5408/5512-5516; 5903/5906/5907 man-made-fiber fabrics)",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 4202.12 from any other chapter, except from headings 5407, 5408 or 5512 through 5516, or fabric of man-made fibers of subheading 5903.10, fabric of man-made fibers of subheading 5903.20, fabric of man-made fibers of subheading 5903.90, fabric of man-made fibers of subheading 5906.99 or fabric of man-made fibers of subheading 5907.00.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 42, rule 3): '3. A change to subheading 4202.12 from any other chapter, except from headings 5407, 5408 or 5512 through 5516, or fabric of man-made fibers of subheading 5903.10, fabric of man-made fibers of subheading 5903.20, fabric of man-made fibers of subheading 5903.90, fabric of man-made fibers of subheading 5906.99 or fabric of man-made fibers of subheading 5907.00.' TEXTILE EXCEPTION LIST: woven fabrics of 5407/5408/5512-5516 and MAN-MADE-FIBER fabrics of 5903.10/.20/.90, 5906.99 and 5907.00 are blocked — note the exception is goods-kind-specific (only the man-made-fiber fabrics of those subheadings, not all goods of them). Textile rules live in the textiles file; here exceptions only.",
    sources: SRC,
  },
  {
    id: "hides-42-4202-19-21",
    sector: "hides-leather-furs",
    chapters: ["42"],
    hsRange: "Subheadings 4202.19 through 4202.21",
    label: "Other trunks/suitcases; briefcases, leather (4202.19-4202.21) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 4202.19 through 4202.21 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "hides-42-4202-22",
    sector: "hides-leather-furs",
    chapters: ["42"],
    hsRange: "Subheading 4202.22",
    label: "Briefcases, plastic/textile outer surface (4202.22) — tariff shift EXCEPT from the textile-fabric exception list",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 4202.22 from any other chapter, except from headings 5407, 5408 or 5512 through 5516, or fabric of man-made fibers of subheading 5903.10, fabric of man-made fibers of subheading 5903.20, fabric of man-made fibers of subheading 5903.90, fabric of man-made fibers of subheading 5906.99 or fabric of man-made fibers of subheading 5907.00.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 42, rule 5) — identical exception list to rule 3 (4202.12).",
    sources: SRC,
  },
  {
    id: "hides-42-4202-29-31",
    sector: "hides-leather-furs",
    chapters: ["42"],
    hsRange: "Subheadings 4202.29 through 4202.31",
    label: "Other briefcases; trunks etc. of vulcanized fibre/molded material (4202.29-4202.31) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 4202.29 through 4202.31 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "hides-42-4202-32",
    sector: "hides-leather-furs",
    chapters: ["42"],
    hsRange: "Subheading 4202.32",
    label: "Handbags, leather/composition leather (4202.32) — tariff shift EXCEPT from the textile-fabric exception list",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 4202.32 from any other chapter, except from headings 5407, 5408 or 5512 through 5516, or fabric of man-made fibers of subheading 5903.10, fabric of man-made fibers of subheading 5903.20, fabric of man-made fibers of subheading 5903.90, fabric of man-made fibers of subheading 5906.99 or fabric of man-made fibers of subheading 5907.00.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 42, rule 7) — identical exception list to rules 3 and 5.",
    sources: SRC,
  },
  {
    id: "hides-42-4202-39-91",
    sector: "hides-leather-furs",
    chapters: ["42"],
    hsRange: "Subheadings 4202.39 through 4202.91",
    label: "Other handbags; occupational luggage cases; other luggage (4202.39-4202.91) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 4202.39 through 4202.91 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "hides-42-4202-92",
    sector: "hides-leather-furs",
    chapters: ["42"],
    hsRange: "Subheading 4202.92",
    label: "Handbags etc., plastic/textile outer surface, with outer surface of plastic sheeting (4202.92) — tariff shift EXCEPT from the textile-fabric exception list",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 4202.92 from any other chapter, except from headings 5407, 5408 or 5512 through 5516, or fabric of man-made fibers of subheading 5903.10, fabric of man-made fibers of subheading 5903.20, fabric of man-made fibers of subheading 5903.90, fabric of man-made fibers of subheading 5906.99 or fabric of man-made fibers of subheading 5907.00.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 42, rule 9) — identical exception list to rules 3/5/7. FOUR subheadings total carry the list: 4202.12, 4202.22, 4202.32, 4202.92 (the plastic/textile-surface goods only; the leather-surface goods 4202.11/.19-.21/.29-.31/.39-.91 do not).",
    sources: SRC,
  },
  {
    id: "hides-42-4202-99",
    sector: "hides-leather-furs",
    chapters: ["42"],
    hsRange: "Subheading 4202.99",
    label: "Other cases/bags n.e.s. (4202.99) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 4202.99 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "hides-42-4203-4206",
    sector: "hides-leather-furs",
    chapters: ["42"],
    hsRange: "Headings 4203 through 4206",
    label: "Articles of apparel/clothing of leather; string etc.; saddler's/harness articles; other articles of leather (4203-4206) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 4203 through 4206 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  // ---------------- Chapter 43 ----------------
  {
    id: "hides-43-4301",
    sector: "hides-leather-furs",
    chapters: ["43"],
    hsRange: "Heading 4301",
    label: "Raw furskins (4301) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 4301 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "hides-43-4302",
    sector: "hides-leather-furs",
    chapters: ["43"],
    hsRange: "Heading 4302",
    label: "Tanned or dressed furskins (4302) — tariff shift from any other HEADING (heading-level, not chapter)",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 4302 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 43, rule 2): '2. A change to heading 4302 from any other heading.' HEADING-LEVEL shift as printed — same printed pattern as ch. 15 rule 2 and ch. 17 rule 2; transcribed as printed, flag for human audit.",
    sources: SRC,
  },
  {
    id: "hides-43-4303-4304",
    sector: "hides-leather-furs",
    chapters: ["43"],
    hsRange: "Headings 4303 through 4304",
    label: "Artificial fur; articles of furskin (4303-4304) — tariff shift from any heading OUTSIDE that group",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 4303 through 4304 from any heading outside that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 43, rule 3): '3. A change to headings 4303 through 4304 from any heading outside that group.' Group-outside formulation (intra-group 4303-to-4304 shifts do not qualify).",
    sources: SRC,
  },
];

export const HIDES_LEATHER_FURS_SECTOR_FILE: UsmcaSectorFile = {
  sector: "hides-leather-furs",
  chaptersCovered: ["41", "42", "43"],
  dataAsOf: "2026-09-28",
  mergeEligible: true,
  auditStatus: "human_verified",
  rules: HIDES_LEATHER_FURS_RULES,
  watchItems: [
    "NO TV/NC RVC ANYWHERE in Chapters 41-43 — all rules are tariff shifts or goods-kind branch shifts. Never offer TV/NC except via the core file's GN 11(b)(iv) fallback.",
    "Chapter 41 PERMISSION-STYLE chain: rules 5-18 each EXPRESSLY PERMIT named intra-chapter inputs ('from heading 4101 or any other chapter', 'from subheading 4103.10 or any other chapter' etc.) — earlier-stage leather-chain inputs qualify. The ONLY exception in the chapter is rule 4: 4104 blocks shifts FROM 4107. Verify the calculator's shift engine treats these as permitted inputs, not exceptions.",
    "Chapter 41 goods-kind branches: 4101/4102 reversible-tanning two-branch rules allow intra-heading good-level changes for reversible-tanned goods; 4103 THREE-branch rule with the camel/dromedary branch blocked from chapter 43; 4106.40 wet-state vs. crust two-branch rule.",
    "Chapter 42 TEXTILE EXCEPTION LIST (identical, four occurrences, subheadings 4202.12/.22/.32/.92 ONLY — the plastic/textile-outer-surface goods): headings 5407, 5408, 5512-5516 plus MAN-MADE-FIBER fabrics of 5903.10/.20/.90, 5906.99 and 5907.00. Goods-kind-specific exception: only man-made-fiber fabrics of those subheadings are blocked. Textile rules live in the textiles file; here exceptions only.",
    "Heading-level shifts printed (not chapter): 4104 (with the 4107 exception), 4302, and 4303-4304's any-heading-outside-group formulation. 4302 is the same heading-level pattern seen in ch. 15 rule 2 and ch. 17 rule 2 — flagged for human audit.",
    "No GN 11(k) carryover, no subheading rules, no chapter rules, no phased rules print for chapters 41-43.",
    "De minimis (GN 11(e), 10 percent) and the GN 11(b)(iv) fallback (60 TV / 50 NC) are owned by the core types file — never restated here.",
    "USMCA joint review (around 2026) may revise rules of origin — re-verify against the current HTSUS GN 11 revision before relying on this file for new claim periods.",
  ],
  sourceFirewall: {
    treatyBaseline: "USMCA Chapter 4 / Annex 4-B, Chapters 41-43 (Raw hides and skins, leather; Articles of leather; Furskins and artificial fur)",
    usImplementation: "HTSUS General Note 11 (2026 Revision 15), subdivision (o) Chapters 41-43 / 19 CFR Part 182 / SOR-2020-155 Schedule 1 (Canada)",
    excludedAgreements: [
      "NAFTA (superseded — GN 12(t) Chapters 41-43 rules differ; never backfill)",
      "KORUS, CAFTA-DR and other FTAs with leather/goods rules — never backfill",
      "Textile headings 5407-5516 and 5903/5906/5907 fabric rules (owned by the textiles file, chapters 50-63; here shift exceptions only)",
      "Chapters 40 and 44+ product rules (own files)",
    ],
  },
};

export default HIDES_LEATHER_FURS_SECTOR_FILE;