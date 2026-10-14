# Open questions

Unresolved scholarly disagreements and brief ambiguities. Items here are **not** stored as fact in `content/`.

Format: `ID — question — context — conservative reading adopted for now — status`.

## Brief / product

- **OQ-001 — Node version.** Brief §0 says Node 20 LTS; Node 20 is end-of-life. Adopted Node 22 LTS (see DECISIONS.md). Status: resolved unless the owner objects.
- **OQ-002 — Database host.** Brief §3.1 allows Supabase or Neon. Needs owner choice before `packages/db` connects to a live database (step 2 will work against a local Postgres + PostGIS). Status: open.
- **OQ-003 — ORM.** Brief allows Prisma or Drizzle. To be decided in step 2 and logged in DECISIONS.md. Status: open.
