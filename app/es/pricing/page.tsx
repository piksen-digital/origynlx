import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";

export const metadata: Metadata = {
  title: "Precios: planes de calificación T-MEC, mensual y anual | OrigynLX",
  description:
    "Precios de OrigynLX: 25 verificaciones gratuitas del T-MEC cada mes, un pase mensual de 19 USD o una licencia anual de 149 USD. RVC ilimitado, certificados, calificación por lotes, bóveda y vigilancia de reglas.",
  alternates: { canonical: "/es/pricing", languages: { "en": "/pricing", "es": "/es/pricing" } },
};

export default function PricingEsPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav locale="es" />
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Precios</span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
              Una línea de producto, dos formas de pagar.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-paper/60 sm:text-lg">
              Veinticinco verificaciones gratis cada mes para comprobar si esto te sirve. Después,
              paga 19 USD por un pase de 30 días o 149 USD por un año completo; ambos desbloquean
              cálculos de RVC ilimitados, certificados, calificación por lotes y todas las demás
              funciones para esa línea de producto.
            </p>
          </div>

          <div className="mt-12 max-w-md">
            <PricingCard locale="es" />
          </div>
        </div>
      </section>
      <Footer locale="es" />
    </main>
  );
}