<template>
  <dialog-base title="오류 추천 처리" :instance="instance">
    <v-form ref="form" lazy-validation>
      <h2 class="text-center">오류를 처리완료로 변경합니다.</h2>
      <v-row class="mt-6">
        <v-col cols="12">
          <v-label>처리메모</v-label>
          <v-text-field v-model="form.memo" maxlength="500" placeholder="메모를 입력해 주세요"></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="end" class="mt-5">
        <v-col cols="12" class="text-right">
          <v-btn
            outlined
            rounded
            color="info"
            @click="processErrorGuidance()"
          >
            <v-icon>check</v-icon>처리
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
import errorGuidanceService from "Api/modules/api/errorGuidance.service"

export default {
  name: 'ErrorGuidanceViewDialog',
  extends: DialogBase,
  data () {
    return {
      form: {
        memo: null
      }
    }
  },
  computed: {
    /**
     * OTA 여부
     */
    isOta () {
      return Boolean(this.$route.path.indexOf('/ota') === 0)
    },
    /**
     * Social 여부
     */
    isSocial () {
      return Boolean(this.$route.path.indexOf('/social') === 0)
    },
    /**
     * 업무유형 [ota|social]
     */
    taskType () {
      if (this.isOta === true) {
        return 'ota'
      } else if (this.isSocial === true) {
        return 'social'
      }
      return null
    }
  },
  methods: {
    /**
     * 오류 추천 처리
     */
    async processErrorGuidance () {
      try {
        await this.$dialog.confirm('오류를 처리완료 상태로 변경하시겠습니까?')
        if (!this.taskType) this.close()
        const errSeq = this.instance.params.errSeq
        if (!errSeq) this.close()
        const res = await errorGuidanceService.processErrorGuidance(
          this.taskType,
          {
            errSeq,
            memo: this.form.memo
          }
        )
        if (res.data > 0) {
          this.$dialog.alert('처리완료 상태로 변경되었습니다.')
        } else {
          this.$dialog.alert('처리완료 상태로 변경에 실패하였습니다.')
        }
        this.close()
      } catch {
        // 처리하지 않음
      }
    }
  }
}
</script>
