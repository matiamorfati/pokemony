import { useEffect, useState } from "react";
import { useCameraPermission } from "react-native-vision-camera";
import { useOpenAppSettings } from "./useOpenAppSettings";

export function useCameraPermissionHook() {
  const { hasPermission, requestPermission, canRequestPermission } =
    useCameraPermission();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { openAppSettings } = useOpenAppSettings();

  useEffect(() => {
    let isMounted = true;

    async function ensurePermission() {
      if (hasPermission) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }
      try {
        await requestPermission();
        if (isMounted) {
          setIsLoading(false);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to get camera permission",
          );
          setIsLoading(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void ensurePermission();
    return () => {
      isMounted = false;
    };
  }, [hasPermission, requestPermission]);
  return {
    hasPermission,
    isLoading,
    error,
    permissionDenied: !isLoading && !hasPermission,
    requestPermission,
    canRequestPermission,
    openAppSettings,
  };
}
