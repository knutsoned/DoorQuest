// via https://github.com/microsoft/TypeScript/issues/38886
import { Camera } from "@babylonjs/core/Cameras/camera";
import { Viewport } from "@babylonjs/core/Maths/math.viewport";
import { KeyboardEventKey } from "keyboard-event-key-type"; // seems like a good idea at this time

// restrict config values to 1..255, sounds pretty easy
// um, ok https://stackoverflow.com/a/66085193
export type UInt8NZ = number & { _type_: "UInt8NZ" };

// create/check UInt8NZ values
export const uint8NZ = (value: number): UInt8NZ => {
  if (value < 1 || value > 255) {
    throw new Error(
      `The value ${value} is not a valid positive unsigned 8-bit integer`
    );
  }

  return value as UInt8NZ;
};

export enum UIMode {
  TextOnly,
  Also3D,
  Full3D,
}

export type CameraMap = { [name: string]: Camera };

export type UICameraConfig = Viewport | false;

export type UICameraMode = {
  mode: UIMode;
  config: { [key: string]: UICameraConfig };
};

export interface IConfig {
  vars: {
    mass: UInt8NZ;
    radius: UInt8NZ;
    gravity: UInt8NZ;
    force: UInt8NZ;
    friction: UInt8NZ;
    speed: UInt8NZ;
  };

  // UI flags
  ui: {
    mode: UIMode;
    hideSidebar: boolean;
    showMap: boolean;
    showSecondView: boolean;
    swapViews: boolean;

    // camera setup
    cameras: UICameraMode[];

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
  | " "; // action;

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
  };
};

export type PlayerInput = {
  keyboardMapping: GameKeyboardMapping;
};

export type PlayerInputs = {
  player1: PlayerInput;
};
