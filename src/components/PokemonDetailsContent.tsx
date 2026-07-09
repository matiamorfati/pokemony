import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import {
  getPokemonTypeColor,
  getPokemonTypeTextColor,
} from "../constants/pokemonTypeColors";
import { PokemonDetailsResponse } from "../types/pokemon";

type PokemonDetailsContentProps = {
  pokemon: PokemonDetailsResponse;
  isFavourite: boolean;
};
const favouritePlaceholderImage = require("../../assets/icons/favourite-pokemon-placeholder.svg");
const placeholderImage = require("../../assets/icons/pokemon-placeholder.svg");
export function PokemonDetailsContent({
  pokemon,
  isFavourite,
}: PokemonDetailsContentProps) {
  const primaryType =
    pokemon.types.find((type) => type.slot === 1)?.type.name ??
    pokemon.types[0]?.type.name ??
    "normal";
  const headerColor = getPokemonTypeColor(primaryType);
  const headerTextColor = getPokemonTypeTextColor(primaryType);
  const artworkUrl =
    pokemon.sprites.other["official-artwork"].front_default ?? pokemon.imageURL;

  return (
    <>
      <View style={[styles.artworkHeader, { backgroundColor: headerColor }]}>
        <Text style={[styles.id, { color: headerTextColor }]}>
          #{pokemon.id}
        </Text>

        {artworkUrl ? (
          <Image
            source={{ uri: artworkUrl }}
            style={styles.artwork}
            placeholder={
              isFavourite ? favouritePlaceholderImage : placeholderImage
            }
            transition={100}
            contentFit="contain"
            contentPosition="center"
            cachePolicy="memory-disk"
            recyclingKey={pokemon.id.toString()}
            accessibilityLabel={pokemon.name}
          />
        ) : (
          <View style={styles.artworkPlaceholder}>
            <Text style={styles.artworkPlaceholderText}>No image</Text>
          </View>
        )}

        <Text style={[styles.name, { color: headerTextColor }]}>
          {pokemon.name}
        </Text>

        <View style={styles.typesContainer}>
          {pokemon.types.map((pokemonType) => (
            <View key={pokemonType.type.name} style={styles.typeBadge}>
              <Text
                style={[
                  styles.typeText,
                  { color: getPokemonTypeTextColor(pokemonType.type.name) },
                ]}
              >
                {pokemonType.type.name}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoValue}>{pokemon.height / 10} m</Text>
            <Text style={styles.infoLabel}>Height</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoValue}>{pokemon.weight / 10} kg</Text>
            <Text style={styles.infoLabel}>Weight</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Abilities</Text>
          <View style={styles.abilitiesContainer}>
            {pokemon.abilities.map((pokemonAbility) => (
              <Text
                key={pokemonAbility.ability.name}
                style={styles.abilityText}
              >
                {pokemonAbility.ability.name}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Base stats</Text>
          <View style={styles.statsContainer}>
            {pokemon.stats.map((pokemonStat) => (
              <View key={pokemonStat.stat.name} style={styles.statRow}>
                <Text style={styles.statName}>{pokemonStat.stat.name}</Text>
                <Text style={styles.statValue}>{pokemonStat.base_stat}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  artworkHeader: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 24,
    gap: 8,
  },

  artwork: {
    width: 220,
    height: 220,
    resizeMode: "contain",
  },

  artworkPlaceholder: {
    width: 220,
    height: 220,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  artworkPlaceholderText: {
    color: "#ffffff",
    fontWeight: "600",
  },

  id: {
    fontSize: 14,
    fontWeight: "700",
    opacity: 0.85,
  },

  name: {
    fontSize: 32,
    fontWeight: "900",
    textTransform: "capitalize",
  },

  typesContainer: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
  },

  typeBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(0, 0, 0, 0.14)",
  },

  typeText: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  body: {
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 20,
  },

  infoRow: {
    flexDirection: "row",
    gap: 12,
  },

  infoBox: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
  },

  infoValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#222222",
  },

  infoLabel: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
    color: "#888888",
    textTransform: "uppercase",
  },

  section: {
    gap: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#222222",
  },

  abilitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  abilityText: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontSize: 14,
    fontWeight: "700",
    color: "#444444",
    textTransform: "capitalize",
  },

  statsContainer: {
    gap: 8,
  },

  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  statName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555555",
    textTransform: "capitalize",
  },

  statValue: {
    fontSize: 14,
    fontWeight: "900",
    color: "#222222",
  },
});
