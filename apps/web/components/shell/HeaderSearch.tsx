"use client";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

/** Header search box. Submits through the locale-aware router, so it works under /hi too. */
export function HeaderSearch() {
  const t = useTranslations("header");
  const locale = useLocale();
  const router = useRouter();
  return (
    <form
      action={locale === "en" ? "/search" : `/${locale}/search`}
      role="search"
      className="w-full sm:w-auto"
      onSubmit={(e) => {
        e.preventDefault();
        const q = new FormData(e.currentTarget).get("q");
        router.push(`/search?q=${encodeURIComponent(typeof q === "string" ? q : "")}`);
      }}
    >
      <label htmlFor="site-search" className="sr-only">
        {t("searchLabel")}
      </label>
      <input
        id="site-search"
        name="q"
        type="search"
        placeholder={t("searchPlaceholder")}
        className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm placeholder:text-muted focus:border-gold focus:outline-none sm:w-64"
      />
    </form>
  );
}
