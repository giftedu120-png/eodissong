import test from "node:test";
import assert from "node:assert/strict";
import { isBroadLocationQuery, nominatimGeocodingProvider } from "../app/providers/nominatim.ts";

test("broad city queries require a more precise Busan location", async () => {
  assert.equal(isBroadLocationQuery("부산 광역시"), true);
  assert.deepEqual(await nominatimGeocodingProvider.search("부산"), []);
});

test("Nominatim provider returns detailed coordinates and removes city-wide results", async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl = "";
  globalThis.fetch = async (input) => {
    requestedUrl = String(input);
    return new Response(JSON.stringify([
      { place_id: 1, lat: "35.1796", lon: "129.0756", display_name: "부산광역시", addresstype: "city" },
      { place_id: 2, lat: "35.1498", lon: "129.1130", display_name: "광안역, 수영구, 부산광역시", addresstype: "station" },
    ]), { status: 200, headers: { "Content-Type": "application/json" } });
  };
  try {
    const results = await nominatimGeocodingProvider.search("광안역 테스트");
    assert.match(requestedUrl, /countrycodes=kr/);
    assert.match(requestedUrl, /bounded=1/);
    assert.equal(results.length, 1);
    assert.equal(results[0].label, "광안역, 수영구, 부산광역시");
    assert.deepEqual(results[0].coordinates, { lat: 35.1498, lng: 129.113 });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
