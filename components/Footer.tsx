import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/12 bg-ink py-16 lg:py-20">
      <div className="mx-auto max-w-content px-5 sm:px-6 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-paper/50">
              OrigynLX provides an estimate of USMCA origin qualification for internal use.
              It is a pre-screening and document-preparation tool, not legal advice and not a
              certification service. The importer, exporter, or producer remains responsible for
              verifying and signing the final Certificate of Origin.
            </p>
          </div>

          <div className="lg:col-span-3">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/45">Product</span>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/calculator" className="text-sm text-paper/70 hover:text-paper transition-colors">Calculator</Link></li>
              <li><Link href="/pricing" className="text-sm text-paper/70 hover:text-paper transition-colors">Pricing</Link></li>
              <li><Link href="/contact" className="text-sm text-paper/70 hover:text-paper transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/45">Legal</span>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/legal/disclaimer" className="text-sm text-paper/70 hover:text-paper transition-colors">Disclaimer</Link></li>
              <li><Link href="/legal/terms" className="text-sm text-paper/70 hover:text-paper transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-[13px] text-paper/40">© {new Date().getFullYear()} OrigynLX. All rights reserved.</p>
          <p className="text-[13px] text-paper/40">For informational use only. Not legal advice.</p>
        </div>
      </div>
    </footer>
  );
}
