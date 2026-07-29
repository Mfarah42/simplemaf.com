# simplemaf.com (working title)

One static HTML file, no build step, no backend. The whole site is `index.html`
plus the three app icons in `assets/`.

## Fill in before publishing

Open `index.html` and search for `EDIT ME`. There are four blocks at the top of
the `<script>` tag:

1. **LINKS** – TikTok and Bluesky are already set. Still needed:
   - `stockd` and `prayerwindows` App Store URLs (find them in App Store
     Connect, or share the app from the App Store app and copy the link)
   - `email` for the brand-contact button
   Any link still containing `YOUR_` is left dead on the page, so nothing
   half-filled ever goes live.
2. **VIDEOS** – the explainer list. Newest first. Optional per video:
   `url` (direct link), `receipt` (the numbers behind the video), `note`,
   `sources`. Rows with receipts expand in place; rows without link to TikTok.
3. **TERMS** – the AI decoder. Add a term, it shows up searchable.
4. **STACK** – gear list. A few entries are educated guesses marked by their
   wording; swap in your real gear.

## Updating videos without editing HTML

`index.html` also tries to fetch `videos.json` (same shape as
`videos.example.json`). If it exists, it wins over the inline list. So you can:

- edit `videos.json` by hand (30 seconds, no HTML involved), or
- have a scheduled job (GitHub Action, shortcut, anything) regenerate
  `videos.json`. The page needs no changes for that.

Note: the fetch only works when the site is served over http(s), not when
opening the file directly. GitHub Pages works fine (you already host the
Cadence site at Mfarah42/cadence the same way).

## Hosting

It's one file plus a folder. GitHub Pages is the obvious choice:
new repo, drop in `index.html`, `assets/`, optionally `videos.json`,
enable Pages. A custom domain plugs into Pages settings later.

## House rules baked into the page

- No analytics, no cookie banner, no external requests except the optional
  `videos.json` (the page says so, so keep it true).
- Best game score and theme choice live in the visitor's localStorage only.
- Colors are the Prayer Windows theme tokens (`Theme.swift`), nudged only
  where needed to pass WCAG AA contrast in both modes.
