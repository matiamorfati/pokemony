import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { useOpenAppSettings } from "./useOpenAppSettings";

type Coordinates = {
  latitude: number;
  longitude: number;
};

export function useUserLocation() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canAskAgain, setCanAskAgain] = useState(true);
  const { openAppSettings } = useOpenAppSettings();

  useEffect(() => {
    let isMounted = true;

    async function loadLocation() {
      try {
        const { status, canAskAgain } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          if (isMounted) {
            setPermissionDenied(true);
            setIsLoading(false);
            setCanAskAgain(canAskAgain);
          }
          return;
        }

        const position = await Location.getCurrentPositionAsync({});

        if (isMounted) {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
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
      }
    }

    loadLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    location,
    isLoading,
    permissionDenied,
    error,
    openAppSettings,
    canAskAgain,
    //   retry: loadLocation,
  };
}
