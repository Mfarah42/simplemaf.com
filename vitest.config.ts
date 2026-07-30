import { defineConfig } from "vitest/config";

// jsdom so DOM-facing modules (reveal, renderers) are testable
export default defineConfig({
  test: { environment: "jsdom" },
});
