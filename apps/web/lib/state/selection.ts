// Exploration context. The URL is the source of truth (?entity=, ?place=, ?kingdom=…); this store
// remembers the last selection so mode switches from pages without one (e.g. search) keep it.
"use client";
import { create } from "zustand";

export const SELECTION_PARAMS = ["entity", "place", "kingdom", "dynasty", "text", "time"] as const;
export type SelectionParam = (typeof SELECTION_PARAMS)[number];
export type Selection = Partial<Record<SelectionParam, string>>;

type SelectionState = {
  selection: Selection;
  setSelection: (s: Selection) => void;
};

export const useSelection = create<SelectionState>((set) => ({
  selection: {},
  setSelection: (selection) => set({ selection }),
}));

/** Read the selection params from a URLSearchParams. */
export function selectionFromParams(params: URLSearchParams): Selection {
  const s: Selection = {};
  for (const key of SELECTION_PARAMS) {
    const v = params.get(key);
    if (v) s[key] = v;
  }
  return s;
}

export function toQuery(s: Selection): string {
  const q = new URLSearchParams(Object.entries(s).filter(([, v]) => v) as [string, string][]);
  const str = q.toString();
  return str ? `?${str}` : "";
}
