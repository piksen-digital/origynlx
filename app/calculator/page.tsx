import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CalculatorTool from "@/components/CalculatorTool";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "USMCA Qualification Calculator: Free RVC Check by HS Code | OrigynLX",
  description:
    "Run your bill of materials against the exact USMCA rule of origin for your HS code. Free RVC calculator with product-specific rules, de minimis and draft Certificates of Origin. 25 free checks a month, no signup.",
  alternates: { canonical: "/calculator", languages: { "en": "/calculator", "es": "/es/calculator" } },
};

export default function CalculatorPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav />
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">RVC calculator</span>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
            Check your product.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-paper/60 sm:text-lg">
            Enter your bill of materials and transaction value. Everything below runs in your
            browser — nothing is sent to a server until you choose to buy a license.
          </p>

          <div className="mt-12 max-w-3xl">
            <CalculatorTool />
          </div>

          <p className="mt-8 text-[13px] text-paper/40">
            Spotted a bug or a wrong number?{" "}
            <a href="/contact" className="text-seal underline underline-offset-4 hover:text-seal/80 transition-colors">
              Report an issue
            </a>
            .
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
