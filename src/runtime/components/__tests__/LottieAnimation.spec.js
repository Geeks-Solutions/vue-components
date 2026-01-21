import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import LottieAnimation from '../LottieAnimation.client.vue'

describe('LottieAnimation', () => {
  let loadScriptMock

  beforeEach(() => {
    loadScriptMock = vi.fn().mockResolvedValue()
    window.lottie = {
      loadAnimation: vi.fn().mockReturnValue({
        play: vi.fn(),
        pause: vi.fn(),
        stop: vi.fn(),
        setSpeed: vi.fn(),
        destroy: vi.fn(),
      }),
    }

    const createMockPlayer = () => {
      const mockElement = document.createElement('div')
      mockElement.load = vi.fn()
      mockElement.play = vi.fn()
      mockElement.pause = vi.fn()
      mockElement.stop = vi.fn()
      mockElement.setSpeed = vi.fn()
      mockElement.destroy = vi.fn()
      return mockElement
    }

    window.DotLottiePlayer = vi.fn().mockImplementation(() => createMockPlayer())
  })

  afterEach(() => {
    delete window.lottie
    delete window.DotLottiePlayer
  })

  it('renders correctly with default props', () => {
    const wrapper = mount(LottieAnimation, {
      props: {
        src: 'https://example.com/animation.json',
        type: 'lottie',
      },
      global: {
        provide: {
          loadScript: loadScriptMock,
        },
      },
    })

    expect(wrapper.find('div').exists()).toBe(true)
  })

  it('loads bodymovin script for lottie type on mount', async () => {
    await mount(LottieAnimation, {
      props: {
        src: 'https://example.com/animation.json',
        type: 'lottie',
      },
      global: {
        provide: {
          loadScript: loadScriptMock,
        },
      },
    })

    expect(loadScriptMock).toHaveBeenCalledWith(
      'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.13.0/lottie.min.js',
      true
    )
  })

  it('loads dotlottie-player script for dotlottie type on mount', async () => {
    await mount(LottieAnimation, {
      props: {
        src: 'https://example.com/animation.lottie',
        type: 'dotlottie',
      },
      global: {
        provide: {
          loadScript: loadScriptMock,
        },
      },
    })

    expect(loadScriptMock).toHaveBeenCalledWith(
      'https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-player@4.0.1/dist/dotlottie-player.js',
      true
    )
  })

  it('initializes lottie animation for lottie type after script loads', async () => {
    await mount(LottieAnimation, {
      props: {
        src: 'https://example.com/animation.json',
        type: 'lottie',
      },
      global: {
        provide: {
          loadScript: loadScriptMock,
        },
      },
    })

    expect(window.lottie.loadAnimation).toHaveBeenCalled()
  })

  it('initializes dotlottie player for dotlottie type after script loads', async () => {
    await mount(LottieAnimation, {
      props: {
        src: 'https://example.com/animation.lottie',
        type: 'dotlottie',
      },
      global: {
        provide: {
          loadScript: loadScriptMock,
        },
      },
    })

    expect(window.DotLottiePlayer).toHaveBeenCalled()
  })

  it('exposes play, pause, stop, and setSpeed methods', async () => {
    const wrapper = await mount(LottieAnimation, {
      props: {
        src: 'https://example.com/animation.json',
        type: 'lottie',
      },
      global: {
        provide: {
          loadScript: loadScriptMock,
        },
      },
    })

    const mockAnimation = window.lottie.loadAnimation.mock.results[0].value

    wrapper.vm.play()
    expect(mockAnimation.play).toHaveBeenCalled()

    wrapper.vm.pause()
    expect(mockAnimation.pause).toHaveBeenCalled()

    wrapper.vm.stop()
    expect(mockAnimation.stop).toHaveBeenCalled()

    wrapper.vm.setSpeed(2)
    expect(mockAnimation.setSpeed).toHaveBeenCalledWith(2)
  })

  it('exposes play, pause, stop, and setSpeed methods for dotlottie type', async () => {
    const wrapper = await mount(LottieAnimation, {
      props: {
        src: 'https://example.com/animation.lottie',
        type: 'dotlottie',
      },
      global: {
        provide: {
          loadScript: loadScriptMock,
        },
      },
    })

    const mockPlayer = window.DotLottiePlayer.mock.results[0].value

    wrapper.vm.play()
    expect(mockPlayer.play).toHaveBeenCalled()

    wrapper.vm.pause()
    expect(mockPlayer.pause).toHaveBeenCalled()

    wrapper.vm.stop()
    expect(mockPlayer.stop).toHaveBeenCalled()

    wrapper.vm.setSpeed(1.5)
    expect(mockPlayer.setSpeed).toHaveBeenCalledWith(1.5)
  })

  it('reinitializes animation when src prop changes for lottie type', async () => {
    const wrapper = await mount(LottieAnimation, {
      props: {
        src: 'https://example.com/animation.json',
        type: 'lottie',
      },
      global: {
        provide: {
          loadScript: loadScriptMock,
        },
      },
    })

    const initialCallCount = window.lottie.loadAnimation.mock.calls.length

    await wrapper.setProps({ src: 'https://example.com/animation2.json' })

    expect(window.lottie.loadAnimation.mock.calls.length).toBeGreaterThan(initialCallCount)
  })

  it('reinitializes animation when src prop changes for dotlottie type', async () => {
    const wrapper = await mount(LottieAnimation, {
      props: {
        src: 'https://example.com/animation.lottie',
        type: 'dotlottie',
      },
      global: {
        provide: {
          loadScript: loadScriptMock,
        },
      },
    })

    const initialCallCount = window.DotLottiePlayer.mock.calls.length

    await wrapper.setProps({ src: 'https://example.com/animation2.lottie' })

    expect(window.DotLottiePlayer.mock.calls.length).toBeGreaterThan(initialCallCount)
  })

  it('cleans up animation on unmount for lottie type', async () => {
    const wrapper = await mount(LottieAnimation, {
      props: {
        src: 'https://example.com/animation.json',
        type: 'lottie',
      },
      global: {
        provide: {
          loadScript: loadScriptMock,
        },
      },
    })

    const mockAnimation = window.lottie.loadAnimation.mock.results[0].value

    wrapper.unmount()

    expect(mockAnimation.destroy).toHaveBeenCalled()
  })

  it('cleans up animation on unmount for dotlottie type', async () => {
    const wrapper = await mount(LottieAnimation, {
      props: {
        src: 'https://example.com/animation.lottie',
        type: 'dotlottie',
      },
      global: {
        provide: {
          loadScript: loadScriptMock,
        },
      },
    })

    const mockPlayer = window.DotLottiePlayer.mock.results[0].value

    wrapper.unmount()

    expect(mockPlayer.destroy).toHaveBeenCalled()
  })
})
