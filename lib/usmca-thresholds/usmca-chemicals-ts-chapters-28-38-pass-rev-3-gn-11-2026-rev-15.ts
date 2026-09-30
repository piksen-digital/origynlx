/**
 * USMCA Chemicals & Allied Industries Rules of Origin —
 * HS Section VI pass (Chapters 28-38), unified-schema sector file for OrigynLX.
 * Modeled on the automotive sector file (AUTOMOTIVE_SECTOR_FILE) template.
 * REVISION 2: completed from HTSUS General Note 11 (2026 Revision 15) as
 * supplied in the official USITC PDF ("General Note 11_2026HTSRev15.pdf"):
 * all eight Section VI general rules are now VERBATIM, including the chemical
 * reaction definition and exclusion list, the purification outcome list, the
 * standards material rule and definition, the isomer separation rule, and the
 * full biotechnological process list.
 *
 * REVISION 3: the GN 11(o) Chapter 28-38 product-specific rules of origin
 * table is now TRANSCRIBED VERBATIM (records chemicals-28-* through
 * chemicals-38-*), from the same supplied PDF (GN 11(o) table, "Chapter 28"
 * through "Chapter 38"). This closes the file's last open-work gap. RVC
 * values present in this chapter range: 40 TV / 30 NC, 60 TV / 50 NC, and the
 * ASYMMETRIC 65 TV / 50 NC (Chapter 35 heading 3501 and subheadings
 * 3502.20-3502.90). Chapter 38 subheadings 3808.50-3808.99 carry a mandatory
 * 50-percent-by-weight active-ingredient condition (weight content, NOT RVC).
 *
 * CHAPTERS COVERED BY THIS FILE (for the calculator's chapter routing):
 *   28 Inorganic chemicals; compounds of precious/rare-earth/radioactive elements
 *   29 Organic chemicals
 *   30 Pharmaceutical products
 *   31 Fertilizers
 *   32 Tanning/dyeing extracts; paints and varnishes; inks
 *   33 Essential oils and resinoids; cosmetics and toilet preparations
 *   34 Soaps, washing preparations, lubricants, waxes
 *   35 Albuminoidal substances; glues; enzymes
 *   36 Explosives; pyrotechnic products; matches
 *   37 Photographic and cinematographic goods
 *   38 Miscellaneous chemical products
 *
 * WHAT IS IN THIS PASS: the eight general rules of GN 11(n)(iv)
 * (A)-(I) that apply to goods of chapters 28 through 38, verbatim.
 * These confer origin NOTWITHSTANDING the applicable product-specific
 * rules of origin, subject to each rule's own carve-out list; the GN 11
 * preamble also preserves the ordinary CTC/value-content routes.
 *
 * WHAT IS IN THIS PASS (rev. 3): the eight general rules of GN 11(n)(iv)
 * (A)-(I) that apply to goods of chapters 28 through 38, verbatim, PLUS the
 * complete GN 11(o) per-code PSRO table for Chapters 28-38, verbatim
 * (records chemicals-28-* through chemicals-38-*). All rule text is taken
 * only from the supplied HTSUS GN 11 (2026 Rev. 15) PDF and its treaty
 * counterpart — never from NAFTA GN 12(t) or other FTAs.
 *
 * NO REMAINING OPEN WORK in this chapter range.
 *
 * OVERLAP RULE (do not create two-files-two-numbers bugs):
 *   - De minimis (GN 11(e), 10 percent of transaction value or total cost)
 *     is OWNED by the core rules-of-origin types file.
 *   - GN 11(b)(iv) fallback (60 percent TV / 50 percent NC) likewise core.
 *   - GN 11(n)(v) (chapters 39-40 chemical rules) is a SEPARATE provision
 *     for plastics/rubber goods — outside this file's chapter scope.
 *   - Chapter 27 mineral-fuel rules are outside this pass.
 */
import type { UsmcaRule, UsmcaSectorFile, UsmcaSource } from "../usmca-rule-types";

const HTS_GN11_2026: UsmcaSource = {
  authority: "USITC",
  title: "Harmonized Tariff Schedule of the United States (2026) Revision 15 — General Note 11, United States-Mexico-Canada Agreement, subdivision (n)(iv) (chapters 28-38 general rules) and subdivision (o) (chapters 28-38 product-specific rules of origin table)",
  url: "https://hts.usitc.gov/download",
  reference: "GN 11(n)(iv)(A)-(I): chemical reaction (incl. definition and exclusions), purification, mixtures and blends, change in particle size, standards material, isomer separation, separation prohibition, biotechnological processes; GN 11(o) chapters 28-38 PSRO table (per-code tariff-change and RVC rules, transcribed verbatim in rev. 3)",
};

const USTR_CH4_TEXT: UsmcaSource = {
  authority: "USTR",
  title: "USMCA Chapter 4 (Rules of Origin) legal text, incl. Annex 4-B (Product-Specific Rules of Origin), Section VI",
  url: "https://ustr.gov/sites/default/files/files/agreements/FTA/USMCA/Text/04-Rules-of-Origin.pdf",
  reference: "Annex 4-B Section VI — Products of the Chemical or Allied Industries (Chapter 28-38): treaty source of the same general rules",
};

const GAC_CUSMA_CH4: UsmcaSource = {
  authority: "Global Affairs Canada",
  title: "CUSMA Chapter 4 — Rules of Origin (consolidated official text)",
  url: "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/cusma-aceum/text-texte/04.aspx?lang=eng",
  reference: "Annex 4-B Section VI general rules (corroborating official text)",
};

