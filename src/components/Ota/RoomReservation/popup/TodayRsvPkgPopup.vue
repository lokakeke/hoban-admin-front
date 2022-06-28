<template>
  <dialog-base :instance="instance" :title="'당일 예약 패키지'">
    <div>
      <v-form class="pb-2" ref="form" lazy-validation autocomplate="off">
        <v-row>
          <v-col v-if="!isPartner" lg="2" md="3" cols="4">
            <v-text-field
              v-model="adminPartnerInfo.partnerName"
              label="파트너명"
              outlined
              hide-details
              dense
              @keypress.enter="openPartnerInfo"
            >
              <template v-slot:append v-if="!isPartner">
                <v-btn icon small color="primary" tabindex="-1" @click="openPartnerInfo">
                  <v-icon>search</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col v-if="isPartner" lg="2" md="3" cols="6">
            <v-autocomplete
              v-model="taskTypeName"
              :items="taskTypeNameList"
              label="업무구분명"
              :rules="emptyRules"
              outlined
              clearable
              hide-details
              dense
            ></v-autocomplete>
          </v-col>
          <v-col lg="2" md="3" cols="6">
            <v-text-field
              v-model="form.packageNo"
              label="패키지번호"
              :rules="emptyRules"
              outlined
              clearable
              hide-details
              dense
              @keypress.enter="openPackagePopup(form)"
            >
              <template v-slot:append>
                <v-btn icon small color="primary" tabindex="-1" @click="openPackagePopup(form)">
                  <v-icon>search</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col lg="2" md="3" cols="6">
            <v-text-field
              v-model="form.packageName"
              label="패키지명"
              outlined
              disabled
              hide-details
              dense
            ></v-text-field>
          </v-col>
          <v-col lg="2" md="3" cols="6">
            <v-text-field
              v-model="saleStartDate"
              label="패키지시작일"
              :rules="emptyRules"
              outlined
              disabled
              hide-details
              dense
            ></v-text-field>
          </v-col>
          <v-col lg="2" md="3" cols="6">
            <v-text-field
              v-model="saleEndDate"
              label="패키지종료일"
              outlined
              disabled
              hide-details
              dense
            ></v-text-field>
          </v-col>
          <v-col lg="2" md="3" cols="6">
            <v-text-field
              v-model="form.storeCode"
              label="영업장"
              :rules="emptyRules"
              outlined
              clearable
              hide-details
              dense
              @keypress.enter="searchStoreInfo(form)"
            >
              <template v-slot:append>
                <v-btn icon small color="primary" tabindex="-1" @click="openStorePopup(form)">
                  <v-icon>search</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col lg="2" md="3" cols="6">
            <v-text-field
              v-model="form.storeName"
              label="영업장명"
              disabled
              outlined
              hide-details
              dense
            ></v-text-field>
          </v-col>
          <v-col lg="2" md="3" cols="6">
            <v-text-field
              v-model="form.roomTypeCode"
              label="객실유형"
              outlined
              hide-details
              dense
              @keypress.enter="searchRmTypePopup(form)"
            >
              <template v-slot:append>
                <v-btn icon small color="primary" tabindex="-1" @click="openRmTypePopup(form)">
                  <v-icon>search</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col lg="2" md="3" cols="6">
            <v-text-field
              v-model="form.roomTypeName"
              label="객실유형명"
              disabled
              outlined
              hide-details
              dense
            ></v-text-field>
          </v-col>
          <v-col lg="1" md="2" cols="2">
            <v-text-field
              v-model="form.nights"
              label="박"
              :rules="emptyRules"
              disabled
              outlined
              hide-details
              dense
            ></v-text-field>
          </v-col>
          <v-col lg="1" md="2" cols="2">
            <v-text-field
              v-model="form.roomCount"
              label="객"
              :rules="emptyRules"
              disabled
              outlined
              hide-details
              dense
            ></v-text-field>
          </v-col>
          <v-col class="text-right">
            <v-btn  outlined rounded color="primary" @click="search">
              <v-icon left>search</v-icon>검색(F3)
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
      <v-sheet>
        <v-toolbar flat color="white">
          <v-toolbar-title>{{ thisMonth }}</v-toolbar-title>
          <v-spacer />
          <v-btn
            class="ma-2"
            outlined rounded color="orange"
            @click="openAmountSearchDialog"
          >
            패키지 요금 조회
          </v-btn>
          <div
            class="pa-2 mx-1 light-blue border-rad-sm white--text"
          >
            예약 가능
          </div>
          <div
            class="pa-2 mx-1 teal border-rad-sm white--text"
          >
            회원 우선 예약
          </div>
          <div
            class="pa-2 mx-1 red border-rad-sm white--text"
          >
            예약 마감
          </div>
        </v-toolbar>
      </v-sheet>
      <v-sheet min-height="300">
        <v-calendar
          ref="calendar"
          locale="ko"
          v-model="focus"
          :type="type"
          :events="events"
          :event-more="false"
          :event-color="getEventColor"
          @change="updateRange"
          @click:event="setSaveForm"
        >
          <template v-slot:event="{ event }">
            <v-tooltip v-if="event.name" top>
              <template v-slot:activator="{ on }">
                <v-sheet
                  :color="event.color"
                  class="white--text pa-1" v-on="on"
                >
                  {{ event.name }}
                </v-sheet>
              </template>
              <div v-if="event.nameCheck === names[0].name || event.nameCheck === names[1].name || event.nameCheck === names[4].name">
                <span>{{ event.tooltip }}</span>
              </div>
              <div v-if="event.nameCheck === names[3].name">
                <span>{{ event.memo }}</span>
              </div>
            </v-tooltip>
          </template>
        </v-calendar>
      </v-sheet>
      <app-card :heading="'예약 정보'" col-classes="col-12 pa-0">
        <v-form lazy-validation ref="rsvForm" autocomplete="off">
          <v-row>
            <v-col lg="2" md="3" cols="6">
              <v-text-field
                v-model="saveForm.checkInDate"
                label="선택한 날짜"
                :rules="emptyRules"
                outlined
                disabled
                hide-details
                dense
              ></v-text-field>
            </v-col>
            <v-col lg="2" md="3" cols="6">
              <v-text-field
                v-model="saveForm.roomTypeName"
                label="객실유형명"
                :rules="emptyRules"
                outlined
                disabled
                hide-details
                dense
              ></v-text-field>
            </v-col>
            <v-col lg="2" md="3" cols="6">
              <v-text-field
                v-model="totalPrice"
                label="입금금액"
                :rules="emptyRules"
                outlined
                disabled
                hide-details
                dense
              />
            </v-col>
            <v-col lg="2" md="3" cols="6">
              <v-text-field
                v-model="salePrice"
                label="판매금액"
                :rules="emptyRules"
                outlined
                disabled
                hide-details
                dense
              />
            </v-col>
            <v-col lg="2" md="3" cols="6">
              <v-text-field
                v-model="saveForm.partnerRsvNo"
                label="업체예약번호"
                outlined
                clearable
                hide-details
                dense
              ></v-text-field>
            </v-col>
            <v-col lg="2" md="3" cols="6">
              <v-text-field
                v-model="saveForm.guestName"
                label="이용자명"
                :rules="emptyRules"
                outlined
                clearable
                hide-details
                dense
              ></v-text-field>
            </v-col>
            <v-col lg="2" md="3" cols="6">
              <v-text-field
                v-model="saveForm.guestTelNo"
                label="이용자연락처"
                outlined
                clearable
                hide-details
                dense
                v-mask="['###-####-####', '###-###-####']"
              ></v-text-field>
            </v-col>
            <v-col lg="1" md="2" cols="2">
              <v-text-field
                v-model="saveForm.adultCount"
                label="대인"
                :rules="emptyRules"
                outlined
                hide-details
                dense
              ></v-text-field>
            </v-col>
            <v-col lg="1" md="2" cols="2">
              <v-text-field
                v-model="saveForm.childCount"
                label="소인"
                outlined
                hide-details
                dense
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
        <v-row>
          <v-col align-self="center" class="text-right pl-0">
            <v-btn outlined rounded color="green" @click="resetSaveForm">
              <v-icon left>refresh</v-icon>초기화(F4)
            </v-btn>
            <v-btn outlined rounded color="blue" @click="save">
              <v-icon left>save</v-icon>예약(F10)
            </v-btn>
            <v-btn outlined rounded color="primary" @click="close">닫기(ESC)</v-btn>
          </v-col>
        </v-row>
      </app-card>
    </div>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'

