import { useQuery } from "@tanstack/react-query";
import { getPokemonPage } from "../api/pokemonAPI";

const PAGE_SIZE = 20;

export function usePokemonList() {
  return useQuery({
    queryKey: ["pokemonList"],
    queryFn: async () => {
      const response = await getPokemonPage(0, PAGE_SIZE);
      return response.results;
    },
  });
}
