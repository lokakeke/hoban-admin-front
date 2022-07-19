<template>

    <v-dialog
        v-model="rsvDialog"
        fullscreen
        persistent
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable>
        <app-section-loader></app-section-loader>
        <v-card tile>
            <v-toolbar card dark color="success">
                <v-btn icon dark @click="close()">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-toolbar-title>PMS 예약 정보</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn dark flat @click="close()">Close</v-btn>
                </v-toolbar-items>
            </v-toolbar>

            <v-card-text>
                <v-container>
                    <v-layout class="headline mb-2">
                        <v-flex xs12 md6>
                            PMS 예약 정보
                            <v-spacer></v-spacer>
                        </v-flex>

                        <v-flex xs12 md6>
                            TL 예약 정보
                            <v-spacer></v-spacer>
                        </v-flex>
                    </v-layout>

                    <v-container>
                        <v-layout wrap>
                            <v-flex xs12 md6 border-right>

                                <v-label>영업장</v-label>
                                <p>{{ detail.storeNm }} ({{ detail.storeCode }})</p>

                                <v-label>예약구분</v-label>
                                <p>{{ detail.rsvTypeNm }}</p>

                                <v-label>PMS 객실이름</v-label>
                                <p>{{ detail.rmTypeNm }}</p>

                                <v-label>회원번호</v-label>
                                <p>{{ detail.memberNo }}</p>

                                <v-label>블럭코드</v-label>
                                <p>{{ detail.blockCode }}</p>

                                <v-label>투숙자명</v-label>
                                <p>{{ detail.guestName }}</p>

                                <v-label>투숙자 전화번호</v-label>
                                <p>{{ detail.guestTelNo }}</p>

                                <v-label>체크인 ~ 체크아웃 일자</v-label>
                                <p>{{ detail.ciYmd | date }} ~ {{ detail.coYmd | date }}</p>

                                <v-label>객실수</v-label>
                                <p>{{ detail.roomQty }}</p>

                                <v-label>박수</v-label>
                                <p>{{ detail.nights }}</p>

                                <v-label>객실료</v-label>
                                <p>{{ detail.roomPrice | price }}</p>

                                <v-label>조식요금</v-label>
                                <p>{{ detail.pkgAddPrice | price }}</p>

                                <v-label>총 요금</v-label>
                                <p>{{ detail.roomTotPrice | price }}</p>

                                <v-label>입금가</v-label>
                                <p>{{ detail.payPrice | price }}</p>
                                <v-label>판매가</v-label>
                                <p>{{ detail.salePrice | price }}</p>

                                <v-label>취소일자</v-label>
                                <p>{{ detail.cancelYmd | date }}</p>
                            </v-flex>

                            <v-flex xs12 md6 border-right>

                                <v-label>에러코드</v-label>
                                <p>{{ tlRsv.errorCode }}</p>

                                <v-label>에러메시지</v-label>
                                <p class="red--text">{{ tlRsv.errorMessage }}</p>

                                <v-label>사업장</v-label>
                                <p>{{ tlRsv.branchName }}</p>

                                <v-label>예약구분</v-label>
                                <p>{{ tlRsv.rsvTypeNm }} ({{ tlRsv.rsvIndName }})</p>

                                <v-label>PMS 객실이름</v-label>
                                <p>{{ tlRsv.rmTypeNm }}</p>

                                <v-label>판매처</v-label>
                                <p>{{ tlRsv.otaNm }}</p>

                                <v-label>회원번호</v-label>
                                <p>{{ tlRsv.memberNo }}</p>

                                <v-label>블럭코드</v-label>
                                <p>{{ tlRsv.blockCode }}</p>

                                <v-label>예약자</v-label>
                                <p>{{ tlRsv.userName }}</p>

                                <v-label>전화번호</v-label>
                                <p>{{ tlRsv.phoneNo }}</p>

                                <v-label>투숙일</v-label>
                                <p>{{ tlRsv.roomDate | date }}</p>

                                <v-label>객실수</v-label>
                                <p>{{ tlRsv.roomCount }}</p>

                                <v-label>박수</v-label>
                                <p>{{ tlRsv.nights }}</p>

                                <v-label>총 객실료</v-label>
                                <p>{{ tlRsv.roomPrice | price }}</p>

                                <v-label>일박 요금</v-label>
                                <p>{{ tlRsv.dayPrice | price }}</p>

                                <template v-if="tlRsv.breakfastYn == 'Y'">
                                    <v-label>일박 조식금액</v-label>
                                    <p>{{ tlRsv.breakfastPrice | price }}</p>
                                </template>
                            </v-flex>

                        </v-layout>

                        <v-layout wrap>
                            <v-flex xs12 md12>
                                <v-label>예약참고사항</v-label>
                                <pre v-html="detail.etc"></pre>
                            </v-flex>
                        </v-layout>

                    </v-container>

                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>

</template>

<script>
export default {
  props: ['rsvDialog', 'rsvInfo', 'tlRsv'],
  data () {
    return {
      detail: {}
    }
  },

  mounted () {
    this.detail = this.rsvInfo
  },
  methods: {
    close () {
      this.$emit('update:rsvDialog', false)
    }
  }
}
</script>

<style scoped>
p {
    margin-bottom: 10px;
}
</style>
