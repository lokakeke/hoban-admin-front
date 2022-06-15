<template>
  <dialog-base :instance="instance" title="예약 이관">
    <v-tabs grow class="pb-2">
      <v-tab v-if="isPartner && rsvInfo.rsvType === room" @click="resetParams(1)">객실 > 패키지</v-tab>
      <v-tab v-if="!isPartner && rsvInfo.rsvType === room" @click="resetParams(2)">객실 > 패키지</v-tab>
      <v-tab v-if="!isPartner && rsvInfo.rsvType === room" @click="resetParams(2)">객실 > 객실</v-tab>
      <v-tab v-if="rsvInfo.rsvType === pkg" @click="resetParams(2)">패키지 > 패키지</v-tab>
      <v-tab v-if="rsvInfo.rsvType === pkg" @click="resetParams(2)">패키지 > 객실</v-tab>
    </v-tabs>
    <template>
      <v-form ref="form" lazy-validation>
        <v-row>
          <v-col cols="3">
            <v-text-field
              v-model="newItem.storeName"
              label="영업장명"
              disabled
              outlined
              hide-details
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="newItem.roomTypeName"
              label="객실유형명"
              disabled
              outlined
              hide-details
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="checkInDate"
              label="입실일자"
              disabled
              outlined
              hide-details
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="checkOutDate"
              label="퇴실일자"
              disabled
              outlined
              hide-details
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
              v-model="newItem.nights"
              label="박"
              disabled
              outlined
              hide-details
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
              v-model="newItem.roomCount"
              label="객"
              disabled
              outlined
              hide-details
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3" v-if="type === room">
            <v-text-field
              v-model="newItem.memNo"
              label="회원번호"
              outlined
              hide-details
              dense
              :rules="emptyRules"
              @keypress.enter="openPartnerInfo"
            >
              <template v-slot:append v-if="type === room">
                <v-btn icon small color="primary" tabindex="-1" @click="openPartnerInfo">
                  <v-icon>search</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="3" v-if="type === room">
            <v-text-field
              v-model="newItem.memName"
              label="회원명"
              disabled
              outlined
              hide-details
              dense
            />
          </v-col>
          <v-col cols="3" v-if="type === pkg">
            <v-text-field
              v-model="newItem.packageNo"
              label="패키지번호"
              outlined
              hide-details
              dense
              :rules="emptyRules"
              @keypress.enter="openPackagePopup"
            >
              <template v-slot:append v-if="type === pkg">
                <v-btn icon small color="primary" tabindex="-1" @click="openPackagePopup">
                  <v-icon>search</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="3" v-if="type === pkg">
            <v-text-field
              v-model="newItem.pkgName"
              label="패키지명"
              disabled
              outlined
              hide-details
              dense
            />
          </v-col>
          <v-col cols="3" v-if="type === room">
            <v-text-field
              v-model="newItem.cntrctYmd"
              label="계약일자"
              disabled
              outlined
              hide-details
              dense
            />
          </v-col>
          <v-col cols="3" v-if="type === room">
            <v-text-field
              v-model="newItem.cancelYmd"
              label="해약일자"
              disabled
              outlined
              hide-details
              dense
            />
          </v-col>
          <v-col cols="3" v-if="type === pkg">
            <v-text-field
              v-model="newItem.saleStartDate"
              label="판매시작일"
              disabled
              outlined
              hide-details
              dense
            />
          </v-col>
          <v-col cols="3" v-if="type === pkg">
            <v-text-field
              v-model="newItem.saleEndDate"
              label="판매종료일"
              disabled
              outlined
              hide-details
              dense
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="newItem.guestName"
              label="이용자명"
              required
              outlined
              hide-details
              dense
              :rules="emptyRules"
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="newItem.guestTelNo"
              label="이용자연락처"
              outlined
              hide-details
              dense
              v-mask="['###-####-####', '###-###-####']"
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="newItem.partnerRsvNo"
              label="업체주문번호"
              required
              outlined
              hide-details
              dense
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="totalPrice"
              label="입금금액"
              required
              readonly
              outlined
              hide-details
              dense
              :rules="emptyRules"
            />
          </v-col>
          <v-col cols="3" v-if="type === pkg">
            <v-text-field
              v-model="partnerName"
              label="파트너명"
              outlined
              hide-details
              dense
              @keypress.enter="openPartnerInfo(rsvInfo)"
            >
              <template v-slot:append v-if="type === pkg">
                <v-btn icon small color="primary" tabindex="-1" @click="openPartnerInfo(rsvInfo)">
                  <v-icon>search</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="3" v-if="type === pkg">
            <v-text-field
              v-model="newItem.agentCode"
              label="Agent코드"
              readonly
              outlined
              hide-details
              dense
              :rules="emptyRules"
            />
          </v-col>
          <v-col cols="3" v-if="type === pkg">
            <v-text-field
              v-model="newItem.agentName"
              label="Agent명"
              readonly
              outlined
              hide-details
              dense
            />
          </v-col>
        </v-row>
      </v-form>
      <v-row>
        <v-col class="text-right">
          <v-btn outlined rounded color="blue" @click="update">변경(F10)</v-btn>
          <v-btn outlined rounded color="primary" @click="close">닫기(ESC)</v-btn>
        </v-col>
      </v-row>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import NumberUtils from '@/utils/number.util'
