import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/shell/Header";

// Temporary landing page. The opening experience (brief §6.1) replaces it in step 7.
const MODES = [
  { href: "/cosmic", label: "Cosmic time" },
  { href: "/genealogy", label: "Genealogy" },
  { href: "/geography", label: "Geography" },
];

export default function Home() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main className="flex min-h-[80dvh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-5xl tracking-[0.3em] text-gold">KĀLA</h1>
        <p className="text-muted">काल · kāla</p>
        <p className="max-w-md text-ink/85">
          An atlas of Indian mythology, cosmology, genealogy and sacred geography.
        </p>
        <nav aria-label="Start exploring" className="mt-4 flex flex-wrap justify-center gap-3">
          {MODES.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="rounded-full border border-gold/50 px-4 py-2 text-gold hover:bg-gold/10"
            >
              {m.label}
            </Link>
          ))}
        </nav>
      </main>
    </>
  );
}
