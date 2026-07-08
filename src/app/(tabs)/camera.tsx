import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Button,
} from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { useCameraPermissionHook } from "../../hooks/useCameraPermission";

export default function CameraScreen() {
  const device = useCameraDevice("back");
  const { isLoading, error, permissionDenied, requestPermission } =
    useCameraPermissionHook();

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large"></ActivityIndicator>
        <Text>Camera is loading...</Text>
      </View>
    );
  }

  if (permissionDenied) {
    return (
      <View>
        <Text>Camera permission denied.</Text>
        <Button title="Grant permission" onPress={requestPermission}></Button>
      </View>
    );
  }
  if (!device) {
    return (
      <View>
        <Text>No camera detected.</Text>
      </View>
    );
  }
  return <Camera style={{ flex: 1 }} device={device} isActive={true}></Camera>;
}

const styles = StyleSheet.create({});
