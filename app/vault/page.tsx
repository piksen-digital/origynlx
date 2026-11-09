import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import VaultClient from "@/components/VaultClient";

export const metadata: Metadata = {
  title: "USMCA Record Vault: Five-Year Certification Records | OrigynLX",
  description:
    "Every qualification you certify has a five-year record-keeping duty behind it. The vault keeps the BOM snapshot, the computed result and the certification data, with blanket-period expiry reminders.",
  alternates: {
    canonical: "/vault",
    languages: { "en": "/vault", "es": "/es/vault" },
  },
};

export default function VaultPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav />
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Record vault</span>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
            Five-year records, one place.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-paper/60 sm:text-lg">
            Every qualification you certify has a five-year record-keeping duty behind it. The vault keeps
            the BOM snapshot, the computed result and the certification data - ready when CBP comes asking,
            with blanket-period expiry reminders before your certifications lapse.
          </p>

          <div className="mt-12 max-w-5xl">
            <VaultClient />
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
