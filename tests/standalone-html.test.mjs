import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const html = await readFile(new URL('../docs/index.html', import.meta.url), 'utf8')
const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map((match) => match[1].trim())
  .filter(Boolean)

test('standalone page has valid inline JavaScript', () => {
  assert.equal(inlineScripts.length, 1)
  assert.doesNotThrow(() => new Function(inlineScripts[0]))
})

test('standalone page exposes all main hash routes and detailed result links', () => {
  assert.match(html, /#\/place\/\$\{p\.id\}/)
  assert.match(html, /#\/explore\/\$\{p\.id\}/)
  assert.match(html, /#\/directions\/\$\{p\.id\}/)
  assert.match(html, /지금 많이 방문하는 장소/)
  assert.match(html, /장소 상세보기/)
})

test('standalone page uses the Eodissong brand and complete supplied logo', () => {
  assert.match(html, /<title>어디쏭 \| 부산을 담다, 길을 찾다<\/title>/)
  assert.match(html, /class="hero-logo" src="eodissong-logo\.png"/)
  assert.match(html, /alt="광안대교와 바다를 품은 어디쏭 로고/)
  assert.doesNotMatch(html, /모먼트립/)
})

test('location is requested only through the consent action', () => {
  assert.equal((html.match(/getCurrentPosition/g) ?? []).length, 1)
  assert.doesNotMatch(html, /watchPosition/)
  assert.match(html, /동의하고 위치 사용/)
  assert.match(html, /enableHighAccuracy:true,timeout:10000,maximumAge:300000/)
})

test('Busan seed data and nearby cafes are bundled', () => {
  const placeBlock = html.match(/const places=\[([\s\S]*?)\]\.map\(p=>/)[1]
  const ids = [...placeBlock.matchAll(/^\s+\['([^']+)'/gm)].map((match) => match[1])
  assert.equal(ids.length, 13)
  assert.match(html, /const cafes=\[/)
  assert.match(html, /모모스커피 영도/)
  assert.match(html, /테라로사 커피 F1963/)
  assert.match(html, /할리스 광안해변점/)
  assert.match(html, /slice\(0,6\)/)
})

test('standalone header offers five persistent whole-page languages', () => {
  assert.match(html, /id="missionNav"/)
  assert.match(html, /id="languageSelect"/)
  assert.match(html, /한국어\(Korean\)/)
  assert.match(html, /영어\(English\)/)
  assert.match(html, /일본어\(Japanese\)/)
  assert.match(html, /중국어\(Chinese\)/)
  assert.match(html, /대만어\(Taiwanese\)/)
  assert.match(html, /eodissong:locale/)
  assert.match(html, /new MutationObserver\(\(\)=>translateTree\(document\.body\)\)/)
  assert.match(html, /'accept-language':currentLocale/)
})

test('standalone directions use road geometry and never draw the old straight-line route', () => {
  assert.match(html, /router\.project-osrm\.org\/route\/v1\/driving/)
  assert.match(html, /geometries=geojson&steps=true/)
  assert.match(html, /OpenStreetMap 도로망을 따른 자동차 경로/)
  assert.doesNotMatch(html, /L\.polyline\(\[\[state\.location\.lat/)
})

test('standalone mobile uploads provide separate camera and gallery inputs', () => {
  assert.match(html, /id="photoCamera" type="file" accept="image\/\*" capture="environment"/)
  assert.match(html, /id="photoFile" type="file" accept="image\/\*">/)
  assert.match(html, /id="missionCamera" type="file" accept="image\/\*" capture="environment"/)
  assert.match(html, /id="missionFile" type="file" accept="image\/\*">/)
})

test('standalone photo analysis ranks real image-dependent candidates in the browser', () => {
  assert.match(html, /@huggingface\/transformers@3\.8\.1/)
  assert.match(html, /zero-shot-image-classification/)
  assert.match(html, /Xenova\/clip-vit-base-patch32/)
  assert.match(html, /slice\(1,3\)\.map\(candidateDetails\)/)
  assert.match(html, /<details class="candidate">/)
  assert.match(html, /정확도 1위/)
  assert.doesNotMatch(html, /placeById\('gamcheon'\).*87% 일치/)
})

test('standalone directions can refresh consented GPS or select a precise address', () => {
  assert.match(html, /id="originCurrent">⌖ 현재 위치 사용/)
  assert.match(html, /id="originDetailSearch">상세 주소 검색/)
  assert.match(html, /nominatim\.openstreetmap\.org\/search/)
  assert.match(html, /부산 전체보다 동·도로명·역·건물명/)
})
