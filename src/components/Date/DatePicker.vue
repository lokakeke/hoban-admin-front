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
      <input style="opacity: 0; position: absolute;" /><!-- autocomplete 방지 -->
      <v-text-field
        v-model="inputDate"
        :append-icon="prependIcon? '': 'zmdi zmdi-calendar-note'"
        :prepend-inner-icon="prependIcon? 'zmdi zmdi-calendar-note': ''"
        :append-outer-icon="appendOuterIcon"
        :label="label"
        :placeholder="placeholder"
        :required="required"
        :clearable="clearable"
        :hide-details="hideDetails"
        :full-width="fullWidth"
        :validate-on-blur="validateOnBlur"
        :readonly="readonly"
        :disabled="disabled"
        v-mask="textMask"
        v-on="on"
        :dense="dense"
        :background-color="backgroundColor"
        :rules="[ validateDateField(inputDate) || errorMessage ]"
      ></v-text-field>
    </template>
    <v-date-picker
      :value="pickerDate"
      :type="type"
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
      @input="chooseDate"
    ></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  name: 'DatePicker',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    /**
     * 날짜 [YYYYMMDD]
     */
    value: {
      type: String
    },
    /**
     * 날짜의 포맷
     */
    format: {
      type: String,
      default () {
        return 'YYYYMMDD'
      }
    },
    /**
     * 보여지는 날짜의 포맷
     */
    viewFormat: {
      type: String,
      default () {
        return 'YYYY-MM-DD'
      }
    },
    /**
     * 올바르지 않은 날짜 선택 시 출력되는 오류 메세지
     */
    errorMessage: {
      type: String,
      default () {
        return '올바른 날짜를 선택해 주세요.'
      }
    },
    /**
     * v-text-field: label
     */
    label: {
      type: String
    },
    /**
     * v-text-field: placeholder
     */
    placeholder: {
      type: String
    },
    /**
     * v-text-field: required
     */
    required: {
      type: Boolean
    },
    /**
     * v-text-field: clearable
     */
    clearable: {
      type: Boolean
    },
    /**
     * v-text-field: hide-details
     */
    hideDetails: {
      type: Boolean
    },
    /**
     * v-text-field: full-width
     */
    fullWidth: {
      type: Boolean
    },
    /**
     * v-text-field: validate-on-blur
     */
    validateOnBlur: {
      type: Boolean
    },
    /**
     * v-text-field: background-color
     */
    backgroundColor: {
      type: String
    },
    /**
     * v-date-picker: locale
     */
    locale: {
      type: String,
      default () {
        return 'ko-KR'
      }
    },
    /**
     * v-date-picker: allowed-dates
     */
    allowedDates: {
      type: Function
    },
    /**
     * v-date-picker: min
     */
    min: {
      type: String
    },
    /**
     * v-date-picker: max
     */
    max: {
      type: String
    },
    /**
     * v-date-picker: readonly
     */
    readonly: {
      type: Boolean
    },
    /**
     * v-date-picker: disabled
     */
    disabled: {
      type: Boolean
    },
    /**
     * v-date-picker: show-current
     */
    showCurrent: {
      type: [Boolean, String],
      default () {
        return false
      }
    },
    /**
     * v-text-field: dense
     */
    dense: {
      type: Boolean,
      default () {
        return false
      }
    },
    type: {
      type: String,
      default () {
        return 'date'
      }
    },
    prependIcon: {
      type: Boolean,
      default () {
        return false
      }
    },
    appendOuterIcon: {
      type: String,
      default () {
        return ''
      }
    }
  },
  data: () => ({
    /**
     * 메뉴 toggle
     */
    menu: false,
    /**
     * 입력한 날짜
     */
    inputDate: null
  }),
  computed: {
    /**
     * picker에서 선택한 날짜
     */
    pickerDate () {
      if (this.validateDate(this.inputDate) === true) {
        return this.inputDate
      }
      return null
    },
    /**
     * text-field mask
     */
    textMask () {
      return this.viewFormat.replace(/[YMDymd]/gi, '#')
    }
  },
  watch: {
    value: {
      handler (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          const inputDate = moment(newVal).format(this.viewFormat)
          this.inputDate = (inputDate || '').toLowerCase() === 'invalid date' ? null : inputDate
        } else if (newVal === null || newVal === undefined) {
          this.inputDate = null
        }
      },
      immediate: true
    },
    inputDate (newVal, oldVal) {
      if (this.validateDate(newVal) === false) {
        this.$emit('change', '')
      } else if (newVal && newVal !== oldVal) {
        this.$emit('change', moment(newVal).format(this.format))
      }
    }
  },
  methods: {
    /**
     * 일 표시
     */
    getDayFormat (value) {
      const date = moment(value)
      if (date.isValid() === true) {
        return date.format('D')
      }
      return ''
    },
    /**
     * 날짜 유효성 확인
     */
    validateDate (date) {
      if (date === 'Invalid date') {
        date = null
      }
      if (date && moment(date, this.viewFormat).format(this.viewFormat) !== date) {
        return false
      }
      const dateObj = moment(date)
      if (dateObj.isValid() === false) {
        return false
      }
      if (this.min && moment(this.min).isAfter(dateObj)) {
        return false
      }
      if (this.max && moment(this.max).isBefore(dateObj)) {
        return false
      }
      if (this.allowedDates && this.allowedDates(date) === false) {
        return false
      }
      return true
    },
    /**
     * 날짜 입력 필드 유효성 확인
     */
    validateDateField (value) {
      if (this.required === false && !value) {
        return true
      }
      return this.validateDate(value)
    },
    /**
     * 날짜 선택
     */
    chooseDate (value) {
      this.inputDate = value
      this.menu = false
    }
  }
}
</script>
