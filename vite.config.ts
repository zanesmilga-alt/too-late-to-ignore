import { defineConfig } from "vite";

// Three pages on one site: the landing page, the stage (/stage) and the explorer (/explore).
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        stage: "stage.html",
        explore: "explore.html",
      },
    },
  },
});
