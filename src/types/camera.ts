import { CameraPhotoOutput } from "react-native-vision-camera";

export type OverlayPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Size = {
  width: number;
  height: number;
};

export type CompositePokemonPhotoParams = {
  photoBytes: Uint8Array;
  pokemonImageUrl: string;
  overlayPosition: OverlayPosition;
  previewSize: Size;
  isMirrored: boolean;
};

export type CapturePhotoParams = {
  photoOutput: CameraPhotoOutput;
  overlayPosition: OverlayPosition;
  pokemonImageUrl: string;
  pokemonName: string;
  previewSize: Size;
};
