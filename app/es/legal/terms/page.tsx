import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Términos de uso | OrigynLX",
  description:
    "Términos de uso de OrigynLX: el servicio, las claves de licencia, el pago procesado por Pesepay, la posición sin garantías y cómo cambian estos términos a medida que evolucionan las reglas del T-MEC.",
  alternates: {
    canonical: "/es/legal/terms",
    languages: { "en": "/legal/terms", "es": "/es/legal/terms", "x-default": "/legal/terms" },
  },
};

export default function TermsPageEs() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav locale="es" />
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="max-w-2xl">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Legal</span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
              Términos de uso
            </h1>

            <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-paper/70">
              <p>
                Al usar OrigynLX aceptas estos términos. Si no estás de acuerdo, no uses el
                servicio.
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">El servicio</h2>
              <p>
                OrigynLX ofrece una calculadora de Contenido de Valor Regional y un generador de
                Certificados de Origen en borrador para uso informativo, como se describe en
                nuestro{" "}
                <a href="/es/legal/disclaimer" className="underline hover:text-paper transition-colors">Aviso legal</a>.
                Los cálculos corren en tu navegador; no recibimos ni almacenamos los datos de tu
                lista de materiales a menos que nos los envíes explícitamente (por ejemplo,
                mediante el formulario de contacto).
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">Cuentas y licencias</h2>
              <p>
                No hay cuentas de usuario. Una clave de licencia, emitida tras el pago, desbloquea
                cálculos y descargas de certificados ilimitados para una línea de producto durante
                12 meses desde la compra. Las claves de licencia no son transferibles fuera de tu
                propia organización y deben mantenerse confidenciales.
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">Pago</h2>
              <p>
                Los pagos son procesados por Pesepay, un proveedor de pagos de terceros. No
                almacenamos los datos de tu tarjeta. Las solicitudes de reembolso pueden enviarse
                a través de la página de contacto y se gestionan caso por caso.
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">Sin garantía</h2>
              <p>
                El servicio se proporciona tal cual, sin garantías. No garantizamos que los
                resultados sean exactos, completos o aptos para cualquier propósito regulatorio.
                Consulta el Aviso legal para la posición completa sobre la responsabilidad y la
                obligación de la parte certificadora.
              </p>

              <h2 className="pt-4 font-display text-xl text-paper">Cambios</h2>
              <p>
                Podemos actualizar estos términos o el propio servicio a medida que evolucionan
                las reglas del T-MEC. Los cambios materiales se reflejarán en esta página.
              </p>

              <p className="pt-4 text-[13px] text-paper/40">
                Esta es una plantilla general de términos y no ha sido revisada por un abogado para
                tu jurisdicción específica - haz que un asesor legal la revise antes de
                publicarla para clientes reales.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer locale="es" />
    </main>
  );
}
