// Refresh src/generated/appstore.json from the public App Store lookup API.
// Runs before every build (locally and in CI) and on the weekly scheduled
// deploy, so the cards show the real version and update date without a
// config edit. Never fails the build: on any error the committed snapshot
// stays as it is, and an app missing from an otherwise good response keeps
// its previous entry rather than being marked gone by a flaky reply.
import { readFile, writeFile } from "node:fs/promises";

const APPS = {
  quran: 6809227627,
  cadence: 6786077175,
  prayerwindows: 6793598476,
  sweep: 6807645821,
  tinycritic: 6812938189,
  stockd: 6761667432,
};
const OUT = new URL("../src/generated/appstore.json", import.meta.url);

let previous = { apps: {} };
try {
  previous = JSON.parse(await readFile(OUT, "utf8"));
} catch {
  /* first run */
}

try {
  const ids = Object.values(APPS).join(",");
  const res = await fetch(`https://itunes.apple.com/lookup?id=${ids}&country=us`, {
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data.results) || data.results.length === 0) throw new Error("empty results");
  const byId = new Map(data.results.map((r) => [r.trackId, r]));

  const apps = {};
  const missing = [];
  for (const [key, id] of Object.entries(APPS)) {
    const r = byId.get(id);
    if (!r) {
      missing.push(key);
      if (previous.apps?.[key]) apps[key] = previous.apps[key];
      continue;
    }
    apps[key] = {
      version: String(r.version),
      updated: String(r.currentVersionReleaseDate).slice(0, 10),
      rating: Number(r.averageUserRating) || 0,
      ratings: Number(r.userRatingCount) || 0,
    };
  }
  const out = { fetchedAt: new Date().toISOString().slice(0, 10), apps };
  await writeFile(OUT, JSON.stringify(out, null, 2) + "\n");
  console.log(`appstore.json refreshed (${Object.keys(apps).length} apps)` + (missing.length ? `; kept previous entry for: ${missing.join(", ")}` : ""));
} catch (e) {
  console.warn("appstore.json not refreshed, keeping the committed snapshot:", e instanceof Error ? e.message : e);
}
