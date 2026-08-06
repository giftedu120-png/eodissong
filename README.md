# 어디쏭 (eodissong)

사진, 장소 이름, 현재 위치로 여행지를 발견하고 상세 정보로 이어지는 모바일 우선 여행 웹앱입니다. 현재 버전은 외부 API 키 없이 전체 핵심 흐름을 확인할 수 있도록 Mock Provider를 사용합니다.

이번 버전에는 사용자가 명시적으로 동의한 뒤 실제 Geolocation 좌표를 사용하는 지도, 길찾기, AI 여행 미션이 포함됩니다.

## 실행

Node.js 22.13 이상에서 `npm install` 후 `npm run dev`를 실행합니다.

## 구조

- `app/page.tsx`: 사진 검색, 이름 검색, 주변 명소의 동일 비중 첫 화면
- `app/place/[id]/page.tsx`: 장소 사진, 설명, 주소, 지도, 길찾기·미션 진입점
- `app/providers/types.ts`: 장소·이미지 분석·지도 Provider 계약
- `app/providers/mock.ts`: 부산 명소를 사용하는 Mock 구현
- `app/explore/page.tsx`: 실제 좌표 중심의 미션 지도, 사진 완료, 포인트
- `app/directions/page.tsx`: 현재 위치·주소·장소 기반 길찾기와 편의시설
- `app/components/LocationConsentModal.tsx`: 위치 활용 안내 및 직접 입력 대체 흐름
- `app/components/TravelMap.tsx`: OpenStreetMap 기반 현재 위치·경로·미션 마커 지도

## 가정

- 현재 버전은 부산의 검증 가능한 실제 장소 세 곳을 Mock 데이터로 제공합니다.
- 사진 분석은 업로드한 파일의 내용과 무관하게 Mock 결과와 신뢰도를 반환합니다.
- 위치 권한은 사용자가 기능 버튼과 동의 버튼을 누른 뒤에만 요청합니다. `watchPosition`은 사용하지 않으며 마지막 좌표는 탭의 세션 저장소에만 보관합니다.
- 길찾기 경로, 시간과 경로 주변 편의시설은 실제 출발·도착 좌표를 이용하는 Mock 계산 결과입니다.
- 미션 완료 기록과 포인트는 MVP 범위에서 브라우저 `localStorage`에만 저장됩니다.
- AI 미션은 부산·서울의 Seed 장소만 거리순으로 구성하며 존재하지 않는 장소를 생성하지 않습니다.
- 부산 추천 Seed에는 해변, 시장, 공원, 전망대, 문화공간 등 13곳이 포함되며 현재 위치에서 80km 이내 장소를 우선합니다.
- 선택한 부산 명소 주변에는 비짓부산과 공개 지도에서 확인한 카페 Seed를 거리순으로 표시합니다.
- 지도와 장소 사진은 공개 웹 리소스를 사용하므로 오프라인에서는 표시되지 않을 수 있습니다.
- 한국어와 영어 설명 전환을 구현했고, 일본어·중국어는 Provider 데이터 확장으로 추가할 수 있습니다.

## 실제 API 연결 시 환경 변수 예시

클라이언트 코드에 키를 노출하지 않고 서버 측 Adapter에서만 사용해야 합니다.

```env
PLACES_API_KEY=
MAPS_API_KEY=
VISION_API_KEY=
TRANSLATION_API_KEY=
```
