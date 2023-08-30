export type AutocompleteResponse = {
  address: string
  placeId: string
}

export type PlaceResponse = {
  long: number;
  lat: number;
  address: {
    address_line_1: string;
    address_line_2: string;
    landmark: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  formattedAddress: string;
};