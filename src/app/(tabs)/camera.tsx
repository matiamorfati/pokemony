import { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Camera, useCameraPermission } from "react-native-vision-camera";

export default function CameraScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);
  return <Camera style={{ flex: 1 }} isActive={true} device="back" />;
}
