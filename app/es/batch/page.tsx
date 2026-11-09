import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BatchQualifier from "@/components/BatchQualifier";

export const metadata: Metadata = {
  title: "Calificación por lotes del T-MEC: revisa todo tu catálogo por CSV | OrigynLX",
  description:
    "Sube un CSV de productos terminados y sus listas de materiales. OrigynLX ejecuta cada SKU con el mismo motor de reglas y devuelve una matriz de calificación - gratis para ver, con licencia para exportar.",
  alternates: {
    canonical: "/es/batch",
    languages: { "en": "/batch", "es": "/es/batch", "x-default": "/batch" },
  },
};

export default function EsBatchPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav locale="es" />
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Calificación por lotes</span>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
            Todo tu catálogo, una sola carga.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-paper/60 sm:text-lg">
            Sube un CSV de productos terminados y sus listas de materiales. OrigynLX ejecuta cada SKU
            con el mismo motor de reglas, empareja cada código HS con su regla del T-MEC con fuente y
            devuelve una matriz de calificación - gratis para ver, con licencia para exportar.
          </p>

          <div className="mt-12 max-w-5xl">
            <BatchQualifier locale="es" />
          </div>
        </div>
      </section>
      <Footer locale="es" />
    </main>
  );
}
