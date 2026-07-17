import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Basma from '../src/Basma.vue'
import { generate } from '../src/generate'

const VALUE = 'ada@example.com'

describe('Basma', () => {
  it('renders the first two characters by default', () => {
    const w = mount(Basma, { props: { value: VALUE } })
    expect(w.find('p').text()).toBe('ad')
    expect(w.find('svg').exists()).toBe(false)
  })

  it('renders a shape instead when variant="shape"', () => {
    const w = mount(Basma, { props: { value: VALUE, variant: 'shape' } })
    expect(w.find('p').exists()).toBe(false)
    expect(w.find('path').attributes('d')).toBe(generate(VALUE).shape.d)
  })

  it('is deterministic for a given value', () => {
    const a = mount(Basma, { props: { value: VALUE } }).html()
    const b = mount(Basma, { props: { value: VALUE } }).html()
    expect(a).toBe(b)
  })

  it('gives different values different avatars', () => {
    const a = generate('alice@example.com')
    const b = generate('bob@example.com')
    expect(a.backgroundColor === b.backgroundColor && a.shape.d === b.shape.d).toBe(false)
  })

  it('seeds from value, not displayValue', () => {
    const plain = generate(VALUE)
    const labelled = generate(VALUE, 'ZZ')
    expect(labelled.backgroundColor).toBe(plain.backgroundColor)
    expect(labelled.shape.d).toBe(plain.shape.d)
    expect(labelled.initials).toBe('ZZ')
  })

  it('scales text and shape with size', () => {
    const w = mount(Basma, { props: { value: VALUE, size: 100 } })
    expect(w.attributes('style')).toContain('width: 100px')
    expect(w.find('p').attributes('style')).toContain('font-size: 37px')

    const s = mount(Basma, { props: { value: VALUE, size: 100, variant: 'shape' } })
    expect(s.find('svg').attributes('width')).toBe('50')
  })

  it('defaults border-radius to a full circle but honours radius', () => {
    expect(mount(Basma, { props: { value: VALUE, size: 40 } }).attributes('style'))
      .toContain('border-radius: 40px')
    expect(mount(Basma, { props: { value: VALUE, size: 40, radius: 8 } }).attributes('style'))
      .toContain('border-radius: 8px')
  })

  it('applies border and shadow only when asked', () => {
    const plain = mount(Basma, { props: { value: VALUE } }).attributes('style')
    expect(plain).not.toContain('border:')
    expect(plain).not.toContain('box-shadow')

    const decorated = mount(Basma, {
      props: { value: VALUE, border: true, borderSize: 4, borderColor: '#000', shadow: true },
    }).attributes('style')
    expect(decorated).toContain('border: 4px solid #000')
    expect(decorated).toContain('box-shadow')
  })

  it('exposes an accessible label', () => {
    expect(mount(Basma, { props: { value: VALUE } }).attributes('aria-label')).toBe(VALUE)
    expect(mount(Basma, { props: { value: VALUE, displayValue: 'AF' } }).attributes('aria-label'))
      .toBe('AF')
  })

  it('emits no duplicate element ids, so many avatars can share a page', () => {
    const html = Array.from({ length: 3 }, (_, i) =>
      mount(Basma, { props: { value: `u${i}`, variant: 'shape' } }).html(),
    ).join('')
    expect(html).not.toContain('id=')
  })

  it('updates when value changes', async () => {
    const w = mount(Basma, { props: { value: 'alice@example.com' } })
    const before = w.attributes('style')
    await w.setProps({ value: 'bob@example.com' })
    expect(w.attributes('style')).not.toBe(before)
  })
})
