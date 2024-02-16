import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { AmmoJSPlugin } from "@babylonjs/core/Physics/Plugins/ammoJSPlugin";
import "@babylonjs/core/Physics/physicsEngineComponent";

import Ammo from "ammojs-typed";
import { CreateSceneClass } from "../createScene";

import { Start } from "./start";

// adapted from ../scenes/physicsWithAmmo.ts
export class MainScene implements CreateSceneClass {
  createScene = async (
    engine: Engine,
    canvas: HTMLCanvasElement
  ): Promise<Scene> => {
    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new Scene(engine);

    // with webpack, just do Ammo() but with vite, it's Ammo.call(this)
    // https://forum.babylonjs.com/t/using-ammojs-with-babylon/26413/8
    const ammo = await Ammo.call(this);
    scene.enablePhysics(null, new AmmoJSPlugin(true, ammo));

    const start = new Start();
    start.preparing(scene);

    return scene;
  };
}

export default new MainScene();
