"use client";

import Link from "next/link";
import { ChangeEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LocationConsentModal } from "./components/LocationConsentModal";
import { requestCurrentLocation, saveLocation } from "./location";
import { mockTravelProvider } from "./providers/mock";
import type { Locale, Place, VisionResult } from "./providers/types";

type NearbyState = "idle" | "loading" | "ready" | "denied" | "error";

const icon = (value: string) => <span aria-hidden="true">{value}</span>;

function PlaceRow({ place, meta }: { place: Place; meta?: string }) {
  return (
    <div className="place-row">
      <a className="place-row-main" href={`/place/${place.id}`} aria-label={`${place.name.ko} 상세보기`}>
        <img src={place.imageUrl} alt="" />
        <span>
          <strong>{place.name.ko}</strong>
          <small>{meta ?? place.category}</small>
        </span>
      </a>
      <a className="row-arrow" href={`/place/${place.id}`} aria-label={`${place.name.ko} 상세 페이지로 이동`}>→</a>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [vision, setVision] = useState<VisionResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [locale, setLocale] = useState<Locale>("ko");
  const [nearbyState, setNearbyState] = useState<NearbyState>("idle");
  const [nearby, setNearby] = useState<Place[]>([]);
  const [region, setRegion] = useState("");
  const [consentOpen, setConsentOpen] = useState(false);
  const [locationError, setLocationError] = useState("");

  const suggestions = useMemo(
    () => (query.trim() ? mockTravelProvider.searchPlaces(query).slice(0, 4) : []),
    [query],
  );

  const choosePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoName(file.name);
    setPhotoPreview(URL.createObjectURL(file));
    setVision(null);
  };

  const analyzePhoto = async () => {
    if (!photoName) return;
    setAnalyzing(true);
    setVision(null);
    try {
      setVision(await mockTravelProvider.analyzeImage(photoName));
    } finally {
      setAnalyzing(false);
    }
  };

  const requestNearby = () => {
    setLocationError("");
    setConsentOpen(true);
  };

  const useCurrentLocation = async () => {
    setNearbyState("loading");
    try {
      const location = await requestCurrentLocation();
      saveLocation(location);
      setNearby(mockTravelProvider.getNearby(location.lat, location.lng));
      setNearbyState("ready");
      setConsentOpen(false);
      router.push("/explore");
    } catch {
      setNearbyState("denied");
      setLocationError("위치 권한이 거부되었거나 현재 위치를 가져오지 못했습니다. 지역이나 주소를 직접 입력해주세요.");
    }
  };

  const searchRegion = (value = region) => {
    const location = mockTravelProvider.geocode(value);
    if (!location) {
      setLocationError("지원하는 지역이나 장소를 찾지 못했습니다. 부산, 서울 또는 등록된 명소 이름을 입력해주세요.");
      return;
    }
    saveLocation(location);
    setNearby(mockTravelProvider.getNearby(location.lat, location.lng));
    setNearbyState("ready");
    setConsentOpen(false);
    router.push("/explore");
  };

  return (
    <main>
      <header className="topbar">
        <Link className="brand" href="/" aria-label="어디쏭 홈">
          <img className="brand-logo" src="/eodissong-logo.png" alt="" /> 어디쏭
        </Link>
        <button className="round-button" aria-label="저장한 장소 보기">♡</button>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-message">
          <p className="eyebrow">부산을 담다, 길을 찾다</p>
          <h1 id="hero-title">어디로 갈지 궁금할 땐<br /><em>어디쏭</em></h1>
          <p className="hero-copy">사진 한 장, 이름 하나, 지금 내 위치에서 부산 여행이 시작돼요.</p>
        </div>
        <img className="hero-logo" src="/eodissong-logo.png" alt="광안대교와 바다를 품은 어디쏭 로고 — 부산을 담다, 길을 찾다" />
      </section>

      <section className="feature-grid" aria-label="여행지 찾기">
        <article className="feature-card photo-card">
          <div className="card-heading">
            <span className="feature-icon">⌾</span>
            <div><span className="step">01</span><h2>사진으로 찾기</h2></div>
          </div>
          <p>눈앞의 장소가 궁금하다면 사진을 찍어보세요.</p>
          <div className="upload-zone" aria-live="polite">
            {photoPreview ? <img src={photoPreview} alt="업로드한 사진 미리보기" /> : <><b>{icon("＋")} 사진 촬영 또는 업로드</b><small>JPG, PNG · 최대 10MB</small></>}
          </div>
          <div className="upload-actions" aria-label="사진 선택 방법">
            <label className="upload-option">📷 사진 촬영<input type="file" accept="image/*" capture="environment" onChange={choosePhoto} /></label>
            <label className="upload-option">▣ 파일 업로드<input type="file" accept="image/*" onChange={choosePhoto} /></label>
          </div>
          <button className="primary-button" disabled={!photoName || analyzing} onClick={analyzePhoto}>
            {analyzing ? "사진을 분석하고 있어요…" : "사진 분석하기"}
          </button>
          {vision && (
            <div className="result-box" aria-live="polite">
              <div className="result-title"><b>분석 결과</b><span>{Math.round(vision.confidence * 100)}% 일치</span></div>
              <h3>{vision.place.name[locale]}</h3>
              <p>{vision.place.description[locale]}</p>
              <label className="language-select">설명 언어
                <select value={locale} onChange={(e) => setLocale(e.target.value as Locale)}>
                  <option value="ko">한국어</option><option value="en">English</option>
                </select>
              </label>
              <a className="text-link" href={`/place/${vision.place.id}`}><span>장소 상세보기</span><span className="result-arrow" aria-hidden="true">→</span></a>
              <small className="confidence-note">Mock 분석 결과예요. 실제 연결 시 후보와 신뢰도를 함께 제공합니다.</small>
            </div>
          )}
        </article>

        <article className="feature-card search-card">
          <div className="card-heading">
            <span className="feature-icon">⌕</span>
            <div><span className="step">02</span><h2>이름으로 검색</h2></div>
          </div>
          <p>가고 싶은 장소나 명소의 이름을 입력해보세요.</p>
          <label className="search-field">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="예: 광안리, 감천문화마을" aria-label="장소 이름 검색" autoComplete="off" />
            {query && <button onClick={() => setQuery("")} aria-label="검색어 지우기">×</button>}
          </label>
          <div className="suggestions" aria-live="polite">
            {suggestions.length > 0 ? suggestions.map((place) => <PlaceRow key={place.id} place={place} />) : query ? <p className="empty">검색 결과가 없어요. 다른 이름을 입력해보세요.</p> : <>
              <span className="suggestion-label">지금 많이 방문하는 장소</span>
              {mockTravelProvider.featured().slice(0, 2).map((place) => <PlaceRow key={place.id} place={place} />)}
            </>}
          </div>
        </article>

        <article className="feature-card nearby-card">
          <div className="card-heading">
            <span className="feature-icon">⌖</span>
            <div><span className="step">03</span><h2>주변 명소 보기</h2></div>
          </div>
          <p>현재 위치에서 가까운 여행지를 바로 만나보세요.</p>
          {nearbyState === "idle" && <div className="location-visual" aria-hidden="true"><span>✦</span><i></i><b>내 주변의 발견</b></div>}
          {nearbyState === "loading" && <div className="status-box" role="status"><span className="spinner" />가까운 명소를 찾고 있어요…</div>}
          {(nearbyState === "denied" || nearbyState === "error") && (
            <div className="permission-box" role="status">
              <b>위치를 확인할 수 없어요</b>
              <p>괜찮아요. 원하는 지역을 직접 입력해주세요.</p>
              <label className="search-field"><span aria-hidden="true">⌖</span><input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="예: 부산, 해운대" aria-label="지역 검색" /></label>
              <button className="secondary-button" onClick={() => searchRegion()} disabled={!region.trim()}>지역으로 찾기</button>
            </div>
          )}
          {nearbyState === "ready" && <div className="suggestions nearby-results">
            {nearby.length ? nearby.map((place) => <PlaceRow key={place.id} place={place} meta={place.distance} />) : <p className="empty">이 지역의 Mock 명소가 아직 없어요.</p>}
          </div>}
          {nearbyState !== "ready" && <button className="primary-button coral" onClick={requestNearby} disabled={nearbyState === "loading"}>⌖ 주변 명소 보기</button>}
          <small className="privacy-note">위치는 명소 검색에만 사용되며 저장되지 않아요.</small>
        </article>
      </section>

      <section className="featured-strip" aria-labelledby="recommend-title">
        <div><p className="eyebrow">오늘의 추천</p><h2 id="recommend-title">바다와 도시 사이,<br />부산을 걷는 하루</h2></div>
        <Link href="/place/gwangalli">추천 장소 보기 <span aria-hidden="true">→</span></Link>
      </section>

      <footer><span className="brand"><img className="brand-logo" src="/eodissong-logo.png" alt="" /> 어디쏭</span><p>부산을 담고, 나만의 길을 찾는 여행.</p><small>현재 Mock 데이터로 작동합니다.</small></footer>
      <LocationConsentModal open={consentOpen} busy={nearbyState === "loading"} error={locationError} onAgree={useCurrentLocation} onManual={searchRegion} onClose={() => setConsentOpen(false)} />
    </main>
  );
}
