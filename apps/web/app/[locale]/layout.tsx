import type { Metadata } from "next";
import { EB_Garamond, Noto_Serif_Devanagari, Noto_Serif_Tamil } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

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

const tamil = Noto_Serif_Tamil({
  subsets: ["tamil"],
  variable: "--font-tamil",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: "KĀLA", description: t("description") };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "a11y" });

  return (
    <html lang={locale} className={`${latinSerif.variable} ${devanagari.variable} ${tamil.variable}`}>
      <body className="min-h-dvh font-serif antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded focus:bg-gold focus:px-3 focus:py-2 focus:text-void"
        >
          {t("skipToContent")}
        </a>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
