# simplemaf.com

The SimpleMAF creator site. TypeScript source, unit-tested logic, and a build
that collapses everything into **one self-contained static HTML file** — CSS
and JS inlined, the app icons inlined as data URIs, a Content-Security-Policy
injected at build time. No analytics, no external requests, no backend.

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
src/features/*.ts     one module per section (videos, decoder, calculator,
                      theme, game, stack, links, ⌘K palette)
tests/                vitest suite: calculator math, escaping, URL
                      sanitizing, videos.json normalization, game scoring
.github/workflows/    check → build → deploy to Pages
```

## Updating content

Everything you'd routinely touch lives in [src/config.ts](src/config.ts):

1. **LINKS** – TikTok and Bluesky are set. Still placeholder: `stockd` and
   `prayerwindows` App Store URLs, and `email`. Any link still containing
   `YOUR_` stays inert on the page, so nothing half-filled ever goes live.
2. **VIDEOS** – newest first. Optional per video: `url`, `receipt` (the
   numbers behind the video), `note`, `sources`. Rows with receipts expand
   in place; rows without link to TikTok.
3. **TERMS** – the AI decoder. Add a term, it shows up searchable.
4. **STACK** – gear list. A few entries are educated guesses; swap in the
   real gear.

Push to `main` and CI ships it — if the tests pass.

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

- No analytics, no cookie banner, no external requests except the optional
  same-origin `videos.json` (the page says so, so keep it true).
- Best game score and theme choice live in the visitor's localStorage only.
- Colors are the Prayer Windows theme tokens (`Theme.swift`), nudged only
  where needed to pass WCAG AA contrast in both modes.
- No em-dashes in copy. House style.

## DNS (Squarespace)

Registrar: Squarespace Domains. Records that make the site work:
4 × `A @ → 185.199.108/109/110/111.153` and `CNAME www → mfarah42.github.io`,
plus the pre-existing Email Security TXT preset (SPF `-all` + DMARC reject:
keep it, it stops email spoofing from this domain). The "Squarespace
Defaults" parking preset must stay deleted — re-adding it breaks the site.
