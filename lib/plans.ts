/**
 * Plan definitions shared by the checkout routes. Two products:
 * - monthly: a one-time 30-day pass, no auto-renewal
 * - annual: the 365-day flagship license
 * Prices default in code and can be overridden with env vars.
 */

export type PlanId = "monthly" | "annual";

export interface PlanDef {
  id: PlanId;
  priceUsd: number;
  termDays: number;
  reasonForPayment: string;
}

export const PLANS: Record<PlanId, PlanDef> = {
  monthly: {
    id: "monthly",
    priceUsd: Number(process.env.LICENSE_PRICE_USD_MONTHLY || 19),
    termDays: 30,
    reasonForPayment: "OrigynLX monthly license (30 days)",
  },
  annual: {
    id: "annual",
    priceUsd: Number(process.env.LICENSE_PRICE_USD || 149),
    termDays: 365,
    reasonForPayment: "OrigynLX annual license",
  },
};

/**
 * Anything unknown, including legacy callers that send no plan at all,
 * resolves to the annual plan.
 */
export function resolvePlan(id: unknown): PlanDef {
  return id === "monthly" ? PLANS.monthly : PLANS.annual;
}