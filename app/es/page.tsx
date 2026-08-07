import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";
import GridOverlay from "@/components/GridOverlay";

const steps = [
  {
    n: "01",
    title: "Ingresa tu lista de materiales",
    body: "Enumera cada componente con su código HS, país de origen y valor. Marca cuáles insumos son originarios y cuáles no.",
  },
  {
    n: "02",
    title: "Calculamos el Contenido de Valor Regional",
    body: "Valor de transacción menos el valor de materiales no originarios, dividido entre el valor de transacción — calculado en tu navegador, nada sale de tu equipo.",
  },
  {
    n: "03",
    title: "Ve tu margen frente al umbral",
    body: "Obtén un resultado claro de aprobado o no aprobado frente al umbral del 60% (o el de tu producto), además de cuánto margen tienes antes de que un cambio de abastecimiento cambie el resultado.",
  },
  {
    n: "04",
    title: "Genera un certificado en borrador",
    body: "Los nueve elementos de datos requeridos por CBP, prellenados desde tu lista de materiales. Revísalo y fírmalo tú mismo — la parte certificadora siempre eres tú.",
  },
];

export default function LandingEs() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav locale="es" />

      {/* Hero */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-ink">
        <Image
          src="https://images.unsplash.com/photo-1508404999913-79a3a2e75437?q=80&w=2400&auto=format&fit=crop"
          alt=""
          fill
          priority
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/70 to-ink" aria-hidden="true" />
        <GridOverlay className="opacity-20" />

        <div className="relative z-10 w-full max-w-content mx-auto px-5 sm:px-6 lg:px-12 pt-24 pb-12 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.08em] text-paper/55">
              Reglas de origen del T-MEC, desde la revisión de 2026
            </span>

            <h1 className="mt-6 text-left text-[clamp(1.85rem,8.8vw,5.25rem)] sm:text-[clamp(3rem,9vw,5.25rem)] lg:text-[clamp(4rem,5.2vw,5.5rem)] font-display font-semibold leading-[0.95] tracking-tight text-paper">
              Sabe si tu producto
              <br />
              todavía <span className="text-seal">califica.</span>
            </h1>

            <p className="mt-5 sm:mt-8 text-[15px] sm:text-lg lg:text-xl text-paper/60 leading-relaxed max-w-xl">
              Evalúa tu lista de materiales contra la prueba de Contenido de Valor Regional del T-MEC
              y obtén una estimación de calificación en minutos — antes de llamar a un agente aduanal,
              no en lugar de uno.
            </p>

            <div className="mt-7 sm:mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/calculator"
                className="inline-flex items-center justify-center rounded-full bg-seal text-ink text-sm font-semibold px-8 h-12 hover:bg-seal/90 transition-colors"
              >
                Evalúa tu producto — 5 gratis
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-paper/20 text-paper text-sm font-medium px-8 h-12 hover:border-paper/40 hover:bg-white/[0.04] transition-colors"
              >
                Ver precios
              </Link>
            </div>

            <div className="mt-10 border-t border-white/10 pt-5 sm:mt-14">
              <div className="grid grid-cols-3 divide-x divide-white/10">
                <div>
                  <div className="font-display text-2xl leading-none text-paper sm:text-[1.75rem]">60%</div>
                  <div className="mt-2 text-[13px] leading-snug text-paper/50">umbral estándar de RVC</div>
                </div>
                <div className="pl-4 sm:pl-6">
                  <div className="font-display text-2xl leading-none text-paper sm:text-[1.75rem]">9</div>
                  <div className="mt-2 text-[13px] leading-snug text-paper/50">campos requeridos del certificado</div>
                </div>
                <div className="pl-4 sm:pl-6">
                  <div className="font-display text-2xl leading-none text-paper sm:text-[1.75rem]">2036</div>
                  <div className="mt-2 text-[13px] leading-snug text-paper/50">ventana de renegociación</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="relative border-t border-white/12 bg-ink py-20 md:py-28 lg:py-32">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="mb-14 lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Cómo funciona</span>
              <h2 className="mt-6 text-balance font-display text-[10vw] font-semibold leading-[0.95] tracking-tight text-paper sm:text-5xl md:text-6xl">
                Cuatro pasos, sin ambigüedad.
              </h2>
            </div>
            <div className="mt-6 lg:col-span-5 lg:mt-2 lg:self-end">
              <p className="max-w-md text-pretty text-base leading-relaxed text-paper/60 sm:text-lg">
                El mismo cálculo que hace un agente aduanal a mano — solo que más rápido, y puedes
                hacerlo tantas veces como cambie tu abastecimiento.
              </p>
            </div>
          </div>

          <div className="border-t border-white/12">
            {steps.map((s) => (
              <div key={s.n} className="grid gap-4 border-b border-white/12 py-10 sm:py-12 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-2">
                  <span className="font-display text-4xl italic leading-none text-paper/35 sm:text-5xl">{s.n}</span>
                </div>
                <div className="lg:col-span-4">
                  <h3 className="font-display text-xl leading-tight text-paper sm:text-2xl">{s.title}</h3>
                </div>
                <div className="lg:col-span-6">
                  <p className="text-[15px] leading-relaxed text-paper/60 sm:text-base">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Positioning */}
      <section className="relative border-t border-white/12 bg-ink py-20 md:py-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-4">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">
                Qué es esto — y qué no es
              </span>
              <h2 className="mt-6 font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
                Una preselección, no un servicio de certificación.
              </h2>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <p className="text-base leading-relaxed text-paper/70 sm:text-lg">
                OrigynLX hace el cálculo y el formato más rápido de lo que harías a mano — no ejerce
                el derecho aduanero ni certifica tus bienes. El resultado de Contenido de Valor
                Regional y el certificado en borrador son estimaciones para tu uso interno. El
                importador, exportador o productor es la parte certificadora y sigue siendo
                legalmente responsable de la exactitud de cualquier declaración de origen, y debe
                revisar el certificado final — y consultar a un agente aduanal certificado en
                cualquier caso cercano al umbral — antes de firmar.
              </p>
              <p className="mt-4 text-[13px] leading-relaxed text-paper/45">
                Solo para uso informativo. No es asesoría legal. Ver el{" "}
                <a href="/legal/disclaimer" className="underline hover:text-paper/70 transition-colors">
                  aviso legal completo
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative border-t border-white/12 bg-ink py-20 md:py-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Precios</span>
              <h2 className="mt-6 font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
                Un solo número. Sin sorpresas por medición.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-paper/60">
                Pruébalo gratis — cinco verificaciones de calificación, sin tarjeta. Cuando estés
                listo, una licencia anual cubre verificaciones y certificados ilimitados para esa
                línea de producto.
              </p>
              <Link href="/calculator" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-paper/70 hover:text-paper transition-colors">
                Prueba la calculadora gratis →
              </Link>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <PricingCard locale="es" />
            </div>
          </div>
        </div>
      </section>

      <Footer locale="es" />
    </main>
  );
}
