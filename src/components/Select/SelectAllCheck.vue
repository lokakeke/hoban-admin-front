<template>
  <span class="pointer" @click="checkAll">
    <v-icon left>{{checkIcon}}</v-icon>{{text}}
  </span>
</template>

<script>
export default {
  props: {
    // 체크 리스트
    items: {
      type: Array,
      required: true
    },
    // 체크하고자 하는 필드
    checkField: {
      type: String,
      default () {
        return 'check'
      }
    },
    // 체크 true 값
    trueValue: {
      type: [Boolean, String],
      default () {
        return true
      }
    },
    // 체크 false 값
    falseValue: {
      type: [Boolean, String],
      default () {
        return false
      }
    },
    // 전체선택 text
    text: {
      type: String,
      default () {
        return '전체선택'
      }
    }
  },
  name: 'SelectAllCheck',
  computed: {
    checkIcon () {
      const length = this.items.length
      const checked = this.items.filter(data => data[this.checkField] === this.trueValue).length
      if (length > 0) {
        if (length === checked) {
          return 'check_box'
        } else if (checked > 0) {
          return 'indeterminate_check_box'
        } else {
          return 'check_box_outline_blank'
        }
      } else {
        return 'check_box_outline_blank'
      }
    }
  },
  methods: {
    /**
     * 전체 선택 체크
     */
    checkAll () {
      // 전체 갯수
      const length = this.items.length
      if (length > 0) {
        // 체크되어 있는 갯수
        const checked = this.items.filter(data => data[this.checkField] === this.trueValue).length
        // 전체 선택 되어있는지 확인
        const checkAll = length === checked
        for (const row of this.items) {
          // 전체 선택되어있다면 전체 해제 아니면 전체 체크
          row[this.checkField] = checkAll ? this.falseValue : this.trueValue
        }
      }
    }
  }
}
</script>
