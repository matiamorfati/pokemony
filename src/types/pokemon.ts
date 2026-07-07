export type pokemonListApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: pokemonListApiItem[];
};

export type pokemonListApiItem = {
  name: string;
  url: string;
};

export type pokemonListItem = {
  name: string;
  url: string;
  id: number;
  imageURL: string;
  primaryType: string;
};

export type pokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: pokemonListItem[];
};

export type PokemonDetailsApiResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    other: {
      "official-artwork": {
        front_default: string | null;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
};

export type PokemonDetailsResponse = PokemonDetailsApiResponse & {
  imageURL: string | null;
};
