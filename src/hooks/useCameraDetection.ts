import { useFaceDetector } from "@noma4i/vision-camera-face-detector";
import type { FaceRect } from "@noma4i/vision-camera-face-detector";
import { usePhotoOutput } from "react-native-vision-camera";

import type { OverlayPosition, Size } from "../types/camera.ts";

const OVERLAY_FACE_WIDTH_RATIO = 0.85;
const MIN_OVERLAY_SIZE = 64;
const MAX_OVERLAY_SIZE = 150;
const FOREHEAD_OFFSET_RATIO = 0.85;

function getOverlaySize(faceWidth: number): number {
  return Math.min(
    MAX_OVERLAY_SIZE,
    Math.max(MIN_OVERLAY_SIZE, faceWidth * OVERLAY_FACE_WIDTH_RATIO),
  );
}

function getForeheadPosition(faceRect: FaceRect): OverlayPosition {
  const imageSize = getOverlaySize(faceRect.width);

  return {
    x: faceRect.x + faceRect.width / 2 - imageSize / 2,
    y: faceRect.y - imageSize * FOREHEAD_OFFSET_RATIO,
    width: imageSize,
    height: imageSize,
  };
}

export function useCameraDetection(previewSize: Size) {
  const photoOutput = usePhotoOutput({ quality: 0.9, containerFormat: "jpeg" });
  const hasPreviewSize = previewSize.width > 0 && previewSize.height > 0;

  const face = useFaceDetector({
    preset: "selfie",
    guide: "none",
    fps: 8,
    outputs: photoOutput,
    preview: hasPreviewSize ? previewSize : "screen",
    android: {
      enableTracking: true,
    },
  });

  const faceRect = face.result.primaryFaceRect ?? null;
  const overlayPosition = faceRect ? getForeheadPosition(faceRect) : null;

  return {
    cameraProps: face.camera,
    photoOutput,
    overlayPosition,
    hasFace: !!face.result.primaryFace,
    isFaceReady: face.ready,
    isAvailable: face.available,
  };
}
