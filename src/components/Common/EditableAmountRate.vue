<template>
  <!-- 요금 출력/입력 -->
  <span
    class="font-weight-bold primary--text pointer"
    :class="{ small: small }"
    tabindex="0"
    title="클릭 시 입력할 수 있습니다."
    @focus="toggleEditable(true)"
    @click="toggleEditable(true)"
    v-if="ind !== 2 && isEditable !== true"
  >{{ amountText }}</span>
  <v-currency-field
    ref="amountField"
    dense
    v-model="value.amount"
    :rules="emptyRules"
    placeholder="요금"
    class="amber lighten-4 font-weight-bold body-2 text-right"
    suffix="원"
    hide-details
    :title="title"
    @blur="toggleEditable(false)"
    @dblclick="toggleRate"
    @keypress.space="toggleRate"
    @input="changeValue"
    @change="changeValue"
    v-else-if="ind !== 2 && isEditable === true"
  ></v-currency-field>
  <!-- 비율 출력/입력 -->
  <span
    class="font-weight-bold primary--text pointer"
    :class="{ small: small }"
    tabindex="0"
    title="클릭 시 입력할 수 있습니다."
    @focus="toggleEditable(true)"
    @click="toggleEditable(true)"
    v-else-if="ind === 2 && isEditable !== true"
  >{{ rateText }}</span>
  <v-currency-field
    ref="rateField"
    dense
    v-model="value.rate"
    :rules="emptyRules"
    placeholder="비율"
    class="amber lighten-4 font-weight-bold body-2 text-right"
    suffix="%"
    hide-details
    :title="title"
    @blur="toggleEditable(false)"
    @dblclick="toggleAmount"
    @keypress.space="toggleAmount"
    @input="changeValue"
    @change="changeValue"
    v-else-if="ind === 2 && isEditable === true"
  ></v-currency-field>
</template>

<script>
export default {
  name: 'EditableAmountRate',
  props: {
    /**
     * 요금 값
     */
    amount: {
      type: [String, Number],
      default () {
        return 0
      }
    },
    /**
     * 비율 값
     */
    rate: {
      type: [String, Number],
      default () {
        return 0
      }
    },
    /**
     * 요금/비율 여부 [1=요금|2=비율|그외=요금만 사용함]
     */
    ind: {
      type: [String, Number]
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
       * 컴포넌트에서 사용하는 요금/비율 값
       */
      value: {
        amount: 0,
        rate: 0,
        ind: 1
      },
      /**
       * 수정 가능 여부
       */
      isEditable: false
    }
  },
  computed: {
    /**
     * 입력 input title
     */
    title () {
      if (this.ind) {
        return `더블클릭 혹은 스페이스 키를 눌러 ${
          Number(this.ind) === 1 ? '요금' : '비율'
        } 입력으로 전환 할 수 있습니다.`
      } else {
        return '요금을 입력해 주세요.'
      }
    },
    /**
     * 요금 텍스트
     */
    amountText () {
      let amount = this.value.amount
      if (this.sign === true) {
        amount = Math.abs(amount)
      }
      return `${this.amountSign}${this.$options.filters.price(amount)} 원`
    },
    /**
     * 비율 텍스트
     */
    rateText () {
      let rate = this.value.rate
      if (this.sign === true) {
        rate = Math.abs(rate)
      }
      return `${this.rateSign}${this.$options.filters.price(rate)} %`
    },
    /**
     * 요금 부호
     */
    amountSign () {
      if (this.small === true) {
        return `${this.value.amount >= 0 ? '+' : '-'} `
      } else {
        return ''
      }
    },
    /**
     * 비율 부호
     */
    rateSign () {
      if (this.small === true) {
        return `${this.value.rate >= 0 ? '+' : '-'} `
      } else {
        return ''
      }
    }
  },
  created () {
    this.init()
  },
  watch: {
    amount () {
      this.value.amount = this.amount
    },
    rate () {
      this.value.rate = this.rate
    },
    ind () {
      this.value.ind = this.ind
    }
  },
  methods: {
    /**
     * 초기화
     */
    init () {
      this.value.amount = this.amount
      this.value.rate = this.rate
      this.value.ind = this.ind
    },
    /**
     * 편집 가능/불가능으로 전환
     */
    toggleEditable (isEditable) {
      this.isEditable = isEditable
      if (isEditable === true) {
        this.$nextTick(() => {
          const refName = `${
            Number(this.value.ind || 1) !== 2 ? 'amount' : 'rate'
          }Field`
          this.$refs[refName].$el.getElementsByTagName('input')[0].focus()
        })
      }
    },
    /**
     * 비율 입력으로 전환
     */
    toggleRate () {
      if (this.value.ind) {
        this.value.ind = 2
        this.$emit('update:ind', this.value.ind)
        this.$emit('change')
      }
    },
    /**
     * 요금 입력으로 전환
     */
    toggleAmount () {
      if (this.value.ind) {
        this.value.ind = 1
        this.$emit('update:ind', this.value.ind)
        this.$emit('change')
      }
    },
    /**
     * 값 변경 시 event handler
     */
    changeValue () {
      this.$emit('update:amount', this.value.amount)
      this.$emit('update:rate', this.value.rate)
      this.$emit('update:ind', this.value.ind)
      this.$emit('change')
    }
  }
}
</script>

<style scoped>
.small {
  font-size: .7em;
}
</style>
