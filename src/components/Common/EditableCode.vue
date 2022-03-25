<template>
  <span
    class="font-weight-bold pointer"
    :class="{ small: small }"
    tabindex="0"
    :title="`클릭 시 ${codeDesc}를 선택할 수 있습니다.`"
    @focus="toggleEditable(true)"
    @click="toggleEditable(true)"
    v-if="isEditable !== true"
  >
    <v-chip x-small block class="mr-1" v-if="value.code">{{ value.code }}</v-chip>
    {{ selectedCodeText }}
  </span>
  <v-autocomplete
    v-model="value.code"
    :items="items"
    :item-text="getItemText"
    :item-value="itemValue"
    ref="codeAutocomplete"
    append-icon="keyboard_arrow_down"
    hide-details
    single-line
    :placeholder="`${codeDesc}를 선택해 주세요.`"
    :no-data-text="`해당하는 ${codeDesc}가 없습니다.`"
    :search-input.sync="searchValue"
    @blur="toggleEditable(false)"
    @input="changeValue"
    @change="changeValue"
    style="min-width: 100px;"
    v-else
  >
    <template v-slot:selection="{ item }">
      <v-chip x-small block class="mr-1">{{ item[itemValue] }}</v-chip>
      <small v-text="item[itemText]"></small>
    </template>
    <template v-slot:item="{ item }">
      <div class="data">
        <v-chip x-small block class="mr-1" v-html="getFilteredText(item[itemValue])"></v-chip>
        <small v-html="getFilteredText(item[itemText])"></small>
      </div>
    </template>
  </v-autocomplete>
</template>

<script>
import StringUtil from '@/utils/string.util'

export default {
  name: 'EditableCode',
  props: {
    /**
     * 코드
     */
    code: {
      type: [String, Number],
      default () {
        return null
      }
    },
    /**
     * 코드 설명
     */
    codeDesc: {
      type: String,
      default () {
        return '코드'
      }
    },
    /**
     * 코드 객체 목록
     */
    items: {
      type: Array,
      default () {
        return []
      }
    },
    /**
     * 코드 객체의 텍스트 이름
     */
    itemText: {
      type: String,
      default () {
        return 'text'
      }
    },
    /**
     * 코드 객체의 값 이름
     */
    itemValue: {
      type: String,
      default () {
        return 'value'
      }
    },
    /**
     * 글자 사이즈 작게
     */
    small: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      /**
       * 컴포넌트에서 사용하는 코드
       */
      value: {
        code: null
      },
      /**
       * 검색어
       */
      searchValue: null,
      /**
       * 수정 가능 여부
       */
      isEditable: false
    }
  },
  computed: {
    /**
     * 선택된 코드 텍스트
     */
    selectedCodeText () {
      if (!this.value.code) {
        return `(${this.codeDesc} 없음)`
      }
      const selectedCode = _.find(this.items, item => {
        return item[this.itemValue] === this.value.code
      })
      return selectedCode[this.itemText]
    }
  },
  created () {
    this.init()
  },
  watch: {
    code () {
      this.value.code = this.code
    }
  },
  methods: {
    /**
     * 초기화
     */
    init () {
      this.value.code = this.code
    },
    /**
     * 편집 가능/불가능으로 전환
     */
    toggleEditable (isEditable) {
      this.isEditable = isEditable
      if (isEditable === true) {
        this.$nextTick(() => {
          const compAutocomplete = this.$refs.codeAutocomplete
          compAutocomplete.$el.getElementsByTagName('input')[0].focus()
          compAutocomplete.activateMenu()
        })
      }
    },
    /**
     * 값 변경 시 event handler
     */
    changeValue () {
      this.toggleEditable(false)
      this.$emit('update:code', this.value.code)
      this.$emit('change')
    },
    /**
     * 아이템 텍스트 가져오기
     */
    getItemText (item) {
      return `${item[this.itemValue]} - ${item[this.itemText]}`
    },
    /**
     * 필터된 텍스트 칠하기
     */
    getFilteredText (text) {
      return StringUtil.getFilteredText(text, this.searchValue)
    }
  }
}
</script>

<style scoped>
.small {
  font-size: 11px !important;
}
.data {
  margin-right: 20px;
  max-width: 300px;
  white-space: nowrap;
}
</style>
