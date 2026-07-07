const POKEMON_TYPE_COLORS: Record<string, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

const LIGHT_TYPE_BACKGROUNDS = new Set([
  "electric",
  "grass",
  "ice",
  "normal",
  "fairy",
  "ground",
  "bug",
  "steel",
]);

export function getPokemonTypeColor(typeName: string) {
  return POKEMON_TYPE_COLORS[typeName] ?? POKEMON_TYPE_COLORS.normal;
}

export function getPokemonTypeTextColor(typeName: string) {
  return LIGHT_TYPE_BACKGROUNDS.has(typeName) ? "#1f2937" : "#ffffff";
}
