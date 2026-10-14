# Open questions

Unresolved scholarly disagreements and brief ambiguities. Items here are **not** stored as fact in `content/`.

Format: `ID — question — context — conservative reading adopted for now — status`.

## Brief / product

- **OQ-001 — Node version.** Brief §0 says Node 20 LTS; Node 20 is end-of-life. Adopted Node 22 LTS (see DECISIONS.md). Status: resolved.
- **OQ-002 — Database host.** Brief §3.1 allows Supabase or Neon. The schema and migrations run on either; tests use PGlite. A host is needed only when the site reads from a live database. Status: open (owner to choose).
- **OQ-003 — ORM.** Drizzle chosen (see DECISIONS.md). Status: resolved.
- **OQ-004 — Phase 1 site data source.** The brief's stack puts Postgres behind the site, and also asks for a static-first deploy. Phase 1 content is small enough to build pages from the validated YAML at build time, with Postgres used for search. To decide in step 5 once page needs are concrete. Status: open.
- **OQ-005 — "≥1 relationship" for every entity.** Brief §4.4 applies this to every Entity. Some Phase 1 stubs (e.g. dynasty founders with only a lineage link) satisfy it via `descendant_of`. Applied as written; revisit if it forces weak edges into the data. Status: applied as written.
- **OQ-006 — Tradition family for Vedic material.** Calling Vedic religion "Hindu" is anachronistic in much scholarship. Modelled as its own `vedic` family; Puranic/sectarian traditions are `hindu`. Status: conservative reading adopted.
- **OQ-007 — `verified` places.** Brief principle 9 defines four classes. Adopted the stricter reading that `verified` needs archaeological or historical evidence, not textual or traditional alone. Status: conservative reading adopted.
