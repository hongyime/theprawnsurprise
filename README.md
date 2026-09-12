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
