export type pokemonListItem = {
    name: string;
    url: string;
}

export type pokemonListResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: pokemonListItem[];
}