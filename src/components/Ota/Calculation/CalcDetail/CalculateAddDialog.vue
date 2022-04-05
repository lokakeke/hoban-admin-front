<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      정산 데이터 추가
    </template>
    <v-container fluid>
      <v-row>
        <v-col cols="9">
          <v-text-field
              v-model="keyRsvNo"
              :rules="[() => !!keyRsvNo || '예약번호를 입력해주세요']"
              placeholder="키 예약번호를 입력해주세요 (10자리)"
              clearable
              dense
              required
          />
        </v-col>
        <v-col cols="3" class="text-end">
          <v-btn @click="getReserveInformation()"
                 color="info"
                 rounded
                 outlined>
            <v-icon>search</v-icon>조회
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="isSearch">
        <v-col cols="12">
          <v-card>
            <v-card-title>예약정보</v-card-title>
            <v-card-text>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>회원(패키지)번호:</v-list-item-content>
                  <v-list-item-content>{{ rsvInfo.memNo }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>회원(패키지)명:</v-list-item-content>
                  <v-list-item-content>{{ rsvInfo.memName }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>투숙객명:</v-list-item-content>
                  <v-list-item-content>{{ rsvInfo.userName }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>입실일자:</v-list-item-content>
                  <v-list-item-content>{{ rsvInfo.ciYmd | date }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>퇴실일자:</v-list-item-content>
                  <v-list-item-content>{{ rsvInfo.coYmd | date }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>평형:</v-list-item-content>
                  <v-list-item-content>{{ rsvInfo.pyeongName }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>영업장:</v-list-item-content>
                  <v-list-item-content>{{ rsvInfo.storeName }}({{ rsvInfo.storeCd }})</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>객실번호:</v-list-item-content>
                  <v-list-item-content>{{ rsvInfo.rmNo }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>예약금액:</v-list-item-content>
                  <v-list-item-content>{{ rsvInfo.totAmt | price }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>후불금액:</v-list-item-content>
                  <v-list-item-content>{{ rsvInfo.aftpayAmt | price }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>예약상태:</v-list-item-content>
                  <v-list-item-content>{{ showRsvStatText }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>위약금액:</v-list-item-content>
                  <v-list-item-content>{{ rsvInfo.bkpmsAmt | price }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>소노금액:</v-list-item-content>
                  <v-list-item-content>{{ rsvInfo.aftpayAmt - rsvInfo.tpneAmt | price }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>TPNE금액:</v-list-item-content>
                  <v-list-item-content>{{ rsvInfo.tpneAmt | price }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>예약번호:</v-list-item-content>
                  <v-list-item-content>{{ rsvInfo.rsvNo }}</v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>입금현황 메모:</v-list-item-content>
                  <v-list-item-content>{{ rsvInfo.rcpmnyStatMemo }}</v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" class="text-end">
          <v-btn @click="add()"
                 outlined
                 rounded
                 color="primary"
          >
            <v-icon>add</v-icon> 추가
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import calculationService from '@/api/modules/ota/calculation.service'

export default {
  extends: DialogBase,
  name: 'CalculateAddDialog',
  data: function () {
    return {
      calcHisItem: null,
      keyRsvNo: null,
      rsvInfo: {},
      isSearch: false
    }
  },
  created () {
    this.calcHisItem = this.instance.params.calcHisItem
  },
  computed: {
    showRsvStatText () {
      let text = '-'
      switch (this.rsvInfo.rsvStatCd) {
        case 'CC':
          text = '취소'
          break
        case 'CI':
          text = '투숙'
          break
        case 'CO':
          text = '퇴실'
          break
        case 'NC':
          text = '노쇼해지'
          break
        case 'NS':
          text = '노쇼'
          break
        case 'RS':
          text = '예약'
          break
        default:
          break
      }

      return text
    }
  },
  methods: {
    async getReserveInformation () {
      const response = await calculationService.retrieveReserveInformation(this.calcHisItem.calcSeq, this.keyRsvNo)
      const data = response.data

      if (data.resultCode !== '0000') {
        this.isSearch = false
        return this.$dialog.alert(data.resultMsg)
      }

      this.isSearch = true
      this.rsvInfo = data.resultData
    },
    async add () {
      try {
        await this.$dialog.confirm('해당 정보를 정산 데이터에 추가하시겠습니까?')
        const response = await calculationService.addMonthAddCalcDetail(this.calcHisItem.calcSeq, this.rsvInfo)
        const data = response.data

        if (data.resultCode !== '0000') {
          this.$dialog.alert(data.resultMsg)
        } else {
          this.close(this.rsvInfo)
        }
      } catch (e) {
        console.log(e, '취소')
      }
    }
  }
}
</script>

<style scoped>

</style>
