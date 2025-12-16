import { shallowMount } from '@vue/test-utils'
import EditMedia from '../EditMedia.vue'

import { createI18n } from 'vue-i18n'
import { ref, watch, nextTick } from '#imports'
import { expect, it, vi } from 'vitest'
import * as medias from '../medias.js'
import * as constants from '../../../utils/constants.js'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {},
    fr: {},
  },
})

describe('EditMedia', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(EditMedia, {
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
        return {
          showPopupCode: true,
          popupContent: {
            content: [
              { id: 1, name: 'Content 1' },
              { id: 2, name: 'Content 2' },
            ],
            author: 'Author Name',
          },
        }
      },
      propsData: {
        contentUsedKey: 'name',
        mediaTranslationPrefix: 'mediaT.',
        acceptedFileTypes: '.jpg, .png',
      },
    })
  })

  it('does not display "undefined" in content-used div', async () => {
    wrapper.vm.showPopupCode = true
    wrapper.vm.popupContent = {
      content: [
        { id: 1, name: 'Content 1' },
        { id: 2, name: 'Content 2' },
      ],
      author: 'Author Name',
    }

    await wrapper.vm.$nextTick()

    const contentUsedDivs = wrapper.findAll('.content-used')
    contentUsedDivs.forEach((div) => {
      expect(div.exists()).toBe(true)
      expect(div.text()).not.toContain('undefined')
    })
  })

  it('should update headerItems correctly when media changes', async () => {
    const media = ref({
      id: '',
      creation_date: null,
      inserted_at: 1680000000000, // ms timestamp
      meta: {
        author: '',
      },
      type: '',
      number_of_contents: 0,
    })

    const headerItems = ref([
      { label: 'ID', value: '' },
      { label: 'Date', value: '' },
      { label: 'Author', value: '' },
      { label: 'Type', value: '' },
      { label: 'Count', value: '' },
    ])

    // Watcher logic from your code
    watch(
      media,
      () => {
        if (Object.keys(media.value).length > 0) {
          headerItems.value[0].value = media.value.id
          headerItems.value[1].value = media.value.creation_date
            ? new Date(media.value.creation_date * 1000).toLocaleDateString()
            : new Date(media.value.inserted_at).toLocaleDateString()
          headerItems.value[2].value = media.value.meta.author
          headerItems.value[3].value =
            media.value.type[0].toUpperCase() + media.value.type.substring(1)
          headerItems.value[4].value = media.value.number_of_contents
        }
      },
      { deep: true }
    )

    // Update media to trigger the watcher
    media.value = {
      id: 'abc123',
      creation_date: 1710000000, // UNIX timestamp (sec)
      inserted_at: 1680000000000,
      meta: {
        author: 'Jane Doe',
      },
      type: 'video',
      number_of_contents: 42,
    }

    await nextTick() // Wait for Vue to update

    expect(headerItems.value[0].value).toBe('abc123')
    expect(headerItems.value[1].value).toBe(new Date(1710000000 * 1000).toLocaleDateString())
    expect(headerItems.value[2].value).toBe('Jane Doe')
    expect(headerItems.value[3].value).toBe('Video')
    expect(headerItems.value[4].value).toBe(42)
  })

  it('should show toast and stop if file type is not supported', async () => {
    const unsupportedFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' })

    const showToastSpy = vi.spyOn(medias, 'showToast')
    const isFileTypeSupportedSpy = vi.spyOn(constants, 'isFileTypeSupported')

    const e = { target: { files: [unsupportedFile] } }
    // Call the function with mocks

    await wrapper.vm.onFileSelected(e)

    expect(isFileTypeSupportedSpy).toHaveBeenCalledWith(unsupportedFile, '.jpg, .png')

    expect(showToastSpy).toHaveBeenCalledWith('Error', 'error', 'mediaT.unsupportedFileType')
  })

  it('should proceed and not show a toast message if acceptedFileTypes prop is not provided', async () => {
    await wrapper.setProps({
      acceptedFileTypes: '',
    })

    const unsupportedFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' })

    const showToastSpy = vi.spyOn(medias, 'showToast')
    const isFileTypeSupportedSpy = vi.spyOn(constants, 'isFileTypeSupported')

    const e = { target: { files: [unsupportedFile] } }
    // Call the function with mocks

    await wrapper.vm.onFileSelected(e)

    expect(isFileTypeSupportedSpy).not.toHaveBeenCalled()

    expect(showToastSpy).not.toHaveBeenCalled()
  })
})
