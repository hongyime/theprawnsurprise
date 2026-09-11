# AUDIT_LOG.md

## Reconnaissance - 20260524

### REPO_CONTEXT

| Field | Value |
|-------|-------|
| Project Name | theprawnsurprise |
| Language(s) | JavaScript/TypeScript |
| Framework(s) | React |
| Core Purpose | Personal project |
| Test Runner | none detected |
| Dependency File | package.json (9 deps + 10 devDeps) |
| Rough Complexity | Medium (13 source files) |
| Existing Snyk Results | NONE |
| Snyk Scan Needed | NO (Dependabot configured for ongoing monitoring) |

### Phase 1 - Security Audit

SCA: 9 production + 10 dev dependencies. Most post-date internal knowledge cutoff.
SAST: 1 potential secret patterns detected.
Snyk: NOT TRIGGERED (Dependabot provides equivalent coverage)
Status: REVIEW NEEDED

## Portfolio upkeep task list — 2026-09-11

- [x] Measure the current build and numbered 3D dice, including external font/glyph requests.
- [x] Replace general-purpose 3D text/float helpers with a small numeric-label implementation preserving real meshes and motion.
- [x] Verify face placement, numeric outcomes, reduced-motion behavior, disposal, keyboard controls and transferred assets.
- [ ] Pass hosted checks, release to the existing production project, and update both portfolio plan formats.

### Dice bandwidth verification — 2026-09-11

The default Dice tab previously loaded general-purpose text/float helpers, blob workers and four jsDelivr glyph/font requests. Numeric faces now use small local canvas textures and a small frame callback; Three.js geometry, animated rolls, outcomes, keyboard controls and reduced-motion handling remain. Removing Drei also removed 40 installed packages. Labels derive their position and normal from each actual polygon, correcting d10 labels that previously floated about 0.274 model units above their face and tilted about 5.8 degrees. The initial result now has a camera-facing orientation without waiting for a roll.

The production build passes type checking. Its JavaScript decreases from 1,360,061 to 1,244,548 bytes; gzip level 6 decreases from 387,331 to 346,181 bytes (10.62%). This is a per-build estimate, not measured monthly Vercel savings. Space Grotesk web fonts and the existing Prawn styling remain. The dependency audit reports zero advisories.

Thirteen tests pass: five existing interaction/timer checks plus eight face geometry/orientation checks. The test include pattern now covers both .test.ts and .test.tsx files; an initial run selected only the five older checks, which was corrected before publication. Real browser checks pass at 1440, 390 and 320 px for dice, wheel and 8-ball, with no overflow, failed requests or JavaScript errors. A separate reduced-motion GPU check draws all ten numeric labels, verifies deterministic d4/d6/d8/d10 outcomes, and keeps allocations at 15 textures/44 buffers after 24 type changes. No glyph CDN or blob-worker requests remain. Production release verification follows.
