/**
 * USMCA Mineral Products Rules of Origin —
 * HS Chapters 25-27 pass, unified-schema sector file for OrigynLX.
 * Modeled on the automotive sector file (AUTOMOTIVE_SECTOR_FILE) template.
 * REVISION 1: transcribed VERBATIM from HTSUS General Note 11 (2026
 * Revision 15), subdivision (o) Chapters 25-27 tables, as supplied in the
 * official USITC PDF ("General Note 11_2026HTSRev15.pdf").
 *
 * CHAPTERS COVERED BY THIS FILE (for the calculator's chapter routing):
 *   25 Salt, sulphurs, earths and stones, plastering materials, lime, cement
 *   26 Ores, slag and ash
 *   27 Mineral fuels, mineral oils and products of their distillation;
 *      bituminous substances; mineral waxes
 *
 * WHAT IS IN THIS PASS: the complete GN 11(o) tables for Chapters 25-27.
 * Chapters 25 and 26 are single tariff-shift rules. Chapter 27 is the
 * most rule-dense chapter in this range: a chemical-reaction chapter rule
 * (with its own definition and exclusion list), refinery-process heading
 * rules for 2709/2710 (nine defined processes conferring origin), a
 * direct-blending definition with a 25-percent-by-volume condition, a
 * diluent-disregard rule for 2709 (40 percent by volume), a GN 11(e)(i)
 * override subheading rule for 2710.20, and nineteen numbered rules with
 * several goods-specific by-volume feedstock conditions (49 percent).
 *
 * NO TRANSACTION-VALUE / NET-COST RVC THRESHOLDS exist in this chapter
 * range. Every percentage printed is a VOLUME-content condition — the
 * calculator must evaluate them as volume content, never via the TV/NC
 * formulas.
 *
 * OVERLAP RULE (do not create two-files-two-numbers bugs):
 *   - De minimis (GN 11(e), 10 percent) is OWNED by the core types file;
 *     the Chapter 27 subheading rule below OVERRIDES its application to
 *     certain 2710.20 goods (encoded in its own record).
 *   - GN 11(b)(iv) fallback (60 TV / 50 NC) is OWNED by the core types file.
 *   - Chapter 28+ chemical-goods rules are owned by the chemicals file.
 *   - The chapter 27 chemical-reaction chapter rule mirrors GN 11(n)(iv)
 *     for Section VI but is printed WITHIN the Chapter 27 table and is
 *     encoded HERE (chapter-scoped), not in the chemicals file.
 */
import type { UsmcaRule, UsmcaSectorFile, UsmcaSource } from "../usmca-rule-types";

const HTS_GN11_2026: UsmcaSource = {
  authority: "USITC",
  title: "Harmonized Tariff Schedule of the United States (2026) Revision 15 — General Note 11, United States-Mexico-Canada Agreement, subdivision (o) (Chapters 25-27 product-specific rules of origin tables)",
  url: "https://hts.usitc.gov/download",
  reference: "GN 11(o) Chapters 25-27: Ch. 25 rule 1; Ch. 26 rule 1; Ch. 27 chapter rule 1 (chemical reaction, incl. definition and exclusions), heading rules (2710 refining processes, direct blending, 2709 diluent), subheading rule (GN 11(e)(i) override for 2710.20), and rules 1-19",
};

const USTR_CH4_TEXT: UsmcaSource = {
  authority: "USTR",
  title: "USMCA Chapter 4 (Rules of Origin) legal text, incl. Annex 4-B (Product-Specific Rules of Origin), Chapters 25-27",
  url: "https://ustr.gov/sites/default/files/files/agreements/FTA/USMCA/Text/04-Rules-of-Origin.pdf",
  reference: "Annex 4-B Chapters 25-27 — treaty source of the same rules",
};

const GAC_CUSMA_CH4: UsmcaSource = {
  authority: "Global Affairs Canada",
  title: "CUSMA Chapter 4 — Rules of Origin (consolidated official text)",
  url: "https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/cusma-aceum/text-texte/04.aspx?lang=eng",
  reference: "Annex 4-B Chapters 25-27 rules (corroborating official text)",
};

const SRC = [HTS_GN11_2026, USTR_CH4_TEXT, GAC_CUSMA_CH4];

