import randomNumber from './lib/random'
import { BACKGROUND_COLORS, TEXT_COLORS, SHAPE_COLORS } from './lib/colors'
import { SHAPES, SHAPE_VIEWBOX, type ShapeData } from './lib/shapes'

export type BasmaVariant = 'character' | 'shape'

export interface Basma {
  /** First two characters of displayValue (falling back to value), uppercased at render time. */
  initials: string
  backgroundColor: string
  textColor: string
  shapeColor: string
  shape: ShapeData
  viewBox: string
}

/**
 * Derive a stable appearance from an identity string.
 *
 * The seed is always `value`, never `displayValue` — so changing the label a
 * user sees never changes the avatar they are recognised by.
 *
 * Palette and shape selection match avvvatars exactly: the same `value` yields
 * the same avatar here as it does there.
 */
export function generate(value: string, displayValue?: string): Basma {
  const name = String(displayValue || value).substring(0, 2)

  // 20 colors per palette, so generate 0-19.
  const key = randomNumber({ value, min: 0, max: 19 })
  // 60 shapes, addressed 1-60 upstream; our array is 0-indexed.
  const shapeKey = randomNumber({ value, min: 1, max: 60 })

  return {
    initials: name,
    backgroundColor: `#${BACKGROUND_COLORS[key]}`,
    textColor: `#${TEXT_COLORS[key]}`,
    shapeColor: `#${SHAPE_COLORS[key]}`,
    shape: SHAPES[shapeKey - 1],
    viewBox: SHAPE_VIEWBOX,
  }
}

/** Character size relative to the avatar, matching avvvatars' 37% ratio. */
export function fontSizeFor(size: number): number {
  return Math.round((size / 100) * 37)
}

/** Shape size relative to the avatar, matching avvvatars' 50% ratio. */
export function shapeSizeFor(size: number): number {
  return Math.round((size / 100) * 50)
}
