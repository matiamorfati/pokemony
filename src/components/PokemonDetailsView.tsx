import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useFavouritePokemon } from "../hooks/useFavouritePokemon";
import { usePokemonDetails } from "../hooks/usePokemonDetails";
import { FavouriteButton } from "./FavouriteButton";
import { PokemonDetailsContent } from "./PokemonDetailsContent";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.8;

type PokemonDetailsViewProps = {
  pokemonName: string | null;
  onClose: () => void;
};

export function PokemonDetailsView({
  pokemonName,
  onClose,
}: PokemonDetailsViewProps) {
  const slideAnim = useMemo(() => new Animated.Value(SHEET_MAX_HEIGHT), []);

  const { data: pokemon, isLoading, isError } = usePokemonDetails(pokemonName);
  const { favouriteName, setFavourite, removeFavourite } =
    useFavouritePokemon();

  const isVisible = pokemonName !== null;
  const isFavourite = pokemon?.name === favouriteName;
  const isAddLocked = favouriteName !== null && !isFavourite;

  useEffect(() => {
    if (isVisible) {
      slideAnim.setValue(SHEET_MAX_HEIGHT);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 22,
        stiffness: 220,
      }).start();
    }
  }, [isVisible, pokemonName, slideAnim]);

  function handleClose() {
    Animated.timing(slideAnim, {
      toValue: SHEET_MAX_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        onClose();
      }
    });
  }

  async function handleFavouritePress() {
    if (!pokemon) {
      return;
    }

    if (isFavourite) {
      await removeFavourite();
    }

    if (favouriteName !== null) {
      return;
    }
    await setFavourite(pokemon.name);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <Animated.View
          style={[
            styles.sheet,
            {
              maxHeight: SHEET_MAX_HEIGHT,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.handle} />

          {isLoading && (
            <View style={styles.centeredState}>
              <ActivityIndicator size="large" color="#ef5350" />
            </View>
          )}

          {isError && (
            <View style={styles.centeredState}>
              <Text style={styles.errorText}>
                Could not load Pokémon details.
              </Text>
              <FavouriteButton title="Close" onPress={handleClose} />
            </View>
          )}

          {pokemon && (
            <>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                <PokemonDetailsContent
                  pokemon={pokemon}
                  isFavourite={isFavourite}
                />
              </ScrollView>

              <View style={styles.footer}>
                <FavouriteButton
                  title={
                    isFavourite ? "Remove from favourites" : "Add to favourites"
                  }
                  variant={isFavourite ? "danger" : "primary"}
                  locked={isAddLocked}
                  onPress={handleFavouritePress}
                />
              </View>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },

  backdrop: {
    ...StyleSheet.absoluteFill,
  },

  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },

  handle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#d1d5db",
    marginTop: 10,
    marginBottom: 4,
  },

  centeredState: {
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },

  errorText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444444",
    textAlign: "center",
  },

  scrollContent: {
    paddingBottom: 16,
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
