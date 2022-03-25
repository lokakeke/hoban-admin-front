<template>
    <div :key="key">
        <v-form ref="form" lazy-validation>
            <v-row wrap dense>
                <v-col lg="2" md="3" cols="4">
                    <v-text-field
                        v-model="rsvDetailCopy.rsvNo"
                        label="예약번호"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="2" md="3" cols="4">
                    <v-text-field
                        v-model="rsvDetailCopy.rsvState"
                        label="상태"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.keyRsvNo"
                        label="key예약번호"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="3" md="4" cols="4">
                    <v-text-field
                        v-model="rsvDetailCopy.chainRsvNo"
                        label="업체예약번호"
                        :background-color="groupFlag === 'naver' && workStatus === 'new' ? 'deep-orange lighten-5' : ''"
                        :readonly="workStatus === '' || workStatus === 'detail' || workStatus === 'update'"
                        outlined
                        hide-details
                        dense
                        :rules="groupFlag === 'naver' ? emptyRules : []"
                    />
                </v-col>
                <v-col v-if="roomType.value === 'OTA_PKG_API' && workStatus === 'new'" lg="2" md="3" cols="4">
                    <v-text-field
                        v-model="partnerNm"
                        label="파트너명"
                        :background-color="workStatus === 'new' || workStatus === 'update' ? 'deep-orange lighten-5' : ''"
                        outlined
                        hide-details
                        dense
                        @keypress.enter="openPartnerInfo(rsvDetailCopy)"
                    >
                        <template v-slot:append v-if="roomType.value === 'OTA_PKG_API'">
                            <v-btn icon small color="primary" tabindex="-1" @click="openPartnerInfo(rsvDetailCopy)"
                                   :disabled="workStatus === '' || workStatus === 'detail'">
                                <v-icon>search</v-icon>
                            </v-btn>
                        </template>
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row wrap dense>
                <v-col v-if="roomType.value === 'OTA_ROOM_API' || rsvDetailCopy.rsvType === 'ROOM'" lg="2" md="3"
                       cols="4">
                    <v-text-field
                        v-model="rsvDetailCopy.memNo"
                        label="회원번호"
                        :background-color="workStatus === 'new' || workStatus === 'update' ? 'deep-orange lighten-5' : ''"
                        :readonly="workStatus === '' || workStatus === 'detail'"
                        outlined
                        hide-details
                        dense
                        @keypress.enter="searchPartnerInfo()"
                        :rules="emptyRules"
                    >
                        <template v-slot:append
                                  v-if="roomType.value === 'OTA_ROOM_API' || rsvDetailCopy.rsvType === 'ROOM'">
                            <v-btn icon small color="primary" tabindex="-1" @click="openPartnerInfo()"
                                   :disabled="workStatus === '' || workStatus === 'detail'">
                                <v-icon>search</v-icon>
                            </v-btn>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col v-if="roomType.value === 'OTA_ROOM_API' || rsvDetailCopy.rsvType === 'ROOM'" lg="3" md="4"
                       cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.memNm"
                        label="회원명"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col v-if="roomType.value === 'OTA_PKG_API' || rsvDetailCopy.rsvType === 'PKG'" lg="2" md="3"
                       cols="4">
                    <v-text-field
                        v-model="rsvDetailCopy.pkgNo"
                        label="패키지번호"
                        :background-color="workStatus === 'new' || workStatus === 'update' ? 'deep-orange lighten-5' : ''"
                        :readonly="workStatus === '' || workStatus === 'detail'"
                        outlined
                        hide-details
                        dense
                        @keypress.enter="openPackagePopup(rsvDetailCopy)"
                        :rules="emptyRules"
                    >
                        <template v-slot:append
                                  v-if="roomType.value === 'OTA_PKG_API' || rsvDetailCopy.rsvType === 'PKG'">
                            <v-btn icon small color="primary" tabindex="-1" @click="openPackagePopup(rsvDetailCopy)"
                                   :disabled="workStatus === '' || workStatus === 'detail'">
                                <v-icon>search</v-icon>
                            </v-btn>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col v-if="roomType.value === 'OTA_PKG_API' || rsvDetailCopy.rsvType === 'PKG'" lg="3" md="4"
                       cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.pkgNm"
                        label="패키지명"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="2" md="3" cols="4">
                    <v-text-field
                        v-model="rsvDetailCopy.storeCd"
                        label="영업장코드"
                        :background-color="workStatus === 'new' || workStatus === 'update' ? 'deep-orange lighten-5' : ''"
                        :readonly="workStatus === '' || workStatus === 'detail'"
                        outlined
                        hide-details
                        dense
                        @keypress.enter="searchStoreInfo(rsvDetailCopy)"
                        :rules="emptyRules"
                    >
                        <template v-slot:append v-if="rsvDetailCopy">
                            <v-btn icon small color="primary" tabindex="-1" @click="openStorePopup(rsvDetailCopy)"
                                   :disabled="workStatus === '' || workStatus === 'detail'">
                                <v-icon>search</v-icon>
                            </v-btn>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.storeNm"
                        label="영업장명"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col v-if="roomType.value === 'OTA_ROOM_API' || rsvDetailCopy.rsvType === 'ROOM'" lg="1" md="2"
                       cols="2">
                    <v-text-field
                        v-model="rsvDetailCopy.nights"
                        label="박"
                        :background-color="workStatus === 'new' || workStatus === 'update' ? 'deep-orange lighten-5' : ''"
                        :readonly="workStatus === '' || workStatus === 'detail'"
                        outlined
                        hide-details
                        dense
                        @input="changeCiYmdOrNights"
                        :rules="emptyRules"
                    />
                </v-col>
                <v-col v-if="roomType.value === 'OTA_ROOM_API' || rsvDetailCopy.rsvType === 'ROOM'" lg="1" md="2"
                       cols="2">
                    <v-text-field
                        v-model="rsvDetailCopy.rmCnt"
                        label="객"
                        :background-color="workStatus === 'new' || workStatus === 'update' ? 'deep-orange lighten-5' : ''"
                        :readonly="workStatus === '' || workStatus === 'detail'"
                        outlined
                        hide-details
                        dense
                        @input="changeMemInfoOrRmCnt"
                        :rules="emptyRules"
                    />
                </v-col>
                <v-col v-if="roomType.value === 'OTA_PKG_API' || rsvDetailCopy.rsvType === 'PKG'" lg="1" md="2"
                       cols="2">
                    <v-text-field
                        v-model="rsvDetailCopy.nights"
                        label="박"
                        :background-color="workStatus === 'new' || workStatus === 'update' ? 'deep-orange lighten-5' : ''"
                        :readonly="groupFlag === 'ota'"
                        outlined
                        hide-details
                        dense
                        @input="changeCiYmdOrNights"
                        :rules="emptyRules"
                    />
                </v-col>
                <v-col v-if="roomType.value === 'OTA_PKG_API' || rsvDetailCopy.rsvType === 'PKG'" lg="1" md="2"
                       cols="2">
                    <v-text-field
                        v-model="rsvDetailCopy.rmCnt"
                        label="객"
                        :background-color="workStatus === 'new' || workStatus === 'update' ? 'deep-orange lighten-5' : ''"
                        :readonly="groupFlag === 'ota'"
                        outlined
                        hide-details
                        dense
                        @input="changeMemInfoOrRmCnt"
                        :rules="emptyRules"
                    />
                </v-col>
                <v-col lg="2" md="3" cols="4">
                    <v-text-field
                        v-model="rsvDetailCopy.rsvBlckCd"
                        label="예약블럭"
                        :background-color="groupFlag === 'naver' && workStatus === 'new' ? 'deep-orange lighten-5' : ''"
                        :readonly="(workStatus === '' || workStatus === 'detail' || workStatus === 'new' || workStatus === 'update') && groupFlag === 'ota'"
                        outlined
                        hide-details
                        dense
                        :rules="groupFlag === 'naver' ? emptyRules : []"
                        @keypress.enter="selectRsvBlockInfo(rsvDetailCopy)"
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.rsvBlck"
                        label="예약블럭명"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="2" md="3" cols="4">
                    <date-picker
                        v-model="rsvDetailCopy.ciYmd"
                        label="입실일자"
                        :background-color="workStatus === 'new' || workStatus === 'update' ? 'deep-orange lighten-5' : ''"
                        :readonly="workStatus === '' || workStatus === 'detail'"
                        :min="minDate"
                        :max="maxDate"
                        hide-details
                        @change="changeCiYmdOrNights"
                        :rules="emptyRules"
                    />
                </v-col>
                <v-col lg="2" md="3" cols="4">
                    <date-picker
                        v-model="rsvDetailCopy.coYmd"
                        label="퇴실일자"
                        :background-color="workStatus === 'new' || workStatus === 'update' ? 'deep-orange lighten-5' : ''"
                        :readonly="workStatus === '' || workStatus === 'detail'"
                        :min="minDate"
                        :max="coMaxDate"
                        hide-details
                    />
                </v-col>
                <v-col lg="1" md="2" cols="2">
                    <p></p>
                </v-col>
                <v-col lg="1" md="2" cols="2">
                    <v-text-field
                        v-model="rsvDetailCopy.adultCnt"
                        label="대인"
                        :background-color="workStatus === 'new' || workStatus === 'update' ? 'deep-orange lighten-5' : ''"
                        :readonly="workStatus === '' || workStatus === 'detail'"
                        outlined
                        hide-details
                        dense
                        :rules="emptyRules"
                    />
                </v-col>
                <v-col lg="1" md="2" cols="2">
                    <v-text-field
                        v-model="rsvDetailCopy.childCnt"
                        label="소인"
                        :background-color="workStatus === 'new' || workStatus === 'update' ? 'deep-orange lighten-5' : ''"
                        :readonly="workStatus === '' || workStatus === 'detail'"
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.rmTypeCd"
                        label="객실유형코드"
                        :background-color="workStatus === 'new' || workStatus === 'update' ? 'deep-orange lighten-5' : ''"
                        :readonly="workStatus === '' || workStatus === 'detail'"
                        outlined
                        hide-details
                        dense
                        @keypress.enter="searchRmTypePopup(rsvDetailCopy)"
                        :rules="emptyRules"
                    >
                        <template v-slot:append v-if="rsvDetailCopy">
                            <v-btn icon small color="primary" tabindex="-1" @click="openRmTypePopup(rsvDetailCopy)"
                                   :disabled="workStatus === '' || workStatus === 'detail'">
                                <v-icon>search</v-icon>
                            </v-btn>
                        </template>
                    </v-text-field>
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.rmTypeNm"
                        label="객실유형명"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.dongCd"
                        label="동코드"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.dongCdNm"
                        label="동명"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.guestNm"
                        label="이용자명"
                        :background-color="workStatus === 'new' ? 'deep-orange lighten-5' : ''"
                        :readonly="workStatus === '' || workStatus === 'detail' || workStatus === 'update'"
                        outlined
                        hide-details
                        dense
                        :rules="emptyRules"
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.smsPhone"
                        label="이용자연락처"
                        :background-color="groupFlag === 'naver' && workStatus === 'new' ? 'deep-orange lighten-5' : ''"
                        :readonly="workStatus === '' || workStatus === 'detail' || workStatus === 'update'"
                        outlined
                        hide-details
                        dense
                        v-mask="['###-####-####', '###-###-####']"
                        :rules="groupFlag === 'naver' ? emptyRules : []"
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.agentCd"
                        label="Agent코드"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.agentNm"
                        label="Agent명"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.rsvGuestlnm"
                        label="예약자명"
                        readonly
                        outlined
                        hide-details
                        dense
                        :rules="emptyRules"
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.rsvGuestTelNo"
                        label="예약자연락처"
                        readonly
                        outlined
                        hide-details
                        dense
                        v-mask="['###-####-####', '###-###-####']"
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.rsvIndCdAndNm"
                        label="예약구분"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col>
                    <v-checkbox
                        v-model="rsvDetailCopy.exptYn"
                        label="규정외예약"
                        false-value="0"
                        true-value="1"
                        hide-details
                        readonly
                        class="ma-1"
                    />
                </v-col>
            </v-row>
            <v-row wrap dense>
                <v-col cols="12">
                    <p class="font-weight-bold mt-2" style="font-size: large">요금 예약 정보</p>
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rcpmny"
                        label="입금금액"
                        readonly
                        outlined
                        hide-details
                        dense
                        :rules="emptyRules"
                    />
                </v-col>
                <v-col v-if="workStatus !== 'detail'" cols="3">
                    <v-btn outlined rounded color="primary" class="my-1 px-1"
                           @click="openDayAmtInfo"
                           :disabled="workStatus === ''"
                    >일별요금
                    </v-btn>
                </v-col>
                <v-col v-if="workStatus === 'detail'" cols="3">
                    <v-btn outlined rounded color="primary" class="my-1 px-1"
                           @click="openDayAmtInfoAfterRsv"
                    >일별요금
                    </v-btn>
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="totalAmt"
                        label="판매금액"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.payRsvNo"
                        label="업체결제금액"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="6" md="6" cols="12">
                    <v-textarea
                        v-model="rsvDetailCopy.etc"
                        label="예약참고"
                        :readonly="workStatus === '' || workStatus === 'detail'"
                        no-resize
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="6" md="6" cols="12">
                    <v-textarea
                        v-model="rsvDetailCopy.cancelResnDesc"
                        label="취소사유"
                        :readonly="workStatus === '' || workStatus === 'detail'"
                        no-resize
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col cols="12">
                    <p class="font-weight-bold mt-2" style="font-size: large">예약 부가 사항</p>
                </v-col>
                <v-col lg="2" md="3" cols="4">
                    <v-text-field
                        v-model="rsvDetailCopy.crtNm"
                        label="등록자"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.crtDt"
                        label="등록일시"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="2" md="3" cols="4">
                    <v-text-field
                        v-model="rsvDetailCopy.updNm"
                        label="수정자"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.updDt"
                        label="수정일시"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="2" md="3" cols="4">
                    <v-text-field
                        v-model="rsvDetailCopy.cancelResnCd"
                        label="취소사유코드"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
            </v-row>
        </v-form>
    </div>
