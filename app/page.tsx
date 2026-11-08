import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProcessSteps from "@/components/ProcessSteps";
import PositioningSection from "@/components/PositioningSection";
import PricingCard from "@/components/PricingCard";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "USMCA Rules of Origin Qualifier and RVC Calculator | OrigynLX",
  description:
    "Qualify products under USMCA in minutes: product-specific rules of origin by HS code, transaction-value and net-cost RVC, de minimis handling, batch qualification for whole catalogs, draft Certificates of Origin and broker packages. 25 free checks a month, no signup.",
  keywords: [
    "USMCA rules of origin",
    "USMCA qualification",
    "regional value content calculator",
    "RVC calculator",
    "certificate of origin USMCA",
    "USMCA compliance software",
    "origin determination tool",
    "customs compliance tool",
    "Section 232 steel aluminum flags",
    "T-MEC reglas de origen",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "USMCA Rules of Origin Qualifier and RVC Calculator | OrigynLX",
    description:
      "Run your BOM against the exact USMCA rule of origin for your HS code. Draft certificates, audit worksheets, batch screening. 25 free checks a month, no signup.",
    url: "https://origynlx.vercel.app",
    siteName: "OrigynLX",
    type: "website",
  },
};

const STAKES: { title: string; body: string }[] = [
  {
    title: "IEEPA fentanyl duties",
    body: "Since March 7, 2025, the fentanyl-related IEEPA duties on Canadian and Mexican imports apply only to goods that do not qualify as USMCA originating. A supportable origin determination exempts your goods from them.",
  },
  {
    title: "Section 232 exposure",
    body: "Steel fasteners under HS 7318 and aluminum goods under HS 7616 carry separate trade-remedy exposure. OrigynLX flags these codes inside your BOM automatically, before your broker finds them at entry.",
  },
  {
    title: "Penalty risk",
    body: "Claiming preference without supportable math risks penalties and retroactive duty demands under 19 U.S.C. 1592, sometimes years after entry. An audit trail beats a guess every time.",
  },
  {
    title: "Broker economics",
    body: "A broker runs this math by hand, per product, per BOM, and bills for it. OrigynLX is one flat fee for twelve months of unlimited checks and unlimited certificates.",
  },
];

const FEATURES: { title: string; body: string }[] = [
  {
    title: "Sourced rules engine",
    body: "Product-specific rules of origin looked up by HS code, with the standard 60% test as fallback, de minimis handling, and both transaction-value and net-cost methods. Every threshold cites its source.",
  },
  {
    title: "BOM CSV import",
    body: "Download the template, fill it in Excel or Google Sheets, upload it, and the calculator builds the bill of materials for you. Or type components by hand.",
  },
  {
    title: "Pass or fail, with margin",
    body: "See your RVC against the threshold and exactly how much headroom a sourcing change would cost or win. Do your origin engineering before you commit to a supplier.",
  },
  {
    title: "Duty savings math",
    body: "Quantify what the preference claim is worth per product against standard MFN rates, so the case for qualifying lands with a dollar sign attached.",
  },
  {
    title: "Draft Certificate of Origin",
    body: "The nine CBP-required data elements, pre-filled from your BOM and formatted for your review and signature.",
  },
  {
    title: "Audit worksheet",
    body: "The full calculation trail in one PDF: rule chosen, threshold applied, component values, and the math behind the result.",
  },
  {
    title: "Broker package",
    body: "A review-ready PDF set for your customs broker: result summary, worksheet, and certificate draft in a single package.",
  },
  {
    title: "Batch qualification",
    body: "Upload a catalog CSV and get a color-coded qualify, fail, or needs-review matrix for every SKU. The preview is free; licensed users export styled Excel or CSV.",
  },
  {
    title: "Trade-remedy flags",
    body: "Section 232 steel and aluminum exposure flagged per component line, so remedy surprises never reach the border.",
  },
  {
    title: "Determination vault",
    body: "Save every determination with blanket-period tracking and renewal reminders, so certificates never lapse silently.",
  },
  {
    title: "Rule watch",
    body: "Monitoring for USMCA rule, method, and threshold changes with alerts, so your next shipment never rides on an outdated rulebook.",
  },
  {
    title: "No-account license",
    body: "Your license key is your account. The browser remembers it, a secure cookie silently restores it, and a one-time email link moves it to a new device.",
  },
];

const WHO: { title: string; body: string }[] = [
  {
    title: "Exporters and producers",
    body: "Run the math before you certify, not after customs asks. Re-run it every time a supplier or price changes.",
  },
  {
    title: "Importers",
    body: "Check that a supplier certificate is arithmetically supportable before you claim the preference on your entry.",
  },
  {
    title: "Brokers and consultants",
    body: "Screen entire client catalogs in one batch run instead of one spreadsheet at a time.",
  },
  {
    title: "Sourcing teams",
    body: "See which supplier swap flips a product out of qualification before the contract is signed.",
  },
];

