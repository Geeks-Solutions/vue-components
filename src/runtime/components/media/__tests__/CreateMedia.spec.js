import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import CreateMedia from '../CreateMedia.vue'
import * as medias from '../medias'
import * as constants from '../../../utils/constants.js'

import { createI18n } from 'vue-i18n'
import { nextTick } from '#imports'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {},
    fr: {},
  },
})

describe('CreateMedia', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(CreateMedia, {
      global: {
        plugins: [i18n],
        stubs: {
          LazyGHeaderContainer: true,
          LazyGButtons: true,
          LazyGAlertPopup: true,
          LazyGAnimatedLoading: true,
        },
        config: {
          globalProperties: {
            $t: vi.fn((key) => key),
            mediaHeader: vi.fn(({ token }, projectId) => ({
              Authorization: `Bearer ${token}`,
              'Project-ID': projectId,
            })),
            localePath: vi.fn(),
            useRoute: () => ({
              params: { pathMatch: [] },
              query: {},
            }),
          },
        },
      },
      data() {
        return {}
      },
      propsData: {
        acceptedFileTypes: '.jpg, .jpeg, .png, .webp, .gif, .svg, .json, .lottie, .pdf, .css, .js',
        mediaTranslationPrefix: 'mediaT.',
      },
    })
  })

  it('should show toast and stop if file type is not supported', async () => {
    const unsupportedFile = new File(['dummy content'], 'test.xslx', { type: 'application/pdf' })

    const showToastSpy = vi.spyOn(medias, 'showToast')
    const isFileTypeSupportedSpy = vi.spyOn(constants, 'isFileTypeSupported')

    const e = { dataTransfer: { files: [unsupportedFile] } }
    // Call the function with mocks

    await wrapper.vm.onFileSelected(e)

    expect(isFileTypeSupportedSpy).toHaveBeenCalledWith(
      unsupportedFile,
      '.jpg, .jpeg, .png, .webp, .gif, .svg, .json, .pdf, .css, .js'
    )

    expect(showToastSpy).toHaveBeenCalledWith('Error', 'error', 'mediaT.unsupportedFileType')
  })

  it('should proceed and not show a toast message if acceptedFileTypes prop is not provided', async () => {
    await wrapper.setProps({
      acceptedFileTypes: '',
    })

    const unsupportedFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' })

    const showToastSpy = vi.spyOn(medias, 'showToast')
    const isFileTypeSupportedSpy = vi.spyOn(constants, 'isFileTypeSupported')

    const e = { dataTransfer: { files: [unsupportedFile] } }
    // Call the function with mocks

    await wrapper.vm.onFileSelected(e)

    expect(isFileTypeSupportedSpy).not.toHaveBeenCalled()

    expect(showToastSpy).not.toHaveBeenCalled()
  })

  it('falls back to useFetch and API works if forwardRequest is not provided', async () => {
    const file = new Blob(['test'], { type: 'image/png' })
    Object.defineProperty(file, 'name', { value: 'test.png' })

    const fileInput = {
      dataTransfer: { files: [file] },
    }

    const forwardSpy = vi.fn()
    wrapper.setProps({ forwardRequest: forwardSpy })
    wrapper.setProps({ forwardRequest: null })

    await wrapper.vm.onFileSelected(fileInput)

    // Assert
    expect(forwardSpy).not.toHaveBeenCalled()
  })

  it('should set metadata type to dotlottie for .lottie files', async () => {
    const lottieFile = new Blob(['test'], { type: 'application/octet-stream' })
    Object.defineProperty(lottieFile, 'name', { value: 'test.lottie' })

    const isLottieAnimationSpy = vi.spyOn(medias, 'isLottieAnimation')

    const fileInput = {
      dataTransfer: { files: [lottieFile] },
    }

    wrapper.setProps({
      forwardRequest: vi.fn().mockResolvedValue({ data: { value: { id: '1' } } }),
      mediaByIdUri: '/api/media',
      authToken: 'test-token',
      projectId: 'test-project',
      responseReceived: vi.fn(),
      requestPreSent: vi.fn().mockResolvedValue({ proceed: true }),
    })

    await wrapper.vm.onFileSelected(fileInput)

    expect(isLottieAnimationSpy).not.toHaveBeenCalled()
  })

  it('should set metadata type to lottie for .json lottie files', async () => {
    const lottieJson = {
      v: '5.7.0',
      fr: 60,
      ip: 0,
      op: 180,
      w: 100,
      h: 100,
      layers: [],
    }
    const jsonFile = new Blob([JSON.stringify(lottieJson)], { type: 'application/json' })
    Object.defineProperty(jsonFile, 'name', { value: 'test.json' })

    const isLottieAnimationSpy = vi.spyOn(medias, 'isLottieAnimation').mockReturnValue(true)

    const fileInput = {
      dataTransfer: { files: [jsonFile] },
    }

    wrapper.setProps({
      forwardRequest: vi.fn().mockResolvedValue({ data: { value: { id: '1' } } }),
      mediaByIdUri: '/api/media',
      authToken: 'test-token',
      projectId: 'test-project',
      responseReceived: vi.fn(),
      requestPreSent: vi.fn().mockResolvedValue({ proceed: true }),
    })

    await wrapper.vm.onFileSelected(fileInput)

    expect(isLottieAnimationSpy).toHaveBeenCalledWith(lottieJson)
  })
})
