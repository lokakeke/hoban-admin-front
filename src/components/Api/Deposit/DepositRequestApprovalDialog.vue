<template>
  <dialog-base title="승인/반려" :instance="instance">
    <v-form ref="form" lazy-validation v-if="form">
      <v-row>
        <v-col cols="12">
          <v-label>입금구분</v-label>
          <v-autocomplete
            v-model="form.aprlCd"
            :items="aprlCdList"
            item-value="commCd"
            item-text="commCdNm"
            :rules="[...emptyRules, v => v !== 'A' || '승인완료 혹은 반려를 선택해 주세요.']"
            autocomplete="off"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" v-if="form.aprlCd === 'C'">
          <v-label>반려사유</v-label>
          <v-textarea auto-grow no-resize rows="1" v-model="form.memo"></v-textarea>
        </v-col>
      </v-row>
      <v-row justify="end" class="mt-5">
        <v-col cols="12" class="text-right">
          <v-btn outlined rounded color="info" @click="approval" v-if="writeAuth">
            <v-icon>check</v-icon>
            확인
          </v-btn>
          <v-btn outlined rounded color="primary" @click="close">
            <v-icon>close</v-icon>닫기
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from "@/components/Dialog/DialogBase"
import commonCodeService from "Api/modules/system/commonCode.service"
import depositRequestService from "Api/modules/api/depositRequest.service"

export default {
  name: 'DepositRequestApprovalDialog',
  extends: DialogBase,
  data () {
    return {
      // 폼
      form: null,
      // 승인코드 목록
      aprlCdList: []
    }
  },
  methods: {
    /**
     * 초기화
     */
    init () {
      this.selectAprlCdList()
      this.form = _.cloneDeep(this.instance.params.depositRequest)
    },
    /**
     * 승인코드 목록 조회
     */
    async selectAprlCdList () {
      this.aprlCdList = []
      try {
        const response = await commonCodeService.selectCommonCode('COMM0003')
        this.aprlCdList = response.data
      } catch (e) {
        console.error(e)
      }
    },
    /**
     * 승인/반려
     */
    approval () {
      this.validForm(this.$refs.form).then(() => {
        depositRequestService
          .approvalDepositRequest({
            appSeq: this.form.appSeq,
            aprlCd: this.form.aprlCd,
            memo: this.form.aprlCd === 'C' ? this.form.memo : null
          })
          .then(res => {
            this.$dialog.alert('완료되었습니다.')
            this.close()
          })
      })
    }
  }
}
</script>
