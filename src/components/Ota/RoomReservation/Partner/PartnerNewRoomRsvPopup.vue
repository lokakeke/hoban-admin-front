<template>
  <dialog-base :instance="instance" :title="'객실 신규 등록'">
    <vue-tour-for-popup :steps="steps"/>
    <div :key="key">
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
          <v-col lg="2" md="3" cols="6">
            <v-text-field
              v-model="form.memNo"
              label="회원번호"
              outlined
              clearable
              hide-details
              dense
              @keypress.enter="openPartnerInfo(form)"
              class="new-room-step-0"
            >
              <template v-slot:append>
                <v-btn icon small color="primary" tabindex="-1" @click="openPartnerInfo(form)">
                  <v-icon>search</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col lg="2" md="3" cols="6">
            <v-text-field
              v-model="form.memNm"
              label="회원명"
              outlined
              disabled
              hide-details
              dense
            />
          </v-col>
          <v-col lg="2" md="3" cols="6">
            <v-text-field
              v-model="form.storeCd"
              label="영업장"
              :rules="emptyRules"
              outlined
              clearable
              hide-details
              dense
              @keypress.enter="searchStoreInfo(form)"
              class="new-room-step-1"
            >
              <template v-slot:append>
                <v-btn icon small color="primary" tabindex="-1" @click="openStorePopup(form)">
                  <v-icon>search</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col lg="3" md="3" cols="6">
            <v-text-field
              v-model="form.storeNm"
              label="영업장명"
              disabled
              outlined
              hide-details
              dense
            />
          </v-col>
          <v-col lg="2" md="3" cols="6">
            <v-text-field
              v-model="form.rmTypeCd"
              label="객실유형"
              outlined
              hide-details
              dense
              @keypress.enter="searchRmTypePopup(form)"
              class="new-room-step-2"
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
              v-model="form.rmTypeNm"
              label="객실유형명"
              disabled
              outlined
              hide-details
              dense
            />
          </v-col>
          <v-col lg="1" md="2" cols="2">
            <v-autocomplete
              v-model="form.nights"
              :items="nightsArr"
              label="박"
              outlined
              hide-details
              dense
              class="new-room-step-3"
            />
          </v-col>
          <v-col lg="1" md="2" cols="2">
            <v-autocomplete
              v-model="form.rmCnt"
              :items="rmCntArr"
              label="객"
              outlined
              hide-details
              dense
              class="new-room-step-4"
            />
          </v-col>
          <v-col class="text-right">
            <v-btn v-if="isPartner" outlined rounded color="purple" @click="showManual">매뉴얼</v-btn>
            <v-btn class="new-room-step-5" outlined rounded color="primary" @click="search">
              <v-icon left>search</v-icon>검색(F3)
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
      <v-sheet>
        <v-toolbar flat color="white">
          <v-btn outlined
                 class="mr-4 new-room-step-6"
                 color="grey darken-2"
                 @click="setToday"
          >
            오늘
          </v-btn>
          <v-btn
            icon
            class="ma-2 new-room-step-7"
            @click="prev"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            icon
            class="ma-1 new-room-step-8"
            @click="next"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ thisMonth }}</v-toolbar-title>
          <v-spacer />
          <v-btn
            class="ma-1 new-room-step-9"
            outlined rounded color="orange"
            @click="openAmountSearchDialog"
          >
            객실 요금 조회
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
                v-model="saveForm.ciYmd"
                label="선택한 날짜"
                outlined
                disabled
                hide-details
                dense
                :rules="emptyRules"
              />
            </v-col>
            <v-col lg="2" md="3" cols="6">
              <v-text-field
                v-model="saveForm.rmTypeNm"
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
                v-model="totalAmt"
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
                v-model="saleAmt"
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
                v-model="saveForm.comRsvNo"
                label="업체예약번호"
                outlined
                clearable
                hide-details
                dense
                class="new-room-step-10"
              />
            </v-col>
            <v-col lg="2" md="3" cols="6">
              <v-text-field
                v-model="saveForm.userName"
                label="이용자명"
                :rules="emptyRules"
                outlined
                clearable
                hide-details
                dense
                class="new-room-step-11"
              />
            </v-col>
            <v-col lg="2" md="3" cols="6">
              <v-text-field
                v-model="saveForm.userTel"
                label="이용자연락처"
                outlined
                clearable
                hide-details
                dense
                v-mask="['###-####-####', '###-###-####']"
                class="new-room-step-12"
              />
            </v-col>
            <v-col lg="1" md="2" cols="2">
              <v-autocomplete
                v-model="saveForm.nights"
                :items="nightsArr"
                label="박"
                :rules="emptyRules"
                outlined
                hide-details
                dense
                @change="selectAmount"
                class="new-room-step-13"
              />
            </v-col>
            <v-col lg="1" md="2" cols="2">
              <v-autocomplete
                v-model="saveForm.rmCnt"
                :items="rmCntArr"
                label="객"
                :rules="emptyRules"
                outlined
                hide-details
                dense
                @change="selectAmount"
                class="new-room-step-14"
              />
            </v-col>
            <v-col lg="1" md="2" cols="2">
              <v-text-field
                v-model="saveForm.adultCnt"
                label="대인"
                :rules="emptyRules"
                outlined
                hide-details
                dense
                class="new-room-step-15"
              />
            </v-col>
            <v-col lg="1" md="2" cols="2">
              <v-text-field
                v-model="saveForm.childCnt"
                label="소인"
                outlined
                hide-details
                dense
                class="new-room-step-16"
              />
            </v-col>
          </v-row>
        </v-form>
        <v-row>
          <v-col align-self="center" class="text-right pl-0">
            <v-btn outlined rounded color="green" @click="resetSaveForm" class="new-room-step-17">
              <v-icon left>refresh</v-icon>초기화(F4)
            </v-btn>
            <v-btn v-if="isPartner" outlined rounded color="blue" @click="save" class="new-room-step-18">
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
import DialogBase from 'Components/Dialog/DialogBase.vue'
import VueTourForPopup from 'Components/Common/VueTourForPopup.vue'

