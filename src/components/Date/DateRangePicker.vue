<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-row no-gutters v-on="on">
        <v-col style="max-width: 100px">
          <v-text-field
            v-model="inputFromDate"
            :label="label"
            :placeholder="hidePlaceholder? '' : '부터'"
            :clearable="clearable"
            hide-details
            :required="required"
            :readonly="readonly"
            :disabled="disabled"
            :suffix="hidePlaceholder && !inputFromDate ? '' : '~'"
            v-mask="textMask"
            :error="isInvalidForm"
            @blur="isTouch = true"
            :dense="dense"
          ></v-text-field>
        </v-col>
        <v-col class="flex-grow-1">
          <v-text-field
            v-model="inputToDate"
            append-icon="zmdi zmdi-calendar-note"
            :placeholder="hidePlaceholder? '' : '까지'"
            :required="required"
            :clearable="clearable"
            hide-details
            :readonly="readonly"
            :disabled="disabled"
            prefix="ㅤ"
            v-mask="textMask"
            :error="isInvalidForm"
            @blur="isTouch = true"
            autocomplete="off"
            :dense="dense"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <div class="v-text-field__details mt-2" v-if="hideDetails !== true">
            <div class="v-messages error--text" role="alert" v-if="isInvalidForm">
              <div class="v-messages__wrapper">
                <div class="v-messages__message">{{ errorMessage }}</div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </template>
    <v-date-picker
      :value="pickerDateArray"
      :locale="locale"
      :day-format="getDayFormat"
      :allowed-dates="allowedDates"
      :min="min"
      :max="max"
      :readonly="readonly"
      :show-current="showCurrent"
      :disabled="disabled"
      color="info"
      no-title
      scrollable
      range
      @input="chooseDate"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import DatePicker from 'Components/Date/DatePicker.vue'

export default {
  name: 'DateRangePicker',
  extends: DatePicker,
  model: {
    prop: 'valueArray',
    event: 'change'
  },
  props: {
    /**
     * 기간 [YYYYMMDD, YYYYMMDD]
     */
    valueArray: {
      type: [Array, String]
    },
    /**
     * Place holder 감춤여부
     */
    hidePlaceholder: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data: () => ({
    /**
     * 입력한 기간시작날짜
     */
    inputFromDate: '',
    /**
     * 입력한 기간종료날짜
     */
    inputToDate: '',
    /**
     * 1회이상 변경이 일어났는지 여부
     */
    isTouch: false
  }),
  computed: {
    /**
     * picker에서 선택한 날짜
     */
    pickerDateArray () {
      const pickerDateArray = []
      const inputDateArray = [this.inputFromDate, this.inputToDate]
      inputDateArray.forEach(inputDateItem => {
        if (this.validateDate(inputDateItem) === true) {
          pickerDateArray.push(inputDateItem)
        }
      })
      return pickerDateArray
    },
    /**
     * text-field mask
     */
    textMask () {
      return this.viewFormat.replace(/[YMDymd]/gi, '#')
    },
    /**
     * 폼 오류 여부
     */
    isInvalidForm () {
      return this.isTouch === true && this.validateDateField() === false
    }
  },
  watch: {
    valueArray: {
      handler (newVal, oldVal) {
        if (
          newVal &&
          typeof newVal.forEach === 'function' &&
          newVal.length > 0
        ) {
          if (
            newVal.length >= 1 &&
            moment(newVal[0], this.format).format(this.format) === newVal[0]
          ) {
            const rawInputFromDate = moment(newVal[0], this.format)
            if (rawInputFromDate.format(this.format) === newVal[0]) {
              this.inputFromDate = rawInputFromDate.format(this.viewFormat)
            } else {
              this.inputFromDate = null
            }
          }
          if (
            newVal.length >= 2 &&
            moment(newVal[1], this.format).format(this.format) === newVal[1]
          ) {
            const rawInputToDate = moment(newVal[1], this.format)
            if (rawInputToDate.format(this.format) === newVal[1]) {
              this.inputToDate = rawInputToDate.format(this.viewFormat)
            } else {
              this.inputToDate = null
            }
          }
        } else {
          this.inputFromDate = null
          this.inputToDate = null
        }
      },
      immediate: true
    },
    inputFromDate (newVal, oldVal) {
      this.emitChange(newVal, this.inputToDate)
    },
    inputToDate (newVal, oldVal) {
      this.emitChange(this.inputFromDate, newVal)
    }
  },
  methods: {
    /**
     * 날짜 입력값 변경 시 change event 발생
     */
    emitChange (inputFromDate, inputToDate) {
      let returnDateArray = []
      returnDateArray.push(
        this.validateDate(inputFromDate)
          ? moment(inputFromDate).format(this.format)
          : null
      )
      returnDateArray.push(
        this.validateDate(inputToDate)
          ? moment(inputToDate).format(this.format)
          : null
      )
      if (returnDateArray[0] && returnDateArray[1]) {
        returnDateArray = _.sortBy(returnDateArray)
      }
      this.$emit('change', returnDateArray)
    },
    /**
     * 날짜 입력 필드 유효성 확인
     */
    validateDateField () {
      if (this.required === false && (!this.inputFromDate && !this.inputToDate)) {
        return true
      }
      return ((this.required === false && !this.inputFromDate) || this.validateDate(this.inputFromDate)) &&
      ((this.required === false && !this.inputToDate) || this.validateDate(this.inputToDate))
    },
    /**
     * 날짜 선택
     */
    chooseDate (value) {
      if (value.length === 1) {
        this.inputFromDate = moment(value[0]).format(this.viewFormat)
        this.inputToDate = null
      } else if (value.length === 2) {
        const dateArray = _.sortBy(value)
        this.inputFromDate = moment(dateArray[0]).format(this.viewFormat)
        this.inputToDate = moment(dateArray[1]).format(this.viewFormat)
      }
    }
  }
}
</script>
