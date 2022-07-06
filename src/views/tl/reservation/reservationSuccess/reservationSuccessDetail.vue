<template>

    <v-dialog
        :value="dialog"
        fullscreen
        persistent
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable>
        <v-card tile>
            <v-card-title class="pa-0">
                <v-toolbar dark color="primary" :dense=true>
                    <v-toolbar-title>
                        <v-row align="center" class="mx-0">
                            <span>예약 성공 상세</span>
                        </v-row>
                    </v-toolbar-title>
                    <v-spacer></v-spacer>

                    <v-toolbar-items>
                        <v-btn text :dark="true" @click="close()">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-toolbar-items>
                </v-toolbar>
            </v-card-title>
            <v-card-text v-if="detail">
                <v-container >
                    <v-layout wrap>
                        <v-flex xs12 md6 border-right>
                            <v-label>사업장</v-label>
                            <p>{{detail.brcName}}</p>

                            <v-label>예약구분</v-label>
                            <p>{{detail.rsvName}} ({{detail.rsvIndNm}})</p>

                            <v-label>PMS 객실이름</v-label>
                            <p>{{detail.rmTypeName}}</p>

                            <v-label>판매처</v-label>
                            <p>{{detail.agtName}}</p>

                            <v-label>예약자</v-label>
                            <p>{{detail.userNm}}</p>

                            <v-label>전화번호</v-label>
                            <p>{{detail.phoneNo}}</p>

                            <v-label>투숙일</v-label>
                            <p>{{detail.roomYmd | date}}</p>

                            <v-label>객실수</v-label>
                            <p>{{detail.roomCnt}}</p>

                            <v-label>박수</v-label>
                            <p>{{detail.nights}}</p>

                            <v-label>총 객실료</v-label>
                            <p>{{detail.roomPrice | price}}</p>

                            <v-label>일박 요금</v-label>
                            <p>{{detail.dayPrice | price}}</p>

                            <v-label>PMS 입금가</v-label>
                            <p class="red--text">{{detail.pmsTotPrice | price}}</p>

                            <template v-if="detail.breakfastYn == 'Y'">
                                <v-label>일박 조식금액</v-label>
                                <p>{{detail.breakfastPrice | price}}</p>
                            </template>

                            <template v-if="detail.priceDiffYn == 'Y'">
                                <v-label>객실료 차이</v-label>
                                <p class="red--text">PMS 요금 : {{detail.pmsSalePrice | price}} , TL 요금 : {{detail.roomPrice | price }}</p>
                            </template>

                            <v-label>비고</v-label>
                            <pre v-html="detail.remark"></pre>

                        </v-flex>

                        <v-flex xs12 md6 class="pl-3">
                            <pre v-html="detail.telegramData"></pre>
                        </v-flex>
                    </v-layout>

                    <reservation-history :brc-no="detail.brcNo" :org-data-id="detail.orgDataId"></reservation-history>

                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>

</template>

<script>
import reservationSuccessService from '@/api/modules/tl/reservation/reservationSuccess.service'
import reservationHistory from '@/views/tl/reservation/common/reservationHistory.vue'

export default {
  components: { reservationHistory },

  props: ['dialog', 'toastData'],
  data () {
    return {
      detail: {},
      headers: [
        { text: '예약구분', value: 'rmTypeNm', align: 'center' },
        { text: '등록일자', value: 'insDt', align: 'center' },
        { text: '처리여부', value: 'errorCd', align: 'center' },
        { text: '에러 메시지', value: 'errorMsg', align: 'center' }
      ]
    }
  },

  watch: {
    dialog (newVal) {
      if (newVal) {
        this.getDetail()
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:dialog', false)
    },
    getDetail () {
      this.detail = {}
      reservationSuccessService.selectReservationSuccessDetail(this.toastData.bindParam1, this.toastData.bindParam2).then(response => {
        this.detail = response.data
      })
    }
  }
}
</script>

<style scoped>
p {
    margin-bottom: 10px;
}

pre {
    white-space: pre-line;
}
</style>
