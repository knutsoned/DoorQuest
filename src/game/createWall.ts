import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { Scene } from "@babylonjs/core/scene";

import { IConfig, PRNG } from "./types";
import { bricks } from "./flotsam";
import { PhysicsImpostor } from "@babylonjs/core/Physics/physicsImpostor";

export function createWall(scene: Scene, config: IConfig) {
  const box = CreateBox(
    "wall" + config.prng.random(),
    {
      width: config.const.world.width,
      height: config.const.world.height,
      depth: 1,
    },
    scene
  );
  box.material = bricks(scene);
  box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, {
    mass: 0,
    restitution: 0.9,
  });
  box.position.y += config.const.world.height / 2;
  return box;
}
