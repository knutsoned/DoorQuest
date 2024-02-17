import { Scene } from "@babylonjs/core/scene";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { CameraMap, CameraView, IConfig, UIMode } from "./types";

export function init(config: IConfig): CameraMap {
  const cameraMap: CameraMap = {};
  const mainView = new UniversalCamera("main view", new Vector3(0, 7, 10)); // PROD
  //const mainView = new UniversalCamera("main view", new Vector3(0, 1, 8));

  // This targets the camera to scene origin
  mainView.setTarget(config.const.origin);

  // This attaches the camera to the canvas
  //camera.attachControl(canvas, true);

  cameraMap[CameraView.MainView] = mainView;

  const fpvCam = new UniversalCamera("FPV cam", new Vector3(0, 0, 0));
  cameraMap[CameraView.FPVCam] = fpvCam;
  return cameraMap;
}

// keys.buttons.switch
export function handleUiModeChange(
  mode: UIMode,
  cameraMap: CameraMap,
  scene: Scene,
  config: IConfig,
  canvas: HTMLCanvasElement
): void {
  // get the config matching the UIMode
  const cameras = config.ui.cameras[mode];

  // clear active cameras
  const activeCameras = scene.activeCameras;
  if (activeCameras) {
    while (activeCameras.length > 0) {
      activeCameras.pop();
    }
  }

  // add the cameras defined for this UIMode
  if (cameras) {
    Object.keys(cameraMap).forEach((key) => {
      const viewport = cameras[key];
      const camera = cameraMap[key];
      if (camera) {
        if (viewport) {
          if (config.ui.cameraMouse && key === CameraView.MainView.toString()) {
            camera.attachControl(canvas);
          }
          camera.viewport = viewport;
          scene.activeCameras.push(camera);
        }
      }
    });
  }
}
