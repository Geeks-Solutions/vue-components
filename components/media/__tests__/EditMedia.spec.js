import { shallowMount } from "@vue/test-utils";
import EditMedia from "../EditMedia.vue";

describe('EditMedia', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(EditMedia, {
      mocks: {
        ...global.mocks,
        $t: jest.fn((key) => key),
        mediaHeader: jest.fn(({ token }, projectId) => ({
          Authorization: `Bearer ${token}`,
          'Project-ID': projectId,
        })),
        localePath: jest.fn()
      },
      data() {
        return {
          showPopupCode: true,
          popupContent: {
            content: [
              { id: 1, name: 'Content 1' },
              { id: 2, name: 'Content 2' }
            ],
            author: 'Author Name'
          }
        }
      },
      propsData: {
        contentUsedKey: 'name',
        mediaTranslationPrefix: 'mediaT.'
      }
    })
  })

  it('does not display "undefined" in content-used div', async () => {

    wrapper.setData({
      showPopupCode: true,
      popupContent: {
        content: [
          { id: 1, name: 'Content 1' },
          { id: 2, name: 'Content 2' }
        ],
        author: 'Author Name'
      }
    })

    await wrapper.vm.$nextTick()

    const contentUsedDivs = wrapper.findAll('.content-used')
    contentUsedDivs.wrappers.forEach(div => {
      expect(div.exists()).toBe(true);
      expect(div.text()).not.toContain('undefined')
    })
  })
})