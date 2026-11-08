"use client";

import { useEffect, useRef, useState } from "react";

interface PayPalSdkButtonInstance {
  render: (target: HTMLElement) => Promise<void>;
}

interface PayPalSdk {
  Buttons: (opts: {
    style?: Record<string, string | number>;
    createOrder: () => Promise<string>;
    onApprove: (data: { orderID: string }) => Promise<void>;
    onError: (err: unknown) => void;
  }) => PayPalSdkButtonInstance;
}

declare global {
  interface Window {
    paypal?: PayPalSdk;
  }
}

export interface PayPalButtonsProps {
  clientId: string;
  email: string;
  emailValid: boolean;
  mode: string;
  plan: string;
  locale?: "en" | "es";
  onSuccess: (licenseKey: string) => void;
  onError: (message: string) => void;
}

const COPY = {
  en: {
    couldNotStart: "Could not start checkout.",
    notConfirmed: "Payment could not be confirmed. If you were charged, contact support.",
    reportedError: "PayPal reported an error. Please try again.",
    couldNotStartRefresh: "PayPal checkout could not start. Refresh the page and try again.",
    buttonsFailed: "PayPal buttons failed to load. Refresh the page and try again.",
    loadFailed: "PayPal could not be loaded. Check your connection and try again.",
  },
  es: {
    couldNotStart: "No se pudo iniciar el pago.",
    notConfirmed: "No se pudo confirmar el pago. Si te cobraron, escribenos a soporte.",
    reportedError: "PayPal reporto un error. Intenta de nuevo.",
    couldNotStartRefresh: "El pago con PayPal no pudo iniciar. Recarga la pagina e intenta de nuevo.",
    buttonsFailed: "Los botones de PayPal no cargaron. Recarga la pagina e intenta de nuevo.",
    loadFailed: "PayPal no pudo cargarse. Revisa tu conexion e intenta de nuevo.",
  },
};

export default function PayPalButtons(props: PayPalButtonsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const renderedRef = useRef(false);
  const emailRef = useRef(props.email);
  const planRef = useRef(props.plan);
  const onSuccessRef = useRef(props.onSuccess);
  const onErrorRef = useRef(props.onError);
  const [loadFailed, setLoadFailed] = useState(false);
  const t = COPY[props.locale ?? "en"];

  emailRef.current = props.email;
  planRef.current = props.plan;
  onSuccessRef.current = props.onSuccess;
  onErrorRef.current = props.onError;

  useEffect(() => {
    if (!props.clientId || !props.emailValid) return;
    let cancelled = false;

    const init = () => {
      const sdk = window.paypal;
      const target = containerRef.current;
      if (cancelled || !sdk || !target || renderedRef.current) return;
      renderedRef.current = true;
      let instance: PayPalSdkButtonInstance;
      try {
        instance = sdk.Buttons({
          style: { layout: "vertical", color: "gold", shape: "pill", label: "paypal", height: 45 },
          createOrder: async () => {
            const res = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ email: emailRef.current, plan: planRef.current }),
            });
            const data: { orderId?: string; error?: string } = await res.json().catch(() => ({}));
            if (!res.ok || !data.orderId) {
              throw new Error(data.error || t.couldNotStart);
            }
            return data.orderId;
          },
          onApprove: async (data: { orderID: string }) => {
            const res = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ orderId: data.orderID }),
            });
            const result: { status?: string; licenseKey?: string; error?: string } = await res
              .json()
              .catch(() => ({}));
            if (result.status === "active" && result.licenseKey) {
              onSuccessRef.current(result.licenseKey);
            } else {
              onErrorRef.current(result.error || t.notConfirmed);
            }
          },
          onError: () => {
            onErrorRef.current(t.reportedError);
          },
        });
      } catch {
        renderedRef.current = false;
        setLoadFailed(true);
        onErrorRef.current(t.couldNotStartRefresh);
        return;
      }
      instance
        .render(target)
        .catch(() => {
          renderedRef.current = false;
          setLoadFailed(true);
          onErrorRef.current(t.buttonsFailed);
        });
    };

    const scriptId = "paypal-sdk-script";
    const base =
      props.mode === "live" ? "https://www.paypal.com/sdk/js" : "https://www.sandbox.paypal.com/sdk/js";
    const src =
      base +
        "?client-id=" +
        encodeURIComponent(props.clientId) +
        "&currency=USD&intent=capture&components=buttons&locale=" +
        (props.locale === "es" ? "es_MX" : "en_US");
    const existing = document.getElementById(scriptId);
    if (existing instanceof HTMLScriptElement && existing.dataset.src === src) {
      if (window.paypal) {
        init();
      } else {
        existing.addEventListener("load", init);
      }
    } else if (existing) {
      existing.remove();
      const script = document.createElement("script");
      script.id = scriptId;
      script.dataset.src = src;
      script.src = src;
      script.async = true;
      script.onload = init;
      script.onerror = () => {
        setLoadFailed(true);
        onErrorRef.current(t.loadFailed);
      };
      document.body.appendChild(script);
    } else {
      const script = document.createElement("script");
      script.id = scriptId;
      script.dataset.src = src;
      script.src = src;
      script.async = true;
      script.onload = init;
      script.onerror = () => {
        setLoadFailed(true);
        onErrorRef.current(t.loadFailed);
      };
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
    };
  }, [props.clientId, props.emailValid, props.mode, props.locale]);

  if (loadFailed) {
    return (
      <p className="mt-4 text-[13px] text-fail">{t.loadFailed}</p>
    );
  }

  return <div ref={containerRef} className="mt-4" />;
}
