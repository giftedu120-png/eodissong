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
    id: "taejongdae", name: { ko: "태종대유원지", en: "Taejongdae Resort Park" }, category: "해안 · 자연",
    description: { ko: "영도 끝자락의 기암절벽과 탁 트인 대한해협을 만나는 부산 대표 해안 공원입니다.", en: "A dramatic coastal park at the edge of Yeongdo, known for cliffs and open sea views." },
    address: "부산광역시 영도구 전망로 24", imageUrl: commons("Taejongdae Park.jpg"), coordinates: { lat: 35.05851, lng: 129.087686 }, distance: "-",
  },
  {
    id: "songdo", name: { ko: "송도해수욕장", en: "Songdo Beach" }, category: "해변 · 케이블카",
    description: { ko: "도심 가까이에서 바다 산책과 해상 케이블카 풍경을 함께 즐길 수 있는 해변입니다.", en: "An urban beach where coastal walks meet views of the marine cable car." },
    address: "부산광역시 서구 송도해변로 100", imageUrl: commons("Songdo Beach Busan.jpg"), coordinates: { lat: 35.075513, lng: 129.017308 }, distance: "-",
  },
  {
    id: "oryukdo", name: { ko: "오륙도 스카이워크", en: "Oryukdo Skywalk" }, category: "전망 · 해안",
    description: { ko: "투명 바닥 아래로 파도가 펼쳐지고 오륙도와 해안선을 조망하는 전망 명소입니다.", en: "A glass-floor lookout with sweeping views of Oryukdo and the rocky coastline." },
    address: "부산광역시 남구 오륙도로 137", imageUrl: commons("Oryukdo Skywalk.jpg"), coordinates: { lat: 35.100572, lng: 129.124731 }, distance: "-",
  },
  {
    id: "jagalchi", name: { ko: "자갈치시장", en: "Jagalchi Market" }, category: "시장 · 미식",
    description: { ko: "부산의 활기찬 항구 풍경과 다양한 해산물을 한자리에서 만나는 대표 전통시장입니다.", en: "Busan's landmark seafood market, filled with harbor energy and local flavors." },
    address: "부산광역시 중구 자갈치해안로 52", imageUrl: commons("Jagalchi Market.jpg"), coordinates: { lat: 35.095744, lng: 129.025123 }, distance: "-",
  },
  {
    id: "yongdusan", name: { ko: "용두산공원", en: "Yongdusan Park" }, category: "공원 · 전망",
    description: { ko: "부산타워와 함께 원도심과 항구 풍경을 내려다보는 도심 속 역사 공원입니다.", en: "A historic downtown park beneath Busan Tower with views over the old city and port." },
    address: "부산광역시 중구 용두산길 37-55", imageUrl: commons("Yongdusan Park.jpg"), coordinates: { lat: 35.100433, lng: 129.032606 }, distance: "-",
  },
  {
    id: "dadaepo", name: { ko: "다대포해수욕장", en: "Dadaepo Beach" }, category: "해변 · 일몰",
    description: { ko: "넓은 모래사장과 갯벌, 붉게 물드는 낙조로 사랑받는 부산 서쪽의 해변입니다.", en: "A broad western beach celebrated for tidal flats and glowing sunset views." },
    address: "부산광역시 사하구 다대동", imageUrl: commons("Dadaepo Beach.jpg"), coordinates: { lat: 35.048195, lng: 128.966019 }, distance: "-",
  },
  {
    id: "huinnyeoul", name: { ko: "흰여울문화마을", en: "Huinnyeoul Culture Village" }, category: "마을 · 산책",
    description: { ko: "절영해안산책로 위 하얀 골목과 바다 전망이 이어지는 영도의 문화마을입니다.", en: "A whitewashed hillside village on Yeongdo with alleys overlooking the sea." },
    address: "부산광역시 영도구 영선동4가 605-3", imageUrl: commons("Huinnyeoul Culture Village.jpg"), coordinates: { lat: 35.077396, lng: 129.045651 }, distance: "-",
  },
  {
    id: "dongbaek", name: { ko: "동백섬", en: "Dongbaekseom Island" }, category: "숲길 · 해안",
    description: { ko: "해운대와 누리마루를 잇는 숲길을 걸으며 바다와 광안대교를 조망할 수 있습니다.", en: "A wooded coastal walk linking Haeundae and Nurimaru with bridge and sea views." },
    address: "부산광역시 해운대구 우동 710-1", imageUrl: commons("Dongbaekseom.jpg"), coordinates: { lat: 35.154064, lng: 129.152086 }, distance: "-",
  },
  {
    id: "busan-citizens-park", name: { ko: "부산시민공원", en: "Busan Citizens Park" }, category: "공원 · 휴식",
    description: { ko: "도심 한가운데 넓은 잔디와 산책로, 문화 공간이 어우러진 시민 휴식처입니다.", en: "A spacious urban park with lawns, walking paths, and cultural spaces." },
    address: "부산광역시 부산진구 시민공원로 73", imageUrl: commons("Busan Citizens Park.jpg"), coordinates: { lat: 35.16892, lng: 129.057338 }, distance: "-",
  },
  {
    id: "f1963", name: { ko: "F1963", en: "F1963" }, category: "문화 · 재생건축",
    description: { ko: "옛 와이어 공장을 전시, 서점, 정원과 카페가 있는 복합문화공간으로 재생한 장소입니다.", en: "A former wire factory reborn as a cultural complex of exhibitions, books, gardens, and coffee." },
    address: "부산광역시 수영구 구락로123번길 20", imageUrl: commons("F1963 Busan.jpg"), coordinates: { lat: 35.177106, lng: 129.114927 }, distance: "-",
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

const busanCafeSeeds: Facility[] = [
  { id: "cafe-momos-yeongdo", name: "모모스커피 영도", kind: "cafe", coordinates: { lat: 35.09467, lng: 129.0462 }, detourKm: 0, address: "부산광역시 영도구 봉래나루로 160" },
  { id: "cafe-momos-oncheon", name: "모모스커피 본점", kind: "cafe", coordinates: { lat: 35.22055, lng: 129.08636 }, detourKm: 0, address: "부산광역시 금정구 오시게로 20" },
  { id: "cafe-p-ark", name: "피아크 카페&베이커리", kind: "cafe", coordinates: { lat: 35.086429, lng: 129.076731 }, detourKm: 0, address: "부산광역시 영도구 해양로195번길 180" },
  { id: "cafe-terarosa-f1963", name: "테라로사 커피 F1963", kind: "cafe", coordinates: { lat: 35.17712, lng: 129.1149 }, detourKm: 0, address: "부산광역시 수영구 구락로123번길 20" },
  { id: "cafe-haevichi-f1963", name: "카페 바이 해비치", kind: "cafe", coordinates: { lat: 35.1773, lng: 129.11465 }, detourKm: 0, address: "부산광역시 수영구 구락로123번길 20" },
];

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
  getNearbyFacilities(coordinates, limit = 3) {
    return busanCafeSeeds.map((facility) => ({ ...facility, distanceKm: distanceKm(coordinates, facility.coordinates) }))
      .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0)).slice(0, limit);
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
      taejongdae: { title: "절벽과 수평선 한 컷", description: "전망대에서 절벽과 수평선이 함께 담기는 장면을 찾아보세요.", points: 150 },
      songdo: { title: "바다 위 케이블카 포착", description: "송도 바다 위를 지나는 케이블카를 사진에 담아보세요.", points: 120 },
      oryukdo: { title: "유리 아래 파도 기록", description: "스카이워크 주변에서 바위와 파도가 만드는 무늬를 기록해보세요.", points: 150 },
      jagalchi: { title: "부산 시장의 색 찾기", description: "시장에서 부산의 활기를 보여주는 세 가지 색을 한 장에 담아보세요.", points: 130 },
      yongdusan: { title: "부산타워와 원도심", description: "공원에서 부산타워와 원도심이 함께 보이는 구도를 찾아보세요.", points: 120 },
      dadaepo: { title: "낙조의 색 기록", description: "다대포 하늘과 물에 번지는 오늘의 빛을 사진으로 남겨보세요.", points: 140 },
      huinnyeoul: { title: "하얀 골목 끝 바다", description: "흰 골목 사이로 바다가 보이는 나만의 프레임을 찾아보세요.", points: 140 },
      dongbaek: { title: "숲과 바다의 경계", description: "동백섬 산책로에서 숲과 바다가 맞닿는 장면을 포착해보세요.", points: 110 },
      "busan-citizens-park": { title: "도심 속 쉼표", description: "공원에서 가장 편안해 보이는 풍경을 찾아 사진으로 남겨보세요.", points: 100 },
      f1963: { title: "공장의 흔적 찾기", description: "문화공간 속에 남아 있는 옛 와이어 공장의 흔적을 찾아보세요.", points: 130 },
    };
    const ranked = places.map((place): Mission => ({ id: `mission-${place.id}`, place, ...seeds[place.id], distanceKm: distanceKm(origin, place.coordinates) }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
    const localMissions = ranked.filter((mission) => mission.distanceKm <= 80);
    return (localMissions.length >= 3 ? localMissions : ranked).slice(0, 12);
  },
};
