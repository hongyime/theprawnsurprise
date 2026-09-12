# The Prawn Surprise

A collection of playful decision tools in The Prawn Projects style: white, black and gray, Space Grotesk, bold borders and offset shadows.

## Features

- **Polyhedral Dice Roller**: Three.js dice (d4, d6, d8, d10) with animated rolls. Changing dice cancels the previous roll.
- **Chaos Spinner Wheel**: A dynamic, customizable wheel for random selection with up to 10 options.
- **Magic 8-Ball**: A classic fortune-telling tool with an animated answer window.
- Every tool supports mouse, touch and keyboard activation, announces its result, and respects reduced-motion preferences.

## Tech Stack

- **Framework**: React + TypeScript (Vite)
- **Styling**: Tailwind CSS compiled by PostCSS at build time; no browser Tailwind compiler or external JavaScript import map
- **3D rendering**: Three.js with React Three Fiber and Drei
- **Animation**: Framer Motion
- **Icons**: Lucide React

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

The build includes TypeScript validation. Run `npm test` for component regressions covering abandoned rolls, switching tools and answer timing. The tests isolate GPU rendering; verify the real dice, wheel and 8-ball in a browser on desktop and mobile before a release. GitHub runs the interaction tests and production build on relevant pushes and pull requests.

These tools run in the browser and do not poll Supabase or a server API. Fonts remain external resources. Vercel serves the compiled static assets with immutable caching for hashed asset URLs.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).

2026-09-12: opt in to the shared activity-branch heartbeat. Weekly repository activity moves to automation/heartbeat, which Vercel is configured not to deploy. Normal app branches keep deploying. Local and hosted validation, production release, and first manual heartbeat verification are pending. The 60-day inactivity behavior requires longer observation. No application data or collection schedules are changed.

2026-09-12 heartbeat validation passed locally. Source policy tests and workflow parsing pass; the application pilot builds pass. Hosted PR checks, production matching and the first branch heartbeat are the next release gates. No broad sync or disabled workflow reactivation was run.

2026-09-12 required-check rollout task list: verify current production and workflows; consolidate unit/type/build validation under Build on every PR/main update; install the shared exact-head bot policy while leaving its workflows disabled; repair shared protected-branch config PRs; verify hosted releases before configuring required Build/Vercel checks; verify blocked and passing PR behavior plus heartbeat compatibility and update the portfolio report. The heartbeat pilot is already released. This patch changes validation/maintenance configuration only; application source, dependency versions, question records and Vercel asset configuration remain unchanged. Older app-check workflows are retained for manual diagnostics. Required branch checks and bot reactivation have not yet been configured.

2026-09-12 local validation passes: locked install, 13 interaction/geometry tests, type checking and production build. Application code, data, dependencies and Vercel configuration are byte-preserved. The shared checked bot policy is installed but its workflows remain disabled; required Build/Vercel rules will be enabled only after hosted and production verification. Default CodeQL completion is included in the policy triggers.
