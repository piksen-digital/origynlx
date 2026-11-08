import Image from "next/image";
import Link from "next/link";
import GridOverlay from "./GridOverlay";

const STATS: { value: string; label: string }[] = [
  { value: "25", label: "free checks, no card, no signup" },
  { value: "60%", label: "standard RVC threshold, sourced by rule" },
  { value: "5,000", label: "rows per batch export" },
];

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-ink">
      <Image
        src="https://images.unsplash.com/photo-1508404999913-79a3a2e75437?q=80&w=2400&auto=format&fit=crop"
        alt="Cargo containers stacked at a port terminal at dusk"
        fill
        priority
        className="object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/70 to-ink" aria-hidden="true" />
      <GridOverlay className="opacity-20" />

      <div className="relative z-10 w-full max-w-content mx-auto px-5 sm:px-6 lg:px-12 pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.08em] text-paper/55">
            USMCA origin qualification, ready for the 2026 review
          </span>

          <h1 className="mt-6 text-left text-[clamp(1.85rem,8.8vw,5.25rem)] sm:text-[clamp(3rem,9vw,5.25rem)] lg:text-[clamp(4rem,5.2vw,5.5rem)] font-display font-semibold leading-[0.95] tracking-tight text-paper">
            Stop paying duty
            <br />
            on goods that already <span className="text-seal">qualify.</span>
          </h1>

          <p className="mt-5 sm:mt-8 text-[15px] sm:text-lg lg:text-xl text-paper/60 leading-relaxed max-w-xl">
            Run your bill of materials through the exact USMCA rule of origin for your HS code:
            transaction-value or net-cost Regional Value Content math, product-specific thresholds,
            de minimis handling, Section 232 steel and aluminum flags, and a draft Certificate of
            Origin with a full audit trail. Minutes instead of weeks. Before you call a broker,
            not instead of one.
          </p>

          <div className="mt-7 sm:mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/calculator"
              className="inline-flex items-center justify-center rounded-full bg-seal text-ink text-sm font-semibold px-8 h-12 hover:bg-seal/90 transition-colors"
            >
              Run 25 free checks
            </Link>
            <Link
              href="/batch"
              className="inline-flex items-center justify-center rounded-full border border-paper/20 text-paper text-sm font-medium px-8 h-12 hover:border-paper/40 hover:bg-white/[0.04] transition-colors"
            >
              Screen your whole catalog
            </Link>
          </div>

          <div className="mt-10 border-t border-white/10 pt-5 sm:mt-12">
            <div className="grid grid-cols-3 divide-x divide-white/10">
              {STATS.map((s, i) => (
                <div key={s.value} className={i > 0 ? "pl-4 sm:pl-6" : ""}>
                  <div className="font-display text-2xl leading-none text-paper sm:text-[1.75rem]">{s.value}</div>
                  <div className="mt-2 text-[13px] leading-snug text-paper/50">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}