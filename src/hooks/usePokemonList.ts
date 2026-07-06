import { useInfiniteQuery } from "@tanstack/react-query";
import { getPokemonPage } from "../api/pokemonAPI";

const POKEMON_LIMIT = 20;

export function usePokemonList() {
  return useInfiniteQuery({
    queryKey: ["pokemonList"],
    queryFn: ({ pageParam }) => getPokemonPage(pageParam, POKEMON_LIMIT),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.next) {
        return undefined;
      }
      return allPages.length * POKEMON_LIMIT;
    },
  });
}
