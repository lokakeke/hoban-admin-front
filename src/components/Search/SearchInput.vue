<template>
  <v-text-field
      :label="label"
      @input="filterItems"
      append-icon="mdi-magnify"
      clearable
      hide-details
      single-line
      v-model="searchText"
  />
</template>

<script>
export default {
  name: 'SearchInput',
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    },
    label: String
  },
  data: function () {
    return {
      searchText: ''
    }
  },
  methods: {
    filterItems () {
      let resultItem = []
      if (this.searchText) {
        resultItem = this.value.filter((object) => {
          let text = ''
          for (const key in object) {
            text += object[key] !== null ? object[key] : ''
          }
          return text.indexOf(this.searchText) > -1
        })
      } else {
        resultItem = this.value
      }
      console.log(resultItem)
      this.$emit('input', resultItem)
    }
  }
}
</script>

<style scoped>

</style>
