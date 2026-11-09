import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Aviso legal | OrigynLX",
  description:
    "Aviso legal de OrigynLX: los resultados son estimaciones para uso interno; el importador, exportador o productor es la parte certificadora y sigue siendo responsable de la declaración de origen.",
  alternates: {
    canonical: "/es/legal/disclaimer",
    languages: { "en": "/legal/disclaimer", "es": "/es/legal/disclaimer", "x-default": "/legal/disclaimer" },
  },
};

export default function DisclaimerPageEs() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav locale="es" />
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Legal</span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
              Aviso legal
            </h1>

            <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-paper/70">
              <p>
                OrigynLX es una herramienta de preselección y preparación de documentos. Realiza la
                aritmética de Contenido de Valor Regional definida en el T-MEC y formatea un
                Certificado de Origen en borrador a partir de la información que capturas. No
                ejerce el derecho aduanero, no certifica bienes y no sustituye a un agente aduanal
                con licencia ni a un abogado de comercio exterior.
              </p>
              <p>
                <strong className="text-paper">Los resultados son estimaciones solo para uso interno.</strong>{" "}
                La calificación de origen depende de la exactitud de los datos de la lista de
                materiales que proporciones, de reglas que pueden cambiar (el T-MEC está en un
                proceso de renegociación activo que puede extenderse hasta 2036) y, en muchos
                casos, de pruebas adicionales - incluido el análisis de cambio de clasificación
                arancelaria del Anexo 4-B - que esta herramienta no realiza. Un resultado mostrado
                aquí no es una determinación de que tu producto califica para el tratamiento
                preferencial.
              </p>
              <p>
                <strong className="text-paper">Tú eres la parte certificadora.</strong> El importador,
                exportador o productor que firma un Certificado de Origen atesta personalmente los
                hechos en él y carga con la responsabilidad legal y financiera de esa declaración,
                incluidos derechos retroactivos o sanciones. Revisa cada campo que OrigynLX genera
                contra tus propios registros antes de firmar cualquier cosa, y consulta a un
                agente aduanal con licencia para cualquier resultado cercano al umbral de
                calificación o para cualquier cosa sobre la que no tengas confianza.
              </p>
              <p>
                OrigynLX y su operador renuncian a toda responsabilidad por decisiones tomadas con
                base en los resultados de esta herramienta. Úsala para avanzar más rápido en la
                aritmética, no como sustituto del juicio profesional sobre tus hechos específicos.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer locale="es" />
    </main>
  );
}
