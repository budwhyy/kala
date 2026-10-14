"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { GROUP_STYLE, type CEdge, type CNode } from "@/lib/graph/constellation";
import { layoutInWorker, type Positions } from "@/lib/graph/force";
import { tracePaths, VERB } from "@/lib/graph/trace";
import { useReducedMotion, useViewMode } from "@/lib/state/view";
import { ViewToggle } from "./ViewToggle";

const Constellation = dynamic(() => import("@/components/3d/GenealogyConstellation"), {
  ssr: false,
  loading: () => <Loading />,
});

function Loading() {
  return (
    <div className="grid h-full place-items-center text-muted">Arranging the constellation…</div>
  );
}

export function GenealogyExplorer({
  nodes,
  edges,
  variantNames,
  list,
}: {
  nodes: CNode[];
  edges: CEdge[];
  variantNames: Record<string, string>;
  /** Server-rendered list view (the 2D equivalent). */
  list: ReactNode;
}) {
  const [view, setView, webgl] = useViewMode();
  const reducedMotion = useReducedMotion();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selected = params.get("entity");
  const target = params.get("trace");
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [positions, setPositions] = useState<Positions | null>(null);

  const bySlug = useMemo(() => new Map(nodes.map((n) => [n.slug, n])), [nodes]);
  const visibleEdges = useMemo(
    () => edges.filter((e) => !(e.variant && hidden.has(e.variant))),
    [edges, hidden],
  );
  const variants = useMemo(
    () => [...new Set(edges.map((e) => e.variant).filter((v): v is string => Boolean(v)))],
    [edges],
  );

  useEffect(() => {
    if (view !== "3d") return;
    let live = true;
    layoutInWorker({
      nodes: nodes.map((n) => n.slug),
      links: edges.map((e) => [e.from, e.to]),
    }).then((p) => live && setPositions(p));
    return () => {
      live = false;
    };
  }, [view, nodes, edges]);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const paths = useMemo(
    () =>
      selected && target && selected !== target
        ? tracePaths(visibleEdges, selected, target, { maxPaths: 4 })
        : [],
    [visibleEdges, selected, target],
  );
  const highlight = useMemo(() => {
    const n = new Set<string>();
    const e = new Set<string>();
    for (const p of paths)
      for (const s of p) {
        n.add(s.from);
        n.add(s.to);
        e.add(s.relationship.id);
      }
    return { nodes: n, edges: e };
  }, [paths]);

  const node = selected ? bySlug.get(selected) : undefined;

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <Legend />
        <div className="ml-auto">
          <ViewToggle view={view} setView={setView} webgl={webgl} />
        </div>
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_24rem]">
        <div>
          {view === "3d" ? (
            <div className="h-[24rem] rounded-xl border border-white/10 bg-gradient-to-b from-indigo/30 to-void sm:h-[34rem]">
              {positions ? (
                <Constellation
                  nodes={nodes}
                  edges={visibleEdges}
                  positions={positions}
                  selected={selected}
                  highlight={highlight}
                  onSelect={(slug) => setParam("entity", slug)}
                  reducedMotion={reducedMotion}
                />
              ) : (
                <Loading />
              )}
            </div>
          ) : (
            list
          )}
          {variants.length > 0 && (
            <fieldset className="mt-4 rounded-lg border border-celestial/30 p-3 text-sm">
              <legend className="px-1 text-celestial">Accounts shown</legend>
              <p className="mb-2 text-muted">
                Claims that belong to one text can be hidden. Claims shared across the sources are
                always shown.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {variants.map((v) => (
                  <label key={v} className="inline-flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={!hidden.has(v)}
                      onChange={() => {
                        const next = new Set(hidden);
                        if (next.has(v)) next.delete(v);
                        else next.add(v);
                        setHidden(next);
                      }}
                    />
                    {variantNames[v] ?? v}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-white/10 p-4">
            {node ? (
              <>
                <p className="text-xs tracking-[0.2em] text-muted uppercase">Selected</p>
                <h2 className="text-2xl text-gold">{node.label}</h2>
                {node.sub && <p className="text-ink/75">{node.sub}</p>}
                <p className="mt-2 text-sm">{node.summary}</p>
                <Link
                  href={`/entity/${node.slug}`}
                  className="mt-2 inline-block text-sm text-celestial underline decoration-celestial/40 underline-offset-2 hover:decoration-celestial"
                >
                  Open full card →
                </Link>
              </>
            ) : (
              <p className="text-sm text-muted">
                Select a figure — click a star, use the list, or search — to see its card and trace
                its connections.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-white/10 p-4">
            <h2 className="text-lg text-gold">Trace a connection</h2>
            <PickFigure
              label="From"
              nodes={nodes}
              value={selected}
              onChange={(s) => setParam("entity", s)}
            />
            <PickFigure
              label="To"
              nodes={nodes}
              value={target}
              onChange={(s) => setParam("trace", s)}
            />
            <div aria-live="polite" className="mt-3">
              {selected && target && paths.length === 0 && (
                <p className="text-sm text-muted">
                  No connection found in the accounts shown. KĀLA only links figures where a source
                  makes the connection.
                </p>
              )}
              {paths.map((p, i) => (
                <ol key={i} className="mt-3 space-y-2 border-l border-gold/40 pl-3">
                  {paths.length > 1 && <p className="text-xs text-muted">Route {i + 1}</p>}
                  {p.map((s) => {
                    const r = s.relationship;
                    return (
                      <li key={r.id} className="text-sm">
                        <span className="text-ink">{bySlug.get(r.from)?.label}</span>{" "}
                        <span className="text-muted">{VERB[r.type]}</span>{" "}
                        <span className="text-ink">{bySlug.get(r.to)?.label}</span>
                        {r.variant && (
                          <span className="ml-1.5 rounded border border-celestial/40 px-1 text-[11px] text-celestial">
                            {variantNames[r.variant] ?? r.variant}
                          </span>
                        )}
                        <p className="text-ink/80">{r.explanation}</p>
                        <p className="text-xs text-muted">
                          {r.cites.map((c, j) => (
                            <span key={j}>
                              {j > 0 && "; "}
                              <Link href={c.href} className="underline decoration-dotted">
                                {c.text}
                              </Link>
                            </span>
                          ))}
                        </p>
                      </li>
                    );
                  })}
                </ol>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PickFigure({
  label,
  nodes,
  value,
  onChange,
}: {
  label: string;
  nodes: CNode[];
  value: string | null;
  onChange: (slug: string | null) => void;
}) {
  const id = `pick-${label.toLowerCase()}`;
  return (
    <label htmlFor={id} className="mt-2 flex items-center gap-2 text-sm">
      <span className="w-10 text-muted">{label}</span>
      <select
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full rounded border border-white/15 bg-void px-2 py-1"
      >
        <option value="">Choose a figure…</option>
        {[...nodes]
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((n) => (
            <option key={n.slug} value={n.slug}>
              {n.label}
            </option>
          ))}
      </select>
    </label>
  );
}

function Legend() {
  return (
    <ul aria-label="Legend" className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/80">
      {Object.values(GROUP_STYLE).map((g) => (
        <li key={g.label} className="inline-flex items-center gap-1.5">
          <span
            className="inline-block size-2.5 rounded-full"
            style={{ background: `var(${g.token})` }}
          />
          {g.label}
        </li>
      ))}
      <li className="inline-flex items-center gap-1.5">
        <span className="inline-block h-0.5 w-4 bg-gold" /> family
      </li>
      <li className="inline-flex items-center gap-1.5">
        <span className="inline-block h-0.5 w-4 bg-copper" /> story
      </li>
      <li className="inline-flex items-center gap-1.5">
        <span className="inline-block h-0.5 w-4 bg-celestial" /> spiritual
      </li>
    </ul>
  );
}
