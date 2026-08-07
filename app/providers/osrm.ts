import type { AsyncRoutingProvider, Coordinates, Place, RouteResult, RoutingProvider, UserLocation } from "./types";

interface OsrmStep {
  distance: number;
  name: string;
  maneuver: { type: string; modifier?: string };
}

interface OsrmRoute {
  distance: number;
  duration: number;
  geometry: { coordinates: [number, number][] };
  legs: { steps: OsrmStep[] }[];
}

interface OsrmResponse {
  code: string;
  routes?: OsrmRoute[];
}

const distanceLabel = (meters: number) => meters >= 1000 ? `${(meters / 1000).toFixed(1)}km` : `${Math.max(10, Math.round(meters / 10) * 10)}m`;

function instruction(step: OsrmStep, origin: UserLocation, destination: Place) {
  const road = step.name ? `${step.name}을(를)` : "도로를";
  const distance = distanceLabel(step.distance);
  const modifier = step.maneuver.modifier;
  if (step.maneuver.type === "depart") return `${origin.label}에서 출발해 ${road} 따라 ${distance} 이동`;
  if (step.maneuver.type === "arrive") return `${destination.name.ko} 도착`;
  if (step.maneuver.type === "roundabout" || step.maneuver.type === "rotary") return `회전교차로에서 ${road} 따라 ${distance} 이동`;
  if (modifier === "left" || modifier === "slight left" || modifier === "sharp left") return `${road} 향해 좌회전 후 ${distance} 이동`;
  if (modifier === "right" || modifier === "slight right" || modifier === "sharp right") return `${road} 향해 우회전 후 ${distance} 이동`;
  if (modifier === "uturn") return `유턴한 뒤 ${road} 따라 ${distance} 이동`;
  return `${road} 따라 ${distance} 이동`;
}

function routeSteps(route: OsrmRoute, origin: UserLocation, destination: Place) {
  const steps = route.legs.flatMap((leg) => leg.steps)
    .filter((step) => step.maneuver.type === "arrive" || step.distance >= 20)
    .map((step) => instruction(step, origin, destination));
  if (!steps.some((step) => step.includes("도착"))) steps.push(`${destination.name.ko} 도착`);
  return steps.length <= 12 ? steps : [...steps.slice(0, 11), steps.at(-1)!];
}

export function createOsrmRoutingProvider(facilityProvider: RoutingProvider): AsyncRoutingProvider {
  return {
    async getRoute(origin, destination, signal) {
      const from = `${origin.lng},${origin.lat}`;
      const to = `${destination.coordinates.lng},${destination.coordinates.lat}`;
      const url = `https://router.project-osrm.org/route/v1/driving/${from};${to}?overview=full&geometries=geojson&steps=true`;
      const response = await fetch(url, { signal, headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`경로 서버 응답 오류: ${response.status}`);
      const data = await response.json() as OsrmResponse;
      const roadRoute = data.routes?.[0];
      if (data.code !== "Ok" || !roadRoute || roadRoute.geometry.coordinates.length < 2) throw new Error("도로 경로를 찾지 못했습니다.");
      const path: Coordinates[] = roadRoute.geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));
      const facilities = facilityProvider.getRoute(origin, destination).facilities;
      const result: RouteResult = {
        origin,
        destination,
        distanceKm: roadRoute.distance / 1000,
        durationMinutes: Math.max(1, Math.round(roadRoute.duration / 60)),
        path,
        steps: routeSteps(roadRoute, origin, destination),
        facilities,
        source: "road-network",
      };
      return result;
    },
  };
}