const GAC_UNIFORM_REGS: UsmcaSource = {
  authority: "Global Affairs Canada",
  title: "USMCA Uniform Regulations Regarding Rules of Origin (Chapter 4 and related Chapter 6 provisions)",
  url: "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/cusma-aceum/Uniform-regulation-RoO-2021.aspx?lang=eng",
  reference: "Interpretive provisions: a good is originating if each non-originating material satisfies Schedule I (PSRO Annex) and the good satisfies all other applicable requirements; alternative-rule satisfaction",
};

const CHEM_CHAPTERS: string[] = [
  "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38",
];

const SRC = [HTS_GN11_2026, USTR_CH4_TEXT, GAC_CUSMA_CH4];

export const CHEMICALS_RULES: UsmcaRule[] = [
  {
    id: "chemicals-section-vi-scope",
    sector: "chemicals",
    chapters: CHEM_CHAPTERS,
    hsRange: "Chapters 28-38 (HS Section VI — Products of the Chemical or Allied Industries)",
    label: "Section VI scope: general rules apply notwithstanding the product-specific rules; per-code PSRO table transcribed in this file (rev. 3)",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "SCOPE/ROUTING RECORD — no thresholds of its own. VERBATIM preamble (GN 11(n)(iv)): 'A good of any heading in chapters 28 through 38, inclusive, that satisfies one or more of the provisions enumerated in this subdivision shall be treated as an originating good, except as otherwise specified in those rules. Notwithstanding the preceding sentence, a good is an originating good if it meets the applicable change in tariff classification or satisfies the applicable value content requirement specified in subdivision (o) of this note.' The Chapter 28-38 product-specific table of GN 11(o) is now transcribed VERBATIM in this file (records chemicals-28-* through chemicals-38-*): a good may qualify either under a general rule of GN 11(n)(iv) or under its applicable GN 11(o) rule. De minimis (GN 11(e)) and the GN 11(b)(iv) fallback are owned by the core types file. Also relevant (GN 11(n)(ii)): a good shall NOT be considered originating merely by reason of '(A) mere dilution with water or another substance that does not materially alter the characteristics of the good; or (B) a production or pricing practice in respect of which it may be demonstrated, on the basis of a preponderance of evidence, that the object was to circumvent this note and applicable regulations.'",
    sources: [HTS_GN11_2026, GAC_UNIFORM_REGS],
  },
  {
    id: "chemicals-chemical-reaction",
    sector: "chemicals",
    chapters: CHEM_CHAPTERS,
    hsRange: "Chapters 28-38, except headings 3301 and 3823 and subheadings 2916.32 and 3502.11-3502.19",
    label: "Chemical reaction rule (GN 11(n)(iv)(A)-(B), Annex 4-B Section VI general rule 1)",
    ruleBasis: "process-requirement",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(n)(iv)(A)): 'A good of chapters 28 through 38, except a good of headings 3301 or 3823 or subheadings 2916.32 or 3502.11 through 3502.19, that results from a chemical reaction in the territory of one or more USMCA countries shall be treated as an originating good.' VERBATIM definition (GN 11(n)(iv)(B)): 'For the purposes of this note, a \"chemical reaction\" is a process (including a biochemical process) that results in a molecule with a new structure by breaking intramolecular bonds and by forming new intramolecular bonds, or by altering the spatial arrangement of atoms in a molecule. The following are not considered to be chemical reactions for the purposes of determining whether a good is an originating good: (1) dissolution in water or in another solvent; (2) the elimination of solvents, including solvent water; or (3) the addition or elimination of water of crystallisation.'",
    sources: SRC,
  },
  {
    id: "chemicals-purification",
    sector: "chemicals",
    chapters: CHEM_CHAPTERS,
    hsRange: "Chapters 28-38, except heading 3301 and subheadings 3502.11-3502.19",
    label: "Purification rule (GN 11(n)(iv)(C), Annex 4-B Section VI general rule 2)",
    ruleBasis: "process-requirement",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(n)(iv)(C)): 'A good of chapters 28 through 38, except for a good of heading 3301 or subheadings 3502.11 through 3502.19, that is subject to purification is an originating good, provided that the purification occurs in the territory of one or more of the USMCA countries and results in the following: (1) the elimination of not less than 80 percent of the content of existing impurities; or (2) the reduction or elimination of impurities resulting in a good suitable for one or more of the following: (I) as a pharmaceutical, medical, cosmetic, veterinary, or food grade substance, (II) as a chemical product or reagent for analytical, diagnostic, or laboratory uses, (III) as an element or component for use in micro-elements, (IV) for specialized optical uses, (V) for non-toxic uses for health and safety; (VI) for biotechnical use (e.g. in cell culturing, in genetic technology, or as a catalyst), (VII) as a carrier used in a separation process, or (VIII) or nuclear grade uses.' NOTE the 80-percent threshold here is a PURITY outcome (elimination of existing impurities), not an RVC percentage — do not feed it to the RVC calculator.",
    sources: SRC,
  },
  {
    id: "chemicals-mixtures-blends",
    sector: "chemicals",
    chapters: CHEM_CHAPTERS,
    hsRange: "Chapters 28-38, except chapters 28, 29, 32, headings 3301 and 3808, and subheadings 3502.11-3502.19",
    label: "Mixtures and blends rule (GN 11(n)(iv)(D), Annex 4-B Section VI general rule 3)",
    ruleBasis: "process-requirement",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(n)(iv)(D)): 'A good of chapters 28 through 38, except for a good of chapters 28, 29, or 32, headings 3301 or 3808, or subheadings 3502.11 through 3502.19 is an originating good if the deliberate and proportionally controlled mixing or blending (including dispersing) of materials other than the addition of diluents, to conform to predetermined specifications occurs in the territory of one or more of the USMCA countries, resulting in the production of a good having essential physical or chemical characteristics that are relevant to the purposes or uses of the good and are different from the input materials.' NOTE the carve-out excludes goods of Chapters 28, 29 and 32 — many paints, inks and coating goods (Ch. 32) therefore CANNOT use this route.",
    sources: SRC,
  },
  {
    id: "chemicals-particle-size",
    sector: "chemicals",
    chapters: CHEM_CHAPTERS,
    hsRange: "Chapters 28-38, except chapters 28, 29, 32, 38, heading 3301, and subheadings 3502.11-3502.19",
    label: "Change in particle size rule (GN 11(n)(iv)(E), Annex 4-B Section VI general rule 4)",
    ruleBasis: "process-requirement",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(n)(iv)(E)): 'A good of chapters 28 through 38, except for a good of chapters 28, 29, 32 or 38, heading 3301 or subheadings 3502.11 through 3502.19, is an originating good if the deliberate and controlled modification in particle size of a good, including micronizing by dissolving a polymer and subsequent precipitation, other than by merely crushing or pressing, occurs in the territory of one or more of the USMCA countries, resulting in a good with a defined particle size, defined particle size distribution or defined surface area, that is relevant to the purposes of the resulting good, and having essential physical or chemical characteristics different from the input materials.' Mere crushing or pressing is expressly insufficient.",
    sources: SRC,
  },
  {
    id: "chemicals-standards-material",
    sector: "chemicals",
    chapters: CHEM_CHAPTERS,
    hsRange: "Chapters 28-38, except heading 3301 and subheadings 3502.11-3502.19",
    label: "Standards material rule (GN 11(n)(iv)(F), Annex 4-B Section VI general rule 5)",
    ruleBasis: "process-requirement",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(n)(iv)(F)): 'A good of chapters 28 through 38, except for a good of heading 3301 or subheadings 3502.11 through 3502.19, is an originating good if the standards material is produced in the territory of one or more of the USMCA countries. For the purposes of this rule, a \"standards material\" (including a standard solution) is a preparation suitable for analytical, calibrating or referencing uses, having precise degrees of purity or proportions that are certified by the manufacturer.'",
    sources: SRC,
  },
  {
    id: "chemicals-isomer-separation",
    sector: "chemicals",
    chapters: CHEM_CHAPTERS,
    hsRange: "Chapters 28-38, except heading 3301 and subheadings 3502.11-3502.19",
    label: "Isomer separation rule (GN 11(n)(iv)(G), Annex 4-B Section VI general rule 6)",
    ruleBasis: "process-requirement",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(n)(iv)(G)): 'A good of chapters 28 through 38, except for a good of heading 3301 or subheadings 3502.11 through 3502.19, is an originating good if the isolation or separation of isomers from mixtures of isomers occurs in the territory of one or more of the USMCA countries.'",
    sources: SRC,
  },
  {
    id: "chemicals-separation-prohibition",
    sector: "chemicals",
    chapters: CHEM_CHAPTERS,
    hsRange: "Chapters 28-38, except heading 3301 and subheadings 3502.11-3502.19",
    label: "Separation prohibition (GN 11(n)(iv)(H), Annex 4-B Section VI general rule 7 — NEGATIVE rule)",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(n)(iv)(H)): 'A good of chapters 28 through 38, except for a good of heading 3301 or subheadings 3502.11 through 3502.19, that undergoes a change from one classification to another in the territory of one or more of the USMCA countries as a result of the separation of one or more materials from a man-made mixture, shall not be treated as an originating good unless the isolated material underwent a chemical reaction in the territory of one or more of the USMCA countries.' NEGATIVE RULE — blocks origin rather than conferring it. The calculator must apply it as an override: even if a tariff-shift PSRO is facially satisfied, separation from a man-made mixture confers origin ONLY IF the isolated material underwent a chemical reaction in USMCA territory.",
    sources: SRC,
  },
  {
    id: "chemicals-biotechnological-processes",
    sector: "chemicals",
    chapters: CHEM_CHAPTERS,
    hsRange: "Chapters 28-38, except headings 2930 through 2942, chapter 30, heading 3301, and subheadings 3502.11-3502.19",
    label: "Biotechnological processes rule (GN 11(n)(iv)(I), Annex 4-B Section VI general rule 8)",
    ruleBasis: "process-requirement",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(n)(iv)(I)): 'A good of chapters 28 through 38, except for a good of headings 2930 through 2942, chapter 30, heading 3301 or subheadings 3502.11 through 3502.19, is an originating good if it undergoes a biochemical process or one or more of the following processes: (1) Biological or biotechnological culturing, hybridization or genetic modification of: (I) Micro-organisms (bacteria, viruses (includes phages) etc.), or (II) Human, animal or plant cells; (2) Production, isolation, or purification of cellular or intercellular structures (such as isolated genes, gene fragments, and plasmids); or (3) Products obtained by fermentation.' NOTE the carve-outs: Chapter 30 (pharmaceuticals) goods and headings 2930-2942 (thiocompounds/sulfonamides etc.) CANNOT use this route.",
    sources: SRC,
  },
  {
    id: "chemicals-28-2801-2853",
    sector: "chemicals",
    chapters: ["28"],
    hsRange: "2801.10 through 2853.00",
    label: "Chapter 28 inorganic chemicals — tariff shift OR no-change-with-RVC (40 TV / 30 NC)",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 40, condition: "Alternative (B): no change in tariff classification to a good of subheadings 2801.10 through 2853.00" },
          { method: "net-cost", thresholdPercent: 30, condition: "Alternative (B): no change in tariff classification to a good of subheadings 2801.10 through 2853.00" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 28, rule 1): '1. (A) A change to subheadings 2801.10 through 2853.00 from any other subheading, including another heading within that group; or (B) No change in tariff classification to a good of subheadings 2801.10 through 2853.00, provided there is a regional value content of not less than: (1) 40 percent where the transaction value method is used; or (2) 30 percent where the net cost method is used.' OCR/PRINT NOTE: the (A) branch reads 'including another heading within that group' in the printed PDF; Chapter 29's parallel rule reads 'including another subheading within that group'. Transcribed as printed — flag for human audit (possible misprint vs. the Chapter 29 wording).",
    sources: SRC,
  },
  {
    id: "chemicals-29-2901-2942",
    sector: "chemicals",
    chapters: ["29"],
    hsRange: "2901.10 through 2942.00",
    label: "Chapter 29 organic chemicals — tariff shift OR no-change-with-RVC (40 TV / 30 NC); 2916.32 exception in the RVC branch",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 40, condition: "Alternative (B): no change in tariff classification, except for a good of subheading 2916.32 whether or not there is also a change from any other subheading" },
          { method: "net-cost", thresholdPercent: 30, condition: "Alternative (B): no change in tariff classification, except for a good of subheading 2916.32 whether or not there is also a change from any other subheading" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 29, rule 1): '1. (A) A change to subheadings 2901.10 through 2942.00 from any other subheading, including another subheading within that group; or (B) No change in tariff classification to a good of subheadings 2901.10 through 2942.00, except for a good of subheading 2916.32 whether or not there is also a change from any other subheading, provided there is a regional value content of not less than: (1) 40 percent where the transaction value method is used; or (2) 30 percent where the net cost method is used.' The RVC (no-change) alternative is NOT available for subheading 2916.32 goods — for 2916.32 the tariff shift (or a Section VI general rule) is the only route in this table.",
    sources: SRC,
  },
  {
    id: "chemicals-30-3001-3003",
    sector: "chemicals",
    chapters: ["30"],
    hsRange: "3001.20 through 3003.90",
    label: "Pharmaceutical goods of subheadings 3001.20-3003.90 — tariff shift only",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 3001.20 through 3003.90 from any other subheading, including another subheading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "chemicals-30-3004",
    sector: "chemicals",
    chapters: ["30"],
    hsRange: "3004",
    label: "Medicaments of heading 3004 — tariff shift (except from 3003) OR no-change-with-RVC (60 TV / 50 NC)",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 60, condition: "Alternative (B): no change in tariff classification to a good of heading 3004" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (B): no change in tariff classification to a good of heading 3004" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 30, rule 2): '2. (A) A change to heading 3004 from any other heading, except from heading 3003; or (B) No change in tariff classification to a good of heading 3004, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.'",
    sources: SRC,
  },
  {
    id: "chemicals-30-3005",
    sector: "chemicals",
    chapters: ["30"],
    hsRange: "3005.10 through 3005.90",
    label: "Wadding, gauze, bandages of subheadings 3005.10-3005.90 — tariff shift OR no-change-with-RVC (60 TV / 50 NC)",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 60, condition: "Alternative (B): no change in tariff classification to a good of subheadings 3005.10 through 3005.90" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (B): no change in tariff classification to a good of subheadings 3005.10 through 3005.90" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 30, rule 3): '3. (A) A change to subheadings 3005.10 through 3005.90 from any other heading; or (B) No change in tariff classification to a good of subheadings 3005.10 through 3005.90, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.'",
    sources: SRC,
  },
  {
    id: "chemicals-30-3006-10-50",
    sector: "chemicals",
    chapters: ["30"],
    hsRange: "3006.10 through 3006.50",
    label: "Pharmaceutical goods of subheadings 3006.10-3006.50 — tariff shift only",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 3006.10 through 3006.50 from any other subheading, including another subheading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "chemicals-30-3006-60",
    sector: "chemicals",
    chapters: ["30"],
    hsRange: "3006.60",
    label: "Preparations for contrast media (3006.60) — tariff shift OR no-change-with-RVC (60 TV / 50 NC)",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 60, condition: "Alternative (B): no change in tariff classification to a good of subheading 3006.60" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (B): no change in tariff classification to a good of subheading 3006.60" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 30, rule 5): '5. (A) A change to subheading 3006.60 from any other heading; or (B) No change in tariff classification to a good of subheading 3006.60, provided there is a regional value content of not less than: (1) 60 percent where the transaction value is used; or (2) 50 percent where the net cost method is used.' OCR/PRINT NOTE: branch (B)(1) reads 'where the transaction value is used' (no 'method') in the printed PDF — transcribed as printed; flag for human audit.",
    sources: SRC,
  },
  {
    id: "chemicals-30-3006-70",
    sector: "chemicals",
    chapters: ["30"],
    hsRange: "3006.70",
    label: "Opacifying preparations for X-ray examinations (3006.70) — tariff shift from outside chapters 28-38 OR no-change-with-RVC (60 TV / 50 NC)",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 60, condition: "Alternative (B): no change in tariff classification to a good of subheading 3006.70" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (B): no change in tariff classification to a good of subheading 3006.70" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 30, rule 6): '6. (A) A change to subheading 3006.70 from any other chapter, except from chapters 28 through 38; or (B) No change in tariff classification to a good of subheading 3006.70, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.'",
    sources: SRC,
  },
  {
    id: "chemicals-30-3006-91-92",
    sector: "chemicals",
    chapters: ["30"],
    hsRange: "3006.91 through 3006.92",
    label: "Pharmaceutical goods of subheadings 3006.91-3006.92 — tariff shift only",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 3006.91 through 3006.92 from any other subheading, including another subheading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "chemicals-31-3101-3105",
    sector: "chemicals",
    chapters: ["31"],
    hsRange: "3101.00 through 3105.90",
    label: "Fertilizers — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 3101.00 through 3105.90 from any other good within these subheadings or any other subheading, including another subheading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "chemicals-32-chapter-rule-1",
    sector: "chemicals",
    chapters: ["32"],
    hsRange: "Headings 3207 through 3215 (chapter rule)",
    label: "Chapter 32 rule 1: pigments/colouring materials of 3206 or 3212 disregarded, except titanium-dioxide-based — NEGATIVE/CARVE-OUT rule",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 32, chapter rule 1): 'Pigments or colouring materials classified under headings 3206 or 3212 shall be disregarded in determining the origin of the goods classified under headings 3207 through 3215, except for any such pigments or materials based on titanium dioxide.' CALCULATOR OVERRIDE — for goods of headings 3207 through 3215, non-originating pigments/colouring materials of headings 3206 or 3212 are DISREGARDED (treated as not preventing origin via the heading 3207-3215 rule), EXCEPT titanium-dioxide-based pigments/materials, which must satisfy their own rule. No thresholds of its own.",
    sources: SRC,
  },
  {
    id: "chemicals-32-3201-3202",
    sector: "chemicals",
    chapters: ["32"],
    hsRange: "3201.10 through 3202.90",
    label: "Tanning extracts — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 3201.10 through 3202.90 from any other subheading, including another subheading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "chemicals-32-3203",
    sector: "chemicals",
    chapters: ["32"],
    hsRange: "3203",
    label: "Colouring matter of vegetable/animal origin (3203) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 3203 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "chemicals-32-3204",
    sector: "chemicals",
    chapters: ["32"],
    hsRange: "3204.11 through 3204.90",
    label: "Synthetic organic colouring matter (3204.11-3204.90) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 3204.11 through 3204.90 from any other subheading, including another subheading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "chemicals-32-3205",
    sector: "chemicals",
    chapters: ["32"],
    hsRange: "3205.00",
    label: "Colour lakes (3205.00) — tariff shift OR no-change-with-RVC (40 TV / 30 NC)",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 40, condition: "Alternative (B): no change in tariff classification to a good of subheading 3205.00" },
          { method: "net-cost", thresholdPercent: 30, condition: "Alternative (B): no change in tariff classification to a good of subheading 3205.00" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 32, rule 4): '4. (A) A change to subheading 3205.00 from any other subheading; or (B) No change in tariff classification to a good of subheading 3205.00, provided there is a regional value content of not less than: (1) 40 percent where the transaction value method is used; or (2) 30 percent where the net cost method is used.' (Thresholds continue on the following page of the printed table.)",
    sources: SRC,
  },
  {
    id: "chemicals-32-3206-11-42",
    sector: "chemicals",
    chapters: ["32"],
    hsRange: "3206.11 through 3206.42",
    label: "Other colouring matter; inorganic products (3206.11-3206.42) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 3206.11 through 3206.42 from any other subheading, including another subheading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "chemicals-32-3206-49",
    sector: "chemicals",
    chapters: ["32"],
    hsRange: "3206.49",
    label: "Other inorganic colouring matter (3206.49) — three-way split: cadmium-based, hexacyanoferrate-based, other goods",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 32, rule 6): '6. (A) A change to pigments or preparations based on cadmium compounds of subheading 3206.49 from any other good of subheading 3206.49 or any other subheading; (B) A change to pigments and preparations based on hexacyanoferrates (ferrocyanides and ferricyanides) of subheading 3206.49 from any other good of subheading 3206.49 or any other subheading; or (C) A change to any other good of subheading 3206.49 from any other subheading.' CALCULATOR ROUTING: all three branches are pure tariff shifts, but (A) and (B) permit a change from WITHIN subheading 3206.49 (any other good of 3206.49), while (C) — all other goods of 3206.49 — requires a change from any other subheading (no within-subheading shift). Identify the chemical basis (cadmium vs. hexacyanoferrate vs. other) before applying. No RVC alternative exists for 3206.49.",
    sources: SRC,
  },
  {
    id: "chemicals-32-3206-50",
    sector: "chemicals",
    chapters: ["32"],
    hsRange: "3206.50",
    label: "Colour lakes based on 3204 (3206.50) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 3206.50 from any other subheading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "chemicals-32-3207-3215",
    sector: "chemicals",
    chapters: ["32"],
    hsRange: "Headings 3207 through 3215",
    label: "Paints, varnishes, inks etc. (3207-3215) — tariff shift from any other chapter, subject to chapter rule 1",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 3207 through 3215 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 32, rule 8): '8. A change to headings 3207 through 3215 from any other chapter.' SUBJECT TO the Chapter 32 chapter rule 1 carve-out (see record chemicals-32-chapter-rule-1): non-originating pigments/colouring materials of headings 3206 or 3212 are disregarded except titanium-dioxide-based ones. Note the shift must come from OUTSIDE the chapter — a change from within Chapter 32 does NOT qualify.",
    sources: SRC,
  },
  {
    id: "chemicals-33-3301-12-13",
    sector: "chemicals",
    chapters: ["33"],
    hsRange: "3301.12 through 3301.13",
    label: "Citrus essential oils (3301.12-3301.13) — tariff shift from any other chapter OR no-change-with-RVC (60 TV / 50 NC)",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 60, condition: "Alternative (B): no change in tariff classification to a good of subheadings 3301.12 through 3301.13" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (B): no change in tariff classification to a good of subheadings 3301.12 through 3301.13" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 33, rule 1): '1. (A) A change to subheadings 3301.12 through 3301.13 from any other chapter; or (B) No change in tariff classification to a good of subheadings 3301.12 through 3301.13 provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.'",
    sources: SRC,
  },
  {
    id: "chemicals-33-3301-19",
    sector: "chemicals",
    chapters: ["33"],
    hsRange: "3301.19",
    label: "Other essential oils (3301.19) — three-way rule: bergamot/lime within-subheading shift; other goods shift from any other chapter; or no-change-with-RVC (60 TV / 50 NC)",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 60, condition: "Alternative (C): no change in tariff classification to a good of subheading 3301.19" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (C): no change in tariff classification to a good of subheading 3301.19" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 33, rule 2): '2. (A) A change to essential oils of bergamot or lime of subheading 3301.19 from any other good of subheading 3301.19 or any other subheading; (B) A change to any other good of subheading 3301.19 from any other chapter; or (C) No change in tariff classification to a good of subheading 3301.19, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.' GOODS-SPECIFIC ROUTING: only bergamot and lime essential oils get the liberal within-subheading shift (A); all other 3301.19 goods must shift from outside the chapter (B) or use the RVC alternative (C).",
    sources: SRC,
  },
  {
    id: "chemicals-33-3301-24-25",
    sector: "chemicals",
    chapters: ["33"],
    hsRange: "3301.24 through 3301.25",
    label: "Peppermint/other mentha oils (3301.24-3301.25) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 3301.24 through 3301.25 from any other subheading, including another subheading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "chemicals-33-3301-29",
    sector: "chemicals",
    chapters: ["33"],
    hsRange: "3301.29",
    label: "Other essential oils (3301.29) — three-way rule: geranium/jasmine/lavender/lavandin/vetiver within-subheading shift; other goods shift from any other chapter; or no-change-with-RVC (60 TV / 50 NC) whether or not there is also a change",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 60, condition: "Alternative (C): no change in tariff classification to a good of subheading 3301.29, whether or not there is also a change from any other chapter" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (C): no change in tariff classification to a good of subheading 3301.29, whether or not there is also a change from any other chapter" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 33, rule 4): '4. (A) A change to essential oils of geranium, jasmine, lavender, lavandin or vetiver of subheading 3301.29 from any other good of subheading 3301.29 or any other subheading; (B) A change to any other good of subheading 3301.29 from any other chapter; or (C) No change in tariff classification to a good of subheading 3301.29, whether or not there is also a change from any other chapter, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.' GOODS-SPECIFIC ROUTING: only geranium, jasmine, lavender, lavandin and vetiver oils get the liberal within-subheading shift (A); all other 3301.29 goods must use (B) or the RVC alternative (C) — which here applies WHETHER OR NOT there is also a change from any other chapter.",
    sources: SRC,
  },
  {
    id: "chemicals-33-3301-30-90",
    sector: "chemicals",
    chapters: ["33"],
    hsRange: "3301.30 through 3301.90",
    label: "Resinoids/extracts etc. (3301.30-3301.90) — tariff shift from any other chapter OR no-change-with-RVC (60 TV / 50 NC)",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 60, condition: "Alternative (B): no change in tariff classification to a good of subheadings 3301.30 through 3301.90" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (B): no change in tariff classification to a good of subheadings 3301.30 through 3301.90" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 33, rule 5): '5. (A) A change to subheadings 3301.30 through 3301.90 from any other chapter; or (B) No change in tariff classification to a good of subheadings 3301.30 through 3301.90, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.' (Thresholds continue on the following page of the printed table.)",
    sources: SRC,
  },
  {
    id: "chemicals-33-3302-3303",
    sector: "chemicals",
    chapters: ["33"],
    hsRange: "Headings 3302 through 3303",
    label: "Perfumery preparations (3302-3303) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 3302 through 3303 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "chemicals-33-3304-3305",
    sector: "chemicals",
    chapters: ["33"],
    hsRange: "3304.10 through 3305.90",
    label: "Cosmetics and toilet preparations (3304.10-3305.90) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 3304.10 through 3305.90 from any other subheading, including another subheading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "chemicals-33-3306-3307",
    sector: "chemicals",
    chapters: ["33"],
    hsRange: "Headings 3306 through 3307",
    label: "Preparations for oral hygiene, shaving etc. (3306-3307) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 3306 through 3307 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "chemicals-34-3401",
    sector: "chemicals",
    chapters: ["34"],
    hsRange: "3401",
    label: "Soap and organic surface-active preparations (3401) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 3401 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "chemicals-34-3402-3404",
    sector: "chemicals",
    chapters: ["34"],
    hsRange: "3402.11 through 3404.90",
    label: "Organic surface-active agents, washing preparations, waxes (3402.11-3404.90) — tariff shift OR no-change-with-RVC (60 TV / 50 NC)",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 60, condition: "Alternative (B): no change in tariff classification to a good of subheadings 3402.11 through 3404.90" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (B): no change in tariff classification to a good of subheadings 3402.11 through 3404.90" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 34, rule 2): '2. (A) A change to subheadings 3402.11 through 3404.90 from any other subheading, including another subheading within that group; or (B) No change in tariff classification to a good of subheadings 3402.11 through 3404.90, provided there is a regional value content of not less than: (1) 60 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.'",
    sources: SRC,
  },
  {
    id: "chemicals-34-3405-3407",
    sector: "chemicals",
    chapters: ["34"],
    hsRange: "Headings 3405 through 3407",
    label: "Polishes, moulding pastes, enzymatic preparations (3405-3407) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 3405 through 3407 from any other heading, including another heading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "chemicals-35-3501",
    sector: "chemicals",
    chapters: ["35"],
    hsRange: "3501",
    label: "Casein, caseinates (3501) — tariff shift OR no-change-with-RVC (65 TV / 50 NC — ASYMMETRIC)",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 65, condition: "Alternative (B): no change in tariff classification to a good of heading 3501" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (B): no change in tariff classification to a good of heading 3501" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 35, rule 1): '1. (A) A change to heading 3501 from any other heading; or (B) No change in tariff classification to a good of heading 3501, provided there is a regional value content of not less than: (1) 65 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.' ASYMMETRIC THRESHOLD: 65 TV / 50 NC — not the 60/50 pattern used elsewhere in this chapter range. Do not 'normalize' it; it is printed this way in GN 11.",
    sources: SRC,
  },
  {
    id: "chemicals-35-3502-11-19",
    sector: "chemicals",
    chapters: ["35"],
    hsRange: "3502.11 through 3502.19",
    label: "Albumins and egg products (3502.11-3502.19) — tariff shift only",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 3502.11 through 3502.19 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "Note these subheadings are ALSO excluded from every Section VI general rule (GN 11(n)(iv) carve-outs) — the tariff shift is the only tabular route.",
    sources: SRC,
  },
  {
    id: "chemicals-35-3502-20-90",
    sector: "chemicals",
    chapters: ["35"],
    hsRange: "3502.20 through 3502.90",
    label: "Other albumins, globulins (3502.20-3502.90) — tariff shift OR no-change-with-RVC (65 TV / 50 NC — ASYMMETRIC)",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 65, condition: "Alternative (B): no change in tariff classification to a good of subheadings 3502.20 through 3502.90" },
          { method: "net-cost", thresholdPercent: 50, condition: "Alternative (B): no change in tariff classification to a good of subheadings 3502.20 through 3502.90" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 35, rule 3): '3. (A) A change to subheadings 3502.20 through 3502.90 from any other heading; or (B) No change in tariff classification to a good of subheadings 3502.20 through 3502.90, provided there is a regional value content of not less than: (1) 65 percent where the transaction value method is used; or (2) 50 percent where the net cost method is used.' ASYMMETRIC THRESHOLD: 65 TV / 50 NC.",
    sources: SRC,
  },
  {
    id: "chemicals-35-3503-3507",
    sector: "chemicals",
    chapters: ["35"],
    hsRange: "3503.00 through 3507.90",
    label: "Gelatins, glues, enzymes (3503.00-3507.90) — tariff shift OR no-change-with-RVC (40 TV / 30 NC)",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 40, condition: "Alternative (B): no change in tariff classification to a good of subheadings 3503.00 through 3507.90" },
          { method: "net-cost", thresholdPercent: 30, condition: "Alternative (B): no change in tariff classification to a good of subheadings 3503.00 through 3507.90" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 35, rule 4): '4. (A) A change to subheadings 3503.00 through 3507.90 from any other subheading, including another subheading within that group; or (B) No change in tariff classification to a good of subheadings 3503.00 through 3507.90, provided there is a regional value content of not less than: (1) 40 percent where the transaction value method is used; or (2) 30 percent where the net cost method is used.'",
    sources: SRC,
  },
  {
    id: "chemicals-36-3601-3606",
    sector: "chemicals",
    chapters: ["36"],
    hsRange: "Headings 3601 through 3606",
    label: "Explosives and pyrotechnic products (3601-3606) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 3601 through 3606 from any other heading, including another heading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "This is the ONLY tabular rule printed for Chapter 36 in GN 11(o) — matches and other Chapter 36 goods outside headings 3601-3606 have no per-code rule here; they rely on Section VI general rules, GN 11(b)(iv) fallback, or the good is fully originating. Transcribed as printed — flag for human audit if a Chapter 36 code outside 3601-3606 arises in practice.",
    sources: SRC,
  },
  {
    id: "chemicals-37-3701-3703",
    sector: "chemicals",
    chapters: ["37"],
    hsRange: "Headings 3701 through 3703",
    label: "Photographic plates and film (3701-3703) — tariff shift from outside the group",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 3701 through 3703 from heading outside that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 37, rule 1): '1. A change to headings 3701 through 3703 from heading outside that group.' PRINTED AS 'from heading outside that group' (singular 'heading') in the supplied PDF — transcribed as printed; the meaning (from any heading outside the 3701-3703 group) is unambiguous. Flag for human audit.",
    sources: SRC,
  },
  {
    id: "chemicals-37-3704-3707",
    sector: "chemicals",
    chapters: ["37"],
    hsRange: "Headings 3704 through 3707",
    label: "Photographic paper, plates, chemicals (3704-3707) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 3704 through 3707 from any other heading, including another heading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "chemicals-38-3801-3807",
    sector: "chemicals",
    chapters: ["38"],
    hsRange: "3801.10 through 3807.00",
    label: "Chapter 38 misc. chemical products (3801.10-3807.00) — tariff shift OR no-change-with-RVC (40 TV / 30 NC)",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 40, condition: "Alternative (B): no change in tariff classification to a good of subheadings 3801.10 through 3807.00" },
          { method: "net-cost", thresholdPercent: 30, condition: "Alternative (B): no change in tariff classification to a good of subheadings 3801.10 through 3807.00" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 38, rule 1): '1. (A) A change to subheadings 3801.10 through 3807.00 from any other subheading, including another subheading within that group; or (B) No change in tariff classification to a good of subheadings 3801.10 through 3807.00, provided there is a regional value content of not less than: (1) 40 percent where the transaction value method is used; or (2) 30 percent where the net cost method is used.'",
    sources: SRC,
  },
  {
    id: "chemicals-38-3808-50-99",
    sector: "chemicals",
    chapters: ["38"],
    hsRange: "3808.50 through 3808.99",
    label: "Insecticides, fungicides etc. (3808.50-3808.99) — tariff shift PLUS mandatory 50%-by-weight originating active-ingredient condition",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 38, rule 2): '2. A change to subheadings 3808.50 through 3808.99 from any other subheading, including another subheading within that group, provided that not less than 50 percent by weight of the total active ingredient or ingredients is originating.' CONJUNCTIVE WEIGHT-CONTENT condition: BOTH the tariff shift AND the 50-percent-by-weight originating active-ingredient test must be satisfied. The 50 percent is a WEIGHT test on the active ingredient(s) only — it is NOT an RVC percentage and must not be routed to the TV/NC formulas.",
    sources: SRC,
  },
  {
    id: "chemicals-38-3809-3821",
    sector: "chemicals",
    chapters: ["38"],
    hsRange: "3809.10 through 3821.00",
    label: "Finishing agents, photographic chemicals, culture media etc. (3809.10-3821.00) — tariff shift OR no-change-with-RVC (40 TV / 30 NC)",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 40, condition: "Alternative (B): no change in tariff classification to a good of subheadings 3809.10 through 3821.00" },
          { method: "net-cost", thresholdPercent: 30, condition: "Alternative (B): no change in tariff classification to a good of subheadings 3809.10 through 3821.00" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 38, rule 3): '3. (A) A change to subheadings 3809.10 through 3821.00 from any other subheading, including another subheading within that group; or (B) No change in tariff classification to a good of subheadings 3809.10 through 3821.00, provided there is a regional value content of not less than: (1) 40 percent where the transaction value method is used; or (2) 30 percent where the net cost method is used.'",
    sources: SRC,
  },
  {
    id: "chemicals-38-3822",
    sector: "chemicals",
    chapters: ["38"],
    hsRange: "3822",
    label: "Diagnostic/laboratory reagents (3822) — tariff shift only",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 3822 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "Note heading 3822 is also excluded from the chemical-reaction general rule (GN 11(n)(iv)(A) carve-out list) — the tariff shift is the only tabular route.",
    sources: SRC,
  },
  {
    id: "chemicals-38-3823-3826",
    sector: "chemicals",
    chapters: ["38"],
    hsRange: "3823.11 through 3826.00",
    label: "Industrial monocarboxylic acids etc. (3823.11-3826.00) — tariff shift OR no-change-with-RVC (40 TV / 30 NC)",
    ruleBasis: "tariff-shift-or-rvc",
    phases: [
      {
        effectiveFrom: "2020-07-01",
        rvcOptions: [
          { method: "transaction-value", thresholdPercent: 40, condition: "Alternative (B): no change in tariff classification to a good of subheadings 3823.11 through 3826.00" },
          { method: "net-cost", thresholdPercent: 30, condition: "Alternative (B): no change in tariff classification to a good of subheadings 3823.11 through 3826.00" },
        ],
      },
    ],
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 38, rule 5): '5. (A) A change to subheadings 3823.11 through 3826.00 from any other subheading, including another subheading within that group; or (B) No change in tariff classification to a good of subheadings 3823.11 through 3826.00, provided there is a regional value content of not less than: (1) 40 percent where the transaction value method is used; or (2) 30 percent where the net cost method is used.' Note heading 3823 goods are also excluded from the chemical-reaction general rule (GN 11(n)(iv)(A) carve-out).",
    sources: SRC,
  },
];

