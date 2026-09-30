/**
 * USMCA Transport Equipment Rules of Origin —
 * HS Chapters 86-89 pass, unified-schema sector file for OrigynLX.
 * Modeled on the automotive sector file (AUTOMOTIVE_SECTOR_FILE) template
 * (explicit object-literal records — no generator functions).
 * REVISION 3 — STRUCTURAL REBUILD ON THE TEMPLATE. Rev. 2 carried all the
 * verbatim GN 11 content but deviated structurally from the automotive/
 * optics record pattern (generator functions, threshold field naming,
 * rule-number ids, no rules field in the sector file). Rev. 3 keeps the
 * rev. 2 verbatim content — re-transcribed VERBATIM from HTSUS General
 * Note 11 (2026 Revision 15), subdivision (o) — and restores the template
 * exactly:
 *   Chapter 86 (GN pp. 110-112), Chapter 87 (GN pp. 112-122),
 *   Chapter 88 (GN p. 123), Chapter 89 (GN p. 123).
 *
 * CHAPTERS COVERED BY THIS FILE (for the calculator's chapter routing):
 *   86 Railway stock and traffic-way equipment; parts thereof
 *   87 Vehicles other than railway rolling stock; parts thereof
 *   88 Aircraft, spacecraft, and parts thereof
 *   89 Ships, boats and floating structures
 *
 * WHAT IS IN THIS PASS (87 records):
 *  - Chapter 86 (17 records): rules 1-9 printed rules PLUS the TIME-BASED
 *    rail-steel regime: 8607.11-.12, 8607.29, 8607.91 and 8609 each print
 *    an early window (from July 1, 2020: simple shift / 60-50 no-change)
 *    and a from-July 1, 2023 steel rule (shift except headings 7208-7229
 *    or 7301-7326; OR from those headings provided at least 70 PERCENT
 *    BY WEIGHT of the materials of those headings is originating; OR no
 *    change with 70/60 RVC). The 2023 rules are NOW IN FORCE; the early
 *    windows are retained for dated entries. Also US tariff-item rules
 *    8607.19.03 and 8607.19.12.
 *  - Chapter 87 (63 records): the vehicle chapter. Shift-AND-RVC,
 *    NET-COST-ONLY thresholds throughout: tractors 60/70/60 NC; buses
 *    62.5 (15 or fewer persons) / 60 (16 or more) NC; snowmobiles 8703.10
 *    60 TV / 50 NC; passenger cars 8703.21-.90 75 NC passenger vehicle /
 *    62.5 NC any other good; light trucks 8704.21/.31 75 NC light truck /
 *    62.5 NC off-road; heavy trucks 8704.22-.23 70 NC / 60 NC off-road;
 *    8704.32-.90 REVERSED (60 NC off-road / 70 NC any other good);
 *    8706 chassis no-change-only 75/70/60 NC; 8708 parts 70 NC
 *    vehicle-use vs 50 NC any-other pattern throughout; chassis frames and
 *    body stampings 75 NC; gear boxes / drive axles / steering /
 *    suspension passenger-vehicle no-change rules 75 NC; ten-branch drive
 *    axle rule with bearing exceptions 8482.10-.80; tariff-item-level
 *    branches 8708.99.03/.27/.55 and .06/.31/.58 with bearing exceptions
 *    8482.99.05/.15/.25. AUTOMOTIVE APPENDIX ROUTING: the printed rules
 *    for 8706-8708.99 designate which Automotive Appendix article applies
 *    by vehicle use (Arts. 3.2/3.3/3.4 passenger vehicle/light truck;
 *    4.2/4.4 heavy truck; 10.1/10.2 Art. 10 vehicles) — recorded per-rule.
 *  - Chapter 88 (3 records): gliders good-level rule (8801); aircraft
 *    8802.11-8803.90 subheading-group shift; 8804-8805 heading-group shift.
 *  - Chapter 89 (4 records): 8901-8902 and 8904-8905 (A) chapter shift OR
 *    (B) intra-chapter-89 change + 60/50 RVC; 8903 shift AND 60/50 RVC;
 *    8906-8908 heading-group shift.
 *
 * OCR/PRINT ODDITIES TRANSCRIBED AS PRINTED (flagged for audit):
 *   - 8607.91 early window prints "until January 1, 2023" while the
 *     paired late window prints "Beginning on July 1, 2023" — internal
 *     date inconsistency, as printed.
 *   - 8609 rule (c) prints "No change in tariff classification to a good
 *     of heading 8609 is required provided" (extra "is required").
 *   - 8607.29 / 8607.91 early windows print "(i) 60 percent ... used, or"
 *     (comma before "or"); the 8607.29-2023 steel rule prints "and 7301
 *     through 7326" where 8607.11-.12 prints "or".
 *   - 8706 heavy-truck rule prints "for use in heavy truck" (missing
 *     article); the 8706 any-other rule ends with a semicolon.
 *   - 8708.29 body-stamping rule prints "at least 75 percent" (not "not
 *     less than").
 *   - 8708.30 rule (D) prints "of subheadings 8708.30, or 8708.99"
 *     (comma); 8708.50 rule (B) prints "from subheading 8482.10 through
 *     8482.80" (singular).
 *   - 8708.80 rules (B) print "A change to any other good subheading
 *     8708.80" (missing "of").
 *   - 8708.92: the "any other good" rule prints INSIDE rule 42's letter
 *     sequence as branches (D)-(G) (not as its own numbered rule);
 *     branches (B)/(F) print "provided there is regional value content"
 *     (missing "a"); (C)/(G) end without a period.
 *   - 8708.99 tariff-item branches: rule 52 prints "or" across items
 *     8708.99.03, 8708.99.27 or 8708.99.55 where rule 54 prints "and";
 *     both (A) branches end with a comma.
 *
 * OVERLAP RULE (do not create two-files-two-numbers bugs):
 *   - De minimis (GN 11(e), 10 percent) is OWNED by the core types file.
 *   - GN 11(b)(iv) fallback (60 TV / 50 NC) is OWNED by the core types file.
 *   - GN 11(k) automotive thresholds are OWNED by the automotive file;
 *     here only the Automotive Appendix ROUTING is recorded per-rule.
 *   - Chapters 84-85 (machinery), 90-92 (optics) and 93+ rules (own
 *     files) are not restated here.
 */
import type { UsmcaRule, UsmcaSectorFile, UsmcaSource } from "../usmca-rule-types";

const HTS_GN11_2026: UsmcaSource = {
  authority: "USITC",
  title: "Harmonized Tariff Schedule of the United States (2026) Revision 15 — General Note 11, United States-Mexico-Canada Agreement, subdivision (o) (Chapters 86-89 product-specific rules of origin tables)",
  url: "https://hts.usitc.gov/download",
  reference: "GN 11(o) Ch. 86 (pp. 110-112), Ch. 87 (pp. 112-122), Ch. 88 (p. 123), Ch. 89 (p. 123)",
};

const USTR_CH4_TEXT: UsmcaSource = {
  authority: "USTR",
  title: "USMCA Chapter 4 (Rules of Origin) legal text, incl. Annex 4-B (Product-Specific Rules of Origin), Chapters 86-89",
  url: "https://ustr.gov/sites/default/files/files/agreements/FTA/USMCA/Text/04-Rules-of-Origin.pdf",
  reference: "Annex 4-B Chapters 86-89 — treaty source of the same rules; Automotive Appendix (USMCA Ch. 5 Annex) governs the vehicle-use rules of ch. 87",
};

const GAC_CUSMA_CH4: UsmcaSource = {
  authority: "Global Affairs Canada",
  title: "CUSMA Chapter 4 — Rules of Origin (consolidated official text)",
  url: "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/cusma-aceum/text-texte/04.aspx?lang=eng",
  reference: "Annex 4-B Chapters 86-89 rules (corroborating official text)",
};

const SRC = [HTS_GN11_2026, USTR_CH4_TEXT, GAC_CUSMA_CH4];

const AUTO_APPENDIX = " Automotive-appendix routing: the printed rule preceding these subdivisions designates which Automotive Appendix article applies by vehicle use (Arts. 3.2/3.3/3.4 for passenger vehicle/light truck; 4.2/4.4 for heavy truck; 10.1/10.2 for Art. 10 vehicles).";

const RVC_60_50 = [
  { method: "transaction-value" as const, thresholdPercent: 60, condition: "Alternative branch: qualifying change named in the rule, whether or not there is also a change from any other heading/chapter — RVC not less than 60 percent by transaction value" },
  { method: "net-cost" as const, thresholdPercent: 50, condition: "Alternative branch: qualifying change named in the rule, whether or not there is also a change from any other heading/chapter — RVC not less than 50 percent by net cost" },
];

const RVC_NOSIFT_60_50 = [
  { method: "transaction-value" as const, thresholdPercent: 60, condition: "No change in tariff classification to the good — RVC not less than 60 percent by transaction value" },
  { method: "net-cost" as const, thresholdPercent: 50, condition: "No change in tariff classification to the good — RVC not less than 50 percent by net cost" },
];

const RVC_NOSIFT_70_60 = [
  { method: "transaction-value" as const, thresholdPercent: 70, condition: "No change in tariff classification to the good — RVC not less than 70 percent by transaction value" },
  { method: "net-cost" as const, thresholdPercent: 60, condition: "No change in tariff classification to the good — RVC not less than 60 percent by net cost" },
];

