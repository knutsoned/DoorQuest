import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { PhysicsImpostor } from "@babylonjs/core/Physics/physicsImpostor";
import { Scene } from "@babylonjs/core/scene";
import { bricks } from "./flotsam";
import { createWall } from "./createWall";
import { IConfig } from "./types";
import { HDRCubeTexture } from "@babylonjs/core/Materials/Textures/hdrCubeTexture";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";

export function init(
  hdrTexture: HDRCubeTexture,
  scene: Scene,
  config: IConfig
) {
  const sunPosition = new Vector3(0, 20, 0);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new HemisphericLight("light", sunPosition, scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Skybox
  // https://doc.babylonjs.com/features/featuresDeepDive/materials/using/masterPBR#refraction
  var hdrSkybox = CreateBox("hdrSkyBox", { size: 1000.0 }, scene);
  var hdrSkyboxMaterial = new PBRMaterial("skyBox", scene);
  hdrSkyboxMaterial.backFaceCulling = false;
  hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
  hdrSkyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  hdrSkyboxMaterial.microSurface = 1.0;
  hdrSkyboxMaterial.cameraExposure = 0.66;
  hdrSkyboxMaterial.cameraContrast = 1.66;
  hdrSkyboxMaterial.disableLighting = true;
  hdrSkybox.material = hdrSkyboxMaterial;
  hdrSkybox.infiniteDistance = true;

  // BEGIN: init ground
  // Our built-in 'ground' shape.
  const worldSize = config.const.world.width;
  const ground = CreateGround(
    "ground",
    { width: worldSize, height: worldSize },
    scene
  );

  ground.material = bricks(scene);

  ground.physicsImpostor = new PhysicsImpostor(
    ground,
    PhysicsImpostor.BoxImpostor,
    { mass: 0, restitution: 0.6 }
  );
  // END: init ground

  // BEGIN: init walls
  const halfSize = config.const.world.width / 2;
  const quarterTurn = config.const.quarterTurn;

  const farWall = createWall(scene, config);
  farWall.position.z -= halfSize;

  const leftWall = createWall(scene, config);
  leftWall.position.x += halfSize;
  leftWall.rotate(Vector3.Up(), quarterTurn);

  const rightWall = createWall(scene, config);
  rightWall.position.x -= halfSize;
  rightWall.rotate(Vector3.Up(), quarterTurn);

  const frontWall = createWall(scene, config);
  frontWall.position.z += halfSize;
  // END: init walls
}
