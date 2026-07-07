import { useEffect, useState } from "react";
import * as Location from "expo-location";

type Coordinates = {
  latitude: number;
  longitude: number;
};

export function useUserLocation() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          if (isMounted) {
            setPermissionDenied(true);
            setIsLoading(false);
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

  return { location, isLoading, permissionDenied, error };
}
