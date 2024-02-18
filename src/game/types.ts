// via https://github.com/microsoft/TypeScript/issues/38886
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Viewport } from "@babylonjs/core/Maths/math.viewport";
import { KeyboardEventKey } from "keyboard-event-key-type"; // seems like a good idea at this time

// restrict config values to 1..255, sounds pretty easy
// um, ok https://stackoverflow.com/a/66085193
export type UInt8NZ = number & {
  _type_: "UInt8NZ";
};

// create/check UInt8NZ values
export const uint8NZ = (value: number): UInt8NZ => {
  if (value < 1 || value > 255) {
    throw new Error(
      `The value ${value} is not a valid positive unsigned 8-bit integer`
    );
  }

  return value as UInt8NZ;
};

export type PRNG = {
  random: () => number;
};

// declaring key constants for maps
// trying to remember why you're not supposed to do this
export enum UIMode {
  TextOnly = 0,
  Also3D = 1,
  Sidebar = 2,
  Full3D = 3,
}
export type CameraMap = {
  [view in CameraView]?: UniversalCamera;
};
export enum CameraView {
  MainView = 0,
  FPVCam = 1,
}
export type UICameraConfig = Viewport | false;
export type UICameraMode = {
  [view in CameraView]?: UICameraConfig;
};
export interface IConfig {
  prng: {
    impl: PRNG;
    random: () => number;
    seed?: string;
  };
  var: {
    mass: UInt8NZ;
    radius: UInt8NZ;
    gravity: UInt8NZ;
    force: UInt8NZ;
    friction: UInt8NZ;
    speed: UInt8NZ;
  };
  const: {
    fpo: boolean;
    origin: Vector3;
    hatOffset: Vector3;
    quarterTurn: number;
    world: {
      width: number;
      height: number;
    };
  };

  // UI flags
  ui: {
    mode: UIMode;
    hideSidebar: boolean;
    showMap: boolean;
    showSecondView: boolean;
    swapViews: boolean;
    cameraMouse: boolean;

    // camera setup
    cameras: {
      [mode in UIMode]?: UICameraMode;
    };

    // control mode flags
    control: {
      gamepadEnabled: false;
      keyboardMappings: PlayerInputs;
      touchEnabled: boolean;
    };
  };
}

// adapted from https://stephendoddtech.com/blog/game-design/keyboard-event-game-input-map
export type DefaultControls =
  | "w" // up
  | "a" // left
  | "s" // down
  | "d" // right
  | " " // action
  | "m" // toggle map
  | "p"; // toggle perspective

export type GameKeyboardMapping = {
  direction: {
    up: KeyboardEventKey[];
    down: KeyboardEventKey[];
    left: KeyboardEventKey[];
    right: KeyboardEventKey[];
  };
  buttons: {
    action: KeyboardEventKey[]; // button, enter, etc
    switch: KeyboardEventKey[]; // tab
    back: KeyboardEventKey[]; // esc, shift-tab
    toggleMap: KeyboardEventKey[];
    togglePerspective: KeyboardEventKey[];
  };
};

export type PlayerInput = {
  keyboardMapping: GameKeyboardMapping;
};

export type PlayerInputs = {
  player1: PlayerInput;
};