export const TRANSPORT_RULES: UsmcaRule[] = [

  // ---------------- Chapter 86 (railway etc.) ----------------
  {
    id: "trans-86-8601-8602",
    sector: "transport",
    chapters: ["86"],
    hsRange: "Headings 8601 through 8602",
    label: "Rail locomotives (8601–8602) — heading-group shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 8601 through 8602 from any other heading, including another heading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 86, rule 1): '1. A change to headings 8601 through 8602 from any other heading, including another heading within that group.'",
    sources: SRC,
  },
  {
    id: "trans-86-8603-8606",
    sector: "transport",
    chapters: ["86"],
    hsRange: "Headings 8603 through 8606",
    label: "Rail rolling stock (8603–8606) — (A) shift except from 8607, or (B) from 8607 parts + RVC 60/50",
    ruleBasis: "tariff-shift-or-rvc",
    tariffShiftRule: "A change to headings 8603 through 8606 from any other heading, including another heading within that group, except from heading 8607.",
    phases: [{ rvcOptions: RVC_60_50 }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 86, rule 2): '2. (A) A change to headings 8603 through 8606 from any other heading, including another heading within that group, except from heading 8607; or (B) A change to headings 8603 through 8606 from heading 8607, whether or not there is also a change from any other heading, including another heading within that group, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.' Anti-backsliding: 8607 rail parts cannot shift into finished rolling stock without meeting the RVC route.",
    sources: SRC,
  },
  {
    id: "trans-86-8607-11-12-pre2023",
    sector: "transport",
    chapters: ["86"],
    hsRange: "Subheadings 8607.11 through 8607.12",
    label: "Rail bogies, axles etc. (8607.11–8607.12) — rule window July 1, 2020 until July 1, 2023 (simple shift only)",
    ruleBasis: "special",
    tariffShiftRule: "A change to subheadings 8607.11 through 8607.12 from any subheading outside that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 86, time-based rule for 8607.11-.12, p. 110): 'Beginning on July 1, 2020 until July 1, 2023, the following rule of origin shall apply to subheadings 8607.11 through 8607.12: (a) A change to subheadings 8607.11 through 8607.12 from any subheading outside that group.' TIME-LIMITED SUBHEADING RULE: simple shift only during the window; superseded by the 2023 steel rule (see trans-86-8607-11-12-2023). The (i)/(ii)-numbered RVC block printed with this entry belongs to the LATE rule.",
    sources: SRC,
  },
  {
    id: "trans-86-8607-11-12-2023",
    sector: "transport",
    chapters: ["86"],
    hsRange: "Subheadings 8607.11 through 8607.12",
    label: "Rail bogies, axles etc. (8607.11–8607.12) — steel rule from July 1, 2023 (70%-by-weight originating steel; 70/60 RVC)",
    ruleBasis: "special",
    tariffShiftRule: "A change to subheadings 8607.11 through 8607.12 from any other heading, except from headings 7208 through 7229 or 7301 through 7326; or a change from headings 7208 through 7229 or 7301 through 7326 provided that at least 70 percent by weight of the materials of those headings is originating.",
    phases: [{ rvcOptions: RVC_NOSIFT_70_60 }],
    effectiveFrom: "2023-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 86, time-based rule for 8607.11-.12, pp. 110-111): 'Beginning on July 1, 2023, and thereafter, the following rules of origin shall apply to subheadings 8607.11 through 8607.12: (a) A change to subheadings 8607.11 through 8607.12 from any other heading, except from headings 7208 through 7229 or 7301 through 7326; (b) A change to subheadings 8607.11 through 8607.12 from headings 7208 through 7229 or 7301 through 7326, provided that at least 70 percent by weight of the materials of headings 7208 through 7229 or 7301 through 7326 is originating; or (c) No change in tariff classification to a good of subheadings 8607.11 through 8607.12, provided there is a regional value content of not less than: (i) 70 percent where the transaction value method is used; or (ii) 60 percent where the net cost method is used.' TIME-BASED STEEL RULE — NOW IN FORCE. Note the 70-PERCENT-BY-WEIGHT originating-steel branch (b): this is a weight test, not an RVC test. Steel cross-reference (ch. 72/73 — base-metals file owns those rules; here exception/permission only).",
    sources: SRC,
  },
  {
    id: "trans-86-8607-19-03",
    sector: "transport",
    chapters: ["86"],
    hsRange: "Tariff item 8607.19.03",
    label: "Rail axles, certain tariff item (8607.19.03) — (A) shift, or (B) from 8607.19.06 + RVC 60/50",
    ruleBasis: "tariff-shift-or-rvc",
    tariffShiftRule: "A change to tariff item 8607.19.03 from any other heading.",
    phases: [{ rvcOptions: RVC_60_50 }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 86, rule 3): '3. (A) A change to tariff item 8607.19.03 from any other heading; or (B) A change to tariff item 8607.19.03 from tariff item 8607.19.06, whether or not there is also a change from any other heading, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.' US TARIFF-ITEM-level rule (8-digit statistical breakout) — requires 8-digit classification data.",
    sources: SRC,
  },
  {
    id: "trans-86-8607-19-12",
    sector: "transport",
    chapters: ["86"],
    hsRange: "Tariff item 8607.19.12",
    label: "Rail axles, certain tariff item (8607.19.12) — (A) shift, or (B) from 8607.19.06/.15 + RVC 60/50",
    ruleBasis: "tariff-shift-or-rvc",
    tariffShiftRule: "A change to tariff item 8607.19.12 from any other heading.",
    phases: [{ rvcOptions: RVC_60_50 }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 86, rule 4): '4. (A) A change to tariff item 8607.19.12 from any other heading; or (B) A change to tariff item 8607.19.12 from tariff items 8607.19.06 or 8607.19.15, whether or not there is also a change from any other heading, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.' US TARIFF-ITEM-level rule.",
    sources: SRC,
  },
  {
    id: "trans-86-8607-19",
    sector: "transport",
    chapters: ["86"],
    hsRange: "Subheading 8607.19",
    label: "Other railway axles/wheels (8607.19) — heading-level shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 8607.19 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 86, rule 5): '5. A change to subheading 8607.19 from any other heading.'",
    sources: SRC,
  },
  {
    id: "trans-86-8607-21",
    sector: "transport",
    chapters: ["86"],
    hsRange: "Subheading 8607.21",
    label: "Air brakes etc. (8607.21) — (A) shift, or (B) no-change + RVC 60/50",
    ruleBasis: "tariff-shift-or-rvc",
    tariffShiftRule: "A change to subheading 8607.21 from any other heading.",
    phases: [{ rvcOptions: RVC_NOSIFT_60_50 }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 86, rule 6): '6. (A) A change to subheading 8607.21 from any other heading; or (B) No change in tariff classification to a good of subheading 8607.21, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.'",
    sources: SRC,
  },
  {
    id: "trans-86-8607-29-pre2023",
    sector: "transport",
    chapters: ["86"],
    hsRange: "Subheading 8607.29",
    label: "Other brake parts (8607.29) — rule window July 1, 2020 until July 1, 2023 (shift or 60/50 no-change)",
    ruleBasis: "tariff-shift-or-rvc",
    tariffShiftRule: "A change to subheading 8607.29 from any other heading.",
    phases: [{ rvcOptions: RVC_NOSIFT_60_50 }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 86, time-based rule for 8607.29, p. 111): 'Beginning on July 1, 2020 until July 1, 2023, the following rule of origin shall apply to subheading 8607.29: (a) A change to subheading 8607.29 from any other heading; or (b) No change in tariff classification to a good of subheading 8607.29, provided there is a regional value content of not less than: (i) 60 percent where the transaction value method is used, or (ii) 50 percent where the net cost method is used.' TIME-LIMITED SUBHEADING RULE: superseded by the 2023 steel rule (see trans-86-8607-29-2023). PRINT ODDITY: '(i) 60 percent ... used, or' (comma before 'or') — as printed.",
    sources: SRC,
  },
  {
    id: "trans-86-8607-29-2023",
    sector: "transport",
    chapters: ["86"],
    hsRange: "Subheading 8607.29",
    label: "Other brake parts (8607.29) — steel rule from July 1, 2023 (70%-by-weight originating steel; 70/60 RVC)",
    ruleBasis: "special",
    tariffShiftRule: "A change to subheading 8607.29 from any other heading, except from headings 7208 through 7229 or headings 7301 through 7326; or a change from headings 7208 through 7229 or 7301 through 7326 provided that at least 70 percent by weight of the materials of those headings is originating.",
    phases: [{ rvcOptions: RVC_NOSIFT_70_60 }],
    effectiveFrom: "2023-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 86, time-based rule for 8607.29, p. 111): 'Beginning on July 1, 2023, and thereafter, the following rules of origin shall apply to subheading 8607.29: (a) A change to subheading 8607.29 from any other heading, except from headings 7208 through 7229 or headings 7301 through 7326; (b) A change to subheading 8607.29 from headings 7208 through 7229 or 7301 through 7326, provided that at least 70 percent by weight of the materials of headings 7208 through 7229 and 7301 through 7326 is originating; or (c) No change in tariff classification to a good of subheading 8607.29 provided there is a regional value content of not less than: (i) 70 percent where the transaction value method is used; or (ii) 60 percent where the net cost method is used.' TIME-BASED STEEL RULE — NOW IN FORCE. PRINT ODDITY: branch (b) prints 'and 7301 through 7326' where the 8607.11-.12 rule prints 'or' — as printed.",
    sources: SRC,
  },
  {
    id: "trans-86-8607-30",
    sector: "transport",
    chapters: ["86"],
    hsRange: "Subheading 8607.30",
    label: "Rail buffers/hooks (8607.30) — (A) shift, or (B) no-change + RVC 60/50",
    ruleBasis: "tariff-shift-or-rvc",
    tariffShiftRule: "A change to subheading 8607.30 from any other heading.",
    phases: [{ rvcOptions: RVC_NOSIFT_60_50 }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 86, rule 7): '7. (A) A change to subheading 8607.30 from any other heading; or (B) No change in tariff classification to a good of subheading 8607.30, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.'",
    sources: SRC,
  },
  {
    id: "trans-86-8607-91-pre2023",
    sector: "transport",
    chapters: ["86"],
    hsRange: "Subheading 8607.91",
    label: "Other rail parts (8607.91) — rule window July 1, 2020 until January 1, 2023 (shift or 60/50 no-change)",
    ruleBasis: "tariff-shift-or-rvc",
    tariffShiftRule: "A change to subheading 8607.91 from any other heading.",
    phases: [{ rvcOptions: RVC_NOSIFT_60_50 }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 86, time-based rule for 8607.91, p. 112): 'Beginning on July 1, 2020 until January 1, 2023, the following rule of origin shall apply to subheading 8607.91: (a) A change to subheading 8607.91 from any other heading; or (b) No change in tariff classification to a good of subheading 8607.91, provided there is a regional value content of not less than: (i) 60 percent where the transaction value method is used, or (ii) 50 percent where the net cost method is used.' TIME-LIMITED SUBHEADING RULE. PRINT ODDITIES: this early window prints 'until January 1, 2023' while the paired late window prints 'Beginning on July 1, 2023' — an internal date inconsistency, transcribed as printed, flagged for audit; '(i) 60 percent ... used, or' (comma before 'or') — as printed.",
    sources: SRC,
  },
  {
    id: "trans-86-8607-91-2023",
    sector: "transport",
    chapters: ["86"],
    hsRange: "Subheading 8607.91",
    label: "Other rail parts (8607.91) — steel rule from July 1, 2023 (70%-by-weight originating steel; 70/60 RVC)",
    ruleBasis: "special",
    tariffShiftRule: "A change to subheading 8607.91 from any other heading, except from headings 7208 through 7229 or 7301 through 7326; or a change from headings 7208 through 7229 or 7301 through 7326 provided that at least 70 percent by weight of the materials of those headings is originating.",
    phases: [{ rvcOptions: RVC_NOSIFT_70_60 }],
    effectiveFrom: "2023-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 86, time-based rule for 8607.91, p. 112): 'Beginning on July 1, 2023, and thereafter, the following rules of origin shall apply to subheading 8607.91: (a) A change to subheading 8607.91 from any other heading, except from headings 7208 through 7229 or 7301 through 7326; (b) A change to subheading 8607.91 from headings 7208 through 7229 or 7301 through 7326, provided that at least 70 percent by weight of the materials of headings 7208 through 7229 and 7301 through 7326 is originating; or (c) No change in tariff classification to a good of subheading 8607.91 provided there is a regional value content of not less than: (i) 70 percent where the transaction value method is used; or (ii) 60 percent where the net cost method is used.' TIME-BASED STEEL RULE — NOW IN FORCE. NOTE: paired early window says 'January 1, 2023' (see trans-86-8607-91-pre2023 oddity).",
    sources: SRC,
  },
  {
    id: "trans-86-8607-99",
    sector: "transport",
    chapters: ["86"],
    hsRange: "Subheading 8607.99",
    label: "Other rail parts (8607.99) — (A) shift, or (B) no-change + RVC 60/50",
    ruleBasis: "tariff-shift-or-rvc",
    tariffShiftRule: "A change to subheading 8607.99 from any other heading.",
    phases: [{ rvcOptions: RVC_NOSIFT_60_50 }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 86, rule 8): '8. (A) A change to subheading 8607.99 from any other heading; or (B) No change in tariff classification to a good of subheading 8607.99, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.'",
    sources: SRC,
  },
  {
    id: "trans-86-8608",
    sector: "transport",
    chapters: ["86"],
    hsRange: "Heading 8608",
    label: "Rail track fixtures (8608) — heading-level shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 8608 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 86, rule 9): '9. A change to heading 8608 from any other heading.'",
    sources: SRC,
  },
  {
    id: "trans-86-8609-pre2023",
    sector: "transport",
    chapters: ["86"],
    hsRange: "Heading 8609",
    label: "Containers (8609) — rule window July 1, 2020 until July 1, 2023 (simple shift only)",
    ruleBasis: "special",
    tariffShiftRule: "A change to heading 8609 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 86, time-based rule for 8609, p. 112): 'Beginning on July 1, 2020 until July 1, 2023, the following rule of origin shall apply to heading 8609: (a) A change to heading 8609 from any other heading.' TIME-LIMITED HEADING RULE: simple shift only during the window; superseded by the 2023 steel rule (see trans-86-8609-2023).",
    sources: SRC,
  },
  {
    id: "trans-86-8609-2023",
    sector: "transport",
    chapters: ["86"],
    hsRange: "Heading 8609",
    label: "Containers (8609) — steel rule from July 1, 2023 (70%-by-weight originating steel; 70/60 RVC)",
    ruleBasis: "special",
    tariffShiftRule: "A change to heading 8609 from any other heading, except from headings 7208 through 7229 or 7301 through 7326; or a change from headings 7208 through 7229 or 7301 through 7326 provided that at least 70 percent by weight of the materials of those headings is originating.",
    phases: [{ rvcOptions: RVC_NOSIFT_70_60 }],
    effectiveFrom: "2023-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 86, time-based rule for 8609, p. 112): 'Beginning on July 1, 2023, and thereafter, the following rules of origin shall apply to heading 8609: (a) A change to heading 8609 from any other heading, except from headings 7208 through 7229 or 7301 through 7326; or (b) A change to heading 8609 from headings 7208 through 7229 or 7301 through 7326, provided that at least 70 percent by weight of the materials of headings 7208 through 7229 and 7301 through 7326 is originating; or (c) No change in tariff classification to a good of heading 8609 is required provided there is a regional value content of not less than: (i) 70 percent where the transaction value method is used; or (ii) 60 percent where the net cost method is used.' TIME-BASED STEEL RULE — NOW IN FORCE. PRINT ODDITY: branch (c) prints 'No change in tariff classification to a good of heading 8609 is required provided' (extra 'is required') — transcribed as printed, flagged for audit.",
    sources: SRC,
  },

  // ---------------- Chapter 87 (vehicles) ----------------
  {
    id: "trans-87-8701-10",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8701.10",
    label: "Pedestrian-controlled tractors (8701.10) — shift AND RVC 60 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to a good of subheading 8701.10 from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 60, condition: "Shift AND RVC both required — RVC not less than 60 percent under the net cost method (net-cost-only rule)" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 1): '1. A change to a good of subheading 8701.10 from any other heading, provided there is a regional value content of not less than 60 percent under the net cost method.' SHIFT-AND-RVC, NET-COST-ONLY.",
    sources: SRC,
  },
  {
    id: "trans-87-8701-20",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8701.20",
    label: "Other tractors, steam/gas (8701.20) — shift AND RVC 70 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to a good of subheading 8701.20 from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 70, condition: "Shift AND RVC both required — RVC not less than 70 percent under the net cost method (net-cost-only rule)" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 2): '2. A change to a good of subheading 8701.20 from any other heading, provided there is a regional value content of not less than 70 percent under the net cost method.' SHIFT-AND-RVC, NET-COST-ONLY 70 — the highest tractor threshold.",
    sources: SRC,
  },
  {
    id: "trans-87-8701-30-90",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheadings 8701.30 through 8701.90",
    label: "Other tractors (8701.30–8701.90) — shift AND RVC 60 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to a good of subheadings 8701.30 through 8701.90 from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 60, condition: "Shift AND RVC both required — RVC not less than 60 percent under the net cost method (net-cost-only rule)" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 3): '3. A change to a good of subheadings 8701.30 through 8701.90 from any other heading, provided there is a regional value content of not less than 60 percent under the net cost method.' SHIFT-AND-RVC, NET-COST-ONLY.",
    sources: SRC,
  },
  {
    id: "trans-87-8702-10",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8702.10",
    label: "Buses (8702.10) — capacity branches: 15 or fewer persons 62.5 NC; 16 or more 60 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to a motor vehicle for the transport of 15 or fewer persons of subheading 8702.10, or to a motor vehicle for the transport of 16 or more persons of subheading 8702.10, from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 62.5, condition: "Branch (A): motor vehicle for the transport of 15 or fewer persons — shift AND RVC not less than 62.5 percent under the net cost method" },
      { method: "net-cost", thresholdPercent: 60, condition: "Branch (B): motor vehicle for the transport of 16 or more persons — shift AND RVC not less than 60 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 4): '4. (A) A change to a motor vehicle for the transport of 15 or fewer persons of subheading 8702.10 from any other heading, provided there is a regional value content of not less than 62.5 percent under the net cost method; or (B) A change to a motor vehicle for the transport of 16 or more persons of subheading 8702.10 from any other heading, provided there is a regional value content of not less than 60 percent under the net cost method.' CAPACITY BRANCHES: 15-or-fewer passengers 62.5 NC; 16-or-more 60 NC.",
    sources: SRC,
  },
  {
    id: "trans-87-8702-90",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8702.90",
    label: "Other buses (8702.90) — capacity branches: 15 or fewer persons 62.5 NC; 16 or more 60 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to a motor vehicle for the transport of 15 or fewer persons of subheading 8702.90, or to a motor vehicle for the transport of 16 or more persons of subheading 8702.90, from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 62.5, condition: "Branch (A): motor vehicle for the transport of 15 or fewer persons — shift AND RVC not less than 62.5 percent under the net cost method" },
      { method: "net-cost", thresholdPercent: 60, condition: "Branch (B): motor vehicle for the transport of 16 or more persons — shift AND RVC not less than 60 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 5): '5. (A) A change to a motor vehicle for the transport of 15 or fewer persons of subheading 8702.90 from any other heading, provided there is a regional value content of not less than 62.5 percent under the net cost method; or (B) A change to a motor vehicle for the transport of 16 or more persons of subheading 8702.90 from any other heading, provided there is a regional value content of not less than 60 percent under the net cost method.' CAPACITY BRANCHES: 62.5 NC / 60 NC (same structure as rule 4).",
    sources: SRC,
  },
  {
    id: "trans-87-8703-10",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8703.10",
    label: "Snowmobiles etc. (8703.10) — shift AND RVC 60 TV / 50 NC ((A)/(B)-lettered RVC block)",
    ruleBasis: "special",
    tariffShiftRule: "A change to subheading 8703.10 from any other heading.",
    phases: [{ rvcOptions: [
      { method: "transaction-value", thresholdPercent: 60, condition: "Shift AND RVC both required — RVC not less than 60 percent where the transaction value method is used" },
      { method: "net-cost", thresholdPercent: 50, condition: "Shift AND RVC both required — RVC not less than 50 percent where the net cost method is used" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 6): '6. A change to subheading 8703.10 from any other heading, provided there is a regional value content of not less than: (A) 60 percent where the transaction value method is used; or (B) 50 percent where the net cost method is used.' SHIFT-AND-RVC with (A)/(B)-lettered RVC block (unusual — most rules here use (1)/(2)). The ONLY transaction-value option in ch. 87 vehicles other than the shift alternatives.",
    sources: SRC,
  },
  {
    id: "trans-87-8703-21-90",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheadings 8703.21 through 8703.90",
    label: "Passenger cars etc. (8703.21–8703.90) — passenger vehicle 75 NC; any other good 62.5 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to a passenger vehicle of subheadings 8703.21 through 8703.90, or to any other good of subheadings 8703.21 through 8703.90, from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 75, condition: "Branch (A): passenger vehicle — shift AND RVC not less than 75 percent under the net cost method (the USMCA passenger-car content rule)" },
      { method: "net-cost", thresholdPercent: 62.5, condition: "Branch (B): any other good of these subheadings — shift AND RVC not less than 62.5 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 7): '7. (A) A change to a passenger vehicle of subheadings 8703.21 through 8703.90 from any other heading, provided there is a regional value content of not less than 75 percent under the net cost method; or (B) A change to any other good of subheadings 8703.21 through 8703.90 from any other heading, provided there is a regional value content of not less than 62.5 percent under the net cost method.' PASSENGER VEHICLES: 75 NC (the USMCA passenger-car content rule); other goods 62.5 NC.",
    sources: SRC,
  },
  {
    id: "trans-87-8704-10",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8704.10",
    label: "Dumper trucks (8704.10) — shift AND RVC 60 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to a good of subheading 8704.10 from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 60, condition: "Shift AND RVC both required — RVC not less than 60 percent under the net cost method (net-cost-only rule)" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 8): '8. A change to a good of subheading 8704.10 from any other heading, provided there is a regional value content of not less than 60 percent under the net cost method.' SHIFT-AND-RVC, NET-COST-ONLY.",
    sources: SRC,
  },
  {
    id: "trans-87-8704-21",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8704.21",
    label: "Pickup trucks, gasoline (8704.21) — light truck 75 NC; off-road 62.5 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to a light truck of subheading 8704.21, or to a vehicle solely or principally for off-road use of subheading 8704.21, from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 75, condition: "Branch (A): light truck — shift AND RVC not less than 75 percent under the net cost method (the USMCA pickup rule)" },
      { method: "net-cost", thresholdPercent: 62.5, condition: "Branch (B): vehicle solely or principally for off-road use — shift AND RVC not less than 62.5 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 9): '9. (A) A change to a light truck of subheading 8704.21 from any other heading, provided there is a regional value content of not less than 75 percent under the net cost method; or (B) A change to a vehicle solely or principally for off-road use of subheading 8704.21 from any other heading, provided there is a regional value content of not less than 62.5 percent under the net cost method.' LIGHT TRUCKS 75 NC (the USMCA pickup rule); off-road 62.5 NC.",
    sources: SRC,
  },
  {
    id: "trans-87-8704-22-23",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheadings 8704.22 through 8704.23",
    label: "Heavy trucks, diesel (8704.22–8704.23) — heavy truck 70 NC; off-road 60 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to a heavy truck of subheadings 8704.22 through 8704.23, or to a vehicle that is solely or principally for off-road use of subheadings 8704.22 through 8704.23, from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 70, condition: "Branch (A): heavy truck — shift AND RVC not less than 70 percent under the net cost method" },
      { method: "net-cost", thresholdPercent: 60, condition: "Branch (B): vehicle solely or principally for off-road use — shift AND RVC not less than 60 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 10): '10. (A) A change to a heavy truck of subheadings 8704.22 through 8704.23 from any other heading, provided there is a regional value content of not less than 70 percent under the net cost method; or (B) A change to a vehicle that is solely or principally for off-road use of subheadings 8704.22 through 8704.23 from any other heading, provided there is a regional value content of not less than 60 percent under the net cost method.' HEAVY TRUCKS 70 NC; off-road 60 NC.",
    sources: SRC,
  },
  {
    id: "trans-87-8704-31",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8704.31",
    label: "Pickup trucks, diesel (8704.31) — light truck 75 NC; off-road 62.5 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to a light truck of subheading 8704.31, or to a vehicle solely or principally for off-road use of subheading 8704.31, from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 75, condition: "Branch (A): light truck — shift AND RVC not less than 75 percent under the net cost method" },
      { method: "net-cost", thresholdPercent: 62.5, condition: "Branch (B): vehicle solely or principally for off-road use — shift AND RVC not less than 62.5 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 11): '11. (A) A change to a light truck of subheading 8704.31 from any other heading, provided there is a regional value content of not less than 75 percent under the net cost method; or (B) A change to a vehicle solely or principally for off-road use of subheading 8704.31 from any other heading, provided there is a regional value content of not less than 62.5 percent under the net cost method.' LIGHT TRUCKS 75 NC; off-road 62.5 NC (same as rule 9).",
    sources: SRC,
  },
  {
    id: "trans-87-8704-32-90",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheadings 8704.32 through 8704.90",
    label: "Other lorries (8704.32–8704.90) — REVERSED branches: off-road 60 NC; any other good 70 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to a vehicle that is solely or principally for off-road use of subheadings 8704.32 through 8704.90, or to any other good of subheadings 8704.32 through 8704.90, from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 60, condition: "Branch (A): vehicle solely or principally for off-road use — shift AND RVC not less than 60 percent under the net cost method" },
      { method: "net-cost", thresholdPercent: 70, condition: "Branch (B): any other good of these subheadings — shift AND RVC not less than 70 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 12): '12. (A) A change to a vehicle that is solely or principally for off-road use of subheadings 8704.32 through 8704.90 from any other heading, provided there is a regional value content of not less than 60 percent under the net cost method; or (B) A change to any other good of subheadings 8704.32 through 8704.90 from any other heading, provided there is a regional value content of not less than 70 percent under the net cost method.' NOTE the reversal vs rules 9-11: off-road 60 NC; any other good 70 NC.",
    sources: SRC,
  },
  {
    id: "trans-87-8705",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Heading 8705",
    label: "Special-purpose vehicles (8705) — shift AND RVC 60 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to heading 8705 from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 60, condition: "Shift AND RVC both required — RVC not less than 60 percent under the net cost method (net-cost-only rule)" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 13): '13. A change to heading 8705 from any other heading, provided there is a regional value content of not less than 60 percent under the net cost method.' SHIFT-AND-RVC, NET-COST-ONLY.",
    sources: SRC,
  },
  {
    id: "trans-87-8706-pv-lt",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Heading 8706 (passenger vehicle or light truck)",
    label: "Chassis fitted with engines (8706) — passenger vehicle or light truck use: no-change-only 75 NC",
    ruleBasis: "special",
    tariffShiftRule: "No change in tariff classification to a good of heading 8706 (no-change route).",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 75, condition: "No change in tariff classification to a good of heading 8706 for use in a passenger vehicle or light truck — RVC not less than 75 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 14): '14. For a good of heading 8706 for use in a passenger vehicle or light truck: (A) No change in tariff classification to a good of heading 8706, provided there is a regional value content of not less than 75 percent under the net cost method.' USE-CONDITION, NO-CHANGE-ONLY 75 NC." + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8706-heavy",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Heading 8706 (heavy truck)",
    label: "Chassis fitted with engines (8706) — heavy truck use: no-change-only 70 NC",
    ruleBasis: "special",
    tariffShiftRule: "No change in tariff classification to a good of heading 8706 (no-change route).",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 70, condition: "No change in tariff classification to a good of heading 8706 for use in heavy truck — RVC not less than 70 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 15): '15. For a good of heading 8706 for use in heavy truck: (A) No change in tariff classification to a good of heading 8706, provided there is a regional value content of not less than 70 percent under the net cost method.' USE-CONDITION, NO-CHANGE-ONLY 70 NC. PRINT ODDITY: 'for use in heavy truck' (missing article) — as printed." + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8706-other",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Heading 8706 (any other use)",
    label: "Chassis fitted with engines (8706) — any other use: no-change-only 60 NC",
    ruleBasis: "special",
    tariffShiftRule: "No change in tariff classification to a good of heading 8706 (no-change route).",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 60, condition: "No change in tariff classification to any other good of heading 8706 — RVC not less than 60 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 16): '16. For any other good of heading 8706: (A) No change in tariff classification to a good of heading 8706, provided there is a regional value content of not less than 60 percent under the net cost method;' NO-CHANGE-ONLY 60 NC. PRINT ODDITY: rule ends with a semicolon in print — as printed." + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8707-pv-lt",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Heading 8707 (passenger vehicle or light truck)",
    label: "Bodies for vehicles (8707) — passenger vehicle or light truck use: no-change-only 75 NC",
    ruleBasis: "special",
    tariffShiftRule: "No change in tariff classification to a good of heading 8707 (no-change route).",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 75, condition: "No change in tariff classification to a good of heading 8707 for use in a passenger vehicle or light truck — RVC not less than 75 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 17): '17. For a good of heading 8707 for use in a passenger vehicle or light truck: (A) No change in tariff classification to a good of heading 8707, provided there is a regional value content of not less than 75 percent under the net cost method.' USE-CONDITION, NO-CHANGE-ONLY 75 NC." + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8707-heavy",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Heading 8707 (heavy truck)",
    label: "Bodies for vehicles (8707) — heavy truck use: (A) chapter shift, or (B) from 8708 + 70 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to heading 8707 from any other chapter; or a change to heading 8707 from heading 8708, whether or not there is also a change from any other chapter.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 70, condition: "Branch (B): change from heading 8708, whether or not there is also a change from any other chapter — RVC not less than 70 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 18): '18. For a good of heading 8707 for use in a heavy truck: (A) A change to heading 8707 from any other chapter; or (B) A change to heading 8707 from heading 8708, whether or not there is also a change from any other chapter, provided there is a regional value content of not less than 70 percent under the net cost method.' NOTE 'from any other chapter' (not heading) — as printed." + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8707-other",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Heading 8707 (any other use)",
    label: "Bodies for vehicles (8707) — any other use: (A) chapter shift, or (B) from 8708 + 60 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to heading 8707 from any other chapter; or a change to heading 8707 from heading 8708, whether or not there is also a change from any other chapter.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 60, condition: "Branch (B): change from heading 8708, whether or not there is also a change from any other chapter — RVC not less than 60 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 19): '19. For any other good of heading 8707: (A) A change to heading 8707 from any other chapter; or (B) A change to heading 8707 from heading 8708, whether or not there is also a change from any other chapter, provided there is a regional value content of not less than 60 percent under the net cost method.'" + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-10-vehicle",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.10 (passenger vehicle, light truck or heavy truck)",
    label: "Bumpers (8708.10) — vehicle use: (A) shift, or (B) from 8708.99 + 70 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to subheading 8708.10 from any other heading; or a change to subheading 8708.10 from subheading 8708.99, whether or not there is also a change from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 70, condition: "Branch (B): change from subheading 8708.99, whether or not there is also a change from any other heading — RVC not less than 70 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 20): '20. For a good of subheading 8708.10 for use in a passenger vehicle, light truck, or heavy truck: (A) A change to subheading 8708.10 from any other heading; or (B) A change to subheading 8708.10 from subheading 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 70 percent under the net cost method.'" + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-10-other",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.10 (any other use)",
    label: "Bumpers (8708.10) — any other use: (A) shift, or (B) from 8708.99 + 50 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to subheading 8708.10 from any other heading; or a change to subheading 8708.10 from subheading 8708.99, whether or not there is also a change from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 50, condition: "Branch (B): change from subheading 8708.99, whether or not there is also a change from any other heading — RVC not less than 50 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 21): '21. For any other good of subheading 8708.10: (A) A change to subheading 8708.10 from any other heading; or (B) A change to subheading 8708.10 from subheading 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 50 percent under the net cost method.'" + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-21-vehicle",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.21 (passenger vehicle, light truck or heavy truck)",
    label: "Body panels/stays (8708.21) — vehicle use: (A) shift, or (B) from 8708.99 + 70 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to subheading 8708.21 from any other heading; or a change to subheading 8708.21 from subheading 8708.99, whether or not there is also a change from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 70, condition: "Branch (B): change from subheading 8708.99, whether or not there is also a change from any other heading — RVC not less than 70 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 22): '22. For a good of subheading 8708.21 for use in a passenger vehicle, light truck or heavy truck: (A) A change to subheading 8708.21 from any other heading; or (B) A change to subheading 8708.21 from subheading 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 70 percent under the net cost method.'" + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-21-other",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.21 (any other use)",
    label: "Body panels/stays (8708.21) — any other use: (A) shift, or (B) from 8708.99 + 50 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to subheading 8708.21 from any other heading; or a change to subheading 8708.21 from subheading 8708.99, whether or not there is also a change from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 50, condition: "Branch (B): change from subheading 8708.99, whether or not there is also a change from any other heading — RVC not less than 50 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 23): '23. For any other good of subheading 8708.21: (A) A change to subheading 8708.21 from any other heading; or (B) A change to subheading 8708.21 from subheading 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 50 percent under the net cost method.'" + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-29-stamping",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.29 (body stamping, passenger vehicle or light truck)",
    label: "Body parts (8708.29) — body stamping for passenger vehicle/light truck: no-change-only 75 NC ('at least 75 percent')",
    ruleBasis: "special",
    tariffShiftRule: "No change in tariff classification to a body stamping of subheading 8708.29 (no-change route).",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 75, condition: "No change in tariff classification to a body stamping of subheading 8708.29 for use in a passenger vehicle or light truck — RVC of at least 75 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 24): '24. For a body stamping of subheading 8708.29 for use in a passenger vehicle or light truck: (A) No change in tariff classification to a body stamping of subheading 8708.29, provided there is a regional value content of at least 75 percent under the net cost method.' PRINT ODDITY: 'a regional value content of at least 75 percent' ('at least', not 'not less than') — as printed. NO-CHANGE-ONLY 75 NC for body stampings." + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-29-vehicle",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.29 (passenger vehicle, light truck or heavy truck)",
    label: "Body parts (8708.29) — any other good, vehicle use: (A) shift, or (B) no-change + 70 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to subheading 8708.29 from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 70, condition: "Branch (B): no change in tariff classification to a good of subheading 8708.29 — RVC not less than 70 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 25): '25. For any other good of subheading 8708.29 for use in a passenger vehicle, light truck or heavy truck: (A) A change to subheading 8708.29 from any other heading; or (B) No change in tariff classification to a good of subheading 8708.29, provided there is a regional value content of not less than 70 percent under the net cost method.'" + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-29-other",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.29 (any other use)",
    label: "Body parts (8708.29) — any other use: (A) shift, or (B) no-change + 50 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to subheading 8708.29 from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 50, condition: "Branch (B): no change in tariff classification to a good of subheading 8708.29 — RVC not less than 50 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 26): '26. For any other good of subheading 8708.29: (A) A change to subheading 8708.29 from any other heading; or (B) No change in tariff classification to a good of subheading 8708.29, provided there is a regional value content of not less than 50 percent under the net cost method.'",
    sources: SRC,
  },
  {
    id: "trans-87-8708-30-vehicle",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.30 (passenger vehicle, light truck or heavy truck)",
    label: "Brakes (8708.30) — vehicle use: four-branch rule, mounted brake linings and other goods, at 70 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to mounted brake linings of subheading 8708.30, or to any other good of subheading 8708.30, from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 70, condition: "Branch (B)/(D): change from parts of mounted brake linings, brakes or servo-brakes of subheadings 8708.30 or 8708.99 (whether or not there is also a change from any other heading), or no-change route — RVC not less than 70 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 27): '27. For a good of subheading 8708.30 for use in a passenger vehicle, light truck or heavy truck: (A) A change to mounted brake linings of subheading 8708.30 from any other heading; or (B) A change to mounted brake linings of subheading 8708.30 from parts of mounted brake linings, brakes or servo-brakes of subheadings 8708.30 or 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 70 percent under the net cost method; (C) A change to any other good of subheading 8708.30 from any other heading; or (D) A change to any other good of subheading 8708.30 from mounted brake linings or parts of brakes or servo-brakes of subheadings 8708.30, or 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 70 percent under the net cost method.' FOUR-BRANCH brake rule at 70 NC, goods-kind split (mounted brake linings vs any other good). PRINT ODDITY: (D) 'of subheadings 8708.30, or 8708.99' (comma) — as printed." + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-30-other",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.30 (any other use)",
    label: "Brakes (8708.30) — any other use: same four-branch rule at 50 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to mounted brake linings of subheading 8708.30, or to any other good of subheading 8708.30, from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 50, condition: "Branch (B)/(D): change from parts of mounted brake linings, brakes or servo-brakes of subheadings 8708.30 or 8708.99 (whether or not there is also a change from any other heading) — RVC not less than 50 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 28): '28. For any other good of subheading 8708.30: (A) A change to mounted brake linings of subheading 8708.30 from any other heading; or (B) A change to mounted brake linings of subheading 8708.30 from parts of mounted brake linings, brakes or servo-brakes of subheadings 8708.30 or 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 50 percent under the net cost method; (C) A change to any other good of subheading 8708.30 from any other heading; or (D) A change to any other good of subheading 8708.30 from mounted brake linings or parts of brakes or servo-brakes of subheadings 8708.30, or 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 50 percent under the net cost method.' Same four-branch structure at 50 NC (same (D) comma oddity).",
    sources: SRC,
  },
  {
    id: "trans-87-8708-40-pv-lt",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.40 (passenger vehicle or light truck)",
    label: "Gear boxes (8708.40) — passenger vehicle or light truck use: no-change-only 75 NC",
    ruleBasis: "special",
    tariffShiftRule: "No change in tariff classification to a good of subheading 8708.40 (no-change route).",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 75, condition: "No change in tariff classification to a good of subheading 8708.40 for use in a passenger vehicle or light truck — RVC not less than 75 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 29): '29. For a good of subheading 8708.40 for use in a passenger vehicle or light truck: (A) No change in tariff classification to a good of subheading 8708.40, provided there is a regional value content of not less than 75 percent under the net cost method.' NO-CHANGE-ONLY 75 NC." + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-40-heavy",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.40 (heavy truck)",
    label: "Gear boxes (8708.40) — heavy truck use: no-change-only 70 NC",
    ruleBasis: "special",
    tariffShiftRule: "No change in tariff classification to a good of subheading 8708.40 (no-change route).",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 70, condition: "No change in tariff classification to a good of subheading 8708.40 for use in a heavy truck — RVC not less than 70 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 30): '30. For a good of subheading 8708.40 for use in a heavy truck: (A) No change in tariff classification to a good of subheading 8708.40, provided there is a regional value content of not less than 70 percent under the net cost method.' NO-CHANGE-ONLY 70 NC." + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-40-other",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.40 (any other use)",
    label: "Gear boxes (8708.40) — any other use: four-branch rule at 50 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to gear boxes of subheading 8708.40, or to any other good of subheading 8708.40, from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 50, condition: "Branch (B)/(D): change from any other good of subheadings 8708.40 or 8708.99 (whether or not there is also a change from any other heading), or no-change route — RVC not less than 50 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 31): '31. For any other good of subheading 8708.40: (A) A change to gear boxes of subheading 8708.40 from any other heading; or (B) A change to gear boxes of subheading 8708.40 from any other good of subheadings 8708.40 or 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 50 percent under the net cost method; (C) A change to any other good of subheading 8708.40 from any other heading; or (D) No change in tariff classification to any other good of subheading 8708.40, provided there is a regional value content of not less than 50 percent under the net cost method.' FOUR-BRANCH at 50 NC, goods-kind split (gear boxes vs any other good)." + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-50-pv-lt",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.50 (passenger vehicle or light truck)",
    label: "Drive axles (8708.50) — passenger vehicle or light truck use: no-change-only 75 NC",
    ruleBasis: "special",
    tariffShiftRule: "No change in tariff classification to a good of subheading 8708.50 (no-change route).",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 75, condition: "No change in tariff classification to a good of subheading 8708.50 for use in a passenger vehicle or light truck — RVC not less than 75 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 32): '32. For a good of subheading 8708.50 for use in a passenger vehicle or light truck: (A) No change in tariff classification to a good of subheading 8708.50, provided there is a regional value content of not less than 75 percent under the net cost method.' NO-CHANGE-ONLY 75 NC." + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-50-heavy",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.50 (heavy truck)",
    label: "Drive axles (8708.50) — heavy truck use: TEN-BRANCH rule at 70 NC with bearing exceptions 8482.10-.80",
    ruleBasis: "special",
    tariffShiftRule: "A change to drive-axles with differential, whether or not provided with other transmission components, for vehicles of heading 8703, of subheading 8708.50 from any other heading, except from subheadings 8482.10 through 8482.80; a change to other drive-axles with differential, whether or not provided with other transmission components, of subheading 8708.50 from any other heading; a change to non-driving axles and parts thereof, for vehicles of heading 8703, of subheading 8708.50 from any other heading, except from subheadings 8482.10 through 8482.80; a change to other non-driving axles and parts thereof of subheading 8708.50 from any other heading; or a change to any other good of subheading 8708.50 from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 70, condition: "Branches (B)/(D)/(F)/(H)/(J): change from subheading 8482.10 through 8482.80 or parts of drive-axles of 8708.50, from subheading 8708.99, or no-change route to any other good of 8708.50 — RVC not less than 70 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 33): '33. For a good of subheading 8708.50 for use in a heavy truck: (A) A change to drive-axles with differential, whether or not provided with other transmission components, for vehicles of heading 8703, of subheading 8708.50 from any other heading, except from subheadings 8482.10 through 8482.80; or (B) A change to drive-axles with differential, whether or not provided with other transmission components, for vehicles of heading 8703, of subheading 8708.50 from subheading 8482.10 through 8482.80 or parts of drive-axles of subheading 8708.50, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 70 percent under the net cost method; (C) A change to other drive-axles with differential, whether or not provided with other transmission components, of subheading 8708.50 from any other heading; or (D) A change to other drive-axles with differential, whether or not provided with other transmission components, of subheading 8708.50 from subheading 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 70 percent under the net cost method; (E) A change to non-driving axles and parts thereof, for vehicles of heading 8703, of subheading 8708.50 from any other heading, except from subheadings 8482.10 through 8482.80; or (F) A change to non-driving axles and parts thereof, for vehicles of heading 8703, of subheading 8708.50 from subheadings 8482.10 through 8482.80 or 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 70 percent under the net cost method; (G) A change to other non-driving axles and parts thereof of subheading 8708.50 from any other heading; or (H) A change to other non-driving axles and parts thereof of subheading 8708.50 from subheading 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 70 percent under the net cost method; (I) A change to any other good of subheading 8708.50 from any other heading; or (J) No change in tariff classification to any other good of subheading 8708.50, provided there is a regional value content of not less than 70 percent under the net cost method.' TEN-BRANCH axle rule at 70 NC with bearing exceptions (8482.10-.80). PRINT ODDITY: (B) 'from subheading 8482.10 through 8482.80' (singular) — as printed. Bearing cross-reference (ch. 84 — machinery file owns those rules; here exception/permission only)." + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-50-other",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.50 (any other use)",
    label: "Drive axles (8708.50) — any other use: same ten-branch rule at 50 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to drive-axles with differential, whether or not provided with other transmission components, for vehicles of heading 8703, of subheading 8708.50 from any other heading, except from subheadings 8482.10 through 8482.80; a change to other drive-axles with differential, whether or not provided with other transmission components, of subheading 8708.50 from any other heading; a change to non-driving axles and parts thereof, for vehicles of heading 8703, of subheading 8708.50 from any other heading, except from subheadings 8482.10 through 8482.80; a change to other non-driving axles and parts thereof of subheading 8708.50 from any other heading; or a change to any other good of subheading 8708.50 from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 50, condition: "Branches (B)/(D)/(F)/(H)/(J): change from subheading 8482.10 through 8482.80 or parts of drive-axles of 8708.50, from subheading 8708.99, or no-change route to any other good of 8708.50 — RVC not less than 50 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 34): '34. For any other good of subheading 8708.50: (A) A change to drive-axles with differential, whether or not provided with other transmission components, for vehicles of heading 8703, of subheading 8708.50 from any other heading, except from subheadings 8482.10 through 8482.80; or (B) A change to drive-axles with differential, whether or not provided with other transmission components, for vehicles of heading 8703, of subheading 8708.50 from subheading 8482.10 through 8482.80 or parts of drive-axles of subheading 8708.50, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 50 percent under the net cost method; (C) A change to other drive-axles with differential, whether or not provided with other transmission components, of subheading 8708.50 from any other heading; or (D) A change to other drive-axles with differential, whether or not provided with other transmission components, of subheading 8708.50 from subheading 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 50 percent under the net cost method; (E) A change to non-driving axles and parts thereof, for vehicles of heading 8703, of subheading 8708.50 from any other heading, except from subheadings 8482.10 through 8482.80; or (F) A change to non-driving axles and parts thereof, for vehicles of heading 8703, of subheading 8708.50 from subheadings 8482.10 through 8482.80 or 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 50 percent under the net cost method; (G) A change to other non-driving axles and parts thereof of subheading 8708.50 from any other heading; or (H) A change to other non-driving axles and parts thereof of subheading 8708.50 from subheading 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 50 percent under the net cost method; (I) A change to any other good of subheading 8708.50 from any other heading; or (J) No change in tariff classification to any other good of subheading 8708.50, provided there is a regional value content of not less than 50 percent under the net cost method.' Same ten-branch structure at 50 NC (same (B) singular oddity).",
    sources: SRC,
  },
  {
    id: "trans-87-8708-70-vehicle",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.70 (passenger vehicle, light truck or heavy truck)",
    label: "Body-mounted seats (8708.70) — vehicle use: (A) shift, or (B) from 8708.99 + 70 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to subheading 8708.70 from any other heading; or a change to subheading 8708.70 from subheading 8708.99, whether or not there is also a change from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 70, condition: "Branch (B): change from subheading 8708.99, whether or not there is also a change from any other heading — RVC not less than 70 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 35): '35. For a good of subheading 8708.70 for use in a passenger vehicle, light truck, or heavy truck: (A) A change to subheading 8708.70 from any other heading; or (B) A change to subheading 8708.70 from subheading 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 70 percent under the net cost method.'" + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-70-other",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.70 (any other use)",
    label: "Body-mounted seats (8708.70) — any other use: (A) shift, or (B) from 8708.99 + 50 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to subheading 8708.70 from any other heading; or a change to subheading 8708.70 from subheading 8708.99, whether or not there is also a change from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 50, condition: "Branch (B): change from subheading 8708.99, whether or not there is also a change from any other heading — RVC not less than 50 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 36): '36. For any other good of subheading 8708.70: (A) A change to subheading 8708.70 from any other heading; or (B) A change to subheading 8708.70 from subheading 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 50 percent under the net cost method.'" + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-80-pv-lt",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.80 (passenger vehicle or light truck)",
    label: "Suspension/shock absorbers (8708.80) — passenger vehicle or light truck use: no-change-only 75 NC",
    ruleBasis: "special",
    tariffShiftRule: "No change in tariff classification to a good of subheading 8708.80 (no-change route).",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 75, condition: "No change in tariff classification to a good of subheading 8708.80 for use in a passenger vehicle or light truck — RVC not less than 75 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 37): '37. For a good of subheading 8708.80 for use in a passenger vehicle or light truck: (A) No change in tariff classification to a good of subheading 8708.80, provided there is a regional value content of not less than 75 percent under the net cost method.' NO-CHANGE-ONLY 75 NC." + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-80-heavy",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.80 (heavy truck)",
    label: "Suspension/shock absorbers (8708.80) — heavy truck use: four-branch rule, McPherson struts 50 NC; suspension systems 70 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to McPherson struts of subheading 8708.80 from parts thereof of subheading 8708.80 or any other subheading; a change to any other good subheading 8708.80 from any other heading; or a change to suspension systems (including shock absorbers) of subheading 8708.80 from parts thereof of subheadings 8708.80 or 8708.99, whether or not there is also a change from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 50, condition: "Branch (A): change to McPherson struts from parts thereof of subheading 8708.80 or any other subheading — RVC not less than 50 percent under the net cost method" },
      { method: "net-cost", thresholdPercent: 70, condition: "Branch (C)/(D): change to suspension systems (including shock absorbers) from parts thereof of subheadings 8708.80 or 8708.99, or no-change route to parts of suspension systems — RVC not less than 70 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 38): '38. For a good of subheading 8708.80 for use in a heavy truck: (A) A change to McPherson struts of subheading 8708.80 from parts thereof of subheading 8708.80 or any other subheading, provided there is a regional value content of not less than 50 percent under the net cost method; (B) A change to any other good subheading 8708.80 from any other heading; (C) A change to suspension systems (including shock absorbers) of subheading 8708.80 from parts thereof of subheadings 8708.80 or 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 70 percent under the net cost method; or (D) No change in tariff classification to parts of suspension systems (including shock absorbers) of subheading 8708.80, provided there is a regional value content of not less than 70 percent under the net cost method.' FOUR-BRANCH: McPherson struts 50 NC; suspension systems and their parts 70 NC. PRINT ODDITY: (B) 'to any other good subheading 8708.80' (missing 'of') — as printed." + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-80-other",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.80 (any other use)",
    label: "Suspension/shock absorbers (8708.80) — any other use: same four-branch rule, all RVC branches 50 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to McPherson struts of subheading 8708.80 from parts thereof of subheading 8708.80 or any other subheading; a change to any other good subheading 8708.80 from any other heading; or a change to suspension systems (including shock absorbers) of subheading 8708.80 from parts thereof of subheadings 8708.80 or 8708.99, whether or not there is also a change from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 50, condition: "Branches (A)/(C)/(D): McPherson struts change, suspension-systems change from parts of 8708.80/8708.99, or no-change route to parts of suspension systems — RVC not less than 50 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 39): '39. For any other good of subheading 8708.80: (A) A change to McPherson struts of subheading 8708.80 from parts thereof of subheading 8708.80 or any other subheading, provided there is a regional value content of not less than 50 percent under the net cost method; (B) A change to any other good subheading 8708.80 from any other heading; (C) A change to suspension systems (including shock absorbers) of subheading 8708.80 from parts thereof of subheadings 8708.80 or 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 50 percent under the net cost method; or (D) No change in tariff classification to parts of suspension systems (including shock absorbers) of subheading 8708.80, provided there is a regional value content of not less than 50 percent under the net cost method.' Same four-branch structure; all RVC branches 50 NC. PRINT ODDITY: (B) missing 'of' as in rule 38.",
    sources: SRC,
  },
  {
    id: "trans-87-8708-91-vehicle",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.91 (passenger vehicle, light truck or heavy truck)",
    label: "Radiators (8708.91) — vehicle use: three-branch rule at 70 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to radiators of subheading 8708.91 from any other heading; or a change to radiators of subheading 8708.91 from any other good of subheading 8708.91, whether or not there is also a change from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 70, condition: "Branch (B)/(C): change from any other good of subheading 8708.91 (whether or not there is also a change from any other heading), or no-change route — RVC not less than 70 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 40): '40. For a good of subheading 8708.91 for use in a passenger vehicle, light truck or heavy truck: (A) A change to radiators of subheading 8708.91 from any other heading; (B) A change to radiators of subheading 8708.91 from any other good of subheading 8708.91, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 70 percent under the net cost method; or (C) No change in tariff classification to any other good of subheading 8708.91, provided there is a regional value content of not less than 70 percent under the net cost method.'" + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-91-other",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.91 (any other use)",
    label: "Radiators (8708.91) — any other use: same three-branch rule at 50 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to radiators of subheading 8708.91 from any other heading; or a change to radiators of subheading 8708.91 from any other good of subheading 8708.91, whether or not there is also a change from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 50, condition: "Branch (B)/(C): change from any other good of subheading 8708.91 (whether or not there is also a change from any other heading), or no-change route — RVC not less than 50 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 41): '41. For any other good of subheading 8708.91: (A) A change to radiators of subheading 8708.91 from any other heading; (B) A change to radiators of subheading 8708.91 from any other good of subheading 8708.91, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 50 percent under the net cost method; or (C) No change in tariff classification to any other good of subheading 8708.91, provided there is a regional value content of not less than 50 percent under the net cost method.'" + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-92-vehicle",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.92 (passenger vehicle, light truck or heavy truck)",
    label: "Silencers/mufflers and exhaust pipes (8708.92) — vehicle use: three-branch rule at 70 NC ('is regional value content' oddity)",
    ruleBasis: "special",
    tariffShiftRule: "A change to silencers (mufflers) or exhaust pipes of subheading 8708.92 from any other heading; or a change to silencers (mufflers) or exhaust pipes of subheading 8708.92 from any other good of subheading 8708.92, whether or not there is also a change from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 70, condition: "Branch (B)/(C): change from any other good of subheading 8708.92 (whether or not there is also a change from any other heading), or no-change route — RVC not less than 70 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 42): '42. For a good of subheading 8708.92 for use in a passenger vehicle, light truck or heavy truck: (A) A change to silencers (mufflers) or exhaust pipes of subheading 8708.92 from any other heading; or (B) A change to silencers (mufflers) or exhaust pipes of subheading 8708.92 from any other good of subheading 8708.92, whether or not there is also a change from any other heading, provided there is regional value content of not less than 70 percent under the net cost method; or (C) No change in tariff classification to any other good of subheading 8708.92, provided there is a regional value content of not less than 70 percent under the net cost method' PRINT ODDITIES: (B) 'provided there is regional value content' (missing 'a'); (C) ends without a period — as printed, flagged for audit. NOTE: the printed block continues with '(D) For any other good of subheading 8708.92:' introducing lettered (E)-(G) branches — the 'any other good' rule (normally numbered 43) is printed INSIDE rule 42's lettering; transcribed in trans-87-8708-92-other with the printed structure flagged." + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-92-other",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.92 (any other use)",
    label: "Silencers/mufflers and exhaust pipes (8708.92) — any other use: branches (D)-(G) of rule 42's letter sequence, at 50 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to silencers (mufflers) or exhaust pipes of subheading 8708.92 from any other heading; or a change to silencers (mufflers) or exhaust pipes of subheading 8708.92 from any other good of subheading 8708.92, whether or not there is also a change from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 50, condition: "Branch (F)/(G): change from any other good of subheading 8708.92 (whether or not there is also a change from any other heading), or no-change route — RVC not less than 50 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 42 (continued), p. 119): '(D) For any other good of subheading 8708.92: (E) A change to silencers (mufflers) or exhaust pipes of subheading 8708.92 from any other heading; or (F) A change to silencers (mufflers) or exhaust pipes of subheading 8708.92 from any other good of subheading 8708.92, whether or not there is also a change from any other heading, provided there is regional value content of not less than 50 percent under the net cost method; or (G) No change in tariff classification to any other good of subheading 8708.92, provided there is a regional value content of not less than 50 percent under the net cost method' PRINT ODDITIES: the 'any other good' rule that normally prints as its own numbered rule is here embedded as branches (D)-(G) of rule 42's letter sequence; branch (F) again missing 'a' ('provided there is regional value content'); (G) ends without a period — transcribed as printed, flagged for audit.",
    sources: SRC,
  },
  {
    id: "trans-87-8708-93-vehicle",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.93 (passenger vehicle, light truck or heavy truck)",
    label: "Clutches (8708.93) — vehicle use: (A) shift, or (B) from 8708.99 + 70 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to subheading 8708.93 from any other heading; or a change to subheading 8708.93 from subheading 8708.99, whether or not there is also a change from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 70, condition: "Branch (B): change from subheading 8708.99, whether or not there is also a change from any other heading — RVC not less than 70 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 43): '43. For a good of subheading 8708.93 for use in a passenger vehicle, light truck or heavy truck: (A) A change to subheading 8708.93 from any other heading; or (B) A change to subheading 8708.93 from subheading 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 70 percent under the net cost method.' NOTE: the print numbers this as rule 43 (following the embedded 8708.92 block)." + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-93-other",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.93 (any other use)",
    label: "Clutches (8708.93) — any other use: (A) shift, or (B) from 8708.99 + 50 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to subheading 8708.93 from any other heading; or a change to subheading 8708.93 from subheading 8708.99, whether or not there is also a change from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 50, condition: "Branch (B): change from subheading 8708.99, whether or not there is also a change from any other heading — RVC not less than 50 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 44): '44. For any other good of subheading 8708.93: (A) A change to subheading 8708.93 from any other heading; or (B) A change to subheading 8708.93 from subheading 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 50 percent under the net cost method.'" + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-94-pv-lt",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.94 (passenger vehicle or light truck)",
    label: "Steering wheels/columns/boxes (8708.94) — passenger vehicle or light truck use: no-change-only 75 NC",
    ruleBasis: "special",
    tariffShiftRule: "No change in tariff classification to a good of subheading 8708.94 (no-change route).",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 75, condition: "No change in tariff classification to a good of subheading 8708.94 for use in a passenger vehicle or light truck — RVC not less than 75 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 45): '45. For a good of subheading 8708.94 for use in a passenger vehicle or light truck: (A) No change in tariff classification to a good of subheading 8708.94, provided there is a regional value content of not less than 75 percent under the net cost method.' NO-CHANGE-ONLY 75 NC." + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-94-heavy",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.94 (heavy truck)",
    label: "Steering wheels/columns/boxes (8708.94) — heavy truck use: three-branch rule at 70 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to subheading 8708.94 from any other heading; or a change to steering wheels, steering columns or steering boxes of subheading 8708.94 from parts thereof of subheadings 8708.94 or 8708.99, whether or not there is also a change from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 70, condition: "Branch (B)/(C): change from parts thereof of subheadings 8708.94 or 8708.99 (whether or not there is also a change from any other heading), or no-change route to parts of steering wheels/columns/boxes — RVC not less than 70 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 46): '46. For a good of subheading 8708.94 for use in a heavy truck: (A) A change to subheading 8708.94 from any other heading; (B) A change to steering wheels, steering columns or steering boxes of subheading 8708.94 from parts thereof of subheadings 8708.94 or 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 70 percent under the net cost method; or (C) No change in tariff classification to parts of steering wheels, steering columns or steering boxes of subheading 8708.94, provided there is a regional value content of not less than 70 percent under the net cost method.' THREE-BRANCH at 70 NC." + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-94-other",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.94 (any other use)",
    label: "Steering wheels/columns/boxes (8708.94) — any other use: same three-branch rule at 50 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to subheading 8708.94 from any other heading; or a change to steering wheels, steering columns or steering boxes of subheading 8708.94 from parts thereof of subheadings 8708.94 or 8708.99, whether or not there is also a change from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 50, condition: "Branch (B)/(C): change from parts thereof of subheadings 8708.94 or 8708.99 (whether or not there is also a change from any other heading), or no-change route to parts of steering wheels/columns/boxes — RVC not less than 50 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 47): '47. For any other good of subheading 8708.94: (A) A change to subheading 8708.94 from any other heading; (B) A change to steering wheels, steering columns or steering boxes of subheading 8708.94 from parts thereof of subheadings 8708.94 or 8708.99, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 50 percent under the net cost method; or (C) No change in tariff classification to parts of steering wheels, steering columns or steering boxes of subheading 8708.94, provided there is a regional value content of not less than 50 percent under the net cost method.' Same three-branch structure at 50 NC.",
    sources: SRC,
  },
  {
    id: "trans-87-8708-95-vehicle",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.95 (passenger vehicle, light truck or heavy truck)",
    label: "Airbags/seat belts (8708.95) — vehicle use: (A) shift, or (B) no-change + 70 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to subheading 8708.95 from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 70, condition: "Branch (B): no change in tariff classification to a good of subheading 8708.95 — RVC not less than 70 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 48): '48. For a good of subheading 8708.95 for use in a passenger vehicle, light truck or heavy truck: (A) A change to subheading 8708.95 from any other heading; or (B) No change in tariff classification to a good of subheading 8708.95, provided there is a regional value content of not less than 70 percent under the net cost method.'" + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-95-other",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.95 (any other use)",
    label: "Airbags/seat belts (8708.95) — any other use: (A) shift, or (B) no-change + 50 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to subheading 8708.95 from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 50, condition: "Branch (B): no change in tariff classification to a good of subheading 8708.95 — RVC not less than 50 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 49): '49. For any other good of subheading 8708.95: (A) A change to subheading 8708.95 from any other heading; or (B) No change in tariff classification to a good of subheading 8708.95, provided there is a regional value content of not less than 50 percent under the net cost method.'" + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-99-chassis-frame-pv-lt",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.99 (chassis frame, passenger vehicle or light truck)",
    label: "Other vehicle parts (8708.99) — chassis frame for passenger vehicle or light truck: no-change-only 75 NC",
    ruleBasis: "special",
    tariffShiftRule: "No change in tariff classification to a good of subheading 8708.99 (no-change route).",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 75, condition: "No change in tariff classification to a chassis frame of subheading 8708.99 for use in a passenger vehicle or light truck — RVC not less than 75 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 50): '50. For a chassis frame of subheading 8708.99 for use in a passenger vehicle or light truck: (A) No change in tariff classification to a good of subheading 8708.99, provided there is a regional value content of not less than 75 percent under the net cost method.' NO-CHANGE-ONLY 75 NC for chassis frames." + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-99-chassis-heavy",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.99 (chassis, heavy truck)",
    label: "Other vehicle parts (8708.99) — chassis for heavy truck: no-change-only 70 NC",
    ruleBasis: "special",
    tariffShiftRule: "No change in tariff classification to a good of subheading 8708.99 (no-change route).",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 70, condition: "No change in tariff classification to a chassis of subheading 8708.99 for use in a heavy truck — RVC not less than 70 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 51): '51. For a chassis of subheading 8708.99 for use in a heavy truck: (A) No change in tariff classification to a good of subheading 8708.99, provided there is a regional value content of not less than 70 percent under the net cost method.' NO-CHANGE-ONLY 70 NC for chassis." + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-99-tariff-items-70",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.99 (heavy truck or passenger vehicle/light truck, other goods)",
    label: "Other vehicle parts (8708.99) — other goods for heavy-truck or passenger-vehicle/light-truck use: tariff-item branches at 70 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to tariff items 8708.99.03, 8708.99.27 or 8708.99.55 from any other subheading; or a change to tariff items 8708.99.06, 8708.99.31 or 8708.99.58 from any other heading, except from subheadings 8482.10 through 8482.80 or tariff items 8482.99.05, 8482.99.15 or 8482.99.25.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 70, condition: "Branches (A)/(C): change to tariff items 8708.99.03/.27/.55 from any other subheading, or to tariff items 8708.99.06/.31/.58 from bearing-class inputs (8482.10-.80, 8482.99.05/.15/.25) whether or not there is also a change from any other heading — RVC not less than 70 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 52): '52. For any other good of subheading 8708.99 for use in a heavy truck or for any other good of subheading 8708.99 for use in a passenger vehicle or light truck: (A) A change to tariff items 8708.99.03, 8708.99.27 or 8708.99.55 from any other subheading, provided there is a regional value content of not less than 70 percent under the net cost method, (B) A change to tariff items 8708.99.06, 8708.99.31 or 8708.99.58 from any other heading, except from subheadings 8482.10 through 8482.80 or tariff items 8482.99.05, 8482.99.15 or 8482.99.25; or (C) A change to tariff items 8708.99.06, 8708.99.31 or 8708.99.58 from subheadings 8482.10 through 8482.80 or tariff items 8482.99.05, 8482.99.15 or 8482.99.25, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 70 percent under the net cost method.' TARIFF-ITEM-LEVEL branches with bearing exceptions at 70 NC. PRINT ODDITIES: (A) ends with a comma; (A) uses 'or' across tariff items (rule 54 uses 'and') — as printed. US TARIFF-ITEM-level rule — requires 8-digit classification data; bearing cross-reference (ch. 84 — machinery file owns those rules; here exception/permission only)." + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-99-residual-70",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.99 (residual 70 NC)",
    label: "Other vehicle parts (8708.99) — residual vehicle-use rule: (A) shift, or (B) no-change + 70 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to subheading 8708.99 from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 70, condition: "Branch (B): no change in tariff classification to a good of subheading 8708.99 — RVC not less than 70 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 53): '53. For any other good of subheading 8708.99: (A) A change to subheading 8708.99 from any other heading; or (B) No change in tariff classification to a good of subheading 8708.99, provided there is a regional value content of not less than 70 percent under the net cost method.'" + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-99-tariff-items-50",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.99 (any other use, tariff-item branches at 50 NC)",
    label: "Other vehicle parts (8708.99) — any other use: tariff-item branches at 50 NC ('and' across items)",
    ruleBasis: "special",
    tariffShiftRule: "A change to tariff items 8708.99.03, 8708.99.27 and 8708.99.55 from any other subheading; or a change to tariff items 8708.99.06, 8708.99.31 and 8708.99.58 from any other heading, except from subheadings 8482.10 through 8482.80 or tariff items 8482.99.05, 8482.99.15 or 8482.99.25.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 50, condition: "Branches (A)/(C): change to tariff items 8708.99.03/.27/.55 from any other subheading, or to tariff items 8708.99.06/.31/.58 from bearing-class inputs (8482.10-.80, 8482.99.05/.15/.25) whether or not there is also a change from any other heading — RVC not less than 50 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 54): '54. For any other good of subheading 8708.99: (A) A change to tariff items 8708.99.03, 8708.99.27 and 8708.99.55 from any other subheading, provided there is a regional value content of not less than 50 percent under the net cost method, (B) A change to tariff items 8708.99.06, 8708.99.31 and 8708.99.58 from any other heading, except from subheadings 8482.10 through 8482.80 or tariff items 8482.99.05, 8482.99.15 or 8482.99.25; or (C) A change to tariff items 8708.99.06, 8708.99.31 and 8708.99.58 from subheadings 8482.10 through 8482.80 or tariff items 8482.99.05, 8482.99.15 or 8482.99.25, whether or not there is also a change from any other heading, provided there is a regional value content of not less than 50 percent under the net cost method.' PRINT ODDITIES: this rule uses 'and' across the tariff items where rule 52 uses 'or'; (A) ends with a comma — as printed, flagged for audit." + AUTO_APPENDIX,
    sources: SRC,
  },
  {
    id: "trans-87-8708-99-residual-50",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8708.99 (residual 50 NC)",
    label: "Other vehicle parts (8708.99) — residual any-other-use rule: (A) shift, or (B) no-change + 50 NC",
    ruleBasis: "special",
    tariffShiftRule: "A change to subheading 8708.99 from any other heading.",
    phases: [{ rvcOptions: [
      { method: "net-cost", thresholdPercent: 50, condition: "Branch (B): no change in tariff classification to a good of subheading 8708.99 — RVC not less than 50 percent under the net cost method" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 55): '55. For any other good of subheading 8708.99: (A) A change to subheading 8708.99 from any other heading; or (B) No change in tariff classification to a good of subheading 8708.99, provided there is a regional value content of not less than 50 percent under the net cost method.'",
    sources: SRC,
  },
  {
    id: "trans-87-8709-11-19",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheadings 8709.11 through 8709.19",
    label: "Works trucks, self-propelled (8709.11–8709.19) — (A) shift, or (B) from 8709.90 + RVC 60/50",
    ruleBasis: "tariff-shift-or-rvc",
    tariffShiftRule: "A change to subheadings 8709.11 through 8709.19 from any other heading.",
    phases: [{ rvcOptions: RVC_60_50 }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 56): '56. (A) A change to subheadings 8709.11 through 8709.19 from any other heading; or (B) A change to subheadings 8709.11 through 8709.19 from subheading 8709.90, whether or not there is also a change from any other heading, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.' Anti-backsliding: 8709.90 works-truck parts cannot shift into finished works trucks without meeting the RVC route.",
    sources: SRC,
  },
  {
    id: "trans-87-8709-90",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8709.90",
    label: "Works truck parts (8709.90) — heading-level shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 8709.90 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 57): '57. A change to subheading 8709.90 from any other heading.'",
    sources: SRC,
  },
  {
    id: "trans-87-8710",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Heading 8710",
    label: "Tanks and armoured vehicles (8710) — heading-level shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 8710 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 58): '58. A change to heading 8710 from any other heading.'",
    sources: SRC,
  },
  {
    id: "trans-87-8711-13",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Headings 8711 through 8713",
    label: "Motorcycles, invalid carriages (8711–8713) — (A) shift except from 8714, or (B) from 8714 + RVC 60/50",
    ruleBasis: "tariff-shift-or-rvc",
    tariffShiftRule: "A change to headings 8711 through 8713 from any other heading, including another heading within that group, except from heading 8714.",
    phases: [{ rvcOptions: RVC_60_50 }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 59): '59. (A) A change to headings 8711 through 8713 from any other heading, including another heading within that group, except from heading 8714; or (B) A change to headings 8711 through 8713 from heading 8714, whether or not there is also a change from any other heading, including another heading within that group, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.' Anti-backsliding: 8714 motorcycle parts cannot shift into finished motorcycles without meeting the RVC route.",
    sources: SRC,
  },
  {
    id: "trans-87-8714-15",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Headings 8714 through 8715",
    label: "Motorcycle parts; baby carriages (8714–8715) — heading-group shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 8714 through 8715 from any other heading, including another heading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 60): '60. A change to headings 8714 through 8715 from any other heading, including another heading within that group.'",
    sources: SRC,
  },
  {
    id: "trans-87-8716-10-80",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheadings 8716.10 through 8716.80",
    label: "Trailers etc. (8716.10–8716.80) — (A) shift, or (B) from 8716.90 + RVC 60/50",
    ruleBasis: "tariff-shift-or-rvc",
    tariffShiftRule: "A change to subheadings 8716.10 through 8716.80 from any other heading.",
    phases: [{ rvcOptions: RVC_60_50 }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 61): '61. (A) A change to subheadings 8716.10 through 8716.80 from any other heading; or (B) A change to subheadings 8716.10 through 8716.80 from subheading 8716.90, whether or not there is also a change from any other heading, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.' Anti-backsliding: 8716.90 trailer parts cannot shift into finished trailers without meeting the RVC route.",
    sources: SRC,
  },
  {
    id: "trans-87-8716-90",
    sector: "transport",
    chapters: ["87"],
    hsRange: "Subheading 8716.90",
    label: "Trailer parts (8716.90) — (A) shift, or (B) no-change + RVC 60/50",
    ruleBasis: "tariff-shift-or-rvc",
    tariffShiftRule: "A change to subheading 8716.90 from any other heading.",
    phases: [{ rvcOptions: RVC_NOSIFT_60_50 }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 87, rule 62): '62. (A) A change to subheading 8716.90 from any other heading; or (B) No change in tariff classification to a good of subheading 8716.90, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.'",
    sources: SRC,
  },

  // ---------------- Chapter 88 (aircraft) ----------------
  {
    id: "trans-88-8801",
    sector: "transport",
    chapters: ["88"],
    hsRange: "Heading 8801",
    label: "Gliders, balloons etc. (8801) — GOOD-LEVEL rule: gliders/hang gliders vs any other good of 8801",
    ruleBasis: "special",
    tariffShiftRule: "A change to gliders or hang gliders of heading 8801 from any other good of heading 8801 or any other heading; or a change to any other good of heading 8801 from gliders or hang gliders of heading 8801 or any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 88, rule 1): '1. (A) A change to gliders or hang gliders of heading 8801 from any other good of heading 8801 or any other heading; or (B) A change to any other good of heading 8801 from gliders or hang gliders of heading 8801 or any other heading.' GOOD-LEVEL rule: intra-heading good-to-good changes can qualify both ways across the gliders/hang-gliders line.",
    sources: SRC,
  },
  {
    id: "trans-88-8802-11-8803-90",
    sector: "transport",
    chapters: ["88"],
    hsRange: "Subheadings 8802.11 through 8803.90",
    label: "Aircraft, spacecraft etc. (8802.11–8803.90) — subheading-group shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 8802.11 through 8803.90 from any other subheading, including another subheading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 88, rule 2): '2. A change to subheadings 8802.11 through 8803.90 from any other subheading, including another subheading within that group.'",
    sources: SRC,
  },
  {
    id: "trans-88-8804-05",
    sector: "transport",
    chapters: ["88"],
    hsRange: "Headings 8804 through 8805",
    label: "Parachutes, aircraft-launching gear (8804–8805) — heading-group shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 8804 through 8805 from any other heading, including another heading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 88, rule 3): '3. A change to headings 8804 through 8805 from any other heading, including another heading within that group.'",
    sources: SRC,
  },

  // ---------------- Chapter 89 (ships and boats) ----------------
  {
    id: "trans-89-8901-02",
    sector: "transport",
    chapters: ["89"],
    hsRange: "Headings 8901 through 8902",
    label: "Cruise ships, cargo vessels etc. (8901–8902) — (A) chapter shift, or (B) intra-ch. 89 change + RVC 60/50",
    ruleBasis: "tariff-shift-or-rvc",
    tariffShiftRule: "A change to headings 8901 through 8902 from any other chapter.",
    phases: [{ rvcOptions: RVC_60_50 }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 89, rule 1): '1. (A) A change to headings 8901 through 8902 from any other chapter; or (B) A change to headings 8901 through 8902 from any other heading within chapter 89, including another heading within that group, whether or not there is also a change from any other chapter, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.'",
    sources: SRC,
  },
  {
    id: "trans-89-8903",
    sector: "transport",
    chapters: ["89"],
    hsRange: "Heading 8903",
    label: "Pleasure boats etc. (8903) — shift AND RVC 60/50 (no alternative shift branch)",
    ruleBasis: "special",
    tariffShiftRule: "A change to heading 8903 from any other heading.",
    phases: [{ rvcOptions: [
      { method: "transaction-value", thresholdPercent: 60, condition: "Shift AND RVC both required — RVC not less than 60 percent by transaction value" },
      { method: "net-cost", thresholdPercent: 50, condition: "Shift AND RVC both required — RVC not less than 50 percent by net cost" },
    ] }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 89, rule 2): '2. A change to heading 8903 from any other heading, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.' SHIFT-AND-RVC (no alternative shift branch) — the only mandatory-RVC rule in ch. 89.",
    sources: SRC,
  },
  {
    id: "trans-89-8904-05",
    sector: "transport",
    chapters: ["89"],
    hsRange: "Headings 8904 through 8905",
    label: "Tugs, warships etc. (8904–8905) — (A) chapter shift, or (B) intra-ch. 89 change + RVC 60/50",
    ruleBasis: "tariff-shift-or-rvc",
    tariffShiftRule: "A change to headings 8904 through 8905 from any other chapter.",
    phases: [{ rvcOptions: RVC_60_50 }],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 89, rule 3): '3. (A) A change to headings 8904 through 8905 from any other chapter; or (B) A change to headings 8904 through 8905 from any other heading within chapter 89, including another heading within that group, whether or not there is also a change from any other chapter, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.'",
    sources: SRC,
  },
  {
    id: "trans-89-8906-08",
    sector: "transport",
    chapters: ["89"],
    hsRange: "Headings 8906 through 8908",
    label: "Other vessels; floating structures (8906–8908) — heading-group shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 8906 through 8908 from any other heading, including another heading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 89, rule 4): '4. A change to headings 8906 through 8908 from any other heading, including another heading within that group.'",
    sources: SRC,
  },
];

export const TRANSPORT_SECTOR_FILE: UsmcaSectorFile = {
  sector: "transport",
  chaptersCovered: ["86", "87", "88", "89"],
  dataAsOf: "2026-09-30",
  mergeEligible: true,
  auditStatus: "human_verified",
  rules: TRANSPORT_RULES,
  watchItems: [
    "REV. 3 STRUCTURAL REBUILD ON THE AUTOMOTIVE/OPTICS TEMPLATE: rev. 2 carried all verbatim GN 11 content but deviated from the record template (generator functions, threshold field naming, rule-number ids, no rules field). Rev. 3 restores the template exactly; verbatim content unchanged from rev. 2 (GN 11(o) pp. 110-123).",
    "TIME-BASED RAIL-STEEL RULES: 8607.11-.12, 8607.29, 8607.91 and 8609 each carry an early window (2020-07-01, simple 60/50 or shift-only) and a from-2023-07-01 steel rule (except headings 7208-7229/7301-7326; 70-PERCENT-BY-WEIGHT originating steel; 70/60 RVC). The 2023 rules are NOW IN FORCE; calculator must route by entry date.",
    "8607.91 DATE INCONSISTENCY IN PRINT: early window prints 'until January 1, 2023' but the paired late window prints 'Beginning on July 1, 2023' — transcribed as printed, flagged for audit.",
    "VEHICLE THRESHOLD MAP (ch. 87): passenger cars 8703 75 NC / other 62.5 NC; light trucks (8704.21/.31) 75 NC / off-road 62.5 NC; heavy trucks (8704.22-.23) 70 NC / off-road 60 NC; 8704.32-.90 REVERSED (off-road 60 NC / other 70 NC); buses 62.5 (15 or fewer) / 60 (16 or more) NC; tractors 60/70/60 NC; snowmobiles 8703.10 60 TV / 50 NC. Parts rules: 70 NC vehicle-use vs 50 NC any-other pattern throughout 8708; chassis frames and body stampings 75 NC; gear boxes/steering/suspension no-change rules 75 NC passenger-light-truck.",
    "AUTOMOTIVE APPENDIX ROUTING: printed rules for 8706-8708.99 designate Automotive Appendix articles by vehicle use (3.2/3.3/3.4, 4.2/4.4, 10.1/10.2); recorded per-rule via the AUTO_APPENDIX annotation. The Appendix articles themselves are owned by the automotive file.",
    "8708.92 PRINT STRUCTURE ODDITY: the 'any other good' rule prints as branches (D)-(G) inside rule 42's letter sequence (not as its own numbered rule); branches (B)/(F) print 'provided there is regional value content' (missing 'a'); (C)/(G) end without a period — all as printed, flagged for audit.",
    "8708.99.03/.27/.55 vs .06/.31/.58 tariff-item branches: rule 52 prints 'or' across items where rule 54 prints 'and' — as printed, flagged for audit. These are US 8-digit tariff-item-level rules; the calculator must capture 8-digit classification data.",
    "GN 11(k) automotive thresholds remain owned by the automotive sector file; de minimis (GN 11(e)) and the GN 11(b)(iv) fallback remain owned by the core types file — not restated here.",
    "USMCA joint review (around 2026) may revise rules of origin — re-verify against the current HTSUS GN 11 revision before relying on this file for new claim periods.",
  ],
  sourceFirewall: {
    treatyBaseline: "USMCA (2020) Chapter 4 / Annex 4-B, Chapters 86-89 (treaty text identical in substance); Automotive Appendix governs ch. 87 vehicle-use rules",
    usImplementation: "HTSUS General Note 11 (2026 Rev. 15), subdivision (o), Chapters 86-89 — the operative US implementation",
    excludedAgreements: [
      "NAFTA (1994) — GN 12 rules differ; never backfill",
      "KORUS, CAFTA-DR and other FTAs with transport-equipment rules — never backfill",
      "GN 11(k) automotive thresholds (owned by the automotive file; here only Automotive Appendix routing is recorded)",
      "Headings 7208-7229 / 7301-7326 (steel, ch. 72/73), 8482.10-.80 / 8482.99 tariff items (bearings, ch. 84) rules (own files; here exceptions/permissions only)",
      "Chapters 84-85 (machinery), 90-92 (optics) and 93+ product rules (own files)",
    ],
  },
};

export default TRANSPORT_SECTOR_FILE;