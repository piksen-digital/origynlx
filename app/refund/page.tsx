import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RefundEstimator from "@/components/RefundEstimator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IEEPA Refund Estimator: Check Refundable Tariffs Paid in 2025-2026 | OrigynLX",
  description:
    "The Supreme Court struck down the IEEPA tariff layers in February 2026. If you imported under the fentanyl or reciprocal tariffs during 2025 and early 2026, you may be owed a refund. Size the exposure in two minutes.",
  alternates: { canonical: "/refund", languages: { "en": "/refund", "es": "/es/refund" } },
};

export default function RefundPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav />
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">IEEPA refund estimator</span>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
            Did you pay IEEPA duties that are now refundable?
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-paper/60 sm:text-lg">
            The Supreme Court struck down the IEEPA tariff layers in February 2026. If you imported under the
            fentanyl or reciprocal tariffs during 2025 and early 2026, you may be owed a refund. Size the exposure
            here in two minutes - then decide whether it is worth pursuing with a broker.
          </p>

          <div className="mt-12 max-w-5xl">
            <RefundEstimator />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
