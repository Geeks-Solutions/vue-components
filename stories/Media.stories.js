import Media from '../src/runtime/components/media/Media.vue'

const defaultControls = {
  componentsPrefix: {
    type: String,
    default: '',
  },
  mediaUriProp: {
    type: String,
    default: '',
  },
  mediaByIdUriProp: {
    type: String,
    default: '',
  },
  authorsUriProp: {
    type: String,
    default: '',
  },
  projectIdProp: {
    type: String,
    default: '',
  },
  authToken: {
    type: String,
    default: '',
  },
  sectionsUserIdProp: {
    type: String,
    default: '',
  },
  mediaIdProp: {
    type: String,
    default: '',
  },
  mediaTranslationPrefix: {
    type: String,
    default: 'mediaT.',
  },
  createMediaPath: {
    type: String,
    default: '',
  },
  editMediaPath: {
    type: String,
    default: '',
  },
  mediasPath: {
    type: String,
    default: '',
  },
  mediaCategory: {
    type: String,
    default: '',
  },
  showCreateMediaButton: {
    type: Boolean,
    default: false,
  },
  accessLimited: {
    type: Boolean,
    default: false,
  },
  mediaResponseProp: {
    type: Object,
    default: () => ({
      total: 144,
      result: [
        {
          type: 'image',
          title: null,
          tags: null,
          seo_tag: null,
          private_status: 'public',
          number_of_contents: 0,
          namespace: '60d1e1e61aa3df0006b08e07',
          meta: {
            author_name: 'Akram Eweev',
          },
          locked_status: 'unlocked',
          id: '643e99cc2050160006e8a646',
          files: [
            {
              url: 'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2F54ee6643-e0f9-4b92-a1d2-441e5108724de6bb5ea523974277bd999d0d01540d76.jpeg',
              type: 'image/jpeg',
              thumbnail_url:
                'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2F54ee6643-e0f9-4b92-a1d2-441e5108724de6bb5ea523974277bd999d0d01540d76_thumbnail.jpeg',
              size: 134807,
              platform_id: '611610df0a998615afb99c29',
              platform: {
                width: 1000,
                updated_at: 1628836063,
                number_of_medias: 0,
                namespace: 'sections_app',
                name: 'Global Platform',
                inserted_at: 1628836063,
                id: '611610df0a998615afb99c29',
                height: 1000,
                description: 'This is the only platform used for sections',
              },
              metadata: {
                width: 460,
                height: 600,
              },
              filename:
                'sections/54ee6643-e0f9-4b92-a1d2-441e5108724de6bb5ea523974277bd999d0d01540d76.jpeg',
              file_id: '7638fc5e466dc152b4933fd6ff9fa549-1d2e8b',
            },
          ],
          creation_date: 1681824204,
          author: '60d1e1e7cc862e000664ab34',
        },
        {
          type: 'image',
          title: null,
          tags: null,
          seo_tag: null,
          private_status: 'public',
          number_of_contents: 0,
          namespace: '60d1e1e61aa3df0006b08e07',
          meta: {
            author_name: 'Akram Eweev',
          },
          locked_status: 'unlocked',
          id: '643e834b20501600062b5f78',
          files: [
            {
              url: 'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2F54ee6643-e0f9-4b92-a1d2-441e5108724d0cf6088cf0f64b5f88c1c9ed2c115893.jpeg',
              type: 'image/jpeg',
              thumbnail_url:
                'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2F54ee6643-e0f9-4b92-a1d2-441e5108724d0cf6088cf0f64b5f88c1c9ed2c115893_thumbnail.jpeg',
              size: 134807,
              platform_id: '611610df0a998615afb99c29',
              platform: {
                width: 1000,
                updated_at: 1628836063,
                number_of_medias: 0,
                namespace: 'sections_app',
                name: 'Global Platform',
                inserted_at: 1628836063,
                id: '611610df0a998615afb99c29',
                height: 1000,
                description: 'This is the only platform used for sections',
              },
              metadata: {
                width: 460,
                height: 600,
              },
              filename:
                'sections/54ee6643-e0f9-4b92-a1d2-441e5108724d0cf6088cf0f64b5f88c1c9ed2c115893.jpeg',
              file_id: '7638fc5e466dc152b4933fd6ff9fa549-1d2a0e',
            },
          ],
          creation_date: 1681818443,
          author: '60d1e1e7cc862e000664ab34',
        },
        {
          type: 'image',
          title: null,
          tags: null,
          seo_tag: null,
          private_status: 'public',
          number_of_contents: 0,
          namespace: '60d1e1e61aa3df0006b08e07',
          meta: {
            author_name: 'Akram Eweev',
          },
          locked_status: 'unlocked',
          id: '643906d4f3cfa1000848c607',
          files: [
            {
              url: 'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2Fsections_ef02c02f63814dd690b77598b4175979b0abc1c913d9448eb68cb04759e01ce3b7b9d66ba93041099a379e95c4922b5b.jpg',
              type: 'image/jpeg',
              thumbnail_url:
                'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2Fsections_ef02c02f63814dd690b77598b4175979b0abc1c913d9448eb68cb04759e01ce3b7b9d66ba93041099a379e95c4922b5b_thumbnail.jpg',
              size: 79587,
              platform_id: '611610df0a998615afb99c29',
              platform: {
                width: 1000,
                updated_at: 1628836063,
                number_of_medias: 0,
                namespace: 'sections_app',
                name: 'Global Platform',
                inserted_at: 1628836063,
                id: '611610df0a998615afb99c29',
                height: 1000,
                description: 'This is the only platform used for sections',
              },
              metadata: {
                width: 533,
                height: 280,
              },
              filename:
                'sections/sections_ef02c02f63814dd690b77598b4175979b0abc1c913d9448eb68cb04759e01ce3b7b9d66ba93041099a379e95c4922b5b.jpg',
              file_id: '6221017a02be8f64473862000ee1fbcf-1822d1',
            },
          ],
          creation_date: 1681458900,
          author: '60d1e1e7cc862e000664ab34',
        },
        {
          type: 'image',
          title: null,
          tags: null,
          seo_tag: null,
          private_status: 'public',
          number_of_contents: 0,
          namespace: '60d1e1e61aa3df0006b08e07',
          meta: {
            author_name: 'Akram Eweev',
          },
          locked_status: 'unlocked',
          id: '64390591f3cfa100085c3c3b',
          files: [
            {
              url: 'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2F2995448279f50bb054b2599e28f1042f0f133.png',
              type: 'image/png',
              thumbnail_url:
                'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2F2995448279f50bb054b2599e28f1042f0f133_thumbnail.png',
              size: 841288,
              platform_id: '611610df0a998615afb99c29',
              platform: {
                width: 1000,
                updated_at: 1628836063,
                number_of_medias: 0,
                namespace: 'sections_app',
                name: 'Global Platform',
                inserted_at: 1628836063,
                id: '611610df0a998615afb99c29',
                height: 1000,
                description: 'This is the only platform used for sections',
              },
              metadata: {
                width: 533,
                height: 800,
              },
              filename: 'sections/2995448279f50bb054b2599e28f1042f0f133.png',
              file_id: '7d5ba2b55ed9cc710378699031d81b68-1c6810',
            },
          ],
          creation_date: 1681458577,
          author: '60d1e1e7cc862e000664ab34',
        },
        {
          type: 'image',
          title: null,
          tags: null,
          seo_tag: null,
          private_status: 'public',
          number_of_contents: 0,
          namespace: '60d1e1e61aa3df0006b08e07',
          meta: {
            author_name: 'Akram Eweev',
          },
          locked_status: 'unlocked',
          id: '64390584f3cfa100085af32e',
          files: [
            {
              url: 'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2F14c2ba3d4e987c41b6599b66b33487e2853656013674418eb13ed24ee25b4a5b.jpeg',
              type: 'image/jpeg',
              thumbnail_url:
                'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2F14c2ba3d4e987c41b6599b66b33487e2853656013674418eb13ed24ee25b4a5b_thumbnail.jpeg',
              size: 40409,
              platform_id: '611610df0a998615afb99c29',
              platform: {
                width: 1000,
                updated_at: 1628836063,
                number_of_medias: 0,
                namespace: 'sections_app',
                name: 'Global Platform',
                inserted_at: 1628836063,
                id: '611610df0a998615afb99c29',
                height: 1000,
                description: 'This is the only platform used for sections',
              },
              metadata: {
                width: 265,
                height: 350,
              },
              filename:
                'sections/14c2ba3d4e987c41b6599b66b33487e2853656013674418eb13ed24ee25b4a5b.jpeg',
              file_id: '33a3a0cf29cae913cfde75904f42b9a7-17a54e',
            },
          ],
          creation_date: 1681458564,
          author: '60d1e1e7cc862e000664ab34',
        },
        {
          type: 'image',
          title: null,
          tags: null,
          seo_tag: null,
          private_status: 'public',
          number_of_contents: 0,
          namespace: '60d1e1e61aa3df0006b08e07',
          meta: {
            author_name: 'section invoice1',
          },
          locked_status: 'unlocked',
          id: '643d0a7020501600061aafc0',
          files: [
            {
              url: 'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2F14c2ba3d4e987c41b6599b66b33487e2d2552d65692a45378882fb65abe2c3e2.jpeg',
              type: 'image/jpeg',
              thumbnail_url:
                'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2F14c2ba3d4e987c41b6599b66b33487e2d2552d65692a45378882fb65abe2c3e2_thumbnail.jpeg',
              size: 40409,
              platform_id: '611610df0a998615afb99c29',
              platform: {
                width: 1000,
                updated_at: 1628836063,
                number_of_medias: 0,
                namespace: 'sections_app',
                name: 'Global Platform',
                inserted_at: 1628836063,
                id: '611610df0a998615afb99c29',
                height: 1000,
                description: 'This is the only platform used for sections',
              },
              metadata: {
                width: 265,
                height: 350,
              },
              filename:
                'sections/14c2ba3d4e987c41b6599b66b33487e2d2552d65692a45378882fb65abe2c3e2.jpeg',
              file_id: '33a3a0cf29cae913cfde75904f42b9a7-1627d5',
            },
          ],
          creation_date: 1681722051,
          author: '63a30c5a009566000727977c',
        },
        {
          type: 'image',
          title: null,
          tags: null,
          seo_tag: null,
          private_status: 'public',
          number_of_contents: 0,
          namespace: '60d1e1e61aa3df0006b08e07',
          meta: {
            author_name: 'section invoice1',
          },
          locked_status: 'unlocked',
          id: '64391516f3cfa100089bc40a',
          files: [
            {
              url: 'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2FScreenshot+2023-04-14+at+11.37.09ab49c621f7b44478b434d9001671cfd0.png',
              type: 'image/png',
              thumbnail_url:
                'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2FScreenshot+2023-04-14+at+11.37.09ab49c621f7b44478b434d9001671cfd0_thumbnail.png',
              size: 128030,
              platform_id: '611610df0a998615afb99c29',
              platform: {
                width: 1000,
                updated_at: 1628836063,
                number_of_medias: 0,
                namespace: 'sections_app',
                name: 'Global Platform',
                inserted_at: 1628836063,
                id: '611610df0a998615afb99c29',
                height: 1000,
                description: 'This is the only platform used for sections',
              },
              metadata: {
                width: 2404,
                height: 584,
              },
              filename:
                'sections/Screenshot 2023-04-14 at 11.37.09ab49c621f7b44478b434d9001671cfd0.png',
              file_id: '993f3f98be72d34393b6705d9368b39c-131c6c',
            },
          ],
          creation_date: 1681462550,
          author: '63a30c5a009566000727977c',
        },
        {
          type: 'image',
          title: null,
          tags: null,
          seo_tag: null,
          private_status: 'public',
          number_of_contents: 0,
          namespace: '60d1e1e61aa3df0006b08e07',
          meta: {
            author_name: 'section invoice1',
          },
          locked_status: 'locked',
          id: '6433d93a256b420007a59242',
          files: [
            {
              url: 'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2FAndroid+app+icon6fda17105bde40738b6ee00fdbf7b820.png',
              type: 'image/png',
              thumbnail_url:
                'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2FAndroid+app+icon6fda17105bde40738b6ee00fdbf7b820_thumbnail.png',
              size: 12856,
              platform_id: '611610df0a998615afb99c29',
              platform: {
                width: 1000,
                updated_at: 1628836063,
                number_of_medias: 0,
                namespace: 'sections_app',
                name: 'Global Platform',
                inserted_at: 1628836063,
                id: '611610df0a998615afb99c29',
                height: 1000,
                description: 'This is the only platform used for sections',
              },
              metadata: {
                width: 512,
                height: 512,
              },
              filename: 'sections/Android app icon6fda17105bde40738b6ee00fdbf7b820.png',
              file_id: 'e4bc1f0d06153a36967371e1e2e17686-1e2847',
            },
          ],
          creation_date: 1681384898,
          author: '63a30c5a009566000727977c',
        },
        {
          type: 'image',
          title: 'akram title',
          tags: null,
          seo_tag: null,
          private_status: 'public',
          number_of_contents: 0,
          namespace: '60d1e1e61aa3df0006b08e07',
          meta: {
            author_name: 'section invoice1',
          },
          locked_status: 'locked',
          id: '643518f6f208fd00063148a2',
          files: [
            {
              url: 'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2F29954d567be011b3e493185cb80b4a475604c.png',
              type: 'image/png',
              thumbnail_url:
                'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2F29954d567be011b3e493185cb80b4a475604c_thumbnail.png',
              size: 841288,
              platform_id: '611610df0a998615afb99c29',
              platform: {
                width: 1000,
                updated_at: 1628836063,
                number_of_medias: 0,
                namespace: 'sections_app',
                name: 'Global Platform',
                inserted_at: 1628836063,
                id: '611610df0a998615afb99c29',
                height: 1000,
                description: 'This is the only platform used for sections',
              },
              metadata: {
                width: 533,
                height: 800,
              },
              filename: 'sections/29954d567be011b3e493185cb80b4a475604c.png',
              file_id: '7d5ba2b55ed9cc710378699031d81b68-13613f',
            },
          ],
          creation_date: 1681384701,
          author: '63a30c5a009566000727977c',
        },
      ],
    }),
  },
  mediaByIdResponseProp: {
    type: Object,
    default: () => ({
      type: 'image',
      title: 'akram title',
      tags: null,
      seo_tag: null,
      private_status: 'public',
      number_of_contents: 0,
      namespace: '60d1e1e61aa3df0006b08e07',
      meta: {
        content: [],
        author: 'section invoice1',
      },
      locked_status: 'locked',
      id: '643518f6f208fd00063148a2',
      files: [
        {
          url: 'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2F29954d567be011b3e493185cb80b4a475604c.png',
          type: 'image/png',
          thumbnail_url:
            'https://s3.amazonaws.com/eweevtestbucketprivate/sections%2F29954d567be011b3e493185cb80b4a475604c_thumbnail.png',
          size: 841288,
          platform_id: '611610df0a998615afb99c29',
          platform: {
            width: 1000,
            updated_at: 1628836063,
            number_of_medias: 0,
            namespace: 'sections_app',
            name: 'Global Platform',
            inserted_at: 1628836063,
            id: '611610df0a998615afb99c29',
            height: 1000,
            description: 'This is the only platform used for sections',
          },
          metadata: {
            width: 533,
            height: 800,
          },
          filename: 'sections/29954d567be011b3e493185cb80b4a475604c.png',
          file_id: '7d5ba2b55ed9cc710378699031d81b68-13613f',
        },
      ],
      creation_date: 1681384701,
      author: '63a30c5a009566000727977c',
    }),
  },
  boUsage: {
    type: Boolean,
    default: true,
  },
  withSelectMediaButton: {
    type: Boolean,
    default: false,
  },
  selectedMedia: {
    type: Object,
    default: () => ({}),
  },
  nuxtSections: {
    type: Boolean,
    default: false,
  },
  mediaIdEditing: {
    type: String,
    default: '',
  },
  contentUsedKey: {
    type: String,
    default: '',
  },
}

export default {
  component: Media,
  title: 'Components/Media/Media',
  args: Object.fromEntries(
    Object.entries(defaultControls).map(([key, value]) => {
      const defaultVal = typeof value.default === 'function' ? value.default() : value.default

      return [key, defaultVal]
    })
  ),
}

const Template = (args, { argTypes }) => ({
  components: { Media },
  setup() {
    return { args }
  },
  props: Object.keys(argTypes),
  template: '<Media v-bind="args" />',
})

export const Primary = Template.bind({})
