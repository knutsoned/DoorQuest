import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Scene } from "@babylonjs/core/scene";
import { Material } from "@babylonjs/core/Materials/material";
import { Mesh, Vector3 } from "@babylonjs/core";
import { BrickProceduralTexture } from "@babylonjs/procedural-textures/brick/brickProceduralTexture";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { CellMaterial } from "@babylonjs/materials/cell/cellMaterial";

import { IConfig } from "./types";

export function ballStart(ball: Mesh, config: IConfig) {
  ball.position = new Vector3(-2, config.var.radius, 9);

  const random = config.prng.random;
  const moveScale = 42;
  const moveMin = 17;
  const movement = () => {
    const base = random() * moveScale + moveMin;
    return random() > 0.5 ? base : -base;
  };

  const moveX = movement();
  const moveY = movement();

  ball.physicsImpostor.applyImpulse(
    //new Vector3(0.5, 0, 0.1),
    new Vector3(moveX, 0, moveY),
    config.const.origin
  );
}

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

export function wallMaterial(
  brickTexture: number,
  scene: Scene,
  config: IConfig
): Material {
  const shift = Math.ceil(config.prng.random() * 4) - 2;
  const boxTexture = new Texture(
    "./assets/textures/brick" + brickTexture + ".jpg"
  );
  boxTexture.uScale = 0.35;
  boxTexture.uOffset = 0;
  boxTexture.vScale = 0.45;
  boxTexture.vOffset = 0.5 * shift;
  const material = celShade(
    "brick" + brickTexture + " " + config.prng.uint32(),
    boxTexture,
    scene
  );
  return material;
}
