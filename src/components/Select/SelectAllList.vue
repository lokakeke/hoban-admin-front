<template>
  <div>
    <v-autocomplete v-model="list"
                    autocomplete="off"
                    :items="items"
                    :item-value="itemValue"
                    :item-text="itemText"
                    :label="label"
                    :rules="required? emptyRules: undefined"
                    :clearable="clearable"
                    :multiple="multiple"
                    :chips="chips"
                    :small-chips="smallChips"
                    :deletable-chips="deletableChips"
                    :no-data-text="noDataText"
                    :placeholder="placeholder"
                    :return-object="returnObject"
                    :dense="dense"
                    :single-line="singleLine"
                    :search-input.sync="searchInput"
                    :prefix="prefix"
                    :class="classes"
                    @change="emit"
                    @click:clear="emit">
      <template v-slot:prepend-item v-if="!searchInput">
        <v-list-item @click="checkAll">
          <v-list-item-action>
            <v-icon>{{icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>전체 선택</v-list-item-content>
        </v-list-item>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
export default {
  name: 'SelectAllList',
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    },
    items: {
      type: Array,
      default () {
        return []
      }
    },
    itemValue: {
      type: String,
      default () {
        return 'value'
      }
    },
    itemText: {
      type: [String, Function],
      default () {
        return 'label'
      }
    },
    label: {
      type: String,
      default () {
        return ''
      }
    },
    noDataText: {
      type: String,
      default () {
        return '결과 값이 없습니다.'
      }
    },
    placeholder: {
      type: String,
      default () {
        return ''
      }
    },
    multiple: {
      type: Boolean,
      default () {
        return false
      }
    },
    clearable: {
      type: Boolean,
      default () {
        return false
      }
    },
    deletableChips: {
      type: Boolean,
      default () {
        return false
      }
    },
    chips: {
      type: Boolean,
      default () {
        return false
      }
    },
    smallChips: {
      type: Boolean,
      default () {
        return false
      }
    },
    dense: {
      type: Boolean,
      default () {
        return false
      }
    },
    singleLine: {
      type: Boolean,
      default () {
        return false
      }
    },
    returnObject: {
      type: Boolean,
      default () {
        return false
      }
    },
    required: {
      type: Boolean,
      default () {
        return false
      }
    },
    prefix: {
      type: String,
      default () {
        return ''
      }
    },
    classes: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      list: [],
      searchInput: ''
    }
  },
  computed: {
    icon () {
      if (this.items.length === 0) {
        return 'check_box_outline_blank'
      } else {
        if (this.list.length === 0) {
          return 'check_box_outline_blank'
        } else if (this.list.length === this.items.length) {
          return 'check_box'
        } else {
          return 'indeterminate_check_box'
        }
      }
    }
  },
  created () {
    this.value.forEach(item => {
      this.list.push(item)
    })
  },
  methods: {
    checkAll () {
      if (this.items.length !== 0) {
        if (this.list.length === this.items.length) {
          this.list = []
        } else {
          const list = []
          for (const item of this.items) {
            if (this.returnObject) {
              list.push(item)
            } else {
              list.push(item[this.itemValue])
            }
          }
          this.list = list
        }
        this.emit()
      }
    },
    emit () {
      this.$emit('input', this.list)
    }
  }
}
</script>
