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

test('location is requested only through the consent action', () => {
  assert.equal((html.match(/getCurrentPosition/g) ?? []).length, 1)
  assert.doesNotMatch(html, /watchPosition/)
  assert.match(html, /동의하고 위치 사용/)
  assert.match(html, /enableHighAccuracy:true,timeout:10000,maximumAge:300000/)
})

test('Busan seed data and nearby cafes are bundled', () => {
  const ids = [...html.matchAll(/^\s+\['([^']+)'/gm)].map((match) => match[1])
  assert.equal(ids.length, 13)
  assert.match(html, /const cafes=\[/)
  assert.match(html, /모모스커피 영도/)
  assert.match(html, /테라로사 커피 F1963/)
})
