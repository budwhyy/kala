"use client";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/** Each language is named in itself, so a visitor can always find their own. */
const LABEL: Record<string, string> = { en: "English", hi: "हिन्दी" };

/**
 * Switches language and stays on the same page: the path and the whole query string
 * (?entity=, ?view=…) are kept. The current language is marked with aria-current.
 */
export function LanguageSwitcher() {
  const t = useTranslations("lang");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useSearchParams();
  const query = Object.fromEntries(params.entries());

  return (
    <nav aria-label={t("label")} className="flex items-center gap-1 text-sm">
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && (
            <span aria-hidden className="text-muted">
              |
            </span>
          )}
          <Link
            prefetch={false}
            href={{ pathname, query }}
            locale={l}
            lang={l}
            hrefLang={l}
            aria-current={l === locale ? "true" : undefined}
            className={`rounded px-1.5 py-0.5 ${
              l === locale ? "bg-white/10 text-gold" : "text-ink/80 hover:text-ink"
            }`}
          >
            {LABEL[l]}
          </Link>
        </span>
      ))}
    </nav>
  );
}
