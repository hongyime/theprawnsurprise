# Agent Journal — theprawnsurprise

Append-only log of durable decisions and notable findings.

---

**2026-09-17** — Prawn UI visual style applied (PR #181, branch `maintenance/prawn-ui-20260916`).
Decisions: NeoCard wraps main content div only (not Three.js canvas); NeoButton extends
`React.ButtonHTMLAttributes<HTMLButtonElement>` for full prop pass-through including `aria-pressed`.
`.neo-card`/`.neo-btn` CSS placed in `@layer components` so Tailwind utilities override them.
Space Grotesk downloaded as Latin-subset woff2 from fonts.gstatic.com (22 KB).

**2026-09-17** — Fixed pre-existing TypeScript 7 + Vite 8 build breakage alongside the UI PR.
Root causes: (1) `@types/three` v0.185.1 exports field caused bundler-mode to refuse following
`export * from "./src/Three.js"` sub-paths → fixed via `tsconfig.json` paths override pointing
directly to `@types/three/index.d.ts`; (2) `framer-motion`, `lucide-react`, `@types/three`
node_modules were partially installed (missing `.d.ts` files and sub-directories) → fixed by
force-reinstalling each package; (3) `motion-dom`/`motion-utils` (framer-motion transitive deps)
were absent → added as direct deps to guarantee they are installed.

**2026-10-01** — Centered headings and fixed d4/d6/d8/d10 rolling plus smooth wheel motion via PR #204, merged to main at ef0c974. All 26 tests and 20 desktop/mobile browser checks passed. Vercel production deployment completed and the live tested bundle was verified. Unrelated edits in this checkout were preserved.

**2026-10-01** — User explicitly requested always-on animations with no checkbox. Removed the toggle in PR #205, merged into main at 8adf9cf. All 26 tests, build, required checks and Vercel production deployment passed.
