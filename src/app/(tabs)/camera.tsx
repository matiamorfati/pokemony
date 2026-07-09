import { useState } from "react";
import {
  ActivityIndicator,
  Button,
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
import { useFavouritePokemon } from "../../hooks/useFavouritePokemon";
import { usePokemonDetails } from "../../hooks/usePokemonDetails";

type CameraFacing = "front" | "back";

export default function CameraScreen() {
  const [cameraFacing, setCameraFacing] = useState<CameraFacing>("front");
  const device = useCameraDevice(cameraFacing);
  const { cameraProps, overlayPosition } = useCameraDetection();
  const {
    isLoading,
    error,
    permissionDenied,
    requestPermission,
    canRequestPermission,
    openAppSettings,
  } = useCameraPermissionHook();
  const { favouriteName } = useFavouritePokemon();
  const {
    data,
    isLoading: isLoadingImage,
    isError,
    refetch,
  } = usePokemonDetails(favouriteName);
  const imageURL = data?.imageURL ?? null;
  function toggleCameraFacing() {
    setCameraFacing((current) => (current === "front" ? "back" : "front"));
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.statusText}>Camera is loading...</Text>
      </View>
    );
  }

  if (permissionDenied) {
    return (
      <View style={styles.centered}>
        <Text style={styles.statusText}>Camera permission denied.</Text>
        <Button
          title={canRequestPermission ? "Grant permission" : "Open settings"}
          onPress={canRequestPermission ? requestPermission : openAppSettings}
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

  return (
    <View style={styles.container}>
      <Camera
        {...cameraProps}
        style={styles.camera}
        device={device}
        isActive
        mirrorMode="auto"
      />

      {canShowPokemonOverlay && (
        <CameraOverlay imageUrl={imageURL} position={overlayPosition} />
      )}

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
        </View>

        <View style={styles.bottomBar}>
          <Pressable
            style={styles.captureButton}
            accessibilityLabel="Capture photo"
            disabled
          >
            <View style={styles.captureButtonInner} />
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
