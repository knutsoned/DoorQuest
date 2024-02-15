import { Texture } from "@babylonjs/core";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";
import { AmmoJSPlugin } from "@babylonjs/core/Physics/Plugins/ammoJSPlugin";
import "@babylonjs/core/Physics/physicsEngineComponent";

// If you don't need the standard material you will still need to import it since the scene requires it.
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { PhysicsImpostor } from "@babylonjs/core/Physics/physicsImpostor";
import Ammo from "ammojs-typed";
import { CreateSceneClass } from "../createScene";

import { Config } from "../game";

export class MainScene implements CreateSceneClass {
  createScene = async (
    engine: Engine,
    canvas: HTMLCanvasElement
  ): Promise<Scene> => {
    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new Scene(engine);

    // with webpack, just do Ammo() but with vite, it's Ammo.call(this)
    // https://forum.babylonjs.com/t/using-ammojs-with-babylon/26413/8
    const ammo = await Ammo.call(this);
    scene.enablePhysics(null, new AmmoJSPlugin(true, ammo));

    // This creates and positions a free camera (non-mesh)
    const camera = new ArcRotateCamera(
      "my first camera",
      0,
      Math.PI / 3,
      10,
      new Vector3(0, 0, 0),
      scene
    );

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    const sphere = CreateSphere(
      "sphere",
      { diameter: Config.vars.radius * 2, segments: 32 },
      scene
    );

    sphere.physicsImpostor = new PhysicsImpostor(
      sphere,
      PhysicsImpostor.SphereImpostor,
      { mass: Config.vars.mass, restitution: 0.8 },
      scene
    );

    // Move the sphere upward 1/2 its height
    sphere.position.y = 5;

    // apply earth texture from https://forum.babylonjs.com/t/apply-texture-to-sphere-without-wide-seems/3432
    const earthMap = new StandardMaterial("earthMat", scene);
    const earthTex = new Texture("../../assets/textures/earth.jpg", scene);
    earthTex.vScale *= -1; // fix upside down PNG loading per https://github.com/BabylonJS/Babylon.js/issues/12545
    earthMap.diffuseTexture = earthTex;
    sphere.material = earthMap;

    // Our built-in 'ground' shape.
    const ground = CreateGround("ground", { width: 6, height: 6 }, scene);

    ground.physicsImpostor = new PhysicsImpostor(
      ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.6 }
    );

    return scene;
  };
}

export default new MainScene();
