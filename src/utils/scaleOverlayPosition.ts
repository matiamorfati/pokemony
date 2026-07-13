import type { OverlayPosition, Size } from "../types/camera.ts";

export function scaleOverlayPosition(
  position: OverlayPosition,
  preview: Size,
  photo: Size,
): OverlayPosition {
  const scale = Math.max(preview.width / photo.width, preview.height / photo.height);
  const scaledPhotoWidth = photo.width * scale;
  const scaledPhotoHeight = photo.height * scale;
  const offsetX = (preview.width - scaledPhotoWidth) / 2;
  const offsetY = (preview.height - scaledPhotoHeight) / 2;

  return {
    x: (position.x - offsetX) / scale,
    y: (position.y - offsetY) / scale,
    width: position.width / scale,
    height: position.height / scale,
  };
}
