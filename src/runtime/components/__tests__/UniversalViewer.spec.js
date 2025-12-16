import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import UniversalViewer from '../UniversalViewer.vue'

// Mock NuxtImg since it's a Nuxt component
const NuxtImg = {
  template: '<img :src="src" />',
  props: ['src'],
}

// Mock LazyGLottieAnimation
const LazyGLottieAnimation = {
  template: '<div class="lottie"></div>',
}

describe('UniversalViewer', () => {
  const defaultProps = {
    type: 'image',
    src: 'https://example.com/image.jpg',
  }

  const globalComponents = {
    NuxtImg,
    LazyGLottieAnimation,
  }

  it('renders correctly with default props', () => {
    const wrapper = mount(UniversalViewer, {
      props: defaultProps,
      global: {
        components: globalComponents,
      },
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(defaultProps.src)
  })

  it('uses transformer prop if provided', async () => {
    const transformedUrl = 'blob:transformed-url'
    const transformer = vi.fn().mockResolvedValue(transformedUrl)

    const wrapper = mount(UniversalViewer, {
      props: {
        ...defaultProps,
        transformer,
      },
      global: {
        components: globalComponents,
      },
    })

    // Wait for transformer to be called and promise to resolve
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(transformer).toHaveBeenCalledWith(defaultProps.src)
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe(transformedUrl)
  })

  it('uses injected transformer if prop is not provided', async () => {
    const transformedUrl = 'blob:injected-url'
    const transformer = vi.fn().mockResolvedValue(transformedUrl)

    const wrapper = mount(UniversalViewer, {
      props: defaultProps,
      global: {
        components: globalComponents,
        provide: {
          [Symbol.for('mediaURLTransformer')]: transformer,
        },
      },
    })

    // Wait for transformer to be called and promise to resolve
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(transformer).toHaveBeenCalledWith(defaultProps.src)
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe(transformedUrl)
  })

  it('prioritizes prop transformer over injected one', async () => {
    const propUrl = 'blob:prop-url'
    const injectedUrl = 'blob:injected-url'
    const propTransformer = vi.fn().mockResolvedValue(propUrl)
    const injectedTransformer = vi.fn().mockResolvedValue(injectedUrl)

    const wrapper = mount(UniversalViewer, {
      props: {
        ...defaultProps,
        transformer: propTransformer,
      },
      global: {
        components: globalComponents,
        provide: {
          [Symbol.for('mediaURLTransformer')]: injectedTransformer,
        },
      },
    })

    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(propTransformer).toHaveBeenCalled()
    expect(injectedTransformer).not.toHaveBeenCalled()
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe(propUrl)
  })

  it('falls back to original src if no transformer is present', async () => {
    const wrapper = mount(UniversalViewer, {
      props: defaultProps,
      global: {
        components: globalComponents,
      },
    })

    await wrapper.vm.$nextTick()

    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe(defaultProps.src)
  })

  it('updates transformed url when src prop changes', async () => {
    const transformedUrl1 = 'blob:url-1'
    const transformedUrl2 = 'blob:url-2'
    const transformer = vi
      .fn()
      .mockResolvedValueOnce(transformedUrl1)
      .mockResolvedValueOnce(transformedUrl2)

    const wrapper = mount(UniversalViewer, {
      props: {
        ...defaultProps,
        transformer,
      },
      global: {
        components: globalComponents,
      },
    })

    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('img').attributes('src')).toBe(transformedUrl1)

    // Change src
    await wrapper.setProps({ src: 'https://example.com/new-image.jpg' })

    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    expect(transformer).toHaveBeenCalledTimes(2)
    expect(wrapper.find('img').attributes('src')).toBe(transformedUrl2)
  })
})
