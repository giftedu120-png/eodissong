import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const homeSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

test("photo analysis result uses a full document link to place detail", () => {
  assert.match(homeSource, /<a className="text-link" href=\{`\/place\/\$\{vision\.place\.id\}`\}>/);
});

test("name search results use full document links to place detail", () => {
  assert.match(homeSource, /<a className="place-row" href=\{`\/place\/\$\{place\.id\}`\}>/);
});

test("the affected detail routes are implemented by the dynamic place page", async () => {
  const detailSource = await readFile(new URL("../app/place/[id]/page.tsx", import.meta.url), "utf8");
  assert.match(detailSource, /mockTravelProvider\.getPlace\(params\.id\)/);
});
