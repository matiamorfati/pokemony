import { useEffect, useState } from "react";
import * as MediaLibrary from "expo-media-library";

import { useOpenAppSettings } from "./useOpenAppSettings";

export function useMediaLibraryPermission() {
  const [permission, setPermission] =
    useState<MediaLibrary.PermissionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { openAppSettings } = useOpenAppSettings();

  useEffect(() => {
    let isMounted = true;

    async function ensurePermission() {
      try {
        const response = await MediaLibrary.requestPermissionsAsync(true);
        if (isMounted) {
          setPermission(response);
        }
      } catch (permissionError) {
        if (isMounted) {
          setError(
            permissionError instanceof Error
              ? permissionError.message
              : "Failed to get media library permission",
          );
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
  }, []);

  async function requestPermission() {
    setError(null);
    const response = await MediaLibrary.requestPermissionsAsync(true);
    setPermission(response);
    return response;
  }

  const hasPermission = permission?.granted ?? false;
  const canRequestPermission = permission?.canAskAgain ?? true;

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
