import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { FavouriteButton } from "../../components/FavouriteButton";
import { PokemonDetailsContent } from "../../components/PokemonDetailsContent";
import { useFavouritePokemon } from "../../hooks/useFavouritePokemon";
import { usePokemonDetails } from "../../hooks/usePokemonDetails";

export default function FavouriteScreen() {
  const router = useRouter();
  const {
    favouriteName,
    isLoading: isFavouriteLoading,
    removeFavourite,
  } = useFavouritePokemon();
  const {
    data: pokemon,
    isLoading: isPokemonLoading,
    isError,
    refetch,
  } = usePokemonDetails(favouriteName);

  async function handleRemoveFavourite() {
    await removeFavourite();
  }

  if (isFavouriteLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#ef5350" />
      </View>
    );
  }

  if (!favouriteName) {
    return (
      <View style={styles.screen}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyLabel}>Favourite</Text>
          <Text style={styles.emptyTitle}>No favourite Pokémon yet</Text>
          <Text style={styles.emptyDescription}>
            Choose a Pokémon from the list and save it as your favourite.
          </Text>
          <FavouriteButton
            title="Choose Pokémon"
            onPress={() => router.push("/pokemon")}
          />
        </View>
      </View>
    );
  }

  if (isPokemonLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#ef5350" />
      </View>
    );
  }

  if (isError || !pokemon) {
    return (
      <View style={styles.screen}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>
            Could not load favourite Pokémon
          </Text>
          <Text style={styles.emptyDescription}>
            Something went wrong while loading {favouriteName}.
          </Text>
          <FavouriteButton title="Try again" onPress={() => refetch()} />
          <FavouriteButton
            title="Remove favourite"
            variant="danger"
            onPress={handleRemoveFavourite}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.screenLabel}>Your favourite Pokémon</Text>
        <View style={styles.card}>
          <PokemonDetailsContent pokemon={pokemon} isFavourite={true} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <FavouriteButton
          title="Remove from favourites"
          variant="danger"
          onPress={handleRemoveFavourite}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F4F3",
  },

  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F4F3",
  },

  scrollContent: {
    paddingTop: 16,
    paddingBottom: 24,
  },

  screenLabel: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#888888",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.6,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    overflow: "hidden",
    marginHorizontal: 16,
  },

  emptyCard: {
    flex: 1,
    margin: 24,
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },

  emptyLabel: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#888888",
    letterSpacing: 0.6,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    color: "#222222",
  },

  emptyDescription: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
    color: "#666666",
  },

  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
    backgroundColor: "#ffffff",
  },
});
