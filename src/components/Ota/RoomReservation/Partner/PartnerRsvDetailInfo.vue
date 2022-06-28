<template>
    <div :key="key">
        <v-form ref="form" lazy-validationz>
            <v-row wrap dense>
                <v-col lg="2" md="3" cols="4">
                    <v-text-field
                        v-model="rsvDetailCopy.rsvNo"
                        label="예약번호"
                        readonly
                        outlined
                        hide-details
                        dense
                    ></v-text-field>
                </v-col>
                <v-col lg="2" md="3" cols="4">
                    <v-text-field
                        v-model="rsvDetailCopy.rsvState"
                        label="상태"
                        readonly
                        outlined
                        hide-details
                        dense
                    ></v-text-field>
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.keyRsvNo"
                        label="key예약번호"
                        readonly
                        outlined
                        hide-details
                        dense
                    ></v-text-field>
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.partnerRsvNo"
                        label="업체예약번호"
                        readonly
                        outlined
                        hide-details
                        dense
                    ></v-text-field>
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
                    />
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
                    ></v-text-field>
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
                    />
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
                    ></v-text-field>
                </v-col>
                <v-col lg="2" md="3" cols="4">
                    <v-text-field
                        v-model="rsvDetailCopy.storeCode"
                        label="영업장코드"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.storeName"
                        label="영업장명"
                        readonly
                        outlined
                        hide-details
                        dense
                    ></v-text-field>
                </v-col>
                <v-col lg="1" md="2" cols="2">
                    <v-text-field
                        v-model="rsvDetailCopy.nights"
                        label="박"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="1" md="2" cols="2">
                    <v-text-field
                        v-model="rsvDetailCopy.roomCount"
                        label="객"
                        readonly
                        outlined
                        hide-details
                        dense
                    ></v-text-field>
                </v-col>
                <v-col lg="3" md="4" cols="6">
                    <v-text-field
                        v-model="rsvDetailCopy.blockCode"
                        label="예약블럭"
                        outlined
                        hide-details
                        dense
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
                    <v-text-field
                        v-model="checkInDate"
                        label="입실일자"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
                </v-col>
                <v-col lg="2" md="3" cols="4">
                    <v-text-field
                        v-model="checkOutDate"
                        label="퇴실일자"
                        readonly
                        outlined
                        hide-details
                        dense
                    />
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
                    />
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
                        v-model="rcpmny"
                        label="입금금액"
                        readonly
                        outlined
                        hide-details
                        dense
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
                        v-model="rsvDetailCopy.crtName"
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
                        v-model="rsvDetailCopy.updName"
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
import NumberUtils from '@/utils/number.util'
import roomService from '@/api/modules/ota/roomReservation.service'

export default {
  name: 'PartnerRoomAndMemberInfo',
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
    }
  },
  data () {
    return {
      rsvDetailCopy: {}, // rsvDetail 정보 복사본
      key: 0 // 강제 렌더링을 위한 변수
    }
  },
  computed: {
    totalPrice () { // 판매가
      return NumberUtils.numberWithCommas(this.rsvDetailCopy.salePrice)
    },
    rcpmny () { // 입금가
      return NumberUtils.numberWithCommas(this.rsvDetailCopy.partnerRsvPrice)
    },
    checkInDate () {
      if (this.rsvDetailCopy.checkInDate) {
        return moment(this.rsvDetailCopy.checkInDate).format('YYYY-MM-DD')
      }
      return ''
    },
    checkOutDate () {
      if (this.rsvDetailCopy.checkOutDate) {
        return moment(this.rsvDetailCopy.checkOutDate).format('YYYY-MM-DD')
      }
      return ''
    }
  },
  watch: {
    rsvDetail: {
      handler (newVal) {
        this.rsvDetailCopy = newVal
        if (this.workStatus === '' || this.workStatus === 'detail') {
          this.key += 1 // 이용자 연락처가 바뀐걸 인식하지 못하는 버그를 위한 변수
        }
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
         * 일별 요금조회 팝업 오픈
         */
    openDayAmtInfo () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/RoomReservation/popup/DayAmtPopup',
        params: {
          dayAmtList: this.dayAmtList
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
      // 객실인지 패키지 인지 확인
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
