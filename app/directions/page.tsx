"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LocationConsentModal } from "../components/LocationConsentModal";
import { TravelMap } from "../components/TravelMap";
import { loadLocation, requestCurrentLocation, saveLocation } from "../location";
import { mockTravelProvider } from "../providers/mock";
import type { Place, UserLocation } from "../providers/types";

const facilityLabel = { toilet: "화장실", convenience: "편의점", cafe: "카페" };
const facilityIcon = { toilet: "WC", convenience: "24", cafe: "☕" };

export default function DirectionsPage() {
  const searchParams = useSearchParams();
  const [origin, setOrigin] = useState<UserLocation | null>(null);
  const [destination, setDestination] = useState<Place | null>(null);
  const [originQuery, setOriginQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [consentOpen, setConsentOpen] = useState(false);
  const [locationBusy, setLocationBusy] = useState(false);
  const [locationError, setLocationError] = useState("");
  const destinationId = searchParams.get("to");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setOrigin(loadLocation());
      if (destinationId) setDestination(mockTravelProvider.getPlace(destinationId) ?? null);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [destinationId]);

  const route = useMemo(() => origin && destination ? mockTravelProvider.getRoute(origin, destination) : null, [origin, destination]);
  const originSuggestions = useMemo(() => originQuery.trim() ? mockTravelProvider.searchPlaces(originQuery).slice(0, 4) : [], [originQuery]);
  const destinationSuggestions = useMemo(() => destinationQuery.trim() ? mockTravelProvider.searchPlaces(destinationQuery).slice(0, 4) : [], [destinationQuery]);

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

  const useManualLocation = (query: string) => {
    const location = mockTravelProvider.geocode(query);
    if (!location) { setLocationError("등록된 지역, 주소 또는 장소를 찾지 못했습니다."); return; }
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
  };

  const center = origin ?? destination?.coordinates ?? { lat: 37.5665, lng: 126.9780 };

  return (
    <main className="directions-page">
      <header className="app-header"><Link href="/" className="brand"><img className="brand-logo" src="/eodissong-logo.png" alt="" /> 어디쏭</Link><Link href="/explore" className="header-link">미션 지도 ✦</Link></header>
      <section className="directions-head"><p className="eyebrow">ROUTE GUIDE</p><h1>어디서 출발할까요?</h1><p>현재 위치, 주소 또는 장소를 선택하면 추천 경로를 보여드려요.</p></section>
      <section className="route-inputs">
        <div className="route-field-block"><label htmlFor="route-origin">출발지</label><div className="route-field"><span className="route-dot start" /><input id="route-origin" value={originQuery} onChange={(event) => setOriginQuery(event.target.value)} placeholder={origin?.label ?? "주소 또는 장소 검색"} aria-label="출발지 검색" /><button onClick={() => setConsentOpen(true)}>⌖ 현재 위치</button></div>{originSuggestions.length > 0 && <div className="route-suggestions">{originSuggestions.map((place) => <button key={place.id} onClick={() => chooseOriginPlace(place)}><b>{place.name.ko}</b><small>{place.address}</small></button>)}</div>}</div>
        <span className="route-connector" aria-hidden="true">↓</span>
        <div className="route-field-block"><label htmlFor="route-destination">목적지</label><div className="route-field"><span className="route-dot end" /><input id="route-destination" value={destinationQuery} onChange={(event) => setDestinationQuery(event.target.value)} placeholder={destination?.name.ko ?? "장소 검색"} aria-label="목적지 검색" /></div>{destinationSuggestions.length > 0 && <div className="route-suggestions">{destinationSuggestions.map((place) => <button key={place.id} onClick={() => { setDestination(place); setDestinationQuery(""); }}><b>{place.name.ko}</b><small>{place.address}</small></button>)}</div>}</div>
      </section>

      {route ? (
        <section className="route-result">
          <div className="route-map-wrap"><TravelMap center={center} currentLocation={origin?.source === "geolocation" ? origin : null} route={route} facilities={route.facilities} /></div>
          <aside className="route-summary">
            <p className="eyebrow">BEST ROUTE</p><h2>{route.destination.name.ko}</h2><div className="route-metrics"><div><small>거리</small><b>{route.distanceKm.toFixed(1)}km</b></div><div><small>예상 시간</small><b>약 {route.durationMinutes}분</b></div></div>
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
