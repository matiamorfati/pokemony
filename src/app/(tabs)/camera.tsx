import { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";

export default function CameraScreen() {
  const device = useCameraDevice("back");

  return <Camera style={{ flex: 1 }} isActive={true} device="back" />;
}
