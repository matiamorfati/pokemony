import { Text, View, Image, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";

type Props = {
  name: string;
  imageURL: string;
  onPress: () => void;
};

export function PokemonListItem({ name, imageURL, onPress }: Props) {
  return (
    <Link href={`./pokemon/${name}`}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        <View style={styles.innerContainer}>
          <Image source={{ uri: imageURL }} style={styles.image} />
          <Text style={styles.name}>{name}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    marginVertical: 4,
    backgroundColor: "#fff",
    width: "100%",
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: "#f0f0f0",
  },
  innerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 16,
    width: "100%",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 16,
    marginRight: 16,
  },
});
