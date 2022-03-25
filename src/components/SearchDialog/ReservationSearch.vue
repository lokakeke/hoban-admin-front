<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <v-icon left>search</v-icon> 예약정보 상세
    </template>
    <v-row v-if="form">
      <v-col cols="3">
        <div class="v-label font-weight-bold info--text">예약 번호</div>
        <v-text-field :value="form.rsvNo" hide-details readonly></v-text-field>
      </v-col>
      <v-col cols="3">
        <div class="v-label font-weight-bold info--text">예약 블럭</div>
        <v-text-field :value="form.rsvBlck + ' - ' + form.rsvBlckCd" hide-details readonly></v-text-field>
      </v-col>
      <v-col cols="3">
        <div class="v-label font-weight-bold info--text">KEY 예약 번호</div>
        <v-text-field :value="form.keyRsvNo" hide-details readonly></v-text-field>
      </v-col>
      <v-col cols="3">
        <div class="v-label font-weight-bold info--text">예약 상태</div>
        <v-text-field :value="form.rsvState" hide-details readonly></v-text-field>
      </v-col>
      <v-col cols="3">
        <div class="v-label font-weight-bold info--text">예약자 명</div>
        <v-text-field :value="form.rsvGuestlnm" hide-details readonly></v-text-field>
      </v-col>
      <v-col cols="3">
        <div class="v-label font-weight-bold info--text">예약자 연락처</div>
        <v-text-field :value="form.rsvGuestTelNo" hide-details readonly></v-text-field>
      </v-col>
      <v-col cols="3">
        <div class="v-label font-weight-bold info--text">이용자 명</div>
        <v-text-field :value="form.guestNm" hide-details readonly></v-text-field>
      </v-col>
      <v-col cols="3">
        <div class="v-label font-weight-bold info--text">이용자 연락처</div>
        <v-text-field :value="form.smsPhone" hide-details readonly></v-text-field>
      </v-col>
      <v-col cols="6">
        <div class="v-label font-weight-bold info--text">영업장</div>
        <v-text-field :value="form.storeNm + ' - ' + form.storeCd" hide-details readonly></v-text-field>
      </v-col>
      <v-col cols="6">
        <div class="v-label font-weight-bold info--text">객실 유형</div>
        <v-text-field :value="form.rmTypeNm + ' - ' + form.rmTypeCd" hide-details readonly></v-text-field>
      </v-col>
      <v-col cols="12" v-if="form.cancelResnDesc">
        <div class="v-label font-weight-bold info--text">취소 사유</div>
        <v-text-field :value="form.cancelResnDesc" hide-details readonly></v-text-field>
      </v-col>
      <v-col cols="12">
        <div class="v-label font-weight-bold info--text">{{isPkg ? '패키지 정보' : '회원 정보'}}</div>
        <v-text-field :value="form.memNm + ' - ( ' + form.memNo + ' )'" hide-details readonly></v-text-field>
      </v-col>
      <v-col cols="6">
        <div class="v-label font-weight-bold info--text">체크인 / 체크아웃</div>
        <v-text-field :value="checkDate" hide-details readonly></v-text-field>
      </v-col>
      <v-col cols="6">
        <div class="v-label font-weight-bold info--text">대매사</div>
        <v-text-field :value="(form.agentNm || '') + ' - ' + (form.agentCd || '')" hide-details readonly></v-text-field>
      </v-col>
      <v-col cols="3">
        <div class="v-label font-weight-bold info--text">박수</div>
        <v-text-field :value="form.nights" hide-details readonly></v-text-field>
      </v-col>
      <v-col cols="3">
        <div class="v-label font-weight-bold info--text">실수</div>
        <v-text-field :value="form.rmCnt" hide-details readonly></v-text-field>
      </v-col>
      <v-col cols="3">
        <div class="v-label font-weight-bold info--text">입금가</div>
        <v-text-field :value="form.payAmt | price" hide-details readonly></v-text-field>
      </v-col>
      <v-col cols="3">
        <div class="v-label font-weight-bold info--text">판매가</div>
        <v-text-field :value="form.saleAmt | price" hide-details readonly></v-text-field>
      </v-col>
      <v-col cols="6">
        <div class="v-label font-weight-bold info--text">등록자</div>
        <v-text-field :value="form.crtNm" hide-details readonly></v-text-field>
      </v-col>
      <v-col cols="6">
        <div class="v-label font-weight-bold info--text">수정자</div>
        <v-text-field :value="form.updNm" hide-details readonly></v-text-field>
      </v-col>
    </v-row>
    <v-row v-else class="font-weight-bold title my-10" justify="center">
      예약정보 가 없습니다.
    </v-row>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import rsvService from 'Api/modules/ota/roomReservation.service'

export default {
  extends: DialogBase,
  name: 'ReservationSearch',
  data () {
    return {
      form: null,
      isPkg: false
    }
  },
  computed: {
    checkDate () {
      let text = ''
      if (this.form) {
        if (this.form.ciYmd && this.form.coYmd) {
          text += moment(this.form.ciYmd).format('YYYY-MM-DD') + ' / ' + moment(this.form.coYmd).format('YYYY-MM-DD')
        }
      }
      return text
    }
  },
  async mounted () {
    this.isPkg = this.instance.params.isPkg
    if (this.instance.params.keyRsvNo) {
      const res = await rsvService.selectReservationDetail(this.instance.params.keyRsvNo)
      this.form = res.data
    }
  }
}
</script>
