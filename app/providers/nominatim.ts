import type { GeocodingProvider, GeocodingResult } from "./types";

interface NominatimItem {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  addresstype?: string;
  type?: string;
}

const cache = new Map<string, GeocodingResult[]>();
const broadLocation = /^(부산|부산광역시|busan)$/i;
const broadTypes = new Set(["state", "province", "city"]);

export const isBroadLocationQuery = (query: string) => broadLocation.test(query.trim().replace(/\s+/g, ""));

export const nominatimGeocodingProvider: GeocodingProvider = {
  async search(query, signal) {
    const normalized = query.trim();
    if (!normalized || isBroadLocationQuery(normalized)) return [];
    const cached = cache.get(normalized);
    if (cached) return cached;
    const params = new URLSearchParams({
      q: normalized,
      format: "jsonv2",
      addressdetails: "1",
      limit: "5",
      countrycodes: "kr",
      viewbox: "128.75,35.35,129.35,34.85",
      bounded: "1",
      "accept-language": "ko",
    });
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      signal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error("상세 주소 검색 서비스를 사용할 수 없습니다.");
    const data = await response.json() as NominatimItem[];
    const results = data.filter((item) => !broadTypes.has(item.addresstype ?? "")).map((item) => ({
      id: String(item.place_id),
      label: item.display_name,
      coordinates: { lat: Number(item.lat), lng: Number(item.lon) },
      kind: item.addresstype ?? item.type ?? "장소",
    })).filter((item) => Number.isFinite(item.coordinates.lat) && Number.isFinite(item.coordinates.lng));
    cache.set(normalized, results);
    return results;
  },
};
