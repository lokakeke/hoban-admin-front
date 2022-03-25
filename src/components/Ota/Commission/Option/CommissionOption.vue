<template>
  <v-list-item
    :title="writeAuth ? '클릭 시 편집 가능합니다.' : ''"
    :input-value="highlight"
    color="green"
    @click.prevent="openConfigOptionDialog"
  >
    <v-list-item-icon class="drag-handle" style="cursor: move" v-if="writeAuth">
      <v-icon color="grey lighten-1" title="드래그하여 설정 위치를 변경 할 수 있습니다.">mdi-drag-vertical</v-icon>
    </v-list-item-icon>
    <v-list-item-content>{{ amtCndText }}</v-list-item-content>
    <v-list-item-action>
      <strong class="text-body-1">{{ option.cmsnAmt | price }}{{ option.cmsnTypeNm }}</strong>
    </v-list-item-action>
    <v-list-item-avatar v-if="writeAuth">
      <v-btn x-small icon color="error" @click.stop.prevent="deleteOption" title="삭제">
        <v-icon small>mdi-close</v-icon>
      </v-btn>
    </v-list-item-avatar>
  </v-list-item>
</template>

<script>
export default {
  name: 'CommissionOption',
  model: {
    prop: 'option',
    event: 'change'
  },
  props: {
    /**
     * 수수료 설정 객체
     */
    option: {
      type: Object,
      required: true
    },
    /**
     * 하이라이트 여부
     */
    highlight: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  computed: {
    /**
     * 수수료 조건 텍스트
     */
    amtCndText () {
      if (this.option.amtCndTypeCd !== 'AL') {
        // 조건유형 = "항상"이 아닌경우
        return `${this.$options.filters.price(this.option.amtCndVal)}원 ${
          this.option.amtCndTypeNm
        }`
      } else {
        // 조건유형 = "항상"인경우
        return this.option.amtCndTypeNm
      }
    }
  },
  methods: {
    /**
     * 수수료 설정 객체 수정 Dialog 열기
     */
    openConfigOptionDialog () {
      if (this.writeAuth) {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Ota/Commission/Option/CommissionOptionConfigDialog',
          params: {
            option: this.option
          },
          options: {
            width: '500px',
            fullscreen: false,
            scrollable: true,
            closeCallback: option => {
              if (option) {
                this.$emit('change', option)
              }
            }
          }
        })
      }
    },
    /**
     * 삭제
     */
    deleteOption () {
      this.$emit('delete')
    }
  }
}
</script>
