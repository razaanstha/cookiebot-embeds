import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "/src/CookiebotEmbeds.js", // Replace with the path to your entry file
      name: "CookiebotEmbeds", // The name for the global variable (for UMD/IIFE builds)
      fileName: (format) => `cookiebot-embeds.${format}.js`,
      //   formats: ["es", "umd"], // 'umd' format for CommonJS compatibility
    },
  },
});
