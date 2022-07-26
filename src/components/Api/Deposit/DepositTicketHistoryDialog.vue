<template>
  <dialog-base title="예치금 이력 조회" :instance="instance">
    <v-form ref="form" lazy-validation v-if="form">
      <v-row>
        <v-col cols="3">
          <v-label>이력순번</v-label>
          <v-text-field :value="form.historySeq" label readonly></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-label>예치금KEY</v-label>
          <v-text-field :value="form.depositKey" label readonly></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-label>파트너명</v-label>
          <v-text-field :value="form.partnerName" label readonly></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-label>금액구분</v-label>
          <v-text-field :value="form.rsvTypeName" label readonly></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-label>금액</v-label>
          <v-text-field :value="form.price | price" prefix="￦" readonly></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-label>예치금 신청순번</v-label>
          <v-text-field :value="form.reqSeq" readonly></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-label>예치금 변경 후 금액</v-label>
          <v-text-field :value="form.originPrice | price" prefix="￦" readonly></v-text-field>
        </v-col>
      </v-row>
      <hr class="mt-5 mb-5" />
      <v-row>
          <v-col cols="3">
            <v-label>우대번호</v-label>
            <v-text-field :value="form.ticketNo" readonly></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>우대순번</v-label>
            <v-text-field :value="form.ticketSeq" readonly></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>업체번호</v-label>
            <v-text-field :value="form.ptnrRecpNo" readonly></v-text-field>
          </v-col>
      </v-row>
      <v-row justify="end" class="mt-5">
        <v-btn outlined rounded color="primary" @click="close()">
          <v-icon>close</v-icon>닫기
        </v-btn>
      </v-row>
    </v-form>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import depositHistoryService from '@/api/modules/api/depositHistory.service'

export default {
  name: 'DepositHistoryDialog',
  extends: DialogBase,
  data () {
    return {
      // 폼
      form: null
    }
  },
  methods: {
    /**
     * 초기화
     */
    async init () {
      try {
        const depositHistory = await this.select()
        this.form = _.cloneDeep(depositHistory)
      } catch (e) {
        console.error(e)
        this.$dialog.alert('오류가 발생하였습니다.')
        this.close()
      }
    },
    /**
     * 상세 조회
     */
    async select () {
      const res = await depositHistoryService.selectTicketDepositHistory(
        this.instance.params.item.historySeq
      )
      return res.data
    }
  }
}
</script>
