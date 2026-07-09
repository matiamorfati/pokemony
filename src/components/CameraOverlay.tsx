import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import type { OverlayPosition } from "../types/camera";

type CameraOverlayProps = {
  imageUrl: string;
  position: OverlayPosition | null;
};

export function CameraOverlay({ imageUrl, position }: CameraOverlayProps) {
  if (!position) {
    return <View style={styles.overlay} pointerEvents="none" />;
  }

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Image
        source={{ uri: imageUrl }}
        style={[
          styles.image,
          {
            left: position.x,
            top: position.y,
            width: position.width,
            height: position.height,
          },
        ]}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  image: {
    position: "absolute",
  },
});
