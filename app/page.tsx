import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProcessSteps from "@/components/ProcessSteps";
import PositioningSection from "@/components/PositioningSection";
import PricingCard from "@/components/PricingCard";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav />
      <Hero />
      <ProcessSteps />
      <PositioningSection />

      <section className="relative border-t border-white/12 bg-ink py-20 md:py-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Pricing</span>
              <h2 className="mt-6 font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
                One number. No metered surprises.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-paper/60">
                Try it free — five qualification checks, no card required. When you're ready,
                one annual license covers unlimited checks and certificates for a product line.
              </p>
              <Link href="/calculator" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-paper/70 hover:text-paper transition-colors">
                Try the calculator free →
              </Link>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <PricingCard />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
