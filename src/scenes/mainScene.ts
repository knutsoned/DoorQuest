import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { AmmoJSPlugin } from "@babylonjs/core/Physics/Plugins/ammoJSPlugin";
import "@babylonjs/core/Physics/physicsEngineComponent";

import Ammo from "ammojs-typed";
import { CreateSceneClass } from "../createScene";

import { Config } from "../config";

import { Start } from "../game/start";

// adapted from ../scenes/physicsWithAmmo.ts
export class MainScene implements CreateSceneClass {
  createScene = async (
    engine: Engine,
    canvas: HTMLCanvasElement
  ): Promise<Scene> => {
    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new Scene(engine);

    /* Ed. note
    with webpack, just do Ammo() but with vite, it's Ammo.call(this)
    https://forum.babylonjs.com/t/using-ammojs-with-babylon/26413/8

    also could have just used another physics engine since BabylonJS has a plugin
    architecture where you supply the engine here and use it indirectly

    I just think it's super funny to take Bullet and transpile it to WASM

    we really should be working on a Web Arcade Cabinet if we're going to be
    supporting assembly language
    */
    const ammo = await Ammo.call(this);
    scene.enablePhysics(null, new AmmoJSPlugin(true, ammo));

    /* Ed. note
    all this class does is create the actual scene object plus physics engine
    the Start class actually runs the game (tried to make it obvious since a
      lot of code I look at... it's not always clear)

    with way more time, there would be a standard way to define what the
    actual game part is, with clean separation from the engine

    that way we could make one configuration for BabylonJS, another for THREE,
    one for exporting a Godot ECMAScript mod, one for ts-defold...
    */
    const start = new Start();
    await start.preparing(scene, Config, canvas);

    return scene;
  };
}

export default new MainScene();
