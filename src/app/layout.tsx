import { Stack } from "expo-router";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Layout() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="pokemon" options={{ title: "Pokemon details" }} />
      </Stack>
    </QueryClientProvider>
  );
}
