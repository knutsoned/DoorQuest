import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { Scene } from "@babylonjs/core/scene";

import { IConfig } from "./types";
import { PhysicsImpostor } from "@babylonjs/core/Physics/physicsImpostor";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";

import { celShade } from "./flotsam";
import { Mesh } from "@babylonjs/core/Meshes/mesh";

export function createWall(scene: Scene, config: IConfig): Mesh {
  const box = CreateBox(
    "wall " + config.prng.uint32(),
    {
      width: config.const.world.width,
      height: config.const.world.height,
      depth: 1,
    },
    scene
  );
  box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, {
    mass: 0,
    restitution: 0.99,
  });
  box.position.y += config.const.world.height / 2;
  return box;
}
