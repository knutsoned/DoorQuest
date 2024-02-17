import { Scene } from "@babylonjs/core/scene";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { PhysicsImpostor } from "@babylonjs/core/Physics/physicsImpostor";
import { HDRCubeTexture } from "@babylonjs/core/Materials/Textures/hdrCubeTexture";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";

import "@babylonjs/loaders/glTF";

import { Config } from "./config";

export function init(refractionTexture: HDRCubeTexture, scene: Scene) {
  // BEGIN: init Balltholemew
  // Our built-in 'sphere' shape.
  const ball = CreateSphere(
    "sphere",
    { diameter: Config.var.radius * 2, segments: 32 },
    scene
  );

  ball.physicsImpostor = new PhysicsImpostor(
    ball,
    PhysicsImpostor.SphereImpostor,
    { mass: Config.var.mass, restitution: 0.8 },
    scene
  );

  // make the sphere like a magnifying glass
  var glass = new PBRMaterial("glass", scene);
  glass.reflectionTexture = refractionTexture;
  glass.refractionTexture = refractionTexture;
  glass.linkRefractionWithTransparency = true;
  glass.indexOfRefraction = 0.52;
  glass.alpha = 0;
  glass.directIntensity = 0.0;
  glass.environmentIntensity = 0.7;
  glass.cameraExposure = 0.66;
  glass.cameraContrast = 1.66;
  glass.microSurface = 1;
  glass.reflectivityColor = new Color3(0.2, 0.2, 0.2);
  glass.albedoColor = new Color3(0.95, 0.95, 0.95);
  ball.material = glass;

  // https://forum.babylonjs.com/t/magnifying-glass-effect/19696
  /*
  var mainMaterial = new PBRMaterial("pbr", scene);
  ball.material = mainMaterial;
  var refractionTexture = new RefractionTexture("th", 1024, scene);
  for (let mesh of refractionMeshes) {
    refractionTexture.renderList.push(mesh);
  }
  refractionTexture.refractionPlane = new Plane(0, 0, -1, -1);
  refractionTexture.depth = 0.2;

  //mainMaterial.diffuseColor = new Color3(1, 1, 1);
  mainMaterial.refractionTexture = refractionTexture;
  mainMaterial.indexOfRefraction = 1.4;
  */

  // https://playground.babylonjs.com/#KJ2GLK#4
  /*
  mainMaterial.metallic = 0.0;
  mainMaterial.roughness = 0;
  mainMaterial.alpha = 0.2;
  mainMaterial.subSurface.isRefractionEnabled = true;
  */
  // END: init Balltholemew

  return ball;
}

export async function createHat(scene: Scene) {
  // and wizard hat
  const importResult = await SceneLoader.ImportMeshAsync(
    "",
    "./assets/glb/",
    "stylized_wizard_hat.glb",
    scene,
    undefined,
    ".glb"
  );
  const hat = importResult.meshes[0];
  return hat;
}
