import type { Metadata } from "next";
import { EB_Garamond, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";

// Latin serif with full IAST diacritic coverage (latin-ext) + Devanagari serif (§7).
const latinSerif = EB_Garamond({
  subsets: ["latin", "latin-ext"],
  variable: "--font-latin-serif",
  display: "swap",
});
const devanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KĀLA",
  description:
    "An interactive atlas of Indian mythology, cosmology, genealogy and sacred geography.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${latinSerif.variable} ${devanagari.variable}`}>
      <body className="min-h-dvh font-serif antialiased">{children}</body>
    </html>
  );
}
