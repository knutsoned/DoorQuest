import { defineConfig, type PluginOption } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
//import wasm from "vite-plugin-wasm";
//import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  base: "./",
  /*
  optimiseDeps: {
    exclude: ["@babylonjs/havok"],
  },
  plugins: [wasm(), topLevelAwait()],
  */
  plugins: [visualizer() as PluginOption],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("@babylonjs/core")) {
            return "BabylonCore";
          } else if (id.includes("ammojs-typed")) {
            return "AmmoJS";
          }
        },
      },
    },
  },
});
