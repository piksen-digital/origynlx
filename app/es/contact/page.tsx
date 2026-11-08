import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contacto OrigynLX: preguntas de calificación T-MEC | OrigynLX",
  description:
    "Preguntas sobre un producto específico, una licencia, o si OrigynLX encaja con tu operación de abastecimiento. Envía un mensaje y respondemos en un día hábil.",
  alternates: { canonical: "/es/contact", languages: { "en": "/contact", "es": "/es/contact" } },
};

export default function ContactEsPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink">
      <Nav locale="es" />
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Contacto</span>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
                Escríbenos.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-paper/60 sm:text-lg">
                Preguntas sobre un producto específico, una licencia, o si OrigynLX encaja con tu
                operación de abastecimiento: envía un mensaje y respondemos en un día hábil.
              </p>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <ContactForm locale="es" />
            </div>
          </div>
        </div>
      </section>
      <Footer locale="es" />
    </main>
  );
}