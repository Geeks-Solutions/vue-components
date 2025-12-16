import AnimatedLoading from '../src/runtime/components/AnimatedLoading.vue'
import loadingSvg from '~/src/runtime/assets/images/loading_animated.svg'

const defaultControls = {
  loading: {
    type: Boolean,
    default: false,
  },
  animatedLoadingIcon: {
    type: String,
    // Use the imported asset as the default value
    default: loadingSvg,
  },
}

export default {
  component: AnimatedLoading,
  title: 'Components/Other/AnimatedLoading',
  args: Object.fromEntries(
    Object.entries(defaultControls).map(([key, value]) => {
      const defaultVal = typeof value.default === 'function' ? value.default() : value.default

      return [key, defaultVal]
    })
  ),
}

const Template = (args, { argTypes }) => ({
  args: {},
  components: { AnimatedLoading },
  setup() {
    return { args }
  },
  props: Object.keys(argTypes),
  template: '<AnimatedLoading v-bind="args" />',
})

export const Primary = Template.bind({})
