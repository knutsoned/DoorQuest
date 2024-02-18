import { Engine } from "@babylonjs/core/Engines/engine";
import { WebGPUEngine } from "@babylonjs/core/Engines/webgpuEngine";
import { getSceneModule } from "./createScene";

import "nes.css/css/nes.min.css";

import "../style.scss";

export const babylonInit = async (): Promise<void> => {
  const createSceneModule = getSceneModule();
  const engineType =
    location.search.split("engine=")[1]?.split("&")[0] || "webgl";
  // Execute the pretasks, if defined
  await Promise.all(createSceneModule.preTasks || []);
  // Get the canvas element
  const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
  // Generate the BABYLON 3D engine
  let engine: Engine;
  if (engineType === "webgpu") {
    const webGPUSupported = await WebGPUEngine.IsSupportedAsync;
    if (webGPUSupported) {
      // You can decide which WebGPU extensions to load when creating the engine. I am loading all of them
      await import("@babylonjs/core/Engines/WebGPU/Extensions/");
      const webgpu = (engine = new WebGPUEngine(canvas, {
        adaptToDeviceRatio: true,
        antialias: true,
      }));
      await webgpu.initAsync();
      engine = webgpu;
    } else {
      engine = new Engine(canvas, true);
    }
  } else {
    engine = new Engine(canvas, true);
  }

  // Create the scene
  let scene = await createSceneModule.createScene(engine, canvas);

  // JUST FOR TESTING. Not needed for anything else
  //(window as any).scene = scene;

  // Register a render loop to repeatedly render the scene
  engine.runRenderLoop(async function () {
    /*
    // @ts-ignore
    if (window.gameOver) {
      // @ts-ignore
      window.gameOver = false;

      // Ed. note: this feels like the wrong way to do this
      scene.dispose();
      scene = await createSceneModule.createScene(engine, canvas);
    }
    */
    scene.render();
  });

  // Watch for browser/canvas resize events
  window.addEventListener("resize", function () {
    engine.resize();
  });
};

babylonInit().then(() => {
  // scene started rendering, everything is initialized
});
