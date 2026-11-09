import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import VaultClient from "@/components/VaultClient";

export const metadata: Metadata = {
  title: "Bóveda de registros del T-MEC: respaldo de cinco años | OrigynLX",
  description:
    "Cada calificación que certificas conlleva una obligación de conservar registros por cinco años. La bóveda guarda la lista de materiales, el resultado calculado y los datos de certificación, lista para cuando CBP pregunte.",
  alternates: {
    canonical: "/es/vault",
    languages: { "en": "/vault", "es": "/es/vault", "x-default": "/vault" },
  },
};

export default function EsVaultPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav locale="es" />
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Bóveda de registros</span>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
            Registros de cinco años, en un solo lugar.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-paper/60 sm:text-lg">
            Cada calificación que certificas conlleva una obligación de conservar registros por cinco
            años. La bóveda guarda la lista de materiales, el resultado calculado y los datos de
            certificación - listos cuando CBP pregunte, con recordatorios de vencimiento del período
            general antes de que tus certificaciones caduquen.
          </p>

          <div className="mt-12 max-w-5xl">
            <VaultClient locale="es" />
          </div>
        </div>
      </section>
      <Footer locale="es" />
    </main>
  );
}
