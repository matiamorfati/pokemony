import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useFocusEffect } from "expo-router";

import {
  getFavouritePokemonName,
  removeFavouritePokemonName,
  setFavouritePokemonName,
} from "../storages/storageAsync";

const FAVOURITE_QUERY_KEY = ["favouritePokemonName"];

export function useFavouritePokemon() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: FAVOURITE_QUERY_KEY,
    queryFn: getFavouritePokemonName,
  });

  const setFavouriteMutation = useMutation({
    mutationFn: setFavouritePokemonName,
    onSuccess: (_, name) => {
      queryClient.setQueryData(FAVOURITE_QUERY_KEY, name);
    },
  });

  const removeFavouriteMutation = useMutation({
    mutationFn: removeFavouritePokemonName,
    onSuccess: () => {
      queryClient.setQueryData(FAVOURITE_QUERY_KEY, null);
    },
  });

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  return {
    favouriteName: data ?? null,
    isLoading,
    isError,
    setFavourite: setFavouriteMutation.mutateAsync,
    removeFavourite: removeFavouriteMutation.mutateAsync,
  };
}
