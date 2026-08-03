"use client";

import type { BOMLineItem } from "./rvc-calculator";

const STORAGE_KEY = "olx_saved_boms";

export interface SavedBOM {
  id: string;
  name: string;
  savedAt: string;
  productName: string;
  transactionValue: number;
  method: "transaction-value" | "net-cost";
  threshold: number;
  lineItems: BOMLineItem[];
}

function readAll(): SavedBOM[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(items: SavedBOM[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function listSavedBOMs(): SavedBOM[] {
  return readAll().sort((a, b) => (a.savedAt < b.savedAt ? 1 : -1));
}

export function saveBOM(name: string, snapshot: Omit<SavedBOM, "id" | "name" | "savedAt">): SavedBOM {
  const all = readAll();
  const record: SavedBOM = {
    id: `bom_${Date.now()}`,
    name: name.trim() || "Untitled product",
    savedAt: new Date().toISOString(),
    ...snapshot,
  };
  writeAll([...all, record]);
  return record;
}

export function deleteSavedBOM(id: string): void {
  writeAll(readAll().filter((b) => b.id !== id));
}

export function getSavedBOM(id: string): SavedBOM | undefined {
  return readAll().find((b) => b.id === id);
}
