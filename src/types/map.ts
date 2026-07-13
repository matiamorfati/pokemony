export type MapMarker = {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  pokemonId: number;
  imageURL: string;
  opened: boolean;
};
export type PokemonMapMarkerProps = {
  marker: MapMarker;
  opened: boolean;
  onPressOpen: () => void;
  onPressShow: () => void;
};
