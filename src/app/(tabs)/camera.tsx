import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Button,
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { SafeAreaView } from "react-native-safe-area-context";

import { CameraOverlay } from "../../components/CameraOverlay";
import { useCameraDetection } from "../../hooks/useCameraDetection";
import { useCameraPermissionHook } from "../../hooks/useCameraPermission";
import { useCapturedPhotos } from "../../hooks/useCapturedPhotos";
import { useFavouritePokemon } from "../../hooks/useFavouritePokemon";
import { useMediaLibraryPermission } from "../../hooks/useMediaLibraryPermission";
import { usePokemonDetails } from "../../hooks/usePokemonDetails";
import type { Size } from "../../types/camera";

type CameraFacing = "front" | "back";

export default function CameraScreen() {
  const [cameraFacing, setCameraFacing] = useState<CameraFacing>("front");
  const [previewSize, setPreviewSize] = useState<Size>({ width: 0, height: 0 });
  const device = useCameraDevice(cameraFacing);
  const { cameraProps, photoOutput, overlayPosition, hasFace, isFaceReady } =
    useCameraDetection(previewSize);
  const {
    isLoading,
    error,
    permissionDenied,
    requestPermission,
    canRequestPermission,
    openAppSettings,
  } = useCameraPermissionHook();
  const {
    isLoading: isMediaPermissionLoading,
    permissionDenied: mediaPermissionDenied,
    requestPermission: requestMediaPermission,
    canRequestPermission: canRequestMediaPermission,
    openAppSettings: openMediaSettings,
  } = useMediaLibraryPermission();
  const {
    capturePhoto,
    isCapturing,
    error: captureError,
    lastSavedUri,
  } = useCapturedPhotos();
  const { favouriteName } = useFavouritePokemon();
  const {
    data,
    isLoading: isLoadingImage,
    isError,
    refetch,
  } = usePokemonDetails(favouriteName);
  const imageURL = data?.imageURL ?? null;
  const hasPreviewSize = previewSize.width > 0 && previewSize.height > 0;

  const handlePreviewLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    setPreviewSize((current) =>
      current.width === width && current.height === height
        ? current
        : { width, height },
    );
  }, []);

  function toggleCameraFacing() {
    setCameraFacing((current) => (current === "front" ? "back" : "front"));
  }

  const canCapturePhoto =
    !!favouriteName &&
    !!imageURL &&
    !!overlayPosition &&
    hasFace &&
    isFaceReady &&
    hasPreviewSize &&
    !isCapturing &&
    !mediaPermissionDenied;

  async function handleCapturePhoto() {
    if (
      !photoOutput ||
      !overlayPosition ||
      !imageURL ||
      !favouriteName ||
      !hasPreviewSize
    ) {
      return;
    }

    await capturePhoto({
      photoOutput,
      overlayPosition,
      pokemonImageUrl: imageURL,
      pokemonName: favouriteName,
      previewSize,
    });
  }

  if (isLoading || isMediaPermissionLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.statusText}>Camera is loading...</Text>
      </View>
    );
  }

  if (permissionDenied || mediaPermissionDenied) {
    const isCameraDenied = permissionDenied;

    return (
      <View style={styles.centered}>
        <Text style={styles.statusText}>
          {isCameraDenied
            ? "Camera permission denied."
            : "Photo library permission denied."}
        </Text>
        <Button
          title={
            (isCameraDenied ? canRequestPermission : canRequestMediaPermission)
              ? "Grant permission"
              : "Open settings"
          }
          onPress={
            (isCameraDenied ? canRequestPermission : canRequestMediaPermission)
              ? isCameraDenied
                ? requestPermission
                : requestMediaPermission
              : isCameraDenied
                ? openAppSettings
                : openMediaSettings
          }
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.centered}>
        <Text style={styles.statusText}>No camera detected.</Text>
      </View>
    );
  }

  const canShowPokemonOverlay = !!imageURL && !isLoadingImage && !isError;
  const isFrontCamera = cameraFacing === "front";

  return (
    <View style={styles.container} onLayout={handlePreviewLayout}>
      <View
        style={[
          styles.previewLayer,
          isFrontCamera && styles.previewLayerMirrored,
        ]}
      >
        <Camera
          {...cameraProps}
          style={styles.camera}
          device={device}
          isActive
          mirrorMode="off"
        />

        {canShowPokemonOverlay && (
          <CameraOverlay imageUrl={imageURL} position={overlayPosition} />
        )}
      </View>

      <SafeAreaView style={styles.uiLayer} pointerEvents="box-none">
        <View style={styles.topBar}>
          <Pressable
            style={styles.iconButton}
            onPress={toggleCameraFacing}
            accessibilityLabel="Flip camera"
          >
            <Ionicons name="camera-reverse" size={28} color="#FFFFFF" />
          </Pressable>
        </View>
        <View style={styles.middleLayer}>
          {!favouriteName && (
            <View style={styles.messageCard}>
              <Text style={styles.messageTitle}>No favourite Pokémon yet</Text>
            </View>
          )}
          {favouriteName && isLoadingImage && (
            <ActivityIndicator size="large" color="#FFFFFF" />
          )}
          {favouriteName && isError && (
            <View style={styles.messageCard}>
              <Text style={styles.messageTitle}>
                Failed to load Pokémon image
              </Text>
              <Button title="Retry" onPress={() => refetch()} />
            </View>
          )}
          {favouriteName && !hasFace && (
            <View style={styles.messageCard}>
              <Text style={styles.messageTitle}>
                Point your face at the camera
              </Text>
            </View>
          )}
          {captureError && (
            <View style={styles.messageCard}>
              <Text style={styles.messageTitle}>{captureError}</Text>
            </View>
          )}
          {lastSavedUri && !captureError && (
            <View style={styles.messageCard}>
              <Text style={styles.messageTitle}>Photo saved to gallery</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomBar}>
          <Pressable
            style={[
              styles.captureButton,
              !canCapturePhoto && styles.captureButtonDisabled,
            ]}
            accessibilityLabel="Capture photo"
            disabled={!canCapturePhoto}
            onPress={handleCapturePhoto}
          >
            {isCapturing ? (
              <ActivityIndicator color="#111827" />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  previewLayer: {
    ...StyleSheet.absoluteFill,
  },
  previewLayerMirrored: {
    transform: [{ scaleX: -1 }],
  },
  camera: {
    ...StyleSheet.absoluteFill,
  },
  uiLayer: {
    flex: 1,
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  bottomBar: {
    alignItems: "center",
    paddingBottom: 24,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FFFFFF",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  statusText: {
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#B91C1C",
    textAlign: "center",
  },
  middleLayer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  messageCard: {
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
  },
  messageTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
});
