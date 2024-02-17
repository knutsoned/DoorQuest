import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { Scene } from "@babylonjs/core/scene";

import { IConfig } from "./types";
import { PhysicsImpostor } from "@babylonjs/core/Physics/physicsImpostor";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

export function createWall(brickIndex: number, scene: Scene, config: IConfig) {
  const random = config.prng.random;
  const shift = Math.ceil(random() * 4) - 2;
  const wallIndex = random();
  const box = CreateBox(
    "wall " + wallIndex,
    {
      width: config.const.world.width,
      height: config.const.world.height,
      depth: 1,
    },
    scene
  );
  const boxMaterial = new StandardMaterial(
    "brick" + brickIndex + " " + wallIndex
  );
  const boxTexture = new Texture(
    "./assets/textures/brick" + brickIndex + ".jpg"
  );
  boxTexture.uScale = 0.35;
  boxTexture.uOffset = 0;
  boxTexture.vScale = 0.45;
  boxTexture.vOffset = 0.5 * shift;
  boxMaterial.diffuseTexture = boxTexture;
  box.material = boxMaterial;
  box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, {
    mass: 0,
    restitution: 0.99,
  });
  box.position.y += config.const.world.height / 2;
  return box;
}
