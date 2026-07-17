# basma

Beautifully crafted unique avatar placeholders for Vue 3.

> **بَسْمَة** — *a smile.*
> **بَصْمَة** — *a fingerprint.*
>
> One word in Latin letters; two in Arabic. The difference is whether you read it
> with a **sīn** (س) or a **ṣād** (ص). An avatar is both at once: a face, and a
> mark no one else has.

Give it a value, get a stable avatar: two characters or one of 60 shapes, on a
matched colour palette. The same value always produces the same avatar, and no
network request is ever made.

> ### Credit
>
> Basma is a Vue port of **[avvvatars](https://github.com/nusu/avvvatars)** by
> **[Nusu Alabuga](https://github.com/nusu)**. The generation algorithm, the
> colour palettes, and every one of the 60 shapes are his original work — this
> port contributes only the Vue rendering layer. If Basma is useful to you,
> [go star the original](https://github.com/nusu/avvvatars) and visit
> [avvvatars.com](https://avvvatars.com).
>
> Licensed MIT; the upstream licence is retained in [LICENSE.avvvatars](./LICENSE.avvvatars).

## Install

```bash
pnpm add @zamanapp/basma
```

Vue 3.3+ is a peer dependency.

## Usage

```vue
<script setup>
import Basma from '@zamanapp/basma'
</script>

<template>
  <Basma value="ada@example.com" />
  <Basma value="ada@example.com" variant="shape" :size="64" />
</template>
```

Or register it globally:

```js
import { BasmaPlugin } from '@zamanapp/basma'
app.use(BasmaPlugin)
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | *required* | The identity the avatar is derived from — a user id, email, or full name. |
| `displayValue` | `string` | — | Characters to show instead of `value`. Does not change the colour or shape. |
| `size` | `number` | `32` | Width and height in pixels. Text and shape scale with it. |
| `variant` | `'character' \| 'shape'` | `'character'` | Show two characters, or a shape. |
| `shadow` | `boolean` | `false` | Apply a subtle drop shadow. |
| `border` | `boolean` | `false` | Draw a border. |
| `borderSize` | `number` | `2` | Border width in pixels. Requires `border`. |
| `borderColor` | `string` | `'#fff'` | Border colour. Requires `border`. |
| `radius` | `number` | `size` | Corner radius in pixels. Defaults to a full circle. |

Because `value` seeds the avatar and `displayValue` does not, you can relabel a
user without changing the avatar they are recognised by.

## Headless use

The generator is exported separately if you want to render the avatar yourself:

```js
import { generate } from '@zamanapp/basma'

generate('ada@example.com')
// { initials, backgroundColor, textColor, shapeColor, shape: { d, evenOdd }, viewBox }
```

`SHAPES`, `SHAPE_VIEWBOX`, `BACKGROUND_COLORS`, `TEXT_COLORS` and `SHAPE_COLORS`
are exported too.

## Differences from avvvatars

Prop names and rendered output match avvvatars, with three deliberate exceptions:

- **`style` is called `variant`.** Vue's template compiler rewrites a `style`
  attribute into parsed CSS before a component receives it, so `style="shape"`
  would arrive as `{}`. The rename is forced, not a preference.
- **No CSS-in-JS.** avvvatars pulls in `goober`; Basma uses inline styles and
  ships zero runtime dependencies. The only casualty is upstream's
  `:hover { z-index: 3 }` rule, which had no observable effect.
- **No duplicate DOM ids.** 21 of the shapes carry a Figma-exported `<clipPath>`
  whose clip rect is exactly the 32×32 canvas — a no-op, since an outer `<svg>`
  already clips to its viewport. Upstream renders them anyway, so two avatars of
  the same shape on one page emit duplicate ids. Basma strips them.

A given `value` still produces the identical avatar in both libraries. This is
enforced by a test suite that asserts against output captured from the real
`avvvatars-react@0.4.2`, covering all 20 palette keys — see
[`test/parity.test.ts`](./test/parity.test.ts).

## License

MIT — see [LICENSE](./LICENSE).
