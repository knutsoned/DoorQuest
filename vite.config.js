import { defineConfig } from "vite";
//import wasm from "vite-plugin-wasm";
//import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  /*
  optimiseDeps: {
    exclude: ["@babylonjs/havok"],
  },
  plugins: [wasm(), topLevelAwait()],
  */
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
          } else if (
            id.includes("@babylonjs/core/Loading") ||
            id.includes("@babylonjs/loaders")
          ) {
            return "BabylonLoaders";
          } else if (id.includes("ammojs-typed")) {
            return "AmmoJS";
          }
        },
      },
    },
  },
});
