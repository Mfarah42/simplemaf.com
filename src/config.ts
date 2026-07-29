/* ==================================================================
   EDIT ME: everything an update touches lives in this one file.
   ================================================================== */

/** Handles and links. Anything still containing YOUR_ stays inert on the page. */
export const LINKS: Record<string, string> = {
  tiktok: "https://www.tiktok.com/@simplemaf",
  bluesky: "https://bsky.app/profile/simplemaf.bsky.social",
  email: "mailto:YOUR_EMAIL",
  stockd: "https://apps.apple.com/us/app/stockd-smart-grocery-lists/id6761667432",
  prayerwindows: "https://apps.apple.com/us/app/prayer-windows/id6793598476", // in review; link goes live with the app
  cadence: "https://apps.apple.com/us/app/cadence-am-i-on-or-off/id6786077175",
};

export interface ReceiptCell {
  label: string;
  value: string;
}

export interface VideoSource {
  label: string;
  url: string;
}

export interface Video {
  date: string;
  title: string;
  tags?: string;
  /** Direct link to the video. Without it the row links to the TikTok profile. */
  url?: string;
  /** The numbers that wouldn't fit in 45 seconds. */
  receipt?: ReceiptCell[];
  /** The fine print / caveat. */
  note?: string;
  /** Primary sources. */
  sources?: VideoSource[];
}

/** Newest first. Only add receipts with numbers you've verified.
    A videos.json next to index.html overrides this list (see videos.ts). */
export const VIDEOS: Video[] = [
  {
    date: "Jul 28",
    title: "Would you lease an iPhone?",
    tags: "#leasingiphone #apple #klarna #applelease",
  },
  {
    date: "Jul 27",
    title: "Elon's new bank card pays 6%. Here's what it costs you.",
    tags: "#xmoney #elonmusk #privacy",
  },
  {
    date: "Jul 26",
    title: "AI distillation, explained",
    tags: "#techtok #aitools #claude #anthropic",
  },
  {
    date: "Jul 22",
    title: "Have you seen the prices for the new Samsung folds?",
    tags: "#samsungfold #fold8ultra",
  },
  {
    date: "Jul 12",
    title: "Fable 5 extended again? Why?",
    tags: "#anthropic #grok #gpt #ainews",
  },
];


export interface StackItem {
  name: string;
  note: string;
}

export interface StackGroup {
  group: string;
  items: StackItem[];
}

/** Gear list. Swap in whatever you actually use. */
export const STACK: StackGroup[] = [
  {
    group: "Build",
    items: [
      { name: "Xcode + SwiftUI", note: "Every screen in all three apps. UIKit only when SwiftUI genuinely can't." },
      { name: "Claude Code, in the terminal", note: "Scaffolding, refactors, and explaining code I wrote eight months ago." },
      { name: "Apple Foundation Models", note: "The on-device model behind Stockd's list builder. Free, private, occasionally confident and wrong." },
      { name: "Simulator + one real iPhone", note: "Simulator for speed; device for anything touching widgets, notifications, or battery." },
      { name: "Swift Testing", note: "Prayer times get a golden test matrix. That one is non-negotiable." },
    ],
  },
  {
    group: "Film & edit",
    items: [
      { name: "iPhone 16 Pro Max", note: "My phone, my main test device, and my only camera. It's enough." },
      { name: "Screen recordings, not camera", note: "Most “here's the app” footage is a capture from the device or Simulator." },
      { name: "A clip-on lav mic", note: "The phone mic is fine until the room isn't. Audio is the whole video." },
      { name: "Burned-in captions", note: "Most people watch muted. If it isn't on screen, it wasn't said." },
      { name: "Apple Notes for scripts", note: "One page per video, read aloud once. Cuts the retakes in half." },
    ],
  },
  {
    group: "Research",
    items: [
      { name: "Primary sources first", note: "Pricing pages, model cards, filings. Screenshot it with the date visible." },
      { name: "A running claims file", note: "Every number in a video links back to where I found it." },
      { name: "The actual product", note: "Pricing videos get better once you've reached the real checkout screen." },
      { name: "Safari Reader", note: "Strips the popups off the twelve tabs one explainer costs me." },
    ],
  },
  {
    group: "Daily driver",
    items: [
      { name: "Apple silicon Mac", note: "Builds, edits, and forty Safari tabs of Apple documentation." },
      { name: "iOS beta on my main phone", note: "A bad idea I keep having, and the reason I catch things early." },
      { name: "My own apps, daily", note: "Prayer Windows and Stockd are on my home screen. Best QA there is." },
      { name: "Time Machine to a local drive", note: "Unglamorous, offline, and the only backup story I actually trust." },
    ],
  },
];
