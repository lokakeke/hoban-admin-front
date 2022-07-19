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
                            <span>예약 오류 상세</span>
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
                            사업장 : {{ detail.branchName }}
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

                                <v-label>에러코드</v-label>
                                <p>{{detail.errorCode}}</p>

                                <v-label>에러메시지</v-label>
                                <p class="red--text">{{detail.errorMessage}}</p>

                                <v-label>사업장</v-label>
                                <p>{{detail.branchName}}</p>

                                <v-label>예약구분</v-label>
                                <p>{{detail.rsvName}} ({{detail.rsvIndName}})</p>

                                <v-label>PMS 객실이름</v-label>
                                <p>{{detail.roomTypeName}}</p>

                                <v-label>판매처</v-label>
                                <p>{{detail.agentName}}</p>

                                <v-label>예약자</v-label>
                                <p>{{detail.userName}}</p>

                                <v-label>전화번호</v-label>
                                <p>{{detail.phoneNo}}</p>

                                <v-label>투숙일</v-label>
                                <p>{{detail.roomDate | date}}</p>

                                <v-label>객실수</v-label>
                                <p>{{detail.roomCount}}</p>

                                <v-label>박수</v-label>
                                <p>{{detail.nights}}</p>

                                <v-label>총 객실료</v-label>
                                <p>{{detail.roomPrice | price}}</p>

                                <v-label>일박 요금</v-label>
                                <p>{{detail.dayPrice | price}}</p>

                                <template v-if="detail.breakfastYn === 'Y'">
                                    <v-label>일박 조식금액</v-label>
                                    <p>{{detail.breakfastPrice | price}}</p>
                                </template>

                                <template v-if="detail.priceDiffYn === 'Y'">
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

                        <reservation-history :brc-no="detail.branchNo"
                                             :org-data-id="detail.orgDataId"></reservation-history>

                        <v-layout justify-end class="pt-5">
                            <v-flex xs5 md5>
                                <v-label>KEY 번호</v-label>
                                <v-text-field v-model="detail.keyRsvNo" label=""></v-text-field>
                            </v-flex>
                            <v-flex xs1 md1>
                            </v-flex>
                            <v-flex xs5 md5>
                                <v-label>예약번호(4자리)</v-label>
                                <v-text-field v-model="detail.rsvNo" label=""></v-text-field>
                            </v-flex>
<!--                            <v-btn  color="orange" @click="getRsvInfo()"><v-icon>check</v-icon>예약번호확인</v-btn>-->
                            <v-btn outlined rounded color="orange"  @click="getRsvInfo()">
                                <v-icon>check</v-icon>
                                예약번호확인
                            </v-btn>
                        </v-layout>

                        <v-layout justify-end v-if="detail.noHistoryYn === 'Y' && !detail.notTryConfirmDate" class="pt-5">
                            <v-btn outlined rounded color="info"  @click="complete()">
                                <v-icon>check</v-icon>
                                예약 미시도 확인완료
                            </v-btn>
                        </v-layout>

                        <v-layout justify-end class="pt-5">
                            <v-flex xs18 md18 class="pr-5">
                                <v-label>확인내용</v-label>
                                <v-textarea
                                    solo
                                    class="pt-5"
                                    name="input-7-4"
                                    rows="10"
                                    v-model="detail.confirmRemark" ></v-textarea>
                            </v-flex>
                                <v-btn class="pl-5" outlined rounded color="green"  @click="complete()">
                                    <v-icon>check</v-icon>
                                    확인완료
                                </v-btn>
                        </v-layout>
                    </v-container>
                    <!-- 예약 에러 -->
                    <reservation-info :rsv-dialog.sync="rsvDialog" :rsv-info="rsvInfo" :tl-rsv="detail"></reservation-info>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import service from '@/api/modules/tl/reservation/reservationError.service'
import reservationHistory from '@/views/tl/reservation/common/reservationHistory.vue'
import reservationInfo from '@/views/tl/reservation/common/reservationInfo.vue'
import commonCodeService from '@/api/modules/system/commonCode.service'

export default {
  components: { reservationHistory, reservationInfo },
  props: ['dialog', 'toastData'],
  data () {
    return {
      detail: {},
      check: false,
      rsvDialog: false,
      rsvInfo: {},
      mgtList: []
    }
  },

  watch: {
    dialog (newVal) {
      if (newVal) {
        this.getDetail()
      }
    },

    'detail.rsvNo' (newVal) {
      this.check = false
    },

    'detail.keyRsvNo' (newVal) {
      this.check = false
    }
  },

  mounted () {
    commonCodeService.selectCommonCode('rsv_mgt_no').then(res => {
      this.mgtList = res.data
    })
  },
  methods: {
    close () {
      this.$emit('update:dialog', false)
    },
    getDetail () {
      this.detail = {}
      this.check = false
      this.rsvInfo = {}

      service.selectReservationErrorDetail(this.toastData.bindParam1, this.toastData.bindParam4).then(response => {
        this.detail = response.data
      })
    },
    getRsvInfo () {
      // FIXME API 연결후 주석 해제
      this.$dialog.alert('미구현')

      /*
        const searchParam = { keyRsvNo: this.detail.keyRsvNo, rsvNo: this.detail.rsvNo }
                  service.selectReservationErrorDgnsInfo(searchParam).then(response => {
                      this.rsvInfo = response.data;
                      if(this.rsvInfo) {
                          this.check = true;
              this.rsvDialog = true;

                      } else {
                          this.$alert('존재하지 않은 예약정보 입니다.', '알림', {
                              confirmButtonText: '확인',
                              type: 'warning',
                          });
                      }
                  });
                   */
    },
    complete () {
      this.$dialog.confirm('해당 오류건에 대해서 처리완료 하시겠습니까?').then(() => {
        service.updateReservationErrorConfirm(this.detail).then(_ => {
          this.$dialog.alert('처리완료 되었습니다.')
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
