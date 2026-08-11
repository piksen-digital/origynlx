/**
 * Reference RVC thresholds by product category.
 *
 * AUTOMOTIVE figures below are corroborated across multiple independent
 * sources including an official USITC report and two law-firm client
 * alerts - see the `sources` array on each entry. These are Net Cost
 * method figures (the method USMCA's automotive text is written around).
 * Sources note the Transaction Value method generally runs about 10
 * percentage points higher for auto parts, but that exact per-category
 * TV figure isn't independently confirmed here, so it's a note, not a
 * number - use the Net Cost method for automotive categories unless you
 * verify the TV figure yourself.
 *
 * The GENERAL entry is explicitly NOT a verified Annex 4-B citation -
 * USMCA has no single universal default threshold, every product line
 * has its own rule. 60%/50% is a commonly-used planning placeholder,
 * kept from this tool's original build. Treat it as a starting point to
 * verify against your product's actual Annex 4-B line, not a citation.
 */

export interface ThresholdSource {
  title: string;
  url: string;
}

export interface ThresholdReference {
  id: string;
  label: string;
  method: "transaction-value" | "net-cost";
  thresholdPercent: number;
  verified: boolean;
  notes?: string;
  sources: ThresholdSource[];
}

export const THRESHOLD_REFERENCES: ThresholdReference[] = [
  {
    id: "general",
    label: "General / not automotive (unverified default)",
    method: "transaction-value",
    thresholdPercent: 60,
    verified: false,
    notes:
      "Not a specific Annex 4-B citation - USMCA has no single universal threshold. Verify your product's actual rule before relying on this.",
    sources: [],
  },
  {
    id: "auto-passenger-light-truck",
    label: "Automotive - Passenger vehicle / light truck",
    method: "net-cost",
    thresholdPercent: 75,
    verified: true,
    notes:
      "Up from 62.5% under NAFTA. Phased in from 66% (2020) to 75% (2023), now fully in effect. Passenger vehicles/light trucks also carry a separate 40%/45% Labor Value Content requirement and a 70% North American steel-and-aluminum purchasing requirement (producer-level, not per-vehicle) - this calculator doesn't check either of those.",
    sources: [
      { title: "USITC - USMCA Automotive Rules of Origin: Economic Impact (official report)", url: "https://www.usitc.gov/publications/332/pub5642.pdf" },
      { title: "White & Case - USMCA Automotive Rules of Origin dispute alert", url: "https://www.whitecase.com/insight-alert/united-states-trade-alert-mexico-requests-consultations-united-states-concerning" },
      { title: "ExFreight - USMCA Rules of Origin guide", url: "https://www.exfreight.com/usmca-rules-of-origin-qualifying-duty-free-trade-guide/" },
    ],
  },
  {
    id: "auto-heavy-truck",
    label: "Automotive - Heavy truck",
    method: "net-cost",
    thresholdPercent: 70,
    verified: true,
    notes: "Lower threshold and longer phase-in than passenger vehicles/light trucks - final compliance level took effect by 2027.",
    sources: [
      { title: "ExFreight - USMCA Rules of Origin guide", url: "https://www.exfreight.com/usmca-rules-of-origin-qualifying-duty-free-trade-guide/" },
      { title: "Coalition for a Prosperous America - USMCA Rules of Origin memo", url: "https://prosperousamerica.org/memo-usmca-rules-of-origin-further-details/" },
    ],
  },
  {
    id: "auto-core-parts",
    label: "Automotive - Core parts (engine, transmission, body, axles, batteries, etc.)",
    method: "net-cost",
    thresholdPercent: 75,
    verified: true,
    notes: "Covers roughly 15 core part categories. Can be met per-part or by averaging across all core parts.",
    sources: [
      { title: "KPMG - USMCA highlights", url: "https://assets.kpmg.com/content/dam/kpmg/mx/pdf/2020/03/USMCA-highlights.pdf" },
      { title: "Porter Wright - Manufacturers: what you need to know about the USMCA", url: "https://www.porterwright.com/media/manufacturers-what-you-need-to-know-about-the-usmca/" },
    ],
  },
  {
    id: "auto-principal-parts",
    label: "Automotive - Principal parts (brakes, tires, seats, fuel system, etc.)",
    method: "net-cost",
    thresholdPercent: 70,
    verified: true,
    notes: "Covers roughly 43 principal part categories.",
    sources: [
      { title: "KPMG - USMCA highlights", url: "https://assets.kpmg.com/content/dam/kpmg/mx/pdf/2020/03/USMCA-highlights.pdf" },
      { title: "Porter Wright - Manufacturers: what you need to know about the USMCA", url: "https://www.porterwright.com/media/manufacturers-what-you-need-to-know-about-the-usmca/" },
    ],
  },
  {
    id: "auto-complementary-parts",
    label: "Automotive - Complementary parts (audio, lighting, wipers, locks, etc.)",
    method: "net-cost",
    thresholdPercent: 65,
    verified: true,
    notes: "Covers roughly 28 complementary part categories.",
    sources: [
      { title: "KPMG - USMCA highlights", url: "https://assets.kpmg.com/content/dam/kpmg/mx/pdf/2020/03/USMCA-highlights.pdf" },
      { title: "Porter Wright - Manufacturers: what you need to know about the USMCA", url: "https://www.porterwright.com/media/manufacturers-what-you-need-to-know-about-the-usmca/" },
    ],
  },
];
