import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const html = await readFile(new URL('../docs/index.html', import.meta.url), 'utf8')
const cookieRunFont = await readFile(new URL('../docs/fonts/CookieRun-Bold.ttf', import.meta.url))
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

test('home brand uses the supplied CookieRun bold font', () => {
  assert.ok(cookieRunFont.length > 2_000_000)
  assert.match(html, /@font-face\{font-family:'CookieRun Black';src:url\('fonts\/CookieRun-Bold\.ttf'\)/)
  assert.match(html, /\.brand\{[^}]*font-family:'CookieRun Black'/)
  assert.match(html, /\.hero h1 em\{font-family:'CookieRun Black'/)
  assert.match(html, /font-style:normal;font-weight:900/)
})

test('location is requested only through the consent action', () => {
  assert.equal((html.match(/getCurrentPosition/g) ?? []).length, 1)
  assert.doesNotMatch(html, /watchPosition/)
  assert.match(html, /동의하고 위치 사용/)
  assert.match(html, /enableHighAccuracy:true,timeout:10000,maximumAge:300000/)
})

test('30 Busan attractions and at least two mapped nearby cafes each are bundled', () => {
  const placeBlock = html.match(/const places=\[([\s\S]*?)\]\.map\(p=>/)[1]
  const placeRows = new Function(`return [${placeBlock}]`)()
  const ids = placeRows.map((place) => place[0])
  const cafeLiteral = html.match(/const cafes=(\[[\s\S]*?\]);\s+const placeCafeIds=/)[1]
  const cafeRows = new Function(`return ${cafeLiteral}`)()
  const cafeMapLiteral = html.match(/const placeCafeIds=(\{[\s\S]*?\});/)[1]
  const cafeMap = new Function(`return ${cafeMapLiteral}`)()
  const cafesById = new Map(cafeRows.map((cafe) => [cafe.id, cafe]))
  const radians = (value) => value * Math.PI / 180
  const distanceKm = (place, cafe) => {
    const dLat = radians(cafe.lat - place[6])
    const dLng = radians(cafe.lng - place[7])
    const value = Math.sin(dLat / 2) ** 2 + Math.cos(radians(place[6])) * Math.cos(radians(cafe.lat)) * Math.sin(dLng / 2) ** 2
    return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value))
  }

  assert.equal(ids.length, 30)
  assert.equal(new Set(ids).size, 30)
  assert.deepEqual(Object.keys(cafeMap).sort(), [...ids].sort())
  for (const place of placeRows) {
    const cafeIds = cafeMap[place[0]]
    assert.ok(cafeIds.length >= 2, `${place[1]} needs at least two cafes`)
    assert.equal(new Set(cafeIds).size, cafeIds.length, `${place[1]} has duplicate cafe mappings`)
    for (const cafeId of cafeIds) {
      const cafe = cafesById.get(cafeId)
      assert.ok(cafe, `${place[1]} references missing cafe ${cafeId}`)
      assert.ok(distanceKm(place, cafe) <= 12, `${cafe.name} is not reasonably near ${place[1]}`)
    }
  }
  assert.match(html, /const nearbyCafesFor=/)
  assert.match(html, /const near=nearbyCafesFor\(p\)/)
})

test('all 30 places have translations and both photo-analysis prompt types', () => {
  const placeBlock = html.match(/const places=\[([\s\S]*?)\]\.map\(p=>/)[1]
  const placeRows = new Function(`return [${placeBlock}]`)()
  const ids = placeRows.map((place) => place[0])
  const addedLiteral = html.match(/const additionalPlaceRows=(\[[\s\S]*?\]);\s+const translationRows=/)[1]
  const addedTranslations = new Function(`return ${addedLiteral}`)()
  const visionLiteral = html.match(/const visionPrompts=(\{[\s\S]*?\});/)[1]
  const missionLiteral = html.match(/const missionVisionPrompts=(\{[\s\S]*?\});/)[1]
  const visionIds = Object.keys(new Function(`return ${visionLiteral}`)())
  const missionIds = Object.keys(new Function(`return ${missionLiteral}`)())

  assert.equal(addedTranslations.length, 17)
  assert.deepEqual(addedTranslations.map((row) => row[0][0]), placeRows.slice(13).map((place) => place[1]))
  assert.deepEqual(visionIds.sort(), [...ids].sort())
  assert.deepEqual(missionIds.sort(), [...ids].sort())
  assert.match(html, /등록된 30개 후보 간 상대 점수/)
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
  assert.match(html, /new MutationObserver\(\(\)=>\{translateTree\(document\.body\);decorateAiCourseLabels\(\)\}\)/)
  assert.match(html, /'accept-language':currentLocale/)
  assert.match(html, /header \.points\{display:inline-flex/)
})

test('header login gates points and opens a local top-ten ranking', () => {
  const seedLiteral = html.match(/const rankingSeed=(\[[\s\S]*?\]);\s+const currentAccount=/)[1]
  const seed = new Function(`return ${seedLiteral}`)()

  assert.equal(seed.length, 10)
  assert.match(html, /id="accountButton"[^>]*aria-haspopup="dialog"/)
  assert.match(html, /id="headerAccount">로그인<\/b>/)
  assert.doesNotMatch(html, /id="headerPoints"/)
  assert.match(html, /\.account-button\{width:78px;height:36px/)
  assert.match(html, /const accountStorageKey='eodissong:user'/)
  assert.match(html, /function updatePoints\(\).*currentAccount\(\)/)
  assert.match(html, /label\.innerHTML=`<span aria-hidden="true">✦<\/span> \$\{totalPoints\(\)\}P`/)
  assert.match(html, /accountButton\.onclick=\(\)=>currentAccount\(\)\?showRankingModal\(\):showLoginModal\(\)/)
  assert.match(html, /id="memberLogin"/)
  assert.match(html, /id="memberName"/)
  assert.match(html, /id="memberId"/)
  assert.match(html, /id="guestLogin"/)
  assert.match(html, /id="guestName"/)
  assert.doesNotMatch(html, /type="password"/)
  assert.match(html, /entries\.push\(\{id:`current-/)
  assert.match(html, /\.sort\(\(a,b\)=>b\.points-a\.points/)
  assert.match(html, /\.slice\(0,10\)/)
  assert.match(html, /const ranking=rankingEntries\(\),top=ranking\.slice\(0,3\),rest=ranking\.slice\(3,10\)/)
  assert.match(html, /ranking-bar-row rank-\$\{index\+1\}/)
  assert.match(html, /rank-1 \.ranking-bar\{width:100%;background:#d7aa16/)
  assert.match(html, /rank-2 \.ranking-bar\{width:86%;background:#aab3bf/)
  assert.match(html, /rank-3 \.ranking-bar\{width:72%;background:#985428/)
  assert.match(html, /포인트 랭킹 1위부터 3위까지 상품을 제공합니다\./)
})

test('home exposes AI mission and multi-stop course as steps 04 and 05', () => {
  assert.match(html, /04 · AI MISSION/)
  assert.match(html, /href="#\/explore">미션 지도 보기/)
  assert.match(html, /05 · AI COURSE/)
  assert.match(html, /href="#\/course">코스 설정 시작/)
})

test('nearby results distinguish the current location from recommended attractions', () => {
  assert.match(html, /<h1>내 주변 부산 여행 명소<\/h1>/)
  assert.doesNotMatch(html, /<h1>내 주변 부산 여행 미션<\/h1>/)
  assert.match(html, /<b>내 위치 · \$\{state\.location\.label\}<\/b>/)
  assert.match(html, /class="recommended-label">&lt;추천된 주변 명소&gt;/)
  assert.match(html, /class="map-marker \$\{extra\}"/)
  assert.match(html, /mapIcon\('●','user'\)/)
})

test('all map origins use the shared red starting pin', () => {
  assert.match(html, /\.map-marker\.user\{background:#e53935\}/)
  assert.match(html, /mapIcon\('●','user'\)/)
  assert.match(html, /mapIcon\('1','user'\)/)
  assert.ok((html.match(/mapIcon\('●','user'\)/g) ?? []).length >= 2)
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
  assert.match(html, /const registered=registeredCourseMatches\(query,target\);/)
  assert.doesNotMatch(html, /registeredCourseMatches\(query,target\)\[0\]/)
  assert.doesNotMatch(html, /if\(registered\)\{target==='final'\?setCourseDestination\(registered\):addCourseStopPoint\(registered\);return\}/)
  assert.match(html, /detailedGeocode\(query,12\)/)
  assert.match(html, /&lt;관광 명소&gt;/)
  assert.match(html, /&lt;추가 검색 결과&gt;/)
  assert.ok(html.indexOf('&lt;관광 명소&gt;') < html.indexOf('&lt;추가 검색 결과&gt;'))
  assert.match(html, /data-course-registered/)
  assert.match(html, /data-course-geocode/)
  assert.match(html, /\.course-address-results\{height:300px;[^}]*overflow-y:auto/)
  assert.match(html, /id="stopAddressResults"[^>]*aria-live="polite"/)
  assert.match(html, /id="finalAddressResults"[^>]*aria-live="polite"/)
  assert.match(html, /coursePointFromGeocode/)
  assert.match(html, /data-course-remove/)
  assert.match(html, /id="courseCafe" type="checkbox"/)
  assert.match(html, /roadCourseRoute\(state\.location,optimized\.stops\)/)
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

test('course result adds removable AI recommendations and numbers every stop', () => {
  assert.match(html, /function recommendAiCourseStop\(origin,waypoints,destination\)/)
  assert.match(html, /routeWaypoints\.push\(\{\.\.\.aiPlace,type:'ai',aiRecommended:true\}\)/)
  assert.match(html, /category:'AI 추천 카페',aiRecommended:true/)
  assert.match(html, /stop\.aiRecommended\?`<button class="course-ai-remove" data-ai-remove="\$\{index\}"/)
  assert.match(html, /async function removeAiCourseRecommendation\(index\)/)
  assert.match(html, /roadCourseRoute\(origin,remaining\)/)
  assert.match(html, /<li><span>1<\/span><div><b>\$\{escapeHtml\(origin\.label\)\}/)
  assert.match(html, /<span>\$\{index\+2\}<\/span>/)
  assert.match(html, /\$\{stop\.type==='cafe'\?' ☕':''\}<\/b>/)
  assert.match(html, /stop\.aiRecommended\?' · AI 추천':''/)
  assert.match(html, /function decorateAiCourseLabels\(\)/)
  assert.match(html, /\.course-ai-remove:not\(\[data-ai-labeled\]\)/)
  assert.match(html, /label\.textContent=translateText\('AI 추천'\)/)
  assert.match(html, /button\.before\(label\)/)
  assert.match(html, /\.course-ai-label\{[^}]*font-size:12px;font-weight:900/)
})

test('course result exposes detailed per-leg guidance with previous and next navigation', () => {
  assert.match(html, /route\.legs\.length!==points\.length-1/)
  assert.match(html, /routeInstruction\(step,fromGuide,toGuide\)/)
  assert.match(html, /fromName,toName,distanceKm:leg\.distance\/1000/)
  assert.match(html, /\.flatMap\(step=>step\.geometry\?\.coordinates\|\|\[\]\)/)
  assert.doesNotMatch(html, /path:legPath\.length>1\?legPath:\[\{lat:from\.lat/)
  assert.match(html, /id="viewCourseDetails"[^>]*>상세 경로 보기<\/button>/)
  assert.match(html, /panel\.setAttribute\('role','region'\)/)
  assert.match(html, /panel\.setAttribute\('aria-label',translateText\('구간별 상세 경로'\)\)/)
  assert.ok(html.indexOf('id="viewCourseDetails"') < html.indexOf('id="resetCourse"'))
  assert.match(html, /function bindCourseLegDetails\(result\)/)
  assert.match(html, /type="button" id="previousCourseLeg" aria-label="이전 구간"/)
  assert.match(html, /type="button" id="nextCourseLeg" aria-label="다음 구간"/)
  assert.match(html, /currentIndex===0\?'disabled':''/)
  assert.match(html, /currentIndex===legs\.length-1\?'disabled':''/)
  assert.match(html, /show\(currentIndex-1,'previous'\)/)
  assert.match(html, /show\(currentIndex\+1,'next'\)/)
  assert.match(html, /currentIndex=Math\.max\(0,Math\.min\(index,legs\.length-1\)\)/)
  assert.match(html, /escapeHtml\(translateText\(step\)\)/)
  assert.match(html, /focusTarget\?\.focus\(\)/)
  assert.match(html, /leg\.path\.length>1/)
  assert.match(html, /\.course-detail-nav button\{width:44px;height:44px\}/)
})

test('course building shows timed progress and falls back when distance optimization is slow', () => {
  const recommendationSource = html.slice(html.indexOf('function fallbackCourseStops'), html.indexOf('function showCourseProgress'))
  assert.doesNotMatch(recommendationSource, /\bdistanceKm\(/)
  assert.match(recommendationSource, /\bdistance\(/)
  assert.match(html, /function showCourseProgress\(initialMessage=/)
  assert.match(html, /role="status" aria-live="polite"/)
  assert.match(html, /id="courseProgressMessage"/)
  assert.match(html, /id="courseProgressTime"/)
  assert.match(html, /setInterval\(\(\)=>\{const elapsed=/)
  assert.match(html, /progress\.update\('실제 도로 거리를 비교하고 있어요\.'\)/)
  assert.match(html, /await new Promise\(resolve=>setTimeout\(resolve,0\)\)/)
  assert.match(html, /progress\.update\(optimized\.fallback\?'/)
  assert.match(html, /finally\{progress\.stop\(\)\}/)
  assert.match(html, /function fallbackCourseStops\(origin,waypoints,destination\)/)
  assert.match(html, /catch\{return\{stops:fallbackCourseStops\(origin,waypoints,destination\),fallback:true\}\}/)
  assert.match(html, /for\(let attempt=0;attempt<2;attempt\+\+\)/)
})

test('course builder can reset every configured course point', () => {
  assert.match(html, /class="origin-title">길찾기 출발지/)
  assert.match(html, /\.origin-editor>\.origin-title\{[^}]*font-size:15px/)
  assert.match(html, /id="resetCourseSettings">설정 코스 초기화/)
  assert.match(html, /function resetCourseSettings\(\)\{sessionStorage\.removeItem\('eodissong:location'\);state\.location=null;state\.courseStops=\[\];state\.courseDestination=null;state\.courseCafe=false;state\.courseResult=null;state\.courseMessage='';renderCourse\(\)\}/)
  assert.match(html, /document\.querySelector\('#resetCourseSettings'\)\.onclick=resetCourseSettings/)
  assert.doesNotMatch(html, /if\(!state\.location\)\{app\.innerHTML=.*bindOriginEditor\('course'\);return\}/)
  assert.match(html, /id="buildCourse" \$\{state\.location&&state\.courseDestination\?'':'disabled'\}/)
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

test('route estimates and both image-analysis flows disclose timing uncertainty', () => {
  const courseSource = html.slice(html.indexOf('function renderCourseResult'), html.indexOf('async function renderDirections'))
  const directionsSource = html.slice(html.indexOf('async function renderDirections'), html.indexOf('const baseDirectionsRenderer'))
  const homeSource = html.slice(html.indexOf('function renderHome'), html.indexOf('function showMissionResetModal'))
  const missionSource = html.slice(html.indexOf('function showMission(p,map)'), html.indexOf('async function reviewMissionPhoto'))

  assert.match(courseSource, /이는 예상 시간이며, 실제와 맞지 않을수도 있습니다/)
  assert.match(directionsSource, /이는 예상 시간이며, 실제와 맞지 않을수도 있습니다/)
  assert.match(homeSource, /사진 분석에는 일정 시간이 소요됩니다/)
  assert.match(missionSource, /사진 분석에는 일정 시간이 소요됩니다/)
  assert.match(html, /id="missionReviewMessage"/)
  assert.match(html, /querySelector\('#missionReviewMessage'\)/)
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
