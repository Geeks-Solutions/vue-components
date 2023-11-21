<template>
  <div :class="widthStyle">
    <div :class="containerStyle">

      <div v-for="item in items" :key="item.label" class="mx-4 my-2">
        <div :class="item.headerStyle" @click="item.clickable ? $emit('itemClicked', item) : null">
          {{ item.label + ' ' + item.value }}
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "HeaderContainer",
  props: {
    items: {
      type: Array,
      default() {
        return [
          {
            label: 'ID:',
            value: '440449594'
          },
          {
            label: 'Creation date:',
            value: '18 March 2020'
          },
          {
            label: 'Created by:',
            value: 'Loreum epsum'
          },
          {
            label: 'Media type:',
            value: 'Image'
          },
        ]
      }
    },
    containerStyle: {
      type: String,
      default: 'flex flex-col md:flex-row border-2 border-Blue justify-between p-2 rounded-xl'
    },
    widthStyle: {
      type: String,
      default: 'w-full'
    }
  }
}
</script>

<style scoped>

</style>
