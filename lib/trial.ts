"use client";

const TRIAL_KEY = "olx_trial_checks_used";
const LICENSE_KEY = "olx_license_key";
export const FREE_CHECKS = 5;

export function getChecksUsed(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(TRIAL_KEY);
  return raw ? parseInt(raw, 10) || 0 : 0;
}

export function recordCheckUsed(): number {
  const next = getChecksUsed() + 1;
  window.localStorage.setItem(TRIAL_KEY, String(next));
  return next;
}

export function hasFreeChecksLeft(): boolean {
  return getChecksUsed() < FREE_CHECKS;
}

export function checksRemaining(): number {
  return Math.max(0, FREE_CHECKS - getChecksUsed());
}

export function getStoredLicenseKey(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(LICENSE_KEY);
}

export function storeLicenseKey(key: string): void {
  window.localStorage.setItem(LICENSE_KEY, key);
}

export function clearStoredLicenseKey(): void {
  window.localStorage.removeItem(LICENSE_KEY);
}
