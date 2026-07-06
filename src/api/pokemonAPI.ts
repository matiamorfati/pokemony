import type {
  pokemonListApiResponse,
  pokemonListResponse,
} from "../types/pokemon";

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
  const data: pokemonListApiResponse = await response.json();
  return {
    ...data,
    results: data.results.map((pokemon) => {
      const id = getPokemonIdFromUrl(pokemon.url);
      return {
        ...pokemon,
        id,
        imageURL: getPokemonListImageURL(id),
      };
    }),
  };
}

function getPokemonIdFromUrl(url: string) {
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}

function getPokemonListImageURL(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function getPokemonDetailImageURL(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
