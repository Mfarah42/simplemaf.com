/* ==================================================================
   EDIT ME: everything an update touches lives in this one file.
   ================================================================== */

/** Handles and links. Anything still containing YOUR_ stays inert on the page. */
export const LINKS: Record<string, string> = {
  tiktok: "https://www.tiktok.com/@simplemaf",
  bluesky: "https://bsky.app/profile/simplemaf.bsky.social",
  email: "mailto:SimpleMafs@gmail.com",
  stockd: "https://apps.apple.com/us/app/stockd-smart-grocery-lists/id6761667432",
  prayerwindows: "https://apps.apple.com/us/app/prayer-windows-salah-times/id6793598476",
  cadence: "https://apps.apple.com/us/app/cadence-am-i-on-or-off/id6786077175",
  quran: "https://apps.apple.com/us/app/quran-madinah-mushaf-audio/id6809227627",
  sweep: "https://apps.apple.com/us/app/sweep-street-sweeping-alerts/id6807645821",
  tinycritic: "https://apps.apple.com/us/app/tiny-critic-baby-food-diary/id6812938189",
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
  /** Exact view count. Shown rounded (1.2M, 54.6K) next to the tags. */
  views?: number;
  /** The numbers that wouldn't fit in 45 seconds. */
  receipt?: ReceiptCell[];
  /** The fine print / caveat. */
  note?: string;
  /** Primary sources. */
  sources?: VideoSource[];
}

/** Most watched first. Only add receipts with numbers you've verified.
    A videos.json next to index.html overrides this list (see videos.ts). */
export const VIDEOS: Video[] = [
  {
    date: "Nov 2025",
    title: "It's been fun, PS5",
    tags: "#steammachine #playstation #techtok",
    url: "https://www.tiktok.com/@simplemaf/video/7573522930324294967",
    views: 1_200_000,
  },
  {
    date: "Aug 2026",
    title: "Claude adds a watermark to everything it generates",
    tags: "#claude #anthropic #watermark #ainews",
    url: "https://www.tiktok.com/@simplemaf/video/7672906094364151071",
    views: 974_700,
  },
  {
    date: "Jul 2026",
    title: "5 products worth every penny",
    tags: "#worthit #personalfinance #claude",
    url: "https://www.tiktok.com/@simplemaf/video/7659145009140190495",
    views: 499_600,
  },
  {
    date: "Sep 2026",
    title: "Meta Muse trains on your data by default. Turn it off.",
    tags: "#metamuse #aiagent #privacy #technews",
    url: "https://www.tiktok.com/@simplemaf/video/7688576331314924831",
    views: 100_600,
  },
  {
    date: "Sep 2026",
    title: "iPhone 18 Pro Max vs iPhone 16 Pro Max",
    tags: "#iphone18promax #camerareview #iphoneupgrade",
    url: "https://www.tiktok.com/@simplemaf/video/7687436220527299870",
    views: 54_600,
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
