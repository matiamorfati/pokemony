import { ImageFormat, Skia, type SkImage } from "@shopify/react-native-skia";

import type {
  CompositePokemonPhotoParams,
  OverlayPosition,
} from "../types/camera";
import { scaleOverlayPosition } from "./scaleOverlayPosition";

async function loadSkiaImageFromBytes(bytes: Uint8Array): Promise<SkImage> {
  const data = Skia.Data.fromBytes(bytes);
  const image = Skia.Image.MakeImageFromEncoded(data);

  if (!image) {
    throw new Error("Failed to decode photo bytes");
  }

  return image;
}

async function loadSkiaImageFromUri(uri: string): Promise<SkImage> {
  const data = await Skia.Data.fromURI(uri);
  const image = Skia.Image.MakeImageFromEncoded(data);

  if (!image) {
    throw new Error("Failed to decode Pokemon image");
  }

  return image;
}

function fitContainRect(
  imageWidth: number,
  imageHeight: number,
  destination: OverlayPosition,
): OverlayPosition {
  const imageAspect = imageWidth / imageHeight;
  const destinationAspect = destination.width / destination.height;

  if (imageAspect > destinationAspect) {
    const height = destination.width / imageAspect;

    return {
      x: destination.x,
      y: destination.y + (destination.height - height) / 2,
      width: destination.width,
      height,
    };
  }

  const width = destination.height * imageAspect;

  return {
    x: destination.x + (destination.width - width) / 2,
    y: destination.y,
    width,
    height: destination.height,
  };
}

export async function compositePokemonPhoto({
  photoBytes,
  pokemonImageUrl,
  overlayPosition,
  previewSize,
  isMirrored,
}: CompositePokemonPhotoParams): Promise<Uint8Array> {
  const background = await loadSkiaImageFromBytes(photoBytes);
  const overlay = await loadSkiaImageFromUri(pokemonImageUrl);

  const outputWidth = background.width();
  const outputHeight = background.height();

  const scaledPosition = scaleOverlayPosition(overlayPosition, previewSize, {
    width: outputWidth,
    height: outputHeight,
  });

  const drawRect = fitContainRect(
    overlay.width(),
    overlay.height(),
    scaledPosition,
  );

  const surface = Skia.Surface.MakeOffscreen(outputWidth, outputHeight);

  if (!surface) {
    throw new Error("Failed to create Skia offscreen surface");
  }

  const canvas = surface.getCanvas();
  const paint = Skia.Paint();
  const fullRect = { x: 0, y: 0, width: outputWidth, height: outputHeight };

  canvas.save();

  if (isMirrored) {
    canvas.translate(outputWidth, 0);
    canvas.scale(-1, 1);
  }

  canvas.drawImageRect(background, fullRect, fullRect, paint);

  canvas.drawImageRect(
    overlay,
    { x: 0, y: 0, width: overlay.width(), height: overlay.height() },
    drawRect,
    paint,
  );

  canvas.restore();

  surface.flush();

  const snapshot = surface.makeImageSnapshot();
  const rasterImage = snapshot.makeNonTextureImage();

  if (!rasterImage) {
    throw new Error("Failed to rasterize composed photo");
  }

  return rasterImage.encodeToBytes(ImageFormat.JPEG, 90);
}
