<template>
  <dialog-base :instance="instance" :title="'패키지 신규 등록'">
    <vue-tour-for-popup :steps="steps"/>
    <div>
      <v-form class="pb-2" ref="form" lazy-validation autocomplate="off">
        <v-row>
          <v-col lg="2" md="3" cols="6">
            <v-text-field
              :value="roomType.text"
              label="구분"
              disabled
              outlined
              hide-details
              dense
            />
          </v-col>
          <v-col lg="2" md="3" sm="4" cols="6" v-if="roomType.value == 'OTA_PKG_API'">
                <v-text-field
                    v-model="form.agentCode"
                    label="Agent코드"
                    clearable
                    hide-details
                    dense
                    :disabled="isPartner"
                    @keypress.enter="openAgentPopup(form)"
                >
                    <template v-slot:append>
                        <v-btn icon small color="primary" tabindex="-1" @click="openAgentPopup(form)">
                            <v-icon>search</v-icon>
                        </v-btn>
                    </template>
                </v-text-field>
          </v-col>
          <v-col lg="2" md="3" cols="6">
            <v-autocomplete
              v-model="taskTypeName"
              :items="taskTypeNameList"
              label="업무구분명"
              outlined
              clearable
              hide-details
              dense
              class="new-package-step-0"
              :disabled="!isPartner"
            />
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
              class="new-package-step-1"
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
            />
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
            />
          </v-col>
          <v-col lg="2" md="3" cols="6">
            <v-text-field
              v-model="saleEndDate"
              label="패키지종료일"
              outlined
              disabled
              hide-details
              dense
            />
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
              class="new-package-step-2"
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
            />
          </v-col>
          <v-col lg="2" md="3" cols="6">
            <v-text-field
              v-model="form.roomTypeCode"
              label="객실유형"
              outlined
              hide-details
              dense
              @keypress.enter="searchRmTypePopup(form)"
              class="new-package-step-3"
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
            />
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
            />
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
            />
          </v-col>
          <v-col class="text-right">
            <v-btn v-if="isPartner" outlined rounded color="purple" @click="showManual">매뉴얼</v-btn>
            <v-btn class="new-package-step-4" outlined rounded color="primary" @click="search">
              <v-icon left>search</v-icon>검색(F3)
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
      <v-sheet>
        <v-toolbar flat color="white">
          <v-btn outlined
                 class="mr-4 new-package-step-5"
                 color="grey darken-2"
                 @click="setToday"
          >
            오늘
          </v-btn>
          <v-btn
            icon
            class="ma-2 new-package-step-6"
            @click="prev"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            icon
            class="ma-2 new-package-step-7"
            @click="next"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ thisMonth }}</v-toolbar-title>
          <v-spacer />
          <v-btn
            class="ma-2 new-package-step-8"
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
              />
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
              />
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
                class="new-package-step-9"
              />
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
                class="new-package-step-10"
              />
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
                class="new-package-step-11"
              />
            </v-col>
            <v-col lg="1" md="2" cols="2">
              <v-text-field
                v-model="saveForm.adultCount"
                label="대인"
                :rules="emptyRules"
                outlined
                hide-details
                dense
                class="new-package-step-12"
              />
            </v-col>
            <v-col lg="1" md="2" cols="2">
              <v-text-field
                v-model="saveForm.childCount"
                label="소인"
                outlined
                hide-details
                dense
                class="new-package-step-13"
              />
            </v-col>
          </v-row>
        </v-form>
        <v-row>
          <v-col align-self="center" class="text-right pl-0">
            <v-btn outlined rounded color="green" @click="resetSaveForm" class="new-package-step-14">
              <v-icon left>refresh</v-icon>초기화(F4)
            </v-btn>
            <v-btn outlined rounded color="blue" @click="save" class="new-package-step-15">
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
import VueTourForPopup from '@/components/Common/VueTourForPopup.vue'

import roomService from '@/api/modules/ota/roomReservation.service'
import pmsReservationService from '@/api/modules/pms/reservation.service'
import packageService from '@/api/modules/ota/package.service'

import NumberUtils from '@/utils/number.util'
import { mapGetters } from 'vuex'