import roomService from 'Api/modules/ota/roomReservation.service'
import productService from 'Api/modules/ota/product.service'
import roomTypeService from 'Api/modules/ota/roomType.service'

import NumberUtils from '@/utils/number.util'
import { mapGetters } from 'vuex'

export default {
  extends: DialogBase,
  components: { VueTourForPopup },
  name: 'PartnerNewRoomRsvPopup',
  data () {
    return {
      steps: [ // VueTour의 단계
        {
          target: '.new-room-step-0',
          content: '회원번호 변경을 원하는 경우,<br/> 회원번호를 선택 하세요.(필수)',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-room-step-1',
          content: '조회하실 영업장을 선택 하세요.(필수)',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-room-step-2',
          content: '필요하신 경우,<br/> 객실 유형을 선택 하세요.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-room-step-3',
          content: '원하는 박수를 선택 하세요.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-room-step-4',
          content: '원하는 객실 수를 선택 하세요.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-room-step-5',
          content: '입력된 조건으로 검색하는 버튼 입니다.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-room-step-6',
          content: '어디에서든 오늘날짜로 <br/> 돌아오는 버튼입니다.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-room-step-7',
          content: '이전 달로 넘어가는 버튼입니다.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-room-step-8',
          content: '다음달로 넘어가는 버튼입니다.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-room-step-9',
          content: '객실별 요금을 조회하는 버튼입니다.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-room-step-10',
          content: '달력에서 원하는 날짜의 객실을 선택 후,<br/> 업체예약번호를 입력 하세요.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-room-step-11',
          content: '이용자의 이름을 입력 하세요.(필수)',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-room-step-12',
          content: '이용자의 연락처를 입력 하세요.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-room-step-13',
          content: '박수 변경을 원할 경우, <br/> 박수를 선택 하세요.(필수)',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-room-step-14',
          content: '객수 변경을 원할 경우, <br/> 객수를 선택 하세요.(필수)',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-room-step-15',
          content: '성인 수 변경을 원할 경우, <br/> 대인을 변경 하세요.(필수)',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-room-step-16',
          content: '아동 수 변경을 원할 경우, <br/> 소인을 변경 하세요.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-room-step-17',
          content: '예약 정보를 초기화 하는 버튼입니다.',
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '.new-room-step-18',
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
      today: moment().format('YYYY-MM-DD'), // 오늘날짜
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
      rmSearchParam: { // 검색 파라미터
        memNo: '', // 회원번호
        storeCd: '',
        baseDate: '',
        ptnrNo: 0,
        rmDayLimitNum: 0, // 잔여객실 수 최대치 제한
        rmTypeCd: '',
        rsvBlckCd: '',
        rsvStdDay: '',
        rsvStdTm: '00',
        srchRmMonth: 0 // 기준일로부터 조회 일 수
      },
      nightsArr: [], // 박수 select item
      rmCntArr: [], // 객수 select item
      todayRsvYn: '', // 당일 예약 여부
      saleBgnYmd: '', // 판매시작일
      saleEndYmd: '', // 판매종료일
      holidayList: [], // 휴일 정보 목록
      isSearch: true, // 검색이 아닌 경우 이벤트 변경을 막는 변수
      taskTypeNm: '', // 업무구분명
      taskTypeNmList: [], // 업무구분 목록
      leaveCnt: 0, // 잔여 객실 수
      calendarStartDate: '', // 현재 달력의 시작일
      calendarEndDate: '', // 현재 달력의 종료일
      calendarLastDay: '', // 현재 달력의 종료일의 'day'
      agentCd: '', // 예치금에 필요
      rsvGuestTelNo: '', // 예약자 연락처
      termSeq: '', // 예치금에 필요
      ptnrNo: '', // 파트너번호
      key: 0, // 랜더링 버그 관련 key
      hldyYn: false // 휴일 여부
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
    totalAmt () { // 입금가
      return NumberUtils.numberWithCommas(this.saveForm.totalPrice)
    },
    saleAmt () { // 판매가
      return NumberUtils.numberWithCommas(this.saveForm.saleAmt)
    }
  },
  mounted () {
    this.initInfo()
    this.rmSearchParam.ptnrNo = this.user.number // 파트너번호 세팅
    if (!this.isPartner) {
      this.$dialog.alert('이 화면에서는 예약이 불가능 합니다. <br/>실제로 예약하기를 원하시면 창을 닫고 신규 버튼을 <br/>클릭해 진행해주시기 바랍니다.')
    }
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
      this.roomType = _.cloneDeep(this.instance.params.roomType)
      if (this.isPartner) {
        this.partnerInfo = _.cloneDeep(this.instance.params.partnerInfo)
        this.form.memNo = this.partnerInfo.memNo
        this.form.memNm = this.partnerInfo.memNm
        this.termSeq = this.partnerInfo.termSeq
        this.agentCd = this.partnerInfo.agentCd
        this.rsvGuestTelNo = this.partnerInfo.rsvGuestTelNo
        this.ptnrNo = this.user.number // 파트너번호 세팅
      }
    },
    /**
     * 예약 정보 폼 리셋
     */
    resetSaveForm () {
      this.saveForm = {}
      this.saveForm.nights = this.form.nights
      this.saveForm.rmCnt = this.form.rmCnt
      this.saveForm.adultCnt = 1
      this.saveForm.childCnt = 0
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
        (this.rmSearchParam.memNo && this.rmSearchParam.storeCd) ||
        (this.form.memNo && this.form.storeCd)
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
        this.$dialog.alert('회원번호와 영업장코드값은 필수입니다.')
      }
    },
    /**
     * 다음달 조회
     */
    next () {
      const endDate = moment(this.saleEndYmd).format('YYYY-MM-DD') // 판매종료일
      if (
        (this.rmSearchParam.memNo && this.rmSearchParam.storeCd) ||
        (this.form.memNo && this.form.storeCd)
      ) {
        const compareParam = Boolean(Date.parse(this.$refs.calendar.lastEnd.date) >= Date.parse(endDate))
        if (compareParam) {
          this.$dialog.alert(`해당 객실의 판매 종료일은 ${endDate}입니다.`)
        } else {
          this.events = []
          this.$refs.calendar.next()
        }
      } else {
        this.$dialog.alert('회원번호와 영업장코드값은 필수입니다.')
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
        // 회원 번호와 영업장코드 필수
        if (this.form.memNo && this.form.storeCd) {
          this.rmSearchParam.storeCd = this.form.storeCd
          if (this.form.rmTypeCd) { // 객실유형코드가 있는 경우
            this.rmSearchParam.rmTypeCd = this.form.rmTypeCd
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
      this.rmSearchParam.storeCd = this.form.storeCd
      if (this.form.rmTypeCd) { // 객실유형코드가 있는 경우
        this.rmSearchParam.rmTypeCd = this.form.rmTypeCd
      } else {
        this.rmSearchParam.rmTypeCd = ''
        this.form.rmTypeNm = ''
      }
      this.isSearch = true
      await this.selectOneStoreInfo(this.rmSearchParam.storeCd) // 선택된 영업장 정보 조회
      this.setParams() // 검색을 위한 파라미터 세팅
    },
    /**
     * 검색을 위한 baseDate 와 srchRmMonth 세팅
     */
    setParams () {
      const currentMonth = moment(this.calendarStartDate).month() + 1 // 현재 달력의 달
      const thisMonth = moment().month() + 1 // 오늘 날짜의 달
      // 검색하려는 달이 현재의 달과 같을 때
      if (currentMonth === thisMonth) {
        this.rmSearchParam.baseDate = moment().format('YYYYMMDD')
        this.rmSearchParam.srchRmMonth = moment(this.calendarEndDate).diff(moment().format('YYYY-MM-DD'), 'days') + 1
      } else {
        this.rmSearchParam.baseDate = moment(this.calendarStartDate).format('YYYYMMDD')
        this.calculateNights(moment(this.rmSearchParam.baseDate).month() + 1, this.rmSearchParam.baseDate) // 조회할 박수 정보 세팅
      }
      this.$set(this.rmSearchParam, 'nights', this.form.nights)
      this.$set(this.rmSearchParam, 'rmCnt', this.form.rmCnt)
      this.selectInventory() // 재고 조회
    },
    /**
     * srchRmMonth 계산을 위한 함수
     */
    calculateNights (month, monthDate) { // month는 바뀐 달력의 달
      const saleEndMonth = moment(this.saleEndYmd).month() + 1 // 판매 종료일이 있는 달
      const saleStartMonth = moment(this.saleBgnYmd).month() + 1 // 판매 시작일이 있는 달
      const thisyear = moment().year() // 올해 년도
      const saleEndYear = moment(this.saleEndYmd).year() // 판매 종료일이 있는 년도
      const saleStartYear = moment(this.saleBgnYmd).year() // 판매 시작일이 있는 년도
      // 종료일이 있는 달인 경우
      if (thisyear === saleEndYear && month === saleEndMonth) {
        this.rmSearchParam.srchRmMonth = moment(this.saleEndYmd).diff(moment(this.calendarStartDate), 'days') + 1
      } else if (thisyear === saleStartYear && month === saleStartMonth) { // 시작일이 있는 달인 경우
        this.rmSearchParam.srchRmMonth = moment(this.calendarEndDate).diff(moment(this.saleBgnYmd).format('YYYY-MM-DD'), 'days') + 1
      } else {
        this.rmSearchParam.srchRmMonth = moment(monthDate).endOf('month').format('DD')
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
     * 객실 현황 조회
     */
    selectInventory () {
      // 검색인 경우
      if (this.isSearch) {
        this.validForm(this.$refs.form).then(() => {
          this.rmSearchParam.isRealLeaveCnt = 'Y'
          // 영업장으로만 조회
          if (this.rmSearchParam.rmTypeCd === '') {
            roomService.selectRoomInventory('store', this.rmSearchParam).then(res => {
              this.realSetEvents(res.data)
            })
          } else {
            // 영업장과 객실유형으로 조회
            roomService.selectRoomInventory('store-room', this.rmSearchParam).then(res => {
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
    realSetEvents (result) { // result는 객실 현황 목록
      // 객실 현황 목록이 있는 경우
      if (result && result.length > 0) {
        const events = [] // 초기화
        result.forEach(event => {
          // 휴일 확인
          const one = this.holidayList.filter(data => data.stndYmd === event.ciYmd)
          // 휴일여부 초기화
          this.hldyYn = false
          // 휴일여부 체크
          if (one && one.length > 0) {
            const holidayCd = one[0].hldyCd
            if (holidayCd === 'P' || holidayCd === 'S' || holidayCd === 'R') {
              // 객실휴일
              if (holidayCd === 'P') {
                this.hldyYn = true
              } else if (holidayCd === 'S' && one[0].storeCd === event.storeCd) { // 영업장휴일
                this.hldyYn = true
              } else if (holidayCd === 'R' &&
                    one[0].storeCd === event.storeCd &&
                    one[0].rmTypeCd === event.rmTypeCd
              ) { // 객실유형휴일
                this.hldyYn = true
              }
            }
          }

          // 휴일 처리가 필요한 경우
          if (this.hldyYn) {
            this.hldyYn = false
            events.push({
              start: moment(event.ciYmd).format('YYYY-MM-DD'),
              name: this.names[3].name + ' (' + one[0].memo + ')',
              nameCheck: this.names[3].name,
              color: this.colors[2],
              memo: one[0].memo,
              procMsg: event.procMsg
            })
          } else { // 휴일이 아닌 경우
            if (this.todayRsvYn === 'N' && event.ciYmd === moment().format('YYYYMMDD').toString()) {
              events.push({
                start: this.today,
                name: '당일' + this.names[2].name,
                color: this.colors[2],
                procMsg: event.procMsg
              })
            } else {
              // 잔여객실이 없는 경우
              if (event.leaveCnt && event.leaveCnt < 0) {
                // 회원 우선 예약
                if (event.realLeaveCnt > 0) {
                  events.push({
                    start: moment(event.ciYmd).format('YYYY-MM-DD'),
                    name: event.rmTypeNm + ' / ' + event.leaveCnt,
                    nameCheck: this.names[4].name,
                    color: this.colors[3],
                    rmTypeCd: event.rmTypeCd,
                    tooltip: event.rmTypeNm + ' / ' + event.leaveCnt + ' / ' + event.procMsg,
                    procMsg: event.procMsg
                  })
                } else {
                  events.push({ // 예약 마감
                    start: moment(event.ciYmd).format('YYYY-MM-DD'),
                    name: event.rmTypeNm + ' / ' + event.leaveCnt,
                    nameCheck: this.names[1].name,
                    color: this.colors[1],
                    tooltip: event.rmTypeNm + ' / ' + event.leaveCnt + ' / ' + event.procMsg,
                    procMsg: event.procMsg
                  })
                }
              } else if (event.leaveCnt && event.procMsg === '0000') {
                events.push({ // 예약 가능
                  start: moment(event.ciYmd).format('YYYY-MM-DD'),
                  name: event.rmTypeNm + ' / ' + event.leaveCnt,
                  color: this.colors[0],
                  nameCheck: this.names[0].name,
                  rmTypeCd: event.rmTypeCd,
                  tooltip: event.rmTypeNm + ' / ' + event.leaveCnt
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
              start: `2020-${month}-${i}`,
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
     * 파트너 회원 번호 조회
     */
    openPartnerInfo () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/PartnerTermSearch',
        params: {
          taskType: 'OTA_ROOM_API',
          memNo: this.form.memNo
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1500,
          closeCallback: (params) => {
            if (params && params.data) {
              this.form.memNo = params.data.memNo
              this.form.memNm = params.data.memNm
              this.ptnrNo = params.data.ptnrNo
              this.agentCd = params.data.agentCd
              this.rsvGuestTelNo = params.data.capTelNo
              this.termSeq = params.data.termSeq
              if (this.form.storeCd) {
                this.selectOneStoreInfo(this.form.storeCd)
              }
              this.key += 1
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
     * 영업장 정보 조회 결과값 화면에 매핑
     */
    mapStoreInfoResult (result) {
      this.$set(this.form, 'storeCd', result.storeCd)
      this.$set(this.form, 'storeNm', result.storeNm)
    },
    /**
     * 영업장 조회
     */
    async searchStoreInfo (item) {
      const param = {}
      param.storeCd = item.storeCd
      param.useYn = '1'
      const res = await roomService.selectStoreInfo(param)
      if (res.data && res.data.length === 1) {
        this.resetEventsAndSaveForm()
        this.mapStoreInfoResult(res.data[0]) // 결과값 화면에 매핑
        this.selectStoreInfo(res.data[0].storeCd) // 영업장에 대한 정보 조회
      } else {
        this.openStorePopup(item)
      }
    },
    /**
     * 영업장 조회 팝업창 오픈
     */
    openStorePopup (item) {
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
              this.selectStoreInfo(params.data.storeCd) // 영업장에 대한 정보 조회
            }
          }
        }
      })
    },
    /**
     * 영업장 1개 정보 조회
     */
    async selectOneStoreInfo (storeCd) {
      this.nightsArr = [] // 초기화
      this.rmCntArr = [] // 초기화
      const res = await roomService.selectOneStoreInfo(storeCd, this.ptnrNo)
      this.rmSearchParam.memNo = this.form.memNo // 회원번호 세팅
      this.saleBgnYmd = res.data.saleBgnYmd // 판매 시작일
      this.saleEndYmd = res.data.saleEndYmd // 판매 종료일
      this.todayRsvYn = res.data.todayRsvYn // 당일 예약 여부
      if (res.data.todayRsvTime) {
        this.rmSearchParam.rsvStdTm = res.data.todayRsvTime // 당일 예약 가능 시간
      }
      this.rmSearchParam.rsvBlckCd = res.data.rsvBlckCd // 예약 블럭 코드
      this.rmSearchParam.rmDayLimitNum = res.data.dailRsvLmt // 잔여객실 수 최대치 제한
      this.rmSearchParam.srchRmMonth = res.data.rmInqDdCnt // 오늘부터 며칠까지 조회 가능한지 여부
      // 박수 배열에 값 추가
      for (let i = 1; i < res.data.stayNights + 1; i++) {
        this.nightsArr.push(i)
      }
      // 객수 배열에 값 추가
      for (let i = 1; i < res.data.rmCnt + 1; i++) {
        this.rmCntArr.push(i)
      }
    },
    /**
     * 영업장에 대한 정보 조회
     */
    async selectStoreInfo (storeCd) {
      this.selectOneStoreInfo(storeCd)
      // 박과 객에 기본값 설정
      this.$set(this.form, 'nights', 1)
      this.$set(this.form, 'rmCnt', 1)
      // 영업장 및 객실 휴일 정보 조회
      const holidayRes = await roomTypeService.selectHolidayList(storeCd)
      this.holidayList = holidayRes.data
      // 오늘 날짜로 리셋
      this.setToday()
      this.isSearch = false
      this.resetEventsAndSaveForm()
      // 객실 유형 정보가 있는 경우 초기화
      if (this.form.rmTypeCd) {
        this.form.rmTypeCd = ''
        this.form.rmTypeNm = ''
      }
    },
    /**
     * 객실 유형 정보 조회 결과값 매핑
     */
    mapRmTypeInfoResult (result) {
      this.$set(this.form, 'rmTypeCd', result.rmTypeCd)
      this.$set(this.form, 'rmTypeNm', result.rmTypeNm)
    },
    /**
     * 객실유형코드 조회
     */
    async searchRmTypePopup (item) {
      if (item.storeCd) {
        const param = {}
        param.storeCd = item.storeCd
        param.rmTypeCd = item.rmTypeCd
        param.useYn = '1'
        const res = await roomService.selectRmTypeAndDongInfo(param)
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
      if (item.storeCd) {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Ota/RoomReservation/popup/RmTypePopup',
          params: {
            item: {
              storeCd: item.storeCd
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
     * 객실 요금 조회 팝업 오픈
     */
    openAmountSearchDialog () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Board/Amount/BoardRoomAmountSearchDialog',
        options: {
          fullscreen: false,
          scrollable: true,
          width: 1300
        }
      })
    },
    /**
     * 요금 조회
     */
    async selectAmount () {
      // 요금 조회 파라미터 세팅
      const priceParam = {}
      priceParam.memNo = this.form.memNo
      priceParam.storeCd = this.form.storeCd
      priceParam.ciYmd = this.saveForm.ciYmd.replace(/-/gi, '')
      priceParam.rmTypeCd = this.saveForm.rmTypeCd
      priceParam.nights = this.saveForm.nights
      priceParam.rmCnt = this.saveForm.rmCnt
      priceParam.rsvBlckCd = this.rmSearchParam.rsvBlckCd
      try {
        const res = await roomService.selectRoomAmount(priceParam)
        this.$set(this.saveForm, 'saleAmt', res.data.total) // 판매가
        this.$set(this.saveForm, 'totalPrice', res.data.rcpmnyTotal) // 입금가
      } catch (e) {
        this.$set(this.saveForm, 'totalPrice', 0) // 입금가
      }
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
        if (
          event.start &&
          this.form.memNo &&
          this.form.storeCd &&
          this.rmSearchParam.rsvBlckCd &&
          this.form.nights &&
          this.form.rmCnt
        ) {
          param.memNo = this.form.memNo
          param.storeCd = this.form.storeCd
          param.ciYmd = event.start.replace(/-/gi, '')
          param.rsvBlckCd = this.rmSearchParam.rsvBlckCd
          param.nights = this.form.nights
          param.rmCnt = this.form.rmCnt
          param.rsvStdDay = this.todayRsvYn
          param.rsvStdTm = this.rmSearchParam.rsvStdTm
          // 예약 가능여부 확인
          const res = await productService.selectPossibleRoomInventory(event.rmTypeCd, param)
          if (res.data.procMsg === '0000') {
            // 예약을 위한 정보 세팅
            this.$set(this.saveForm, 'ciYmd', event.start)
            this.$set(this.saveForm, 'rmTypeNm', nativeEvent.target.textContent.substring(0, nativeEvent.target.textContent.lastIndexOf('/')))
            this.saveForm.rmTypeCd = event.rmTypeCd
            this.$set(this.saveForm, 'adultCnt', 1)
            this.$set(this.saveForm, 'childCnt', 0)
            this.$set(this.saveForm, 'nights', param.nights)
            this.$set(this.saveForm, 'rmCnt', param.rmCnt)
            // 요금 조회
            this.selectAmount()
          } else {
            this.$dialog.alert(res.data.procMsg)
          }
        }
      }
    },
    /**
     * 예약
     */
    async save () {
      const basicCheck = Boolean(this.form.memNo && this.form.storeCd && this.todayRsvYn && this.rmSearchParam.rsvBlckCd)
      const saveFormCheck = Boolean(this.saveForm.ciYmd && this.saveForm.nights && this.saveForm.rmCnt && this.saveForm.userName && this.saveForm.totalPrice && this.saveForm.rmTypeCd && this.saveForm.adultCnt)
      // 예약에 필요한 파라미터들이 있는 경우에만 실행
      if (basicCheck && saveFormCheck) {
        const param = {}
        this.validForm(this.$refs.form).then(() => {
          param.memNo = this.form.memNo
          param.storeCd = this.form.storeCd
        })
        this.validForm(this.$refs.rsvForm).then(() => {
          param.ciYmd = this.saveForm.ciYmd.replace(/-/gi, '')
          param.nights = this.saveForm.nights
          param.rmCnt = this.saveForm.rmCnt
        })
        param.rsvStdDay = this.todayRsvYn
        param.rsvStdTm = this.rmSearchParam.rsvStdTm
        param.rsvBlckCd = this.rmSearchParam.rsvBlckCd
        // 예약 가능여부 확인
        const res = await productService.selectPossibleRoomInventory(this.saveForm.rmTypeCd, param)
        // 예약 가능시
        if (res.data.procMsg === '0000') {
          delete param.rsvStdDay
          delete param.rsvStdTm
          param.ptnrNm = this.user.name
          param.updId = this.user.number
          param.ptnrNo = this.user.number // 예치금에 필요
          if (this.saveForm.comRsvNo) { // 업체예약번호는 필수값 아님
            param.comRsvNo = this.saveForm.comRsvNo
          }
          this.validForm(this.$refs.rsvForm).then(() => {
            param.userName = this.saveForm.userName
            param.payAmt = this.saveForm.totalPrice // 입금가
            param.rmTypeCd = this.saveForm.rmTypeCd
            param.adultCnt = this.saveForm.adultCnt
            param.childCnt = this.saveForm.childCnt
          })
          param.userTel = this.saveForm.userTel // 이용자 연락처
          param.rsvGuestTelNo = this.rsvGuestTelNo // 예약자 연락처
          param.termSeq = this.termSeq // 예치금에 필요
          param.agentCd = this.agentCd
          // 실제 예약 처리
          const confirm = await this.$dialog.confirm('개인 정보 수집에 동의하시겠습니까?')
          if (confirm) {
            const result = await roomService.insertRoomNewRsv('partner', param)
            if (result.data.resultMsg === 'SUCCESS') {
              console.log(`예약번호: ${result.data.roomRsvNo},  ${result.data.roomRsvSeq}`)
              this.$dialog.alert(`예약번호: ${result.data.roomRsvNo}`)
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
            //           roomService.insertRoomNewRsv('partner', param).then(res => {
            //             if (res.data.resultMsg === 'SUCCESS') {
            //               this.$dialog.alert(`예약번호: ${res.data.roomRsvNo}`)
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
