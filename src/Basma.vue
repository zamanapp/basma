<script setup lang="ts">
import { computed } from 'vue'
import { generate, fontSizeFor, shapeSizeFor, type BasmaVariant } from './generate'

const props = withDefaults(
  defineProps<{
    /** Stable identity to seed the avatar: a user id, email, or full name. */
    value: string
    /** Characters to show instead of `value`. Does not affect colour or shape. */
    displayValue?: string
    size?: number
    /**
     * Named `variant` rather than `style` as in avvvatars: Vue's compiler
     * rewrites a `style` attribute into parsed CSS before a component sees it,
     * so `style="shape"` would arrive as `{}`.
     */
    variant?: BasmaVariant
    shadow?: boolean
    border?: boolean
    borderSize?: number
    borderColor?: string
    radius?: number
  }>(),
  {
    displayValue: undefined,
    size: 32,
    variant: 'character',
    shadow: false,
    border: false,
    borderSize: 2,
    borderColor: '#fff',
    radius: undefined,
  },
)

const avatar = computed(() => generate(props.value, props.displayValue))

const wrapperStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  borderRadius: `${props.radius ?? props.size}px`,
  backgroundColor: avatar.value.backgroundColor,
  border: props.border ? `${props.borderSize}px solid ${props.borderColor}` : undefined,
  boxShadow: props.shadow
    ? '0px 3px 8px rgba(18, 18, 18, 0.04), 0px 1px 1px rgba(18, 18, 18, 0.02)'
    : undefined,
  boxSizing: 'border-box' as const,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  userSelect: 'none' as const,
}))

const textStyle = computed(() => ({
  margin: 0,
  padding: 0,
  textAlign: 'center' as const,
  boxSizing: 'border-box' as const,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif',
  fontSize: `${fontSizeFor(props.size)}px`,
  color: avatar.value.textColor,
  lineHeight: 0,
  textTransform: 'uppercase' as const,
  fontWeight: 500,
}))

const shapeSize = computed(() => shapeSizeFor(props.size))
</script>

<template>
  <div role="img" :aria-label="displayValue || value" :style="wrapperStyle">
    <p v-if="variant === 'character'" :style="textStyle">{{ avatar.initials }}</p>
    <svg
      v-else
      :width="shapeSize"
      :height="shapeSize"
      :viewBox="avatar.viewBox"
      :style="{ color: avatar.shapeColor, display: 'block' }"
      fill="none"
      aria-hidden="true"
    >
      <path
        :d="avatar.shape.d"
        :fill-rule="avatar.shape.evenOdd ? 'evenodd' : undefined"
        fill="currentColor"
      />
    </svg>
  </div>
</template>
