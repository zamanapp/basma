import type { App, Plugin } from 'vue'
import Basma from './Basma.vue'

export { Basma }
export default Basma

export { generate, fontSizeFor, shapeSizeFor } from './generate'
export type { Basma as BasmaAppearance, BasmaVariant } from './generate'
export { SHAPES, SHAPE_VIEWBOX } from './lib/shapes'
export type { ShapeData } from './lib/shapes'
export { BACKGROUND_COLORS, TEXT_COLORS, SHAPE_COLORS } from './lib/colors'

/** Opt-in global registration: `app.use(BasmaPlugin)`. */
export const BasmaPlugin: Plugin = {
  install(app: App) {
    app.component('Basma', Basma)
  },
}
