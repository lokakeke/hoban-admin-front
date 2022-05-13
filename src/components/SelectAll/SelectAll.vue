<template>
  <v-flex>
    <v-list-item ripple @click="toggle()">
      <v-list-item-action>
        <v-icon :color="selected.length > 0 ? 'green darken-1' : ''">{{ icon }}</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>전체선택</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
  </v-flex>
</template>

<script>
export default {
  props: { selected: Array, array: Array },
  name: 'SelectAll',
  computed: {
    likesAllFruit() {
      return this.selected.length === this.array.length
    },
    likesSomeFruit() {
      return this.selected.length > 0 && !this.likesAllFruit
    },
    icon() {
      if (this.likesAllFruit) return 'mdi-close-box'
      if (this.likesSomeFruit) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    }
  },
  methods: {
    toggle() {
      this.$nextTick(() => {
        if (this.likesAllFruit) {
          this.$emit('checked', [])
        } else {
          const checkedAll = _.map(this.array.slice(), 'value')
          this.$emit('checked', checkedAll)
        }
      })
    }
  }
}
</script>
