import type { pokemonListResponse } from "../types/pokemon";

const URL = "https://pokeapi.co/api/v2/";

export async function getPokemonPage(
  offset: number,
  limit: number,
): Promise<pokemonListResponse> {
  const response = await fetch(
    `${URL}/pokemon/?offset=${offset}&limit=${limit}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch pokemon page: ${response.status}`);
  }
  return response.json();
}