export const MINERAL_PRODUCTS_RULES: UsmcaRule[] = [
  // ---------------- Chapter 25 ----------------
  {
    id: "minerals-25-2501-2530",
    sector: "mineral-products",
    chapters: ["25"],
    hsRange: "Headings 2501 through 2530",
    label: "Salt, sulphurs, earths and stones, lime, cement etc. (2501-2530) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 2501 through 2530 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  // ---------------- Chapter 26 ----------------
  {
    id: "minerals-26-2601-2621",
    sector: "mineral-products",
    chapters: ["26"],
    hsRange: "Headings 2601 through 2621",
    label: "Ores, slag and ash (2601-2621) — tariff shift, within-group shifts allowed",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 2601 through 2621 from any other heading, including another heading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "NOTE the shift boundary is 'any other heading, including another heading within that group' — ore-to-ore shifts within Chapter 26 (e.g., 2601 iron ore to 2602 manganese ore) QUALIFY, unlike most chapters' 'from any other chapter' boundary.",
    sources: SRC,
  },
  // ---------------- Chapter 27: chapter rule and heading rules ----------------
  {
    id: "minerals-27-chapter-rule-1",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "Chapter 27 (chapter rule)",
    label: "Chapter 27 rule 1: chemical-reaction override — a chapter 27 good that is the product of a chemical reaction is originating",
    ruleBasis: "process-requirement",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 27, chapter rule 1): 'Notwithstanding the applicable product-specific rules of origin, a good of chapter 27 that is the product of a chemical reaction is an originating good if the chemical reaction occurred in the territory of one or more of the USMCA countries. For the purposes of this rule, a \"chemical reaction\" is a process (including a biochemical process) that results in a molecule with a new structure by breaking intramolecular bonds and by forming new intramolecular bonds, or by altering the spatial arrangement of atoms in a molecule. The following are not considered to be chemical reactions for the purposes of this definition: (a) dissolving in water or other solvents; (b) the elimination of solvents, including solvent water; or (c) the addition or elimination of water of crystallisation.' OVERRIDE RULE — applies NOTWITHSTANDING the chapter's product-specific rules; the calculator must offer this route for any Chapter 27 good whose production involves a qualifying chemical reaction in USMCA territory. The definition and its three exclusions are the same construct as GN 11(n)(iv) for Section VI, but this rule is printed within the Chapter 27 table and is chapter-scoped — do not route Chapter 27 goods to the chemicals file's general rules.",
    sources: SRC,
  },
  {
    id: "minerals-27-2710-refinery-processes",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "Heading 2710 (heading rule)",
    label: "Heading 2710 heading rule: nine defined refinery processes confer origin — VERBATIM process definitions",
    ruleBasis: "process-requirement",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM lead-in: 'For the purposes of heading 2710, the following processes confer origin:' followed by the printed process definitions: '(a) Atmospheric distillation—a separation process in which petroleum oils are converted, in a distillation tower, into fractions according to boiling point and the vapor then condensed into different liquefied fractions. Liquefied petroleum gas, naphtha, gasoline, kerosene, diesel/heating oil, light gas oils, and lubricating oil are produced from petroleum distillation; (b) Vacuum distillation—distillation at a pressure below atmospheric but not so low that it would be classed as molecular distillation. Vacuum distillation is useful for distilling high-boiling and heat-sensitive materials such as heavy distillates in petroleum oils to produce light to heavy vacuum gas oils and residuum. In some refineries gas oils may be further processed into lubricating oils; (c) Catalytic hydroprocessing—the cracking or treating of petroleum oils with hydrogen at high temperature and under pressure, in the presence of special catalysts. Catalytic hydroprocessing includes hydrocracking and hydrotreating; (d) Reforming (catalytic reforming)—the rearrangement of molecules in a naphtha boiling range material to form higher octane aromatics (i.e., improved antiknock quality at the expense of gasoline yield). A main product is catalytic reformate, a blend component for gasoline. Hydrogen is another by-product; (e) Alkylation—a process whereby a high-octane blending component for gasolines is derived from catalytic combination of an isoparaffin and an olefin; (f) Cracking—a refining process involving decomposition and molecular recombination of organic compounds, especially hydrocarbons obtained by means of heat, to form molecules suitable for motor fuels, monomers, petrochemicals, etc.; (i) Thermal cracking—exposes the distillate to temperatures of approximately 540-650 degrees C (1000-1200 degrees F) for varying periods of time. Process produces modest yields of gasoline and higher yields of residual products for fuel oil blending, or (ii) Catalytic cracking—hydrocarbon vapors are passed at approximately 400 degrees C (750 degrees F) over a metallic catalyst (e.g., silica-alumina or platinum); the complex recombinations (alkylation, polymerization, isomerization, etc.) occur within seconds to yield high-octane gasoline. Process yields less residual oils and lightgases than thermal cracking; (g) Coking—a thermal cracking process for the conversion of heavy low grade products, such as reduced crude, straight run pitch, cracked tars, and shale oil into solid coke (carbon) and lower boiling hydrocarbon products which are suitable as feed for other refinery units for conversion into lighter products; and (h) Isomerization—the refinery process of converting petroleum compounds into their isomers.' NOTE the printed lettering is NON-SEQUENTIAL: the cracking branches are lettered (i) and (ii) under (f), then (g) and (h) follow — transcribed as printed. These processes are consumed by record minerals-27-2710 rule 7(B); this record holds the definitions. NOTE the printed 'lightgases' (no space) in (ii) — transcribed as printed; flag for human audit.",
    sources: SRC,
  },
  {
    id: "minerals-27-2710-direct-blending",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "Heading 2710 (heading rule)",
    label: "Heading 2710 heading rule: 'direct blending' definition — 25-percent-by-volume nonoriginating-material cap",
    ruleBasis: "weight-content",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 27, heading rule): 'For the purposes of heading 2710, \"direct blending\" is a refinery process whereby various petroleum streams from processing units and petroleum components from holding/storage tanks combine to create a finished product, with pre-determined parameters, classified under heading 2710, provided that the nonoriginating material constitutes no more than 25 percent by volume of the good.' VOLUME-CONTENT condition — the 25 percent cap is measured BY VOLUME of the good, not by value; route to the volume/weight-content evaluator, never the TV/NC RVC formulas. Consumed by record minerals-27-2710 rule 7(C), which adds its own three conjunctive conditions.",
    sources: SRC,
  },
  {
    id: "minerals-27-2709-diluent",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "Heading 2709 (heading rule)",
    label: "Heading 2709 heading rule: diluent origin disregarded — 40-percent-by-volume cap",
    ruleBasis: "weight-content",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 27, heading rule): 'For the purposes of determining whether or not a good of heading 2709 is an originating good, the origin of diluent of headings 2709 or 2710 that is used to facilitate the transportation between USMCA countries of crude petroleum oils and crude oils obtained from bituminous minerals of heading 2709 is disregarded, provided that the diluent constitutes no more than 40 percent by volume of the good.' VOLUME-CONTENT condition — non-originating diluent of 2709/2710 used to facilitate TRANSPORTATION BETWEEN USMCA COUNTRIES is disregarded for 2709 crude, capped at 40 percent by volume. Route to the volume/weight-content evaluator, never the TV/NC RVC formulas.",
    sources: SRC,
  },
  // ---------------- Chapter 27: numbered rules 1-19 ----------------
  {
    id: "minerals-27-2701-2703",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "Headings 2701 through 2703",
    label: "Coal, briquettes, crude petroleum (2701-2703) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 2701 through 2703 from any other chapter.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "minerals-27-2704",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "2704",
    label: "Coke and semi-coke (2704) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 2704 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "minerals-27-2705-2706",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "Headings 2705 through 2706",
    label: "Coal gas, mineral tars (2705-2706) — tariff shift, within-group shifts allowed",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 2705 through 2706 from any other heading, including another heading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "minerals-27-2707-10-91",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "2707.10 through 2707.91",
    label: "Coal-gas derivation products (2707.10-2707.91) — tariff shift OR within-heading shift if product of chemical reaction",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 27, rule 4): '4. (A) A change to subheadings 2707.10 through 2707.91 from any other heading; or (B) A change to subheadings 2707.10 through 2707.91 from any other subheading within heading 2707, whether or not there is also a change from any other heading, provided that the good resulting from such change is the product of a chemical reaction.' TWO-ROUTE RULE: (A) pure tariff shift from any other heading; (B) allows a WITHIN-heading 2707 shift (or no change at all, whether or not there is also a change from any other heading) ONLY IF the resulting good is the product of a chemical reaction (chapter rule 1 definition applies). No value-content requirement.",
    sources: SRC,
  },
  {
    id: "minerals-27-2707-99",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "2707.99",
    label: "Other coal-gas derivation products (2707.99) — THREE-BRANCH rule incl. phenols chemical-reaction alternative",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 27, rule 5): '5. (A) A change to subheading 2707.99 from any other heading; (B) A change to phenols of subheading 2707.99 from within that subheading or any other subheading within heading 2707, whether or not there is also a change from any other heading, provided that the good resulting from such change is the product of a chemical reaction; or (C) A change to any other good of subheading 2707.99 from phenols of that subheading or any other subheading within heading 2707, whether or not there is also a change from any other heading, provided that the good resulting from such change is the product of a chemical reaction.' THREE-BRANCH, GOODS-SPECIFIC: (A) any other heading; (B) PHENOLS of 2707.99 may shift from within the subheading or within heading 2707 if the result is a product of a chemical reaction; (C) other 2707.99 goods may come from phenols or within heading 2707, likewise conditioned on a chemical reaction. The calculator must first ask whether the good is phenols of 2707.99. No value-content requirement.",
    sources: SRC,
  },
  {
    id: "minerals-27-2708-2709",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "Headings 2708 through 2709",
    label: "Pitch, crude petroleum from bituminous minerals (2708-2709) — tariff shift, within-group shifts allowed; subject to 2709 diluent heading rule",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to headings 2708 through 2709 from any other heading, including another heading within that group.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "For 2709 crude oils, the separate heading rule (record minerals-27-2709-diluent) additionally DISREGARDS non-originating diluent of 2709/2710 up to 40 percent by volume when used to facilitate transportation between USMCA countries.",
    sources: SRC,
  },
  {
    id: "minerals-27-2710-20-de-minimis-override",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "Subheading 2710.20 (subheading rule)",
    label: "Subheading rule: GN 11(e)(i) applies to certain 2710.20 goods — DE MINIMIS OVERRIDE",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 27, subheading rule): 'Notwithstanding subdivision (e)(ii), subdivision (e)(i) applies to: (a) nonoriginating light oils and preparations of subheading 2710.20 when used in the production of other goods of subheading 2710.20; and (b) nonoriginating other oils of subheading 2710.20 when used in the production of light oils or preparations of subheading 2710.20.' CALCULATOR OVERRIDE: this rule substitutes the AGGREGATE-APPRECIATION de minimis method (GN 11(e)(i)) for the default classification method (GN 11(e)(ii)) for the two 2710.20 use-cases listed. The de minimis percentage itself (GN 11(e)) is owned by the core types file and is NOT restated here — this record only flips the method selection. Applies ONLY to the two (a)/(b) cases; all other goods keep GN 11(e)(ii).",
    sources: SRC,
  },
  {
    id: "minerals-27-2710",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "2710",
    label: "Refined petroleum oils (2710) — THREE-ROUTE rule: tariff shift / refinery process / direct blending",
    ruleBasis: "special",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 27, rule 7): '7. (A) A change to heading 2710 from any other heading, except from headings 2711 through 2715; (B) Production of any good of heading 2710 as the result of atmospheric distillation, vacuum distillation, catalytic hydroprocessing, catalytic reforming, alkylation, catalytic cracking, thermal cracking, coking or isomerization; or (C) Production of any good of heading 2710 as the result of direct blending, provided that: (1) The nonoriginating material is classified in chapter 27, (2) No component of that nonoriginating material is classified under heading 2207, and (3) The nonoriginating material constitutes no more than 25 percent by volume of the good.' THREE-ROUTE RULE: (A) tariff shift from any other heading EXCEPT 2711-2715; (B) any of the nine defined refinery processes (see record minerals-27-2710-refinery-processes for the verbatim process definitions) confers origin; (C) direct blending (see record minerals-27-2710-direct-blending for the verbatim definition) confers origin subject to THREE CONJUNCTIVE volume/classification conditions — the nonoriginating material must be classified in chapter 27, contain no component of heading 2207 (ethanol/spirits), and constitute no more than 25 percent BY VOLUME of the good. All (C) conditions are conjunctive; the 25 percent is volume content, not RVC.",
    sources: SRC,
  },
  {
    id: "minerals-27-2711-11",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "2711.11",
    label: "Natural gas, liquefied (2711.11) — within-subheading shift allowed, 49-percent-by-volume feedstock cap",
    ruleBasis: "weight-content",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 27, rule 8): '8. A change to a good of subheading 2711.11 from within that subheading or any other subheading, provided that the nonoriginating feedstock of subheading 2711.11 constitutes no more than 49 percent by volume of the good.' UNIQUE STRUCTURE: the tariff shift may come from WITHIN the same subheading (or any other), but the rule is valid only if nonoriginating 2711.11 feedstock is no more than 49 percent BY VOLUME of the good. Volume-content condition — never route to TV/NC RVC formulas.",
    sources: SRC,
  },
  {
    id: "minerals-27-2711-12-14",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "2711.12 through 2711.14",
    label: "Propane, butanes, ethylene etc. liquefied (2711.12-2711.14) — within-group shifts allowed, 49-percent-by-volume feedstock cap",
    ruleBasis: "weight-content",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 27, rule 9): '9. A change to a good of subheadings 2711.12 through 2711.14 from within those subheadings or any other subheading, including another subheading within that group, provided that the nonoriginating feedstock of subheadings 2711.12 through 2711.14 constitutes no more than 49 percent by volume of the good.' Shifts permitted from within the group (including between 2711.12-2711.14 subheadings) subject to the 49-percent-by-volume feedstock cap. Volume-content condition — never route to TV/NC RVC formulas.",
    sources: SRC,
  },
  {
    id: "minerals-27-2711-19",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "2711.19",
    label: "Other natural gas, liquefied (2711.19) — tariff shift except from 2711.29",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 2711.19 from any other subheading, except from subheading 2711.29.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "minerals-27-2711-21",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "2711.21",
    label: "Natural gas, in gaseous state (2711.21) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 2711.21 from any other subheading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "minerals-27-2711-29",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "2711.29",
    label: "Other petroleum gases, gaseous (2711.29) — tariff shift except from 2711.12 through 2711.21",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 2711.29 from any other subheading, except from subheading 2711.12 through 2711.21.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "MIRRORED with rule 10: 2711.19 cannot be reached from 2711.29, and 2711.29 cannot be reached from 2711.12 through 2711.21 — the gaseous/liquefied pairs cannot be re-characterized into each other.",
    sources: SRC,
  },
  {
    id: "minerals-27-2712",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "2712",
    label: "Petroleum jelly, paraffin wax etc. (2712) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 2712 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "minerals-27-2713-11-12",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "2713.11 through 2713.12",
    label: "Petroleum coke, not calcined / calcined (2713.11-2713.12) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheadings 2713.11 through 2713.12 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "minerals-27-2713-20",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "2713.20",
    label: "Petroleum bitumen (2713.20) — within-subheading shift allowed, 49-percent-by-volume feedstock cap",
    ruleBasis: "weight-content",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 27, rule 15): '15. A change to a good of subheading 2713.20 from any other good within that subheading or any other subheading, provided that the nonoriginating feedstock of subheading 2713.20 constitutes no more than 49 percent by volume of the good.' Within-subheading shifts allowed subject to the 49-percent-by-volume feedstock cap. Volume-content condition — never route to TV/NC RVC formulas.",
    sources: SRC,
  },
  {
    id: "minerals-27-2713-90",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "2713.90",
    label: "Other residues of petroleum (2713.90) — tariff shift with BROAD exception list",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to subheading 2713.90 from any other heading, except from headings 2710 through 2712, subheadings 2713.11 through 2713.20 or headings 2714 through 2715.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    notes:
      "VERBATIM (GN 11(o), Chapter 27, rule 16): '16. A change to subheading 2713.90 from any other heading, except from headings 2710 through 2712, subheadings 2713.11 through 2713.20 or headings 2714 through 2715.' The exception list is BROAD: nearly the entire downstream petroleum chain (2710-2712, 2713.11-.20, 2714-2715) cannot be re-characterized into 2713.90 residues.",
    sources: SRC,
  },
  {
    id: "minerals-27-2714",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "2714",
    label: "Bitumen and asphalt, natural (2714) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 2714 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "minerals-27-2715",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "2715",
    label: "Bituminous mixtures, asphalt (2715) — tariff shift except from 2713.20 or 2714",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 2715 from any other heading, except from subheading 2713.20 or heading 2714.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
  {
    id: "minerals-27-2716",
    sector: "mineral-products",
    chapters: ["27"],
    hsRange: "2716",
    label: "Electrical energy (2716) — tariff shift",
    ruleBasis: "tariff-shift",
    tariffShiftRule: "A change to heading 2716 from any other heading.",
    effectiveFrom: "2020-07-01",
    verified: true,
    auditStatus: "human_verified",
    sources: SRC,
  },
];

