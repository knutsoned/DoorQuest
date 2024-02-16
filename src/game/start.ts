import { Color3 } from "@babylonjs/core/Maths/math.color";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Plane } from "@babylonjs/core/Maths/math.plane";
import { Scene } from "@babylonjs/core/scene";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";

import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";

import { BrickProceduralTexture } from "@babylonjs/procedural-textures/brick/brickProceduralTexture";
import { PhysicsImpostor } from "@babylonjs/core/Physics/physicsImpostor";
import { RefractionTexture } from "@babylonjs/core/Materials/Textures/refractionTexture";
import { SkyMaterial } from "@babylonjs/materials";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

import { mkAlea } from "@spissvinkel/alea";

import { Config } from ".";
import { CameraMap, CameraView, UIMode } from "./types";

export class Start {
  ball: Mesh;
  cameras: CameraMap = {};
  mode: UIMode = UIMode.Also3D;
  origin = Vector3.ZeroReadOnly;

  // requestAnimationFrame
  handleBeforeRender(scene: Scene) {
    scene.onBeforeRenderObservable.add(() => {
      const ball = this.ball;
      const fpvCam = this.cameras[CameraView.FPVCam];

      // update fpvCam if present to track ball direction and location
      if (Config.ui.cameras[this.mode][CameraView.FPVCam]) {
        // https://forum.babylonjs.com/t/what-is-the-best-way-to-switch-the-camera-in-the-direction-of-mesh-movement/27669
        var velocity = ball.physicsImpostor.getLinearVelocity().normalize();
        fpvCam.position = ball.position;
        fpvCam.setTarget(ball.position.add(velocity));
      }

      // apply force to left
      ball.physicsImpostor.applyForce(new Vector3(-0.1, 0, 0), this.origin);
    });
  }

  // keys.buttons.switch
  handleUiModeChange = (scene: Scene): void => {
    // get the config matching the UIMode
    const cameras = Config.ui.cameras[this.mode];

    // clear active cameras
    const activeCameras = scene.activeCameras;
    if (activeCameras) {
      while (activeCameras.length > 0) {
        activeCameras.pop();
      }
    }

    // add the cameras defined for this UIMode
    if (cameras) {
      Object.keys(this.cameras).forEach((key) => {
        const config = cameras[key];
        const camera = this.cameras[key];
        if (camera) {
          if (config) {
            camera.viewport = config;
            scene.activeCameras.push(camera);
          }
        }
      });
    }
  };

  preparing = (scene: Scene): void => {
    const { random } = mkAlea();

    const fpo = true; // display mock up stuff

    const sunPosition = new Vector3(0, 20, 0);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight("light", sunPosition, scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // cameras
    // This creates and positions a free camera (non-mesh)

    /*
    const camera = new ArcRotateCamera(
      "my first camera",
      0,
      Math.PI / 3,
      16,
      new Vector3(0, 0, 0),
      scene
    );
    */

    const mainView = new UniversalCamera("main view", new Vector3(0, 12, 16));
    // This targets the camera to scene origin
    mainView.setTarget(this.origin);
    // This attaches the camera to the canvas
    //camera.attachControl(canvas, true);
    this.cameras[CameraView.MainView] = mainView;

    const fpvCam = new UniversalCamera("FPV cam", new Vector3(0, 0, 0), scene);
    this.cameras[CameraView.FPVCam] = fpvCam;

    // Skybox
    let box = CreateBox(
      "sky",
      {
        size: 1000,
      },
      scene
    );
    const skyMaterial = new SkyMaterial("skyMaterial", scene);
    skyMaterial.backFaceCulling = false;
    box.material = skyMaterial;
    // Manually set the sun position
    skyMaterial.useSunPosition = true; // Do not set sun position from azimuth and inclination
    skyMaterial.sunPosition = sunPosition;

    // BEGIN: FPO
    if (fpo) {
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

    // BEGIN: init ground
    // Our built-in 'ground' shape.
    const ground = CreateGround("ground", { width: 18, height: 18 }, scene);

    let brickMaterial = new StandardMaterial("brickMat", scene);
    let brickTexture = new BrickProceduralTexture("brickTex", 512, scene);
    brickTexture.numberOfBricksHeight = 40;
    brickTexture.brickColor = new Color3(0.32, 0.32, 0.323);
    brickTexture.numberOfBricksWidth = 10;
    brickMaterial.diffuseTexture = brickTexture;
    ground.material = brickMaterial;

    ground.physicsImpostor = new PhysicsImpostor(
      ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.6 }
    );
    // END: init ground

    // BEGIN: init Balltholemew
    // Our built-in 'sphere' shape.
    const ball = CreateSphere(
      "sphere",
      { diameter: Config.vars.radius, segments: 32 }, // sic
      scene
    );

    ball.physicsImpostor = new PhysicsImpostor(
      ball,
      PhysicsImpostor.SphereImpostor,
      { mass: Config.vars.mass, restitution: 0.8 },
      scene
    );

    // Move the sphere away from cam
    ball.position = new Vector3(0, 2.5, 8);
    ball.physicsImpostor.applyImpulse(new Vector3(-0.5, 0, -1), this.origin);

    // apply earth texture from https://forum.babylonjs.com/t/apply-texture-to-sphere-without-wide-seems/3432
    /*
    const earthMap = new StandardMaterial("earthMat", scene);
    const earthTex = new Texture("../../assets/textures/earth.jpg", scene);
    earthTex.vScale *= -1; // fix upside down PNG loading per https://github.com/BabylonJS/Babylon.js/issues/12545
    earthMap.diffuseTexture = earthTex;
    sphere.material = earthMap;
    */
    // make the sphere like a magnifying glass
    // Main material
    let glassesMaterial = new StandardMaterial("main", scene);
    ball.material = glassesMaterial;

    let refractionTexture = new RefractionTexture("th", 1024, scene);
    refractionTexture.renderList.push(ground);
    //refractionTexture.refractionPlane = new Plane(0, 0, -1, 0);
    refractionTexture.refractionPlane = new Plane(0, 0, -9, 0);
    refractionTexture.depth = 2.0;

    //mainMaterial.diffuseColor = new Color3(1, 1, 1);
    glassesMaterial.refractionTexture = refractionTexture;
    glassesMaterial.indexOfRefraction = 0.4;

    // robe

    // and wizard hat

    // ball 1st person cam
    //camera2.parent = ball;
    this.ball = ball;

    // END: init Balltholemew

    // multi-view
    if (scene.getEngine().getCaps().multiview) {
      console.log("multiview");
    }

    this.handleBeforeRender(scene);

    this.handleUiModeChange(scene);
  };
}

export default new Start();
