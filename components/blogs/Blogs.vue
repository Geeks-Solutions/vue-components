<template>
  <component :is="componentsPrefix + componentName" :dashboard-info="dashboardInfo" :content-used-key="contentUsedKey" :blogs-user-role-prop="blogsUserRoleProp" :blogs-uri-prop="blogsUriProp" :create-blog-uri-prop="createBlogUriProp" :authors-uri-prop="authorsUriProp" :categories-uri-prop="categoriesUriProp" :project-id-prop="projectIdProp" :auth-token="authToken" :author-id="authorId" :blogs-user-id-prop="blogsUserIdProp" :blogs-user-name-prop="blogsUserNameProp" :media-translation-prefix="mediaTranslationPrefix" :show-create-blog-button="showCreateBlogButton" :blogs-response-prop="blogsResponseProp" :blog-by-id-uri-prop="blogByIdUriProp" :blog-by-id-response-prop="blogByIdResponseProp" :blog-id-prop="blogId" :default-lang-prop="defaultLang" :create-blog-path="createBlogPath" :edit-blog-path="editBlogPath" :blogs-path="blogsPath" :bo-usage="boUsage" :categories="categories" :server-url="serverUrl" @updateBlogsComponent="onBlogsComponentUpdate" :with-select-blog-button="withSelectBlogButton" :nuxt-sections="nuxtSections" :is-create-blog="isCreateBlog" :blog-id-editing="blogIdEditing" :applied-filters="appliedFilters" @onBlogSelected="(blog) => $emit('getSelectedBlog', blog)"  />
</template>

<script>

import {mediaHeader} from "../media/medias";

export default {
  name: "Blogs",
  data() {
    return {
      componentName: 'BlogsListBlogs',
      blogId: '',
      defaultLang: '',
      authorId: '',
      isCreateBlog: false,
      appliedFilters: '',
      categoriesUri: '',
      categories: []
    }
  },
  props: {
    componentsPrefix: {
      type: String,
      default: ""
    },
    blogsUriProp: {
      type: String,
      default: ""
    },
    createBlogUriProp: {
      type: String,
      default: ""
    },
    blogByIdUriProp: {
      type: String,
      default: ""
    },
    authorsUriProp: {
      type: String,
      default: ""
    },
    categoriesUriProp: {
      type: String,
      default: ""
    },
    projectIdProp: {
      type: String,
      default: ""
    },
    authToken: {
      type: String,
      default: ""
    },
    serverUrl: {
      type: String,
      default: ""
    },
    blogsUserIdProp: {
      type: String,
      default: ""
    },
    blogsUserNameProp: {
      type: String,
      default: ""
    },
    blogsUserRoleProp: {
      type: String,
      default: ""
    },
    blogIdProp: {
      type: String,
      default: ""
    },
    defaultLangProp: {
      type: String,
      default: ""
    },
    mediaTranslationPrefix: {
      type: String,
      default: "mediaT."
    },
    createBlogPath: {
      type: String,
      default: ""
    },
    editBlogPath: {
      type: String,
      default: ""
    },
    blogsPath: {
      type: String,
      default: ""
    },
    showCreateBlogButton: {
      type: Boolean,
      default: false
    },
    blogsResponseProp: {
      type: Object,
      default() {
        return {}
      }
    },
    blogByIdResponseProp: {
      type: Object,
      default() {
        return {}
      }
    },
    boUsage: {
      type: Boolean,
      default: true
    },
    withSelectBlogButton: {
      type: Boolean,
      default: false
    },
    selectedBlog: {
      type: Object,
      default() {
        return {}
      }
    },
    nuxtSections: {
      type: Boolean,
      default: false
    },
    blogIdEditing: {
      type: String,
      default: ""
    },
    contentUsedKey: {
      type: String,
      default: ""
    },
    dashboardInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    isBlogsPath() {
      if (this.$route.params && this.$route.params.pathMatch) {
        return this.$route.params.pathMatch.includes('blogs')
      } else return false
    },
    isEditBlogPath() {
      if (this.$route.params && this.$route.params.pathMatch) {
        return this.$route.params.pathMatch.includes('EditBlog')
      } else return false
    },
    isCreateBlogPath() {
      if (this.$route.params && this.$route.params.pathMatch && this.$route.query.isCreateBlog === 'true') {
        return this.$route.params.pathMatch.includes('EditBlog')
      } else return false
    }
  },
  watch: {
    categoriesUriProp: {
      handler(val) {
        this.categoriesUri = val
        if (val && process.client) this.getCategories()
      },
      deep: true,
      immediate: true
    },
  },
  created() {
    if (this.isBlogsPath) {
      this.componentName = 'BlogsListBlogs'
    } else if (this.isCreateBlogPath) {
      this.isCreateBlog = true
      this.componentName = 'BlogsEditBlog'
    } else if (this.isEditBlogPath) {
      this.blogId = this.$route.query.id
      this.defaultLang = this.$route.query.defaultLang
      this.authorId = this.$route.query.userId
      this.componentName = 'BlogsEditBlog'
    }
    if (this.nuxtSections) {
      if (this.blogIdEditing && this.blogIdEditing !== '') {
        this.componentName = 'BlogsEditBlog'
        this.blogId = this.blogIdEditing
      }
    }
  },
  methods: {
    onBlogsComponentUpdate(component) {
      this.$emit('blogsComponentUpdated', component)
      this.componentName = component.name
      this.blogId = component.blogId
      this.defaultLang = component.defaultLang
      this.authorId = component.userId
      this.isCreateBlog = component.isCreateBlog
      this.appliedFilters = component.appliedFilters
    },
    async getCategories() {
      this.loading = true
      const token = this.authToken
      const response = await this.$axios.get(this.categoriesUri,
          {
            headers: mediaHeader({token}, this.projectIdProp)
          })

      response.data.data.forEach((category) => {
        this.categories.push(
            {
              key: category.id.toString(),
              translation: category.title
            }
        )
      })
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
