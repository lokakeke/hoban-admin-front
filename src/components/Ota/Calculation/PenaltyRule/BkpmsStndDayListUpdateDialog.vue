<template>
  <dialog-base title="위약일기준 수정" :instance="instance">
    <div class="grey--text text-center">
      <v-icon small left>mdi-alert</v-icon>
      <span>항목들을 편집 한 후 하단의 "적용" 버튼을 눌러야 목록에 반영됩니다.</span>
    </div>
    <div class="mt-6">
      <v-btn
        color="info"
        outlined
        rounded
        block
        @click="openBkpmsStndDayCreateDialog"
      >
        <v-icon left>add</v-icon>새로운 위약일기준 추가
      </v-btn>
    </div>
    <v-divider class="mt-6 mb-6"></v-divider>
    <transition-group name="slide-fade" tag="div">
      <v-card class="mb-3" :class="{ 'grey lighten-4' : isFixedItem(bkpmsStndDay) }" v-for="bkpmsStndDay in fixedBkpmsStndDayList" :key="bkpmsStndDay.value">
        <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <strong>{{ bkpmsStndDay | bkpmsStndDayText }}</strong>
                <v-chip x-small color="red" text-color="white" class="ml-1" v-if="bkpmsStndDay.orgValue === null">NEW</v-chip>
                <v-chip x-small color="green" text-color="white" class="ml-1" v-else-if="Number(bkpmsStndDay.value) !== Number(bkpmsStndDay.orgValue)">UPDATE</v-chip>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon :disabled="isFixedItem(bkpmsStndDay)" @click="openBkpmsStndDayUpdateDialog(bkpmsStndDay)" title="수정">
                <v-icon :color="isFixedItem(bkpmsStndDay) ? 'grey lighten-4' : 'primary'">edit</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <v-btn icon :disabled="isFixedItem(bkpmsStndDay)" @click="deleteBkpmsStndDay(bkpmsStndDay)" title="삭제">
                <v-icon :color="isFixedItem(bkpmsStndDay) ? 'grey lighten-4' : 'error'">mdi-trash-can-outline</v-icon>
              </v-btn>
            </v-list-item-action>
        </v-list-item>
      </v-card>
    </transition-group>
    <v-divider class="mt-6 mb-6"></v-divider>
    <div class="text-right">
      <v-btn
        color="info"
        outlined
        rounded
        @click="apply"
      >
        <v-icon left>check</v-icon>적용
      </v-btn>
      <v-btn
        color="error"
        outlined
        rounded
        @click="close"
      >
        <v-icon left>close</v-icon>취소
      </v-btn>
    </div>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'

export default {
  name: 'BkpmsStndDayListUpdateDialog',
  extends: DialogBase,
  data () {
    return {
      bkpmsStndDayList: []
    }
  },
  computed: {
    fixedBkpmsStndDayList () {
      const fixedBkpmsStndDayList = [...this.bkpmsStndDayList, {
        value: 0,
        orgValue: 0
      }, {
        value: -1,
        orgValue: -1
      }]
      return fixedBkpmsStndDayList.sort((a, b) => b.value - a.value)
    }
  },
  filters: {
    bkpmsStndDayText (bkpmsStndDay) {
      if (bkpmsStndDay.value === 0) {
        return '당일 취소'
      } else if (bkpmsStndDay.value === -1) {
        return 'NO SHOW'
      } else {
        return `${bkpmsStndDay.value}일 전 취소`
      }
    }
  },
  methods: {
    /**
     * 초기화
     */
    init () {
      this.bkpmsStndDayList = _.cloneDeep(this.instance.params.bkpmsStndDayList)
    },
    /**
     * 고정 항목 여부
     */
    isFixedItem (bkpmsStndDay) {
      return bkpmsStndDay.value < 1
    },
    /**
     * 위약일 기준 추가 Dialog 열기
     */
    openBkpmsStndDayCreateDialog () {
      this.openBkpmsStndDayUpdateDialog()
    },
    /**
     * 위약일 기준 수정 Dialog 열기
     */
    openBkpmsStndDayUpdateDialog (bkpmsStndDay) {
      if (bkpmsStndDay.value < 1) {
        return false
      }
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Calculation/PenaltyRule/BkpmsStndDayUpdateDialog.vue',
        params: {
          bkpmsStndDay,
          bkpmsStndDayList: this.bkpmsStndDayList
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 300,
          closeCallback: (params) => {
            if (params && params.bkpmsStndDay) {
              if (bkpmsStndDay) {
                const idx = this.bkpmsStndDayList.findIndex(item => Number(item.value) === Number(bkpmsStndDay.value))
                if (idx > -1) this.$set(this.bkpmsStndDayList, idx, params.bkpmsStndDay)
              } else {
                this.bkpmsStndDayList.push(params.bkpmsStndDay)
              }
            }
          }
        }
      })
    },
    /**
     * 위약일 기준 삭제
     */
    deleteBkpmsStndDay (bkpmsStndDay) {
      if (bkpmsStndDay.value < 1) {
        return false
      }
      const bkpmsStndDayText = this.$options.filters.bkpmsStndDayText(bkpmsStndDay)
      this.$dialog.confirm(`"${bkpmsStndDayText}" 항목을 삭제하시겠습니까? 해당 기준에 등록된 위약률 정보도 같이 삭제됩니다.`).then(() => {
        const idx = this.bkpmsStndDayList.findIndex(item => item.value === bkpmsStndDay.value)
        if (idx > -1) this.bkpmsStndDayList.splice(idx, 1)
      })
    },
    /**
     * 완료
     */
    apply () {
      this.$dialog.confirm('위약일기준을 적용하시겠습니까?').then(() => {
        this.close({
          bkpmsStndDayList: this.bkpmsStndDayList
        })
      })
    }
  }
}
</script>
