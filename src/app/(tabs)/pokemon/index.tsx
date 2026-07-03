import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { PokemonListItem } from "../../../components/PokemonListItem";
import { usePokemonList } from "../../../hooks/usePokemonList";

export default function PokemonListScreen() {
  const { data, isLoading, isError, refetch } = usePokemonList();

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator />
        <Text>Loading Pokemon...</Text>
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
      data={data ?? []}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => <PokemonListItem name={item.name} />}
    />
  );
}
