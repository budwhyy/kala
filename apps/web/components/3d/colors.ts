// Read palette tokens (defined once in app/globals.css) for use in WebGL materials.
export function cssVar(name: string, fallback = "#ffffff"): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

export function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Palette token per yuga, shared by the 3D wheel and its HTML controls. */
export const YUGA_TONE = {
  satya: "--kala-gold",
  treta: "--kala-copper",
  dvapara: "--kala-celestial",
  kali: "--kala-deep-red",
} as const;

/** Map/legend colours per place confidence class. Labels are in messages under `confidence.<class>.label`. */
export const CONFIDENCE_STYLE = {
  verified: { color: "var(--kala-gold)" },
  traditional: { color: "var(--kala-copper)" },
  debated: { color: "#e07a7f" },
  mythical: { color: "var(--kala-celestial)" },
} as const;
