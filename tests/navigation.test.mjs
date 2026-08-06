import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const homeSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

test("photo analysis result uses a full document link to place detail", () => {
  assert.match(homeSource, /<a className="text-link" href=\{`\/place\/\$\{vision\.place\.id\}`\}>/);
  assert.match(homeSource, /<span className="result-arrow"/);
});

test("recommended and search result arrows are explicit place detail links", () => {
  assert.match(homeSource, /<a className="row-arrow" href=\{`\/place\/\$\{place\.id\}`\}/);
  assert.match(homeSource, /지금 많이 방문하는 장소/);
});

test("the affected detail routes are implemented by the dynamic place page", async () => {
  const detailSource = await readFile(new URL("../app/place/[id]/page.tsx", import.meta.url), "utf8");
  assert.match(detailSource, /mockTravelProvider\.getPlace\(params\.id\)/);
});
