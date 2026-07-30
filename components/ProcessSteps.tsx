const steps = [
  {
    n: "01",
    title: "Enter your bill of materials",
    body: "List each component with its HS code, country of origin, and value. Mark which inputs are originating and which aren't.",
  },
  {
    n: "02",
    title: "We run the Regional Value Content math",
    body: "Transaction value minus non-originating material value, divided by transaction value — calculated in your browser, nothing leaves your machine.",
  },
  {
    n: "03",
    title: "See your margin against the threshold",
    body: "Get a clear pass or fail against the 60% (or your product's) threshold, plus how much room you have before a sourcing change would flip the result.",
  },
  {
    n: "04",
    title: "Generate a draft certificate",
    body: "The nine CBP-required data elements, pre-filled from your BOM. Review it, then sign it yourself — the certifying party is always you.",
  },
];

export default function ProcessSteps() {
  return (
    <section className="relative border-t border-white/12 bg-ink py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
        <div className="mb-14 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">How it works</span>
            <h2 className="mt-6 text-balance font-display text-[10vw] font-semibold leading-[0.95] tracking-tight text-paper sm:text-5xl md:text-6xl">
              Four steps, no ambiguity.
            </h2>
          </div>
          <div className="mt-6 lg:col-span-5 lg:mt-2 lg:self-end">
            <p className="max-w-md text-pretty text-base leading-relaxed text-paper/60 sm:text-lg">
              Same math a customs broker runs by hand — just faster, and you can run it as often
              as your sourcing changes.
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
  );
}
