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
          if (
            id.includes("@babylonjs/core/Loading") ||
            id.includes("@babylonjs/loaders")
          ) {
            return "BabylonLoaders";
          } else if (
            id.includes("@babylonjs/core/scene") ||
            id.includes("@babylonjs/core/Misc") ||
            id.includes("@babylonjs/core/Maths")
          ) {
            return "BabylonSceneMiscMaths";
          } else if (id.includes("@babylonjs/core/Engines")) {
            return "BabylonEngines";
          } else if (id.includes("@babylonjs/core/Materials")) {
            return "BabylonMaterials";
          } else if (id.includes("@babylonjs/core/Meshes")) {
            return "BabylonMeshes";
          } else if (id.includes("@babylonjs")) {
            return "BabylonCore";
          } else if (id.includes("ammojs-typed")) {
            return "AmmoJS";
          }
        },
      },
    },
  },
});
