import { Tabs } from "expo-router";
import { colors } from "../../storages/colors";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
        tabBarActiveTintColor: "red",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="pokemon"
        options={{
          title: "Pokémon List",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "list-sharp" : "list-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "map" : "map-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Camera",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "camera" : "camera-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favourite"
        options={{
          title: "Favourite",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
