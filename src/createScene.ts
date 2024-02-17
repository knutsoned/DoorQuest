import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";

// Change this import to check other scenes
// any file in the scenes folder should do
//import { FresnelShaderScene } from "./scenes/fresnelShader";
//import { PhysicsSceneWithAmmo } from "./scenes/physicsWithAmmo";
import { MainScene } from "./scenes/mainScene";

export interface CreateSceneClass {
  createScene: (engine: Engine, canvas: HTMLCanvasElement) => Promise<Scene>;
  preTasks?: Promise<unknown>[];
}

export interface CreateSceneModule {
  default: CreateSceneClass;
}

export const getSceneModule = (): CreateSceneClass => {
  //return new PhysicsSceneWithAmmo();
  return new MainScene();
};
