<template>
  <div class="mt-4" :class="nuxtSections ? 'ml-4' : ''">

    <div class="flex flex-row justify-end gap-4">
      <Buttons v-show="showCreateBlogButton === true && (blogsUserRoleProp.includes('admin') || blogsUserRoleProp.includes('author'))" :button-text="$t(mediaTranslationPrefix + 'blogs.createNew')" :button-style="createButtonsStyle" :with-icon="false" :submit-function="openCreateBlog" />
    </div>

    <div class="flex flex-col md:flex-row items-start md:items-start w-full justify-between md:pr-4 pl-2 md:pl-0">

      <div class="flex" :class="nuxtSections ? '' : 'md:pl-16'">
        <client-only>
          <MainFilter :filters-query="filtersQuery" :add-filter-label="$t(mediaTranslationPrefix + 'table.addFilter')" :clear-filters-label="$t(mediaTranslationPrefix + 'table.clearFilters')" :apply-filter-label="$t(mediaTranslationPrefix + 'table.applyFilters')" :filtered-values-style="'color: white; background: #03B1C7; padding: 5px 15px; margin: 15px 5px 0 0; border-radius: 10px; position: relative; display: flex; width: fit-content;'" :filter-icon-icomoon="'icon-filterIcon'" :filter-icon-style="''" :main-filter-style="'flex items-center pl-2 mr-6 ml-2 border border-FieldGray rounded-xl h-48px w-284px focus:outline-none'" :select-style="'h-35px w-220px ml-8'" :filter-select-default="$t(mediaTranslationPrefix + 'selectFilter')" :filter-by-text="$t(mediaTranslationPrefix + 'blogs.filterBlogs')" :clear-filters="filterClear" :sub-filter-style="'flex items-center pl-2 mr-6 ml-2 border border-FieldGray rounded-xl h-48px w-244px focus:outline-none'" :input-style="'py-4 pl-6 ml-2 pr-3.5 border border-FieldGray rounded-xl h-48px w-220px focus:outline-none'" :filter-options="filterOptions" :filter_map="filterMap" :emit-all="false" :alter-value="updateFilterValues" :main-filter-options="mainFilterOptions" :multi-select-placeholder="multiSelectPlaceholder" :single-select-filter-options="singleSelectFilterOptions" :multi-select-filter-options="multiSelectFilterOptions" @getFilter = "getFilter" @remove_filter="removeFilter" @clearFilters="clearFilters" @apply_filter="filterBlogs" />
        </client-only>
      </div>

    </div>

    <div>

      <div v-show="blogsResponse.length !== 0">
        <div class="flex justify-center md:justify-start text-FieldGray pt-2" :class="nuxtSections ? 'pl-4' : 'md:pl-16'">
          {{ blogsResponse.length + ` ${$t(mediaTranslationPrefix + 'of')} ` + totalBlogs + ` ${$t(mediaTranslationPrefix + 'blogs.blogs')} ` }}
        </div>

        <div class="py-8 flex flex-wrap" :class="nuxtSections ? '' : 'md:pl-16'">
          <div v-for="(blog, idx) in blogsResponse" :key="`blog--${blog.id}`" class="m-2">
            <Card :can-delete="(blogsUserRoleProp.includes('admin') || blogsUserRoleProp.includes('author'))" :description="blog.description" :edit-label="blogsUserRoleProp.includes('publisher') ? blog.published ? $t(mediaTranslationPrefix + 'blogs.unpublish') : $t(mediaTranslationPrefix + 'blogs.publish') : $t(mediaTranslationPrefix + 'blogs.editContent')" :published="blog.published" :draft-of="blog.draft_of ? $t(mediaTranslationPrefix + 'blogs.draftOf', {id: blog.draft_of}) : ''" :media-src="blog.medias && blog.medias[0] && blog.medias[0].files ? blog.medias[0].files[0].url : ''" :blog-title="blog.title && blog.title !== '' && blog.title !== 'null' ? blog.title : blog.medias && blog.medias[0] && blog.medias[0].files ? blog.medias[0].files[0].filename : ''" :blog-title-style="'w-200px overflow-hidden text-ellipsis white whitespace-nowrap'" :blog-author="getAuthorName(blog.author_id)" :is-author="blog.author_id === blogsUserId" :last-update-date="blog.updated ? $t(mediaTranslationPrefix + 'blogs.lastUpdateDate') + parseDate(blog.updated) : ''" :media-metadata-type="blog.medias?.[0]?.metadata?.type || 'image'" :can-open-blog="!canNotOpenBlog(blog)" :open-blog="() => {canNotOpenBlog(blog) ? null : openBlog(blog.id, blog.author_id, blog.default_locale)}" :edit-blog="() => {blogsUserRoleProp.includes('publisher') ? publishBlogByID(blog.id, blog.published, idx) : openBlog(blog.id, blog.author_id, blog.default_locale)}" @delete-blog="blogId = blog.id; showPopup = true" @open-original-blog="openBlog(blog.draft_of, blog.author_id, blog.default_locale)" />
          </div>
        </div>

        <a v-if="blogsResponse.length !== totalBlogs" class="flex justify-center text-Blue underline mb-16 cursor-pointer" @click="seeMoreBlogs">{{ $t(mediaTranslationPrefix + 'seeMore') }}</a>
      </div>

    </div>
    <div v-show="blogsResponse.length === 0 && loading === false" class="text-FieldGray p-16">{{ $t(mediaTranslationPrefix + 'blogs.noBlogsFound') }}</div>

    <AlertPopup :errors-container-style="'mt-10 mb-14 self-center h-auto max-h-72 overflow-y-auto'" :apply-button-text="$t(mediaTranslationPrefix + 'blogs.deleteArticle')" :cancel-button-text="$t(mediaTranslationPrefix + 'blogs.cancel')" :title-delete="$t(mediaTranslationPrefix + 'blogs.deleteArticleMsg')" :show-popup-code="showPopup" :can-be-deleted="true" @cancel="showPopup = false" @apply="deleteBlogByID(blogId)" />
    <AnimatedLoading :loading="loading" :animated-loading-icon="require('../../assets/images/loading_animated.svg')" />
  </div>
