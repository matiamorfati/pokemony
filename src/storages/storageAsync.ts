import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVOURITE_POKEMON_KEY = "favouritePokemonName";

export async function getFavouritePokemonName() {
  return AsyncStorage.getItem(FAVOURITE_POKEMON_KEY);
}

export async function setFavouritePokemonName(name: string) {
  return AsyncStorage.setItem(FAVOURITE_POKEMON_KEY, name);
}

export async function removeFavouritePokemonName() {
  return AsyncStorage.removeItem(FAVOURITE_POKEMON_KEY);
}
