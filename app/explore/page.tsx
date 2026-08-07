"use client";

import Link from "next/link";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LocationConsentModal } from "../components/LocationConsentModal";
import { TravelMap } from "../components/TravelMap";
import { loadLocation, requestCurrentLocation, saveLocation } from "../location";
import { mockTravelProvider } from "../providers/mock";
import type { Mission, UserLocation } from "../providers/types";

const COMPLETED_KEY = "eodissong:completed-missions";

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const requestedPlace = searchParams.get("mission");
  const [origin, setOrigin] = useState<UserLocation | null>(null);
  const [selected, setSelected] = useState<Mission | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [consentOpen, setConsentOpen] = useState(false);
  const [locationBusy, setLocationBusy] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = loadLocation();
      setOrigin(stored);
      try { setCompletedIds(JSON.parse(localStorage.getItem(COMPLETED_KEY) ?? "[]") as string[]); } catch { setCompletedIds([]); }
      if (!stored && requestedPlace) setConsentOpen(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [requestedPlace]);

  const missions = useMemo(() => origin ? mockTravelProvider.getMissions(origin) : [], [origin]);
  const nearbyPlaces = useMemo(() => origin ? mockTravelProvider.getNearby(origin.lat, origin.lng).slice(0, 12) : [], [origin]);
  const nearbyFacilities = useMemo(() => selected ? mockTravelProvider.getNearbyFacilities(selected.place.coordinates, 6) : [], [selected]);
  const points = useMemo(() => missions.filter((mission) => completedIds.includes(mission.id)).reduce((sum, mission) => sum + mission.points, 0), [completedIds, missions]);

  useEffect(() => {
    if (!missions.length) return;
    const timer = window.setTimeout(() => {
      const requested = missions.find((mission) => mission.place.id === requestedPlace);
      setSelected((current) => requested ?? current ?? missions[0]);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [missions, requestedPlace]);

  const useCurrentLocation = async () => {
    setLocationBusy(true);
    setLocationError("");
    try {
      const location = await requestCurrentLocation();
      saveLocation(location);
      setOrigin(location);
      setConsentOpen(false);
    } catch {
      setLocationError("위치 권한이 거부되었거나 위치를 가져오지 못했습니다. 지역 또는 주소를 직접 입력해주세요.");
    } finally {
      setLocationBusy(false);
    }
  };

  const useManualLocation = (query: string) => {
    const location = mockTravelProvider.geocode(query);
    if (!location) {
      setLocationError("장소를 찾지 못했습니다. 부산, 서울 또는 등록된 명소·주소를 입력해주세요.");
      return;
    }
    saveLocation(location);
    setOrigin(location);
    setConsentOpen(false);
  };

  const selectMission = useCallback((mission: Mission) => {
    setSelected(mission);
    setSuccessMessage("");
  }, []);

  const completeMission = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0] || !selected || completedIds.includes(selected.id)) return;
    const next = [...completedIds, selected.id];
    setCompletedIds(next);
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(next));
    setSuccessMessage(`${selected.points}P를 획득했어요! 다음 미션도 발견해보세요.`);
  };

  const selectNextMission = () => {
    const next = missions.find((mission) => !completedIds.includes(mission.id) && mission.id !== selected?.id);
    if (next) selectMission(next);
  };

  const center = origin ?? selected?.place.coordinates ?? { lat: 37.5665, lng: 126.9780 };
  const selectedCompleted = selected ? completedIds.includes(selected.id) : false;

  return (
    <main className="map-page">
      <header className="app-header">
        <Link href="/" className="brand" aria-label="어디쏭 홈"><img className="brand-logo" src="/eodissong-logo.png" alt="" /> 어디쏭</Link>
        <div className="point-pill"><span aria-hidden="true">✦</span><b>{points}P</b></div>
      </header>
      <section className="map-toolbar">
        <div><p className="eyebrow">AI MISSION MAP</p><h1>내 주변 여행 미션</h1><p>{origin ? <><b>{origin.label}</b> 기준 · 실제 좌표 {origin.lat.toFixed(4)}, {origin.lng.toFixed(4)}</> : "위치를 정하면 가까운 실제 여행지를 추천해요."}</p></div>
        <button className="location-chip" onClick={() => setConsentOpen(true)}>⌖ {origin ? "위치 새로 요청" : "내 위치 사용"}</button>
      </section>

      {origin ? (
        <section className="mission-map-shell">
          <TravelMap center={center} currentLocation={origin.source === "geolocation" ? origin : null} missions={missions} completedMissionIds={completedIds} selectedMissionId={selected?.id} facilities={nearbyFacilities} onMissionSelect={selectMission} />
          <div className="map-legend"><span><i className="legend-dot user" />현재 위치</span><span><i className="legend-dot mission" />미션</span><span><i className="legend-dot done" />완료</span></div>
          <aside className="nearby-rail" aria-label="가까운 미션 목록">
            <b>가까운 미션</b>
            {missions.slice(0, 8).map((mission) => <button key={mission.id} className={selected?.id === mission.id ? "active" : ""} onClick={() => selectMission(mission)}><span>{completedIds.includes(mission.id) ? "✓" : "✦"}</span><div><strong>{mission.place.name.ko}</strong><small>{mission.distanceKm.toFixed(1)}km · {mission.points}P</small></div></button>)}
          </aside>
          {selected && (
            <section className="mission-sheet" aria-label="선택한 미션">
              <button className="sheet-close" onClick={() => setSelected(null)} aria-label="미션 카드 닫기">×</button>
              <div className="mission-photo"><img src={selected.place.imageUrl} alt={`${selected.place.name.ko} 전경`} /><span className={selectedCompleted ? "done-badge" : "mission-badge"}>{selectedCompleted ? "✓ 완료된 미션" : `✦ ${selected.points}P`}</span></div>
              <div className="mission-body">
                <small>{selected.place.category} · {selected.distanceKm.toFixed(1)}km</small>
                <h2>{selected.place.name.ko}</h2>
                <p className="place-summary">{selected.place.description.ko}</p>
                <div className="mission-task"><span aria-hidden="true">✦</span><div><small>YOUR MISSION</small><b>{selected.title}</b><p>{selected.description}</p></div></div>
                <div className="nearby-cafes">
                  <div className="nearby-cafes-title"><div><small>NEARBY CAFE</small><b>이 명소 근처에서 쉬어가기</b></div><span>지도에 표시됨</span></div>
                  {nearbyFacilities.map((facility) => <div className="nearby-cafe-row" key={facility.id}><span aria-hidden="true">☕</span><div><b>{facility.name}</b><small>{facility.address}</small></div><em>{facility.distanceKm?.toFixed(1)}km</em></div>)}
                </div>
                {successMessage && selectedCompleted && <p className="mission-success" role="status">✓ {successMessage}</p>}
                <div className="mission-actions">
                  <Link href={`/directions?to=${selected.place.id}`} className="secondary-button">➜ 길찾기</Link>
                  <label className={`primary-button coral ${selectedCompleted ? "disabled" : ""}`}>{selectedCompleted ? "✓ 완료된 미션" : "▣ 사진 촬영 또는 업로드"}<input type="file" accept="image/*" capture="environment" onChange={completeMission} disabled={selectedCompleted} /></label>
                </div>
                {selectedCompleted && missions.some((mission) => !completedIds.includes(mission.id)) && <button className="next-mission" onClick={selectNextMission}>다음 미션 추천 →</button>}
              </div>
            </section>
          )}
        </section>
      ) : (
        <section className="map-empty-state"><span aria-hidden="true">⌖</span><h2>지도를 시작할 위치가 필요해요</h2><p>현재 위치를 사용하거나 원하는 지역·주소를 직접 입력할 수 있어요.</p><button className="primary-button coral" onClick={() => setConsentOpen(true)}>내 주변 AI 여행 미션 찾기</button></section>
      )}

      {origin && <section className="seed-note"><b>실제 장소 Seed 데이터</b><p>{nearbyPlaces.map((place) => place.name.ko).join(" · ")}</p><small>AI는 이 장소 데이터를 거리순으로 구성하며 새로운 장소를 만들어내지 않습니다.</small></section>}
      <LocationConsentModal open={consentOpen} busy={locationBusy} error={locationError} onAgree={useCurrentLocation} onManual={useManualLocation} onClose={() => setConsentOpen(false)} />
    </main>
  );
}
