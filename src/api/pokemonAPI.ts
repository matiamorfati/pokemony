import type {
  pokemonListApiResponse,
  pokemonListResponse,
  PokemonDetailsApiResponse,
  PokemonDetailsResponse,
} from "../types/pokemon";

const URL = "https://pokeapi.co/api/v2/";

export async function getRandomPokemonMarker(): Promise<{
  name: string;
  imageURL: string;
  pokemonId: number;
}> {
  const id = Math.floor(Math.random() * 151) + 1;
  const response = await fetch(`${URL}/pokemon/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch random pokemon: ${response.status}`);
  }

  const data: Pick<PokemonDetailsApiResponse, "name" | "id"> =
    await response.json();

  return {
    name: data.name,
    pokemonId: data.id,
    imageURL: getPokemonListImageURL(data.id),
  };
}

export async function getPokemonDetails(
  name: string,
): Promise<PokemonDetailsResponse> {
  const response = await fetch(`${URL}/pokemon/${name}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch pokemon details: ${response.status}`);
  }
  const data: PokemonDetailsApiResponse = await response.json();
  return {
    ...data,
    imageURL: getPokemonDetailImageURL(data.id),
  };
}

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
  const results = await Promise.all(
    data.results.map((pokemon) => enrichPokemonListItem(pokemon)),
  );

  return {
    ...data,
    results,
  };
}

async function enrichPokemonListItem(
  pokemon: pokemonListApiResponse["results"][number],
): Promise<pokemonListResponse["results"][number]> {
  const response = await fetch(pokemon.url);

  if (!response.ok) {
    const id = getPokemonIdFromUrl(pokemon.url);

    return {
      ...pokemon,
      id,
      imageURL: getPokemonListImageURL(id),
      primaryType: "normal",
    };
  }

  const data: Pick<PokemonDetailsApiResponse, "id" | "types"> =
    await response.json();
  const primaryType =
    data.types.find((type) => type.slot === 1)?.type.name ??
    data.types[0]?.type.name ??
    "normal";

  return {
    ...pokemon,
    id: data.id,
    imageURL: getPokemonListImageURL(data.id),
    primaryType,
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
