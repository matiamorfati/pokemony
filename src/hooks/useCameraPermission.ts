import { useEffect, useState } from "react";
import { useCameraPermission } from "react-native-vision-camera";

export function useCameraPermissionHook() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function requestPermission() {
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
              : "Failed to get location",
          );
          setIsLoading(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void requestPermission();
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
  };
}
