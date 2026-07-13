import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { LongPressEvent } from "react-native-maps";

import { PokemonDetailsView } from "../../components/PokemonDetailsView";
import { PokemonMapMarker } from "../../components/PokemonMapMarker";
import { usePokemonMarker } from "../../hooks/usePokemonMarker";
import { useUserLocation } from "../../hooks/useUserLocation";
import { MapMarker } from "../../types/map";

const MAP_ZOOM = {
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const FALLBACK_REGION = {
  latitude: 50.09090669695661,
  longitude: 19.996300726106693,
  ...MAP_ZOOM,
};

export default function MapScreen() {
  const {
    location,
    isLoading,
    permissionDenied,
    error,
    openAppSettings,
    canAskAgain,
  } = useUserLocation();
  const {
    markers,
    addMarker,
    openMarker,
    isAdding,
    error: markerError,
  } = usePokemonMarker();
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.statusText}>Loading map...</Text>
      </View>
    );
  }

  const canShowUserLocation = !permissionDenied && location !== null;

  const initialRegion = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        ...MAP_ZOOM,
      }
    : FALLBACK_REGION;

  function handleLongPress(event: LongPressEvent) {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    addMarker(latitude, longitude);
  }

  return (
    <View style={styles.container}>
      {(permissionDenied || error) && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            {permissionDenied
              ? "Location permission denied. Showing default area."
              : error}
          </Text>
          <Button
            title={canAskAgain ? "Grant permission" : "Open settings"}
            onPress={canAskAgain ? /*retry*/ undefined : openAppSettings}
          />
        </View>
      )}

      {markerError && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{markerError}</Text>
        </View>
      )}

      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={canShowUserLocation}
        onLongPress={handleLongPress}
      >
        {markers.map((marker) => (
          <PokemonMapMarker
            opened={marker.opened}
            key={marker.id}
            marker={marker}
            onPressOpen={() => openMarker(marker.id)}
            onPressShow={() => setSelectedMarker(marker)}
          />
        ))}
      </MapView>

      {isAdding && (
        <View style={styles.addingOverlay}>
          <ActivityIndicator color="#FFFFFF" />
          <Text style={styles.addingText}>Adding pokemon...</Text>
        </View>
      )}

      <PokemonDetailsView
        pokemonName={selectedMarker?.name ?? null}
        onClose={() => setSelectedMarker(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  statusText: {
    fontSize: 16,
  },
  banner: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bannerText: {
    color: "#92400E",
    fontSize: 14,
  },
  addingOverlay: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(17, 24, 39, 0.85)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  addingText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});
