"use client";

import { useState } from "react";

const PRICE_USD = 149;

export default function PricingCard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  async function handleBuy() {
    setError(null);
    if (!email.trim() || !email.includes("@")) {
      setError("Enter an email so we can send your license key.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data?.redirectUrl) {
        throw new Error(data?.error || "Could not start checkout.");
      }
      window.location.href = data.redirectUrl;
    } catch (e: any) {
      setError(e.message || "Something went wrong starting checkout.");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-card border border-white/12 bg-white/[0.03] p-8 sm:p-10">
      <span className="text-xs font-medium uppercase tracking-[0.08em] text-paper/50">Annual license</span>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-5xl font-semibold text-paper">${PRICE_USD}</span>
        <span className="text-paper/50">/ year</span>
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-paper/60">
        One qualifying product line, unlimited checks, unlimited certificates, for 12 months.
        Re-run whenever your sourcing changes — the rules don't stay still, so neither should you.
      </p>

      <ul className="mt-6 space-y-2.5 text-[14px] text-paper/70">
        <li>Unlimited RVC calculations</li>
        <li>Unlimited draft certificates of origin</li>
        <li>Transaction-value and net-cost methods</li>
        <li>License valid across your devices</li>
      </ul>

      <div className="mt-8">
        <label htmlFor="checkout-email" className="text-[13px] font-medium text-paper/60">
          Email for your license key
        </label>
        <input
          id="checkout-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 text-paper placeholder:text-paper/30 outline-none focus:border-seal/60"
        />
        {error && <p className="mt-2 text-[13px] text-fail">{error}</p>}
        <button
          onClick={handleBuy}
          disabled={loading}
          className="mt-4 w-full rounded-full bg-seal text-ink text-sm font-semibold h-12 hover:bg-seal/90 transition-colors disabled:opacity-60"
        >
          {loading ? "Starting checkout…" : `Buy license — $${PRICE_USD}`}
        </button>
        <p className="mt-3 text-[12px] leading-relaxed text-paper/40">
          Payment processed by Pesepay. You'll be redirected to their secure checkout.
        </p>
      </div>
    </div>
  );
}
