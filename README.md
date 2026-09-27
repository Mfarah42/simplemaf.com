# simplemaf.com

The SimpleMAF creator site. TypeScript source, unit-tested logic, and a build
that collapses everything into **one self-contained static HTML file** — CSS
and JS inlined, the app icons inlined as data URIs, a Content-Security-Policy
injected at build time. No backend. Google Analytics is opt-in via
src/config.ts and stays entirely inert until a Measurement ID is set.

**Live at [simplemaf.com](https://simplemaf.com)** · deployed by GitHub Actions
to GitHub Pages on every push to `main`, with typecheck + tests as the gate.

## Working on it

```bash
npm install
npm run dev        # Vite dev server with HMR
npm run check      # typecheck + tests (the same gate CI runs)
npm run build      # dist/index.html — the entire site as one file
npm run preview    # serve the built artifact locally
```

Layout:

```
index.html            markup template (sections, no logic)
src/config.ts         ALL editable content: LINKS, VIDEOS, TERMS, STACK
src/styles.css        the Prayer Windows design language, light + dark
src/lib/dom.ts        esc(), safeUrl() allowlist, storage helpers
src/features/*.ts     one module per section (videos, calculator, theme,
                      stack, stats, cadence demo, appstore, links, ⌘K palette)
tests/                vitest suite: calculator math, escaping, URL
                      sanitizing, videos.json normalization, rotation math
.github/workflows/    check → build → deploy to Pages
```

## Updating content

Everything you'd routinely touch lives in [src/config.ts](src/config.ts):

1. **LINKS** – socials, the contact email, and one App Store URL per app.
   Any link still containing `YOUR_` stays inert on the page, so nothing
   half-filled ever goes live.
2. **VIDEOS** – the most-watched videos, highest first. Optional per video:
   `url`, `views` (exact count, shown rounded), `receipt` (the numbers behind
   the video), `note`, `sources`. Rows with receipts expand in place; rows
   without link to TikTok.
3. **STACK** – gear list. A few entries are educated guesses; swap in the
   real gear.

Push to `main` and CI ships it — if the tests pass. The workflow also
rebuilds every Monday so the App Store data on the cards stays current.

### App Store data

`npm run build` first runs `scripts/appstore.mjs`, which asks the public
App Store lookup API for each app's version, update date, and rating and
writes `src/generated/appstore.json`. The JSON is committed as a snapshot so
an offline build still works; a failed fetch keeps the snapshot untouched.

### Share card

`public/og.png` (1200×630) is what iMessage, Bluesky, and link previews
show. Regenerate it from `scripts/og.html` with headless Chrome:
`npm run og`.

### Videos without a rebuild

The page also fetches `videos.json` (same shape as `videos.example.json`,
see the `Video` interface in config.ts). If present next to index.html, it
wins over the inline list. Rows are individually validated and every URL is
scheme-checked, so a malformed row degrades to being skipped, never to XSS.

## Security posture

- **CSP** (build-injected): `default-src 'none'` with narrow carve-outs for
  inline script/style, self/data images, and the same-origin videos.json
  fetch. No external origin is reachable even if content injection slipped in.
- **URL allowlist**: every href/window.open that touches config or
  videos.json data goes through `safeUrl()` (http/https/mailto only).
- **Escaping**: all dynamic HTML goes through `esc()`; both are unit-tested
  against the payloads from the security audit.
- **No headers on GitHub Pages**: `frame-ancestors` can't be delivered via
  meta CSP, so main.ts carries a best-effort frame-buster; residual
  clickjacking risk on a stateless page is accepted.
- **Referrer policy** `no-referrer` + `noopener noreferrer` everywhere.
- Dev-dependency audit is clean (`npm audit`: 0 vulnerabilities).

## House rules baked into the page

- No external requests except Google Analytics (only once a Measurement ID
  is set in config) and the optional
  same-origin `videos.json` (the page says so, so keep it true).
- The theme choice lives in the visitor's localStorage only.
- Colors are the Prayer Windows theme tokens (`Theme.swift`), nudged only
  where needed to pass WCAG AA contrast in both modes.
- No em-dashes in copy. House style.

## DNS (Squarespace)

Registrar: Squarespace Domains. Records that make the site work:
4 × `A @ → 185.199.108/109/110/111.153` and `CNAME www → mfarah42.github.io`,
plus the pre-existing Email Security TXT preset (SPF `-all` + DMARC reject:
keep it, it stops email spoofing from this domain). The "Squarespace
Defaults" parking preset must stay deleted — re-adding it breaks the site.
