"use client";

import { useState } from "react";
import { mockTravelProvider } from "../providers/mock";
import { isBroadLocationQuery, nominatimGeocodingProvider } from "../providers/nominatim";
import type { GeocodingResult, UserLocation } from "../providers/types";

interface Props {
  open: boolean;
  busy?: boolean;
  error?: string;
  onAgree: () => void;
  onManual: (location: UserLocation) => void;
  onClose: () => void;
}

export function LocationConsentModal({ open, busy, error, onAgree, onManual, onClose }: Props) {
  const [manualMode, setManualMode] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [manualError, setManualError] = useState("");

  const searchDetailedLocation = async () => {
    const value = query.trim();
    setManualError("");
    setResults([]);
    if (isBroadLocationQuery(value)) {
      setManualError("부산 전체보다 동·도로명·역·건물명을 함께 입력해주세요.");
      return;
    }
    const registered = mockTravelProvider.geocode(value);
    if (registered && !["부산", "서울"].includes(registered.label)) {
      onManual(registered);
      return;
    }
    setSearching(true);
    try {
      const found = await nominatimGeocodingProvider.search(value);
      setResults(found);
      if (!found.length) setManualError("세부 위치를 찾지 못했습니다. 도로명이나 건물명을 더 자세히 입력해주세요.");
    } catch {
      setManualError("주소 검색에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSearching(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="consent-modal" role="dialog" aria-modal="true" aria-labelledby="location-modal-title">
        <button className="modal-close" onClick={onClose} aria-label="위치 안내 닫기">×</button>
        <span className="modal-pin" aria-hidden="true">⌖</span>
        <p className="eyebrow">LOCATION</p>
        <h2 id="location-modal-title">내 위치를 사용해<br />가까운 여행을 찾을까요?</h2>
        <ul>
          <li>주변 명소를 찾기 위해 현재 위치를 사용합니다.</li>
          <li>길찾기의 출발지로 현재 위치를 사용합니다.</li>
          <li>가까운 AI 여행 미션을 추천하는 데 사용합니다.</li>
          <li>위치는 지속적으로 추적하지 않습니다.</li>
          <li>원하지 않으면 직접 지역을 입력할 수 있습니다.</li>
        </ul>
        {(error || manualError) && <p className="modal-error" role="alert">{manualError || error}</p>}
        {manualMode ? (
          <div className="manual-location">
            <label htmlFor="manual-region">세부 장소 또는 도로명 주소</label>
            <div className="search-field"><span aria-hidden="true">⌖</span><input id="manual-region" value={query} onChange={(event) => { setQuery(event.target.value); setResults([]); setManualError(""); }} placeholder="예: 광안역, 해운대 달맞이길 30" /></div>
            <button className="primary-button" disabled={!query.trim() || searching} onClick={searchDetailedLocation}>{searching ? "세부 위치를 찾고 있어요…" : "세부 위치 검색"}</button>
            {results.length > 0 && <><div className="manual-results" aria-label="세부 위치 검색 결과">{results.map((result) => <button key={result.id} onClick={() => onManual({ ...result.coordinates, label: result.label, source: "manual" })}><b>{result.label}</b><small>{result.kind}</small></button>)}</div><small className="geocode-credit">주소 검색 © OpenStreetMap contributors</small></>}
            <button className="plain-button" onClick={() => setManualMode(false)}>이전으로</button>
          </div>
        ) : (
          <div className="modal-actions">
            <button className="primary-button coral" disabled={busy} onClick={onAgree}>{busy ? "현재 위치를 확인하고 있어요…" : "동의하고 위치 사용"}</button>
            <button className="secondary-button" onClick={() => setManualMode(true)}>직접 지역 입력</button>
          </div>
        )}
      </section>
    </div>
  );
}
