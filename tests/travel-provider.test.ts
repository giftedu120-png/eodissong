import test from "node:test";
import assert from "node:assert/strict";
import { distanceKm, mockTravelProvider, places } from "../app/providers/mock.ts";
import type { UserLocation } from "../app/providers/types.ts";

test("distanceKm returns a realistic Seoul-Busan distance", () => {
  const distance = distanceKm({ lat: 37.5665, lng: 126.9780 }, { lat: 35.1796, lng: 129.0756 });
  assert.ok(distance > 300 && distance < 350);
});

test("nearby places are sorted from the supplied real coordinate", () => {
  const nearby = mockTravelProvider.getNearby(35.1532, 129.1186);
  assert.equal(nearby[0].id, "gwangalli");
  assert.match(nearby[0].distance, /^0\.0km$/);
});

test("route keeps the origin and supplies all required facility kinds", () => {
  const origin: UserLocation = { lat: 35.16, lng: 129.12, label: "테스트 현재 위치", source: "geolocation" };
  const route = mockTravelProvider.getRoute(origin, places[0]);
  assert.deepEqual(route.origin, origin);
  assert.ok(route.distanceKm > 0);
  assert.ok(route.durationMinutes > 0);
  assert.deepEqual(new Set(route.facilities.map((facility) => facility.kind)), new Set(["toilet", "convenience", "cafe"]));
});

test("missions only reference seeded real places and are distance sorted", () => {
  const origin: UserLocation = { lat: 35.1796, lng: 129.0756, label: "부산", source: "manual" };
  const missions = mockTravelProvider.getMissions(origin);
  assert.ok(missions.length >= 10);
  assert.ok(missions.every((mission) => places.some((place) => place.id === mission.place.id)));
  assert.ok(missions.every((mission) => mission.distanceKm <= 80));
  assert.ok(missions.every((mission, index) => index === 0 || missions[index - 1].distanceKm <= mission.distanceKm));
});

test("nearby cafe recommendations use seeded real businesses and sort by place distance", () => {
  const allCafes = mockTravelProvider.getNearbyFacilities({ lat: 35.177106, lng: 129.114927 }, 30);
  const cafes = allCafes.slice(0, 6);
  assert.ok(allCafes.length >= 15);
  assert.equal(cafes.length, 6);
  assert.ok(cafes.every((cafe) => cafe.kind === "cafe" && cafe.address));
  assert.ok(cafes.every((cafe, index) => index === 0 || (cafes[index - 1].distanceKm ?? 0) <= (cafe.distanceKm ?? 0)));
  assert.equal(cafes[0].name, "테라로사 커피 F1963");
});
