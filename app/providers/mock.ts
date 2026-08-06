import type { Place, TravelProvider, VisionResult } from "./types";

const commons = (name: string) => `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(name)}?width=1200`;

export const places: Place[] = [
  {
    id: "gwangalli", name: { ko: "광안리해수욕장", en: "Gwangalli Beach" }, category: "해변 · 야경",
    description: { ko: "광안대교를 정면으로 바라보는 부산의 대표 해변입니다. 산책로와 카페가 이어져 낮과 밤 모두 가볍게 둘러보기 좋아요.", en: "A beloved Busan beach facing Gwangan Bridge, with an easy promenade and cafés that shine from day to night." },
    address: "부산광역시 수영구 광안해변로 219", imageUrl: commons("Gwangalli Beach.jpg"), coordinates: { lat: 35.1532, lng: 129.1186 }, distance: "1.2km",
  },
  {
    id: "gamcheon", name: { ko: "감천문화마을", en: "Gamcheon Culture Village" }, category: "마을 · 예술",
    description: { ko: "산복도로를 따라 알록달록한 집과 골목 예술이 이어지는 마을입니다. 천천히 걸으며 전망과 작은 공방을 함께 만나보세요.", en: "A hillside village of colorful homes, winding alleys, art spots, and wide views over Busan." },
    address: "부산광역시 사하구 감내2로 203", imageUrl: commons("Gamcheon Culture Village.jpg"), coordinates: { lat: 35.0975, lng: 129.0092 }, distance: "4.8km",
  },
  {
    id: "haeundae", name: { ko: "해운대해수욕장", en: "Haeundae Beach" }, category: "해변 · 산책",
    description: { ko: "넓은 백사장과 도심 풍경이 함께 펼쳐지는 부산의 대표 해변입니다. 동백섬과 해리단길을 함께 둘러보기 좋아요.", en: "Busan's iconic urban beach, pairing a broad sandy shore with nearby Dongbaek Island and local streets." },
    address: "부산광역시 해운대구 해운대해변로 264", imageUrl: commons("Haeundae Beach.jpg"), coordinates: { lat: 35.1587, lng: 129.1604 }, distance: "5.6km",
  },
];

const normalize = (value: string) => value.trim().toLocaleLowerCase();

export const mockTravelProvider: TravelProvider = {
  searchPlaces(query) {
    const needle = normalize(query);
    return places.filter((place) => `${place.name.ko} ${place.name.en} ${place.category}`.toLocaleLowerCase().includes(needle));
  },
  searchByRegion(region) {
    const needle = normalize(region);
    return /부산|busan|해운대|광안|감천/.test(needle) ? places : [];
  },
  getNearby() { return [...places].sort((a, b) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance)); },
  getPlace(id) { return places.find((place) => place.id === id); },
  featured() { return places; },
  async analyzeImage(): Promise<VisionResult> {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return { place: places[1], confidence: 0.87, candidates: [places[1], places[0]] };
  },
  getEmbedUrl(place) {
    const { lat, lng } = place.coordinates;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.012}%2C${lat - 0.008}%2C${lng + 0.012}%2C${lat + 0.008}&layer=mapnik&marker=${lat}%2C${lng}`;
  },
  getDirectionsUrl(place) { return `https://www.openstreetmap.org/directions?to=${place.coordinates.lat}%2C${place.coordinates.lng}`; },
};
