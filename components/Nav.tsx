"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

const links = [
  { href: "/calculator", label: "Calculator" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed z-50 top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4">
      <nav className="mx-auto bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] rounded-2xl shadow-lg max-w-[1400px]">
        <div className="flex items-center justify-between px-5 sm:px-6 lg:px-8 h-14 sm:h-16">
          <Logo />

          <div className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-paper/70 hover:text-paper transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/calculator"
              className="text-sm font-semibold text-ink transition-all duration-300 px-5 py-2 rounded-full bg-seal hover:bg-seal/90"
            >
              Start free trial
            </Link>
          </div>

          <button
            className="lg:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5 z-50"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`w-5 h-px bg-paper transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`w-5 h-px bg-paper transition-opacity ${open ? "opacity-0" : "opacity-100"}`} />
            <span className={`w-5 h-px bg-paper transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
          </button>
        </div>

        {open && (
          <div className="lg:hidden flex flex-col gap-1 px-5 pb-5 pt-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-paper/80 hover:text-paper transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/calculator"
              onClick={() => setOpen(false)}
              className="mt-2 text-center text-sm font-semibold text-ink px-5 py-2.5 rounded-full bg-seal"
            >
              Start free trial
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