import roomService from '@/api/modules/ota/roomReservation.service'

export default {
  extends: DialogBase,
  name: 'RsvTypeChangePopup',
  data () {
    return {
      rsvInfo: {},
      newItem: {},
      type: 'PKG', // Tab의 변경을 담는 변수
      pkg: 'PKG',
      room: 'ROOM',
      salePrice: 0, // 판매가
      partnerName: ''
    }
  },
  computed: {
    totalPrice () { // 입금금액(판매금액)
      return NumberUtils.numberWithCommas(this.rsvInfo.partnerRsvPrice) // + '(' + NumberUtils.numberWithCommas(this.salePrice) + ')'
    },
    checkInDate () {
      return moment(this.rsvInfo.checkInDate).format('YYYY-MM-DD')
    },
    checkOutDate () {
      return moment(this.rsvInfo.checkOutDate).format('YYYY-MM-DD')
    }
  },
  mounted () {
    this.rsvInfo = _.cloneDeep(this.instance.params.item)
    this.setOriginInfo() // 기존 예약정보 세팅
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [
        {
          target: 'F10',
          action: this.update
        }
      ]
    })
  },
  methods: {
    /**
     * tab변경 시 초기화
     */
    resetParams (order) {
      if (order !== 1) {
        this.newItem = {}
        if (this.type === this.room) {
          this.type = this.pkg
        } else if (this.type === this.pkg) {
          this.type = this.room
        }
        this.setOriginInfo()
      }
    },
    /**
     * 기존의 예약 정보 세팅
     */
    setOriginInfo () {
      this.newItem.storeName = this.rsvInfo.storeName
      this.newItem.roomTypeName = this.rsvInfo.roomTypeName
      this.newItem.nights = this.rsvInfo.nights
      this.newItem.roomCount = this.rsvInfo.roomCount
      this.newItem.guestName = this.rsvInfo.guestName
      this.newItem.guestTelNo = this.rsvInfo.guestTelNo
      this.newItem.partnerRsvNo = this.rsvInfo.partnerRsvNo
      this.newItem.agentCode = this.rsvInfo.agentCode
      this.newItem.agentName = this.rsvInfo.agentName
    },
    /**
     * 회원번호/명 검색창 오픈
     */
    openPartnerInfo () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/PartnerTermSearch',
        params: {
          taskType: 'OTA_ROOM_API'
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1200,
          closeCallback: (params) => {
            if (params && params.data) {
              if (this.type === this.room) { // 객실로 예약이관
                this.newItem.packageNo = '' // 패키지번호 초기화
                this.$set(this.newItem, 'memNo', params.data.memNo)
                this.$set(this.newItem, 'memName', params.data.memName)
                this.$set(this.newItem, 'cntrctYmd', params.data.cntrctYmd)
                this.$set(this.newItem, 'cancelYmd', params.data.cancelYmd)
                this.newItem.partnerName = params.data.partnerName // 예약자 이름
                this.newItem.partnerTelNo = params.data.partnerTelNo // 예약자 번호
                this.newItem.agentCode = params.data.agentCode
                this.selectRoomAmount()
              } else { // 패키지로 예약이관
                this.$set(this, 'partnerName', params.data.partnerName)
                this.newItem.agentCode = params.data.agentCode
                this.newItem.agentName = params.data.agentCodeName
              }
            }
          }
        }
      })
    },
    /**
     * 객실 요금 조회
     */
    async selectRoomAmount () {
      // 요금 조회 파라미터 세팅
      const priceParam = {}
      priceParam.memNo = this.newItem.memNo
      priceParam.storeCode = this.rsvInfo.storeCode
      priceParam.checkInDate = this.rsvInfo.checkInDate.replace(/-/gi, '')
      priceParam.roomTypeCode = this.rsvInfo.roomTypeCode
      priceParam.nights = this.rsvInfo.nights
      priceParam.roomCount = this.rsvInfo.roomCount
      priceParam.blockCode = this.rsvInfo.blockCode
      try {
        // 요금 조회
        const res = await roomService.selectRoomAmount(priceParam)
        this.rsvInfo.partnerRsvPrice = res.data.rcpmnyTotal // 입금가
        this.salePrice = res.data.total // 판매가
      } catch (e) {
        this.rsvInfo.partnerRsvPrice = 0 // 입금가
      }
    },
    /**
     * 패키지번호/명 검색창 오픈
     */
    openPackagePopup () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/RoomReservation/popup/RsvTypePackSearchPopup',
        params: {
          item: this.rsvInfo
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 1100,
          closeCallback: (params) => {
            if (params && params.data) {
              this.newItem.memNo = '' // 회원번호 초기화
              this.$set(this.newItem, 'packageNo', params.data.packageNo)
              this.$set(this.newItem, 'pkgName', params.data.pkgName)
              this.$set(this.newItem, 'saleStartDate', params.data.saleStartDate)
              this.$set(this.newItem, 'saleEndDate', params.data.saleEndDate)
              this.$set(this.newItem, 'todayRsvYn', params.data.todayRsvYn)
              this.selectPackageAmount()
            }
          }
        }
      })
    },
    /**
     * 패키지 요금 조회
     */
    async selectPackageAmount () {
      const priceParam = {}
      priceParam.packageNo = this.newItem.packageNo
      priceParam.storeCode = this.rsvInfo.storeCode
      priceParam.roomTypeCode = Array(this.rsvInfo.roomTypeCode)
      priceParam.checkInDate = this.rsvInfo.checkInDate
      priceParam.nights = this.rsvInfo.nights
      priceParam.roomCount = this.rsvInfo.roomCount
      try {
        // 요금 조회
        const res = await roomService.selectPkgAmount('ota', priceParam)
        this.rsvInfo.partnerRsvPrice = res.data.rcpmnyTotal // 입금가
        this.salePrice = res.data.total // 판매가
      } catch (e) {
        this.rsvInfo.partnerRsvPrice = 0 // 입금가
      }
    },
    /**
     * 예약 이관 실행
     */
    update () {
      // 파트너 일 경우 당일예약불가 여부 체크
      if (this.isPartner && moment().format('YYYYMMDD') === this.rsvInfo.checkInDate && this.newItem.todayRsvYn === 'N') {
        this.$dialog.alert('당일예약 불가 상품입니다.')
        return
      }
      this.validForm(this.$refs.form).then(() => {
        this.newItem.partnerRsvPrice = this.rsvInfo.partnerRsvPrice // newItem에 partnerRsvPrice 세팅
        this.close({ data: this.newItem })
      })
    }
  }
}
</script>
