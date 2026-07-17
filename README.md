<p align="center">
  <img src="./assets/logo.svg" alt="basma" width="120" height="120" />
</p>

<h1 align="center">basma</h1>

<p align="center">Beautifully crafted unique avatar placeholders for Vue 3.</p>

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

## Coming from avvvatars?

The same `value` gives you the same avatar you'd get from avvvatars, and every
prop works the same way — with one rename to know about:

- **Use `variant="shape"`, not `style="shape"`.** Vue treats `style` as a special
  attribute, so it can't be used as a prop name here. Everything else is identical.

Basma also ships with **zero runtime dependencies**, and you can drop as many
avatars on a page as you like without them clashing — a nice-to-have that the
original couldn't offer.

## License

MIT — see [LICENSE](./LICENSE).
