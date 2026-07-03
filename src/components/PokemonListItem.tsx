import { Text, View } from "react-native";
import { Link } from "expo-router";

type Props = {
  name: string;
};

export function PokemonListItem({ name }: Props) {
  return (
    <Link href={`./pokemon/${name}`}>
      <View>
        <Text>{name}</Text>
      </View>
    </Link>
  );
}
