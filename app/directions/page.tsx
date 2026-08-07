"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LocationConsentModal } from "../components/LocationConsentModal";
import { TravelMap } from "../components/TravelMap";
import { loadLocation, requestCurrentLocation, saveLocation } from "../location";
import { mockTravelProvider } from "../providers/mock";
import { isBroadLocationQuery, nominatimGeocodingProvider } from "../providers/nominatim";
import { createOsrmRoutingProvider } from "../providers/osrm";
import type { GeocodingResult, Place, RouteResult, UserLocation } from "../providers/types";

const facilityLabel = { toilet: "화장실", convenience: "편의점", cafe: "카페" };
const facilityIcon = { toilet: "WC", convenience: "24", cafe: "☕" };
const routingProvider = createOsrmRoutingProvider(mockTravelProvider);

export default function DirectionsPage() {
  const searchParams = useSearchParams();
  const [origin, setOrigin] = useState<UserLocation | null>(null);
  const [destination, setDestination] = useState<Place | null>(null);
  const [originQuery, setOriginQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [consentOpen, setConsentOpen] = useState(false);
  const [locationBusy, setLocationBusy] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [routeState, setRouteState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [routeError, setRouteError] = useState("");
  const [originResults, setOriginResults] = useState<GeocodingResult[]>([]);
  const [originSearchBusy, setOriginSearchBusy] = useState(false);
  const [originSearchError, setOriginSearchError] = useState("");
  const destinationId = searchParams.get("to");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setOrigin(loadLocation());
      if (destinationId) setDestination(mockTravelProvider.getPlace(destinationId) ?? null);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [destinationId]);

  const originSuggestions = useMemo(() => originQuery.trim() ? mockTravelProvider.searchPlaces(originQuery).slice(0, 4) : [], [originQuery]);
  const destinationSuggestions = useMemo(() => destinationQuery.trim() ? mockTravelProvider.searchPlaces(destinationQuery).slice(0, 4) : [], [destinationQuery]);

  useEffect(() => {
    if (!origin || !destination) return;
    const controller = new AbortController();
    let active = true;
    let timeout = 0;
    const start = window.setTimeout(() => {
      if (!active) return;
      timeout = window.setTimeout(() => controller.abort(), 12000);
      setRoute(null);
      setRouteError("");
      setRouteState("loading");
      void routingProvider.getRoute(origin, destination, controller.signal).then((result) => {
        if (!active) return;
        setRoute(result);
        setRouteState("ready");
      }).catch((error: unknown) => {
        if (!active) return;
        if (controller.signal.aborted) setRouteError("도로 경로 조회 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.");
        else setRouteError(error instanceof Error ? error.message : "도로 경로를 불러오지 못했습니다.");
        setRouteState("error");
      }).finally(() => window.clearTimeout(timeout));
    }, 0);
    return () => { active = false; window.clearTimeout(start); window.clearTimeout(timeout); controller.abort(); };
  }, [origin, destination]);

  const useCurrentLocation = async () => {
    setLocationBusy(true);
    setLocationError("");
    try {
      const location = await requestCurrentLocation();
      saveLocation(location);
      setOrigin(location);
      setConsentOpen(false);
    } catch {
      setLocationError("위치 권한이 거부되었습니다. 주소나 장소를 출발지로 입력해주세요.");
    } finally { setLocationBusy(false); }
  };

  const useManualLocation = (location: UserLocation) => {
    saveLocation(location);
    setOrigin(location);
    setOriginQuery("");
    setConsentOpen(false);
  };

  const chooseOriginPlace = (place: Place) => {
    const location: UserLocation = { ...place.coordinates, label: place.name.ko, source: "manual" };
    saveLocation(location);
    setOrigin(location);
    setOriginQuery("");
    setOriginResults([]);
  };

  const chooseOriginResult = (result: GeocodingResult) => {
    const location: UserLocation = { ...result.coordinates, label: result.label, source: "manual" };
    saveLocation(location);
    setOrigin(location);
    setOriginQuery("");
    setOriginResults([]);
    setOriginSearchError("");
  };

  const searchDetailedOrigin = async () => {
    const value = originQuery.trim();
    setOriginResults([]);
    setOriginSearchError("");
    if (isBroadLocationQuery(value)) {
      setOriginSearchError("부산 전체보다 동·도로명·역·건물명을 함께 입력해주세요.");
      return;
    }
    setOriginSearchBusy(true);
    try {
      const results = await nominatimGeocodingProvider.search(value);
      setOriginResults(results);
      if (!results.length) setOriginSearchError("세부 위치를 찾지 못했습니다. 주소나 장소명을 더 자세히 입력해주세요.");
    } catch {
      setOriginSearchError("상세 주소 검색에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setOriginSearchBusy(false);
    }
  };

  const center = origin ?? destination?.coordinates ?? { lat: 37.5665, lng: 126.9780 };

  return (
    <main className="directions-page">
      <header className="app-header"><Link href="/" className="brand"><img className="brand-logo" src="/eodissong-logo.png" alt="" /> 어디쏭</Link><Link href="/explore" className="header-link">미션 지도 ✦</Link></header>
      <section className="directions-head"><p className="eyebrow">ROUTE GUIDE</p><h1>어디서 출발할까요?</h1><p>현재 위치, 주소 또는 장소를 선택하면 추천 경로를 보여드려요.</p></section>
      <section className="route-inputs">
        <div className="route-field-block origin"><label htmlFor="route-origin">출발지</label><div className="route-field"><span className="route-dot start" /><input id="route-origin" value={originQuery} onChange={(event) => { setOriginQuery(event.target.value); setOriginResults([]); setOriginSearchError(""); }} placeholder={origin?.label ?? "동·도로명·역·건물명 검색"} aria-label="출발지 검색" /></div><div className="route-origin-actions"><button onClick={() => setConsentOpen(true)}>⌖ 허가 후 현재 위치 사용</button><button onClick={searchDetailedOrigin} disabled={!originQuery.trim() || originSearchBusy}>{originSearchBusy ? "검색 중…" : "상세 주소 검색"}</button></div>{originSearchError && <p className="route-address-error" role="alert">{originSearchError}</p>}{originResults.length > 0 ? <><div className="route-suggestions">{originResults.map((result) => <button key={result.id} onClick={() => chooseOriginResult(result)}><b>{result.label}</b><small>{result.kind}</small></button>)}</div><small className="geocode-credit">주소 검색 © OpenStreetMap contributors</small></> : originSuggestions.length > 0 && <div className="route-suggestions">{originSuggestions.map((place) => <button key={place.id} onClick={() => chooseOriginPlace(place)}><b>{place.name.ko}</b><small>{place.address}</small></button>)}</div>}</div>
        <span className="route-connector" aria-hidden="true">↓</span>
        <div className="route-field-block"><label htmlFor="route-destination">목적지</label><div className="route-field"><span className="route-dot end" /><input id="route-destination" value={destinationQuery} onChange={(event) => setDestinationQuery(event.target.value)} placeholder={destination?.name.ko ?? "장소 검색"} aria-label="목적지 검색" /></div>{destinationSuggestions.length > 0 && <div className="route-suggestions">{destinationSuggestions.map((place) => <button key={place.id} onClick={() => { setDestination(place); setDestinationQuery(""); }}><b>{place.name.ko}</b><small>{place.address}</small></button>)}</div>}</div>
      </section>

      {routeState === "loading" ? (
        <section className="route-empty" role="status"><span className="spinner" /><h2>실제 도로 경로를 찾고 있어요</h2><p>도로망을 따라 이동할 수 있는 경로와 예상 시간을 계산합니다.</p></section>
      ) : routeState === "error" && origin && destination ? (
        <section className="route-empty" role="alert"><span aria-hidden="true">!</span><h2>도로 경로를 불러오지 못했어요</h2><p>{routeError}<br />잘못된 직선 경로는 표시하지 않습니다.</p><a className="primary-button route-external" href={`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${origin.lat}%2C${origin.lng}%3B${destination.coordinates.lat}%2C${destination.coordinates.lng}`} target="_blank" rel="noreferrer">OpenStreetMap에서 경로 확인</a></section>
      ) : route ? (
        <section className="route-result">
          <div className="route-map-wrap"><TravelMap center={center} currentLocation={origin?.source === "geolocation" ? origin : null} route={route} facilities={route.facilities} /></div>
          <aside className="route-summary">
            <p className="eyebrow">ROAD NETWORK ROUTE</p><h2>{route.destination.name.ko}</h2><p className="route-source">✓ OpenStreetMap 도로망을 따른 자동차 경로</p><div className="route-metrics"><div><small>거리</small><b>{route.distanceKm.toFixed(1)}km</b></div><div><small>예상 시간</small><b>약 {route.durationMinutes}분</b></div></div>
            <ol>{route.steps.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol>
            <div className="facility-section"><h3>경로 주변 편의시설</h3>{route.facilities.map((facility) => <div className="facility-row" key={facility.id}><span>{facilityIcon[facility.kind]}</span><div><b>{facility.name}</b><small>{facilityLabel[facility.kind]}</small></div><em>+{facility.detourKm.toFixed(2)}km 우회</em></div>)}</div>
          </aside>
        </section>
      ) : (
        <section className="route-empty"><span aria-hidden="true">➜</span><h2>출발지와 목적지를 선택해주세요</h2><p>두 지점이 정해지면 거리, 시간, 경로와 주변 편의시설을 표시합니다.</p></section>
      )}
      <LocationConsentModal open={consentOpen} busy={locationBusy} error={locationError} onAgree={useCurrentLocation} onManual={useManualLocation} onClose={() => setConsentOpen(false)} />
    </main>
  );
}
