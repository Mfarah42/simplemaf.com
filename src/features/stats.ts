import { STATS } from "../config";
import { formatViews } from "./videos";

/** Fill every [data-stat] element from STATS. The markup carries a fallback
    value for the no-JS case, so this only ever overwrites with fresher text. */
export function renderStats(root: ParentNode = document): void {
  const values: Record<string, string> = {
    views: formatViews(STATS.tiktokViews),
    likes: formatViews(STATS.tiktokLikes),
    videos: String(STATS.videos),
    apps: String(STATS.apps),
  };
  root.querySelectorAll<HTMLElement>("[data-stat]").forEach((el) => {
    const v = values[el.dataset["stat"] ?? ""];
    if (v) el.textContent = v;
  });
}

export function initStats(): void {
  renderStats();
}
