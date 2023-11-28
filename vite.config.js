const path = require("path");
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/CookiebotEmbeds.js"),
      name: "CookiebotEmbeds", // The name for the global variable (for UMD/IIFE builds)
      fileName: (format) => `cookiebot-embeds.${format}.js`,
    },
    rollupOptions: {},
  },
});
