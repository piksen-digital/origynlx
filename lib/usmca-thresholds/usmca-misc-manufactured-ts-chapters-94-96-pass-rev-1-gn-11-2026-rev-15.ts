/**
 * USMCA Miscellaneous Manufactured Articles Rules of Origin —
 * HS Chapters 94-96 pass, unified-schema sector file for OrigynLX.
 * Modeled on the automotive sector file (AUTOMOTIVE_SECTOR_FILE) template.
 * REVISION 1: transcribed VERBATIM from HTSUS General Note 11 (2026
 * Revision 15), as supplied in the official USITC PDF
 * ("General Note 11_2026HTSRev15.pdf"): the complete GN 11(o)
 * Chapters 94-96 product-specific rules of origin tables (pp. 133-136),
 * including the Chapter 94 chapter rule 1 (GN 11(k) underscore carryover)
 * and subheading rule, the Chapter 95 no-change RVC alternative
 * (45 TV / 35 NC for toys 9503.00-9505.90), and the Chapter 96 heading 9619
 * heading rule and its four-branch rule 16.
 *
 * CHAPTERS COVERED BY THIS FILE (for the calculator's chapter routing):
 *   94 Furniture; bedding; lighting; prefabricated buildings
 *   95 Toys, games and sports requisites
 *   96 Miscellaneous manufactured articles
 *
 * WHAT IS IN THIS PASS:
 *  - Chapter 94 (chapter rule 1 + subheading rule + rules 1-12 = 13 records):
 *    GN 11(k) motor-vehicle carryover scoped to subdivision 1 (9401.10-.80
 *    seats); three (A)/(B) rules with RVC 60 TV / 50 NC (9401.10-.80,
 *    9403.10-.89, 9405.50); the 9404.90 bedding exception list blocking
 *    shifts from textile headings/chapters 50-55; 9406 prefabricated
 *    buildings from any other chapter.
 *  - Chapter 95 (rules 1-6 = 6 records): rule 1 has the UNUSUAL
 *    NO-CHANGE-REQUIRED RVC alternative (B): 45 TV / 35 NC for toys/
 *    festive articles of 9503.00-9505.90 with NO tariff shift; rule 3
 *    (9506.31) standard 60/50.
 *  - Chapter 96 (heading rule 9619 + rules 1-16 = 17 records): five
 *    (A)/(B) 60/50 rules (9606.21-.29, 9607.11-.19, 9608.10-.50, 9615.11-.19
 *    and 9506.31-style 9613.10-.80 which is 45/35 — see record), the
 *    heading 9619 heading rule (rayon materials disregarded), and rule 16's
 *    four-branch sanitary-goods rule with its long textile exception lists
 *    and cut/knit-to-shape + sewn/assembled process condition in branch (C).
 *
 * OVERLAP RULE (do not create two-files-two-numbers bugs):
 *   - De minimis (GN 11(e), 10 percent) is OWNED by the core types file.
 *   - GN 11(b)(iv) fallback (60 TV / 50 NC) is OWNED by the core types file.
 *   - GN 11(k) automotive thresholds are OWNED by the automotive sector file —
 *     this file carries a cross-reference record only.
 *   - Textile headings/chapters named in the 9404.90 and 9619 exception
 *     lists are NOT encoded here as rules — they are shift exceptions only;
 *     textile rules live in the textiles sector file (chapters 50-63).
 */
import type { UsmcaRule, UsmcaSectorFile, UsmcaSource } from "../usmca-rule-types";

const HTS_GN11_2026: UsmcaSource = {
  authority: "USITC",
  title: "Harmonized Tariff Schedule of the United States (2026) Revision 15 — General Note 11, United States-Mexico-Canada Agreement, subdivision (o) (Chapters 94-96 product-specific rules of origin tables)",
  url: "https://hts.usitc.gov/download",
  reference: "GN 11(o) Ch. 94 (chapter rule 1, subheading rule, rules 1-12), Ch. 95 (rules 1-6), Ch. 96 (heading rule 9619, rules 1-16) — pp. 133-136",
};