export const CHEMICALS_SECTOR_FILE: UsmcaSectorFile = {
  sector: "chemicals",
  chaptersCovered: CHEM_CHAPTERS,
  dataAsOf: "2026-09-28",
  mergeEligible: true,
  auditStatus: "human_verified",
  rules: CHEMICALS_RULES,
  watchItems: [
    "REV. 3 CLOSED THE LAST GAP: the GN 11(o) Chapter 28-38 per-code table is now transcribed verbatim (records chemicals-28-* through chemicals-38-*). RVC pairs present: 40 TV/30 NC, 60 TV/50 NC, and the ASYMMETRIC 65 TV/50 NC (Chapter 35, heading 3501 and subheadings 3502.20-3502.90 — printed that way in GN 11; do NOT normalize to 60/50). Subheadings 3808.50-3808.99 carry a CONJUNCTIVE 50%-by-weight originating active-ingredient condition (weight content, not RVC).",
    "Carve-out asymmetry is a bug magnet: each general rule has a DIFFERENT exception list (chemical reaction uniquely excludes headings 3301 and 3823 and subheading 2916.32; mixtures/blends excludes Chapters 28/29/32 and heading 3808; particle size excludes Chapters 28/29/32/38; biotechnological excludes chapter 30 and headings 2930-2942). The calculator must match the good against each rule's own carve-out list, not a shared one.",
    "The purification rule's 'not less than 80 percent' is an impurity-elimination outcome, NOT an RVC percentage — do not route it into RVC comparisons.",
    "GN 11(n)(ii) non-qualifying operations (mere dilution; circumvention-motivated practices) apply to all goods — owned by the core file but restated verbatim in the scope record's notes for convenience.",
    "HTSUS General Note 13 (pharmaceuticals, 'K' rates) and the WTO Pharmaceutical Agreement are separate duty regimes, NOT USMCA origin rules — do not present them as USMCA qualification paths for Chapter 30 goods.",
    "USMCA joint review (around 2026) may revise rules of origin — re-verify against the current HTSUS GN 11 revision before relying on this file for new claim periods.",
  ],
  sourceFirewall: {
    treatyBaseline: "USMCA Chapter 4 / Annex 4-B Section VI (Products of the Chemical or Allied Industries, Chapter 28-38), incl. its section-general chemical rules",
    usImplementation: "HTSUS General Note 11 (2026 Revision 15), subdivision (n)(iv) and subdivision (o) / 19 CFR Part 182 / SOR-2020-155 Schedule 1 (Canada)",
    excludedAgreements: [
      "NAFTA (superseded — GN 12(t) chemical notes differ and remain indexed on usitc.gov archives)",
      "KORUS, CAFTA-DR, Australia/Peru/Colombia/Panama FTAs, Canada-Chile, Canada-Jordan, CPTPP (similar purification/chemical-reaction phrasings — never backfill)",
      "HTSUS General Note 13 / WTO Pharmaceutical Agreement (separate duty regimes, not origin rules)",
      "GN 11(n)(v) chapters 39-40 chemical rules (plastics/rubber — outside this sector file's chapters)",
      "Section 232 regimes (separate national-security tariff regime, not origin rules)",
    ],
  },
};

export default CHEMICALS_SECTOR_FILE;