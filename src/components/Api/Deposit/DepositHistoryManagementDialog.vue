<template>
  <dialog-base title="예치금 이력 조회" :instance="instance">
    <v-form ref="form" lazy-validation v-if="form">
      <v-row>
        <v-col cols="3">
          <v-label>이력순번</v-label>
          <v-text-field :value="form.hisSeq" label readonly></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-label>예치금KEY</v-label>
          <v-text-field :value="form.depoKey" label readonly></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-label>파트너명</v-label>
          <v-text-field :value="form.ptnrNm" label readonly></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-label>금액구분</v-label>
          <v-text-field :value="form.amtIndNm" label readonly></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-label>금액</v-label>
          <v-text-field :value="form.amt | price" prefix="￦" readonly></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-label>예치금 신청순번</v-label>
          <v-text-field :value="form.appSeq" readonly></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-label>예치금 변경 후 금액</v-label>
          <v-text-field :value="form.prcpAmt | price" prefix="￦" readonly></v-text-field>
        </v-col>
      </v-row>
      <hr class="mt-5 mb-5" />
      <v-row>
        <template v-if="isSocial === true">
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
        </template>
        <template v-else-if="isOta === true">
          <v-col cols="3">
            <v-label>회원번호</v-label>
            <v-text-field :value="form.memNo" readonly></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>예약번호</v-label>
            <v-text-field :value="form.rsvNo" readonly></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>예약KEY번호</v-label>
            <v-text-field :value="form.keyRsvNo" readonly></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>영업장</v-label>
            <v-text-field :value="form.storeNm" readonly></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>객실명</v-label>
            <v-text-field :value="form.rmTypeNm" readonly></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>이용일자</v-label>
            <v-text-field :value="form.ciYmd | date" readonly></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>박수</v-label>
            <v-text-field :value="form.nights" readonly></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>실수</v-label>
            <v-text-field :value="form.rmCnt" readonly></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>이용자성명</v-label>
            <v-text-field :value="form.rsvGuestNm" readonly></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>이용자 휴대전화번호</v-label>
            <v-text-field :value="form.rsvGuestMpNo" readonly></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-label>예약상태</v-label>
            <v-text-field :value="form.rsvStatNm" readonly></v-text-field>
          </v-col>
        </template>
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
import DialogBase from "@/components/Dialog/DialogBase"
import depositHistoryService from "Api/modules/api/depositHistory.service"

export default {
  name: 'DepositHistoryManagementDialog',
  extends: DialogBase,
  data () {
    return {
      // 폼
      form: null
    }
  },
  computed: {
    /**
     * 소셜 메뉴인지 여부
     */
    isSocial () {
      return this.$route.path.indexOf('/social') === 0
    },
    /**
     * OTA 메뉴인지 여부
     */
    isOta () {
      return this.$route.path.indexOf('/ota') === 0
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
      const res = await depositHistoryService.selectDepositHistory(
        this.instance.params.item.hisSeq
      )
      return res.data
    }
  }
}
</script>
