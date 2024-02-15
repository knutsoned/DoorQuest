import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";

// Change this import to check other scenes
// any file in the scenes folder should do
//import { DefaultSceneWithTexture } from "./scenes/defaultWithTexture";
//import { PhysicsSceneWithAmmo } from "./scenes/physicsWithAmmo";
import { MainScene } from "./game/mainScene";

export interface CreateSceneClass {
  createScene: (engine: Engine, canvas: HTMLCanvasElement) => Promise<Scene>;
  preTasks?: Promise<unknown>[];
}

export interface CreateSceneModule {
  default: CreateSceneClass;
}

export const getSceneModule = (): CreateSceneClass => {
  //return new DefaultSceneWithTexture();
  return new MainScene();
};
