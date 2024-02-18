import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { HDRCubeTexture } from "@babylonjs/core/Materials/Textures/hdrCubeTexture";

import { AcidBanger } from "../acid-banger/app";

import { CameraMap, CameraView, IConfig, UIMode } from "./types";
import { createFPOs } from "./fpo";
import * as World from "./createWorld";
import * as Cameras from "./createCameras";
import * as Balltholemew from "./createBall";
import { KeyboardEventTypes } from "@babylonjs/core/Events/keyboardEvents";

export class Start {
  banger?: AcidBanger;
  config: IConfig;

  mode: UIMode = UIMode.Sidebar;
  //mode: UIMode = UIMode.Full3D;

  // cameras
  cameras: CameraMap = {};

  // meshes
  ball: Mesh;
  wizardHat: AbstractMesh;

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

    // @ts-ignore
    const musicOn = window.musicOn;

    // FIXME check for A & D button clicks from HTML

    if (musicOn) {
      // check for music
      if (this.banger) {
        if (this.banger.programState) {
          this.banger.programState.masterVolume.value = 1;
        }
      } else {
        // turn it up
        //console.log("AcidBanger intensifies");
        this.banger = new AcidBanger();
        this.banger.start();
      }
    } else {
      // check for music
      if (this.banger) {
        // lol, how do you turn it off?
        //this.banger = undefined;
        if (this.banger.programState) {
          this.banger.programState.masterVolume.value = 0;
        }
      }
    }
  }

  async preparing(
    scene: Scene,
    config: IConfig,
    canvas: HTMLCanvasElement
  ): Promise<void> {
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

    scene.executeWhenReady(() => {
      // @ts-ignore
      window.hideLoading();

      // register controls
      scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
          case KeyboardEventTypes.KEYDOWN:
            //console.log("KEY DOWN: ", kbInfo.event.key);
            break;
          case KeyboardEventTypes.KEYUP:
            switch (kbInfo.event.key) {
              case "m":
                // @ts-ignoremm
                window.toggleMusicOn();
                break;
              case "s":
                // @ts-ignoremm
                window.toggleSoundOn();
                break;
            }
            break;
        }
      });
    });
  }
}

export default new Start();
