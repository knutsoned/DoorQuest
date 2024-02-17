import { defineConfig } from "vite";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (
            id.includes("@babylonjs/core/Engines/engine") ||
            id.includes("@babylonjs/core/scene")
          ) {
            return "BabylonCore";
          } else if (id.includes("ammojs-typed")) {
            return "AmmoJS";
          }
        },
      },
    },
  },
});
