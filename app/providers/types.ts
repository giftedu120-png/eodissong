export type Locale = "ko" | "en";

export interface Coordinates { lat: number; lng: number }

export interface UserLocation extends Coordinates {
  accuracy?: number;
  label: string;
  source: "geolocation" | "manual";
}

export interface Place {
  id: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  address: string;
  category: string;
  imageUrl: string;
  coordinates: Coordinates;
  distance: string;
}

export type FacilityKind = "toilet" | "convenience" | "cafe";

export interface Facility {
  id: string;
  name: string;
  kind: FacilityKind;
  coordinates: Coordinates;
  detourKm: number;
  distanceKm?: number;
  address?: string;
}

export interface RouteResult {
  origin: UserLocation;
  destination: Place;
  distanceKm: number;
  durationMinutes: number;
  path: Coordinates[];
  steps: string[];
  facilities: Facility[];
}

export interface Mission {
  id: string;
  place: Place;
  title: string;
  description: string;
  points: number;
  distanceKm: number;
}

export interface VisionResult { place: Place; confidence: number; candidates: Place[] }

export interface PlaceProvider {
  searchPlaces(query: string): Place[];
  searchByRegion(region: string): Place[];
  getNearby(latitude: number, longitude: number): Place[];
  getPlace(id: string): Place | undefined;
  featured(): Place[];
  geocode(query: string): UserLocation | undefined;
  getNearbyFacilities(coordinates: Coordinates, limit?: number): Facility[];
}

export interface VisionProvider { analyzeImage(fileName: string): Promise<VisionResult> }

export interface MapProvider { getEmbedUrl(place: Place): string; getDirectionsUrl(place: Place): string }

export interface RoutingProvider { getRoute(origin: UserLocation, destination: Place): RouteResult }

export interface MissionProvider { getMissions(origin: UserLocation): Mission[] }

export type TravelProvider = PlaceProvider & VisionProvider & MapProvider & RoutingProvider & MissionProvider;
