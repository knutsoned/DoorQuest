import { Scene } from "@babylonjs/core/scene";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";

import { PhysicsImpostor } from "@babylonjs/core/Physics/physicsImpostor";
import "@babylonjs/loaders/glTF";

import { IConfig } from "./types";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { Vector3 } from "@babylonjs/core/Maths/math";

export async function createBoard(scene: Scene, config: IConfig) {
  const random = config.prng.random;
  const door = createExitDoor(scene);
}

export async function createExitDoor(scene: Scene): Promise<AbstractMesh> {
  // big door
  const importResult = await SceneLoader.ImportMeshAsync(
    "",
    "./assets/glb/",
    "purple_door.glb",
    scene,
    undefined,
    ".glb"
  );
  const door = importResult.meshes[0];
  door.lookAt(Vector3.Left());
  door.position = new Vector3(0, 14.5, 0);
  const scale = 0.012;
  door.scaling = new Vector3(scale, scale, scale);
  //door.position = new Vector3(-15, -10, 25);
  //door.position = new Vector3(-10, -1, 50);
  return door;
}
