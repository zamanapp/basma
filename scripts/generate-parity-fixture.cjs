/**
 * Regenerates test/fixtures/avvvatars-parity.json by rendering the real
 * avvvatars-react and recording what it produces.
 *
 * React is deliberately NOT a devDependency of this package — it is needed only
 * to re-record the fixture, which should be rare. Run this from a scratch dir:
 *
 *   npm i react@17 react-dom@17 avvvatars-react goober
 *   node generate-parity-fixture.cjs
 *   cp parity.json <repo>/test/fixtures/avvvatars-parity.json
 *
 * Cases are chosen to cover all 20 palette keys, because TEXT_COLORS and
 * SHAPE_COLORS are identical for keys 10-19 and only diverge for keys 0-9 —
 * a fixture missing 0-9 cannot catch a text/shape colour mix-up.
 *
 * Never hand-edit the fixture: every field is derived from `value`, so editing
 * a value without re-recording silently corrupts the expectations.
 */

const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const Avvvatars = require('avvvatars-react').default;
const { extractCss } = require('goober');
const fs = require('fs');

function render(props) {
  const html = renderToStaticMarkup(React.createElement(Avvvatars, props));
  const css = extractCss();
  return { html, css };
}

function probe(value, displayValue) {
  const base = { value, size: 64 };
  if (displayValue !== undefined) base.displayValue = displayValue;

  const ch = render({ ...base, style: 'character' });
  const bg = /background-color:#([0-9A-Fa-f]{6})/.exec(ch.css)[1];
  const textColor = /font-size:(\d+)px;color:#([0-9A-Fa-f]{6})/.exec(ch.css);
  const fontSize = Number(textColor[1]);
  const initials = /<p[^>]*>([^<]*)<\/p>/.exec(ch.html)[1];

  const sh = render({ ...base, style: 'shape' });
  const shapeName = /name="(Shape\d+)"/.exec(sh.html)[1];
  const shapeColor = /vertical-align:middle;color:#([0-9A-Fa-f]{6})/.exec(sh.css)[1];
  const pathTag = /<path\s([^>]*)>/.exec(sh.html)[1];
  const d = /(?:^|\s)d="([^"]+)"/.exec(pathTag)[1];
  const evenOdd = /fill-rule="evenodd"/.test(pathTag);
  const shapeSize = Number(/<svg[^>]*width="(\d+)"/.exec(sh.html)[1]);

  return { value, displayValue, initials, background: bg, text: textColor[2],
           shapeColor, shapeName, shapeIndex: Number(shapeName.slice(5)), d, evenOdd, fontSize, shapeSize };
}

// Hunt for values covering every palette key 0-19, since TEXT/SHAPE colors
// only diverge for keys 0-9.
const BG = ['F7F9FC','EEEDFD','FFEBEE','FDEFE2','E7F9F3','EDEEFD','ECFAFE','F2FFD1','FFF7E0','FDF1F7','EAEFE6','E0E6EB','E4E2F3','E6DFEC','E2F4E8','E6EBEF','EBE6EF','E8DEF6','D8E8F3','ECE1FE'];
const byKey = new Map();
for (let i = 0; i < 4000 && byKey.size < 20; i++) {
  const v = `user${i}@example.com`;
  const r = probe(v);
  const k = BG.indexOf(r.background);
  if (!byKey.has(k)) byKey.set(k, r);
}
console.log('palette keys covered:', byKey.size, '/ 20');

const cases = [...byKey.values()];
// edge cases
for (const [v, dv] of [['a', undefined], ['', undefined], ['Ahmed Al-Fatah', undefined],
                       ['ada@example.com', undefined], ['x@y.z', 'ZZ'],
                       ['محمد', undefined], ['🙂🙃', undefined], ['x'.repeat(200), undefined]]) {
  try { cases.push(probe(v, dv)); } catch (e) { console.log('SKIP', JSON.stringify(v), e.message); }
}
const shapes = new Set(cases.map(c => c.shapeIndex));
console.log('cases:', cases.length, '| distinct shapes:', shapes.size);
fs.writeFileSync('parity.json', JSON.stringify(cases, null, 2));
