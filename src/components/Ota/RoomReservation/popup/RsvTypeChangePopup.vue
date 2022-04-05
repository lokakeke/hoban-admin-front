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
              v-model="newItem.rmTypeName"
              label="객실유형명"
              disabled
              outlined
              hide-details
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="ciYmd"
              label="입실일자"
              disabled
              outlined
              hide-details
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="coYmd"
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
              v-model="newItem.rmCnt"
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
              v-model="newItem.pkgNo"
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
              v-model="newItem.saleBgnYmd"
              label="판매시작일"
              disabled
              outlined
              hide-details
              dense
            />
          </v-col>
          <v-col cols="3" v-if="type === pkg">
            <v-text-field
              v-model="newItem.saleEndYmd"
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
              v-model="newItem.smsPhone"
              label="이용자연락처"
              outlined
              hide-details
              dense
              v-mask="['###-####-####', '###-###-####']"
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="newItem.chainRsvNo"
              label="업체주문번호"
              required
              outlined
              hide-details
              dense
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="totalAmt"
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
      saleAmt: 0, // 판매가
      partnerName: ''
    }
  },
  computed: {
    totalAmt () { // 입금금액(판매금액)
      return NumberUtils.numberWithCommas(this.rsvInfo.payAmt) // + '(' + NumberUtils.numberWithCommas(this.saleAmt) + ')'
    },
    ciYmd () {
      return moment(this.rsvInfo.ciYmd).format('YYYY-MM-DD')
    },
    coYmd () {
      return moment(this.rsvInfo.coYmd).format('YYYY-MM-DD')
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
      this.newItem.rmTypeName = this.rsvInfo.rmTypeName
      this.newItem.nights = this.rsvInfo.nights
      this.newItem.rmCnt = this.rsvInfo.rmCnt
      this.newItem.guestName = this.rsvInfo.guestName
      this.newItem.smsPhone = this.rsvInfo.smsPhone
      this.newItem.chainRsvNo = this.rsvInfo.chainRsvNo
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
                this.newItem.pkgNo = '' // 패키지번호 초기화
                this.$set(this.newItem, 'memNo', params.data.memNo)
                this.$set(this.newItem, 'memName', params.data.memName)
                this.$set(this.newItem, 'cntrctYmd', params.data.cntrctYmd)
                this.$set(this.newItem, 'cancelYmd', params.data.cancelYmd)
                this.newItem.ptnrName = params.data.ptnrName // 예약자 이름
                this.newItem.rsvGuestTelNo = params.data.capTelNo // 예약자 번호
                this.newItem.agentCode = params.data.agentCode
                this.selectRoomAmount()
              } else { // 패키지로 예약이관
                this.$set(this, 'partnerName', params.data.ptnrName)
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
      priceParam.ciYmd = this.rsvInfo.ciYmd.replace(/-/gi, '')
      priceParam.rmTypeCode = this.rsvInfo.rmTypeCode
      priceParam.nights = this.rsvInfo.nights
      priceParam.rmCnt = this.rsvInfo.rmCnt
      priceParam.rsvBlckCode = this.rsvInfo.rsvBlckCode
      try {
        // 요금 조회
        const res = await roomService.selectRoomAmount(priceParam)
        this.rsvInfo.payAmt = res.data.rcpmnyTotal // 입금가
        this.saleAmt = res.data.total // 판매가
      } catch (e) {
        this.rsvInfo.payAmt = 0 // 입금가
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
              this.$set(this.newItem, 'pkgNo', params.data.pkgNo)
              this.$set(this.newItem, 'pkgName', params.data.pkgName)
              this.$set(this.newItem, 'saleBgnYmd', params.data.saleBgnYmd)
              this.$set(this.newItem, 'saleEndYmd', params.data.saleEndYmd)
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
      priceParam.pkgNo = this.newItem.pkgNo
      priceParam.storeCode = this.rsvInfo.storeCode
      priceParam.rmTypeCode = Array(this.rsvInfo.rmTypeCode)
      priceParam.ciYmd = this.rsvInfo.ciYmd
      priceParam.nights = this.rsvInfo.nights
      priceParam.rmCnt = this.rsvInfo.rmCnt
      try {
        // 요금 조회
        const res = await roomService.selectPkgAmount('ota', priceParam)
        this.rsvInfo.payAmt = res.data.rcpmnyTotal // 입금가
        this.saleAmt = res.data.total // 판매가
      } catch (e) {
        this.rsvInfo.payAmt = 0 // 입금가
      }
    },
    /**
     * 예약 이관 실행
     */
    update () {
      // 파트너 일 경우 당일예약불가 여부 체크
      if (this.isPartner && moment().format('YYYYMMDD') === this.rsvInfo.ciYmd && this.newItem.todayRsvYn === 'N') {
        this.$dialog.alert('당일예약 불가 상품입니다.')
        return
      }
      this.validForm(this.$refs.form).then(() => {
        this.newItem.payAmt = this.rsvInfo.payAmt // newItem에 payAmt 세팅
        this.close({ data: this.newItem })
      })
    }
  }
}
</script>
