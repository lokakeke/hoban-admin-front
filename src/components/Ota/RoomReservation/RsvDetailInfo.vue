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
                        v-model="rsvDetailCopy.partnerRsvNo"
                        label="업체예약번호"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col v-if="roomType.value === 'OTA_PKG_API'" lg="2" md="3" cols="4">
                    <v-text-field
                        v-model="partnerName"
                        label="파트너명"
                        readonly
                        outlined
                        hide-details
                        dense
                    >
                    <!-- @keypress.enter="openPartnerInfo(rsvDetailCopy)"
                        <template v-slot:append v-if="roomType.value === 'OTA_PKG_API'">
                            <v-btn icon small color="primary" tabindex="-1" @click="openPartnerInfo(rsvDetailCopy)">
                                <v-icon>search</v-icon>
                            </v-btn>
                        </template>-->
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row wrap dense>
                <v-col v-if="roomType.value === 'OTA_ROOM_API' || rsvDetailCopy.rsvType === 'ROOM'" lg="2" md="3"
                       cols="4">
                    <v-text-field
                        v-model="rsvDetailCopy.memberNo"
                        label="회원번호"
                        readonly
                        outlined
                        hide-details
                        dense
                    >
<!--                      @keypress.enter="searchPartnerInfo()"
                        <template v-slot:append
                                  v-if="roomType.value === 'OTA_ROOM_API' || rsvDetailCopy.rsvType === 'ROOM'">
                            <v-btn icon small color="primary" tabindex="-1" @click="openPartnerInfo()">
                                <v-icon>search</v-icon>
                            </v-btn>
                        </template>-->
                    </v-text-field>
                </v-col>
                <v-col v-if="roomType.value === 'OTA_ROOM_API' || rsvDetailCopy.rsvType === 'ROOM'" lg="3" md="4"
                       cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.memberName"
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
                        v-model="rsvDetailCopy.packageNo"
                        label="패키지번호"
                        readonly
                        outlined
                        hide-details
                        dense
                    >
<!--                      @keypress.enter="openPackagePopup(rsvDetailCopy)"
                        <template v-slot:append
                                  v-if="roomType.value === 'OTA_PKG_API' || rsvDetailCopy.rsvType === 'PKG'">
                            <v-btn icon small color="primary" tabindex="-1" @click="openPackagePopup(rsvDetailCopy)">
                                <v-icon>search</v-icon>
                            </v-btn>
                        </template>-->
                    </v-text-field>
                </v-col>
                <v-col v-if="roomType.value === 'OTA_PKG_API' || rsvDetailCopy.rsvType === 'PKG'" lg="3" md="4"
                       cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.packageName"
                        label="패키지명"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="2" md="3" cols="4">
                    <v-text-field
                        v-model="rsvDetailCopy.storeCode"
                        label="영업장코드"
                        readonly
                        outlined
                        hide-details
                        dense
                    >