import { mapGetters } from 'vuex'

import NumberUtils from '@/utils/number.util'

import roomService from '@/api/modules/ota/roomReservation.service'
import packageService from '@/api/modules/ota/package.service'
import pmsReservationService from '@/api/modules/pms/reservation.service'

export default {
  extends: DialogBase,
  name: 'TodayRsvPkg',
  data () {
    return {
      form: {}, // 검색 폼
      saveForm: {}, // 저장 폼
      type: 'month',
      start: null,
      end: null,
      mode: 'stack',
      focus: '',
      today: moment().format('YYYY-MM-DD'),
      weekday: [0, 1, 2, 3, 4, 5, 6],
      events: [],
      colors: ['light-blue', 'red', 'grey', 'teal'],
      names: [
        { code: 'R', name: '예약가능' },
        { code: 'F', name: '예약마감' },
        { code: 'D', name: '예약불가능' },
        { code: 'H', name: '휴일' },
        { code: 'M', name: '회원우선예약' }
      ],
      pkgSearchParam: {
        packageNo: '', // 패키지번호
        storeCode: '',
        checkInDate: moment().format('YYYYMMDD'),
        partnerSeq: 0,
        roomDayLimit: 0, // 잔여객실 수 최대치 제한
        roomTypeCode: '',
        blockCode: '',
        nights: 1,
        roomCount: 1,
        todayRsvYn: '',
        todayRsvTime: '',
        searchDayCount: 1 // 기준일로부터 조회 일 수
      },
      todayRsvYn: '', // 당일 예약 여부
      saleStartDate: '', // 판매시작일
      saleEndDate: '', // 판매종료일
      holidayList: [], // 휴일 정보 목록
      isSearch: true, // 패키지 변경 시 이벤트 변경을 막는 변수
      taskTypeName: '', // 업무구분명(파트너)
      taskTypeNameList: [], // 업무구분 목록(파트너)
      ptnrBasicInfo: [], // 파트너 기본 정보(파트너)
      leaveCount: 0,
      adminPartnerInfo: {} // 파트너 정보
    }
  },
  computed: {
    ...mapGetters({ user: 'auth/user' }),
    thisMonth () {
      const { start, end } = this
      if (!start || !end) return ''

      const startMonth = this.monthFormatter(start)
      const startYear = start.year

      return `${startYear}년 ${startMonth}`
    },
    monthFormatter () {
      return this.$refs.calendar.getFormatter({ timeZone: 'UTC', month: 'long' })
    },
    totalPrice () { // 입금가
      return NumberUtils.numberWithCommas(this.saveForm.totalPrice)
    },
    salePrice () { // 판매가
      return NumberUtils.numberWithCommas(this.saveForm.salePrice)
    }
  },
  mounted () {
    this.ptnrBasicInfo = _.cloneDeep(this.instance.params.ptnrBasicInfo)
    this.initInfo()
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [
        {
          target: 'F3',
          action: this.search
        },
        {
          target: 'F4',
          action: this.resetSaveForm
        },
        {
          target: 'F10',
          action: this.save
        }
      ]
    })
  },
  methods: {
    /**
     * 기본 정보 설정
     */
    initInfo () {
      if (this.ptnrBasicInfo && this.ptnrBasicInfo.length > 0) {
        for (const info of this.ptnrBasicInfo) {
          this.taskTypeNameList.push(info.taskTypeName)
        }
        if (this.taskTypeNameList.length === 1) {
          this.taskTypeName = this.taskTypeNameList[0]
        }
      }
    },
    /**
     * 이벤트 컬러 설정
     */
    getEventColor (event) {
      return event.color
    },
    /**
     * 달력 change 이벤트시 실행
     */
    updateRange ({ start, end }) {
      this.start = start
      this.end = end
    },
    /**
     * 검색 버튼 클릭 시
     */
    async search () {
      this.pkgSearchParam.storeCode = this.form.storeCode
      if (this.form.roomTypeCode) {
        this.pkgSearchParam.roomTypeCode = this.form.roomTypeCode
      }
      this.isSearch = true
      await this.searchOnePkgInfo(this.form) // 선택된 패키지 정보 조회
      this.selectInventory()
    },
    /**
     * 패키지 현황 조회
     */
    selectInventory () {
      if (this.isSearch) {
        this.validForm(this.$refs.form).then(() => {
          this.pkgSearchParam.isRealLeaveCount = 'Y'
          if (this.pkgSearchParam.roomTypeCode === '') {
            roomService.selectPkgInventory('store', this.pkgSearchParam).then(res => { // 영업장으로만 조회
              this.realSetEvents(res.data)
            })
          } else {
            roomService.selectPkgInventory('store-room', this.pkgSearchParam).then(res => { // 영업장과 객실유형으로 조회
              this.realSetEvents(res.data)
            })
          }
        })
      } else {
        this.events = []
      }
      this.resetSaveForm() // 예약 정보 폼 리셋
      this.$set(this.saveForm, 'totalPrice', 0) // 총합계 리셋
    },
    /**
     * 객실 현황 이벤트 매핑
     */
    realSetEvents (result) {
      if (result && result.length > 0) {
        const events = []
        result.forEach(event => {
          // 휴일 확인 확인
          const one = this.holidayList.filter(data => data.standardDate === event.checkInDate)
          if (one && one.length > 0) { // 휴일 처리가 필요한 경우
            const holidayCode = one[0].holidayCode
            if (holidayCode === 'P') { // 패키지 휴일
              events.push({
                start: moment(event.checkInDate).format('YYYY-MM-DD'),
                name: this.names[3].name + ' (' + one[0].memo + ')',
                nameCheck: this.names[3].name,
                color: this.colors[2],
                memo: one[0].memo,
                procMsg: event.procMsg
              })
            } else if (holidayCode === 'S') { // 영업장 휴일
              events.push({
                start: moment(event.checkInDate).format('YYYY-MM-DD'),
                name: this.names[3].name + ' (' + one[0].memo + ')',
                nameCheck: this.names[3].name,
                color: this.colors[2],
                memo: one[0].memo,
                procMsg: event.procMsg
              })
            } else { // 객실 휴일
              events.push({
                start: moment(event.checkInDate).format('YYYY-MM-DD'),
                name: this.names[3].name + ' (' + one[0].memo + ')',
                nameCheck: this.names[3].name,
                color: this.colors[2],
                memo: one[0].memo,
                procMsg: event.procMsg
              })
            }
          } else { // 휴일이 아닌 경우
            if (event.leaveCount && event.leaveCount < 0) {
              if (event.realLeaveCount > 0) { // 회원 우선 예약(파트너는 불가능)
                events.push({
                  start: moment(event.checkInDate).format('YYYY-MM-DD'),
                  name: event.roomTypeName + ' / ' + event.leaveCount,
                  nameCheck: this.names[4].name,
                  color: this.colors[3],
                  roomTypeCode: event.roomTypeCode,
                  tooltip: event.roomTypeName + ' / ' + event.leaveCount + ' / ' + event.procMsg,
                  procMsg: event.procMsg
                })
              } else {
                events.push({ // 예약 마감
                  start: moment(event.checkInDate).format('YYYY-MM-DD'),
                  name: event.roomTypeName + ' / ' + event.leaveCount,
                  nameCheck: this.names[1].name,
                  color: this.colors[1],
                  tooltip: event.roomTypeName + ' / ' + event.leaveCount + ' / ' + event.procMsg,
                  procMsg: event.procMsg
                })
              }
            } else if (event.leaveCount && event.procMsg === '0000') {
              events.push({ // 예약 가능
                start: moment(event.checkInDate).format('YYYY-MM-DD'),
                name: event.roomTypeName + ' / ' + event.leaveCount,
                color: this.colors[0],
                nameCheck: this.names[0].name,
                roomTypeCode: event.roomTypeCode,
                tooltip: event.roomTypeName + ' / ' + event.leaveCount
              })
            }
          }
        })
        // 예약 관련 목록 events에 세팅
        this.events = events
      } else {
        this.$dialog.alert('조회된 결과값이 없습니다.')
      }
    },
    /** 회원번호/명 조회 */
    openPartnerInfo () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/PartnerTermSearch',
        params: {
          taskType: 'OTA_PKG_API'
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1400,
          closeCallback: (params) => {
            if (params && params.data) {
              this.$set(this.adminPartnerInfo, 'partnerName', params.data.partnerName)
              this.adminPartnerInfo.partnerName = params.data.partnerName
              this.adminPartnerInfo.partnerSeq = params.data.partnerSeq
              this.pkgSearchParam.partnerSeq = params.data.partnerSeq // 검색조건에 파트너 번호 추가
              this.adminPartnerInfo.agentCode = params.data.agentCode
              this.adminPartnerInfo.partnerTelNo = params.data.partnerTelNo
              this.adminPartnerInfo.termSeq = params.data.termSeq
            }
          }
        }
      })
    },
    /**
     * events와 saveForm 리셋
     */
    resetEventsAndSaveForm () {
      this.events = []
      this.resetSaveForm()
    },
    /**
     * saveForm 리셋
     */
    resetSaveForm () {
      this.saveForm = {}
      this.saveForm.adultCount = 1
      this.saveForm.childCount = 0
    },
    /**
     * 영업장 정보 조회 결과값 화면에 매핑
     */
    mapStoreInfoResult (result) {
      this.$set(this.form, 'storeCode', result.storeCode)
      this.$set(this.form, 'storeName', result.storeName)
    },
    /**
     * 영업장 조회
     */
    async searchStoreInfo (item) {
      const param = {}
      item.storeCode ? param.storeCode = item.storeCode : param.storeCode = ''
      param.packageNo = item.packageNo
      param.useYn = 'Y'
      const res = await roomService.selectStoreInfoByPackageNo(param)
      if (res.data && res.data.length === 1) {
        this.resetEventsAndSaveForm()
        this.mapStoreInfoResult(res.data[0]) // 결과값 화면에 매핑
      } else {
        this.openStorePopup(item)
      }
    },
    /**
     * 영업장 조회 팝업 오픈
     */
    openStorePopup (item) {
      if (item.packageNo === undefined) {
        this.$dialog.alert('패키지 번호를 먼저 선택해주세요.')
        return
      }
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/RoomReservation/popup/StoreSearchPopup',
        params: {
          item: {
            itemInfo: item,
            roomType: { text: '패키지', value: 'OTA_PKG_API' }
          }
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 900,
          closeCallback: (params) => {
            if (params && params.data) {
              this.resetEventsAndSaveForm()
              this.mapStoreInfoResult(params.data) // 결과값 화면에 매핑
            }
          }
        }
      })
    },
    /**
     * 패키지 조회 팝업 오픈
     */
    openPackagePopup (item) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/RoomReservation/popup/PackSearchPopup',
        params: {
          item: {
            packageNo: item.packageNo,
            rsvYn: 'Y',
            todayYn: 'Y',
            groupFlag: 'ota'
          }
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 1400,
          closeCallback: (params) => {
            if (params && params.data) {
              this.$set(this.form, 'packageNo', params.data.packageNo)
              this.$set(this.form, 'packageName', params.data.packageName)
              this.selectPackageName(params.data)
            }
          }
        }
      })
    },
    /**
     * 패키지 1개 정보 조회
     */
    async searchOnePkgInfo (item) {
      const res = await packageService.selectRoomPackageInformation(item.packageNo)
      this.saleStartDate = res.data.saleStartDate // 판매 시작일
      this.saleEndDate = res.data.saleEndDate // 판매 종료일
      this.pkgSearchParam.packageNo = item.packageNo
      this.todayRsvYn = res.data.todayRsvYn // 당일 예약 여부
      this.pkgSearchParam.todayRsvYn = this.todayRsvYn // 당일 예약 여부
      this.pkgSearchParam.todayRsvTime = res.data.todayRsvTime // 당일 예약 가능 시간
      this.pkgSearchParam.blockCode = res.data.blockCode // 예약 블럭 코드
      this.pkgSearchParam.roomDayLimit = res.data.roomDayLimit
      this.pkgSearchParam.nights = res.data.nights
      this.pkgSearchParam.roomCount = res.data.roomCount
      this.$set(this.form, 'nights', res.data.nights)
      this.$set(this.form, 'roomCount', res.data.roomCount)
    },
    /**
     * 패키지 선택시
     */
    async selectPackageName (item) {
      this.searchOnePkgInfo(item)
      // 휴일 정보 조회
      const res = await roomService.selectTodayPkgRsvInfo(item.packageNo, this.pkgSearchParam.checkInDate)
      this.holidayList = res.data
      this.isSearch = false
      this.resetEventsAndSaveForm()
      // 영업장 정보가 있는 경우 초기화
      if (this.form.storeCode) {
        this.form.storeCode = ''
        this.form.storeName = ''
      }
      // 객실 유형 정보가 있는 경우 초기화
      if (this.form.roomTypeCode) {
        this.form.roomTypeCode = ''
        this.form.roomTypeName = ''
      }
      this.searchStoreInfo(this.form)
    },
    /**
     * 객실 유형 정보 조회 결과값 매핑
     */
    mapRmTypeInfoResult (result) {
      this.$set(this.form, 'roomTypeCode', result.roomTypeCode)
      this.$set(this.form, 'roomTypeName', result.roomTypeName)
    },
    /**
     * 객실유형코드 조회
     */
    async searchRmTypePopup (item) {
      if (!item.storeCode) {
        this.$dialog.alert('영업장을 먼저 선택해 주세요.')
        return
      }
      const param = {}
      param.storeCode = item.storeCode
      param.roomTypeCode = item.roomTypeCode
      param.packageNo = item.packageNo
      param.useYn = '1'
      const res = await roomService.selectRoomTypeAndDongInfo(param)
      if (res.data && res.data.length === 1) {
        this.resetEventsAndSaveForm()
        this.mapRmTypeInfoResult(res.data[0]) // 결과값을 화면에 매핑
      } else {
        this.openRmTypePopup(item)
      }
    },
    /**
     * 객실유형 조회 팝업 오픈
     */
    openRmTypePopup (item) {
      if (!item.storeCode) {
        this.$dialog.alert('영업장을 먼저 선택해 주세요.')
        return
      }
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/RoomReservation/popup/RoomTypePopup',
        params: {
          item: {
            storeCode: item.storeCode
          }
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 800,
          closeCallback: (params) => {
            if (params && params.data) {
              this.resetEventsAndSaveForm()
              this.mapRmTypeInfoResult(params.data) // 결과값을 화면에 매핑
            }
          }
        }
      })
    },
    /**
     * 패키지 요금 조회 팝업 오픈
     */
    openAmountSearchDialog () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Board/Amount/BoardPackageAmountSearchDialog',
        options: {
          fullscreen: false,
          scrollable: true,
          width: 1300
        }
      })
    },
    /**
     * 하나의 객실을 선택했을 때
     */
    async setSaveForm ({ nativeEvent, event }) {
      const noRsv = nativeEvent.target.className.substring(nativeEvent.target.className.lastIndexOf(' ') + 1, nativeEvent.target.className.length)
      // 예약 가능이 아닌경우
      if (noRsv !== this.colors[0]) {
        this.$dialog.alert(`예약이 불가능합니다.<br/>${event.procMsg}`)
      } else {
        const param = {}
        param.packageNo = this.form.packageNo
        param.storeCode = this.form.storeCode
        param.nights = this.form.nights
        param.roomCount = this.form.roomCount
        param.checkInDate = event.start.replace(/-/gi, '')
        param.todayRsvYn = this.todayRsvYn
        param.todayRsvTime = this.pkgSearchParam.todayRsvTime
        param.blockCode = this.pkgSearchParam.blockCode
        param.leaveCount = event.leaveCount
        // 예약 가능여부 확인
        const res = await pmsReservationService.selectPossiblePkgInventory(event.roomTypeCode, param)
        if (res.data.procMsg === '0000') {
          // 예약을 위한 정보 세팅
          this.$set(this.saveForm, 'checkInDate', event.start)
          this.$set(this.saveForm, 'roomTypeName', nativeEvent.target.textContent.substring(0, nativeEvent.target.textContent.lastIndexOf(' ')))
          this.saveForm.roomTypeCode = event.roomTypeCode
          this.$set(this.saveForm, 'adultCount', 1)
          this.$set(this.saveForm, 'childCount', 0)
          // 요금 조회를 위한 파라미터 세팅
          const priceParam = {}
          priceParam.packageNo = param.packageNo
          priceParam.storeCode = param.storeCode
          priceParam.roomTypeCode = Array(event.roomTypeCode)
          priceParam.checkInDate = param.checkInDate
          priceParam.nights = param.nights
          priceParam.roomCount = param.roomCount
          try {
            // 패키지 요금 조회
            const priceRes = await roomService.selectPkgAmount('ota', priceParam)
            this.$set(this.saveForm, 'salePrice', priceRes.data.total) // 판매가
            this.$set(this.saveForm, 'totalPrice', priceRes.data.rcpmnyTotal) // 입금가
          } catch (e) {
            this.$set(this.saveForm, 'totalPrice', 0) // 입금가
          }
        } else {
          this.$dialog.alert(res.data.procMsg)
        }
      }
    },
    /**
     * 예약
     */
    async save () {
      const basicCheck = Boolean(this.form.packageNo && this.form.storeCode && this.pkgSearchParam.nights && this.pkgSearchParam.roomCount && this.todayRsvYn && this.pkgSearchParam.blockCode)
      const saveFormCheck = Boolean(this.saveForm.checkInDate && this.saveForm.guestName && this.saveForm.totalPrice && this.saveForm.roomTypeCode && this.saveForm.adultCount)
      // 예약에 필요한 파라미터들이 있는 경우에만 실행
      if (basicCheck && saveFormCheck) {
        const param = {}
        this.validForm(this.$refs.form).then(() => {
          param.packageNo = this.form.packageNo
          param.storeCode = this.form.storeCode
          param.nights = this.form.nights
          param.roomCount = this.form.roomCount
        })
        this.validForm(this.$refs.rsvForm).then(() => {
          param.checkInDate = this.saveForm.checkInDate.replace(/-/gi, '')
        })
        param.todayRsvYn = this.todayRsvYn
        param.todayRsvTime = this.pkgSearchParam.todayRsvTime
        param.blockCode = this.pkgSearchParam.blockCode
        // 예약 가능여부 확인
        const res = await pmsReservationService.selectPossiblePkgInventory(this.saveForm.roomTypeCode, param)
        if (res.data.procMsg === '0000') {
          delete param.todayRsvYn
          delete param.todayRsvTime
          param.modifyId = this.user.number
          param.guestTelNo = this.saveForm.guestTelNo // 이용자 연락처
          if (this.saveForm.partnerRsvNo) { // 업체예약번호는 필수값 아님
            param.partnerRsvNo = this.saveForm.partnerRsvNo
          }
          this.validForm(this.$refs.rsvForm).then(() => {
            param.guestName = this.saveForm.guestName
            param.partnerRsvPrice = this.saveForm.totalPrice
            param.roomTypeCode = this.saveForm.roomTypeCode
            param.adultCount = this.saveForm.adultCount
            param.childCount = this.saveForm.childCount
          })
          if (this.isPartner) { //  파트너
            for (const one of this.ptnrBasicInfo) {
              if (one.taskTypeName === this.taskTypeName) {
                param.partnerName = one.partnerName
                param.agentCode = one.agentCode
                param.partnerTelNo = one.partnerTelNo
                param.partnerSeq = this.user.number // 예치금에 필요
                param.termSeq = one.termSeq // 예치금에 필요
              }
            }
          } else { // 관리자
            param.agentCode = this.adminPartnerInfo.agentCode
            param.partnerTelNo = this.adminPartnerInfo.partnerTelNo
            param.partnerSeq = this.adminPartnerInfo.partnerSeq
            param.termSeq = this.adminPartnerInfo.termSeq
            param.partnerName = this.adminPartnerInfo.partnerName
          }
          // 실제 예약 처리
          const confirm = await this.$dialog.confirm('개인 정보 수집에 동의하시겠습니까?')
          if (confirm) {
            const result = await roomService.insertPkgNewRsv('partner', param)
            if (result.data.resultMsg === 'SUCCESS') {
              console.log(`예약번호: ${result.data.guestRsvNo},  ${result.data.partnerRsvNo}`)
              this.$dialog.alert(`예약번호: ${result.data.guestRsvNo}`)
            } else {
              this.$dialog.alert(result.data.resultMsg)
            }
            // 인증을 위한 4자리 숫자 생성
            // const authNo = Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111
            // this.$store.dispatch('dialog/open', {
            //   componentPath: '/Ota/RoomReservation/popup/SimpleAuthPopup',
            //   params: {
            //     authNo: authNo
            //   },
            //   options: {
            //     fullscreen: false,
            //     scrollable: true,
            //     width: 600,
            //     closeCallback: (params) => {
            //       if (params && params.data) {
            //         if (params.data && params.data === authNo.toString()) {
            //           roomService.insertPkgNewRsv('partner', param).then(res => {
            //             if (res.data.resultMsg === 'SUCCESS') {
            //               this.$dialog.alert(`예약번호: ${res.data.guestRsvNo}`)
            //             } else {
            //               this.$dialog.alert(res.data.resultMsg)
            //             }
            //           })
            //         } else {
            //           this.$dialog.alert('인증번호를 잘못 입력하셨습니다. 다시 시도해주세요.')
            //         }
            //       }
            //     }
            //   }
            // })
          }
        } else {
          this.$dialog.alert(res.data.procMsg)
        }
      } else {
        this.$dialog.alert('필수값을 입력해 주세요.')
      }
    }
  }
}
</script>
