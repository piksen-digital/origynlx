import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";

export default function PricingPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav />
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Pricing</span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
              One license, one product line.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-paper/60 sm:text-lg">
              Five free checks to see if this is useful. After that, one annual license unlocks
              unlimited RVC calculations and certificate downloads for that product line.
            </p>
          </div>

          <div className="mt-12 max-w-md">
            <PricingCard />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
