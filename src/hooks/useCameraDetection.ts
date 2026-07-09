import { useFaceDetector } from "@noma4i/vision-camera-face-detector";
import type { FaceRect } from "@noma4i/vision-camera-face-detector";

import type { OverlayPosition } from "../types/camera";
import { useSmoothedOverlayPosition } from "./useSmoothedOverlayPosition";

const POKEMON_OVERLAY_SIZE = 120;
const POSITION_SMOOTHING = 0.18;

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
    preset: "fast",
    guide: "none",
    fps: 12,
    android: {
      enableTracking: true,
    },
  });

  const faceRect = face.result.primaryFaceRect ?? null;
  const rawOverlayPosition = faceRect ? getForeheadPosition(faceRect) : null;
  const overlayPosition = useSmoothedOverlayPosition(
    rawOverlayPosition,
    POSITION_SMOOTHING,
  );

  return {
    cameraProps: face.camera,
    overlayPosition,
    hasFace: !!face.result.primaryFace,
    isAvailable: face.available,
  };
}
