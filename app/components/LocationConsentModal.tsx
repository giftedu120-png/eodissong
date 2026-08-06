"use client";

import { useState } from "react";

interface Props {
  open: boolean;
  busy?: boolean;
  error?: string;
  onAgree: () => void;
  onManual: (query: string) => void;
  onClose: () => void;
}

export function LocationConsentModal({ open, busy, error, onAgree, onManual, onClose }: Props) {
  const [manualMode, setManualMode] = useState(false);
  const [query, setQuery] = useState("");

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
        {error && <p className="modal-error" role="alert">{error}</p>}
        {manualMode ? (
          <div className="manual-location">
            <label htmlFor="manual-region">지역명 또는 주소</label>
            <div className="search-field"><span aria-hidden="true">⌖</span><input id="manual-region" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="예: 부산, 서울, 광안리" /></div>
            <button className="primary-button" disabled={!query.trim()} onClick={() => onManual(query)}>이 위치로 계속하기</button>
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