const UNLOCKS: string[] = [
  "Unlimited RVC checks on both methods",
  "Unlimited draft Certificates of Origin",
  "Batch qualification with styled Excel export",
  "Audit worksheets and broker packages",
  "Determination vault with renewal reminders",
  "Rule change watch and trade-remedy flags",
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "What does OrigynLX actually check?",
    a: "It runs your bill of materials against the USMCA rule of origin that governs your HS code: usually a Regional Value Content test under the transaction-value or net-cost method, with de minimis handling and product-specific thresholds. The agreement is known as USMCA in the United States, CUSMA in Canada, and T-MEC in Mexico; the rules are the same. You get a qualify, fail, or needs-review result with the full calculation trail.",
  },
  {
    q: "How does the free tier work?",
    a: "Twenty-five product checks every calendar month, free, with no signup and no card, and the counter resets on the first of each month. A one-year license for a flat 149 USD unlocks unlimited checks, unlimited certificates, batch qualification, Excel export, the vault, and rule watch.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. Your license key is your account. The browser remembers it, a secure cookie restores it automatically if your session is lost, and a one-time email link moves it to a new device. No passwords, no profile, no password reset emails.",
  },
  {
    q: "Is the result a legal certification?",
    a: "No. OrigynLX is a pre-screening and document-preparation tool, not a certification service. The importer, exporter, or producer is the certifying party and remains legally responsible for the origin claim. The tool gives you the numbers, the format, and the audit trail; the judgment and the signature stay with you and your broker.",
  },
  {
    q: "Which rules does the engine use, and where do they come from?",
    a: "Rules are sourced from the USMCA agreement text, including product-specific rules of origin by HS code. When more than one rule could govern a product, or your CSV method differs from the governing rule, the result is flagged for review instead of silently guessed.",
  },
  {
    q: "Can it process my whole catalog at once?",
    a: "Yes. The batch tool takes a catalog CSV and returns a color-coded qualify, fail, or needs-review matrix for every SKU, with up to 5,000 rows per export. The matrix preview is free; licensed users export styled Excel or CSV results.",
  },
  {
    q: "What documents do I get?",
    a: "A draft Certificate of Origin with the nine CBP-required data elements, an audit worksheet showing the full calculation trail, and a broker-ready review package, all as PDFs, plus styled Excel or CSV results from batch runs.",
  },
  {
    q: "Does it flag Section 232 steel and aluminum exposure?",
    a: "Yes. Components classified under HS 7318 (steel fasteners) and HS 7616 (aluminum goods) are flagged automatically, so your broker sees remedy exposure before entry, not after.",
  },
  {
    q: "What is my data used for?",
    a: "The single-product calculator runs its math in your browser. Batch files are uploaded only to process your run, and vault records are stored under your license key so you can reopen them. Your data is never sold or shared.",
  },
  {
    q: "What happens when the rules change?",
    a: "Rule watch monitors USMCA rule, method, and threshold changes and alerts you. The vault tracks blanket-period expiry with renewal reminders, so an expiring certificate never takes you by surprise.",
  },
  {
    q: "Why does a needs-review flag exist?",
    a: "Because a confident wrong answer is the worst output a compliance tool can produce. When data is missing, ambiguous, or the governing rule is unclear, OrigynLX marks the row for human review instead of guessing. Honest flags are the feature, not a limitation.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "OrigynLX",
  url: "https://origynlx.vercel.app",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web browser",
  description:
    "USMCA rules-of-origin qualification tool: Regional Value Content calculator, batch catalog screening, draft Certificates of Origin, audit worksheets, and broker packages.",
  offers: { "@type": "Offer", price: "149", priceCurrency: "USD" },
};

