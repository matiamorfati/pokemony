import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import {
  getPokemonTypeColor,
  getPokemonTypeTextColor,
} from "../constants/pokemonTypeColors";
import { pokemonListItem } from "../types/pokemon";

type Props = {
  pokemon: pokemonListItem;
  onPress: () => void;
  isFavourite: boolean;
};

const STAR_PATTERN_ROW_OFFSETS = [0, 14, 0, 14, 0, 14, 0];

function FavouriteStarPattern() {
  return (
    <View style={styles.starPatternContainer} pointerEvents="none">
      {STAR_PATTERN_ROW_OFFSETS.map((offset, rowIndex) => (
        <Text key={rowIndex} style={[styles.starRow, { marginLeft: offset }]}>
          ★ ★ ★ ★ ★ ★
        </Text>
      ))}
    </View>
  );
}

export function PokemonListItem({
  pokemon,
  onPress,
  isFavourite = false,
}: Props) {
  const backgroundColor = getPokemonTypeColor(pokemon.primaryType);
  const textColor = getPokemonTypeTextColor(pokemon.primaryType);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor },

        pressed && styles.pressed,
      ]}
    >
      {isFavourite ? <FavouriteStarPattern /> : null}

      <View style={styles.imageWrapper}>
        <Image source={{ uri: pokemon.imageURL }} style={styles.image} />
      </View>

      <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
        {pokemon.name}
      </Text>

      <View style={styles.typeBadge}>
        <Text style={[styles.typeText, { color: textColor }]}>
          {pokemon.primaryType}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 168,
    borderRadius: 20,
    padding: 12,
    margin: 6,
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  starPatternContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    opacity: 0.55,
  },
  starRow: {
    fontSize: 13,
    lineHeight: 20,
    color: "#FFD700",
    letterSpacing: 10,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  imageWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    borderRadius: 16,
    paddingVertical: 8,
  },
  image: {
    width: 88,
    height: 88,
    resizeMode: "contain",
  },
  name: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "800",
    textTransform: "capitalize",
    textAlign: "center",
  },
  typeBadge: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(0, 0, 0, 0.12)",
  },
  typeText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
});
