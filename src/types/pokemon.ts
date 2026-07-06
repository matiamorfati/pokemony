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
};

export type pokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: pokemonListItem[];
};
