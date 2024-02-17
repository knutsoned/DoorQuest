import { Color3 } from "@babylonjs/core/Maths/math.color";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { PhysicsImpostor } from "@babylonjs/core/Physics/physicsImpostor";
import { SkyMaterial } from "@babylonjs/materials";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { HDRCubeTexture } from "@babylonjs/core/Materials/Textures/hdrCubeTexture";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";

import { mkAlea } from "@spissvinkel/alea";

import { Config } from ".";
import { CameraMap, CameraView, UIMode } from "./types";
import { bricks } from "./flotsam";
import * as Cameras from "./createCameras";
import * as Balltholemew from "./createBall";

export class Start {
  ball: Mesh;
  hat: AbstractMesh;
  wizardHat: Mesh;
  cameras: CameraMap = {};
  //mode: UIMode = UIMode.Also3D;
  mode: UIMode = UIMode.Full3D;

  // requestAnimationFrame
  handleBeforeRender() {
    const ball = this.ball;
    const ballPos = ball.position;
    const fpvCam = this.cameras[CameraView.FPVCam];
    var ballVelocity = ball.physicsImpostor.getLinearVelocity().normalize();

    // update fpvCam if present to track ball direction and location
    if (Config.ui.cameras[this.mode][CameraView.FPVCam]) {
      // https://forum.babylonjs.com/t/what-is-the-best-way-to-switch-the-camera-in-the-direction-of-mesh-movement/27669
      fpvCam.position = ballPos;
      fpvCam.setTarget(ball.position.add(ballVelocity));
    }

    // update wizard hat
    const hatOffset = Config.const.hatOffset;
    const hatPosition = ballPos.add(hatOffset);
    this.hat.position = hatPosition;

    /*
    this.hat.rotation = new Vector3(
      ballVelocity.x,
      ballVelocity.y,
      ballVelocity.z
    );
    */
    const flatVelocity = new Vector3(-ballVelocity.x, -0.1, -ballVelocity.z);
    this.hat.lookAt(ballPos.add(flatVelocity).add(hatOffset));
    // apply force to left
    //ball.physicsImpostor.applyForce(new Vector3(-0.1, 0, 0), Config.origin);
  }

  preparing = async (
    scene: Scene,
    canvas: HTMLCanvasElement
  ): Promise<void> => {
    const { random } = mkAlea();

    const fpo = true; // display mock up stuff

    const sunPosition = new Vector3(0, 20, 0);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight("light", sunPosition, scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // cameras
    // This creates and positions a free camera (non-mesh)
    this.cameras = Cameras.init();

    // skybox texture
    var hdrTexture = new HDRCubeTexture(
      "./assets/textures/night.hdr",
      scene,
      512
    );

    // BEGIN: init ground
    // Our built-in 'ground' shape.
    const ground = CreateGround("ground", { width: 18, height: 18 }, scene);

    ground.material = bricks(scene);

    ground.physicsImpostor = new PhysicsImpostor(
      ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.6 }
    );
    // END: init ground

    // BEGIN: init player
    this.ball = Balltholemew.init(hdrTexture, scene);
    this.hat = await Balltholemew.createHat(scene);
    console.log(this.hat.rotation);
    // END: init player

    // BEGIN: FPO
    if (fpo) {
      // Move the sphere away from cam
      //this.ball.position = new Vector3(0, 2.5, 8); // prod
      //this.ball.position = new Vector3(0, 2.5, 0);
      this.ball.position = new Vector3(0, Config.var.radius, 0);

      this.ball.physicsImpostor.applyImpulse(
        new Vector3(0.5, 0, 0.1),
        Config.const.origin
      );

      const sphereBottomLeft = CreateSphere(
        "sphere",
        { diameter: 2, segments: 32 },
        scene
      );
      let bottomLeftMaterial = new StandardMaterial("bottomLeft", scene);
      bottomLeftMaterial.diffuseColor = new Color3(1, 0, 0); // red
      sphereBottomLeft.material = bottomLeftMaterial;
      sphereBottomLeft.position = new Vector3(9, 0, 9);

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
    // END: FPO

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

    // multi-view
    /*
    if (scene.getEngine().getCaps().multiview) {
      console.log("multiview");
    }
    */

    // called before each render loop iteration
    scene.onBeforeRenderObservable.add(() => {
      this.handleBeforeRender();
    });

    // init UI
    Cameras.handleUiModeChange(this.mode, this.cameras, scene, canvas);

    // little push to straighten out
    //this.ball.physicsImpostor.applyForce(new Vector3(-1, 0, 0), Config.origin);
  };
}

export default new Start();
