import { shallowMount } from "@vue/test-utils";
import EditBlog from "../EditBlog.vue";
import LocaleTranslations from '../LocaleTranslations.vue';
import Inputs from '@/components/Inputs.vue';
import wyzywig from '@/components/wysiwyg.vue';

jest.mock('vue-quill-editor', () => ({
  name: 'quill-editor',
  render: () => '<div class="wyzywig"></div>',
}));

describe('EditBlog', () => {
  let wrapper;
  const defaultProps = {
    article: {
      default_locale: 'en',
      title: 'Article Title',
      translations: [
        { locale: 'en', title: 'Title of the article', description: '', body: '' },
        { locale: 'fr', title: 'Titre de l\'article', description: '', body: '' },
        { locale: 'es', title: 'Título del artículo', description: '', body: '' },
      ],
    },
    projectLangs: [
      { key: 'en' },
      { key: 'fr' },
      { key: 'es' },
    ],
    selectedTranslationLang: '',
    langButtonSelectedStyle: 'bg-blue-500',
    langButtonStyle: 'bg-gray-500',
    blogsUri: 'https://api.example.com',
    blogId: 123,
    token: 'test-token',
    projectId: 'project-1',
    loading: false,
    showPopup: true
  };

  beforeEach(() => {
    wrapper = shallowMount(EditBlog, {
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
        Inputs,
        wyzywig
      }
    });
  });

  it('renders quill-editor', () => {
    expect(wrapper.find(wyzywig).exists()).toBe(true);
  });

  it('renders LocaleTranslations component correctly', async () => {
    const localeTranslations = wrapper.findComponent(LocaleTranslations);

    expect(localeTranslations.exists()).toBe(true);
    expect(localeTranslations.props().locales.length).toBe(2); // Excludes default locale 'en'
    expect(localeTranslations.props().selectedTranslationLang).toBe(defaultProps.selectedTranslationLang);
  });

  it('emits locale-clicked event when a locale is selected', async () => {
    const localeTranslations = wrapper.findComponent(LocaleTranslations);
    await localeTranslations.vm.$emit('locale-clicked', { key: 'fr' });

    // Check if selectedTranslationLang is updated correctly
    expect(wrapper.vm.selectedTranslationLang).toBe('fr');
  });

  it('renders and updates title, description, and body fields based on selectedTranslationLang', async () => {
    // Set selectedTranslationLang to 'fr'
    await wrapper.setData({ selectedTranslationLang: 'fr' });

    // Check that title translation input is rendered
    const titleInput = wrapper.find('#article-title-translation');
    expect(titleInput.exists()).toBe(true);
    expect(titleInput.props().inputModel).toBe(
        defaultProps.article.translations.find(t => t.locale === 'fr').title
    );

    // Check that description translation input is rendered
    const descriptionInput = wrapper.find('#article-description-translation');
    expect(descriptionInput.exists()).toBe(true);
    expect(descriptionInput.props().html).toBe(
        defaultProps.article.translations.find(t => t.locale === 'fr').description
    );

    // Check that body translation input is rendered
    const bodyInput = wrapper.find('#article-body-translation');
    expect(bodyInput.exists()).toBe(true);
    expect(bodyInput.props().html).toBe(
        defaultProps.article.translations.find(t => t.locale === 'fr').body
    );

    // Simulate user input for title, description, and body
    await titleInput.vm.$emit('input', 'Nouveau Titre');
    await descriptionInput.vm.$emit('settingsUpdate', 'Nouvelle description');
    await bodyInput.vm.$emit('settingsUpdate', 'Nouveau contenu du corps');

    // Check if the translations are updated correctly
    expect(wrapper.vm.article.translations.find(t => t.locale === 'fr').title).toBe('Nouveau Titre');
    expect(wrapper.vm.article.translations.find(t => t.locale === 'fr').description).toBe('Nouvelle description');
    expect(wrapper.vm.article.translations.find(t => t.locale === 'fr').body).toBe('Nouveau contenu du corps');
  });

  it('does not render translation field when selectedTranslationLang is not set', async () => {
    // Set selectedTranslationLang to an empty string
    await wrapper.setData({ selectedTranslationLang: '' });

    // Ensure that the title translation field is not rendered
    const titleInput = wrapper.find('#article-title-translation');
    expect(titleInput.exists()).toBe(false);

    // Ensure that the description translation field is not rendered
    const descriptionInput = wrapper.find('#article-description-translation');
    expect(descriptionInput.exists()).toBe(false);

    // Ensure that the body translation field is not rendered
    const bodyInput = wrapper.find('#article-body-translation');
    expect(bodyInput.exists()).toBe(false);
  });

  it('displays translation errors if they exist', async () => {
    const errors = {
      fr: { title: ['This title is required'] },
    };
    await wrapper.setData({ translationErrors: errors, selectedTranslationLang: 'fr' });

    const errorMessage = wrapper.find('.translation-error');
    expect(errorMessage.exists()).toBe(true);
    expect(errorMessage.text()).toBe('This title is required');
  });

  it('calls the save method correctly with the expected payload', async () => {
    // Mock successful response
    global.mocks.$axios.post.mockResolvedValueOnce({
      data: { id: 1, title: 'Updated Title', default_locale: 'fr', translations: [{ locale: 'en', title: 'Title of the article' },
          { locale: 'fr', title: 'Titre de l\'article' },
          { locale: 'es', title: 'Título del artículo' },] },
    })

    expect(global.mocks.$axios.post).toHaveBeenCalledWith(
        `any_articles`,
        {
          filters: [
            {
              key: 'published',
              value: 'true'
            }
          ]
        },
        expect.anything()
    )

  })

  it('calls the API to delete the blog and redirects on success', async () => {
    global.mocks.$axios.get.mockRejectedValueOnce({ response: { data: { message: '' } }});
    global.mocks.$axios.delete.mockResolvedValueOnce({ data: { message: 'Blog deleted successfully' } });

    await wrapper.setProps(
        {
          nuxtSections: false,
          isCreateBlog: true,
          blogsPath: '/blogs',
          appliedFilters: 'test',
        }
    )

    await wrapper.setData({
      blogsUri: 'https://api.example.com',
      blogId: 123,
      token: 'test-token',
      projectId: 'project-1',
      loading: false,
      showPopup: true });

    await wrapper.vm.deleteBlogByID();

    console.log('After calling deleteBlogByID');
    console.log('Mock Axios calls:', global.mocks.$axios.delete.mock.calls);

    expect(global.mocks.$axios.delete).toHaveBeenCalledWith(
        'https://api.example.com/articles/123',
        {
          headers: {
            token: 'test-token',
            'project-id-project-1': 'project-1',
          },
        }
    );

  });

  it('handles generic errors gracefully', async () => {
    global.mocks.$axios.delete.mockRejectedValueOnce({});

    await wrapper.vm.deleteBlogByID();

  });

  it('shows the publish button when conditions are met', async () => {

    await wrapper.setProps(
        {
          isCreateBlog: false,
          blogsUserRoleProp: 'publisher'
        }
    )

    await wrapper.setData({
      blogsUri: 'https://api.example.com',
      article: { published: false } });

    expect(wrapper.find('.publish-btn').exists()).toBe(true);
  });

  it('shows the publish button when user is admin and article is not published', async () => {
    await wrapper.setProps(
        {
          isCreateBlog: false,
          blogsUserRoleProp: 'admin'
        }
    )

    await wrapper.setData({
      blogsUri: 'https://api.example.com',
      article: { published: false } });

    expect(wrapper.find('.publish-btn').exists()).toBe(true);
  });


  it('does not show the publish button when isCreateBlog is true', async () => {
    await wrapper.setProps(
        {
          isCreateBlog: true,
          blogsUserRoleProp: 'publisher'
        }
    )

    await wrapper.setData({
      blogsUri: 'https://api.example.com',
      article: { published: false } });

    expect(wrapper.find('.publish-btn').exists()).toBe(false);
  });

  it('does not show the publish button when user is not a publisher or admin', async () => {
    await wrapper.setProps(
        {
          isCreateBlog: false,
          blogsUserRoleProp: 'author'
        }
    )

    await wrapper.setData({
      blogsUri: 'https://api.example.com',
      article: { published: false } });

    expect(wrapper.find('.publish-btn').exists()).toBe(false);
  });

  it('does not show the publish button when user is admin but article is already published', async () => {
    await wrapper.setProps(
        {
          isCreateBlog: false,
          blogsUserRoleProp: 'admin'
        }
    )

    await wrapper.setData({
      blogsUri: 'https://api.example.com',
      article: { published: true } });

    expect(wrapper.find('.publish-btn').exists()).toBe(false);
  });

  // it('matches the snapshot', () => {
  //   expect(wrapper.html()).toMatchSnapshot();
  // });
});