<!--                      @keypress.enter="searchStoreInfo(rsvDetailCopy)"
                        <template v-slot:append v-if="rsvDetailCopy">
                            <v-btn icon small color="primary" tabindex="-1" @click="openStorePopup(rsvDetailCopy)">
                                <v-icon>search</v-icon>
                            </v-btn>
                        </template>-->
                    </v-text-field>
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.storeName"
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
                        readonly
                        outlined
                        hide-details
                        dense
                        @input="changeCheckInDateOrNights"
                    />
                </v-col>
                <v-col v-if="roomType.value === 'OTA_ROOM_API' || rsvDetailCopy.rsvType === 'ROOM'" lg="1" md="2"
                       cols="2">
                    <v-text-field
                        v-model="rsvDetailCopy.roomCount"
                        label="객"
                        readonly
                        outlined
                        hide-details
                        dense
                        @input="changeMemInfoOrRoomCount"
                    />
                </v-col>
                <v-col v-if="roomType.value === 'OTA_PKG_API' || rsvDetailCopy.rsvType === 'PKG'" lg="1" md="2"
                       cols="2">
                    <v-text-field
                        v-model="rsvDetailCopy.nights"
                        label="박"
                        :readonly="groupFlag === 'ota'"
                        outlined
                        hide-details
                        dense
                        @input="changeCheckInDateOrNights"
                    />
                </v-col>
                <v-col v-if="roomType.value === 'OTA_PKG_API' || rsvDetailCopy.rsvType === 'PKG'" lg="1" md="2"
                       cols="2">
                    <v-text-field
                        v-model="rsvDetailCopy.roomCount"
                        label="객"
                        :readonly="groupFlag === 'ota'"
                        outlined
                        hide-details
                        dense
                        @input="changeMemInfoOrRoomCount"
                    />
                </v-col>
                <v-col lg="2" md="3" cols="4">
                    <v-text-field
                        v-model="rsvDetailCopy.blockCode"
                        label="예약블럭"
                        :readonly="groupFlag === 'ota'"
                        outlined
                        hide-details
                        dense
                        @keypress.enter="selectRsvBlockInfo(rsvDetailCopy)"
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.rsvBlock"
                        label="예약블럭명"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="2" md="3" cols="4">
                    <date-picker
                        v-model="rsvDetailCopy.checkInDate"
                        label="입실일자"
                        readonly
                        :min="minDate"
                        :max="checkInMaxDate"
                        hide-details
                        @change="changeCheckInDateOrNights"
                    />
                </v-col>
                <v-col lg="2" md="3" cols="4">
                    <date-picker
                        v-model="rsvDetailCopy.checkOutDate"
                        label="퇴실일자"
                        readonly
                        :min="minDate"
                        :max="checkOutMaxDate"
                        hide-details
                    />
                </v-col>
                <v-col lg="1" md="2" cols="2">
                    <p></p>
                </v-col>
                <v-col lg="1" md="2" cols="2">
                    <v-text-field
                        v-model="rsvDetailCopy.adultCount"
                        label="대인"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="1" md="2" cols="2">
                    <v-text-field
                        v-model="rsvDetailCopy.childCount"
                        label="소인"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.roomTypeCode"
                        label="객실유형코드"
                        readonly
                        outlined
                        hide-details
                        dense
                    >
<!--                      @keypress.enter="searchRmTypePopup(rsvDetailCopy)"
                        <template v-slot:append v-if="rsvDetailCopy">
                            <v-btn icon small color="primary" tabindex="-1" @click="openRmTypePopup(rsvDetailCopy)">
                                <v-icon>search</v-icon>
                            </v-btn>
                        </template>-->
                    </v-text-field>
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.roomTypeName"
                        label="객실유형명"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
<!--                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.dongCode"
                        label="동코드"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.dongCodeName"
                        label="동명"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>-->
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.guestName"
                        label="이용자명"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.guestTelNo"
                        label="이용자연락처"
                        readonly
                        outlined
                        hide-details
                        dense
                        v-mask="['###-####-####', '###-###-####']"
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.agentCode"
                        label="Agent코드"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.agentName"
                        label="Agent명"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.partnerName"
                        label="예약자명"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.partnerTelNo"
                        label="예약자연락처"
                        readonly
                        outlined
                        hide-details
                        dense
                        v-mask="['###-####-####', '###-###-####']"
                    />
                </v-col>
<!--                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.rsvIndCodeAndName"
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
                </v-col>-->
            </v-row>
            <v-row wrap dense>
                <v-col cols="12">
                    <p class="font-weight-bold mt-2" style="font-size: large">요금 예약 정보</p>
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="totalPrice"
                        label="입금금액"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
              <v-col cols="3"></v-col>