</template>

<script>
import MainFilter from "../MainFilter.vue";
import AnimatedLoading from "../AnimatedLoading.vue";
import Buttons from "../Buttons.vue";
import Card from "../blogs/Card.vue";
import AlertPopup from "../AlertPopup.vue";
import {mediaHeader, parseDate, showSectionsToast} from "../media/medias";

export default {
  name: "ListBlogs",
  head() {
    return {
      title: "bo - Blogs",
    }
  },
  components: {
    MainFilter,
    Card,
    AnimatedLoading,
    Buttons,
    AlertPopup
  },
  props: {
    appliedFilters: {
      type: String,
      default: ""
    },
    blogsUserRoleProp: {
      type: String,
      default: ""
    },
    blogsUserIdProp: {
      type: String,
      default: ""
    },
    blogsUriProp: {
      type: String,
      default: ""
    },
    authorsUriProp: {
      type: String,
      default: ""
    },
    categories: {
      type: Array,
      default() {
        return []
      }
    },
    projectIdProp: {
      type: String,
      default: ""
    },
    authToken: {
      type: String,
      default: ""
    },
    mediaTranslationPrefix: {
      type: String,
      default: ""
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
    multiSelectPlaceholder: {
      type: String,
      default: ""
    },
    showCreateBlogButton: {
      type: Boolean,
      default: false
    },
    nuxtSections: {
      type: Boolean,
      default: false
    },
    blogsResponseProp: {
      type: Object,
      default() {
        return {}
      }
    },
    mainFilterOptions: {
      type: Object,
      default() {
        return {
          selectWrapperStyle:  'w-max',
          selectStyle:  'default-select-style-chooser relative',
          labelStyle:  'text-md font-base mr-2 mb-1',
          labelInsideStyle:  'absolute top-2 text-xs font-base text-Blue mr-2 mb-1 z-10',
          labelInsideDefaultStyle:  'absolute top-3 text-md font-base text-darkGray mr-2 mb-1 defaultSearching z-10',
          labelPaddingWithIcon:  'left-12',
          labelPadding:  'left-3',
          selectErrorClass:  'select-error-class',
          selectIconClass:  'select-icon-class',
          labelInsideClass:  'label-inside-class',
          trackBy:  '',
          focused:  false,
          filterDisabled:  false,
          multiple:  false,
          closeOnSelect:  true,
          preserveSearch:  false,
          preselectFirst:  false,
          clearOnSelect:  false,
          multipleSelection:  false,
          labelOutside:  true,
          mainFilter:  '',
          selectPlaceholder:  '',
          filterLabelProp:  'value',
          filterIconIcomoon:  'absolute top-4.5 left-4 icon-filterIcon icon-filterIcon filterIconStyle',
          focusStyle:  'border border-Blue rounded-xl',
          focusMarginStyle:  'px-0.5 py-0.5',
          filterClearable:  false,
          filterSearchable:  false,
          errorOccurred:  false,
          withIcon:  true,
        }
      }
    },
    singleSelectFilterOptions: {
      type: Object,
      default() {
        return {
          selectLabel: '',
          selectWrapperStyle:  'w-max',
          selectStyle:  'default-select-style-chooser relative',
          labelStyle:  'text-md font-base mr-2 mb-1',
          labelInsideStyle:  'absolute top-2 text-xs font-base text-Blue mr-2 mb-1 z-10',
          labelInsideDefaultStyle:  'absolute top-3 text-md font-base text-darkGray mr-2 mb-1 defaultSearching z-10',
          labelPaddingWithIcon:  'left-12',
          labelPadding:  'left-3',
          selectErrorClass:  'select-error-class',
          selectIconClass:  'select-icon-class',
          labelInsideClass:  'label-inside-class',
          trackBy:  '',
          focused:  false,
          filterDisabled:  false,
          multiple:  false,
          closeOnSelect:  true,
          preserveSearch:  false,
          preselectFirst:  false,
          clearOnSelect:  false,
          multipleSelection:  false,
          labelOutside:  true,
          mainFilter:  '',
          selectPlaceholder:  '',
          filterLabelProp:  'translation',
          filterIconIcomoon:  'absolute top-4.5 left-4 icon-filterIcon icon-filterIcon filterIconStyle',
          focusStyle:  'border border-Blue rounded-xl',
          focusMarginStyle:  'px-0.5 py-0.5',
          filterClearable:  false,
          filterSearchable:  false,
          errorOccurred:  false,
          withIcon:  false,
        }
      }
    },
    multiSelectFilterOptions: {
      type: Object,
      default() {
        return {
          selectLabel: '',
          selectWrapperStyle:  'w-max',
          selectStyle:  'default-select-style-chooser relative',
          labelStyle:  'text-md font-base mr-2 mb-1',
          labelInsideStyle:  'absolute top-2 text-xs font-base text-Blue mr-2 mb-1 z-10',
          labelInsideDefaultStyle:  'absolute top-3 text-md font-base text-darkGray mr-2 mb-1 defaultSearching z-10',
          labelPaddingWithIcon:  'left-12',
          labelPadding:  'left-3',
          selectErrorClass:  'select-error-class',
          selectIconClass:  'select-icon-class',
          labelInsideClass:  'label-inside-class',
          trackBy:  '',
          focused:  false,
          filterDisabled:  false,
          multiple:  false,
          closeOnSelect:  true,
          preserveSearch:  true,
          preselectFirst:  true,
          clearOnSelect:  false,
          multipleSelection:  false,
          labelOutside:  true,
          mainFilter:  '',
          selectPlaceholder:  '',
          filterLabelProp:  'value',
          filterIconIcomoon:  'absolute top-4.5 left-4 icon-filterIcon icon-filterIcon filterIconStyle',
          focusStyle:  'border border-Blue rounded-xl',
          focusMarginStyle:  'px-0.5 py-0.5',
          filterClearable:  true,
          filterSearchable:  true,
          errorOccurred:  false,
          withIcon:  false,
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      showPopup: false,
      blogId: '',
      blogsUri: '',
      authorsUri: '',
      projectId: '',
      token: '',
      blogsResponse: [],
      usersRes: [],
      showMoreIndex: 0,
      filterClear: false,
      filterMap: {
        All: { key: 'All', size: 3 },
        title: {
          title: this.$t(this.mediaTranslationPrefix + 'filterOptions.title'),
          key: 'title',
          size: 5,
          type: 'text'
        },
        author: {
          title: this.$t(this.mediaTranslationPrefix + 'filterOptions.createdBy'),
          key: 'author',
          size: 5,
          type: 'multiSelect',
          multiSelectLabel: 'translation',
          multiSelectKey: 'key',
          multipleSelect: false,
          selectPlaceholder: this.$t(this.mediaTranslationPrefix + 'selectAuthor'),
          filterOptions: []
        },
        published: {
          title: this.$t(this.mediaTranslationPrefix + 'filterOptions.publishedStatus'),
          key: 'published',
          size: 5,
          type: 'select',
          selectPlaceholder: this.$t(this.mediaTranslationPrefix + 'filterOptions.selectStatus'),
          options: [{key: 'true', translation: this.$t(this.mediaTranslationPrefix + 'published')},{key: 'false', translation: this.$t(this.mediaTranslationPrefix + 'notPublished')}]
        },
        categories_titles: {
          title: this.$t(this.mediaTranslationPrefix + 'filterOptions.categoriesByTitle'),
          key: 'categories_titles',
          size: 5,
          type: 'multiSelect',
          multiSelectLabel: 'translation',
          multiSelectKey: 'key',
          multipleSelect: true,
          selectPlaceholder: this.$t(this.mediaTranslationPrefix + 'filterOptions.selectCategory'),
          filterOptions: []
        },
        published_date: {
          title: this.$t(this.mediaTranslationPrefix + 'filterOptions.publishedDate'),
          subTitle1: this.$t('from'),
          subTitle2: this.$t('to'),
          key1: 'publishedFrom',
          key2: 'publishedTo',
          key: 'published_date',
          size: 5,
          type: 'range',
        },
        publishedFrom: {
          title: this.$t('from'),
          key: 'publishedFrom',
          size: 5,
          type: 'text',
        },
        publishedTo: {
          title: this.$t('to'),
          key: 'publishedTo',
          size: 5,
          type: 'text',
        },
        inserted_at: {
          title: this.$t(this.mediaTranslationPrefix + 'filterOptions.createdAt'),
          subTitle1: this.$t('from'),
          subTitle2: this.$t('to'),
          key1: 'insertedFrom',
          key2: 'insertedTo',
          key: 'inserted_at',
          size: 5,
          type: 'range',
        },
        insertedFrom: {
          title: this.$t('from'),
          key: 'insertedFrom',
          size: 5,
          type: 'text',
        },
        insertedTo: {
          title: this.$t('to'),
          key: 'insertedTo',
          size: 5,
          type: 'text',
        },
        updated_at: {
          title: this.$t(this.mediaTranslationPrefix + 'filterOptions.updatedAt'),
          subTitle1: this.$t('from'),
          subTitle2: this.$t('to'),
          key1: 'updatedFrom',
          key2: 'updatedTo',
          key: 'updated_at',
          size: 5,
          type: 'range',
        },
        updatedFrom: {
          title: this.$t('from'),
          key: 'updatedFrom',
          size: 5,
          type: 'text',
        },
        updatedTo: {
          title: this.$t('to'),
          key: 'updatedTo',
          size: 5,
          type: 'text',
        }
      },
      createButtonsStyle: "h-53px py-3.5 px-8 text-white rounded-xl bg-Blue hover:bg-white hover:text-Blue border border-Blue hover:border-Blue w-max mr-2",
      payloadData: {
        filters: [],
        sort: {
          created: "DSC"
        },
        page: 1,
        limit: 9
      },
      totalBlogs: 0,
      currentPage: 1,
      pageNumber: 1,
      blogsUserId: '',
      filtersQuery: ''
    }
  },
  computed: {
    totalPages() {
      if (this.totalBlogs === 0) {
        return 1
      } else {
        return Math.ceil(this.totalBlogs / this.payloadData.limit)
      }
    },
    filterOptions() {
      const baseFilters = [
        {key: 'All', value: this.$t(this.mediaTranslationPrefix + 'selectFilter')},
        {key: 'title', value: this.$t(this.mediaTranslationPrefix + 'filterOptions.title')},
        {key: 'published', value: this.$t(this.mediaTranslationPrefix + 'filterOptions.publishedStatus')},
        {key: 'categories_titles', value: this.$t(this.mediaTranslationPrefix + 'filterOptions.categoriesByTitle')},
        {key: 'published_date', value: this.$t(this.mediaTranslationPrefix + 'filterOptions.publishedDate')},
        {key: 'inserted_at', value: this.$t(this.mediaTranslationPrefix + 'filterOptions.createdAt')},
        {key: 'updated_at', value: this.$t(this.mediaTranslationPrefix + 'filterOptions.updatedAt')}
      ]
      if (this.blogsUserRoleProp.includes('author') && !this.blogsUserRoleProp.includes('admin')) {
        return baseFilters
      } else {
        return [
          ...baseFilters,
          {key: 'author', value: this.$t(this.mediaTranslationPrefix + 'filterOptions.createdBy')}
        ]
      }
    }
  },
  watch: {
    projectIdProp: {
      handler(val) {
        this.projectId = val
      },
      deep: true,
      immediate: true
    },
    authToken: {
      handler(val) {
        this.token = val
      },
      deep: true,
      immediate: true
    },
    blogsUserIdProp: {
      handler(val) {
        this.blogsUserId = val
      },
      deep: true,
      immediate: true
    },
    blogsUriProp: {
      handler(val) {
        this.blogsUri = val
        if(this.$route.query.filters && this.$route.query.filters !== "") {
          this.filterBlogs(JSON.parse(this.$route.query.filters))
        } else if (this.nuxtSections && this.appliedFilters) {
          this.filterBlogs(JSON.parse(this.appliedFilters))
        } else if (val && process.client) this.getAllBlogs()
      },
      deep: true,
      immediate: true
    },
    authorsUriProp: {
      handler(val) {
        this.authorsUri = val
        if (val && process.client) this.getAuthors()
      },
      deep: true,
      immediate: true
    },
    categories: {
      handler(val) {
        this.filterMap.categories_titles.filterOptions = val.map(cat => {
          return {
            key: cat.translation,
            translation: cat.translation
          }
        })
      },
      deep: true,
      immediate: true
    },
    blogsResponseProp: {
      handler(res) {
        if(res.result) {
          this.blogsResponse = []
          this.totalBlogs = 0
          this.blogsResponse = res.result
          this.totalBlogs = res.total
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    parseDate,
    hasObjectWithKey(arr, key, value) {
      for (const item of arr) {
        if (item.hasOwnProperty(key) && item[key] === value) {
          return true;
        }
      }
      return false;
    },
    async getAllBlogs(filtered) {
      this.loading = true
      const token = this.token

      if (this.blogsUserRoleProp.includes('author') && !this.blogsUserRoleProp.includes('admin') && !this.blogsUserRoleProp.includes('publisher')) {
        this.payloadData.filters.push({
          key: 'author_id',
          value: this.blogsUserId
        })
      }
      if (!this.nuxtSections && filtered !== true) {
        if(this.$route.query.filters && this.$route.query.filters !== "") {
          this.$router.push(this.localePath({path: this.blogsPath, query: {filters: this.$route.query.filters}}))
        } else {
          this.$router.push(this.localePath({path: this.blogsPath}))
        }
      }
      const response = await this.$axios.post(this.blogsUri + 'any_articles',
          {
            ...this.payloadData,
            filters: this.payloadData.filters.map(filter => {
              if (filter.key === 'published') {
                filter.value = filter.value === 'true'
              } else if (filter.key === 'categories_titles') {
                filter.value = filter.value.map(val => val.key)
              } else if (filter.key === 'author') {
                filter.value = filter.value.substring(
                  filter.value.indexOf("(") + 1,
                  filter.value.lastIndexOf(")")
                )
              } else if (filter.key === 'publishedFrom-/-publishedTo') {
                filter.key = 'published_date'
                filter.operation = "between"
                const value1 = (new Date(filter.value.split('-/-')[0]).getTime() / 1000).toString()
                const value2 = (new Date(filter.value.split('-/-')[1]).getTime() / 1000).toString()
                filter.value = value1
                filter.value2 = value2
              } else if (filter.key === 'insertedFrom-/-insertedTo') {
                filter.key = 'inserted_at'
                filter.operation = "between"
                const value1 = (new Date(filter.value.split('-/-')[0]).getTime() / 1000).toString()
                const value2 = (new Date(filter.value.split('-/-')[1]).getTime() / 1000).toString()
                filter.value = value1
                filter.value2 = value2
              } else if (filter.key === 'updatedFrom-/-updatedTo') {
                filter.key = 'updated_at'
                filter.operation = "between"
                const value1 = (new Date(filter.value.split('-/-')[0]).getTime() / 1000).toString()
                const value2 = (new Date(filter.value.split('-/-')[1]).getTime() / 1000).toString()
                filter.value = value1
                filter.value2 = value2
              }
              return filter
            })
          },
        {
        headers: mediaHeader({token}, this.projectId)
      }).catch((e) => {
        this.loading = false
        this.$toast.show(
          {
            message: e.response.data.message,
            timeout: 5,
            classToast: 'bg-error',
            classMessage: 'text-white',
          }
        )
      })

      if (response.data && response.data.data && response.data.data.length > 0) {
        this.blogsResponse = response.data.data.filter(article => !response.data.data.some(atcl => atcl.draft_of === article.id))
      }
      this.totalBlogs = response.data.total

      this.$nuxt.$emit('setModel')
      this.loading = false
    },
    seeMoreBlogs() {
      if(this.blogsUri !== '') {
        this.payloadData.limit += 9
        this.getAllBlogs()}
    },
    async getAuthors() {
      this.loading = true
      const token = this.token
      const response = await this.$axios.get(this.authorsUri,
        {
        headers: mediaHeader({token}, this.projectId)
      })
      this.usersRes = response.data.data
      response.data.data.forEach((project) => {
        this.filterMap.author.filterOptions.push(
          {
            key: project.id,
            translation: project.full_name ? project.full_name + ` (${project.id})` : `(${project.id})`
          }
        )
      })
      this.loading = false
    },
    getFilter(filter) {

    },
    filterBlogs(filter) {
      this.filtersQuery = JSON.stringify(filter)
      if (!this.nuxtSections) {
        this.$router.push(this.localePath({path: this.blogsPath, query: {filters: this.filtersQuery}}))
      }
      this.loading = true
      for(const i in filter) {
        const filterIndex = this.payloadData.filters.findIndex(x => x.key === filter[i].key)
        if(filterIndex === -1) {
          this.payloadData.filters.push({
            key: filter[i].key,
            value: filter[i].key === 'views' ? parseInt(filter[i].value) : filter[i].key === "author_id" ? filter[i].value.substring(
              filter[i].value.indexOf("(") + 1,
              filter[i].value.lastIndexOf(")")
            ) : filter[i].value
          })
        } else {
          this.payloadData.filters[filterIndex].value = filter[i].key === 'views' ? parseInt(filter[i].value) : filter[i].key === "author_id" ? filter[i].value.substring(
            filter[i].value.indexOf("(") + 1,
            filter[i].value.lastIndexOf(")")
          ) : filter[i].value
        }
      }
      if(this.blogsUri !== '') {
        this.getAllBlogs(true)
      }
    },
    removeFilter(i, item){
      if (this.payloadData.filters.length !== 1) {
        this.payloadData.filters = this.payloadData.filters.filter(object => object.key !== this.payloadData.filters[i].key).slice()
        if(this.blogsUri !== '') {
          this.getAllBlogs(true)
        }
      }
      if (!this.nuxtSections) {
        try {
          const filtersQuery = JSON.stringify(JSON.parse(this.filtersQuery).filter(filter => filter.key !== item.key))
          this.$router.push(this.localePath({ path: this.blogsPath , query: {filters: filtersQuery} }))
        } catch {}
      }
    },
    clearFilters() {
      this.payloadData.filters.splice(0)
      this.filterClear === false ? this.filterClear = true : this.filterClear = false
      if(this.blogsUri !== '') {
        this.getAllBlogs(true)
        if (!this.nuxtSections) {
          this.$router.push(this.localePath({ path: this.blogsPath }))
        } else {
          this.filtersQuery = ''
        }
      }
    },
    openBlog(blogID, userId, defaultLang) {
      if(this.editBlogPath) {
        if(this.$route.query.filters && this.$route.query.filters !== "") {
          this.$router.push(this.localePath({path: this.editBlogPath, query: {id: blogID, defaultLang: defaultLang, userId: userId, filters: this.filtersQuery}}))
        } else {
          this.$router.push(this.localePath({path: this.editBlogPath, query: {id: blogID, defaultLang: defaultLang, userId: userId}}))
        }
      } else {
        this.$emit('updateBlogsComponent', {name: 'BlogsEditBlog', blogId: blogID.toString(), defaultLang: defaultLang, userId: userId, appliedFilters: this.filtersQuery})
      }
    },
    async publishBlogByID(blogId, status, idx) {
      this.loading = true
      const token = this.token

      const response = await this.$axios.put(status && status === true ? `${this.blogsUri}/articles/${blogId}/unpublish` : `${this.blogsUri}/articles/${blogId}/publish`,
        {},
        {
          headers: mediaHeader({token}, this.projectId)
        }).catch((e) => {
        this.loading = false
        let errorMessage = ''
        if (e.response.data.errors) {
          errorMessage = e.response.data.errors.files[0]
        } else {
          errorMessage = e.response.data.error ? `${e.response.data.error}` : e.response.data.message
        }
        if (this.nuxtSections) {
          showSectionsToast(this.$toast, 'error', `${e.response.data.error}`)
        } else if (errorMessage) {
          this.$toast.show(
            {
              message: errorMessage,
              timeout: 5,
              classToast: 'bg-error',
              classMessage: 'text-white',
            }
          )
        }
      })
      if(response) {
        this.$set(this.blogsResponse[idx], 'published', response.data.published)
        await this.getAllBlogs()
        if (this.nuxtSections) {
          showSectionsToast(this.$toast, 'success', this.$t(this.mediaTranslationPrefix + 'blogs.articlePublished'))
        } else {
          this.$toast.show(
            {
              message: this.$t(this.mediaTranslationPrefix + 'blogs.articlePublished'),
              classToast: 'bg-Blue',
              classMessage: 'text-white',
            }
          )
        }
      }
      this.loading = false
    },
    setPage(pageNumber) {
      this.currentPage = pageNumber
      this.pageNumber = pageNumber
      this.payloadData.page = (pageNumber - 1) * this.payloadData.limit
      this.getAllBlogs()
    },
    handlePageChange(e) {
      if (e.key === 'Enter') {
        if(this.pageNumber >= 1 && this.pageNumber <= this.totalPages) {
          this.currentPage = this.pageNumber
          this.payloadData.page = (this.pageNumber - 1) * this.payloadData.limit
          this.getAllBlogs()
        }
      }
    },
    openCreateBlog() {
      if (this.createBlogPath) {
        this.$router.push(this.localePath({path: this.createBlogPath, query: {filters: this.$route.query.filters, isCreateBlog: true}}))
      } else this.$emit('updateBlogsComponent', {name: 'BlogsEditBlog', appliedFilters: this.filtersQuery, isCreateBlog: true})
    },
    updateFilterValues(value) {
      if(value === 'public' || value === 'private' || value === 'locked' || value === 'unlocked') {
        return this.$t(value)
      } else return value
    },
    async deleteBlogByID(id) {
      if(this.blogByIdUri !== '') {
        try {
          this.loading = true
          const token = this.token
          const response = await this.$axios.delete(`${this.blogsUri}/articles/${id}`,
            {
              headers: mediaHeader({token}, this.projectId)
            })
          if (this.nuxtSections) {
            showSectionsToast(this.$toast, 'success', response.data.message)
          } else {
            this.$toast.show(
              {
                message: response.data.message,
                classToast: 'bg-Blue',
                classMessage: 'text-white',
              }
            )
          }
          this.showPopup = false
          await this.getAllBlogs()
          this.loading = false
        } catch (e) {
          this.loading = false
          this.showPopup = false
          if (this.nuxtSections) {
            showSectionsToast(this.$toast, 'error', `${e.response.data.error}`)
          } else if (e.response.data.error) {
            this.$toast.show(
              {
                message: e.response.data.error,
                timeout: 5,
                classToast: 'bg-error',
                classMessage: 'text-white',
              }
            )
          }
        }
      }
    },
    getAuthorName(id) {
      try {
        return this.usersRes.find(user => user.id === id).full_name
      } catch {
        return id
      }
    },
    canNotOpenBlog(blog) {
      if (this.blogsUserRoleProp.includes('publisher') && this.blogsUserRoleProp.split(',').length === 1) {
        return true
      } else if (this.blogsUserRoleProp.includes('author') && !this.blogsUserRoleProp.includes('admin') && blog.author_id !== this.blogsUserId) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style>
.text-ellipsis {
  text-overflow: ellipsis !important;
}
@media only screen and (max-width:768px) {
  .mobileHidden {
    display: none !important;
  }
}
</style>
