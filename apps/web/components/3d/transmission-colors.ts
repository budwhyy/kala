import type { TransmissionType } from "@kala/schema";

/** One colour per kind of connection; dashed means the sources do not establish contact. */
export const TYPE_TONE: Record<TransmissionType, { css: string; swatch: string; dashed: boolean }> =
  {
    direct: { css: "--kala-gold", swatch: "bg-gold", dashed: false },
    shared_ancestry: { css: "--kala-celestial", swatch: "bg-celestial", dashed: false },
    reinterpretation: { css: "--kala-copper", swatch: "bg-copper", dashed: false },
    independent_similarity: { css: "--kala-ink", swatch: "bg-ink", dashed: true },
    uncertain_hypothesis: { css: "--kala-deep-red", swatch: "bg-deep-red", dashed: true },
  };
