import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BatchQualifier from "@/components/BatchQualifier";

export const metadata: Metadata = {
  title: "Batch USMCA Qualification: Screen Your Whole Catalog by CSV | OrigynLX",
  description:
    "Upload a CSV of finished products and their bills of materials. OrigynLX runs every SKU through the same rule engine and returns a qualification matrix - free to view, licensed to export.",
  alternates: {
    canonical: "/batch",
    languages: { "en": "/batch", "es": "/es/batch" },
  },
};

export default function BatchPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav />
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Batch qualification</span>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
            Your whole catalog, one upload.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-paper/60 sm:text-lg">
            Upload a CSV of finished products and their bills of materials. OrigynLX runs every SKU
            through the same rule engine, matches each HS code to its sourced USMCA rule, and returns
            a qualification matrix - free to view, licensed to export.
          </p>

          <div className="mt-12 max-w-5xl">
            <BatchQualifier />
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
