export interface AutocompleteResponse {
  summary: Summary;
  results: Result[];
}

export interface Summary {
  query: string;
  queryType: string;
  queryTime: number;
  numResults: number;
  offset: number;
  totalResults: number;
  fuzzyLevel: number;
  queryIntent: never[];
}

export interface Result {
  type: string;
  id: string;
  score: number;
  entityType?: string;
  address: Address;
  position: Position;
  viewport: Viewport;
  boundingBox?: BoundingBox;
  dataSources?: DataSources;
  info?: string;
  poi?: Poi;
  entryPoints?: EntryPoint[];
}

export interface Address {
  municipalitySubdivision: string;
  municipality: string;
  countrySecondarySubdivision: string;
  countrySubdivision: string;
  countryCode: string;
  country: string;
  countryCodeISO3: string;
  freeformAddress: string;
  streetNumber?: string;
  streetName?: string;
  postalCode?: string;
  localName?: string;
}

export interface Position {
  lat: number;
  lon: number;
}

export interface Viewport {
  topLeftPoint: TopLeftPoint;
  btmRightPoint: BtmRightPoint;
}

export interface TopLeftPoint {
  lat: number;
  lon: number;
}

export interface BtmRightPoint {
  lat: number;
  lon: number;
}

export interface BoundingBox {
  topLeftPoint: TopLeftPoint2;
  btmRightPoint: BtmRightPoint2;
}

export interface TopLeftPoint2 {
  lat: number;
  lon: number;
}

export interface BtmRightPoint2 {
  lat: number;
  lon: number;
}

export interface DataSources {
  geometry: Geometry;
}

export interface Geometry {
  id: string;
}

export interface Poi {
  name: string;
  categorySet: CategorySet[];
  categories: string[];
  classifications: Classification[];
}

export interface CategorySet {
  id: number;
}

export interface Classification {
  code: string;
  names: Name[];
}

export interface Name {
  nameLocale: string;
  name: string;
}

export interface EntryPoint {
  type: string;
  position: Position2;
}

export interface Position2 {
  lat: number;
  lon: number;
}
