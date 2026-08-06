export type Locale = "ko" | "en";

export interface Place {
  id: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  address: string;
  category: string;
  imageUrl: string;
  coordinates: { lat: number; lng: number };
  distance: string;
}

export interface VisionResult { place: Place; confidence: number; candidates: Place[] }

export interface PlaceProvider {
  searchPlaces(query: string): Place[];
  searchByRegion(region: string): Place[];
  getNearby(latitude: number, longitude: number): Place[];
  getPlace(id: string): Place | undefined;
  featured(): Place[];
}

export interface VisionProvider { analyzeImage(fileName: string): Promise<VisionResult> }

export interface MapProvider { getEmbedUrl(place: Place): string; getDirectionsUrl(place: Place): string }

export type TravelProvider = PlaceProvider & VisionProvider & MapProvider;