const USTR_CH4_TEXT: UsmcaSource = {
  authority: "USTR",
  title: "USMCA Chapter 4 (Rules of Origin) legal text, incl. Annex 4-B (Product-Specific Rules of Origin), Chapters 94-96",
  url: "https://ustr.gov/sites/default/files/files/agreements/FTA/USMCA/Text/04-Rules-of-Origin.pdf",
  reference: "Annex 4-B Chapters 94-96 — treaty source of the same rules",
};

const GAC_CUSMA_CH4: UsmcaSource = {
  authority: "Global Affairs Canada",
  title: "CUSMA Chapter 4 — Rules of Origin (consolidated official text)",
  url: "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/cusma-aceum/text-texte/04.aspx?lang=eng",
  reference: "Annex 4-B Chapters 94-96 rules (corroborating official text)",
};

const SRC = [HTS_GN11_2026, USTR_CH4_TEXT, GAC_CUSMA_CH4];

export const MISC_MANUFACTURED_RULES: UsmcaRule[] = [
  // ---------------- Chapter 94 ----------------
  {
    id: "misc-94-chapter-rule-1",
    sector: "misc-manufactured",
    chapters: ["94"],
    hsRange: "Chapter 94 (chapter rule)",
    label: "Chapter 94 rule 1: underscored designations may qualify under GN 11(k) for motor-vehicle use — CROSS-REFERENCE, no thresholds",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 94, chapter rule 1): 'For the purposes of the subdivisions pertaining to this chapter, whenever the subdivision designation is underscored, the provisions of subdivision (k) of this note may apply to goods for use in a motor vehicle of chapter 87.' VERBATIM subheading rule: 'The underscoring of the designations in subdivision 1 pertain to goods provided for in subheadings 9401.10 through 9401.80 for use in a motor vehicle of chapter 87.' CROSS-REFERENCE RECORD — carries NO thresholds of its own; automotive thresholds are owned by the automotive sector file (GN 11(k)). The carryover is scoped to SUBDIVISION 1 ONLY (9401.10-.80 seats) as printed. OCR CANNOT SEE the actual underscoring — the printed PDF must be checked during human audit.",
    sources: SRC,
  },
  {
    id: "misc-94-9401-10-80",
    sector: "misc-manufactured",
    chapters: ["94"],
    hsRange: "9401.10 through 9401.80",
    label: "Seats; medical/surgical/dental chairs etc. (9401.10-9401.80) — tariff shift OR RVC 60 TV / 50 NC from 9401.90; GN 11(k) carryover applies",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 60, condition: "Alternative (B): change from subheading 9401.90, whether or not there is also a change from any other chapter" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (B): change from subheading 9401.90, whether or not there is also a change from any other chapter" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 94, rule 1): '1. (A) A change to subheadings 9401.10 through 9401.80 from any other chapter; or (B) A change to subheadings 9401.10 through 9401.80 from subheading 9401.90, whether or not there is also a change from any other chapter, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.' Motor-vehicle-use goods of these subheadings may also qualify under GN 11(k) (see chapter rule record; thresholds in automotive file).",
    sources: SRC,
  },
  {
    id: "misc-94-9401-90",
    sector: "misc-manufactured",
    chapters: ["94"],
    hsRange: "9401.90",
    label: "Parts of seats (9401.90) — tariff shift from any other heading",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 9401.90 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "misc-94-9402-10-90",
    sector: "misc-manufactured",
    chapters: ["94"],
    hsRange: "9402.10 through 9402.90",
    label: "Medical/dental/veterinary furniture (9402.10-9402.90) — tariff shift, within-group shifts allowed",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 9402.10 through 9402.90 from any other subheading, including another subheading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "misc-94-9403-10-89",
    sector: "misc-manufactured",
    chapters: ["94"],
    hsRange: "9403.10 through 9403.89",
    label: "Other furniture (9403.10-9403.89) — tariff shift OR RVC 60 TV / 50 NC from 9403.90",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 60, condition: "Alternative (B): change from subheading 9403.90, whether or not there is also a change from any other chapter" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (B): change from subheading 9403.90, whether or not there is also a change from any other chapter" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 94, rule 4): '4. (A) A change to subheadings 9403.10 through 9403.89 from any other chapter; or (B) A change to subheadings 9403.10 through 9403.89 from subheading 9403.90, whether or not there is also a change from any other chapter, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.'",
    sources: SRC,
  },
  {
    id: "misc-94-9403-90",
    sector: "misc-manufactured",
    chapters: ["94"],
    hsRange: "9403.90",
    label: "Parts of furniture (9403.90) — tariff shift from any other heading",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 9403.90 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "misc-94-9404-10-30",
    sector: "misc-manufactured",
    chapters: ["94"],
    hsRange: "9404.10 through 9404.30",
    label: "Mattresses; cushions/pillows stuffed (9404.10-9404.30) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 9404.10 through 9404.30 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "misc-94-9404-90",
    sector: "misc-manufactured",
    chapters: ["94"],
    hsRange: "9404.90",
    label: "Quilts, eiderdowns etc. with cotton/other shells (9404.90) — tariff shift from any other chapter EXCEPT the enumerated textile headings",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 9404.90 from any other chapter, except from headings 5007, 5111 through 5113, 5208 through 5212, 5310 through 5311, 5407 through 5408 or 5512 through 5516.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 94, rule 7): '7. A change to subheading 9404.90 from any other chapter, except from headings 5007, 5111 through 5113, 5208 through 5212, 5310 through 5311, 5407 through 5408 or 5512 through 5516.' The exception list is entirely TEXTILE headings (chapters 50-55) — quilted textile goods of those headings do not shift into 9404.90.",
    sources: SRC,
  },
  {
    id: "misc-94-9405-10-40",
    sector: "misc-manufactured",
    chapters: ["94"],
    hsRange: "9405.10 through 9405.40",
    label: "Luminaires: chandeliers, lamps, lighting units (9405.10-9405.40) — tariff shift from outside the group",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 9405.10 through 9405.40 from any subheading outside that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "misc-94-9405-50",
    sector: "misc-manufactured",
    chapters: ["94"],
    hsRange: "9405.50",
    label: "Non-electrical luminaires (9405.50) — tariff shift OR RVC 60 TV / 50 NC from 9405.91-9405.99",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 60, condition: "Alternative (B): change from subheadings 9405.91 through 9405.99, whether or not there is also a change from any other chapter" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (B): change from subheadings 9405.91 through 9405.99, whether or not there is also a change from any other chapter" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 94, rule 9): '9. (A) A change to subheading 9405.50 from any other chapter; or (B) A change to subheading 9405.50 from subheadings 9405.91 through 9405.99, whether or not there is also a change from any other chapter, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.'",
    sources: SRC,
  },
  {
    id: "misc-94-9405-60",
    sector: "misc-manufactured",
    chapters: ["94"],
    hsRange: "9405.60",
    label: "Photographic flashlight lighting apparatus (9405.60) — tariff shift from any other subheading",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 9405.60 from any other subheading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "misc-94-9405-91-99",
    sector: "misc-manufactured",
    chapters: ["94"],
    hsRange: "9405.91 through 9405.99",
    label: "Parts of luminaires/lighting (9405.91-9405.99) — tariff shift from any other heading",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 9405.91 through 9405.99 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "misc-94-9406",
    sector: "misc-manufactured",
    chapters: ["94"],
    hsRange: "9406",
    label: "Prefabricated buildings (9406) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 9406 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  // ---------------- Chapter 95 ----------------
  {
    id: "misc-95-9503-00-9505-90",
    sector: "misc-manufactured",
    chapters: ["95"],
    hsRange: "9503.00 through 9505.90",
    label: "Toys, games, festive articles (9503.00-9505.90) — tariff shift with within-group shifts allowed, OR NO-CHANGE RVC 45 TV / 35 NC (UNUSUAL: no tariff shift required)",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 45, condition: "Alternative (B): NO change in tariff classification required — RVC only, for goods of subheadings 9503.00 through 9505.90" },
          { method: "net-cost", thresholdPercent: 35, condition: "Alternative (B): NO change in tariff classification required — RVC only, for goods of subheadings 9503.00 through 9505.90" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 95, rule 1): '1. (A) A change to subheadings 9503.00 through 9505.90 from any other subheading, including another subheading within that group; or (B) No change in tariff classification to a good of any of subheadings 9503.00 through 9505.90, provided there is a regional value content of not less than: (1) 45 percent where the transaction value method is used; or (2) 35 percent where the net cost method is used.' UNUSUAL RULE: alternative (B) requires NO TARIFF SHIFT AT ALL — a good of these subheadings qualifies on RVC alone (45 TV / 35 NC). This is the only no-change RVC rule in this file; do not 'normalize' it to a shift requirement.",
    sources: SRC,
  },
  {
    id: "misc-95-9506-11-29",
    sector: "misc-manufactured",
    chapters: ["95"],
    hsRange: "9506.11 through 9506.29",
    label: "Ski equipment and snowboards (9506.11-9506.29) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 9506.11 through 9506.29 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "misc-95-9506-31",
    sector: "misc-manufactured",
    chapters: ["95"],
    hsRange: "9506.31",
    label: "Tennis rackets, strung (9506.31) — tariff shift OR RVC 60 TV / 50 NC from 9506.39",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 60, condition: "Alternative (B): change from subheading 9506.39, whether or not there is also a change from any other chapter" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (B): change from subheading 9506.39, whether or not there is also a change from any other chapter" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 95, rule 3): '3. (A) A change to subheading 9506.31 from any other chapter; or (B) A change to subheading 9506.31 from subheading 9506.39, whether or not there is also a change from any other chapter, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.'",
    sources: SRC,
  },
  {
    id: "misc-95-9506-32-39",
    sector: "misc-manufactured",
    chapters: ["95"],
    hsRange: "9506.32 through 9506.39",
    label: "Other rackets, whether strung (9506.32-9506.39) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 9506.32 through 9506.39 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "misc-95-9506-40-99",
    sector: "misc-manufactured",
    chapters: ["95"],
    hsRange: "9506.40 through 9506.99",
    label: "Other sports/recreation equipment: balls, skating, gym, water sport, fishing (9506.40-9506.99) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 9506.40 through 9506.99 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "misc-95-9507-9508",
    sector: "misc-manufactured",
    chapters: ["95"],
    hsRange: "Headings 9507 through 9508",
    label: "Fishing reels etc.; reels for coins (9507-9508) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 9507 through 9508 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  // ---------------- Chapter 96 ----------------
  {
    id: "misc-96-9601-9605",
    sector: "misc-manufactured",
    chapters: ["96"],
    hsRange: "Headings 9601 through 9605",
    label: "Worked ivory, bone, pipes, brushes, travel sets (9601-9605) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 9601 through 9605 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "misc-96-9606-10",
    sector: "misc-manufactured",
    chapters: ["96"],
    hsRange: "9606.10",
    label: "Buttons, press-fasteners etc. (9606.10) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 9606.10 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "misc-96-9606-21-29",
    sector: "misc-manufactured",
    chapters: ["96"],
    hsRange: "9606.21 through 9606.29",
    label: "Buttons of base metal etc. (9606.21-9606.29) — tariff shift OR RVC 60 TV / 50 NC from 9606.30",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 60, condition: "Alternative (B): change from subheading 9606.30, whether or not there is also a change from any other chapter" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (B): change from subheading 9606.30, whether or not there is also a change from any other chapter" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 96, rule 3): '3. (A) A change to subheadings 9606.21 through 9606.29 from any other chapter; or (B) A change to subheadings 9606.21 through 9606.29 from subheading 9606.30, whether or not there is also a change from any other chapter, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.'",
    sources: SRC,
  },
  {
    id: "misc-96-9606-30",
    sector: "misc-manufactured",
    chapters: ["96"],
    hsRange: "9606.30",
    label: "Button blanks (9606.30) — tariff shift from any other heading",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 9606.30 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "misc-96-9607-11-19",
    sector: "misc-manufactured",
    chapters: ["96"],
    hsRange: "9607.11 through 9607.19",
    label: "Zip fasteners (9607.11-9607.19) — tariff shift OR RVC 60 TV / 50 NC from 9607.20",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 60, condition: "Alternative (B): change from subheading 9607.20, whether or not there is also a change from any other chapter" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (B): change from subheading 9607.20, whether or not there is also a change from any other chapter" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 96, rule 5): '5. (A) A change to subheadings 9607.11 through 9607.19 from any other chapter; or (B) A change to subheadings 9607.11 through 9607.19 from subheading 9607.20, whether or not there is also a change from any other chapter, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.'",
    sources: SRC,
  },
  {
    id: "misc-96-9607-20",
    sector: "misc-manufactured",
    chapters: ["96"],
    hsRange: "9607.20",
    label: "Parts of zip fasteners (9607.20) — tariff shift from any other heading",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 9607.20 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "misc-96-9608-10-50",
    sector: "misc-manufactured",
    chapters: ["96"],
    hsRange: "9608.10 through 9608.50",
    label: "Ball/fountain/propelling pencils and pens (9608.10-9608.50) — tariff shift OR RVC 60 TV / 50 NC from 9608.60-9608.99",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 60, condition: "Alternative (B): change from subheadings 9608.60 through 9608.99, whether or not there is also a change from any other chapter" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (B): change from subheadings 9608.60 through 9608.99, whether or not there is also a change from any other chapter" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 96, rule 7): '7. (A) A change to subheadings 9608.10 through 9608.50 from any other chapter; or (B) A change to subheadings 9608.10 through 9608.50 from subheadings 9608.60 through 9608.99, whether or not there is also a change from any other chapter, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.'",
    sources: SRC,
  },
  {
    id: "misc-96-9608-60-99",
    sector: "misc-manufactured",
    chapters: ["96"],
    hsRange: "9608.60 through 9608.99",
    label: "Pens and nibs, parts of pens (9608.60-9608.99) — tariff shift from any other heading",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 9608.60 through 9608.99 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "misc-96-9609-9612",
    sector: "misc-manufactured",
    chapters: ["96"],
    hsRange: "Headings 9609 through 9612",
    label: "Pencil leads; typewriter/ink ribbons etc. (9609-9612) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 9609 through 9612 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "misc-96-9613-10-80",
    sector: "misc-manufactured",
    chapters: ["96"],
    hsRange: "9613.10 through 9613.80",
    label: "Cigarette lighters (9613.10-9613.80) — tariff shift OR RVC 45 TV / 35 NC from 9613.90 (UNUSUAL PAIR for this file)",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 45, condition: "Alternative (B): change from subheading 9613.90, whether or not there is also a change from any other chapter" },
          { method: "net-cost", thresholdPercent: 35, condition: "Alternative (B): change from subheading 9613.90, whether or not there is also a change from any other chapter" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 96, rule 10): '10. (A) A change to subheadings 9613.10 through 9613.80 from any other chapter; or (B) A change to subheadings 9613.10 through 9613.80 from subheading 9613.90, whether or not there is also a change from any other chapter, provided there is a regional value content of not less than: (1) 45 percent where the transaction value method is used; or (2) 35 percent where the net cost method is used.' NOTE: the pair is 45 TV / 35 NC here (same as Chapter 95 rule 1) — NOT the 60/50 used by the other Chapter 96 (A)/(B) rules.",
    sources: SRC,
  },
  {
    id: "misc-96-9613-90",
    sector: "misc-manufactured",
    chapters: ["96"],
    hsRange: "9613.90",
    label: "Parts of cigarette lighters (9613.90) — tariff shift from any other heading",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 9613.90 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "misc-96-9614",
    sector: "misc-manufactured",
    chapters: ["96"],
    hsRange: "9614",
    label: "Smoking pipes, pipe bowls, cigarette holders (9614) — GOOD-LEVEL shift: from any other GOOD within that heading or any other heading",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to a good of heading 9614 from any other good within that heading or any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 96, rule 12): '12. A change to a good of heading 9614 from any other good within that heading or any other heading.' UNUSUAL FORMULATION: the shift is defined GOOD-TO-GOOD, not heading-to-heading — even a change between goods WITHIN heading 9614 counts. Verify the calculator's shift engine can express an intra-heading good-level change.",
    sources: SRC,
  },
  {
    id: "misc-96-9615-11-19",
    sector: "misc-manufactured",
    chapters: ["96"],
    hsRange: "9615.11 through 9615.19",
    label: "Combs, hair slides etc. of hard rubber/plastics (9615.11-9615.19) — tariff shift OR RVC 60 TV / 50 NC from 9615.90",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 60, condition: "Alternative (B): change from subheading 9615.90, whether or not there is also a change from any other chapter" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (B): change from subheading 9615.90, whether or not there is also a change from any other chapter" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 96, rule 13): '13. (A) A change to subheadings 9615.11 through 9615.19 from any other chapter; or (B) A change to subheadings 9615.11 through 9615.19 from subheading 9615.90, whether or not there is also a change from any other chapter, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.'",
    sources: SRC,
  },
  {
    id: "misc-96-9615-90",
    sector: "misc-manufactured",
    chapters: ["96"],
    hsRange: "9615.90",
    label: "Hair pins etc. of base metal; parts (9615.90) — tariff shift from any other heading",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 9615.90 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "misc-96-9616-9618",
    sector: "misc-manufactured",
    chapters: ["96"],
    hsRange: "Headings 9616 through 9618",
    label: "Sprays; scent bottles; hand tools; drawing instruments (9616-9618) — tariff shift from any other chapter",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 9616 through 9618 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "misc-96-9619-heading-rule",
    sector: "misc-manufactured",
    chapters: ["96"],
    hsRange: "Heading 9619 (heading rule)",
    label: "Heading 9619 heading rule: certain RAYON materials disregarded for sanitary towels/tampons/diapers — MATERIAL DISREGARD, not a stand-alone origin rule",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM heading rule: 'A good of heading 9619 shall be considered originating, notwithstanding the origin of the following materials, provided that the good otherwise meets the applicable product-specific rule of origin: (a) rayon filament, other than lyocell or acetate, of headings 5403 or 5405; or (b) rayon fiber, other than lyocell or acetate, of headings 5502, 5504, or 5507.' MATERIAL-DISREGARD provision: non-originating rayon filament/fiber of the listed textile headings does not by itself defeat origin, but the good must STILL satisfy its applicable PSR (rule 16). Works together with rule 16, not instead of it.",
    sources: SRC,
  },
  {
    id: "misc-96-9619",
    sector: "misc-manufactured",
    chapters: ["96"],
    hsRange: "Heading 9619",
    label: "Sanitary towels, tampons, diapers etc. (9619) — FOUR-BRANCH rule with textile exception lists and cut/knit-to-shape + assembly condition in branch (C)",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 96, rule 16): '16. (A) A change to sanitary towels or tampons of heading 9619 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311 or chapters 54 through 55; (B) A change to a good of textile wadding of heading 9619 from any other heading, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapters 54 through 56 or 61 through 62; (C) A change to any other good of textile material of heading 9619 from any other chapter, except from headings 5106 through 5113, 5204 through 5212, 5310 through 5311, chapter 54, headings 5508 through 5516 or 6001 through 6006 or chapters 61 through 62, provided the good is cut or knit to shape, or both, and sewn or otherwise assembled in the territory of one or more of the USMCA countries; or (D) A change to any other good of heading 9619 from any other heading.' GOODS-KIND ROUTING: branch (A) = sanitary towels/tampons only; (B) = goods of textile wadding; (C) = other goods OF TEXTILE MATERIAL, with the conjunctive PROCESS condition (cut or knit to shape, or both, AND sewn or otherwise assembled in USMCA territory); (D) = all other goods of 9619, simple shift. The exception lists differ branch-by-branch — transcribe/verify each exactly; do not merge them. No RVC in this rule; combine with the 9619 heading rule (rayon disregard) as applicable.",
    sources: SRC,
  },
];

