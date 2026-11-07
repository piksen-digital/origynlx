/**
 * Trade-remedy flags that survive USMCA qualification (P7).
 *
 * USMCA only waives the MFN (Column 1) duty. Section 232 steel and
 * aluminum duties, Section 301 China duties, and AD/CVD orders are
 * separate regimes that a USMCA certification does not touch. This
 * module flags the cases detectable from an HS code and an origin
 * country, at chapter precision, with honest caveats - it is a prompt
 * to verify with a licensed broker, not a determination.
 */

export type RemedySeverity = "critical" | "warning" | "info";

export interface TradeRemedyFlag {
  kind: "232-steel" | "232-aluminum" | "301-china" | "adcvd" | "measure-change";
  severity: RemedySeverity;
  label: string;
  short: string;
  text: string;
}

export interface RemedyCheckInput {
  hsCode: string;
  countryOfOrigin?: string;
}

const STEEL_FLAG: TradeRemedyFlag = {
  kind: "232-steel",
  severity: "critical",
  label: "Section 232 steel: 50% applies even if USMCA-qualifying",
  short: "232 steel 50%",
  text: "Section 232 steel duties stand at 50% and USMCA does not constrain Section 232: a steel good (HS chapters 72-73) pays 232 even when it qualifies as USMCA-originating. Downstream articles on the 232 derivative list can also be caught. Verify the 10-digit HTS against current 232 inclusions and any product-specific exclusions.",
};

const ALUMINUM_FLAG: TradeRemedyFlag = {
  kind: "232-aluminum",
  severity: "critical",
  label: "Section 232 aluminum: 50% applies even if USMCA-qualifying",
  short: "232 aluminum 50%",
  text: "Section 232 aluminum duties stand at 50% and USMCA does not constrain Section 232: an aluminum good (HS chapter 76) pays 232 even when it qualifies as USMCA-originating. Downstream articles on the 232 derivative list can also be caught. Verify the 10-digit HTS against current 232 inclusions and any product-specific exclusions.",
};

const CHINA_FLAG: TradeRemedyFlag = {
  kind: "301-china",
  severity: "warning",
  label: "Section 301 China: 7.5-25% if this good is China-origin",
  short: "301 China 7.5-25%",
  text: "Section 301 duties (7.5-25% across Lists 1-4A) apply to China-origin goods regardless of USMCA planning. If this good qualifies under USMCA and enters from Canada or Mexico, its origin is not China and 301 does not apply to the finished good - but a non-qualifying China-origin import carries 301 on top of the MFN duty.",
};

const ADCVD_FLAG: TradeRemedyFlag = {
  kind: "adcvd",
  severity: "info",
  label: "AD/CVD: antidumping and countervailing orders may stack",
  short: "AD/CVD check",
  text: "Antidumping and countervailing duty orders apply per 8-digit HTS and country and stack on everything above. Check your exact tariff item and origin in the ITA enforcement database at enforce.trade.gov - this tool does not track order scope.",
};

const MEASURE_CHANGE_FLAG: TradeRemedyFlag = {
  kind: "measure-change",
  severity: "info",
  label: "2026 measure turbulence: sectoral measures are moving",
  short: "Measure volatility",
  text: "Sectoral measures have been changing fast in 2026, including new Section 338 duties on selected Canadian goods and recurring 232 list updates. Confirm the current status of any measure with your broker before relying on an estimate.",
};

function normalizeCountry(raw: string | undefined): string {
  return (raw || "").trim().toUpperCase();
}

function isChina(country: string): boolean {
  return country === "CN" || country === "CHINA" || country === "PRC";
}

export function flagTradeRemedies(input: RemedyCheckInput): TradeRemedyFlag[] {
  const digits = (input.hsCode || "").replace(/\D+/g, "");
  const flags: TradeRemedyFlag[] = [];
  if (digits.length >= 2) {
    const chapter = Number(digits.slice(0, 2));
    if (chapter === 72 || chapter === 73) flags.push(STEEL_FLAG);
    if (chapter === 76) flags.push(ALUMINUM_FLAG);
  }
  if (isChina(normalizeCountry(input.countryOfOrigin))) {
    flags.push(CHINA_FLAG);
  }
  if (flags.length > 0) {
    flags.push(ADCVD_FLAG, MEASURE_CHANGE_FLAG);
  }
  return flags;
}

export interface FlaggedLineItem {
  id: string;
  description: string;
  flag: TradeRemedyFlag;
}

/**
 * Components flagged for 232 steel/aluminum chapters. Informational only:
 * Section 232 applies on the import classification of the finished good,
 * not on components the producer sourced abroad - but steel-classified
 * inputs are exactly what brokers examine when a derivative-article list
 * is in play.
 */
export function flagLineItems(
  lineItems: { id: string; description: string; hsCode: string }[]
): FlaggedLineItem[] {
  const out: FlaggedLineItem[] = [];
  for (const item of lineItems) {
    const digits = (item.hsCode || "").replace(/\D+/g, "");
    if (digits.length < 2) continue;
    const chapter = Number(digits.slice(0, 2));
    const description = item.description || "Unnamed component";
    if (chapter === 72 || chapter === 73) out.push({ id: item.id, description, flag: STEEL_FLAG });
    else if (chapter === 76) out.push({ id: item.id, description, flag: ALUMINUM_FLAG });
  }
  return out;
}
