import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { PokemonDetailsView } from "../../../components/PokemonDetailsView";
import { PokemonListItem } from "../../../components/PokemonListItem";
import { usePokemonList } from "../../../hooks/usePokemonList";
import { useFavouritePokemon } from "../../../hooks/useFavouritePokemon";

export default function PokemonListScreen() {
  const [selectedPokemonName, setSelectedPokemonName] = useState<string | null>(
    null,
  );
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePokemonList();

  const pokemon = data?.pages.flatMap((page) => page.results) ?? [];
  const { favouriteName } = useFavouritePokemon();
  if (isLoading) {
    return (
      <View>
        <ActivityIndicator />
        <Text>Loading Pokemons...</Text>
      </View>
    );
  } else if (isError) {
    return (
      <View>
        <Text>Something went wrong!</Text>
        <Text onPress={() => refetch()}>Try again</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={pokemon}
        numColumns={2}
        keyExtractor={(item) => item.name}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <PokemonListItem
            pokemon={item}
            onPress={() => setSelectedPokemonName(item.name)}
            isFavourite={favouriteName === item.name}
          />
        )}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
        contentContainerStyle={styles.container}
      />

      <PokemonDetailsView
        pokemonName={selectedPokemonName}
        onClose={() => setSelectedPokemonName(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  container: {
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: "#f3f4f6",
  },
  row: {
    justifyContent: "space-between",
  },
});
