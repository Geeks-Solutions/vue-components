import HeaderContainer from '../src/runtime/components/HeaderContainer.vue'
import Card from '~/src/runtime/components/media/Card.vue'

const defaultControls = {
  items: {
    type: Array,
    default: () => [
      {
        label: 'ID:',
        value: '440449594',
      },
      {
        label: 'Creation date:',
        value: '18 March 2020',
      },
      {
        label: 'Created by:',
        value: 'Loreum epsum',
      },
      {
        label: 'Media type:',
        value: 'Image',
      },
    ],
  },
  containerStyle: {
    type: String,
    default: 'flex flex-col md:flex-row border-2 border-Blue justify-between p-2 rounded-xl',
  },
  widthStyle: {
    type: String,
    default: 'w-full',
  },
}

export default {
  component: HeaderContainer,
  title: 'Components/Media/HeaderContainer',
  parameters: {},
  tags: ['autodocs'],
  // Define argTypes if your component has props
  argTypes: {
    items: {
      control: {
        type: 'object', // This tells Storybook to treat it as an editable object/array
      },
      description: 'Array of items with label and value properties',
      table: {
        type: {
          summary: 'Array<{label: string, value: string}>',
        },
        defaultValue: {
          summary: 'Default items array',
        },
      },
    },
  },
  args: Object.fromEntries(
    Object.entries(defaultControls).map(([key, value]) => {
      const defaultVal = typeof value.default === 'function' ? value.default() : value.default

      return [key, defaultVal]
    })
  ),
}

export const Primary = {
  args: {
    items: [
      {
        label: 'ID:',
        value: '440449594',
      },
      {
        label: 'Creation date:',
        value: '18 March 2020',
      },
      {
        label: 'Created by:',
        value: 'Loreum epsum',
      },
      {
        label: 'Media type:',
        value: 'Image',
      },
    ],
    containerStyle: 'flex flex-col md:flex-row border-2 border-Blue justify-between p-2 rounded-xl',
    widthStyle: 'w-full',
  },
  render: (args) => ({
    components: { HeaderContainer },
    setup() {
      return { args }
    },
    template: '<HeaderContainer v-bind="args" />',
  }),
}
