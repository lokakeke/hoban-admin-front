<template>
  <!-- 요금 출력/입력 -->
  <span
    class="font-weight-bold primary--text pointer"
    :class="{ small: small }"
    tabindex="0"
    title="클릭 시 입력할 수 있습니다."
    @focus="toggleEditable(true)"
    @click="toggleEditable(true)"
    v-if="isEditable !== true"
  >{{ text }}</span>
  <v-currency-field
    ref="editableField"
    dense
    v-model="model"
    :rules="emptyRules"
    placeholder="값을 입력해 주세요."
    class="amber lighten-4 font-weight-bold body-2 text-right"
    :suffix="suffix"
    hide-details
    :title="'클릭 시 입력할 수 있습니다'"
    @blur="toggleEditable(false)"
    @input="changeValue"
    @change="changeValue"
    v-else-if="type !== 'text'"
  ></v-currency-field>
  <v-text-field
    ref="editableField"
    dense
    v-model="model"
    :rules="emptyRules"
    class="amber lighten-4 font-weight-bold body-2 text-right"
    hide-details
    :suffix="suffix"
    @blur="toggleEditable(false)"
    @input="changeValue"
    @change="changeValue"
    v-else
  ></v-text-field>
</template>

<script>
export default {
  name: 'EditableText',
  props: {
    /**
       * model 값
       */
    value: {
      type: [String, Number],
      default () {
        return ''
      }
    },
    /**
       * 입력 타입 [text/number/rate/amount]
       */
    type: {
      type: String,
      default () {
        return 'text'
      }
    },
    suffix: {
      type: String,
      default () {
        return '개'
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
    },
    /**
     * 부호(+, -) 사용 여부
     */
    sign: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      /**
         * 컴포넌트에서 model
         */
      model: '',
      /**
         * 수정 가능 여부
         */
      isEditable: false
    }
  },
  computed: {
    /**
       * 요금 텍스트
       */
    text () {
      if (this.type === 'text') {
        return `${this.model} ${this.suffix}`
      } else {
        const amount = Math.abs(this.model)
        if (this.sign) {
          return `${this.model >= 0 ? '+' : '-'}${this.$options.filters.price(amount)} ${this.suffix}`
        } else {
          return `${this.model >= 0 ? '' : '-'}${this.$options.filters.price(amount)} ${this.suffix}`
        }
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    /**
       * 초기화
       */
    init () {
      if (!this.value) {
        if (this.type === 'string') {
          this.model = ''
        } else {
          this.model = 0
        }
      } else {
        this.model = this.value
      }
    },
    /**
       * 편집 가능/불가능으로 전환
       */
    toggleEditable (isEditable) {
      this.isEditable = isEditable
      if (isEditable === true) {
        this.$nextTick(() => {
          const refName = 'editableField'
          this.$refs[refName].$el.getElementsByTagName('input')[0].focus()
        })
      } else {
        this.$emit('blur', this.model)
      }
    },
    /**
       * 값 변경 시 event handler
       */
    changeValue () {
      this.$emit('input', this.model)
    }
  }
}
</script>

<style scoped>
  .small {
    font-size: .7em;
  }
</style>
