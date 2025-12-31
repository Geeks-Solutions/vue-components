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

  describe('Change Tracking', () => {
    const createTestMedia = (overrides = {}) => ({
      id: '123',
      title: 'Test Media',
      seo_tag: 'test-tag',
      private_status: 'public',
      locked_status: 'unlocked',
      type: 'image',
      author: 'test-user',
      files: [
        {
          url: 'test.jpg',
          filename: 'test.jpg',
          platform: { name: 'S3', width: 100, height: 100 },
          size: 1024,
        },
      ],
      meta: { author: 'test-user', content: [] },
      metadata: { type: 'image' },
      creation_date: 1710000000,
      ...overrides,
    })

    it('should return false for isChanged when no changes have been made', async () => {
      const testMedia = createTestMedia()
      wrapper.vm.initialMedia = { ...testMedia }
      wrapper.vm.media = { ...testMedia }
      wrapper.vm.file = null

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.isChanged).toBe(false)
    })

    it('should return true for isChanged when title has been changed', async () => {
      wrapper.vm.initialMedia = createTestMedia()
      wrapper.vm.media = createTestMedia({ title: 'Modified Title' })
      wrapper.vm.file = null

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.isChanged).toBe(true)
    })

    it('should return true for isChanged when a new file has been selected', async () => {
      const testMedia = createTestMedia()
      wrapper.vm.initialMedia = { ...testMedia }
      wrapper.vm.media = { ...testMedia }
      wrapper.vm.file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' })

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.isChanged).toBe(true)
    })

    it('should return false for isChanged when initialMedia is null', async () => {
      wrapper.vm.initialMedia = null
      wrapper.vm.file = null

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.isChanged).toBe(false)
    })
  })

  describe('Revert Changes', () => {
    const createTestMedia = (overrides = {}) => ({
      id: '123',
      title: 'Original Title',
      seo_tag: 'original-tag',
      private_status: 'public',
      locked_status: 'unlocked',
      type: 'image',
      author: 'test-user',
      files: [
        {
          url: 'test.jpg',
          filename: 'test.jpg',
          platform: { name: 'S3', width: 100, height: 100 },
          size: 1024,
        },
      ],
      meta: { author: 'test-user', content: [] },
      metadata: { type: 'image' },
      creation_date: 1710000000,
      ...overrides,
    })

    it('should reset media to initialMedia when revertChanges is called', async () => {
      wrapper.vm.initialMedia = createTestMedia()
      wrapper.vm.media = createTestMedia({
        title: 'Modified Title',
        seo_tag: 'modified-tag',
        private_status: 'private',
        locked_status: 'locked',
      })
      wrapper.vm.file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })

      await wrapper.vm.$nextTick()

      wrapper.vm.revertChanges()

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.media.title).toBe('Original Title')
      expect(wrapper.vm.media.seo_tag).toBe('original-tag')
      expect(wrapper.vm.media.private_status).toBe('public')
      expect(wrapper.vm.media.locked_status).toBe('unlocked')
      expect(wrapper.vm.file).toBeNull()
    })

    it('should not modify media when initialMedia is null', async () => {
      wrapper.vm.initialMedia = null
      const currentMedia = createTestMedia({ title: 'Current Title' })
      wrapper.vm.media = { ...currentMedia }

      await wrapper.vm.$nextTick()

      wrapper.vm.revertChanges()

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.media.title).toBe('Current Title')
    })

    it('should reset privateStatus and lockedStatus refs when revertChanges is called', async () => {
      wrapper.vm.initialMedia = createTestMedia()
      wrapper.vm.media = createTestMedia({
        title: 'Modified Title',
        private_status: 'private',
        locked_status: 'locked',
      })
      wrapper.vm.privateStatus = 'private'
      wrapper.vm.lockedStatus = 'locked'

      await wrapper.vm.$nextTick()

      wrapper.vm.revertChanges()

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.privateStatus).toBe('public')
      expect(wrapper.vm.lockedStatus).toBe('unlocked')
    })
  })
})
