<template>
    <v-dialog
        :value="dialog"
        fullscreen
        persistent
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable>
        <v-card>
                <v-card-title class="pa-0">
                    <v-toolbar dark color="primary" :dense=true>
                        <v-toolbar-title>
                            <v-row align="center" class="mx-0">
                                <span>신규 예약 상세</span>
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
            <v-card-text class="pa-0" v-if="detail">
                <v-container>
                    <v-layout class="headline mb-2">
                        <v-flex xs12 md6>
                            사업장 : {{ detail.brcName }}
                            <v-spacer></v-spacer>
                        </v-flex>

                        <v-flex xs12 md6>
                            예약 알림
                            <v-spacer></v-spacer>
                        </v-flex>
                    </v-layout>

                    <v-container>
                        <v-layout wrap>
                            <v-flex xs12 md6 border-right>

                                <v-label>사업장</v-label>
                                <p>{{ detail.brcName }}</p>

                                <v-label>예약구분</v-label>
                                <p>{{ detail.rsvName }} ({{ detail.rsvIndNm }})</p>

                                <v-label>판매처</v-label>
                                <p>{{ detail.agtName }}</p>

                                <v-label>예약자</v-label>
                                <p>{{ detail.userNm }}</p>

                                <v-label>전화번호</v-label>
                                <p>{{ detail.phoneNo }}</p>

                                <v-label>투숙일</v-label>
                                <p>{{ detail.roomYmd | date }}</p>

                                <v-label>객실수</v-label>
                                <p>{{ detail.roomCnt }}</p>

                                <v-label>박수</v-label>
                                <p>{{ detail.nights }}</p>

                                <v-label>총 객실료</v-label>
                                <p>{{ detail.roomPrice | price }}</p>

                                <v-label>일박 요금</v-label>
                                <p>{{ detail.dayPrice | price }}</p>

                                <template v-if="detail.breakfastYn == 'Y'">
                                    <v-label>조식 포함 여부</v-label>
                                    <p>포함 (자세한 금액은 성공,수동,에러 메뉴에서 확인)</p>
                                </template>

                                <template v-if="detail.ciModifyDays">
                                    <v-label>투숙일 기준 변경 차이일(변경 또는 취소시에만 생성)</v-label>
                                    <p :class="{'red--text' : detail.ciModifyDays < 4}">{{ detail.ciModifyDays }} 일
                                        (투숙일: {{ detail.roomYmd | date }} - 신청일: {{ detail.inputDtlInsDt | date }})</p>

                                </template>

                                <template v-if="detail.lastTotalCharge">
                                    <v-label>마지막(신규예약 또는 변경)의 객실요금(변경 또는 취소시에만 생성)</v-label>
                                    <p :class="{'red--text' : detail.ciModifyDays < 4}">
                                        {{ detail.lastTotalCharge | price }}</p>
                                </template>

                                <template v-if="detail.notTryConfirmYmd">
                                    <v-label>예약 미 시도 확인 일자</v-label>
                                    <p>{{ detail.notTryConfirmYmd | date }}</p>
                                </template>

                                <v-label>일별 객실요금</v-label>
                                <p v-for="(room, index) in detail.roomList" :key="index">{{ room.rmRoomYmd | date }} =
                                    {{ room.texPerRoomrate | price }} 객실수 : {{ room.detailRoomCnt }}실 <br/>객실정보 :
                                    {{ room.otaRmTypeNm }}</p>
                            </v-flex>
                            <v-flex xs12 md6 class="pl-3">
                                <pre v-html="detail.telegramData"></pre>
                            </v-flex>
                        </v-layout>
                        <reservation-history :brc-no="detail.brcNo"
                                             :org-data-id="detail.orgDataId"></reservation-history>
                        <v-layout justify-end class="mt-3" v-if="detail.noHistoryYn == 'Y' && !detail.notTryConfirmYmd">
                            <v-btn outlined rounded color="orange"  @click="complete()">
                                <v-icon>check</v-icon>
                                예약 미시도 확인완료
                            </v-btn>
                        </v-layout>
                    </v-container>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import reservationInputService from '@/api/modules/tl/reservation/reservationInput.service'
import reservationHistory from '@/views/tl/reservation/common/reservationHistory'
// import scheduleTempService from '@/api/modules/naver/schedule.service'

export default {
  components: { reservationHistory },

  props: ['dialog', 'toastData'],
  data () {
    return {
      detail: {},
      headers: [
        { text: '예약구분', value: 'rmTypeNm', align: 'center', sortable: false },
        { text: '등록일자', value: 'insDt', align: 'center', sortable: false },
        { text: '처리여부', value: 'errorCd', align: 'center', sortable: false },
        { text: '에러 메시지', value: 'errorMsg', align: 'center', sortable: false }
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

      reservationInputService.selectReservationInputDetail(this.toastData.bindParam1, this.toastData.bindParam2, this.toastData.bindParam3).then(response => {
        this.detail = response.data
      })
    },

    complete () {
      // this.$dialog.confirm('삭제하시겠습니까?').then(() => {
      //     scheduleTempService.updateScheduleTempMst(item.tempNo, { status: 'D' }).then(() => {
      //         this.$dialog.alert('삭제되었습니다.').then(() => {
      //             this.setInit()
      //             this.selectScheduleTempMstList()
      //         })
      //     })
      // })
      this.$confirm('예약 미시도 건에 대해 확인 완료 처리 하시겠습니까?', '확인', {
        confirmButtonText: '확인',
        cancelButtonText: '취소',
        type: 'info',
        dangerouslyUseHTMLString: true
      }).then(() => {
        reservationInputService.updateReservationNoHistorycConfirm(this.detail).then(response => {
          this.$alert('처리완료 되었습니다.', '알림', {
            confirmButtonText: '확인',
            type: 'warning'
          })
          this.close()
          this.$parent.search()
        })
      }, () => {
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
