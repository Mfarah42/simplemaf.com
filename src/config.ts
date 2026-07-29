/* ==================================================================
   EDIT ME: everything an update touches lives in this one file.
   ================================================================== */

/** Handles and links. Anything still containing YOUR_ stays inert on the page. */
export const LINKS: Record<string, string> = {
  tiktok: "https://www.tiktok.com/@simplemaf",
  bluesky: "https://bsky.app/profile/simplemaf.bsky.social",
  email: "mailto:YOUR_EMAIL",
  stockd: "https://apps.apple.com/app/idYOUR_ID",
  prayerwindows: "https://apps.apple.com/app/idYOUR_ID",
  cadence: "https://apps.apple.com/app/id6786077175", // Cadence: Am I On or Off
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

export interface Term {
  term: string;
  cat: string;
  short: string;
  why: string;
}

/** The AI decoder. Add a term and it appears, filtered and searchable. */
export const TERMS: Term[] = [
  {
    term: "Tokens",
    cat: "Running it",
    short:
      "Models chop what you send (text, images, audio) into small chunks called tokens, then bill by the chunk.",
    why: "Tokens are the unit your bill is measured in, and the model's own reply counts too, usually priced several times higher than your input.",
  },
  {
    term: "Context window",
    cat: "Running it",
    short:
      "How much text a model can hold in view at once: your prompt, attached files, and the conversation so far.",
    why: "Go past it and something gives: an error, or the app quietly trimming old turns. Recall gets patchy well before the limit.",
  },
  {
    term: "Inference",
    cat: "Running it",
    short:
      "Running an already-trained model to get an answer. Training happens beforehand in big expensive batches; inference happens every time you use it.",
    why: "Training costs sit with whoever built the model. Inference is the recurring cost of actually using it, and the part that heats your phone when it runs locally.",
  },
  {
    term: "Hallucination",
    cat: "Running it",
    short:
      "Invented details presented as fact: a citation, quote, or number that does not exist, inside an answer that reads perfectly confidently.",
    why: "Fabricated specifics look identical to real ones, so anything load-bearing has to be checked against the source. Search-grounded tools hallucinate less, not never.",
  },
  {
    term: "AI agent",
    cat: "Running it",
    short:
      "A model given tools and a goal, allowed to take many steps on its own before reporting back.",
    why: "A chatbot's mistake is a bad sentence. An agent's mistake is a sent email, a booked flight, or a real charge on your card.",
  },
  {
    term: "RAG",
    cat: "Running it",
    short:
      "Retrieval-augmented generation: search relevant documents first, then hand them to the model to answer from.",
    why: "It's how a chatbot answers questions about your files or this week's news without being retrained, and how it can show you a source.",
  },
  {
    term: "Parameters (the “B” in 8B)",
    cat: "Models",
    short:
      "The numbers inside a model, learned during training. “8B” means eight billion of them. A rough size, not a quality score.",
    why: "Size decides what fits on your phone versus what needs a datacenter. A small model from this year often beats a huge one from last year.",
  },
  {
    term: "Quantization",
    cat: "Models",
    short:
      "Storing a model's numbers with fewer digits of precision, so it takes less memory and usually runs faster, with some accuracy loss.",
    why: "It's part of why models run on your phone, but it shrinks a file a few times over, not a hundredfold. The rest of the gain comes from better small models.",
  },
  {
    term: "Reasoning model",
    cat: "Models",
    short:
      "A model trained to work through a problem in steps before answering, spending extra time and compute on the hard ones.",
    why: "The extra steps help with math, code, and multi-step logic. They don't make it know your tax law any better, so it can still be confidently wrong.",
  },
  {
    term: "Mixture of experts",
    cat: "Models",
    short:
      "A large model split into specialist sections, with only a few switched on for any given question.",
    why: "It's how a model can be enormous on paper yet answer quickly and cheaply: only a slice of it runs each time.",
  },
  {
    term: "Distillation",
    cat: "Training",
    short:
      "Training a small model on a big model's outputs, so it copies much of the behavior at far lower cost.",
    why: "It's how cheap and on-device models get close to the big ones. The gap tends to show up on the hard cases, at the worst moment.",
  },
  {
    term: "Fine-tuning",
    cat: "Training",
    short:
      "Training an already-trained model further on your own examples, mostly to change how it behaves and sounds rather than what it knows.",
    why: "Cheap enough that anyone can make a model sound like their brand, or like a professional it isn't. It's a poor way to teach new facts. That's what retrieval is for.",
  },
  {
    term: "Benchmark",
    cat: "Business",
    short:
      "A fixed test set used to score models. Useful for comparison, easy to optimize for, rarely resembles what you'll actually ask.",
    why: "Launch-day charts are marketing. The benchmark that matters is your own boring repeated task, run on both models for a week.",
  },
  {
    term: "Open weights",
    cat: "Business",
    short:
      "The trained model file is published for download. Not automatically open source: licenses can restrict use, and the training data stays private.",
    why: "Nobody can revoke a model you've already downloaded. But most are far too big for a phone; running them still means a server.",
  },
  {
    term: "Guardrails",
    cat: "Business",
    short:
      "The filters, system prompts, and rules layered around a model to shape or block certain outputs.",
    why: "It's why the same underlying model refuses in one app and answers in another. The limits are usually the product decision, not the model.",
  },
  {
    term: "Training data",
    cat: "Privacy",
    short:
      "Everything a model learned from (text, images, code, human feedback), gathered by scraping, licensing, or from people using the product.",
    why: "This is the whole copyright and consent fight. Collection doesn't stop at launch: your chats can train the next version.",
  },
  {
    term: "On-device vs. cloud",
    cat: "Privacy",
    short:
      "On-device runs the model on your own chip; cloud sends your request to a company's servers. Plenty of apps quietly use both.",
    why: "On-device works in airplane mode and keeps your data on your phone, but only if the app never falls back to the cloud.",
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
