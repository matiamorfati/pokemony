import { Pressable, StyleSheet, Text } from "react-native";

type FavouriteButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "danger";
  locked?: boolean;
};

export function FavouriteButton({
  title,
  onPress,
  variant = "primary",
  locked = false,
}: FavouriteButtonProps) {
  return (
    <Pressable
      onPress={locked ? undefined : onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "danger" ? styles.dangerButton : styles.primaryButton,
        locked && styles.disabled,
        pressed && !locked && styles.pressed,
      ]}
      disabled={locked}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 180,
  },

  primaryButton: {
    backgroundColor: "#ef5350",
  },

  dangerButton: {
    backgroundColor: "#2f2f2f",
  },

  disabled: {
    opacity: 0.5,
    backgroundColor: "#2f2f2f",
  },

  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
