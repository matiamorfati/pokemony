import { StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import { Image } from "expo-image";
import { MapMarker } from "../types/map";

type PokemonMapMarkerProps = {
  marker: MapMarker;
  onPress: () => void;
};
const placeholderImage = require("../../assets/icons/pokemon-marker-placeholder.svg");

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
      <Image
        source={{ uri: marker.imageURL }}
        style={styles.sprite}
        placeholder={placeholderImage}
        transition={300}
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
