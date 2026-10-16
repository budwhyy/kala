import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Suspense } from "react";
import type { Selection } from "@/lib/state/selection";
import { HeaderSearch } from "./HeaderSearch";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ModeSwitcher } from "./ModeSwitcher";

export function Header({ context }: { context?: Selection }) {
  return (
    <header className="z-20 sm:sticky sm:top-0 border-b border-white/10 bg-void/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link prefetch={false} href="/" lang="en" className="text-xl tracking-[0.3em] text-gold">
          KĀLA
        </Link>
        <Suspense fallback={<div className="h-8" />}>
          <ModeSwitcher context={context} />
        </Suspense>
        <div className="ml-auto flex w-full flex-wrap items-center gap-x-4 gap-y-2 sm:w-auto">
          <Suspense fallback={<div className="h-8" />}>
            <LanguageSwitcher />
          </Suspense>
          <HeaderSearch />
        </div>
      </div>
    </header>
  );
}

export function Page({ context, children }: { context?: Selection; children: React.ReactNode }) {
  const locale = useLocale();
  const t = useTranslations("notice");
  return (
    <>
      <Header context={context} />
      <main id="main" className="mx-auto max-w-6xl px-4 pt-8 pb-24">
        {children}
        {locale !== "en" && (
          // Content records (summaries, explanations, source passages) are not translated yet.
          <p
            data-testid="content-language-notice"
            className="mt-16 border-t border-white/10 pt-4 text-sm text-muted"
          >
            {t("contentEnglish")}
          </p>
        )}
      </main>
    </>
  );
}
