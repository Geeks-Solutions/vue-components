import { shallowMount } from "@vue/test-utils";
import ListBlogs from "../ListBlogs.vue";
import LocaleTranslations from '../LocaleTranslations.vue';
import Inputs from '@/components/Inputs.vue';

describe('ListBlogs', () => {
  let wrapper;
  const defaultProps = {
    selectedTranslationLang: '',
    blogsUri: 'https://api.example.com',
    blogId: 123,
    token: 'test-token',
    projectId: 'project-1',
    loading: false,
    showPopup: true
  };

  beforeEach(() => {
    wrapper = shallowMount(ListBlogs, {
      mocks: {
        ...global.mocks,
        mediaHeader: jest.fn(({ token }, projectId) => ({
          Authorization: `Bearer ${token}`,
          'Project-ID': projectId,
        })),
        localePath: jest.fn()
      },
      propsData: {
        nuxtSections: false,
        blogsPath: '/blogs',
        appliedFilters: { search: 'test' },
      },
      data() {
        return defaultProps
      },
      stubs: {
        'quill-editor': true,
        LocaleTranslations,
        Inputs
      }
    });
  });

  it('filters out original articles that have drafts', async () => {
    const mockResponse = {
      data: {
        data: [
          { id: 1, title: 'Original Article 1' },
          { id: 2, title: 'Draft of Article 1', draft_of: 1 },
          { id: 3, title: 'Original Article 2' },
          { id: 4, title: 'Standalone Article' }
        ],
        total: 4
      }
    }

    global.mocks.$axios.post.mockResolvedValue(mockResponse)

    await wrapper.vm.getAllBlogs()

    expect(global.mocks.$axios.post).toHaveBeenCalledWith(
        `any_articles`,
        expect.anything(),
        expect.anything()
    )

    expect(wrapper.vm.blogsResponse).toEqual([
      { id: 2, title: 'Draft of Article 1', draft_of: 1 },
      { id: 3, title: 'Original Article 2' },
      { id: 4, title: 'Standalone Article' }
    ])
  })

  it('calls openBlog when open-original-blog event is fired from Card component', async () => {
    const openBlogMock = jest.fn()
    wrapper.setMethods({ openBlog: openBlogMock })

    wrapper.findComponent({ name: 'Card' }).vm.$emit('open-original-blog')

    await wrapper.vm.$nextTick()

    expect(openBlogMock).toHaveBeenCalled()
  })

});