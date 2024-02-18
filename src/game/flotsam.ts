import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Scene } from "@babylonjs/core/scene";
import { Material } from "@babylonjs/core/Materials/material";

import { BrickProceduralTexture } from "@babylonjs/procedural-textures/brick/brickProceduralTexture";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { CellMaterial } from "@babylonjs/materials/cell/cellMaterial";

export function celShade(
  name: string,
  texture: Texture,
  scene: Scene
): Material {
  const celShader = new CellMaterial("cel shader " + name, scene);
  celShader.diffuseTexture = texture;
  return celShader;
}

export function bricks(name: string, scene: Scene): Material {
  /*
  let brickMaterial = new StandardMaterial("brickMat", scene);
  **/
  const textureName = name + " brickTex";
  let brickTexture = new BrickProceduralTexture(textureName, 512, scene);
  //brickTexture.numberOfBricksHeight = 40;
  brickTexture.numberOfBricksHeight = 5;
  brickTexture.brickColor = new Color3(0.32, 0.32, 0.323);
  //brickTexture.numberOfBricksWidth = 10;
  brickTexture.numberOfBricksWidth = 3;

  /*
  brickMaterial.diffuseTexture = brickTexture;
  */
  return celShade(textureName, brickTexture, scene);
}
