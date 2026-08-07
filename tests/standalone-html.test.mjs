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
  assert.doesNotMatch(html, /id="missionNav"/)
  assert.match(html, /id="languageSelect"/)
  assert.match(html, /한국어\(Korean\)/)
  assert.match(html, /영어\(English\)/)
  assert.match(html, /일본어\(Japanese\)/)
  assert.match(html, /중국어\(Chinese\)/)
  assert.match(html, /대만어\(Taiwanese\)/)
  assert.match(html, /eodissong:locale/)
  assert.match(html, /new MutationObserver\(\(\)=>translateTree\(document\.body\)\)/)
  assert.match(html, /'accept-language':currentLocale/)
  assert.match(html, /header \.points\{display:inline-flex/)
})

test('home exposes AI mission and multi-stop course as steps 04 and 05', () => {
  assert.match(html, /04 · AI MISSION/)
  assert.match(html, /href="#\/explore">미션 지도 보기/)
  assert.match(html, /05 · AI COURSE/)
  assert.match(html, /href="#\/course">코스 설정 시작/)
})

test('nearby results distinguish the current location from recommended attractions', () => {
  assert.match(html, /<b>내 위치 · \$\{state\.location\.label\}<\/b>/)
  assert.match(html, /class="recommended-label">&lt;추천된 주변 명소&gt;/)
  assert.match(html, /class="map-marker \$\{extra\}"/)
  assert.match(html, /mapIcon\('●','user'\)/)
})

test('course builder separates waypoints and final destination with exact-address search', () => {
  assert.match(html, /else if\(view==='course'\)renderCourse\(\)/)
  assert.match(html, /bindOriginEditor\('course'\)/)
  assert.match(html, /courseDestination:null/)
  assert.match(html, /state\.courseStops\.push\(\{\.\.\.place\}\)/)
  assert.match(html, /id="stopAddressInput"/)
  assert.match(html, /id="finalAddressInput"/)
  assert.match(html, /bindCourseAddressSearch\('stop'\)/)
  assert.match(html, /bindCourseAddressSearch\('final'\)/)
  assert.doesNotMatch(html, /id="waypointSearch"/)
  assert.doesNotMatch(html, /id="finalSearch"/)
  assert.doesNotMatch(html, /bindCourseRegisteredSearch/)
  assert.doesNotMatch(html, /class="course-nearby"/)
  assert.match(html, /const registered=registeredCourseMatches\(query,target\)\[0\]/)
  assert.match(html, /coursePointFromGeocode/)
  assert.match(html, /data-course-remove/)
  assert.match(html, /id="courseCafe" type="checkbox"/)
  assert.match(html, /roadCourseRoute\(state\.location,optimizedStops\)/)
  assert.match(html, /route\/v1\/driving\/\$\{coordinates\}/)
})

test('course builder optimizes waypoint order by road distance and keeps final destination last', () => {
  assert.match(html, /table\/v1\/driving\/\$\{coordinates\}\?annotations=distance/)
  assert.match(html, /function optimalWaypointOrder/)
  assert.match(html, /async function optimizeCourseStops/)
  assert.match(html, /\.\.\.order\.map\(index=>waypoints\[index\]\),\{\.\.\.destination,type:'destination'\}/)
  assert.match(html, /최종 목적지는 마지막에 고정합니다/)
  assert.match(html, /destination-stop/)
})

test('shortest-order optimizer can reorder waypoints while preserving the fixed end', () => {
  const source = inlineScripts[0].match(/function optimalWaypointOrder[\s\S]*?return order}/)?.[0]
  assert.ok(source)
  const optimize = new Function(`${source};return optimalWaypointOrder`)()
  const matrix = [
    [0, 10, 1, 99],
    [10, 0, 1, 1],
    [1, 1, 0, 100],
    [99, 1, 100, 0],
  ]
  assert.deepEqual(optimize(matrix, 2), [1, 0])
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

test('mission photos require a 60 percent criteria match before awarding points', () => {
  assert.match(html, /id="startMissionAction">미션 수행/)
  assert.match(html, /const missionVisionPrompts=/)
  assert.match(html, /async function validateMissionPhoto/)
  assert.match(html, /result\.confidence>=0\.6/)
  assert.match(html, /미션에 더 맞는 사진을 찍어 주세요/)
  assert.match(html, /saveCompleted\(\[\.\.\.new Set/)
  assert.doesNotMatch(html, /input\.onchange=\(\)=>\{if\(!input\.files\?\.\[0\]\)return;const next=/)
})

test('mission popup closes cleanly and upload choices appear below the mission prompt', () => {
  assert.match(html, /id="closeMissionSheet" aria-label="미션 장소 팝업 닫기">×/)
  assert.match(html, /closeMissionSheet'\)\.onclick=\(\)=>\{document\.querySelector\('#missionSheet'\)\.innerHTML=''/)
  assert.match(html, /state\.cafeLayer\.remove\(\);state\.cafeLayer=null/)
  assert.match(html, /mission-upload-options mission-upload-inline/)
  assert.match(html, /<\/div>\$\{missionControl\}<div class="cafe-list">/)
  assert.match(html, /if\(state\.missionReview\?\.placeId!==p\.id\)return/)
})

test('mission reset requires confirmation, preserves points, and enforces 24 hours', () => {
  assert.match(html, /id="refreshLocation">⌖ 위치 새로 요청<\/button><button class="chip mission-reset-trigger" id="resetMissions">↻ 미션 초기화/)
  assert.match(html, /role="alertdialog"/)
  assert.match(html, /미션을 정말 초기화할까요\? 모은 포인트는 유지됩니다\. 24시간에 한 번만 할 수 있습니다/)
  assert.match(html, /class="confirm-yes" id="confirmMissionReset"/)
  assert.match(html, /class="confirm-no" id="cancelMissionReset">\$\{noLabel\}/)
  assert.match(html, /yesLabel=\{ko:'예',en:'Yes'/)
  assert.match(html, /noLabel=\{ko:'아니오',en:'No'/)
  assert.match(html, /const missionResetInterval=24\*60\*60\*1000/)
  assert.match(html, /eodissong:lastMissionReset/)
  assert.match(html, /const preservedPoints=totalPoints\(\);saveCompleted\(\[\]\);saveTotalPoints\(preservedPoints\)/)
  assert.match(html, /awardPoints\(p\.points\);\s+saveCompleted/)
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
