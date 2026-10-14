import { Cite, Section, VariantTag } from "@/components/cards/ui";
import { ModePage } from "@/components/shell/ModePage";
import { getKala } from "@/lib/content";

export const metadata = { title: "Cosmic time · KĀLA" };

export default async function CosmicPage() {
  const kala = await getKala();
  return (
    <ModePage
      title="Cosmic time"
      intro={
        <>
          <p>
            Many Hindu texts describe time as cycles of ages (yugas) within larger cycles. Different
            texts give different figures, so each account is shown separately.
          </p>
          <p className="mt-2 rounded border border-celestial/40 bg-celestial/5 p-2 text-sm text-celestial">
            Traditional chronology, not historical dating. These cycles cannot be placed on a
            calendar of years BCE/CE.
          </p>
        </>
      }
    >
      {kala.dataset.cosmic.map((m) => (
        <Section key={m.slug} title={kala.nameOf("cosmic", m.slug)}>
          <p className="max-w-3xl">
            {m.summary_beginner}
            <VariantTag kala={kala} variant={m.variant} />
          </p>
          <table className="mt-3 w-full max-w-xl text-left text-sm">
            <caption className="sr-only">Lengths of the four yugas, in divine years</caption>
            <thead className="text-muted">
              <tr>
                <th className="py-1 font-normal">Yuga</th>
                <th className="py-1 font-normal">Divine years (incl. twilights)</th>
                <th className="py-1 font-normal">Twilights</th>
              </tr>
            </thead>
            <tbody>
              {m.yugas.map((y) => (
                <tr key={y.yuga} className="border-t border-white/10">
                  <td className="py-1.5 capitalize">{y.yuga}</td>
                  <td className="py-1.5">{y.divine_years.toLocaleString("en")}</td>
                  <td className="py-1.5 text-muted">
                    {y.dawn_divine_years !== undefined
                      ? `${y.dawn_divine_years} + ${y.dusk_divine_years ?? 0}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="mt-3 space-y-1 text-sm">
            <li>Mahayugas in one manvantara: {m.mahayugas_per_manvantara}</li>
            <li>
              Manvantaras in one kalpa:{" "}
              {m.manvantaras_per_kalpa ?? (
                <span className="text-muted">not stated in this text</span>
              )}
            </li>
            {m.mahayugas_per_kalpa && (
              <li>Mahayugas in a day of Brahma: {m.mahayugas_per_kalpa}</li>
            )}
            {m.sandhi_note && <li className="text-muted">{m.sandhi_note}</li>}
          </ul>
          <p className="mt-2">
            <Cite refs={m.references} kala={kala} />
          </p>
        </Section>
      ))}
    </ModePage>
  );
}