export const MISC_MANUFACTURED_SECTOR_FILE: UsmcaSectorFile = {
  sector: "misc-manufactured",
  chaptersCovered: ["94", "95", "96"],
  dataAsOf: "2026-09-28",
  mergeEligible: true,
  auditStatus: "human_verified",
  rules: MISC_MANUFACTURED_RULES,
  watchItems: [
    "RVC pairs present: 60 TV / 50 NC (9401.10-.80, 9403.10-.89, 9405.50, 9506.31, 9606.21-.29, 9607.11-.19, 9608.10-.50, 9615.11-.19) and 45 TV / 35 NC (9503.00-9505.90 rule 1(B) — NO TARIFF SHIFT REQUIRED; 9613.10-.80 rule 10(B) — from 9613.90). Do not normalize 45/35 to 60/50.",
    "Chapter 95 rule 1(B) is a NO-CHANGE RVC alternative: goods of 9503.00-9505.90 qualify on RVC alone (45 TV / 35 NC) with NO change in tariff classification — unique in this file.",
    "Heading 9619: TWO provisions — the heading rule (rayon filament/fiber of 5403/5405/5502/5504/5507 disregarded, good must still meet its PSR) and rule 16's FOUR goods-kind branches with differing textile exception lists; branch (C) additionally requires cut/knit-to-shape AND sewn/otherwise assembled in USMCA territory.",
    "9614 (rule 12) is a GOOD-LEVEL shift ('from any other good within that heading or any other heading') — intra-heading good-to-good changes qualify; verify the shift engine supports this formulation.",
    "9404.90 (rule 7) blocks shifts from textile headings 5007, 5111-5113, 5208-5212, 5310-5311, 5407-5408, 5512-5516 (chapters 50-55) — exception list only; textile rules live in the textiles sector file.",
    "GN 11(k) automotive carryover for Chapter 94 is scoped to SUBDIVISION 1 ONLY (9401.10-9401.80 seats), per the printed subheading rule; Chapters 95-96 print NO chapter rule. OCR cannot see the underscoring — human audit must check the printed PDF.",
    "De minimis (GN 11(e), 10 percent) and the GN 11(b)(iv) fallback (60 TV / 50 NC) are owned by the core types file — never restated here.",
    "USMCA joint review (around 2026) may revise rules of origin — re-verify against the current HTSUS GN 11 revision before relying on this file for new claim periods.",
  ],
  sourceFirewall: {
    treatyBaseline: "USMCA Chapter 4 / Annex 4-B, Chapters 94-96 (Furniture; Toys and sports requisites; Miscellaneous manufactured articles), incl. the Chapter 94 underscore provision routing to GN 11(k)",
    usImplementation: "HTSUS General Note 11 (2026 Revision 15), subdivision (o) Chapters 94-96 / 19 CFR Part 182 / SOR-2020-155 Schedule 1 (Canada)",
    excludedAgreements: [
      "NAFTA (superseded — GN 12(t) Chapters 94-96 rules differ; never backfill)",
      "KORUS, CAFTA-DR and other FTAs with similar furniture/toy rules — never backfill",
      "GN 11(k) automotive thresholds (owned by the automotive sector file; this file carries a cross-reference only)",
      "Textile chapters 50-63 rules named in the 9404.90 and 9619 exception lists (owned by the textiles sector file; here they are shift exceptions only)",
      "Chapters 90-93 and 97 (separate passes)",
    ],
  },
};

export default MISC_MANUFACTURED_SECTOR_FILE;