</template>

<script>
import roomService from 'Api/modules/ota/roomReservation.service'
import partnerTermService from 'Api/modules/partner/partnerTerm.service'
import NumberUtils from '@/utils/number.util'

export default {
  name: 'RoomAndMemberInfo',
  props: {
    /**
         * 객실/패키지
         */
    roomType: {
      type: Object
    },
    /**
         * 예약 상세 정보 객체
         */
    rsvDetail: {
      type: Object
    },
    /**
         * 작업 상태
         */
    workStatus: {
      type: String
    },
    /**
         * OTA인지 NAVER인지 구분값
         */
    groupFlag: {
      type: String
    }
  },
  data () {
    return {
      rsvDetailCopy: {}, // rsvDetail 정보 복사본
      partnerNm: '', // 파트너명
      dayAmtList: [], // 일별요금 목록
      minDate: '', // date picker min date
      maxDate: '', // 입실일자 date picker max date
      coMaxDate: '', // 퇴실일자 date picker max date
      storeMinDate: '', // 영업장 판매 시작일자
      storeMaxDate: '', // 영업장 판매 종료일자
      rmMinDate: '', // 객실 판매 시작일자
      rmMaxDate: '', // 객실 판매 종료일자
      childGroupFlag: 'ota',
      key: 0 // 강제 렌더링을 위한 변수
    }
  },
  computed: {
    totalAmt () { // 판매가
      return NumberUtils.numberWithCommas(this.rsvDetailCopy.saleAmt)
    },
    rcpmny () { // 입금가
      return NumberUtils.numberWithCommas(this.rsvDetailCopy.payAmt)
    }
  },
  watch: {
    roomType () { // 객실/패키지 변경시 파트너명 리셋
      this.partnerNm = ''
    },
    rsvDetail: {
      handler (newVal) {
        this.rsvDetailCopy = newVal
        if (!newVal.storeCd) {
          this.partnerNm = ''
        }
        if (this.workStatus === '' || this.workStatus === 'detail') {
          this.key += 1 // 이용자 연락처가 바뀐걸 인식하지 못하는 버그를 위한 변수
        }
      }
    },
    rsvDetailCopy: {
      handler (newVal) {
        if (
          this.rsvDetailCopy.smsPhone &&
                    this.rsvDetailCopy.smsPhone.length > 12 &&
                    this.rsvDetailCopy.payAmt
        ) {
          this.$emit('change-rsv-detail', newVal)
        }
      },
      deep: true
    }
  },
  methods: {
    /**
         * 유효성 검사
         */
    async checkValidation () {
      try {
        await this.validForm(this.$refs.form)
        return Promise.resolve()
      } catch (e) {
        return Promise.reject(e)
      }
    },
    /**
         * 회원번호 조회 결과값 세팅
         */
    setPartnerInfoReseult (result) {
      this.$set(this, 'partnerNm', result.ptnrNm) // 파트너명
      this.$set(this.rsvDetailCopy, 'ptnrNo', result.ptnrNo) // 파트너 번호(예치금에 필요)
      this.$set(this.rsvDetailCopy, 'termSeq', result.termSeq) // 예치금에 필요
      this.$set(this.rsvDetailCopy, 'rsvGuestlnm', result.ptnrNm)
      this.$set(this.rsvDetailCopy, 'rsvGuestTelNo', result.capTelNo)
      this.$set(this.rsvDetailCopy, 'agentCd', result.agentCd)
      this.$set(this.rsvDetailCopy, 'agentNm', result.agentCdNm)
      if (this.roomType.value === 'OTA_ROOM_API') { // 객실인 경우
        this.$set(this.rsvDetailCopy, 'memNo', result.memNo)
        this.$set(this.rsvDetailCopy, 'memNm', result.memNm)
      }
    },
    /**
         * 회원번호/명 검색
         */
    async searchPartnerInfo () {
      const q = {}
      q.taskType = this.roomType.value
      let memNo = this.rsvDetailCopy.memNo
      if (memNo && memNo.length === 6) {
        memNo = memNo + '00'
      }
      q.memNo = memNo
      const param = {}
      param.q = q
      const res = await partnerTermService.selectPartnerTermList(param)
      if (res.data && res.data.length === 1) {
        this.setPartnerInfoReseult(res.data[0])
      } else {
        this.openPartnerInfo()
      }
    },
    /**
         * 회원번호/명 조회
         */
    openPartnerInfo () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/PartnerTermSearch',
        params: {
          taskType: this.roomType.value,
          memNo: this.rsvDetailCopy.memNo
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1500,
          closeCallback: (params) => {
            if (params && params.data) {
              this.setPartnerInfoReseult(params.data)
              this.changeMemInfoOrRmCnt()
            }
          }
        }
      })
    },
    /**
         * 영업장 정보 조회 결과값 화면에 매핑
         */
    mapStoreInfoResult (result) {
      this.$set(this.rsvDetailCopy, 'storeCd', result.storeCd)
      this.$set(this.rsvDetailCopy, 'storeNm', result.storeNm)
      this.$set(this.rsvDetailCopy, 'rsvBlckCd', result.rsvBlckCd)
      this.$set(this.rsvDetailCopy, 'rsvBlck', result.rsvBlckCdNm)
    },
    /**
         * 영업장번호/명 검색
         */
    async searchStoreInfo (item) {
      const param = {}
      param.storeCd = item.storeCd
      if (this.roomType.value === 'OTA_ROOM_API' || item.rsvType === 'ROOM') {
        param.useYn = '1'
        const res = await roomService.selectStoreInfo(param)
        if (res.data && res.data.length === 1) {
          this.resetRmInfoAndTotalAmt() // 객실 유형 정보 및 요금 총 합계 초기화
          this.mapStoreInfoResult(res.data[0]) // 결과값 화면에 매핑
          this.storeMinDate = res.data[0].saleBgnYmd
          this.storeMaxDate = res.data[0].saleEndYmd
          this.setMinAndMaxDateByStore(res.data[0].saleBgnYmd, res.data[0].saleEndYmd)
          this.getInventoryList() // 잔여객실 조회
        } else {
          this.openStorePopup(item)
        }
      } else { // 패키지
        if (item.pkgNo) {
          param.pkgNo = item.pkgNo
          param.useYn = 'Y'
          const res = await roomService.selectStoreInfoByPkgNo(param)
          if (res.data && res.data.length === 1) {
            this.resetRmInfoAndTotalAmt() // 객실 유형 정보 및 요금 총 합계 초기화
            this.mapStoreInfoResult(res.data[0]) // 결과값 화면에 매핑
            this.getInventoryList() // 잔여객실 조회
          } else {
            this.openStorePopup(item)
          }
        } else {
          this.$dialog.alert('패키지 번호를 먼저 선택해주세요.')
        }
      }
    },
    /**
         * 영업장번호/명 검색창 오픈
         */
    openStorePopup (item) {
      const paramCheck = Boolean(this.roomType.value === 'OTA_ROOM_API' || ((this.roomType.value === 'OTA_PKG_API' || item.rsvType === 'PKG') && item.pkgNo))
      if (paramCheck) {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Ota/RoomReservation/popup/StoreSearchPopup',
          params: {
            item: {
              itemInfo: item,
              roomType: this.roomType
            }
          },
          options: {
            fullscreen: false,
            scrollable: true,
            width: 900,
            closeCallback: (params) => {
              if (params && params.data) {
                this.resetRmInfoAndTotalAmt() // 객실 유형 정보 및 요금 총 합계 초기화
                this.mapStoreInfoResult(params.data) // 결과값 화면에 매핑
                if (this.roomType.value === 'OTA_ROOM_API' || item.rsvType === 'ROOM') {
                  this.storeMinDate = params.data.saleBgnYmd
                  this.storeMaxDate = params.data.saleEndYmd
                  this.setMinAndMaxDateByStore(params.data.saleBgnYmd, params.data.saleEndYmd)
                }
                this.getInventoryList() // 잔여객실 조회
              }
            }
          }
        })
      } else {
        this.$dialog.alert('패키지 번호를 먼저 선택해주세요.')
      }
    },
    /**
         * 블럭코드 및 블럭명 조회
         */
    async selectRsvBlockInfo (item) {
      const param = {}
      param.rsvBlckCd = item.rsvBlckCd
      // 블럭정보 조회
      const res = await roomService.selectRsvBlockInfo(param)
      this.$set(this.rsvDetailCopy, 'rsvBlckCd', res.data.rsvBlckCd)
      this.$set(this.rsvDetailCopy, 'rsvBlck', res.data.rsvBlckCdNm)
    },
    /**
         * 객실 유형 정보 조회 결과값 매핑
         */
    mapRmTypeInfoResult (result) {
      this.$set(this.rsvDetailCopy, 'rmTypeCd', result.rmTypeCd)
      this.$set(this.rsvDetailCopy, 'rmTypeNm', result.rmTypeNm)
      this.$set(this.rsvDetailCopy, 'dongCd', result.dongCd)
      this.$set(this.rsvDetailCopy, 'dongCdNm', result.dongNm)
    },
    /**
         * 객실유형코드 검색
         */
    async searchRmTypePopup (item) {
      if (item.storeCd) {
        const param = {}
        param.storeCd = item.storeCd
        param.rmTypeCd = item.rmTypeCd
        param.useYn = '1'
        if (item.pkgNo) {
          param.pkgNo = item.pkgNo
        }
        // 객실유형코드 조회
        const res = await roomService.selectRmTypeAndDongInfo(param)
        if (res.data && res.data.length === 1) {
          this.mapRmTypeInfoResult(res.data[0]) // 결과값을 화면에 매핑
          if (this.roomType.value === 'OTA_ROOM_API' || item.rsvType === 'ROOM') {
            this.rmMinDate = res.data[0].saleBgnYmd
            this.rmMaxDate = res.data[0].saleEndYmd
            this.setMinAndMaxDateByRmType(res.data[0].saleBgnYmd, res.data[0].saleEndYmd)
          }
          this.selectChargeInfo(this.rsvDetailCopy)
        } else {
          this.openRmTypePopup(item)
        }
      } else {
        this.$dialog.alert('영업장을 먼저 선택해 주세요.')
      }
    },
    /**
         * 객실유형코드 검색창 오픈
         */
    openRmTypePopup (item) {
      if (item.storeCd) {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Ota/RoomReservation/popup/RmTypePopup',
          params: {
            item: {
              storeCd: item.storeCd,
              pkgNo: item.pkgNo
            }
          },
          options: {
            fullscreen: false,
            scrollable: true,
            width: 800,
            closeCallback: (params) => {
              if (params && params.data) {
                this.mapRmTypeInfoResult(params.data) // 결과값을 화면에 매핑
                if (this.roomType.value === 'OTA_ROOM_API' || item.rsvType === 'ROOM') {
                  this.rmMinDate = params.data.saleBgnYmd
                  this.rmMaxDate = params.data.saleEndYmd
                  this.setMinAndMaxDateByRmType(params.data.saleBgnYmd, params.data.saleEndYmd)
                }
                this.selectChargeInfo(this.rsvDetailCopy)
              }
            }
          }
        })
      } else {
        this.$dialog.alert('영업장을 먼저 선택해 주세요.')
      }
    },
    /**
         * 패키지번호/명 검색창 오픈
         */
    openPackagePopup (item) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/RoomReservation/popup/PackSearchPopup',
        params: {
          item: {
            pkgNo: item.pkgNo,
            rsvYn: 'Y',
            groupFlag: this.groupFlag,
            workStatus: this.workStatus
          }
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 1400,
          closeCallback: (params) => {
            if (params && params.data) {
              if (this.groupFlag !== params.group) {
                this.$emit('change-group-flag', params.group)
              }
              this.childGroupFlag = params.group
              this.$set(this.rsvDetailCopy, 'pkgNo', params.data.pkgNo)
              this.$set(this.rsvDetailCopy, 'pkgNm', params.data.pkgNm)
              // 입실일자 및 퇴실일자 최소, 최대값 설정
              if (moment().isBefore(params.data.saleBgnYmd)) {
                this.minDate = moment(params.data.saleBgnYmd).format('YYYY-MM-DD')
              } else {
                this.minDate = moment().format('YYYY-MM-DD')
              }
              this.maxDate = moment(params.data.saleEndYmd).format('YYYY-MM-DD')
              this.coMaxDate = moment(this.maxDate).add(1, 'day').format('YYYY-MM-DD')
              if (params.group === 'ota') {
                // 영업장 정보가 있는 경우 초기화
                if (this.rsvDetailCopy.storeCd) {
                  this.rsvDetailCopy.storeCd = ''
                  this.rsvDetailCopy.storeNm = ''
                  this.rsvDetailCopy.rsvBlckCd = ''
                  this.rsvDetailCopy.rsvBlck = ''
                }
                this.resetRmInfoAndTotalAmt() // 객실 유형 정보 및 요금 총 합계 초기화
                this.$set(this.rsvDetailCopy, 'nights', params.data.stayNights)
                this.$set(this.rsvDetailCopy, 'rmCnt', params.data.rmCnt)
              } else { // 네이버
                this.$set(this.rsvDetailCopy, 'storeCd', params.data.storeCd)
                this.$set(this.rsvDetailCopy, 'storeNm', params.data.storeNm)
                this.$set(this.rsvDetailCopy, 'rsvBlckCd', params.data.rsvBlckCd)
                this.$set(this.rsvDetailCopy, 'rsvBlck', params.data.rsvBlckNm)
                this.$set(this.rsvDetailCopy, 'rmTypeCd', params.data.rmTypeCd)
                this.$set(this.rsvDetailCopy, 'rmTypeNm', params.data.rmTypeNm)
                this.$set(this.rsvDetailCopy, 'dongCd', params.data.dongCd)
                this.$set(this.rsvDetailCopy, 'dongCdNm', params.data.dongNm)
              }
              this.changeCiYmdOrNights() // 퇴실일자 및 요금변경
            }
            this.key += 1 // 패키지 번호를 지우고 동일한 패키지를 선택했을 때, pkgNo값이 매핑되지 않는 문제 해결을 위해 사용.
          }
        }
      })
    },
    /**
         * 객실 유형 정보 및 요금 총 합계 초기화
         */
    resetRmInfoAndTotalAmt () {
      // 객실 유형 정보가 있는 경우 초기화
      if (this.rsvDetailCopy.rmTypeCd) {
        this.rsvDetailCopy.rmTypeCd = ''
        this.rsvDetailCopy.rmTypeNm = ''
        this.rsvDetailCopy.dongCd = ''
        this.rsvDetailCopy.dongCdNm = ''
      }
      // 요금 총 합계 초기화
      if (this.rsvDetailCopy.payAmt) {
        this.rsvDetailCopy.payAmt = ''
      }
    },
    /**
         * 영업장에 따른 입실일자 및 퇴실일자 최소, 최대값 설정
         */
    setMinAndMaxDateByStore (bgnDate, endDate) { // 영업장 판매 시작일, 영업장 판매 종료일
      if (this.rmMinDate) { // 객실 판매 시작일이 있는 경우
        if (moment().isBefore(bgnDate) && moment(bgnDate).isBefore(this.rmMinDate)) {
          this.minDate = moment(bgnDate).format('YYYY-MM-DD') // 영업장 판매 시작일
        } else if (moment().isBefore(this.rmMinDate) && moment(this.rmMinDate).isBefore(bgnDate)) {
          this.minDate = moment(this.rmMinDate).format('YYYY-MM-DD') // 객실 판매시작일
        } else {
          this.minDate = moment().format('YYYY-MM-DD') // 오늘
        }
      } else { // 객실 판매 시작일이 없는 경우
        if (moment().isBefore(bgnDate)) {
          this.minDate = moment(bgnDate).format('YYYY-MM-DD')
        } else {
          this.minDate = moment().format('YYYY-MM-DD')
        }
      }
      if (this.rmMaxDate) { // 객실 판매 종료일이 있는 경우
        if (moment(endDate).isAfter(this.rmMaxDate)) {
          this.maxDate = moment(this.rmMaxDate).format('YYYY-MM-DD')
          this.coMaxDate = moment(this.maxDate).add(1, 'day').format('YYYY-MM-DD')
        } else {
          this.maxDate = moment(endDate).format('YYYY-MM-DD')
          this.coMaxDate = moment(this.maxDate).add(1, 'day').format('YYYY-MM-DD')
        }
      } else { // 객실 판매 종료일이 없는 경우
        this.maxDate = moment(endDate).format('YYYY-MM-DD')
        this.coMaxDate = moment(this.maxDate).add(1, 'day').format('YYYY-MM-DD')
      }
    },
    /**
         * 객실유형에 따른 입실일자 및 퇴실일자 최소, 최대값 설정
         */
    setMinAndMaxDateByRmType (bgnDate, endDate) { // 객실 판매 시작일, 객실 판매 종료일
      // mimDate 설정
      if (moment().isBefore(this.storeMinDate) && moment(this.storeMinDate).isBefore(this.bgnDate)) {
        this.minDate = moment(this.storeMinDate).format('YYYY-MM-DD') // 영업장 판매 시작일
      } else if (moment().isBefore(bgnDate) && moment(bgnDate).isBefore(this.storeMinDate)) {
        this.minDate = moment(bgnDate).format('YYYY-MM-DD') // 객실 판매시작일
      } else {
        this.minDate = moment().format('YYYY-MM-DD') // 오늘
      }
      // maxDate 설정
      if (moment(this.storeMaxDate).isAfter(endDate)) {
        this.maxDate = moment(endDate).format('YYYY-MM-DD')
        this.coMaxDate = moment(this.maxDate).add(1, 'day').format('YYYY-MM-DD')
      } else {
        this.maxDate = moment(this.storeMaxDate).format('YYYY-MM-DD')
        this.coMaxDate = moment(this.maxDate).add(1, 'day').format('YYYY-MM-DD')
      }
    },
    /**
         * 회원정보 OR 실수 변경
         */
    changeMemInfoOrRmCnt () {
      this.selectChargeInfo(this.rsvDetailCopy) // 요금 조회
    },
    /**
         * 입실일자 OR 박수 변경
         */
    changeCiYmdOrNights () {
      this.changeCoYmd() // 퇴실일자 변경
      this.selectChargeInfo(this.rsvDetailCopy) // 요금 조회
    },
    /**
         * 박수와 입실일자에 따른 퇴실일자 변경
         */
    changeCoYmd () {
      if (this.rsvDetailCopy.ciYmd && this.rsvDetailCopy.nights) {
        this.rsvDetailCopy.coYmd = moment(this.rsvDetailCopy.ciYmd).add(this.rsvDetailCopy.nights, 'days').format('YYYYMMDD')
      }
      this.getInventoryList() // 잔여객실 조회
    },
    /**
         * 잔여객실 현황 조회 및 부모로 리스트 전달
         */
    getInventoryList () {
      if (
        this.rsvDetailCopy.storeCd &&
                this.rsvDetailCopy.rsvBlckCd &&
                this.rsvDetailCopy.ciYmd &&
                this.rsvDetailCopy.coYmd
      ) {
        const param = {}
        param.storeCd = this.rsvDetailCopy.storeCd
        param.startDate = this.rsvDetailCopy.ciYmd
        param.endDate = moment(this.rsvDetailCopy.ciYmd).add(30, 'days').format('YYYYMMDD')
        param.rsvBlckCd = this.rsvDetailCopy.rsvBlckCd
        this.$emit('change-rm-list', param)
      }
    },
    /**
         * 요금조회
         */
    async selectChargeInfo (item) {
      if (
        (this.workStatus === 'new' || this.workStatus === 'update') &&
                item.storeCd &&
                item.nights &&
                item.rmCnt &&
                item.rmTypeCd &&
                item.rmTypeCd.length > 4
      ) {
        const param = {}
        param.ciYmd = item.ciYmd
        param.storeCd = item.storeCd
        param.nights = item.nights
        param.rmCnt = item.rmCnt
        if (item.pkgNo) { // 패키지
          param.pkgNo = item.pkgNo
          param.rmTypeCd = Array(item.rmTypeCd)
          // 패키지 요금 조회
          try {
            const res = await roomService.selectPkgAmount(this.childGroupFlag, param)
            this.$set(this.rsvDetailCopy, 'saleAmt', res.data.total) // 판매가
            this.$set(this.rsvDetailCopy, 'payAmt', res.data.rcpmnyTotal) // 입금가
            this.dayAmtList = res.data.list
          } catch (e) {
            this.$set(this.rsvDetailCopy, 'payAmt', 0) // 입금가
          }
        } else if (item.memNo) { // 객실
          param.memNo = item.memNo
          param.rsvBlckCd = item.rsvBlckCd
          param.rmTypeCd = item.rmTypeCd
          // 객실 요금 조회
          try {
            const res = await roomService.selectRoomAmount(param)
            this.$set(this.rsvDetailCopy, 'saleAmt', res.data.total) // 판매가
            this.$set(this.rsvDetailCopy, 'payAmt', res.data.rcpmnyTotal) // 입금가
            this.dayAmtList = res.data.list
          } catch (e) {
            this.$set(this.rsvDetailCopy, 'payAmt', 0) // 입금가
          }
        }
      }
    },
    /**
         * 일별 요금조회 팝업 오픈(예약 전)
         */
    openDayAmtInfo () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/RoomReservation/popup/DayAmtPopup',
        params: {
          dayAmtList: this.dayAmtList,
          isBefore: true,
          rmCnt: this.rsvDetailCopy.rmCnt
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 700
        }
      })
    },
    /**
         * 일별 요금조회 팝업 오픈(예약 후)
         */
    async openDayAmtInfoAfterRsv () {
      let type = ''
      // 객실인지 패키지인지 확인
      this.roomType.value === 'OTA_ROOM_API' ? type = 'room' : type = 'pkg'
      const res = await roomService.selectAmountAfterRsv(type, this.rsvDetailCopy.keyRsvNo)
      await this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/RoomReservation/popup/DayAmtPopup',
        params: {
          dayAmtList: res.data,
          isBefore: false
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 700
        }
      })
    }
  }
}
</script>