export default {
  extends: DialogBase,
  components: { VueTourForPopup },
  name: 'PartnerNewPackageRsvPopup',
  data () {
    return {
      steps: [ // VueTour의 단계
        {
          target: '.new-package-step-0',
          content: '업무구분을 선택 하세요.(필수)',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-package-step-1',
          content: '패키지번호를 선택 하세요.(필수)',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-package-step-2',
          content: '조회하실 영업장을 선택 하세요.(필수)',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-package-step-3',
          content: '필요하신 경우,<br/> 객실 유형을 선택 하세요.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-package-step-4',
          content: '입력된 조건으로 검색하는 버튼 입니다.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-package-step-5',
          content: '어디에서든 오늘날짜로 <br/> 돌아오는 버튼입니다.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-package-step-6',
          content: '이전 달로 넘어가는 버튼입니다.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-package-step-7',
          content: '다음달로 넘어가는 버튼입니다.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-package-step-8',
          content: '패키지별 요금을 조회하는 버튼입니다.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-package-step-9',
          content: '달력에서 원하는 날짜의 객실을 선택 후, <br/> 업체예약번호를 입력 하세요.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-package-step-10',
          content: '이용자의 이름을 입력 하세요.(필수)',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-package-step-11',
          content: '이용자의 연락처를 입력 하세요.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-package-step-12',
          content: '성인 수 변경을 원할 경우, <br/> 대인을 변경 하세요.(필수)',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-package-step-13',
          content: '아동 수 변경을 원할 경우, <br/> 소인을 변경 하세요.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-package-step-14',
          content: '예약 정보를 초기화 하는 버튼입니다.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-package-step-15',
          content: '예약을 저장하는 버튼입니다.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        }
      ],
      form: {}, // 검색 폼
      saveForm: {}, // 저장 폼
      type: 'month', // 월력
      start: null, // 현재 달력 정보
      end: null, // 변경된 달력 정보
      mode: 'stack',
      focus: '',
      today: moment().format('YYYY-MM-DD'), // 오늘 날짜
      weekday: [0, 1, 2, 3, 4, 5, 6],
      events: [], // 예약과 관련된 정보 목록
      colors: ['light-blue', 'red', 'grey', 'teal'],
      names: [ // 예약 상태 이름
        { code: 'R', name: '예약가능' },
        { code: 'F', name: '예약마감' },
        { code: 'D', name: '예약불가능' },
        { code: 'H', name: '휴일' },
        { code: 'M', name: '회원우선예약' }
      ],
      roomType: {}, // 객실/패키지 정보
      pkgSearchParam: { // 검색 파라미터
        packageNo: '', // 패키지번호
        storeCode: '',
        checkInDate: '',
        partnerSeq: 0,
        roomDayLimit: 0, // 잔여객실 수 최대치 제한
        roomTypeCode: '',
        blockCode: '',
        nights: 1,
        roomCount: 1,
        todayRsvYn: '',
        todayRsvTime: '00',
        searchDayCount: 0 // 기준일로부터 조회 일 수
      },
      todayRsvYn: '', // 당일 예약 여부
      saleStartDate: '', // 판매시작일
      saleEndDate: '', // 판매종료일
      holidayList: [], // 휴일 정보 목록
      isSearch: true, // 검색이 아닌 경우 이벤트 변경을 막는 변수
      taskTypeName: '', // 업무구분명
      taskTypeNameList: [], // 업무구분 목록
      ptnrBasicInfo: [], // 파트너 기본 정보
      leaveCount: 0, // 잔여 객실 수
      calendarStartDate: '', // 현재 달력의 시작일
      calendarEndDate: '', // 현재 달력의 종료일
      calendarLastDay: '', // 현재 달력의 종료일의 'day'
      holidayYn: false // 휴일 여부
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
    this.initInfo()
    if (this.isPartner) { // 파트너인 경우에만 파트너번호 세팅
      this.pkgSearchParam.partnerSeq = this.user.number
    }
    /* if (!this.isPartner) { // 관리자인 경우
      this.$dialog.alert('이 화면에서는 예약이 불가능 합니다. <br/>실제로 예약하기를 원하시면 창을 닫고 신규 버튼을 <br/>클릭해 진행해주시기 바랍니다.')
    } */
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
     * 매뉴얼 실행
     */
    showManual () {
      this.$tours.popupTour.start()
    },
    /**
     * 기본 정보 설정
     */
    initInfo () {
      console.log(this.instance.params)
      this.roomType = _.cloneDeep(this.instance.params.roomType)
      this.ptnrBasicInfo = _.cloneDeep(this.instance.params.ptnrBasicInfo)
      if (this.ptnrBasicInfo && this.ptnrBasicInfo.length > 0) {
        for (const info of this.ptnrBasicInfo) {
          this.taskTypeNameList.push(info.taskTypeName)
          this.form.agentCode = info.agentCode
        }
        if (this.taskTypeNameList.length === 1) {
          this.taskTypeName = this.taskTypeNameList[0]
        }
      }
    },
    /**
     * 예약 정보 폼 리셋
     */
    resetSaveForm () {
      this.saveForm = {}
      this.saveForm.adultCount = 1
      this.saveForm.childCount = 0
    },
    /**
     * 이벤트 컬러 설정
     */
    getEventColor (event) {
      return event.color
    },
    /**
     * 이전달 조회
     */
    prev () {
      if (
        (this.pkgSearchParam.packageNo && this.pkgSearchParam.storeCode) ||
        (this.form.packageNo && this.form.storeCode)
      ) {
        const thisMonth = moment().format('yyyyMM') // 현재달
        const lastDayOfMonth = moment(this.$refs.calendar.lastEnd.date).add(-1, 'month').format('yyyyMM')

        if (thisMonth > lastDayOfMonth) { // 현재 날짜보다 과거로는 돌아갈 수 없음
          this.$dialog.alert('과거의 예약은 확인할 수 없습니다.')
        } else {
          this.events = []
          this.$refs.calendar.prev()
        }
      } else {
        this.$dialog.alert('패키지번호와 영업장코드값은 필수입니다.')
      }
    },
    /**
     * 다음달 조회
     */
    next () {
      const endDate = moment(this.saleEndDate).format('YYYY-MM-DD') // 판매종료일
      if (
        (this.pkgSearchParam.packageNo && this.pkgSearchParam.storeCode) ||
        (this.form.packageNo && this.form.storeCode)
      ) {
        const compareParam = Boolean(Date.parse(this.$refs.calendar.lastEnd.date) >= Date.parse(endDate))
        if (compareParam) {
          this.$dialog.alert(`해당 패키지의 판매 종료일은 ${endDate}입니다.`)
        } else {
          this.events = []
          this.$refs.calendar.next()
        }
      } else {
        this.$dialog.alert('패키지번호와 영업장코드값은 필수입니다.')
      }
    },
    /**
     * 달력 change 이벤트시 실행
     */
    updateRange ({ start, end }) {
      this.start = start // 현재 달력정보
      this.end = end // 변경된 달력 정보
      this.calendarStartDate = start.date // 달력 시작일
      this.calendarEndDate = end.date // 달력 종료일
      this.calendarLastDay = end.day // 달력 종료일 일자정보
      // 검색에 의한 변경인 경우
      if (this.isSearch) {
        // 패키지 번호와 영업장코드 필수
        if (this.form.packageNo && this.form.storeCode) {
          this.pkgSearchParam.storeCode = this.form.storeCode
          if (this.form.roomTypeCode) { // 객실유형코드가 있는 경우
            this.pkgSearchParam.roomTypeCode = this.form.roomTypeCode
          }
          this.setParams()
        }
      } else {
        this.events = [] // 이벤트 목록 초기화
      }
      this.resetSaveForm() // 예약 정보 폼 리셋
    },
    /**
     * 검색 버튼 클릭시
     */
    async search () {
      this.pkgSearchParam.storeCode = this.form.storeCode
      if (this.form.roomTypeCode) { // 객실유형코드가 있는 경우
        this.pkgSearchParam.roomTypeCode = this.form.roomTypeCode
      } else {
        this.pkgSearchParam.roomTypeCode = ''
        this.form.roomTypeName = ''
      }
      this.isSearch = true
      await this.searchOnePkgInfo(this.form) // 선택된 패키지 정보 조회
      this.setParams() // 검색을 위한 파라미터 세팅
    },
    /**
     * 검색을 위한 checkInDate 와 searchDayCount 세팅
     */
    setParams () {
      const currentMonth = moment(this.calendarStartDate).month() + 1 // 현재 달력의 달
      const thisMonth = moment().month() + 1 // 오늘 날짜의 달
      // 검색하려는 달이 현재의 달과 같을 때
      if (currentMonth === thisMonth) {
        this.pkgSearchParam.checkInDate = moment().format('YYYYMMDD')
        this.pkgSearchParam.searchDayCount = moment(this.calendarEndDate).diff(moment().format('YYYY-MM-DD'), 'days') + 1
      } else {
        this.pkgSearchParam.checkInDate = moment(this.calendarStartDate).format('YYYYMMDD')
        this.calculateNights(moment(this.pkgSearchParam.checkInDate).month() + 1, this.pkgSearchParam.checkInDate) // 조회할 박수 정보 세팅
      }
      this.pkgSearchParam.nights = this.form.nights
      this.pkgSearchParam.roomCount = this.form.roomCount
      this.selectInventory() // 재고 조회
    },
    /**
     * searchDayCount 계산을 위한 함수
     */
    calculateNights (month, monthDate) { // month는 바뀐 달력의 달
      const saleEndMonth = moment(this.saleEndDate).month() + 1 // 판매 종료일이 있는 달
      const saleStartMonth = moment(this.saleStartDate).month() + 1 // 판매 시작일이 있는 달
      const thisyear = moment().year() // 올해 년도
      const saleEndYear = moment(this.saleEndDate).year() // 판매 종료일이 있는 년도
      const saleStartYear = moment(this.saleStartDate).year() // 판매 시작일이 있는 년도
      // 종료일이 있는 달인 경우
      if (thisyear === saleEndYear && month === saleEndMonth) {
        this.pkgSearchParam.searchDayCount = moment(this.saleEndDate).diff(moment(this.calendarStartDate), 'days') + 1
      } else if (thisyear === saleStartYear && month === saleStartMonth) { // 시작일이 있는 달인 경우
        this.pkgSearchParam.searchDayCount = moment(this.calendarEndDate).diff(moment(this.saleStartDate).format('YYYY-MM-DD'), 'days') + 1
      } else {
        this.pkgSearchParam.searchDayCount = moment(monthDate).endOf('month').format('DD')
      }
    },
    /**
     * 오늘 날짜로 focus
     */
    setToday () {
      this.focus = this.today
      this.resetSaveForm() // 예약 정보 폼 리셋
    },
    /**
     * 패키지 현황 조회
     */
    selectInventory () {
      // 검색인 경우
      if (this.isSearch) {
        this.validForm(this.$refs.form).then(() => {
          this.pkgSearchParam.isRealLeaveCount = 'Y'
          // 영업장으로만 조회
          if (this.pkgSearchParam.roomTypeCode === '') {
            roomService.selectPkgInventory('store', this.pkgSearchParam).then(res => {
              this.realSetEvents(res.data)
            })
          } else {
            // 영업장과 객실유형으로 조회
            roomService.selectPkgInventory('store-room', this.pkgSearchParam).then(res => {
              this.realSetEvents(res.data)
            })
          }
        })
      } else {
        this.events = [] // 이벤트 목록 초기화
      }
      this.resetSaveForm() // 예약 정보 폼 리셋
    },
    /**
     * 객실 현황 이벤트 매핑
     */
    async realSetEvents (result) { // result는 객실 현황 목록
      // 객실 현황 목록이 있는 경우
      if (result && result.length > 0) {
        const events = [] // 초기화
        result.forEach(event => {
          // 휴일 확인
          const one = this.holidayList.filter(data => data.standardDate === event.checkInDate)
          // 휴일여부 초기화
          this.holidayYn = false
          // 휴일여부 체크
          if (one && one.length > 0) {
            const holidayCode = one[0].holidayCode
            if (holidayCode === 'P' || holidayCode === 'S' || holidayCode === 'R') {
              // 패키지휴일
              if (holidayCode === 'P') {
                this.holidayYn = true
              } else if (holidayCode === 'S' && one[0].storeCode === event.storeCode) { // 영업장휴일
                this.holidayYn = true
              } else if (holidayCode === 'R' &&
                    one[0].storeCode === event.storeCode &&
                    one[0].roomTypeCode === event.roomTypeCode
              ) { // 객실유형휴일
                this.holidayYn = true
              }
            }
          }
          // 휴일 처리가 필요한 경우
          if (this.holidayYn) {
            this.holidayYn = false
            events.push({
              start: moment(event.checkInDate).format('YYYY-MM-DD'),
              name: this.names[3].name + ' (' + one[0].memo + ')',
              nameCheck: this.names[3].name,
              color: this.colors[2],
              memo: one[0].memo,
              procMsg: event.procMsg
            })
          } else { // 휴일이 아닌 경우
            if (this.todayRsvYn === 'N' && event.checkInDate === moment().format('YYYYMMDD').toString()) {
              events.push({
                start: this.today,
                name: '당일' + this.names[2].name,
                color: this.colors[2],
                procMsg: event.procMsg
              })
            } else {
              // 잔여객실이 없는 경우
              if (event.leaveCount && event.leaveCount < 0) {
                // 회원 우선 예약
                if (event.realLeaveCount > 0) {
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
              } else if (event.leaveCount) {
                events.push({ // 예약 가능
                  start: moment(event.checkInDate).format('YYYY-MM-DD'),
                  name: event.roomTypeName + ' / ' + event.leaveCount,
                  color: this.colors[0],
                  nameCheck: this.names[0].name,
                  roomTypeCode: event.roomTypeCode,
                  tooltip: event.roomTypeName + ' / ' + event.leaveCount,
                  roomPriceModelList: event.roomPriceModelList
                })
              }
            }
          }
        })
        // 강제 예약 불가능처리
        const calendarMonth = moment(this.calendarStartDate).month() // 변경된 달력의 달
        const month = moment().month() // 현재의 달
        // 변경된 달력과 현재의 달이 같은 경우
        if (calendarMonth === month) {
          const day = moment().day()
          for (let i = 1; i < day; i++) {
            events.push({
              start: `2022-${month}-${i}`,
              name: this.names[2].name,
              color: this.colors[2]
            })
          }
        }
        // 예약 관련 목록 events에 세팅
        this.events = events
      } else {
        this.$dialog.alert('조회된 결과값이 없습니다.')
      }
    },
    /**
     * events와 saveForm 리셋
     */
    resetEventsAndSaveForm () {
      this.events = []
      this.resetSaveForm()
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
      param.storeCode = item.storeCode ? item.storeCode : ''
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
      if (item.packageNo !== undefined) {
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
                this.resetEventsAndSaveForm()
                this.mapStoreInfoResult(params.data) // 결과값 화면에 매핑
              }
            }
          }
        })
      } else {
        this.$dialog.alert('패키지 번호를 먼저 선택해주세요.')
      }
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
            groupFlag: 'ota',
            isPartnerPackage: 'Y'
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
              this.selectPkgInfo(params.data)
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
      this.pkgSearchParam.packageNo = item.packageNo // 패키지 번호 세팅
      this.saleStartDate = res.data.saleStartDate // 판매 시작일
      this.saleEndDate = res.data.saleEndDate // 판매 종료일
      if (this.saleStartDate > moment().format('YYYYMMDD')) { // 판매 시작일이 현재 날짜보다 클 경우
        this.pkgSearchParam.checkInDate = this.saleStartDate
      } else {
        this.pkgSearchParam.checkInDate = moment().format('YYYYMMDD')
      }
      this.todayRsvYn = res.data.todayRsvYn // 당일 예약 여부
      this.pkgSearchParam.todayRsvYn = this.todayRsvYn // 검색조건에 당일예약여부 추가
      if (res.data.todayRsvTime) {
        this.pkgSearchParam.todayRsvTime = res.data.todayRsvTime // 당일 예약 가능 시간
      }
      this.pkgSearchParam.blockCode = res.data.blockCode // 예약 블럭 코드
      this.pkgSearchParam.roomDayLimit = res.data.roomDayLimit // 잔여객실 수 최대치 제한
      this.pkgSearchParam.nights = res.data.nights
      this.pkgSearchParam.roomCount = res.data.roomCount
      this.$set(this.form, 'nights', res.data.nights)
      this.$set(this.form, 'roomCount', res.data.roomCount)
    },
    /**
     * 패키지 선택 시
     */
    async selectPkgInfo (item) {
      await this.searchOnePkgInfo(item)
      // 휴일 정보 조회
      const holidayRes = await roomService.selectPkgHolidayInfo(item.packageNo)
      this.holidayList = holidayRes.data
      this.setToday() // 오늘 날짜로 리셋
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
      await this.searchStoreInfo(this.form)
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
      if (item.storeCode) {
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
      } else {
        this.$dialog.alert('영업장을 먼저 선택해 주세요.')
      }
    },
    /**
     * 객실유형 조회 팝업 오픈
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
                this.resetEventsAndSaveForm()
                this.mapRmTypeInfoResult(params.data) // 결과값을 화면에 매핑
              }
            }
          }
        })
      } else {
        this.$dialog.alert('영업장을 먼저 선택해 주세요.')
      }
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
      // 예약 가능이 아닌 경우
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
        param.roomDayLimit = this.pkgSearchParam.roomDayLimit
        // 예약 가능여부 확인
        const res = await pmsReservationService.selectPossiblePkgInventory(event.roomTypeCode, param)
        if (res.data.resultMessage === '0000') {
          // 예약을 위한 정보 세팅
          this.$set(this.saveForm, 'checkInDate', event.start)
          this.$set(this.saveForm, 'roomTypeName', nativeEvent.target.textContent.substring(0, nativeEvent.target.textContent.lastIndexOf('/')))
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
            // 요금 조회
            // FIXME 별도로 조회 하진 않는다. 현재로선
            // const priceRes = await roomService.selectPkgAmount('ota', priceParam)

            let totalPrice = 0
            let originPrice = 0
            for (let i = 0; i < res.data.roomPriceModelList.length; i++) {
              totalPrice += res.data.roomPriceModelList[i].totalPrice
              originPrice += res.data.roomPriceModelList[i].totalPrice
            }
            this.$set(this.saveForm, 'salePrice', totalPrice) // 판매가
            this.$set(this.saveForm, 'totalPrice', originPrice) // 입금가
          } catch (e) {
            this.$set(this.saveForm, 'totalPrice', 0) // 입금가
          }
        } else {
          this.$dialog.alert(res.data.resultMessage)
        }
      }
    },
    /**
     * 예약
     */
    async save () {
      const basicCheck = Boolean(this.form.packageNo && this.form.storeCode && this.form.nights && this.form.roomCount && this.todayRsvYn && this.pkgSearchParam.blockCode)
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
        param.roomDayLimit = this.pkgSearchParam.roomDayLimit
        // 예약 가능여부 확인
        const res = await pmsReservationService.selectPossiblePkgInventory(this.saveForm.roomTypeCode, param)
        // 예약 가능시
        if (res.data.resultMessage === '0000') {
          delete param.todayRsvYn
          delete param.todayRsvTime
          param.partnerName = this.isPartner ? this.user.name : this.form.partnerName
          param.modifyId = this.isPartner ? this.user.number : this.form.partnerSeq
          param.partnerSeq = this.isPartner ? this.user.number : this.form.partnerSeq // 예치금에 필요
          if (this.saveForm.partnerRsvNo) { // 업체예약번호는 필수값 아님
            param.partnerRsvNo = this.saveForm.partnerRsvNo
          }
          this.validForm(this.$refs.rsvForm).then(() => {
            param.guestName = this.saveForm.guestName
            param.totalPrice = this.saveForm.totalPrice // 입금가
            param.partnerRsvPrice = this.saveForm.totalPrice
            param.roomTypeCode = this.saveForm.roomTypeCode
            param.adultCount = this.saveForm.adultCount
            param.childCount = this.saveForm.childCount
          })
          for (const one of this.ptnrBasicInfo) {
            if (one.taskTypeName === this.taskTypeName) {
              param.agentCode = one.agentCode
              param.guestTelNo = this.saveForm.guestTelNo // 이용자 연락처
              param.partnerTelNo = one.partnerTelNo // 예약자 연락처
              param.termSeq = one.termSeq // 예치금에 필요
            }
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
            //         // 인증번호와 입력받은 값이 같은 경우에만 저장 로직 실행
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
    },

    /**
    * Agent코드 검색창 오픈
    */
    openAgentPopup () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/PartnerTermSearch',
        params: {
          taskType: this.roomType.value
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1400,
          closeCallback: (params) => {
            if (params && params.data) {
              this.$set(this.form, 'agentCode', params.data.agentCode)
              this.$set(this.form, 'partnerSeq', params.data.partnerSeq)
              this.$set(this.form, 'partnerName', params.data.partnerName)
              this.$set(this.pkgSearchParam, 'partnerSeq', params.data.partnerSeq)
              this.taskTypeNameList.push(params.data.taskTypeName)
              this.taskTypeName = params.data.taskTypeName

              this.ptnrBasicInfo = []
              this.ptnrBasicInfo.push({ agentCode: params.data.agentCode, partnerName: params.data.partnerName, partnerTelNo: params.data.partnerTelNo, taskTypeName: params.data.taskTypeName, termSeq: params.data.termSeq })
            }
          }
        }
      })
    }
  }
}
</script>
