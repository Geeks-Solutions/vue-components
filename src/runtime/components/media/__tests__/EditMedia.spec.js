import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import EditMedia from '../EditMedia.vue'
import { createI18n } from 'vue-i18n'

// Explicitly mock modules to ensure reliable spying in script setup
// Paths must be relative to THIS test file.
// Component at src/runtime/components/media/EditMedia.vue
// Test at src/runtime/components/media/__tests__/EditMedia.spec.js
vi.mock('../medias.js', () => ({
  showToast: vi.fn(),
  isLottieAnimation: vi.fn(),
  mediaHeader: vi.fn(),
}))

vi.mock('../../../utils/constants.js', () => ({
  isFileTypeSupported: vi.fn(),
}))

import { showToast } from '../medias.js'
import { isFileTypeSupported } from '../../../utils/constants.js'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {},
  },
})

describe('EditMedia', () => {
  let wrapper
  const mockMedia = {
    id: '123',
    title: 'Test Media',
    seo_tag: 'test-tag',
    private_status: 'public',
    locked_status: 'unlocked',
    type: 'image',
    author: 'user1',
    files: [
      {
        url: 'test.jpg',
        filename: 'test.jpg',
        platform: { name: 'S3', width: 100, height: 100 },
        size: 1024,
      },
    ],
    meta: { author: 'user1', content: [] },
    metadata: { type: 'image' },
    creation_date: 1710000000,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = shallowMount(EditMedia, {
      global: {
        plugins: [i18n],
        stubs: {
          LazyGHeaderContainer: true,
          LazyGButtons: true,
          LazyGAlertPopup: true,
          LazyGAnimatedLoading: true,
          LazyGUniversalViewer: true,
        },
        config: {
          globalProperties: {
            $t: (key) => key,
          },
          mocks: {
            useLocalePath: (path) => path,
            useRoute: () => ({
              query: {},
              params: {},
            }),
            navigateTo: vi.fn(),
          },
        },
      },
      props: {
        mediaTranslationPrefix: 'mediaT.',
        sectionsUserIdProp: 'user1',
        mediaByIdResponseProp: mockMedia,
        mediaByIdUriProp: '/api/media/',
        nuxtSections: true,
        acceptedFileTypes: 'image/*',
      },
    })
  })

  it('mounts and initializes with media data', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.media.id).toBe('123')
  })

  it('updates headerItems when media changes', async () => {
    wrapper.vm.media = {
      ...mockMedia,
      id: '456',
      type: 'video',
    }

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.headerItems[0].value).toBe('456')
    expect(wrapper.vm.headerItems[3].value).toBe('Video')
  })

  describe('Computed Properties', () => {
    it('returns correct allowedPermission and statusAvailable', async () => {
      wrapper.vm.privateStatus = 'private'
      wrapper.vm.lockedStatus = 'locked'
      expect(wrapper.vm.allowedPermission).toBe('mediaT.previewOrEditMediaLabel')
      expect(wrapper.vm.statusAvailable).toBe('mediaT.privateAndLocked')
    })
  })

  describe('Locking Logic', () => {
    it('toggles lock status if user is author', () => {
      wrapper.vm.sectionsUserId = 'user1'
      wrapper.vm.media.author = 'user1'
      wrapper.vm.media.locked_status = 'unlocked'

      wrapper.vm.toggleLockStatus()
      expect(wrapper.vm.media.locked_status).toBe('locked')
    })
  })

  describe('File Selection', () => {
    it('shows toast for unsupported file types', async () => {
      isFileTypeSupported.mockReturnValue(false)

      const file = new File([''], 'test.pdf', { type: 'application/pdf' })
      const event = { target: { files: [file] } }

      wrapper.vm.onFileSelected(event)
      await wrapper.vm.$nextTick()

      expect(showToast).toHaveBeenCalledWith('Error', 'error', 'mediaT.unsupportedFileType')
    })

    it('updates file on valid selection', async () => {
      isFileTypeSupported.mockReturnValue(true)
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      const event = { target: { files: [file] } }

      wrapper.vm.onFileSelected(event)
      await wrapper.vm.$nextTick()

      // Use toStrictEqual for File objects or just check properties if Vitest serialization is tricky
      expect(wrapper.vm.file.name).toBe(file.name)
      expect(wrapper.vm.file.type).toBe(file.type)
    })
  })

  describe('Navigation', () => {
    it('emits updateMediaComponent on backClicked when no mediasPath', () => {
      wrapper.vm.backClicked()
      expect(wrapper.emitted().updateMediaComponent).toBeTruthy()
    })
  })

  describe('Download', () => {
    it('triggers download logic', () => {
      const createElementSpy = vi.spyOn(document, 'createElement')
      const clickSpy = vi.fn()
      createElementSpy.mockReturnValue({
        setAttribute: vi.fn(),
        click: clickSpy,
        remove: vi.fn(),
        href: '',
        target: '',
        style: {}, // Add minimal properties to avoid addEventListener or other errors if environment touches it
      })
      vi.spyOn(document.body, 'appendChild').mockImplementation(() => ({}))
      window.URL.revokeObjectURL = vi.fn()

      wrapper.vm.downloadMedia()
      expect(createElementSpy).toHaveBeenCalledWith('a')
      expect(clickSpy).toHaveBeenCalled()

      createElementSpy.mockRestore()
    })
  })
})
