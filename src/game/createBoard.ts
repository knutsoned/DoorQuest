import { Scene } from "@babylonjs/core/scene";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";

import { PhysicsImpostor } from "@babylonjs/core/Physics/physicsImpostor";
import "@babylonjs/loaders/glTF";

import { IConfig } from "./types";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";

export async function createBoard(scene: Scene, config: IConfig) {
  const random = config.prng.random;
  const door = createExitDoor(scene);
}

export async function createExitDoor(scene: Scene): Promise<AbstractMesh> {
  // big door
  const importResult = await SceneLoader.ImportMeshAsync(
    "",
    "./assets/glb/kenney/",
    "door.glb",
    scene,
    undefined,
    ".glb"
  );
  const door = importResult.meshes[0];
  return door;
}
