"use client";

import { useEffect, useRef } from "react";
import type { Facility, Mission, Place, RouteResult, UserLocation } from "../providers/types";
import "leaflet/dist/leaflet.css";

interface Props {
  center: { lat: number; lng: number };
  currentLocation?: UserLocation | null;
  places?: Place[];
  missions?: Mission[];
  completedMissionIds?: string[];
  selectedMissionId?: string;
  route?: RouteResult | null;
  facilities?: Facility[];
  onMissionSelect?: (mission: Mission) => void;
  onPlaceSelect?: (place: Place) => void;
}

const facilitySymbol = { toilet: "WC", convenience: "24", cafe: "☕" };

export function TravelMap({ center, currentLocation, places = [], missions = [], completedMissionIds = [], selectedMissionId, route, facilities = [], onMissionSelect, onPlaceSelect }: Props) {
  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapElement.current) return;
    let cancelled = false;
    let cleanup = () => {};

    void import("leaflet").then((L) => {
      if (cancelled || !mapElement.current) return;
      const map = L.map(mapElement.current, { zoomControl: true, attributionControl: true }).setView([center.lat, center.lng], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      const makeIcon = (className: string, label: string) => L.divIcon({ className: "", html: `<span class="${className}"><b>${label}</b></span>`, iconSize: [42, 42], iconAnchor: [21, 38] });
      const bounds: [number, number][] = [];

      if (currentLocation) {
        L.marker([currentLocation.lat, currentLocation.lng], { icon: makeIcon("map-user-marker", "●"), keyboard: true, title: "현재 위치" }).addTo(map).bindTooltip("현재 위치");
        bounds.push([currentLocation.lat, currentLocation.lng]);
      }

      places.forEach((place) => {
        const marker = L.marker([place.coordinates.lat, place.coordinates.lng], { icon: makeIcon("map-place-marker", "⌖"), keyboard: true, title: place.name.ko }).addTo(map);
        marker.bindTooltip(place.name.ko);
        marker.on("click", () => onPlaceSelect?.(place));
        bounds.push([place.coordinates.lat, place.coordinates.lng]);
      });

      missions.forEach((mission) => {
        const completed = completedMissionIds.includes(mission.id);
        const selected = selectedMissionId === mission.id;
        const marker = L.marker([mission.place.coordinates.lat, mission.place.coordinates.lng], {
          icon: makeIcon(`map-mission-marker${completed ? " completed" : ""}${selected ? " selected" : ""}`, completed ? "✓" : "✦"),
          keyboard: true,
          title: `${mission.place.name.ko} 미션${completed ? " 완료" : ""}`,
        }).addTo(map);
        marker.bindTooltip(completed ? `${mission.place.name.ko} · 완료` : `${mission.place.name.ko} · ${mission.points}P`);
        marker.on("click", () => onMissionSelect?.(mission));
        bounds.push([mission.place.coordinates.lat, mission.place.coordinates.lng]);
      });

      if (route) {
        const line = route.path.map((point): [number, number] => [point.lat, point.lng]);
        L.polyline(line, { color: "#e97055", weight: 6, opacity: 0.9, dashArray: "10 8" }).addTo(map);
        L.marker([route.destination.coordinates.lat, route.destination.coordinates.lng], { icon: makeIcon("map-destination-marker", "◆"), title: route.destination.name.ko }).addTo(map).bindTooltip(route.destination.name.ko);
        bounds.push(...line);
      }

      facilities.forEach((facility) => {
        L.marker([facility.coordinates.lat, facility.coordinates.lng], { icon: makeIcon("map-facility-marker", facilitySymbol[facility.kind]), title: facility.name }).addTo(map).bindTooltip(`${facility.name} · +${facility.detourKm.toFixed(2)}km`);
        bounds.push([facility.coordinates.lat, facility.coordinates.lng]);
      });

      if (bounds.length > 1) map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
      setTimeout(() => map.invalidateSize(), 0);
      cleanup = () => map.remove();
    });

    return () => { cancelled = true; cleanup(); };
  }, [center.lat, center.lng, currentLocation, places, missions, completedMissionIds, selectedMissionId, route, facilities, onMissionSelect, onPlaceSelect]);

  return <div className="travel-map" ref={mapElement} aria-label="여행 장소와 경로 지도" />;
}
