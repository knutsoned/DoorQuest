import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Scene } from "@babylonjs/core/scene";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

import { BrickProceduralTexture } from "@babylonjs/procedural-textures/brick/brickProceduralTexture";

export function bricks(scene: Scene): StandardMaterial {
  let brickMaterial = new StandardMaterial("brickMat", scene);
  let brickTexture = new BrickProceduralTexture("brickTex", 512, scene);
  //brickTexture.numberOfBricksHeight = 40;
  brickTexture.numberOfBricksHeight = 10;
  brickTexture.brickColor = new Color3(0.32, 0.32, 0.323);
  //brickTexture.numberOfBricksWidth = 10;
  brickTexture.numberOfBricksWidth = 5;
  brickMaterial.diffuseTexture = brickTexture;
  return brickMaterial;
}
