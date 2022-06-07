<template>
  <v-list>
    <template v-if="array && array.length > 0">
      <v-list-item @click="toggle()">
        <v-list-item-action>
          <v-icon :color="selected.length > 0 ? 'green darken-1' : ''">{{ icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>전체선택</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="ma-0"></v-divider>
      <v-list-item v-for="type of array" :key="type[valueField]" @click="check(type[valueField])">
        <v-list-item-action>
          <v-checkbox v-model="checkList" color="green" :value="type[valueField]" @click.prevent="check(type[valueField])"></v-checkbox>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ type[textField] }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-layout v-else justify-center pt-2 pb-2>
      데이터가 없습니다.
    </v-layout>
  </v-list>
</template>

<script>
export default {
  props: { selected: Array, array: Array, itemValue: String, itemText: String },
  name: 'SelectList',
  data() {
    return {
      checkList: [],
      valueField: 'value',
      textField: 'text'
    }
  },
  watch: {
    selected(newVal, oldVal) {
      this.checkList = newVal
    }
  },
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
  mounted() {
    if (this.itemValue) {
      this.valueField = this.itemValue
    }
    if (this.itemText) {
      this.textField = this.itemText
    }
  },
  methods: {
    toggle() {
      this.$nextTick(() => {
        if (this.likesAllFruit) {
          this.emit([])
        } else {
          const checkedAll = _.map(this.array.slice(), this.valueField)
          this.emit(checkedAll)
        }
      })
    },
    check(value) {
      let array = []
      if (_.includes(this.checkList, value)) {
        array = _.filter(this.checkList, function (n) {
          return n !== value
        })
      } else {
        array = _.concat(this.checkList.slice(), [value])
      }
      this.emit(array)
    },
    emit(array) {
      this.checkList = array
      this.$emit('update:selected', array)
    }
  }
}
</script>
