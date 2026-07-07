import { Image, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";

import { MapMarker } from "../types/map";

type PokemonMapMarkerProps = {
  marker: MapMarker;
  onPress: () => void;
};

export function PokemonMapMarker({ marker, onPress }: PokemonMapMarkerProps) {
  return (
    <Marker
      coordinate={{
        latitude: marker.latitude,
        longitude: marker.longitude,
      }}
      onPress={onPress}
      tracksViewChanges={false}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <Image source={{ uri: marker.imageURL }} style={styles.sprite} />
    </Marker>
  );
}

const styles = StyleSheet.create({
  sprite: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
});
