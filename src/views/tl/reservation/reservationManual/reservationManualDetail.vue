<template>
    <v-dialog
        :value="dialog"
        fullscreen
        persistent
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable>
        <app-section-loader></app-section-loader>
        <v-card tile>
            <v-card-title class="pa-0">
                <v-toolbar dark color="primary" :dense=true>
                    <v-toolbar-title>
                        <v-row align="center" class="mx-0">
                            <span>예약 수동 상세</span>
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

                    <v-form ref="form" lazy-validation>
                        <v-container>
                            <v-layout wrap>
                                <v-flex xs12 md6 border-right>

                                    <v-label>수동 이유</v-label>
                                    <p class="red--text">{{ detail.manualCause }}</p>

                                    <v-label>사업장</v-label>
                                    <p>{{ detail.brcName }}</p>

                                    <v-label>예약구분</v-label>
                                    <p>{{ detail.rsvName }} ({{ detail.rsvIndNm }})</p>

                                    <v-label>PMS 객실이름</v-label>
                                    <p>{{ detail.rmTypeName }}</p>

                                    <v-label>판매처</v-label>
                                    <p>{{ detail.agtName }}</p>

                                    <v-label>예약자</v-label>
                                    <v-text-field v-model="detail.userNm" label="" v-if="!detail.procDt"
                                                  :rules="emptyRules"></v-text-field>
                                    <p v-else>{{ detail.userNm }}</p>

                                    <v-label>전화번호</v-label>
                                    <v-text-field v-model="detail.phoneNo" label=""
                                                  v-if="!detail.procDt"></v-text-field>
                                    <p v-else>{{ detail.phoneNo }}</p>

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

                                    <template v-if="detail.breakfastYn ==='Y'">
                                        <v-label>일박 조식금액</v-label>
                                        <p v-if="detail.breakfastPrice">{{ detail.breakfastPrice | price }}</p>
                                        <p v-else class="red--text">조식 요금 없음</p>
                                    </template>

                                    <v-label>비고</v-label>
                                    <v-textarea v-if="!detail.procDt"
                                                solo
                                                name="input-7-4"
                                                v-model="detail.remark"
                                    ></v-textarea>
                                    <pre v-else v-html="detail.remark"></pre>

                                    <v-flex v-if="detail.procDt">
                                        <v-label>예약번호</v-label>
                                        <p>{{ detail.rsvNo }}</p>
                                    </v-flex>

                                    <v-flex v-if="detail.procDt">
                                        <v-label>처리일자</v-label>
                                        <p>{{ detail.procDt }}</p>
                                    </v-flex>
                                </v-flex>

                                <v-flex xs12 md6 class="pl-3">
                                    <pre v-html="detail.telegramData"></pre>
                                </v-flex>
                            </v-layout>

                            <reservation-history :brc-no="detail.brcNo"
                                                 :org-data-id="detail.orgDataId"></reservation-history>

                            <v-layout justify-end v-if="!detail.procDt" class="mt-5">
                                <v-btn  outlined rounded color="orange" @click="detailUpdate()">
                                    <v-icon>check</v-icon>
                                    수정 및 예약
                                </v-btn>
                                <v-btn color="red" outlined rounded  @click="confirmUpdate()">
                                    <v-icon>check</v-icon>
                                    예약을 진행하지 않고 확인완료
                                </v-btn>
                            </v-layout>
                        </v-container>
                    </v-form>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import reservationManualService from '@/api/modules/tl/reservation/reservationManual.service'
import reservationHistory from '@/views/tl/reservation/common/reservationHistory.vue'

export default {
  components: { reservationHistory },
  props: ['dialog', 'toastData'],
  data () {
    return {
      detail: {}
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
    detailUpdate () {
      const formElement = this.$refs.form

      if (formElement.validate()) {
        this.$dialog.confirm('해당 내용을 저장하시겠습니까?').then(() => {
          reservationManualService.updateReservationManual(this.detail).then(_ => {
            this.$dialog.alert('[' + this.detail.rsvName + '] 관련된 성공, 실패는 알림을 통해서 확인이 가능합니다.')
            this.close()
            this.$parent.search()
          })
        }, () => {
        })
      }
    },
    confirmUpdate () {
      this.$dialog.confirm('해당 예약건에 대해서 확인 완료처리 하시겠습니까?').then(() => {
        reservationManualService.updateReservationManualConfirm(this.detail).then(_ => {
          this.$dialog.alert('처리 되었습니다')
          this.close()
          this.$parent.search()
        })
      }, () => {
      })
    },
    async getDetail () {
      this.detail = {}

      reservationManualService.selectReservationManualDetail(this.toastData.bindParam1, this.toastData.bindParam4).then(response => {
        this.detail = response.data[0]
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
