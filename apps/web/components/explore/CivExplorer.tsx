"use client";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { CivLink } from "@/lib/phase4/civ";
import { useViewMode } from "@/lib/state/view";
import { ViewToggle } from "./ViewToggle";

function Loading() {
  const t = useTranslations("civ");
  return <div className="grid h-full place-items-center text-muted">{t("loading")}</div>;
}

const TransmissionMap = dynamic(() => import("@/components/3d/TransmissionMap"), {
  ssr: false,
  loading: () => <Loading />,
});

/** The arc map, with the accessible list (rendered on the server) as its equivalent. */
export function CivExplorer({ links, list }: { links: CivLink[]; list: React.ReactNode }) {
  const t = useTranslations("civ");
  const [view, setView, webgl, ready] = useViewMode({ heavy: true });
  return (
    <div>
      <div className="flex justify-end">
        <ViewToggle view={view} setView={setView} webgl={webgl} />
      </div>
      {view === "3d" && (
        <div className="mt-3 h-[24rem] overflow-hidden rounded-xl border border-white/10 sm:h-[30rem]">
          {ready && <TransmissionMap links={links} label={t("mapLabel")} />}
        </div>
      )}
      <div className="mt-4">{list}</div>
    </div>
  );
}
