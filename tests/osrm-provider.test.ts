import test from "node:test";
import assert from "node:assert/strict";
import { mockTravelProvider, places } from "../app/providers/mock.ts";
import { createOsrmRoutingProvider } from "../app/providers/osrm.ts";
import type { UserLocation } from "../app/providers/types.ts";

test("OSRM provider converts road-network GeoJSON into a route", async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl = "";
  globalThis.fetch = async (input) => {
    requestedUrl = String(input);
    return new Response(JSON.stringify({
      code: "Ok",
      routes: [{
        distance: 4200,
        duration: 720,
        geometry: { coordinates: [[129.1186, 35.1532], [129.13, 35.16], [129.1604, 35.1587]] },
        legs: [{ steps: [
          { distance: 1200, name: "광안해변로", maneuver: { type: "depart" } },
          { distance: 3000, name: "해운대해변로", maneuver: { type: "turn", modifier: "right" } },
          { distance: 0, name: "", maneuver: { type: "arrive" } },
        ] }],
      }],
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };

  try {
    const origin: UserLocation = { lat: 35.1532, lng: 129.1186, label: "광안리", source: "manual" };
    const route = await createOsrmRoutingProvider(mockTravelProvider).getRoute(origin, places[2]);
    assert.match(requestedUrl, /route\/v1\/driving/);
    assert.match(requestedUrl, /geometries=geojson/);
    assert.equal(route.source, "road-network");
    assert.equal(route.distanceKm, 4.2);
    assert.equal(route.durationMinutes, 12);
    assert.equal(route.path.length, 3);
    assert.deepEqual(route.path[1], { lat: 35.16, lng: 129.13 });
    assert.match(route.steps.at(-1) ?? "", /도착/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