export default function Page() {
  return (
    <>
      <Nav />
      <Hero />

      <section id="why" className="relative border-t border-white/12 bg-ink py-20 md:py-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="max-w-3xl">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Why origin decides your landed cost</span>
            <h2 className="mt-6 text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl lg:text-5xl">
              One BOM line is the difference between 0% duty and paying twice.
            </h2>
            <p className="mt-5 text-pretty text-base leading-relaxed text-paper/60 sm:text-lg">
              Your duty bill is no longer just about the tariff schedule. Whether your goods qualify
              as USMCA originating now decides whether new IEEPA duties, Section 232 duties, and
              standard MFN tariffs apply, or none of them do.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STAKES.map((s) => (
              <div key={s.title} className="rounded-card border border-white/12 bg-white/[0.03] p-6">
                <h3 className="font-display text-lg leading-tight text-paper">{s.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-paper/60">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[13px] leading-relaxed text-paper/45">
            Already paid IEEPA duties on goods that may have qualified?{" "}
            <Link href="/refund" className="text-seal underline underline-offset-4 hover:text-seal/80 transition-colors">
              Check the refund estimator
            </Link>{" "}
            to see whether a refund could be on the table.
          </p>
        </div>
      </section>

      <section id="features" className="relative border-t border-white/12 bg-ink py-20 md:py-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="mb-12 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-end">
            <div className="lg:col-span-7">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">What OrigynLX does</span>
              <h2 className="mt-6 text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl lg:text-5xl">
                The full qualification workflow, in one tool.
              </h2>
            </div>
            <div className="mt-6 lg:col-span-5 lg:mt-0">
              <p className="max-w-md text-pretty text-base leading-relaxed text-paper/60 sm:text-lg">
                From a single product check to a 5,000-row catalog matrix, every step keeps the
                same promise: sourced rules, visible math, honest flags.
              </p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="rounded-card border border-white/12 bg-white/[0.03] p-6">
                <div className="font-display text-sm italic text-seal/70">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="mt-3 font-display text-lg leading-tight text-paper">{f.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-paper/60">{f.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm text-paper/55">
            <Link href="/calculator" className="hover:text-paper transition-colors">Single-product calculator</Link>
            <Link href="/batch" className="hover:text-paper transition-colors">Batch qualification</Link>
            <Link href="/vault" className="hover:text-paper transition-colors">Determination vault</Link>
            <Link href="/refund" className="hover:text-paper transition-colors">Refund estimator</Link>
          </div>
        </div>
      </section>

      <ProcessSteps />

      <section id="who" className="relative border-t border-white/12 bg-ink py-20 md:py-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="max-w-3xl">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Who it is for</span>
            <h2 className="mt-6 text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl lg:text-5xl">
              Built for the people who sign and ship.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHO.map((w) => (
              <div key={w.title} className="rounded-card border border-white/12 bg-white/[0.03] p-6">
                <h3 className="font-display text-lg leading-tight text-paper">{w.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-paper/60">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PositioningSection />

      <section id="faq" className="relative border-t border-white/12 bg-ink py-20 md:py-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">FAQ</span>
              <h2 className="mt-6 font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
                USMCA questions, answered.
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-paper/55">
                Straight answers on rules, methods, documents, data, and pricing. Anything missing?{" "}
                <Link href="/contact" className="text-seal underline underline-offset-4 hover:text-seal/80 transition-colors">
                  Contact us
                </Link>
                .
              </p>
            </div>
            <div className="mt-10 lg:col-span-7 lg:col-start-6 lg:mt-0">
              <div className="divide-y divide-white/12 border-t border-b border-white/12">
                {FAQS.map((f) => (
                  <details key={f.q} className="group py-5 sm:py-6">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left">
                      <span className="font-display text-[17px] leading-snug text-paper sm:text-lg">{f.q}</span>
                      <span className="shrink-0 font-display text-xl leading-none text-seal transition-transform duration-200 group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-[15px] leading-relaxed text-paper/60">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="relative border-t border-white/12 bg-ink py-20 md:py-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="mb-12 max-w-3xl">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Pricing</span>
            <h2 className="mt-6 text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl lg:text-5xl">
              One flat fee. Twelve months of certainty.
            </h2>
            <p className="mt-5 text-pretty text-base leading-relaxed text-paper/60 sm:text-lg">
              Twenty-five product checks are free every month, no card and no signup. A one-year license for a flat
              149 USD unlocks the full workflow for your entire catalog.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              <PricingCard />
            </div>
            <div className="rounded-card border border-white/12 bg-white/[0.03] p-8 lg:col-span-5">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">A license unlocks</span>
              <ul className="mt-5 space-y-3 text-[14px] text-paper/70">
                {UNLOCKS.map((u) => (
                  <li key={u} className="flex items-start gap-3">
                    <span className="mt-0.5 text-seal">✓</span>
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[13px] leading-relaxed text-paper/45">
                Flat fee, no per-product charges, no seat minimums. The license works across your
                devices and is valid for 365 days.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/12 bg-ink py-20 md:py-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12 text-center">
          <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl lg:text-5xl">
            Know what your BOM is worth before your next shipment.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-paper/60 sm:text-lg">
            Twenty-five checks free every month. No card, no account, no sales call. Upload a BOM and see a qualified
            or failed result in minutes.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/calculator" className="inline-flex items-center justify-center rounded-full bg-seal text-ink text-sm font-semibold px-8 h-12 hover:bg-seal/90 transition-colors">
              Run 25 free checks
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center rounded-full border border-paper/20 text-paper text-sm font-medium px-8 h-12 hover:border-paper/40 hover:bg-white/[0.04] transition-colors">
              View pricing
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}