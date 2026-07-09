import { useFaceDetector } from "@noma4i/vision-camera-face-detector";
import type { FaceRect } from "@noma4i/vision-camera-face-detector";

import type { OverlayPosition } from "../types/camera";

const POKEMON_OVERLAY_SIZE = 120;

function getForeheadPosition(
  faceRect: FaceRect,
  imageSize = POKEMON_OVERLAY_SIZE,
): OverlayPosition {
  return {
    x: faceRect.x + faceRect.width / 2 - imageSize / 2,
    y: faceRect.y - imageSize * 0.55,
    width: imageSize,
    height: imageSize,
  };
}

export function useCameraDetection() {
  const face = useFaceDetector({
    preset: "selfie",
    guide: "none",
    fps: 8,
    android: {
      enableTracking: true,
    },
  });

  const faceRect = face.result.primaryFaceRect ?? null;
  const overlayPosition = faceRect ? getForeheadPosition(faceRect) : null;

  return {
    cameraProps: face.camera,
    overlayPosition,
    hasFace: !!face.result.primaryFace,
    isAvailable: face.available,
  };
}
