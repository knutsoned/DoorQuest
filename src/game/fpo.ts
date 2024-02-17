import { Color3, Vector3 } from "@babylonjs/core/Maths/math";
import { Scene } from "@babylonjs/core/scene";
import { IConfig } from "./types";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Mesh } from "@babylonjs/core/Meshes/mesh";

// for placement only
export function createFPOs(ball: Mesh, scene: Scene, config: IConfig) {
  const random = config.prng.random;
  const moveScale = 42;
  // Move the sphere away from cam
  //this.ball.position = new Vector3(0, 2.5, 8); // prod
  //this.ball.position = new Vector3(0, 2.5, 0);
  ball.position = new Vector3(0, config.var.radius, 0);

  const movement = () => {
    return (random() - 0.5) * moveScale;
  };

  const moveX = movement();
  console.log("x: " + moveX);
  const moveY = movement();
  console.log("y: " + moveY);

  ball.physicsImpostor.applyImpulse(
    //new Vector3(0.5, 0, 0.1),
    new Vector3(moveX, 0, moveY),
    config.const.origin
  );

  // red sphere (bottom left)
  const sphereBottomLeft = CreateSphere(
    "sphere",
    { diameter: 2, segments: 32 },
    scene
  );
  let bottomLeftMaterial = new StandardMaterial("bottomLeft", scene);
  bottomLeftMaterial.diffuseColor = new Color3(1, 0, 0); // red
  sphereBottomLeft.material = bottomLeftMaterial;
  sphereBottomLeft.position = new Vector3(9, 0, 9);

  // blue sphere (upper right)
  const sphereTopRight = CreateSphere(
    "sphere",
    { diameter: 2, segments: 32 },
    scene
  );
  let topRightMaterial = new StandardMaterial("topRight", scene);
  topRightMaterial.diffuseColor = new Color3(0, 0, 1); // blue
  sphereTopRight.material = topRightMaterial;
  sphereTopRight.position = new Vector3(-9, 0, -9);
}