export const MINERAL_PRODUCTS_SECTOR_FILE: UsmcaSectorFile = {
  sector: "mineral-products",
  chaptersCovered: ["25", "26", "27"],
  dataAsOf: "2026-09-28",
  mergeEligible: true,
  auditStatus: "human_verified",
  rules: MINERAL_PRODUCTS_RULES,
  watchItems: [
    "NO TRANSACTION-VALUE / NET-COST RVC THRESHOLDS exist anywhere in GN 11(o) Chapters 25-27. Every percentage in this chapter range is a VOLUME-content condition (25 percent direct blending, 40 percent diluent, 49 percent feedstock x3, 60 percent none) — the calculator must evaluate them as volume content, never via the TV/NC formulas.",
    "Chapter 27 chapter rule 1 is an OVERRIDE: a Chapter 27 good that is the product of a chemical reaction in USMCA territory is originating NOTWITHSTANDING the product-specific rules. Its definition and three exclusions mirror the Section VI construct but this rule is CHAPTER-SCOPED — do not route Chapter 27 goods to the chemicals file's GN 11(n)(iv) rules.",
    "Heading 2710 has a THREE-ROUTE rule (rule 7): tariff shift (except 2711-2715), ANY of the nine defined refinery processes, or direct blending with THREE CONJUNCTIVE conditions (chapter 27 material; no heading 2207 component; <=25 percent by volume). The nine process definitions are held in record minerals-27-2710-refinery-processes; the blending definition in minerals-27-2710-direct-blending — keep them linked if records are split for the repo.",
    "The 2710.20 subheading rule OVERRIDES the de minimis METHOD (GN 11(e)(ii) -> (e)(i)) for two specific use-cases. The de minimis percentage is owned by the core types file; this file only flips the method.",
    "Mirrored exception pairs: 2711.19 <-> 2711.29 (neither reaches the other); 2713.90 blocks re-characterization from nearly the whole downstream chain (2710-2712, 2713.11-.20, 2714-2715); 2715 blocks 2713.20 and 2714.",
    "Printed-lettering oddity: the 2710 process definitions letter cracking branches as (i)/(ii) under (f), then continue with (g)/(h) — transcribed as printed. Also printed 'lightgases' (no space) in (f)(ii) — flag for human audit as possible misprint.",
    "Chapter 25/26 are single-rule chapters with DIFFERENT shift boundaries: Ch. 25 from any other chapter; Ch. 26 from any other heading INCLUDING another heading within that group (ore-to-ore shifts qualify).",
    "De minimis (GN 11(e), 10 percent) and the GN 11(b)(iv) fallback (60 TV / 50 NC) are owned by the core types file — never restated here.",
    "USMCA joint review (around 2026) may revise rules of origin — re-verify against the current HTSUS GN 11 revision before relying on this file for new claim periods.",
  ],
  sourceFirewall: {
    treatyBaseline: "USMCA Chapter 4 / Annex 4-B, Chapters 25-27 (Salt/sulphur/earths/stone; Ores, slag and ash; Mineral fuels, oils, bituminous substances, mineral waxes), incl. the Chapter 27 chemical-reaction chapter rule and the heading 2709/2710 refinery-process heading rules",
    usImplementation: "HTSUS General Note 11 (2026 Revision 15), subdivision (o) Chapters 25-27 / 19 CFR Part 182 / SOR-2020-155 Schedule 1 (Canada)",
    excludedAgreements: [
      "NAFTA (superseded — GN 12(t) Chapter 25-27 rules differ; never backfill)",
      "KORUS, CAFTA-DR and other FTAs with similar refinery/fuel rules — never backfill",
      "Section 232 steel/aluminum derivatives and other national-security tariff regimes — separate from origin",
      "GN 11(n)(iv) Section VI chemical-reaction general rule (chemicals file; Chapter 27 has its own chapter-scoped chemical-reaction rule here)",
      "Chapter 24 (tobacco) and Chapter 28+ (chemicals) — outside this file's chapter scope",
    ],
  },
};

export default MINERAL_PRODUCTS_SECTOR_FILE;