<!--                <v-col v-if="workStatus !== 'detail'" cols="3">
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
                </v-col>-->
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="totalPrice"
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
                        readonly
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
                        readonly
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
                        v-model="rsvDetailCopy.createName"
                        label="등록자"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.createDatetime"
                        label="등록일시"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="2" md="3" cols="4">
                    <v-text-field
                        v-model="rsvDetailCopy.modifyName"
                        label="수정자"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.modifyDatetime"
                        label="수정일시"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="2" md="3" cols="4">
                    <v-text-field
                        v-model="rsvDetailCopy.cancelResnCode"
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
import roomService from '@/api/modules/ota/roomReservation.service'
import partnerTermService from '@/api/modules/partner/partnerTerm.service'
import NumberUtils from '@/utils/number.util'

export default {
  name: 'RoomAndMemberInfo',
  props: {
    /** 객실/패키지 */
    roomType: {
      type: Object
    },
    /** 예약 상세 정보 객체 */
    rsvDetail: {
      type: Object
    },
    /** OTA인지 NAVER인지 구분값 */
    groupFlag: {
      type: String
    }
  },
  data () {
    return {
      rsvDetailCopy: {}, // rsvDetail 정보 복사본
      partnerName: '', // 파트너명
      dayAmtList: [], // 일별요금 목록
      minDate: '', // date picker min date
      checkInMaxDate: '', // 입실일자 date picker max date
      checkOutMaxDate: '', // 퇴실일자 date picker max date
      storeMinDate: '', // 영업장 판매 시작일자
      storeMaxDate: '', // 영업장 판매 종료일자
      roomMinDate: '', // 객실 판매 시작일자
      roomMaxDate: '', // 객실 판매 종료일자
      childGroupFlag: 'ota',
      key: 0 // 강제 렌더링을 위한 변수
    }
  },
  computed: {
    totalPrice () { // 판매가
      return NumberUtils.numberWithCommas(this.rsvDetailCopy.totalPrice)
    },
    rcpmny () { // 입금가
      return NumberUtils.numberWithCommas(this.rsvDetailCopy.totalPrice)
    }
  },
  watch: {
    roomType () { // 객실/패키지 변경시 파트너명 리셋
      this.partnerName = ''
    },
    rsvDetail: {
      handler (newVal) {
        this.rsvDetailCopy = newVal
        if (!newVal.storeCode) {
          this.partnerName = ''
        }
        /* if (this.workStatus === '' || this.workStatus === 'detail') {
          this.key += 1 // 이용자 연락처가 바뀐걸 인식하지 못하는 버그를 위한 변수
        } */
      }
    },
    rsvDetailCopy: {
      handler (newVal) {
        if (
          this.rsvDetailCopy.guestTelNo &&
                    this.rsvDetailCopy.guestTelNo.length > 12 &&
                    this.rsvDetailCopy.partnerRsvPrice
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
    setPartnerInfoResult (result) {
      this.$set(this, 'partnerName', result.partnerName) // 파트너명
      this.$set(this.rsvDetailCopy, 'partnerSeq', result.partnerSeq) // 파트너 번호(예치금에 필요)
      this.$set(this.rsvDetailCopy, 'termSeq', result.termSeq) // 예치금에 필요
      this.$set(this.rsvDetailCopy, 'partnerName', result.partnerName)
      this.$set(this.rsvDetailCopy, 'partnerTelNo', result.partnerTelNo)
      this.$set(this.rsvDetailCopy, 'agentCode', result.agentCode)
      this.$set(this.rsvDetailCopy, 'agentName', result.agentCodeName)
      if (this.roomType.value === 'OTA_ROOM_API') { // 객실인 경우
        this.$set(this.rsvDetailCopy, 'memberNo', result.memberNo)
        this.$set(this.rsvDetailCopy, 'memberName', result.memberName)
      }
    },
    /**
         * 회원번호/명 검색
         */
    async searchPartnerInfo () {
      const q = {}
      q.taskType = this.roomType.value
      let memberNo = this.rsvDetailCopy.memberNo
      if (memberNo && memberNo.length === 6) {
        memberNo = memberNo + '00'
      }
      q.memberNo = memberNo
      const param = {}
      param.q = q
      const res = await partnerTermService.selectPartnerTermList(param)
      if (res.data && res.data.length === 1) {
        this.setPartnerInfoResult(res.data[0])
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
          memberNo: this.rsvDetailCopy.memberNo
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1500,
          closeCallback: (params) => {
            if (params && params.data) {
              this.setPartnerInfoResult(params.data)
              this.changeMemInfoOrRoomCount()
            }
          }
        }
      })
    },
    /**
         * 영업장 정보 조회 결과값 화면에 매핑
         */
    mapStoreInfoResult (result) {
      this.$set(this.rsvDetailCopy, 'storeCode', result.storeCode)
      this.$set(this.rsvDetailCopy, 'storeName', result.storeName)
      this.$set(this.rsvDetailCopy, 'blockCode', result.blockCode)
      this.$set(this.rsvDetailCopy, 'rsvBlock', result.blockCodeName)
    },
    /**
         * 영업장번호/명 검색
         */
    async searchStoreInfo (item) {
      const param = {}
      param.storeCode = item.storeCode
      if (this.roomType.value === 'OTA_ROOM_API' || item.rsvType === 'ROOM') {
        param.useYn = '1'
        param.isNowSale = true
        const res = await roomService.selectStoreInfo(param)
        if (res.data && res.data.length === 1) {
          this.resetRoomInfoAndTotalPrice() // 객실 유형 정보 및 요금 총 합계 초기화
          this.mapStoreInfoResult(res.data[0]) // 결과값 화면에 매핑
          this.storeMinDate = res.data[0].saleStartDate
          this.storeMaxDate = res.data[0].saleEndDate
          this.setMinAndMaxDateByStore(res.data[0].saleStartDate, res.data[0].saleEndDate)
          this.getInventoryList() // 잔여객실 조회
        } else {
          this.openStorePopup(item)
        }
      } else { // 패키지
        if (item.packageNo) {
          param.packageNo = item.packageNo
          param.useYn = 'Y'
          const res = await roomService.selectStoreInfoByPackageNo(param)
          if (res.data && res.data.length === 1) {
            this.resetRoomInfoAndTotalPrice() // 객실 유형 정보 및 요금 총 합계 초기화
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
      const paramCheck = Boolean(this.roomType.value === 'OTA_ROOM_API' || ((this.roomType.value === 'OTA_PKG_API' || item.rsvType === 'PKG') && item.packageNo))
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
                this.resetRoomInfoAndTotalPrice() // 객실 유형 정보 및 요금 총 합계 초기화
                this.mapStoreInfoResult(params.data) // 결과값 화면에 매핑
                if (this.roomType.value === 'OTA_ROOM_API' || item.rsvType === 'ROOM') {
                  this.storeMinDate = params.data.saleStartDate
                  this.storeMaxDate = params.data.saleEndDate
                  this.setMinAndMaxDateByStore(params.data.saleStartDate, params.data.saleEndDate)
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
      param.blockCode = item.blockCode
      // 블럭정보 조회
      const res = await roomService.selectRsvBlockInfo(param)
      this.$set(this.rsvDetailCopy, 'blockCode', res.data.blockCode)
      this.$set(this.rsvDetailCopy, 'rsvBlock', res.data.blockName)
    },
    /**
         * 객실 유형 정보 조회 결과값 매핑
         */
    mapRmTypeInfoResult (result) {
      this.$set(this.rsvDetailCopy, 'roomTypeCode', result.roomTypeCode)
      this.$set(this.rsvDetailCopy, 'roomTypeName', result.roomTypeName)
      this.$set(this.rsvDetailCopy, 'dongCode', result.dongCode)
      this.$set(this.rsvDetailCopy, 'dongCodeName', result.dongCodeName)
    },
    /**
         * 객실유형코드 검색
         */
    async searchRmTypePopup (item) {
      if (item.storeCode) {
        const param = {}
        param.storeCode = item.storeCode
        param.roomTypeCode = item.roomTypeCode
        param.useYn = '1'
        if (item.packageNo) {
          param.packageNo = item.packageNo
        }
        // 객실유형코드 조회
        const res = await roomService.selectRoomTypeAndDongInfo(param)
        if (res.data && res.data.length === 1) {
          this.mapRmTypeInfoResult(res.data[0]) // 결과값을 화면에 매핑
          if (this.roomType.value === 'OTA_ROOM_API' || item.rsvType === 'ROOM') {
            this.roomMinDate = res.data[0].saleStartDate
            this.roomMaxDate = res.data[0].saleEndDate
            this.setMinAndMaxDateByRmType(res.data[0].saleStartDate, res.data[0].saleEndDate)
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
      if (item.storeCode) {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Ota/RoomReservation/popup/RoomTypePopup',
          params: {
            item: {
              storeCode: item.storeCode,
              packageNo: item.packageNo
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
                  this.roomMinDate = params.data.saleStartDate
                  this.roomMaxDate = params.data.saleEndDate
                  this.setMinAndMaxDateByRmType(params.data.saleStartDate, params.data.saleEndDate)
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
            packageNo: item.packageNo,
            rsvYn: 'Y',
            groupFlag: this.groupFlag
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
              this.$set(this.rsvDetailCopy, 'packageNo', params.data.packageNo)
              this.$set(this.rsvDetailCopy, 'packageName', params.data.packageName)
              // 입실일자 및 퇴실일자 최소, 최대값 설정
              if (moment().isBefore(params.data.saleStartDate)) {
                this.minDate = moment(params.data.saleStartDate).format('YYYY-MM-DD')
              } else {
                this.minDate = moment().format('YYYY-MM-DD')
              }
              this.checkInMaxDate = moment(params.data.saleEndDate).format('YYYY-MM-DD')
              this.checkOutMaxDate = moment(this.checkInMaxDate).add(1, 'day').format('YYYY-MM-DD')
              if (params.group === 'ota') {
                // 영업장 정보가 있는 경우 초기화
                if (this.rsvDetailCopy.storeCode) {
                  this.rsvDetailCopy.storeCode = ''
                  this.rsvDetailCopy.storeName = ''
                  this.rsvDetailCopy.blockCode = ''
                  this.rsvDetailCopy.rsvBlock = ''
                }
                this.resetRoomInfoAndTotalPrice() // 객실 유형 정보 및 요금 총 합계 초기화
                this.$set(this.rsvDetailCopy, 'nights', params.data.nights)
                this.$set(this.rsvDetailCopy, 'roomCount', params.data.roomCount)
              } else { // 네이버
                this.$set(this.rsvDetailCopy, 'storeCode', params.data.storeCode)
                this.$set(this.rsvDetailCopy, 'storeName', params.data.storeName)
                this.$set(this.rsvDetailCopy, 'blockCode', params.data.blockCode)
                this.$set(this.rsvDetailCopy, 'rsvBlock', params.data.rsvBlockName)
                this.$set(this.rsvDetailCopy, 'roomTypeCode', params.data.roomTypeCode)
                this.$set(this.rsvDetailCopy, 'roomTypeName', params.data.roomTypeName)
                this.$set(this.rsvDetailCopy, 'dongCode', params.data.dongCode)
                this.$set(this.rsvDetailCopy, 'dongCodeName', params.data.dongCodeName)
              }
              this.changeCheckInDateOrNights() // 퇴실일자 및 요금변경
            }
            this.key += 1 // 패키지 번호를 지우고 동일한 패키지를 선택했을 때, packageNo값이 매핑되지 않는 문제 해결을 위해 사용.
          }
        }
      })
    },
    /**
         * 객실 유형 정보 및 요금 총 합계 초기화
         */
    resetRoomInfoAndTotalPrice () {
      // 객실 유형 정보가 있는 경우 초기화
      if (this.rsvDetailCopy.roomTypeCode) {
        this.rsvDetailCopy.roomTypeCode = ''
        this.rsvDetailCopy.roomTypeName = ''
        this.rsvDetailCopy.dongCode = ''
        this.rsvDetailCopy.dongCodeName = ''
      }
      // 요금 총 합계 초기화
      if (this.rsvDetailCopy.partnerRsvPrice) {
        this.rsvDetailCopy.partnerRsvPrice = ''
      }
    },
    /**
         * 영업장에 따른 입실일자 및 퇴실일자 최소, 최대값 설정
         */
    setMinAndMaxDateByStore (startDate, endDate) { // 영업장 판매 시작일, 영업장 판매 종료일
      if (this.roomMinDate) { // 객실 판매 시작일이 있는 경우
        if (moment().isBefore(startDate) && moment(startDate).isBefore(this.roomMinDate)) {
          this.minDate = moment(startDate).format('YYYY-MM-DD') // 영업장 판매 시작일
        } else if (moment().isBefore(this.roomMinDate) && moment(this.roomMinDate).isBefore(startDate)) {
          this.minDate = moment(this.roomMinDate).format('YYYY-MM-DD') // 객실 판매시작일
        } else {
          this.minDate = moment().format('YYYY-MM-DD') // 오늘
        }
      } else { // 객실 판매 시작일이 없는 경우
        if (moment().isBefore(startDate)) {
          this.minDate = moment(startDate).format('YYYY-MM-DD')
        } else {
          this.minDate = moment().format('YYYY-MM-DD')
        }
      }
      if (this.roomMaxDate) { // 객실 판매 종료일이 있는 경우
        if (moment(endDate).isAfter(this.roomMaxDate)) {
          this.checkInMaxDate = moment(this.roomMaxDate).format('YYYY-MM-DD')
          this.checkOutMaxDate = moment(this.checkInMaxDate).add(1, 'day').format('YYYY-MM-DD')
        } else {
          this.checkInMaxDate = moment(endDate).format('YYYY-MM-DD')
          this.checkOutMaxDate = moment(this.checkInMaxDate).add(1, 'day').format('YYYY-MM-DD')
        }
      } else { // 객실 판매 종료일이 없는 경우
        this.checkInMaxDate = moment(endDate).format('YYYY-MM-DD')
        this.checkOutMaxDate = moment(this.checkInMaxDate).add(1, 'day').format('YYYY-MM-DD')
      }
    },
    /**
         * 객실유형에 따른 입실일자 및 퇴실일자 최소, 최대값 설정
         */
    setMinAndMaxDateByRmType (startDate, endDate) { // 객실 판매 시작일, 객실 판매 종료일
      // mimDate 설정
      if (moment().isBefore(this.storeMinDate) && moment(this.storeMinDate).isBefore(this.startDate)) {
        this.minDate = moment(this.storeMinDate).format('YYYY-MM-DD') // 영업장 판매 시작일
      } else if (moment().isBefore(startDate) && moment(startDate).isBefore(this.storeMinDate)) {
        this.minDate = moment(startDate).format('YYYY-MM-DD') // 객실 판매시작일
      } else {
        this.minDate = moment().format('YYYY-MM-DD') // 오늘
      }
      // maxDate 설정
      if (moment(this.storeMaxDate).isAfter(endDate)) {
        this.checkInMaxDate = moment(endDate).format('YYYY-MM-DD')
        this.checkOutMaxDate = moment(this.checkInMaxDate).add(1, 'day').format('YYYY-MM-DD')
      } else {
        this.checkInMaxDate = moment(this.storeMaxDate).format('YYYY-MM-DD')
        this.checkOutMaxDate = moment(this.checkInMaxDate).add(1, 'day').format('YYYY-MM-DD')
      }
    },
    /**
         * 회원정보 OR 실수 변경
         */
    changeMemInfoOrRoomCount () {
      this.selectChargeInfo(this.rsvDetailCopy) // 요금 조회
    },
    /**
         * 입실일자 OR 박수 변경
         */
    changeCheckInDateOrNights () {
      this.changeCheckOutDate() // 퇴실일자 변경
      this.selectChargeInfo(this.rsvDetailCopy) // 요금 조회
    },
    /**
         * 박수와 입실일자에 따른 퇴실일자 변경
         */
    changeCheckOutDate () {
      if (this.rsvDetailCopy.checkInDate && this.rsvDetailCopy.nights) {
        this.rsvDetailCopy.checkOutDate = moment(this.rsvDetailCopy.checkInDate).add(this.rsvDetailCopy.nights, 'days').format('YYYYMMDD')
      }
      this.getInventoryList() // 잔여객실 조회
    },
    /**
         * 잔여객실 현황 조회 및 부모로 리스트 전달
         */
    getInventoryList () {
      if (
        this.rsvDetailCopy.storeCode &&
                this.rsvDetailCopy.blockCode &&
                this.rsvDetailCopy.checkInDate &&
                this.rsvDetailCopy.checkOutDate
      ) {
        const param = {}
        param.storeCode = this.rsvDetailCopy.storeCode
        param.startDate = this.rsvDetailCopy.checkInDate
        param.endDate = moment(this.rsvDetailCopy.checkInDate).add(30, 'days').format('YYYYMMDD')
        param.blockCode = this.rsvDetailCopy.blockCode
        this.$emit('change-rm-list', param)
      }
    },
    /**
         * 요금조회
         */
    async selectChargeInfo (item) {
      if (item.storeCode && item.nights && item.roomCount &&
                item.roomTypeCode && item.roomTypeCode.length > 4) {
        const param = {}
        param.checkInDate = item.checkInDate
        param.storeCode = item.storeCode
        param.nights = item.nights
        param.roomCount = item.roomCount
        if (item.packageNo) { // 패키지
          param.packageNo = item.packageNo
          param.roomTypeCode = Array(item.roomTypeCode)
          // 패키지 요금 조회
          try {
            const res = await roomService.selectPkgAmount(this.childGroupFlag, param)
            this.$set(this.rsvDetailCopy, 'salePrice', res.data.total) // 판매가
            this.$set(this.rsvDetailCopy, 'partnerRsvPrice', res.data.rcpmnyTotal) // 입금가
            this.dayAmtList = res.data.list
          } catch (e) {
            this.$set(this.rsvDetailCopy, 'partnerRsvPrice', 0) // 입금가
          }
        } else if (item.memberNo) { // 객실
          param.memberNo = item.memberNo
          param.blockCode = item.blockCode
          param.roomTypeCode = item.roomTypeCode
          // 객실 요금 조회
          try {
            const res = await roomService.selectRoomAmount(param)
            this.$set(this.rsvDetailCopy, 'salePrice', res.data.total) // 판매가
            this.$set(this.rsvDetailCopy, 'partnerRsvPrice', res.data.rcpmnyTotal) // 입금가
            this.dayAmtList = res.data.list
          } catch (e) {
            this.$set(this.rsvDetailCopy, 'partnerRsvPrice', 0) // 입금가
          }
        }
      }
    },
    /**
         * 일별 요금조회 팝업 오픈(예약 전)
         */
    /* openDayAmtInfo () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/RoomReservation/popup/DayAmtPopup',
        params: {
          dayAmtList: this.dayAmtList,
          isBefore: true,
          roomCount: this.rsvDetailCopy.roomCount
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 700
        }
      })
    }, */
    /**
         * 일별 요금조회 팝업 오픈(예약 후)
         */
    /* async openDayAmtInfoAfterRsv () {
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
    } */
  }
}
</script>
