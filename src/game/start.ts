import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { HDRCubeTexture } from "@babylonjs/core/Materials/Textures/hdrCubeTexture";

import { start as AcidBanger } from "../acid-banger/app";

import { CameraMap, CameraView, IConfig, UIMode } from "./types";
import { createFPOs } from "./fpo";
import * as World from "./createWorld";
import * as Cameras from "./createCameras";
import * as Balltholemew from "./createBall";

export class Start {
  ball: Mesh;
  wizardHat: AbstractMesh;
  cameras: CameraMap = {};

  config: IConfig;

  //mode: UIMode = UIMode.Also3D;
  mode: UIMode = UIMode.Full3D;

  // requestAnimationFrame
  handleBeforeRender(): void {
    const ball = this.ball;
    const ballPos = ball.position;
    const fpvCam = this.cameras[CameraView.FPVCam];
    var ballVelocity = ball.physicsImpostor.getLinearVelocity().normalize();

    // update fpvCam if present to track ball direction and location
    if (this.config.ui.cameras[this.mode][CameraView.FPVCam]) {
      // https://forum.babylonjs.com/t/what-is-the-best-way-to-switch-the-camera-in-the-direction-of-mesh-movement/27669
      fpvCam.position = ballPos;
      fpvCam.setTarget(ball.position.add(ballVelocity));
    }

    // update wizard hat
    const hatOffset = this.config.const.hatOffset;
    const hatPosition = ballPos.add(hatOffset);
    this.wizardHat.position = hatPosition;

    const flatVelocity = new Vector3(-ballVelocity.x, -0.1, -ballVelocity.z);
    this.wizardHat.lookAt(ballPos.add(flatVelocity).add(hatOffset));

    // apply force to left
    //ball.physicsImpostor.applyForce(new Vector3(-0.1, 0, 0), Config.origin);
  }

  preparing = async (
    scene: Scene,
    config: IConfig,
    canvas: HTMLCanvasElement
  ): Promise<void> => {
    this.config = config;

    // skybox texture
    var hdrTexture = new HDRCubeTexture(
      "./assets/textures/night.hdr",
      scene,
      512
    );

    World.init(hdrTexture, scene, config);

    // cameras
    // This creates and positions a free camera (non-mesh)
    this.cameras = Cameras.init(config);

    // BEGIN: init player
    this.ball = Balltholemew.init(hdrTexture, scene, config);
    this.wizardHat = await Balltholemew.createHat(scene);
    // END: init player

    // BEGIN: FPO
    if (config.const.fpo) {
      createFPOs(this.ball, scene, config);
    }
    // END: FPO

    // called before each render loop iteration
    scene.onBeforeRenderObservable.add(() => {
      this.handleBeforeRender();
    });

    // init UI
    Cameras.handleUiModeChange(this.mode, this.cameras, scene, config, canvas);

    // little push to straighten out
    //this.ball.physicsImpostor.applyForce(new Vector3(-1, 0, 0), Config.origin);

    // ACID INTENSIFIES
    AcidBanger();
    console.log("AcidBanger");
  };
}

export default new Start();
