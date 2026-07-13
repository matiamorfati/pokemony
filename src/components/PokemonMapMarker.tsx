import { StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import { Image } from "expo-image";

import type { PokemonMapMarkerProps } from "../types/map.ts";
const placeholderImage = require("../../assets/icons/pokemon-marker-placeholder.svg");

export function PokemonMapMarker({
  marker,
  opened,
  onPressOpen,
  onPressShow,
}: PokemonMapMarkerProps) {
  return (
    <Marker
      coordinate={{
        latitude: marker.latitude,
        longitude: marker.longitude,
      }}
      onPress={opened ? onPressShow : onPressOpen}
      tracksViewChanges={true}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <Image
        source={opened ? { uri: marker.imageURL } : placeholderImage}
        style={styles.sprite}
        transition={200}
        contentFit="contain"
        contentPosition="center"
        cachePolicy="memory-disk"
        recyclingKey={marker.pokemonId.toString()}
        accessibilityLabel={marker.name}
      />
    </Marker>
  );
}

const styles = StyleSheet.create({
  sprite: {
    width: 64,
    height: 64,
  },
});
