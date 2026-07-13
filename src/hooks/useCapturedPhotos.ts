import { useCallback, useState } from "react";
import { Asset } from "expo-media-library";
import * as FileSystem from "expo-file-system/legacy";
import type { CameraPhotoOutput } from "react-native-vision-camera";

import type { CapturePhotoParams } from "../types/camera.ts";
import { compositePokemonPhoto } from "../utils/compositePokemonPhoto";

export function useCapturedPhotos() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSavedUri, setLastSavedUri] = useState<string | null>(null);

  const capturePhoto = useCallback(
    async ({
      photoOutput,
      overlayPosition,
      pokemonImageUrl,
      previewSize,
    }: CapturePhotoParams) => {
      setIsCapturing(true);
      setError(null);

      let photo: Awaited<ReturnType<CameraPhotoOutput["capturePhoto"]>> | null =
        null;
      let imageForExport: Awaited<
        ReturnType<
          Awaited<ReturnType<CameraPhotoOutput["capturePhoto"]>>["toImageAsync"]
        >
      > | null = null;

      try {
        photo = await photoOutput.capturePhoto(
          { flashMode: "off", enableShutterSound: true },
          {},
        );

        imageForExport = await photo.toImageAsync();
        const encodedPhoto = await imageForExport.toEncodedImageDataAsync(
          "jpg",
          90,
        );
        const photoBytes = new Uint8Array(encodedPhoto.buffer);

        const composedBytes = await compositePokemonPhoto({
          photoBytes,
          pokemonImageUrl,
          overlayPosition,
          previewSize,
          isMirrored: photo.isMirrored,
        });

        const fileUri = `${FileSystem.cacheDirectory}pokemon-photo-${Date.now()}.jpg`;

        await FileSystem.writeAsStringAsync(
          fileUri,
          uint8ArrayToBase64(composedBytes),
          { encoding: FileSystem.EncodingType.Base64 },
        );

        await Asset.create(fileUri);
        setLastSavedUri(fileUri);
      } catch (captureError) {
        setError(
          captureError instanceof Error
            ? captureError.message
            : "Failed to capture photo",
        );
      } finally {
        imageForExport?.dispose();
        photo?.dispose();
        setIsCapturing(false);
      }
    },
    [],
  );

  return {
    capturePhoto,
    isCapturing,
    error,
    lastSavedUri,
  };
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}
