/* ==================================================================
   EDIT ME: everything an update touches lives in this one file.
   ================================================================== */

/** Handles and links. Anything still containing YOUR_ stays inert on the page. */
export const LINKS: Record<string, string> = {
  tiktok: "https://www.tiktok.com/@simplemaf",
  bluesky: "https://bsky.app/profile/simplemaf.bsky.social",
  email: "mailto:YOUR_EMAIL",
  stockd: "https://apps.apple.com/us/app/stockd-smart-grocery-lists/id6761667432",
  prayerwindows: "https://apps.apple.com/us/app/prayer-windows/id6793598476",
  cadence: "https://apps.apple.com/us/app/cadence-am-i-on-or-off/id6786077175",
};

/** Google Analytics 4. Paste the Measurement ID from
    Admin > Data Streams > your web stream (looks like G-XXXXXXXXXX).
    While it is empty or still the placeholder, no analytics script loads and
    the page makes no third-party requests at all. */
export const ANALYTICS = {
  measurementId: "G-7R2W4LPMZN",
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


export interface GearItem {
  emoji: string;
  name: string;
  note: string;
}

/** The gear, for real. No affiliate links. */
export const STACK: GearItem[] = [
  { emoji: "💻", name: "M2 MacBook Pro", note: "Builds, edits, and forty Safari tabs of Apple docs." },
  { emoji: "📱", name: "iPhone 16 Pro Max", note: "Main phone, test device, and the TikTok camera." },
  { emoji: "🎙️", name: "DJI Mic Mini", note: "Clips on. Good audio is the whole video." },
  { emoji: "📷", name: "Sony a7 IV + 24-70mm GM II", note: "The photography rig." },
  { emoji: "🎞️", name: "Fujifilm X-E4", note: "The carry-everywhere camera." },
  { emoji: "🛠️", name: "Xcode + SwiftUI", note: "Every app on this page. Native or nothing." },
  { emoji: "🤖", name: "Claude Code", note: "Pair programmer in the terminal. Most build videos are this." },
  { emoji: "🧠", name: "Apple Foundation Models", note: "Stockd's on-device AI. No server, no API key." },
];
