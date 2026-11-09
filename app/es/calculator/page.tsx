import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CalculatorTool from "@/components/CalculatorTool";

export const metadata: Metadata = {
  title: "Calculadora de calificación T-MEC: verificación de RVC gratis por código HS | OrigynLX",
  description:
    "Ingresa tu lista de materiales y verifica si tu producto califica para el tratamiento preferencial del T-MEC: calculadora de RVC gratis con reglas de origen específicas por código HS, minimis y certificado de origen en borrador. 25 verificaciones gratis al mes, sin registro.",
  alternates: { canonical: "/es/calculator", languages: { "en": "/calculator", "es": "/es/calculator" } },
};

export default function CalculadoraPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav locale="es" />
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Calculadora de RVC</span>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
            Verifica tu producto.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-paper/60 sm:text-lg">
            Ingresa tu lista de materiales y el valor de transacción. Todo lo de abajo corre en tu navegador: no se envía nada a un servidor hasta que decides comprar una licencia.
          </p>

          <div className="mt-12 max-w-3xl">
            <CalculatorTool locale="es" />
          </div>
        </div>
      </section>
      <Footer locale="es" />
    </main>
  );
}