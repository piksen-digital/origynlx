"use client";

import { useState } from "react";

const COPY = {
  en: {
    sentTitle: "Message sent.",
    sentBody: "We will get back to you within a business day.",
    nameLabel: "Name",
    emailLabel: "Email",
    messageLabel: "Message",
    namePlaceholder: "Jane Smith",
    emailPlaceholder: "jane@company.com",
    messagePlaceholder: "What are you trying to qualify?",
    sending: "Sending...",
    submit: "Send message",
    errorFallback: "Something went wrong.",
    errorRetry: "Something went wrong. Please try again.",
  },
  es: {
    sentTitle: "Mensaje enviado.",
    sentBody: "Te responderemos en un día hábil.",
    nameLabel: "Nombre",
    emailLabel: "Correo",
    messageLabel: "Mensaje",
    namePlaceholder: "Ana García",
    emailPlaceholder: "ana@empresa.com",
    messagePlaceholder: "¿Qué producto quieres calificar?",
    sending: "Enviando...",
    submit: "Enviar mensaje",
    errorFallback: "Algo salió mal.",
    errorRetry: "Algo salió mal. Inténtalo de nuevo.",
  },
};

export default function ContactForm({ locale = "en" }: { locale?: "en" | "es" }) {
  const t = COPY[locale];
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || t.errorFallback);
      setStatus("sent");
    } catch (err: any) {
      setStatus("error");
      setError(err.message || t.errorRetry);
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-card border border-white/12 bg-white/[0.03] p-10 text-center">
        <p className="font-display text-2xl text-paper">{t.sentTitle}</p>
        <p className="mt-3 text-paper/60">{t.sentBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-card border border-white/12 bg-white/[0.03] p-8 sm:p-10 space-y-5">
      <div>
        <label htmlFor="name" className="text-[13px] font-medium text-paper/60">{t.nameLabel}</label>
        <input
          id="name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 text-paper placeholder:text-paper/30 outline-none focus:border-seal/60"
          placeholder={t.namePlaceholder}
        />
      </div>
      <div>
        <label htmlFor="email" className="text-[13px] font-medium text-paper/60">{t.emailLabel}</label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 text-paper placeholder:text-paper/30 outline-none focus:border-seal/60"
          placeholder={t.emailPlaceholder}
        />
      </div>
      <div>
        <label htmlFor="message" className="text-[13px] font-medium text-paper/60">{t.messageLabel}</label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="mt-2 w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 text-paper placeholder:text-paper/30 outline-none focus:border-seal/60 resize-none"
          placeholder={t.messagePlaceholder}
        />
      </div>

      {error && <p className="text-[13px] text-fail">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-seal text-ink text-sm font-semibold h-12 hover:bg-seal/90 transition-colors disabled:opacity-60"
      >
        {status === "sending" ? t.sending : t.submit}
      </button>
    </form>
  );
}