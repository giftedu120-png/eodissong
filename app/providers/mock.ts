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
    id: "haedong-yonggungsa", name: { ko: "해동용궁사", en: "Haedong Yonggungsa Temple" }, category: "사찰 · 해안",
    description: { ko: "바위 해안에 자리한 사찰로 전통 건축과 탁 트인 바다 풍경을 함께 만날 수 있습니다.", en: "A coastal temple where traditional architecture meets wide-open sea views." },
    address: "부산광역시 기장군 기장읍 용궁길 86", imageUrl: commons("Haedong Yonggungsa Temple near Busan.jpg"), coordinates: { lat: 35.188434, lng: 129.222976 }, distance: "-",
  },
  {
    id: "busan-x-the-sky", name: { ko: "부산 엑스 더 스카이", en: "BUSAN X the SKY" }, category: "전망대 · 도심",
    description: { ko: "해운대 엘시티 랜드마크타워에서 해변과 도심 스카이라인을 내려다보는 고층 전망대입니다.", en: "A high-rise observatory overlooking Haeundae Beach and the city skyline." },
    address: "부산광역시 해운대구 달맞이길 30", imageUrl: commons("Haeundae Beach and Haeundae LCT The Sharp.jpg"), coordinates: { lat: 35.159832, lng: 129.169737 }, distance: "-",
  },
  {
    id: "cheongsapo", name: { ko: "청사포 다릿돌전망대", en: "Cheongsapo Daritdol Observatory" }, category: "전망 · 해안",
    description: { ko: "바다 위로 길게 뻗은 전망대에서 청사포 해안과 다릿돌 바위섬을 가까이 조망할 수 있습니다.", en: "A sea walkway offering close views of Cheongsapo coast and rocky islets." },
    address: "부산광역시 해운대구 청사포로 167", imageUrl: commons("Cheongsapo.jpg"), coordinates: { lat: 35.164202, lng: 129.196176 }, distance: "-",
  },
  {
    id: "blueline-park", name: { ko: "해운대 블루라인파크", en: "Haeundae Blue Line Park" }, category: "열차 · 해안",
    description: { ko: "미포와 청사포, 송정을 잇는 옛 철길에서 해변열차와 스카이캡슐로 동부산 해안을 감상할 수 있습니다.", en: "Beach trains and sky capsules follow a former rail line along East Busan coast." },
    address: "부산광역시 해운대구 달맞이길62번길 13", imageUrl: commons("Sky Capsule train at Haeundae Blueline Park, Busan.jpg"), coordinates: { lat: 35.158211, lng: 129.172851 }, distance: "-",
  },
  {
    id: "cinema-center", name: { ko: "영화의전당", en: "Busan Cinema Center" }, category: "문화 · 건축",
    description: { ko: "대형 지붕과 야간 경관 조명이 인상적인 공연·영화 문화공간이자 부산국제영화제의 주요 무대입니다.", en: "A cinema and performance landmark known for its vast roof and night lighting." },
    address: "부산광역시 해운대구 수영강변대로 120", imageUrl: commons("Busan Cinema Center at BIFF 2020 - 09.jpg"), coordinates: { lat: 35.170287, lng: 129.127818 }, distance: "-",
  },
  {
    id: "maritime-museum", name: { ko: "국립해양박물관", en: "National Maritime Museum of Korea" }, category: "박물관 · 해양",
    description: { ko: "선박과 항해, 해양 생태 등 바다와 관련된 다양한 전시를 만나는 종합 해양박물관입니다.", en: "A maritime museum covering ships, navigation, and marine ecology." },
    address: "부산광역시 영도구 해양로301번길 45", imageUrl: commons("Aquarium exhibit at the National Maritime Museum of Korea, Busan.jpg"), coordinates: { lat: 35.078653, lng: 129.080258 }, distance: "-",
  },
  {
    id: "igidae", name: { ko: "이기대 수변공원", en: "Igidae Coastal Park" }, category: "해안 · 산책",
    description: { ko: "바위 해안과 숲길을 따라 걸으며 광안대교와 해운대 방향의 풍경을 조망하는 해안 산책 명소입니다.", en: "A rocky coastal trail with forest paths and views toward Gwangan Bridge and Haeundae." },
    address: "부산광역시 남구 용호동 산122", imageUrl: commons("Igidae Trail in Busan.jpg"), coordinates: { lat: 35.118694, lng: 129.126889 }, distance: "-",
  },
  {
    id: "hwangnyeongsan", name: { ko: "황령산 봉수대", en: "Hwangnyeongsan Beacon Mound" }, category: "산 · 야경",
    description: { ko: "산 정상 부근에서 부산 도심과 광안대교 방향을 넓게 내려다볼 수 있는 전망 명소입니다.", en: "A mountain viewpoint overlooking central Busan and Gwangan Bridge." },
    address: "부산광역시 부산진구 전포동 산50-18", imageUrl: commons("Landscape of Busan from Hwangryeongsan.jpg"), coordinates: { lat: 35.157215, lng: 129.081941 }, distance: "-",
  },
  {
    id: "busan-museum", name: { ko: "부산박물관", en: "Busan Museum" }, category: "박물관 · 역사",
    description: { ko: "선사시대부터 근현대까지 이어지는 부산의 역사와 문화유산을 살펴볼 수 있는 시립 박물관입니다.", en: "A city museum tracing Busan history from prehistory to modern times." },
    address: "부산광역시 남구 유엔평화로 63", imageUrl: commons("Busan museum.JPG"), coordinates: { lat: 35.129362, lng: 129.094203 }, distance: "-",
  },
  {
    id: "un-memorial", name: { ko: "유엔기념공원", en: "United Nations Memorial Cemetery" }, category: "역사 · 추모",
    description: { ko: "한국전쟁에 참전한 유엔군 전몰장병을 기리는 묘역과 추모 공간이 조성된 평화의 장소입니다.", en: "A peaceful memorial honoring UN service members who died in the Korean War." },
    address: "부산광역시 남구 유엔평화로 93", imageUrl: commons("United Nations Memorial Cemetery 03.jpg"), coordinates: { lat: 35.127682, lng: 129.097664 }, distance: "-",
  },
  {
    id: "gukje-market", name: { ko: "국제시장", en: "Gukje Market" }, category: "시장 · 쇼핑",
    description: { ko: "부산 원도심의 역사와 생활 문화를 품은 전통시장으로 다양한 상점과 먹거리가 골목마다 이어집니다.", en: "A historic downtown market packed with shops and food alleys." },
    address: "부산광역시 중구 신창동4가", imageUrl: commons("Gukje Market Busan South Korea 01.jpg"), coordinates: { lat: 35.101164, lng: 129.028193 }, distance: "-",
  },
  {
    id: "biff-square", name: { ko: "BIFF 광장", en: "BIFF Square" }, category: "거리 · 영화",
    description: { ko: "영화인의 손도장과 극장가의 흔적, 길거리 먹거리를 함께 만나는 남포동의 영화 문화 거리입니다.", en: "A Nampo cinema street with handprints, theaters, and street food." },
    address: "부산광역시 중구 BIFF광장로 20", imageUrl: commons("BIFF Square in 2018.jpg"), coordinates: { lat: 35.098899, lng: 129.029055 }, distance: "-",
  },
  {
    id: "bosu-book-street", name: { ko: "보수동 책방골목", en: "Bosu-dong Book Street" }, category: "골목 · 서점",
    description: { ko: "새 책과 헌책을 다루는 서점들이 좁은 골목을 따라 이어지는 부산 원도심의 책 문화 거리입니다.", en: "A narrow downtown alley lined with new and used bookshops." },
    address: "부산광역시 중구 대청로 67-1", imageUrl: commons("Bookstore alley in Bosudong.jpg"), coordinates: { lat: 35.103349, lng: 129.026911 }, distance: "-",
  },
  {
    id: "bupyeong-market", name: { ko: "부평깡통시장", en: "Bupyeong Kkangtong Market" }, category: "시장 · 미식",
    description: { ko: "낮에는 전통시장, 저녁에는 다양한 길거리 음식이 모이는 야시장으로 활기를 더하는 원도심 명소입니다.", en: "A traditional market by day and a lively street-food night market after dark." },
    address: "부산광역시 중구 부평1길 48", imageUrl: commons("Bupyeong Kkangtong Night Market.jpg"), coordinates: { lat: 35.101381, lng: 129.025739 }, distance: "-",
  },
  {
    id: "nakdong-eco-center", name: { ko: "낙동강하구에코센터", en: "Nakdong Estuary Eco-Center" }, category: "생태 · 철새",
    description: { ko: "낙동강과 바다가 만나는 을숙도 습지에서 철새와 하구 생태를 배우고 관찰하는 생태교육 공간입니다.", en: "An Eulsukdo nature center for learning about wetlands and migratory birds." },
    address: "부산광역시 사하구 낙동남로 1240", imageUrl: commons("부산 낙동강 하구(아리랑 2호) (577).jpeg"), coordinates: { lat: 35.1047, lng: 128.9472 }, distance: "-",
  },
  {
    id: "samnak-eco-park", name: { ko: "삼락생태공원", en: "Samnak Ecological Park" }, category: "생태 · 공원",
    description: { ko: "낙동강변을 따라 습지와 갈대밭, 산책로와 자전거길이 넓게 이어지는 서부산 생태공원입니다.", en: "A West Busan riverside park of wetlands, reeds, walks, and cycling paths." },
    address: "부산광역시 사상구 낙동대로 1231", imageUrl: commons("Busan International Rock Festival.jpg"), coordinates: { lat: 35.167515, lng: 128.97638 }, distance: "-",
  },
  {
    id: "beomeosa", name: { ko: "범어사", en: "Beomeosa Temple" }, category: "사찰 · 역사",
    description: { ko: "금정산 자락에 자리한 유서 깊은 사찰로 전통 전각과 숲길의 고요한 분위기를 느낄 수 있습니다.", en: "A historic temple on Geumjeongsan with traditional halls and quiet forest paths." },
    address: "부산광역시 금정구 범어사로 250", imageUrl: commons("Front exterior view of Beomeosa temple with three stairs and blue sky in Busan South Korea.jpg"), coordinates: { lat: 35.284084, lng: 129.068672 }, distance: "-",
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
  { id: "cafe-yuramseon", name: "유람선", kind: "cafe", coordinates: { lat: 35.1465973, lng: 129.1133335 }, detourKm: 0, address: "부산광역시 수영구 남천동" },
  { id: "cafe-angelinus-namcheon", name: "엔제리너스 남천비치점", kind: "cafe", coordinates: { lat: 35.1380805, lng: 129.1132268 }, detourKm: 0, address: "부산광역시 수영구 남천동" },
  { id: "cafe-starbucks-centum", name: "스타벅스 센텀점", kind: "cafe", coordinates: { lat: 35.1717074, lng: 129.1284077 }, detourKm: 0, address: "부산광역시 해운대구 센텀시티" },
  { id: "cafe-starbucks-marine-city", name: "스타벅스 신세계마린시티점", kind: "cafe", coordinates: { lat: 35.1568982, lng: 129.1433168 }, detourKm: 0, address: "부산광역시 해운대구 마린시티" },
  { id: "cafe-hollys-gwangalli", name: "할리스 광안해변점", kind: "cafe", coordinates: { lat: 35.1552364, lng: 129.1213852 }, detourKm: 0, address: "부산광역시 수영구 광안해변로" },
  { id: "cafe-starbucks-gwangalli", name: "스타벅스 광안리점", kind: "cafe", coordinates: { lat: 35.1550296, lng: 129.1208566 }, detourKm: 0, address: "부산광역시 수영구 광안해변로" },
  { id: "cafe-present", name: "프리젠트 카페", kind: "cafe", coordinates: { lat: 35.1484799, lng: 129.1076096 }, detourKm: 0, address: "부산광역시 수영구 남천동" },
  { id: "cafe-ediya-pukyong", name: "이디야커피 부산부경대후문점", kind: "cafe", coordinates: { lat: 35.1388547, lng: 129.1047906 }, detourKm: 0, address: "부산광역시 남구 대연동" },
  { id: "cafe-coffee-six-daeyeon", name: "커피식스 대연점", kind: "cafe", coordinates: { lat: 35.1379024, lng: 129.1028313 }, detourKm: 0, address: "부산광역시 남구 대연동" },
  { id: "cafe-lacuna-matata", name: "라쿠나마타타", kind: "cafe", coordinates: { lat: 35.1360691, lng: 129.1001035 }, detourKm: 0, address: "부산광역시 남구 대연동" },
  { id: "cafe-gamnae", name: "감내카페 1호점", kind: "cafe", coordinates: { lat: 35.09783, lng: 129.01015 }, detourKm: 0, address: "부산광역시 사하구 감내2로 177" },
  { id: "cafe-coffee-it-house", name: "커피잇집", kind: "cafe", coordinates: { lat: 35.09711, lng: 129.01072 }, detourKm: 0, address: "부산광역시 사하구 감내2로" },
  { id: "cafe-starbucks-haeundae", name: "스타벅스 해운대점", kind: "cafe", coordinates: { lat: 35.15918, lng: 129.16093 }, detourKm: 0, address: "부산광역시 해운대구 구남로" },
  { id: "cafe-hollys-haeundae", name: "할리스 부산해운대점", kind: "cafe", coordinates: { lat: 35.15942, lng: 129.16024 }, detourKm: 0, address: "부산광역시 해운대구 해운대해변로" },
  { id: "cafe-385", name: "카페 385", kind: "cafe", coordinates: { lat: 35.0917, lng: 129.0585 }, detourKm: 0, address: "부산광역시 영도구 태종로 539" },
  { id: "cafe-starbucks-songdo", name: "스타벅스 부산송도해수욕장점", kind: "cafe", coordinates: { lat: 35.07591, lng: 129.01714 }, detourKm: 0, address: "부산광역시 서구 송도해변로" },
  { id: "cafe-twosome-songdo", name: "투썸플레이스 부산송도점", kind: "cafe", coordinates: { lat: 35.07702, lng: 129.01782 }, detourKm: 0, address: "부산광역시 서구 송도해변로" },
  { id: "cafe-haepalang", name: "해파랑카페", kind: "cafe", coordinates: { lat: 35.10061, lng: 129.12479 }, detourKm: 0, address: "부산광역시 남구 오륙도로 137" },
  { id: "cafe-twosome-baekunpo", name: "투썸플레이스 부산백운포점", kind: "cafe", coordinates: { lat: 35.1083, lng: 129.1167 }, detourKm: 0, address: "부산광역시 남구 용호동" },
  { id: "cafe-starbucks-nampo", name: "스타벅스 남포동점", kind: "cafe", coordinates: { lat: 35.09865, lng: 129.03115 }, detourKm: 0, address: "부산광역시 중구 광복로" },
  { id: "cafe-compose-nampo", name: "컴포즈커피 남포점", kind: "cafe", coordinates: { lat: 35.09943, lng: 129.02994 }, detourKm: 0, address: "부산광역시 중구 남포동" },
  { id: "cafe-starbucks-dadaepo", name: "스타벅스 다대포비치점", kind: "cafe", coordinates: { lat: 35.04905, lng: 128.96562 }, detourKm: 0, address: "부산광역시 사하구 다대동" },
  { id: "cafe-twosome-dadaepo", name: "투썸플레이스 부산다대포점", kind: "cafe", coordinates: { lat: 35.05218, lng: 128.97008 }, detourKm: 0, address: "부산광역시 사하구 다대로" },
  { id: "cafe-ether", name: "에테르", kind: "cafe", coordinates: { lat: 35.07813, lng: 129.04485 }, detourKm: 0, address: "부산광역시 영도구 절영로" },
  { id: "cafe-shingi-yeoul", name: "신기여울", kind: "cafe", coordinates: { lat: 35.07854, lng: 129.04417 }, detourKm: 0, address: "부산광역시 영도구 절영로" },
  { id: "cafe-rangdest-haeundae", name: "랑데자뷰 해운대점", kind: "cafe", coordinates: { lat: 35.16134, lng: 129.17146 }, detourKm: 0, address: "부산광역시 해운대구 달맞이길" },
  { id: "cafe-starbucks-dalmaji", name: "스타벅스 해운대달맞이점", kind: "cafe", coordinates: { lat: 35.16188, lng: 129.17122 }, detourKm: 0, address: "부산광역시 해운대구 달맞이길" },
  { id: "cafe-rooftop-cheongsapo", name: "카페 루프탑 청사포", kind: "cafe", coordinates: { lat: 35.16184, lng: 129.19277 }, detourKm: 0, address: "부산광역시 해운대구 청사포로 139-4" },
  { id: "cafe-diart", name: "디아트커피", kind: "cafe", coordinates: { lat: 35.16174, lng: 129.19191 }, detourKm: 0, address: "부산광역시 해운대구 청사포로128번길 12" },
  { id: "cafe-starbucks-bujeon", name: "스타벅스 부전역점", kind: "cafe", coordinates: { lat: 35.16476, lng: 129.06045 }, detourKm: 0, address: "부산광역시 부산진구 부전동" },
  { id: "cafe-twosome-citizens-park", name: "투썸플레이스 부산시민공원점", kind: "cafe", coordinates: { lat: 35.16835, lng: 129.05538 }, detourKm: 0, address: "부산광역시 부산진구 시민공원로" },
  { id: "cafe-coralani", name: "코랄라니", kind: "cafe", coordinates: { lat: 35.18273, lng: 129.21282 }, detourKm: 0, address: "부산광역시 기장군 기장읍 기장해안로" },
  { id: "cafe-starbucks-osiria", name: "스타벅스 동부산DT점", kind: "cafe", coordinates: { lat: 35.19224, lng: 129.21171 }, detourKm: 0, address: "부산광역시 기장군 기장읍 기장해안로" },
  { id: "cafe-pascucci-centum", name: "파스쿠찌 센텀시티점", kind: "cafe", coordinates: { lat: 35.16964, lng: 129.12932 }, detourKm: 0, address: "부산광역시 해운대구 센텀남대로" },
  { id: "cafe-gureumgogae", name: "카페 구름고개", kind: "cafe", coordinates: { lat: 35.15741, lng: 129.08318 }, detourKm: 0, address: "부산광역시 부산진구 황령산로" },
  { id: "cafe-starbucks-kyungsung", name: "스타벅스 경성대점", kind: "cafe", coordinates: { lat: 35.13746, lng: 129.10092 }, detourKm: 0, address: "부산광역시 남구 수영로" },
  { id: "cafe-starbucks-hadan", name: "스타벅스 하단중앙점", kind: "cafe", coordinates: { lat: 35.10656, lng: 128.96654 }, detourKm: 0, address: "부산광역시 사하구 낙동대로" },
  { id: "cafe-twosome-hadan", name: "투썸플레이스 부산하단점", kind: "cafe", coordinates: { lat: 35.10615, lng: 128.96512 }, detourKm: 0, address: "부산광역시 사하구 하단동" },
  { id: "cafe-starbucks-sasang", name: "스타벅스 사상역점", kind: "cafe", coordinates: { lat: 35.16394, lng: 128.98348 }, detourKm: 0, address: "부산광역시 사상구 사상로211번길" },
  { id: "cafe-twosome-sasang", name: "투썸플레이스 부산사상점", kind: "cafe", coordinates: { lat: 35.16431, lng: 128.98305 }, detourKm: 0, address: "부산광역시 사상구 괘법동" },
  { id: "cafe-soop-beomeosa", name: "숲카페", kind: "cafe", coordinates: { lat: 35.28243, lng: 129.07295 }, detourKm: 0, address: "부산광역시 금정구 범어사로 259" },
  { id: "cafe-tea1-beomeosa", name: "TEA1", kind: "cafe", coordinates: { lat: 35.27882, lng: 129.07682 }, detourKm: 0, address: "부산광역시 금정구 청룡동" },
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
    return {
      place: places[1],
      confidence: 0.87,
      candidates: [
        { place: places[1], confidence: 0.87 },
        { place: places[0], confidence: 0.09 },
        { place: places[2], confidence: 0.04 },
      ],
      source: "mock",
    };
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
      facilities: routeFacilities(origin, destination.coordinates), source: "mock",
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
      "haedong-yonggungsa": { title: "바다를 품은 사찰", description: "전통 사찰 지붕과 바다가 한 화면에 함께 보이는 구도를 찾아보세요.", points: 160 },
      "busan-x-the-sky": { title: "하늘에서 찾은 해운대", description: "해운대의 해안선과 고층 건물이 함께 이어지는 풍경을 담아보세요.", points: 150 },
      cheongsapo: { title: "다릿돌 바다 프레임", description: "전망대 끝에서 바다와 해안 바위가 함께 보이는 장면을 남겨보세요.", points: 140 },
      "blueline-park": { title: "바다 위 캡슐 포착", description: "푸른 바다를 배경으로 달리는 스카이캡슐이나 해변열차를 촬영해보세요.", points: 150 },
      "cinema-center": { title: "빅루프의 선 찾기", description: "영화의전당 대형 지붕이 만드는 독특한 곡선과 구조를 담아보세요.", points: 130 },
      "maritime-museum": { title: "바다 이야기 발견", description: "박물관 전시에서 가장 흥미로운 배나 해양 생물 하나를 찾아 촬영해보세요.", points: 120 },
      igidae: { title: "해안선의 곡선", description: "이기대의 바위 해안과 푸른 바다가 만드는 곡선을 한 장에 담아보세요.", points: 150 },
      hwangnyeongsan: { title: "부산 불빛 모으기", description: "전망대에서 도심의 불빛과 산 능선이 함께 보이는 장면을 남겨보세요.", points: 150 },
      "busan-museum": { title: "부산의 시간 찾기", description: "전시품 가운데 부산의 옛 모습을 가장 잘 보여주는 유물 하나를 찾아보세요.", points: 120 },
      "un-memorial": { title: "평화를 기억하는 한 컷", description: "추모 공간의 국기나 기념 조형물을 차분한 구도로 기록해보세요.", points: 140 },
      "gukje-market": { title: "시장 간판 수집", description: "국제시장다운 분위기가 느껴지는 간판 세 개를 한 화면에 담아보세요.", points: 120 },
      "biff-square": { title: "영화인의 흔적 찾기", description: "광장 바닥에서 마음에 드는 영화인의 손도장이나 영화 상징을 찾아보세요.", points: 110 },
      "bosu-book-street": { title: "책으로 채운 골목", description: "책이 층층이 쌓인 서점 풍경이나 오래된 책방 간판을 촬영해보세요.", points: 120 },
      "bupyeong-market": { title: "야시장의 색 찾기", description: "시장 음식과 조명, 간판 가운데 서로 다른 세 가지 색을 담아보세요.", points: 130 },
      "nakdong-eco-center": { title: "습지의 생명 찾기", description: "갈대, 물새, 습지 가운데 두 가지 이상이 함께 보이는 풍경을 찾아보세요.", points: 150 },
      "samnak-eco-park": { title: "강바람의 흔적", description: "강변 갈대나 나무가 바람에 움직이는 순간을 사진으로 남겨보세요.", points: 130 },
      beomeosa: { title: "전통 지붕과 숲", description: "사찰의 단청 지붕과 금정산 숲이 함께 보이는 장면을 찾아보세요.", points: 150 },
    };
    const ranked = places.map((place): Mission => ({ id: `mission-${place.id}`, place, ...seeds[place.id], distanceKm: distanceKm(origin, place.coordinates) }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
    const localMissions = ranked.filter((mission) => mission.distanceKm <= 80);
    return (localMissions.length >= 3 ? localMissions : ranked).slice(0, 12);
  },
};
