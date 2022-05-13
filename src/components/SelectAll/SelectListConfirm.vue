<template>
  <v-list>
    <v-list-item>
      <v-list-item-content></v-list-item-content>
      <v-list-item-action>
        <v-btn small outlined rounded color="primary" @click="emit()">
          <v-icon>check</v-icon>
          적용
        </v-btn>
      </v-list-item-action>
    </v-list-item>
    <v-divider></v-divider>
    <v-list-item @click="toggle()">
      <v-list-item-action>
        <v-icon :color="checkList.length > 0 ? 'green darken-1' : ''">{{ icon }}</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>전체선택</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list-item v-for="type of array" :key="type[valueField]" @click="check(type[valueField])">
      <v-list-item-action>
        <v-checkbox v-model="checkList" color="green" :value="type[valueField]" @click.prevent=""></v-checkbox>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>{{ type[textField] }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: { selected: Array, array: Array, itemValue: String, itemText: String },
  name: 'SelectListConfirm',
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
      return this.checkList.length === this.array.length
    },
    likesSomeFruit() {
      return this.checkList.length > 0 && !this.likesAllFruit
    },
    icon() {
      if (this.likesAllFruit) return 'mdi-close-box'
      if (this.likesSomeFruit) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    }
  },
  mounted() {
    // this.checkList = _.cloneDeep(this.selected);
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
          this.checkList = []
        } else {
          this.checkList = _.map(this.array.slice(), this.valueField)
        }
      })
    },
    check(value) {
      if (_.includes(this.checkList, value)) {
        this.checkList = _.filter(this.checkList, function (n) {
          return n !== value
        })
      } else {
        this.checkList = _.concat(this.checkList.slice(), [value])
      }
    },
    emit() {
      this.$emit('checked', this.checkList)
    }
  }
}
</script>
