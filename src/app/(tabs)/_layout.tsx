import { Tabs } from "expo-router";
import { colors } from "../../storages/colors";
import { useColorScheme } from "react-native";
export default function Layout() {
  const colorScheme = useColorScheme();
  const backgroundColor =
    colorScheme === "dark" ? colors.background.dark : colors.background.light;
  const textColor =
    colorScheme === "dark" ? colors.text.dark : colors.text.light;
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor,
        },
        headerTintColor: textColor,
      }}
    >
      <Tabs.Screen name="pokemon" options={{ title: "Pokemon List" }} />
      <Tabs.Screen name="map" options={{ title: "Map" }} />
      <Tabs.Screen name="camera" options={{ title: "Camera" }} />
      <Tabs.Screen name="favourite" options={{ title: "Favourite" }} />
    </Tabs>
  );
}
