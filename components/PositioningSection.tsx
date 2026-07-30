export default function PositioningSection() {
  return (
    <section className="relative border-t border-white/12 bg-ink py-20 md:py-28">
      <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">What this is — and isn't</span>
            <h2 className="mt-6 font-display text-3xl font-semibold leading-tight text-paper sm:text-4xl">
              A pre-screener, not a certification service.
            </h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <p className="text-base leading-relaxed text-paper/70 sm:text-lg">
              OrigynLX does the arithmetic and formatting faster than doing it by hand — it does
              not practice customs law and it does not certify your goods. The Regional Value
              Content result and draft certificate are estimates for your internal use. The
              importer, exporter, or producer is the certifying party and remains legally
              responsible for the accuracy of any origin claim, and should review the final
              certificate — and consult a licensed customs broker for anything close to the
              threshold — before signing.
            </p>
            <p className="mt-4 text-[13px] leading-relaxed text-paper/45">
              For informational use only. Not legal advice. See the{" "}
              <a href="/legal/disclaimer" className="underline hover:text-paper/70 transition-colors">
                full disclaimer
              </a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
