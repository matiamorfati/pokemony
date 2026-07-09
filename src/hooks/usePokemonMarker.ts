import { useCallback, useState } from "react";

import { getRandomPokemonMarker } from "../api/pokemonAPI";
import { MapMarker } from "../types/map";

export function usePokemonMarker() {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMarker = useCallback(async (latitude: number, longitude: number) => {
    setIsAdding(true);
    setError(null);

    try {
      const pokemon = await getRandomPokemonMarker();
      const newMarker: MapMarker = {
        id: `${Date.now()}-${latitude}-${longitude}`,
        latitude,
        longitude,
        name: pokemon.name,
        pokemonId: pokemon.pokemonId,
        imageURL: pokemon.imageURL,
      };

      setMarkers((currentMarkers) => [...currentMarkers, newMarker]);
    } catch (addError) {
      setError(
        addError instanceof Error
          ? addError.message
          : "Failed to add pokemon marker",
      );
    } finally {
      setIsAdding(false);
    }
  }, []);

  return { markers, addMarker, isAdding, error };
}
