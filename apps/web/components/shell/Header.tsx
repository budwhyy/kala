import Link from "next/link";
import { Suspense } from "react";
import type { Selection } from "@/lib/state/selection";
import { ModeSwitcher } from "./ModeSwitcher";

export function Header({ context }: { context?: Selection }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-void/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="text-xl tracking-[0.3em] text-gold">
          KĀLA
        </Link>
        <Suspense fallback={<div className="h-8" />}>
          <ModeSwitcher context={context} />
        </Suspense>
        <form action="/search" role="search" className="ml-auto w-full sm:w-auto">
          <label htmlFor="site-search" className="sr-only">
            Search KĀLA
          </label>
          <input
            id="site-search"
            name="q"
            type="search"
            placeholder="Search: Kashyapa, कश्यप, Gandhara…"
            className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm placeholder:text-muted focus:border-gold focus:outline-none sm:w-64"
          />
        </form>
      </div>
    </header>
  );
}

export function Page({ context, children }: { context?: Selection; children: React.ReactNode }) {
  return (
    <>
      <Header context={context} />
      <main id="main" className="mx-auto max-w-6xl px-4 pt-8 pb-24">
        {children}
      </main>
    </>
  );
}
