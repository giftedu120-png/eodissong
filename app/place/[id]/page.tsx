"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { mockTravelProvider } from "../../providers/mock";

export default function PlaceDetail() {
  const params = useParams<{ id: string }>();
  const place = mockTravelProvider.getPlace(params.id);
  const [panel, setPanel] = useState<"route" | "mission" | null>(null);

  if (!place) return <main className="not-found"><p className="eyebrow">404</p><h1>장소를 찾을 수 없어요.</h1><Link className="primary-button" href="/">홈으로 돌아가기</Link></main>;

  return (
    <main className="detail-page">
      <header className="detail-nav"><Link href="/" aria-label="홈으로 돌아가기">←</Link><span className="brand"><span className="brand-mark">○</span> 모먼트립</span><button aria-label="장소 저장">♡</button></header>
      <section className="detail-hero">
        <img src={place.imageUrl} alt={`${place.name.ko} 전경`} />
        <div className="hero-shade" />
        <div className="detail-title"><span>{place.category}</span><h1>{place.name.ko}</h1><p>{place.name.en}</p></div>
      </section>
      <div className="detail-content">
        <section className="detail-copy"><p className="eyebrow">PLACE STORY</p><h2>이곳에서 만나는<br />부산의 한 장면</h2><p>{place.description.ko}</p><div className="address"><span aria-hidden="true">⌖</span><div><small>주소</small><b>{place.address}</b></div></div></section>
        <section className="map-section"><div className="section-heading"><div><p className="eyebrow">LOCATION</p><h2>지도에서 보기</h2></div><a href={mockTravelProvider.getDirectionsUrl(place)} target="_blank" rel="noreferrer">큰 지도 ↗</a></div><iframe title={`${place.name.ko} 지도`} src={mockTravelProvider.getEmbedUrl(place)} loading="lazy" /></section>
        <section className="action-section" aria-label="장소에서 할 일">
          <button className="route-button" onClick={() => setPanel("route")}><span>➜</span><div><small>가장 편한 길을 찾아드려요</small><b>길찾기</b></div><i>→</i></button>
          <button className="mission-button" onClick={() => setPanel("mission")}><span>✦</span><div><small>이 장소를 더 특별하게</small><b>AI 여행 미션</b></div><i>→</i></button>
        </section>
        {panel && <section className="info-panel" aria-live="polite"><button onClick={() => setPanel(null)} aria-label="안내 닫기">×</button><span>{panel === "route" ? "➜" : "✦"}</span><div><b>{panel === "route" ? "길찾기는 다음 단계에서 연결돼요" : "AI 여행 미션은 다음 단계에서 만나요"}</b><p>{panel === "route" ? "현재 위치에서 이 장소까지의 최적 경로와 주변 편의시설을 제공할 예정입니다." : "검증된 장소 데이터를 바탕으로 수행 가능한 미션을 추천할 예정입니다."}</p></div></section>}
      </div>
      <footer><span className="brand"><span className="brand-mark">○</span> 모먼트립</span><p>발견에서 길찾기, 미션까지 이어지는 여행.</p></footer>
    </main>
  );
}
