import { describe, it, expect } from 'vitest'
import { generate, fontSizeFor, shapeSizeFor } from '../src/generate'
import fixture from './fixtures/avvvatars-parity.json'

/**
 * The headline promise: a given `value` renders the same avatar here as it does
 * in avvvatars-react. These expectations were captured by rendering the real
 * avvvatars-react@0.4.2 — see scripts/generate-parity-fixture.cjs.
 *
 * Cases cover all 20 palette keys, which matters because TEXT_COLORS and
 * SHAPE_COLORS are identical for keys 10-19 and only diverge for keys 0-9.
 */
describe('parity with avvvatars-react@0.4.2', () => {
  it('covers every palette key', () => {
    expect(new Set(fixture.map(c => c.background)).size).toBe(20)
  })

  for (const c of fixture) {
    it(`matches for ${JSON.stringify(c.value).slice(0, 40)}`, () => {
      const got = generate(c.value, c.displayValue)

      expect(got.initials).toBe(c.initials)
      expect(got.backgroundColor).toBe(`#${c.background}`)
      expect(got.textColor).toBe(`#${c.text}`)
      expect(got.shapeColor).toBe(`#${c.shapeColor}`)
      expect(got.shape.d).toBe(c.d)
      expect(got.shape.evenOdd ?? false).toBe(c.evenOdd)
      expect(fontSizeFor(64)).toBe(c.fontSize)
      expect(shapeSizeFor(64)).toBe(c.shapeSize)
    })
  }
})
