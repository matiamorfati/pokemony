import { useCallback } from "react";
import { Linking } from "react-native";

export function useOpenAppSettings() {
  const openAppSettings = useCallback(async () => {
    await Linking.openSettings();
  }, []);
  return { openAppSettings };
}
