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

- 2026-09-27: Remove the optional personal security contact and preserve private reporting guidance through a reviewed maintenance pull request.

**2026-10-01** — User authorized direct main publication for centered headings and dice/wheel motion fixes. Use one motion preference with a user opt-in; derive dice completion and visible results from the same animation timeline.

**2026-10-01** — Refined motion policy to match the explicit user request and existing 8-ball behavior: click-triggered animations stay enabled by default even when the OS requests reduced motion. One visible Animate rolls switch disables motion across all toys. Tests cover all 28 die faces, repeated outcomes, cancellation, and smooth landing.

**2026-10-01** — Verified 26 tests, successful production build/typecheck, and 20 desktop/mobile browser checks with real changing canvas frames. OS reduced-motion emulation no longer silently disables requested rolls. Slightly widened camera framing after a tumble screenshot exposed a near-edge cube corner.

**2026-10-01** — GitHub rejected direct main publication (GH006: PR required plus Build and Vercel checks). PR #204 is the necessary merge route; preserve branch protection and merge after both checks pass. User explicitly reiterated merge into main.
