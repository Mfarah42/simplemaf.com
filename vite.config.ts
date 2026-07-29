import { defineConfig, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

/**
 * Injected at build only (it would break dev HMR's websocket).
 * Everything is inline in the artifact, so: no external scripts, no external
 * styles, images only self/data (the icons become data URIs), and the one
 * allowed network call is the same-origin videos.json fetch.
 */
// NOTE: no frame-ancestors here on purpose. Browsers ignore it in a meta
// CSP (spec drops frame-ancestors/sandbox/report-uri from meta delivery),
// and GitHub Pages cannot send headers. Framing risk is accepted for a
// stateless brochure page; main.ts carries a best-effort frame check.
const CSP = [
  "default-src 'none'",
  "script-src 'unsafe-inline'",
  "style-src 'unsafe-inline'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
].join("; ");

function injectCsp(): Plugin {
  return {
    name: "inject-csp",
    apply: "build",
    transformIndexHtml(html) {
      return html.replace(
        "<meta charset=",
        `<meta http-equiv="Content-Security-Policy" content="${CSP}">\n<meta charset=`,
      );
    },
  };
}

// The whole build collapses into dist/index.html: JS and CSS inlined,
// the three app icons inlined as data URIs. One file, zero requests.
export default defineConfig({
  plugins: [injectCsp(), viteSingleFile()],
  build: {
    assetsInlineLimit: 1024 * 1024,
    modulePreload: false,
    reportCompressedSize: false,
  },
});
