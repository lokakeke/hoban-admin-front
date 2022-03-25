<template>
  <dialog-base :title="`위약일기준 ${modeText}`" :instance="instance">
    <v-form ref="form" lazy-validation>
      <v-text-field v-model="bkpmsStndDay.value" label="위약일기준" maxlength="2" required suffix="일">
      </v-text-field>
      <v-row justify="end">
        <v-col cols="12" class="text-right">
          <v-btn
            outlined
            rounded
            color="info"
            @click="save()"
          >
            <v-icon>check</v-icon>
            저장
          </v-btn>
          <v-btn outlined rounded color="primary" @click="close()">
            <v-icon>close</v-icon>닫기
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from "@/components/Dialog/DialogBase"

export default {
  name: 'BkpmsStndDayUpdateDialog',
  extends: DialogBase,
  data () {
    return {
      bkpmsStndDay: {
        value: 0,
        orgValue: null
      }
    }
  },
  computed: {
    /**
     * 수정 여부
     */
    isUpdate () {
      return Boolean(this.instance.params.bkpmsStndDay)
    },
    /**
     * 등록/수정 명칭
     */
    modeText () {
      return this.isUpdate ? '수정' : '등록'
    }
  },
  methods: {
    /**
     * 초기화
     */
    init () {
      if (this.isUpdate) {
        this.bkpmsStndDay = _.cloneDeep(this.instance.params.bkpmsStndDay)
      }
    },
    /**
     * 저장
     */
    async save () {
      const bkpmsStndDayValue = Number(this.bkpmsStndDay.value)
      if (bkpmsStndDayValue < 1) {
        this.$dialog.alert('위약일기준은 1일 이상이어야 합니다.')
        return false
      }
      if (bkpmsStndDayValue !== Number(this.instance.params.bkpmsStndDay) &&
        this.instance.params.bkpmsStndDayList.findIndex(item => item.value === bkpmsStndDayValue) > -1) {
        this.$dialog.alert('이미 동일한 값으로 등록된 위약일기준이 존재합니다.')
        return false
      }
      if (this.isUpdate && this.bkpmsStndDay.orgValue !== bkpmsStndDayValue) {
        try {
          await this.$dialog.confirm('위약일기준을 수정하시겠습니까? 해당 기준에 등록된 위약률 정보도 같이 변경됩니다.')
        } catch {
          return false
        }
      }
      const bkpmsStndDay = this.bkpmsStndDay
      bkpmsStndDay.value = bkpmsStndDayValue
      this.close({
        bkpmsStndDay
      })
    }
  }
}
</script>
