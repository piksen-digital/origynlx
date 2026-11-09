import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RefundEstimator from "@/components/RefundEstimator";

export const metadata: Metadata = {
  title: "Estimador de reembolsos IEEPA: aranceles pagados en 2025-2026 | OrigynLX",
  description:
    "La Corte Suprema derogó las capas arancelarias IEEPA en febrero de 2026. Si importaste bajo los aranceles de fentanilo o recíprocos, estima aquí tu exposición reembolsable en dos minutos.",
  alternates: { canonical: "/es/refund", languages: { "en": "/refund", "es": "/es/refund" } },
};

export default function RefundEsPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav locale="es" />
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Estimador de reembolsos IEEPA</span>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
            ¿Pagaste derechos IEEPA que ahora son reembolsables?
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-paper/60 sm:text-lg">
            La Corte Suprema derogó las capas arancelarias IEEPA en febrero de 2026. Si importaste
            bajo los aranceles de fentanilo o recíprocos durante 2025 y principios de 2026, es
            posible que te deban un reembolso. Estima el monto aquí en dos minutos y luego decide
            si vale la pena seguirlo con un agente aduanal.
          </p>

          <div className="mt-12 max-w-5xl">
            <RefundEstimator locale="es" />
          </div>

          <p className="mt-8 text-[13px] text-paper/40">
            ¿Ves un error o un número incorrecto?{" "}
            <a href="/es/contact" className="text-seal underline underline-offset-4 hover:text-seal/80 transition-colors">
              Reporta un problema
            </a>
            .
          </p>
        </div>
      </section>
      <Footer locale="es" />
    </main>
  );
}