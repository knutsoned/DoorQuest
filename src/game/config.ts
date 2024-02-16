import {
  CameraView,
  GameKeyboardMapping,
  IConfig,
  UIMode,
  uint8NZ,
} from "./types";

import { Viewport } from "@babylonjs/core/Maths/math.viewport";

// default keys
export const KeyboardMappingNeutral: GameKeyboardMapping = {
  direction: {
    up: ["w", "ArrowUp"],
    left: ["a", "ArrowLeft"],
    down: ["s", "ArrowDown"],
    right: ["d", "ArrowRight"],
  },
  buttons: {
    action: [" "],
    switch: ["Tab"],
    back: ["Escape"],
    toggleMap: ["m"],
    togglePerspective: ["p"],
  },
};

export const Config: IConfig = {
  // variables available to terminal
  // range 1..256 (mapping a range of 0.01 to 1.0 means about .004 per unit)
  vars: {
    mass: uint8NZ(2),
    radius: uint8NZ(1),
    gravity: uint8NZ(10), // a little heavy
    force: uint8NZ(20), // should be able to barely move up an incline starting from rest
    friction: uint8NZ(50), // coefficient of around 0.2
    speed: uint8NZ(3), // top speed at full tilt (m/s), if current speed is above then controls only slow down if applied opposite movement direction
  },

  // UI flags
  ui: {
    mode: UIMode.Also3D,
    hideSidebar: true, // only applies if mode===1, tab cycles through 0, 1/true, 1/false
    showMap: true, // show overhead map, only applies if mode===1
    showSecondView: true, // show alternate view, default 1st person perspective, only applies if mode===1
    swapViews: false, // show 1st person in main view with 3rd person in secondary, only applies if mode===1

    // control mode flags
    control: {
      gamepadEnabled: false, // don't go there yet
      keyboardMappings: {
        player1: {
          // only player for now
          keyboardMapping: KeyboardMappingNeutral, // assign standard WASD-space default
        },
      },
      touchEnabled: false, // enable for mobile
    },

    cameras: {
      [UIMode.TextOnly]: {
        [CameraView.MainView]: false,
        [CameraView.FPVCam]: false,
      },
      [UIMode.Also3D]: {
        [CameraView.MainView]: new Viewport(0, 0, 0.56, 1),
        [CameraView.FPVCam]: new Viewport(0.56, 0.56, 0.19, 0.44),
      },
      [UIMode.Full3D]: {
        [CameraView.MainView]: new Viewport(0, 0, 1.0, 1.0),
        [CameraView.FPVCam]: false,
      },
    },
  },
};
