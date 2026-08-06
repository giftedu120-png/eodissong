import type { Coordinates, Facility, Mission, Place, TravelProvider, VisionResult } from "./types";

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
  {
    id: "gyeongbokgung", name: { ko: "경복궁", en: "Gyeongbokgung Palace" }, category: "궁궐 · 역사",
    description: { ko: "조선 왕조의 중심 궁궐로, 넓은 전각과 북악산 풍경을 함께 만날 수 있습니다.", en: "The principal palace of the Joseon dynasty, set against the slopes of Bugaksan Mountain." },
    address: "서울특별시 종로구 사직로 161", imageUrl: commons("Gyeongbokgung Palace.jpg"), coordinates: { lat: 37.5796, lng: 126.9770 }, distance: "-",
  },
  {
    id: "namsan", name: { ko: "남산서울타워", en: "N Seoul Tower" }, category: "전망 · 산책",
    description: { ko: "남산 정상에서 서울 도심을 한눈에 바라볼 수 있는 대표 전망 명소입니다.", en: "A landmark observatory on Namsan with sweeping views across central Seoul." },
    address: "서울특별시 용산구 남산공원길 105", imageUrl: commons("N Seoul Tower at night.jpg"), coordinates: { lat: 37.5512, lng: 126.9882 }, distance: "-",
  },
  {
    id: "seonyudo", name: { ko: "선유도공원", en: "Seonyudo Park" }, category: "공원 · 생태",
    description: { ko: "옛 정수장을 재생한 한강의 생태공원으로, 물과 식물 사이를 산책하기 좋습니다.", en: "A riverside ecological park transformed from a former water treatment facility." },
    address: "서울특별시 영등포구 선유로 343", imageUrl: commons("Seonyudo Park.jpg"), coordinates: { lat: 37.5434, lng: 126.9001 }, distance: "-",
  },
];

const normalize = (value: string) => value.trim().toLocaleLowerCase();

export function distanceKm(a: Coordinates, b: Coordinates) {
  const radius = 6371;
  const radians = (value: number) => value * Math.PI / 180;
  const dLat = radians(b.lat - a.lat);
  const dLng = radians(b.lng - a.lng);
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

const routeFacilities = (origin: Coordinates, destination: Coordinates): Facility[] => {
  const midpoint = { lat: (origin.lat + destination.lat) / 2, lng: (origin.lng + destination.lng) / 2 };
  return [
    { id: "toilet-1", name: "공공 화장실", kind: "toilet", coordinates: { lat: midpoint.lat + 0.0012, lng: midpoint.lng - 0.0008 }, detourKm: 0.12 },
    { id: "store-1", name: "24시 편의점", kind: "convenience", coordinates: { lat: midpoint.lat - 0.001, lng: midpoint.lng + 0.0015 }, detourKm: 0.18 },
    { id: "cafe-1", name: "여행자 카페", kind: "cafe", coordinates: { lat: midpoint.lat + 0.0004, lng: midpoint.lng + 0.0022 }, detourKm: 0.25 },
  ];
};

export const mockTravelProvider: TravelProvider = {
  searchPlaces(query) {
    const needle = normalize(query);
    return places.filter((place) => `${place.name.ko} ${place.name.en} ${place.category}`.toLocaleLowerCase().includes(needle));
  },
  searchByRegion(region) {
    const needle = normalize(region);
    return /부산|busan|해운대|광안|감천/.test(needle) ? places : [];
  },
  getNearby(latitude, longitude) {
    const origin = { lat: latitude, lng: longitude };
    return places.map((place) => ({ ...place, distance: `${distanceKm(origin, place.coordinates).toFixed(1)}km` }))
      .sort((a, b) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance));
  },
  getPlace(id) { return places.find((place) => place.id === id); },
  featured() { return places; },
  geocode(query) {
    const needle = normalize(query);
    const matched = places.find((place) => `${place.name.ko} ${place.name.en} ${place.address}`.toLocaleLowerCase().includes(needle));
    if (matched) return { ...matched.coordinates, label: matched.name.ko, source: "manual" };
    if (/부산|busan/.test(needle)) return { lat: 35.1796, lng: 129.0756, label: "부산", source: "manual" };
    if (/서울|seoul/.test(needle)) return { lat: 37.5665, lng: 126.9780, label: "서울", source: "manual" };
    return undefined;
  },
  async analyzeImage(): Promise<VisionResult> {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return { place: places[1], confidence: 0.87, candidates: [places[1], places[0]] };
  },
  getEmbedUrl(place) {
    const { lat, lng } = place.coordinates;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.012}%2C${lat - 0.008}%2C${lng + 0.012}%2C${lat + 0.008}&layer=mapnik&marker=${lat}%2C${lng}`;
  },
  getDirectionsUrl(place) { return `https://www.openstreetmap.org/directions?to=${place.coordinates.lat}%2C${place.coordinates.lng}`; },
  getRoute(origin, destination) {
    const straightDistance = distanceKm(origin, destination.coordinates);
    const distance = Math.max(0.2, straightDistance * 1.18);
    const midpoint = { lat: (origin.lat + destination.coordinates.lat) / 2 + 0.0015, lng: (origin.lng + destination.coordinates.lng) / 2 - 0.001 };
    return {
      origin, destination, distanceKm: distance, durationMinutes: Math.max(4, Math.round(distance / 22 * 60)),
      path: [origin, midpoint, destination.coordinates],
      steps: [`${origin.label}에서 출발`, `${distance.toFixed(1)}km 동안 추천 경로로 이동`, `${destination.name.ko} 도착`],
      facilities: routeFacilities(origin, destination.coordinates),
    };
  },
  getMissions(origin) {
    const seeds: Record<string, { title: string; description: string; points: number }> = {
      gwangalli: { title: "광안대교 프레임 찾기", description: "해변에서 광안대교가 가장 멋지게 들어오는 구도를 찾아 사진으로 남겨보세요.", points: 120 },
      gamcheon: { title: "골목 색깔 수집", description: "감천의 골목에서 서로 다른 세 가지 색이 한 화면에 담긴 장면을 찾아보세요.", points: 150 },
      haeundae: { title: "파도선 기록", description: "해변을 걸으며 오늘의 파도가 만든 선을 사진으로 기록해보세요.", points: 100 },
      gyeongbokgung: { title: "궁궐의 대칭 발견", description: "전각과 마당이 만드는 대칭 구도를 찾아 사진에 담아보세요.", points: 140 },
      namsan: { title: "서울의 방향 찾기", description: "전망대 주변에서 가장 마음에 드는 서울의 방향을 골라 기록해보세요.", points: 130 },
      seonyudo: { title: "도시 속 초록 채집", description: "공원에서 옛 산업 시설과 식물이 함께 보이는 장면을 찾아보세요.", points: 110 },
    };
    return places.map((place): Mission => ({ id: `mission-${place.id}`, place, ...seeds[place.id], distanceKm: distanceKm(origin, place.coordinates) }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  },
};
