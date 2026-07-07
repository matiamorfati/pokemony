import { useQuery } from "@tanstack/react-query";
import { getPokemonDetails } from "../api/pokemonAPI";

export function usePokemonDetails(name: string | null) {
  return useQuery({
    queryKey: ["pokemonDetails", name],
    queryFn: () => getPokemonDetails(name!),
    enabled: !!name,
  });
}
