<template>
  <dialog-base title="위약률 수정" :instance="instance">
    <v-form ref="form" lazy-validation>
      <v-text-field v-model="calcPenaltyRule.bkpmsRate" label="위약률" maxlength="3" required suffix="%">
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
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  name: 'BkpmsRateUpdateDialog',
  extends: DialogBase,
  data () {
    return {
      calcPenaltyRule: {
        bkpmsStndDay: null,
        peakYn: null,
        wkendYn: null,
        bkpmsRate: 0
      }
    }
  },
  methods: {
    /**
     * 초기화
     */
    init () {
      this.calcPenaltyRule = {
        bkpmsStndDay: Number(this.instance.params.calcPenaltyRule.bkpmsStndDay),
        peakYn: this.instance.params.calcPenaltyRule.peakYn,
        wkendYn: this.instance.params.calcPenaltyRule.wkendYn,
        bkpmsRate: Number(this.instance.params.calcPenaltyRule.bkpmsRate || 0)
      }
    },
    /**
     * 저장
     */
    save () {
      const calcPenaltyRule = this.calcPenaltyRule
      if (calcPenaltyRule.bkpmsRate >= 0 && calcPenaltyRule.bkpmsRate <= 100) {
        this.close({
          calcPenaltyRule
        })
      } else {
        this.$dialog.alert('위약률은 0 ~ 100 사이의 값이어야 합니다.')
      }
    }
  }
}
</script>
