import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { PokemonListItem } from "../../../components/PokemonListItem";
import { usePokemonList } from "../../../hooks/usePokemonList";

export default function PokemonListScreen() {
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
    <FlatList
      data={pokemon}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <PokemonListItem
          name={item.name}
          imageURL={item.imageURL}
          onPress={() => {
            return 0;
          }}
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
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
});
