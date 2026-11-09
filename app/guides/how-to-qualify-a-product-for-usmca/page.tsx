import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "How to Qualify a Product for USMCA Preferential Treatment (2026 Guide) | OrigynLX",
  description:
    "Step-by-step USMCA qualification: classify the HS code, find the product-specific rule of origin, calculate Regional Value Content with a worked example, apply the de minimis rule, and certify with the nine required data elements.",
  alternates: { canonical: "/guides/how-to-qualify-a-product-for-usmca", languages: { "en": "/guides/how-to-qualify-a-product-for-usmca", "es": "/es/guides/como-calificar-un-producto-para-el-usmca" } },
  openGraph: {
    title: "How to Qualify a Product for USMCA Preferential Treatment (2026 Guide) | OrigynLX",
    description:
      "Classify, find the rule, run the RVC math, check de minimis, then certify. A practical walkthrough with a worked example.",
    type: "article",
  },
};

type Block = string | { list: string[] };

const SECTIONS: { id: string; heading: string; blocks: Block[] }[] = [
  {
    id: "what-preferential-treatment-means",
    heading: "What USMCA preferential treatment actually means",
    blocks: [
      "The USMCA, called CUSMA in Canada and T-MEC in Mexico, replaced NAFTA in July 2020. Goods that meet its rules of origin are treated as originating in North America and enter with preferential, usually zero, tariffs. Goods that do not must pay the normal MFN tariff, and since March 2025 they can carry more: the IEEPA fentanyl-related duties on Canadian and Mexican goods apply only to goods that do not qualify as USMCA originating, while goods with a supportable origin claim are exempt.",
      "That single fact changed the economics of origin work. A USMCA claim used to save the MFN duty. On sensitive lanes it is now the difference between the normal tariff and the normal tariff plus new surcharges.",
      "The agreement also faces its first scheduled joint review in 2026, six years after entry into force, with a sixteen-year sunset that lands in 2036 unless the parties extend it. The practical consequence: origin determinations are worth re-checking, not filing away.",
    ],
  },
  {
    id: "step-1-hs-code",
    heading: "Step 1: Classify the product with the right HS code",
    blocks: [
      "Every downstream decision hangs on the classification. The product-specific rule of origin is indexed by HS code, so a misclassified product gets the wrong rule, the wrong threshold, and a wrong answer that looks right.",
      "Classify the finished good, not the components, using the general HS interpretation rules, and carry the classification down to the tariff-line level your country requires. When two codes are genuinely arguable, resolve that first, before any RVC math.",
    ],
  },
  {
    id: "step-2-rule",
    heading: "Step 2: Find the product-specific rule of origin",
    blocks: [
      "Chapter 4 of the agreement sets the general criteria, and an annex holds the product-specific rules of origin, listed by HS code. Each rule belongs to one of two families:",
      {
        list: [
          "Tariff shift: every non-originating input must change to a different HS classification as a result of production. Yarn becomes a finished garment; components become a machine.",
          "Regional Value Content: the product must contain at least a set percentage of North American value, tested under the transaction-value or net-cost method.",
        ],
      },
      "Where the annex sets no stricter requirement, the standard thresholds are 60 percent under the transaction-value method and 50 percent under the net-cost method. Many chapters set their own numbers, so never assume the default applies. Look up the exact rule for your code, every time.",
    ],
  },
  {
    id: "step-3-rvc",
    heading: "Step 3: Calculate Regional Value Content",
    blocks: [
      "Under the transaction-value method the formula is RVC = ((TV - VNM) / TV) x 100, where TV is the transaction value of the good and VNM is the value of non-originating materials. The net-cost method has the same shape with net cost in the denominator. The method is not a free choice: some rules mandate one, and the two are not interchangeable.",
      "Worked example. A finished good has a transaction value of 1,000 USD. Its bill of materials contains 350 USD of non-originating materials; everything else counts as originating. RVC = ((1000 - 350) / 1000) x 100 = 65 percent. Against a 60 percent threshold the good qualifies, with five points of headroom.",
      "Two habits keep the math honest. First, an input counts as originating only if it itself qualifies under the rules, not merely because a US, Canadian, or Mexican supplier sold it. Second, track headroom, not just pass or fail: five points of margin survives a supplier price change; half a point does not.",
    ],
  },
  {
    id: "step-4-de-minimis",
    heading: "Step 4: Check de minimis before giving up",
    blocks: [
      "A good that fails its product-specific rule can still qualify under the de minimis exception in Article 4.12 if the value of the non-originating materials that violate the rule is small. For most goods the ceiling is 10 percent of the value of the good, with method-specific rules on how that value is measured.",
      "Because the exact basis differs by method and by rule, treat de minimis as a reason to recompute carefully, not as a free pass. If the numbers sit close to the ceiling, the determination deserves a professional review before anyone certifies it.",
    ],
  },
  {
    id: "step-5-certify",
    heading: "Step 5: Certify and document",
    blocks: [
      "Since July 2020 there is no fixed certificate form. A valid certification is any document containing nine required data elements: identification of the certifier, the exporter, the producer, and the importer, a description and HS code of the goods, the origin criterion relied on, the blanket period if one is used, and the authorized signature and date.",
      {
        list: [
          "The importer, exporter, or producer may certify, but whoever certifies must hold records that support the claim.",
          "A blanket certification can cover multiple shipments of the same goods for up to 12 months, which is why lapse tracking matters.",
          "Supporting records must be kept for at least five years after the relevant entry, per Article 5-C of the agreement and US recordkeeping law (19 U.S.C. 1509).",
          "An unsupported claim is penalty exposure, not a paperwork issue: 19 U.S.C. 1592 reaches negligent and fraudulent origin claims, sometimes years after entry.",
        ],
      },
    ],
  },
  {
    id: "2026-review",
    heading: "The 2026 joint review, and why re-checking matters",
    blocks: [
      "The agreement contains a scheduled joint review that opens in July 2026, six years after entry into force, where the parties can extend, adjust, or reopen parts of the deal, including rules of origin. Review talk has already touched automotive and other threshold-sensitive chapters.",
      "For practitioners the takeaway is procedural, not political: every determination made today should carry a re-verification date, and any blanket certificate renewed during the review window deserves a fresh rules check rather than a signature-and-file renewal.",
    ],
  },
  {
    id: "common-mistakes",
    heading: "Five mistakes that sink USMCA claims",
    blocks: [
      {
        list: [
          "Classifying the finished good by what it looks like instead of the HS interpretation rules, then applying the wrong product-specific rule.",
          "Counting a material as originating because the supplier is American. Origin follows the material, not the invoice address.",
          "Mixing transaction-value and net-cost math in one calculation, or applying the standard threshold when the chapter sets a different one.",
          "Giving up on a fail without testing de minimis first.",
          "Certifying from a spreadsheet nobody can reconstruct. The record, not the signature, is what survives an audit.",
        ],
      },
    ],
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "What are the USMCA rules of origin?",
    a: "The criteria a good must meet to be treated as originating in North America and earn preferential, usually zero, tariffs: a tariff shift, a Regional Value Content threshold, or in some sectors both. The product-specific rules are indexed by HS code in an annex to Chapter 4 of the agreement.",
  },
  {
    q: "What is the difference between the tariff shift and RVC tests?",
    a: "A tariff shift test asks whether production changed the HS classification of every non-originating input. A Regional Value Content test asks what share of the value of the good is North American. The rule for your HS code dictates which applies and at what threshold.",
  },
  {
    q: "What RVC percentage does my product need?",
    a: "It depends on the product-specific rule for the HS code. Where the annex sets no stricter number, the standard thresholds are 60 percent under the transaction-value method and 50 percent under the net-cost method. Many chapters, including automotive, set their own.",
  },
  {
    q: "Is there an official USMCA certificate of origin form?",
    a: "No fixed form has been required since July 2020. A valid certification needs nine data elements in any document format: the certifier, exporter, producer, importer, a description and HS code of the goods, the origin criterion, the blanket period if used, and the authorized signature and date.",
  },
  {
    q: "How long must I keep USMCA records?",
    a: "At least five years after the entry or export concerned, per Article 5-C of the agreement and US recordkeeping law. Records must support the origin claim, including the bill of materials, values, and the math behind the determination.",
  },
];

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://origynlx.vercel.app";
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Qualify a Product for USMCA Preferential Treatment",
  description:
    "A step-by-step guide to USMCA qualification: HS classification, product-specific rules of origin, Regional Value Content with a worked example, de minimis, and the nine certification data elements.",
  author: { "@type": "Organization", name: "OrigynLX", url: SITE },
  publisher: { "@type": "Organization", name: "OrigynLX", url: SITE },
  datePublished: "2026-11-08",
  mainEntityOfPage: SITE + "/guides/how-to-qualify-a-product-for-usmca",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function HowToQualifyGuidePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav />

      <article className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="max-w-3xl">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Guide</span>
            <h1 className="mt-4 text-balance font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
              How to qualify a product for USMCA preferential treatment
            </h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-paper/60 sm:text-lg">
              Preferential treatment means reduced or zero duty on goods that qualify as originating
              in North America. Qualification is not an opinion; it is a rules-based test with a paper
              trail. This guide walks the full process the way CBP and your broker will check it.
            </p>
            <p className="mt-3 text-[13px] text-paper/45">Guide last reviewed November 2026.</p>
          </div>

          <div className="mt-14 lg:grid lg:grid-cols-12 lg:gap-10">
            <nav className="mb-10 lg:col-span-4 lg:mb-0" aria-label="Guide contents">
              <div className="lg:sticky lg:top-28 lg:rounded-card lg:border lg:border-white/12 lg:bg-white/[0.03] lg:p-6">
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">In this guide</p>
                <ul className="mt-4 space-y-2.5">
                  {SECTIONS.map((s) => (
                    <li key={s.id}>
                      <a href={"#" + s.id} className="text-[14px] text-paper/60 underline-offset-4 hover:text-paper hover:underline transition-colors">
                        {s.heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            <div className="lg:col-span-8">
              {SECTIONS.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-white/12 py-10 first:border-t-0 sm:py-12">
                  <h2 className="text-balance font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">{s.heading}</h2>
                  <div className="mt-5 space-y-4">
                    {s.blocks.map((b: Block, i: number) =>
                      typeof b === "string" ? (
                        <p key={i} className="text-pretty text-[15px] leading-relaxed text-paper/65">{b}</p>
                      ) : (
                        <ul key={i} className="space-y-2.5">
                          {b.list.map((item: string) => (
                            <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-paper/65">
                              <span className="mt-1 text-seal" aria-hidden="true">*</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )
                    )}
                  </div>
                </section>
              ))}

              <section id="guide-faq" className="scroll-mt-28 border-t border-white/12 py-10 sm:py-12">
                <h2 className="text-balance font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">USMCA qualification FAQ</h2>
                <div className="mt-6 divide-y divide-white/12 border-t border-b border-white/12">
                  {FAQS.map((f) => (
                    <details key={f.q} className="group py-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left">
                        <span className="font-display text-[17px] leading-snug text-paper">{f.q}</span>
                        <span className="shrink-0 font-display text-xl leading-none text-seal transition-transform duration-200 group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-3 text-[15px] leading-relaxed text-paper/60">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>

              <section className="mt-4 rounded-card border border-seal/30 bg-seal/[0.06] p-8 sm:p-10">
                <h2 className="text-balance font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
                  Run the qualification in minutes, not evenings.
                </h2>
                <p className="mt-4 text-pretty text-[15px] leading-relaxed text-paper/65 sm:text-base">
                  OrigynLX looks up the product-specific rule for your HS code, runs both RVC methods,
                  checks de minimis and trade-remedy exposure, and produces the draft certificate, audit
                  worksheet, and broker package. Twenty-five checks are free every month.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <Link href="/calculator" className="inline-flex items-center justify-center rounded-full bg-seal px-8 py-3 text-sm font-semibold text-ink hover:bg-seal/90 transition-colors">
                    Run a free check
                  </Link>
                  <Link href="/pricing" className="inline-flex items-center justify-center rounded-full border border-paper/20 px-8 py-3 text-sm font-medium text-paper hover:border-paper/40 hover:bg-white/[0.04] transition-colors">
                    View pricing
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </article>

      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  );
}