<template>
    <v-row wrap>
      <app-card heading="정산 비교/대조 목록" col-classes="col-12">
        <v-row>
          <v-col cols="12" lg="6" md="12" sm="12">
            <v-row no-gutters>
              <v-col cols="12">
                <h3 class="title font-weight-bold">시스템 정산 내역 <span v-if="selectedDate">({{selectedDate}})</span><span v-if="sysCalList.length > 0"> ({{selectedSysCalItem}} 총 {{sysCalList.length | price}} 건)</span></h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col align-self="center" class="text-left pa-0" cols="8">
                <v-menu
                    ref="menu"
                    v-model="calendarOpen"
                    :close-on-content-click="false"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary"
                          rounded
                          v-on="on"
                          v-bind="attrs"
                          @click="showCalendar"
                    >
                      <v-icon class="pr-2">calendar_today</v-icon> 이전 달 정산이력 보기
                    </v-btn>
                    <!-- 1. 월력 선택 시 아래 4가지 데이터가 있는 경우 표시 -->
                    <v-btn align-self="center" class="text-left pa-0" rounded @click="selectTpneSysCalList" :disabled="sysCalItems.tpneShowYn === 'N'">TPNE</v-btn>
                    <v-btn align-self="center" class="text-left pa-0" rounded @click="selectPenaltySysCalList" :disabled="sysCalItems.penaltyShowYn === 'N'">위약금</v-btn>
                    <v-btn align-self="center" class="text-left pa-0" rounded @click="selectPkgSysCalList" :disabled="sysCalItems.pkgShowYn === 'N'">패키지</v-btn>
                    <v-btn align-self="center" class="text-left pa-0" rounded @click="selectRoomSysCalList" :disabled="sysCalItems.roomShowYn === 'N'">객실</v-btn>
                  </template>
                  <v-date-picker
                      v-model="selectedDate"
                      type="month"
                      locale="kr"
                      no-title
                      scrollable
                      @change="move"
                  >
                    <!-- <v-spacer /> -->
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col align-self="center" class="text-right pa-1" cols="4">
                <v-btn outlined rounded color="primary" @click="openViewSysCalSearchDialog">
                  <v-icon left>search</v-icon>필터
                </v-btn>
              </v-col>
            </v-row>
            <v-sheet elevation="1">
              <v-data-table
                :headers="sysCalHeaders"
                :items="sysCalList"
                :no-data-text="'검색 결과가 없습니다.'"
                height="500"
                disable-pagination
                hide-default-footer
              >
              </v-data-table>
            </v-sheet>
          </v-col>
          <v-col cols="12" lg="6" md="12" sm="12">
            <v-row no-gutters>
              <v-col cols="12">
                <h3 class="title font-weight-bold">수기 정산 내역 <span v-if="excelUploadData.length > 0">(총 {{excelUploadData.length | price}} 건)</span></h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col align-self="center" class="text-right pa-1">
                <v-btn outlined rounded color="primary" @click="resetExcelUploadData">
                  <v-icon left>refresh</v-icon>초기화
                </v-btn>
                <v-btn outlined rounded color="green" @click="openViewExcelUploadDialog">
                  <v-icon left>note_add</v-icon>엑셀업로드
                </v-btn>
                <v-btn outlined rounded color="primary" @click="openViewHandCalSearchDialog">
                  <v-icon left>search</v-icon>필터
                </v-btn>
              </v-col>
            </v-row>
            <v-sheet elevation="1">
              <v-data-table
                :headers="handCalHeaders"
                :items="excelUploadData"
                :no-data-text="'검색 결과가 없습니다.'"
                height="500"
                disable-pagination
                hide-default-footer
              >

              </v-data-table>
            </v-sheet>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="6" md="12" sm="12">
            <v-row no-gutters>
              <v-col cols="12">
                <h3 class="title font-weight-bold">
                  <v-tooltip top z-index="1000">
                    <template v-slot:activator="{ on }">
                      <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
                    </template>
                    <span>   1) 시스템 정산에만 있는 예약 건 노출<br>
                             2) 수기 정산에만 있는 예약 건 노출<br>
                    </span>
                  </v-tooltip>
                  예약내역 매칭 실패 건 <span v-if="compareRsvResult.length > 0"> (총 {{compareRsvResult.length | price}} 건)</span>
                </h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col align-self="center" class="text-right pa-1">
                <v-btn outlined rounded color="primary" @click="openViewCompareRsvResultSearchDialog">
                  <v-icon left>search</v-icon>필터
                </v-btn>
                <v-btn outlined rounded color="blue" @click="getComapreRsvResult">
                  <v-icon>mdi-file-compare</v-icon>비교
                </v-btn>
              </v-col>
            </v-row>
            <v-sheet elevation="1">
              <v-data-table
                :headers="rsvHeaders"
                :items="compareRsvResult"
                :no-data-text="'검색 결과가 없습니다.'"
                height="500"
                disable-pagination
                hide-default-footer
              >
                <template v-slot:[`item.gubun`]="{item}">
                  {{item.gubun === 'SYS' ? '시스템 정산에만 있는 예약 건' : '수기 정산에만 있는 예약 건'}}
                </template>
              </v-data-table>
            </v-sheet>
          </v-col>
          <v-col cols="12" lg="6" md="12" sm="12">
            <v-row no-gutters>
              <v-col cols="12">
                <h3 class="title font-weight-bold">
                  <v-tooltip top z-index="1000">
                    <template v-slot:activator="{ on }">
                      <v-icon color="primary" v-on="on" size="21" class="mb-1">help_outline</v-icon>
                    </template>
                    <span>   1) 예약금액 매칭 사용법 : 반드시 예약내역 비교 후 예약금액 비교를 선택한다.<br>
                             2) 비교 조건 : 시스템 정산 예약내역 내 KEY예약번호 는 수기정산 예약내역 내 KEY예약번호가 반드시 있어야 한다.<br>
                             3) 시스템 정산 금액(후불)과 수기 정산 금액 비교
                    </span>
                  </v-tooltip>
                  예약금액 매칭 실패 건 <span v-if="compareAmtResult.length > 0"> (총 {{compareAmtResult.length | price}} 건)</span>
                </h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col align-self="center" class="text-right pa-1">
                <v-btn outlined rounded color="primary" @click="openViewCompareAmtResultSearchDialog">
                  <v-icon left>search</v-icon>필터
                </v-btn>
                <v-btn outlined rounded color="blue" @click="getComapreAmtResult">
                  <v-icon>mdi-file-compare</v-icon>비교
                </v-btn>
              </v-col>
            </v-row>
            <v-sheet elevation="1">
              <v-data-table
                :headers="amtHeaders"
                :items="compareAmtResult"
                :no-data-text="'검색 결과가 없습니다.'"
                height="500"
                disable-pagination
                hide-default-footer
              >
              </v-data-table>
            </v-sheet>
          </v-col>
        </v-row>
      </app-card>
    </v-row>
</template>

<script>
import calculationService from 'Api/modules/ota/calculation.service'
import calculateCompareService from 'Api/modules/ota/calculateCompare.service'

export default {
  name: 'CalculateComparativeContrast',
  data () {
    return {
      targetDate: moment().format('YYYYMMDD'),
      calendarOpen: false,
      dateFormatter: 'YYYY-MM',
      selectedDate: null,
      excelUploadData: [],
      sysCalList: [],
      selectedSysCalItem: null,
      sysCalItems: {
        roomShowYn: 'N',
        roomCalcSeq: '',
        pkgShowYn: 'N',
        pkgCalcSeq: '',
        penaltyShowYn: 'N',
        penaltyCalcSeq: '',
        tpneShowYn: 'N',
        tpneCalcSeq: ''
      },
      initSysCalItems: { // 초기화용
        roomShowYn: 'N',
        roomCalcSeq: '',
        pkgShowYn: 'N',
        pkgCalcSeq: '',
        penaltyShowYn: 'N',
        penaltyCalcSeq: '',
        tpneShowYn: 'N',
        tpneCalcSeq: ''
      },
      sysCalHeaders: [
        {
          text: '회원번호',
          value: 'memNo',
          align: 'center',
          sortable: true,
          filter: value => {
            if (!this.sysCalSearchForMemNo) return true
            return value.toString().toLocaleUpperCase().indexOf(this.sysCalSearchForMemNo) !== -1
          }
        },
        {
          text: '회원명',
          value: 'memNm',
          align: 'center',
          sortable: true,
          filter: value => {
            if (!this.sysCalSearchForMemNm) return true
            return value.toString().toLocaleUpperCase().indexOf(this.sysCalSearchForMemNm) !== -1
          }
        },
        {
          text: '입실일자',
          value: 'ciYmd',
          align: 'center',
          sortable: true,
          filter: value => {
            if (!this.sysCalSearchForCiYmd) return true
            return value.toString().toLocaleUpperCase().indexOf(this.sysCalSearchForCiYmd) !== -1
          }
        },
        {
          text: '객실번호',
          value: 'roomNo',
          align: 'center',
          sortable: true,
          filter: value => {
            if (!this.sysCalSearchForRoomNo) return true
            return value.toString().toLocaleUpperCase().indexOf(this.sysCalSearchForRoomNo) !== -1
          }
        },
        {
          text: '예약금액',
          value: 'totAmt',
          align: 'center',
          sortable: true
        },
        {
          text: '발생금액',
          value: 'aftpayAmt',
          align: 'center',
          sortable: true,
          filter: value => {
            if (!this.sysCalSearchForAccruedAmt) return true
            return value.toString().toLocaleUpperCase().indexOf(this.sysCalSearchForAccruedAmt) !== -1
          }
        },
        {
          text: '차액',
          value: 'diffAmt',
          align: 'center',
          sortable: true
        },
        {
          text: '예약번호',
          value: 'rsvNo',
          align: 'center',
          sortable: true,
          filter: value => {
            if (!this.sysCalSearchForRsvNo) return true
            return value.toString().toLocaleUpperCase().indexOf(this.sysCalSearchForRsvNo) !== -1
          }
        },
        {
          text: 'Key예약번호',
          value: 'keyRsvNo',
          align: 'center',
          sortable: true,
          filter: value => {
            if (!this.sysCalSearchForKeyRsvNo) return true
            return value.toString().toLocaleUpperCase().indexOf(this.sysCalSearchForKeyRsvNo) !== -1
          }
        }
      ],
      handCalHeaders: [
        {
          text: '회원번호',
          value: 'memNo',
          align: 'center',
          sortable: true,
          filter: value => {
            if (!this.handCalSearchForMemNo) return true
            return value.toString().toLocaleUpperCase().indexOf(this.handCalSearchForMemNo) !== -1
          }
        },
        {
          text: '회원명',
          value: 'memNm',
          align: 'center',
          sortable: true,
          filter: value => {
            if (!this.handCalSearchForMemNm) return true
            return value.toString().toLocaleUpperCase().indexOf(this.handCalSearchForMemNm) !== -1
          }
        },
        {
          text: '입실일자',
          value: 'ciYmd',
          align: 'center',
          sortable: true,
          filter: value => {
            if (!this.handCalSearchForCiYmd) return true
            return value.toString().toLocaleUpperCase().indexOf(this.handCalSearchForCiYmd) !== -1
          }
        },
        {
          text: '객실번호',
          value: 'roomNo',
          align: 'center',
          sortable: true,
          filter: value => {
            if (!this.handCalSearchForRoomNo) return true
            return value.toString().toLocaleUpperCase().indexOf(this.handCalSearchForRoomNo) !== -1
          }
        },
        {
          text: '발생금액',
          value: 'accruedAmt',
          align: 'center',
          sortable: true,
          filter: value => {
            if (!this.handCalSearchForAccruedAmt) return true
            return value.toString().toLocaleUpperCase().indexOf(this.handCalSearchForAccruedAmt) !== -1
          }
        },
        {
          text: '예약번호',
          value: 'rsvNo',
          align: 'center',
          sortable: true,
          filter: value => {
            if (!this.handCalSearchForRsvNo) return true
            return value.toString().toLocaleUpperCase().indexOf(this.handCalSearchForRsvNo) !== -1
          }
        },
        {
          text: 'Key예약번호',
          value: 'keyRsvNo',
          align: 'center',
          sortable: true,
          filter: value => {
            if (!this.handCalSearchForKeyRsvNo) return true
            return value.toString().toLocaleUpperCase().indexOf(this.handCalSearchForKeyRsvNo) !== -1
          }
        }
      ],
      handCalSearchForMemNo: '', // 수기정산 검색 - 회원번호
      handCalSearchForMemNm: '', // 수기정산 검색 - 회원명
      handCalSearchForCiYmd: '', // 수기정산 검색 - 입실일자
      handCalSearchForRoomNo: '', // 수기정산 검색 - 객실번호
      handCalSearchForAccruedAmt: '', // 수기정산 검색 - 발생금액
      handCalSearchForRsvNo: '', // 수기정산 검색 - 예약번호
      handCalSearchForKeyRsvNo: '', // 수기정산 검색 - Key예약번호
      sysCalSearchForMemNo: '', // 시스템 정산 검색 - 회원번호
      sysCalSearchForMemNm: '', // 시스템 정산 검색 - 회원명
      sysCalSearchForCiYmd: '', // 시스템 정산 검색 - 입실일자
      sysCalSearchForRoomNo: '', // 시스템 정산 검색 - 객실번호
      sysCalSearchForAccruedAmt: '', // 시스템 정산 검색 - 발생금액
      sysCalSearchForRsvNo: '', // 시스템 정산 검색 - 예약번호
      sysCalSearchForKeyRsvNo: '', // 시스템 정산 검색 - Key예약번호
      searchParam: {
        q: {},
        page: 1,
        size: 100000,
        total: 0
      },
      amtHeaders: [
        { text: '구분', value: 'gubun', align: 'center', sortable: true },
        { text: '회원번호', value: 'sysMemNo', align: 'center', sortable: true },
        { text: '회원명', value: 'sysMemNm', align: 'center', sortable: true },
        { text: '입실일자', value: 'sysCiYmd', align: 'center', sortable: true },
        { text: '객실번호', value: 'excelRoomNo', align: 'center', sortable: true },
        { text: '예약총금액', value: 'sysTotAmt', align: 'center', sortable: true },
        { text: '후불금액', value: 'sysAftpayAmt', align: 'center', sortable: true },
        { text: '수기 금액', value: 'excelAmt', align: 'center', sortable: true },
        { text: '차액(예약총금액-후불금액)', value: 'sysDiffAmt', align: 'center', sortable: true },
        { text: '예약번호', value: 'sysRsvNo', align: 'center', sortable: true },
        { text: 'Key예약번호', value: 'sysKeyRsvNo', align: 'center', sortable: true }
      ],
      rsvHeaders: [
        { text: '구분', value: 'gubun', align: 'center', sortable: true },
        { text: '회원번호', value: 'memNo', align: 'center', sortable: true },
        { text: '회원명', value: 'memNm', align: 'center', sortable: true },
        { text: '입실일자', value: 'ciYmd', align: 'center', sortable: true },
        { text: '객실번호', value: 'roomNo', align: 'center', sortable: true },
        { text: '발생금액', value: 'amt', align: 'center', sortable: true },
        { text: '예약번호', value: 'rsvNo', align: 'center', sortable: true },
        { text: 'Key예약번호', value: 'keyRsvNo', align: 'center', sortable: true }
      ],
      compareRsvResult: [],
      compareAmtResult: []
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    /**
     * 정산 비교/대조 > Calendar 구현
     */
    showCalendar () {
      this.calendarOpen = true
      this.selectedDate = moment(this.targetDate).format(this.dateFormatter)
    },
    /**
     * 정산 비교/대조 > Calendar 이동
     */
    async move () {
      if (this.selectedDate === null) {
        this.$dialog.alert('이동할 날짜를 선택해주세요.')
        return
      }

      this.targetDate = moment(this.selectedDate).format('YYYYMMDD')

      // 정산내역 호출
      const res = await calculationService.retrieveMonthCalcHistory(this.targetDate)
      if (res.data.resultCode === '0000') {
        this.sysCalItems = _.cloneDeep(this.initSysCalItems) // 초기화

        // 정산 구분 별 showYN 체크
        res.data.resultList.forEach((data) => {
          switch (data.calcInd) {
            case '0':
              this.sysCalItems.roomShowYn = 'Y'
              this.sysCalItems.roomCalcSeq = data.calcSeq
              break
            case '1':
              this.sysCalItems.pkgShowYn = 'Y'
              this.sysCalItems.pkgCalcSeq = data.calcSeq
              break
            case '2':
              this.sysCalItems.penaltyShowYn = 'Y'
              this.sysCalItems.penaltyCalcSeq = data.calcSeq
              break
            case '3':
              this.sysCalItems.tpneShowYn = 'Y'
              this.sysCalItems.tpneCalcSeq = data.calcSeq
              break
          }
        })
      } else {
        this.$dialog.alert(res.data.resultMsg)
        this.sysCalList = []
        this.sysCalItems = _.cloneDeep(this.initSysCalItems) // 초기화
      }

      this.calendarOpen = false
    },
    /**
     * 정산 비교/대조 > 시스템 정산 내역 조회팝업 호출
     */
    openViewSysCalSearchDialog () {
      if (this.sysCalList.length < 1) {
        this.$dialog.alert('조회할 데이터가 없습니다.')
        return
      }
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Calculation/CalcCompare/SearchDialog',
        params: {
          memNo: this.sysCalSearchForMemNo,
          memNm: this.sysCalSearchForMemNm,
          ciYmd: this.sysCalSearchForCiYmd,
          roomNo: this.sysCalSearchForRoomNo,
          accruedAmt: this.sysCalSearchForAccruedAmt,
          rsvNo: this.sysCalSearchForRsvNo,
          keyRsvNo: this.sysCalSearchForKeyRsvNo
        },
        options: {
          fullscreen: false,
          maxWidth: 1200,
          closeCallback: (params) => {
            if (params && params.data) {
              this.sysCalSearchForMemNo = params.data.memNo
              this.sysCalSearchForMemNm = params.data.memNm
              this.sysCalSearchForCiYmd = params.data.ciYmd
              this.sysCalSearchForRoomNo = params.data.roomNo
              this.sysCalSearchForAccruedAmt = params.data.accruedAmt
              this.sysCalSearchForRsvNo = params.data.rsvNo
              this.sysCalSearchForKeyRsvNo = params.data.keyRsvNo
            }
          }
        }
      })
    },
    /**
     * 정산 비교/대조 > 수기 정산 내역 조회팝업 호출
     */
    openViewHandCalSearchDialog () {
      if (this.excelUploadData.length < 1) {
        this.$dialog.alert('조회할 데이터가 없습니다.')
        return
      }
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Calculation/CalcCompare/SearchDialog',
        params: {
          memNo: this.handCalSearchForMemNo,
          memNm: this.handCalSearchForMemNm,
          ciYmd: this.handCalSearchForCiYmd,
          roomNo: this.handCalSearchForRoomNo,
          accruedAmt: this.handCalSearchForAccruedAmt,
          rsvNo: this.handCalSearchForRsvNo,
          keyRsvNo: this.handCalSearchForKeyRsvNo
        },
        options: {
          fullscreen: false,
          maxWidth: 1200,
          closeCallback: (params) => {
            if (params && params.data) {
              this.handCalSearchForMemNo = params.data.memNo
              this.handCalSearchForMemNm = params.data.memNm
              this.handCalSearchForCiYmd = params.data.ciYmd
              this.handCalSearchForRoomNo = params.data.roomNo
              this.handCalSearchForAccruedAmt = params.data.accruedAmt
              this.handCalSearchForRsvNo = params.data.rsvNo
              this.handCalSearchForKeyRsvNo = params.data.keyRsvNo
            }
          }
        }
      })
    },
    /**
     * 정산 비교/대조 > 예약내역 매칭 실패 건 조회팝업 호출
     */
    openViewCompareAmtResultSearchDialog () {
      this.$dialog.alert('구현중')
    },
    /**
     *정산 비교/대조 > 예약금액 매칭 실패 건 조회팝업 호출
     */
    openViewCompareRsvResultSearchDialog () {
      this.$dialog.alert('구현중')
    },
    /**
     * 정산 비교/대조 > 매칭 실패 건 > 비교 버튼
     */
    beginCompareDate () {
      if (this.excelUploadData.length < 1) {
        this.$dialog.alert('수기 정산 내역 데이터가 없습니다.')
        return
      }
      if (this.sysCalList.length < 1) {
        this.$dialog.alert('시스템 정산 내역 데이터가 없습니다.')
        return
      }
      this.$dialog.alert('구현중')
    },
    /**
     * 정산 비교/대조 > 엑셀업로드
     */
    openViewExcelUploadDialog () {
      if (this.selectedSysCalItem === null || this.selectedSysCalItem === '') {
        this.$dialog.alert('시스템 정산 내역을 선택해주세요. ( 객실/패키지/위약금/TPNE 중 택 1')
        return
      }
      let path = ''
      if (this.selectedSysCalItem === '객실') {
        path = '/Ota/Calculation/CalcCompare/ExcelUploadDialog'
      } else if (this.selectedSysCalItem === '패키지') {
        path = '/Ota/Calculation/CalcCompare/PkgExcelUploadDialog'
      } else if (this.selectedSysCalItem === '위약금') {
        this.$dialog.alert('구현중')
        return
      } else if (this.selectedSysCalItem === 'TPNE') {
        this.$dialog.alert('구현중')
        return
      } else {
        this.$dialog.alert('올바르지 않은 정보입니다. 담당자에게 문의 부탁드립니다.')
        return
      }
      this.$store.dispatch('dialog/open', {
        componentPath: path,
        options: {
          fullscreen: false,
          maxWidth: 1200,
          closeCallback: (params) => {
            if (params && params.data) {
              this.excelUploadData = params.data
            }
          }
        }
      })
    },
    /**
     * 정산 비교/대조 > 시스템 정산 내역(객실)
     */
    async selectRoomSysCalList () {
      if (!this.selectedDate) {
        this.$dialog.alert('이전 달 정산이력 보기 를 선택해 주세요.')
        return
      }
      this.searchParam.q.calcSeq = this.sysCalItems.roomCalcSeq
      const res = await calculationService.retrieveMonthCalcDetail(this.sysCalItems.roomCalcSeq, this.searchParam)
      const data = res.data
      if (data.resultCode !== '0000') {
        this.$dialog.alert(data.resultMsg)
      } else {
        this.sysCalList = []
        this.sysCalList = data.resultList
        this.selectedSysCalItem = '객실'
      }
    },
    /**
     * 정산 비교/대조 > 시스템 정산 내역(패키지)
     */
    async selectPkgSysCalList () {
      if (!this.selectedDate) {
        this.$dialog.alert('이전 달 정산이력 보기 를 선택해 주세요.')
        return
      }
      this.searchParam.q.calcSeq = this.sysCalItems.pkgCalcSeq
      const res = await calculationService.retrieveMonthCalcDetail(this.sysCalItems.pkgCalcSeq, this.searchParam)
      const data = res.data
      if (data.resultCode !== '0000') {
        this.$dialog.alert(data.resultMsg)
      } else {
        this.sysCalList = []
        this.sysCalList = data.resultList
        this.selectedSysCalItem = '패키지'
      }
    },
    /**
     * 정산 비교/대조 > 시스템 정산 내역(위약금)
     */
    async selectPenaltySysCalList () {
      if (!this.selectedDate) {
        this.$dialog.alert('이전 달 정산이력 보기 를 선택해 주세요.')
        return
      }
      this.searchParam.q.calcSeq = this.sysCalItems.penaltyCalcSeq
      const res = await calculationService.retrieveMonthCalcDetail(this.sysCalItems.penaltyCalcSeq, this.searchParam)
      const data = res.data
      if (data.resultCode !== '0000') {
        this.$dialog.alert(data.resultMsg)
      } else {
        this.sysCalList = []
        this.sysCalList = data.resultList
        this.selectedSysCalItem = '위약금'
      }
    },
    /**
     * 정산 비교/대조 > 시스템 정산 내역(TPNE)
     */
    async selectTpneSysCalList () {
      if (!this.selectedDate) {
        this.$dialog.alert('이전 달 정산이력 보기 를 선택해 주세요.')
        return
      }
      this.searchParam.q.calcSeq = this.sysCalItems.tpneCalcSeq
      const res = await calculationService.retrieveMonthCalcDetail(this.sysCalItems.tpneCalcSeq, this.searchParam)
      const data = res.data
      if (data.resultCode !== '0000') {
        this.$dialog.alert(data.resultMsg)
      } else {
        this.sysCalList = []
        this.sysCalList = data.resultList
        this.selectedSysCalItem = 'TPNE'
      }
    },
    /**
     * 정산 비교/대조 > 예약내역 비교
     */
    async getComapreRsvResult () {
      if (this.excelUploadData.length < 1) {
        this.$dialog.alert('수기 정산 내역 데이터가 없습니다.')
        return
      }
      if (this.sysCalList.length < 1) {
        this.$dialog.alert('시스템 정산 내역 데이터가 없습니다.')
        return
      }
      const res = await calculateCompareService.compareRsvList(this.sysCalList, this.excelUploadData)
      this.compareRsvResult = res.data
    },
    /**
     * 정산 비교/대조 > 예약금액 비교
     */
    async getComapreAmtResult () {
      if (this.excelUploadData.length < 1) {
        this.$dialog.alert('수기 정산 내역 데이터가 없습니다.')
        return
      }
      if (this.sysCalList.length < 1) {
        this.$dialog.alert('시스템 정산 내역 데이터가 없습니다.')
        return
      }
      // 예약내역 매칭 실패 건 제외하고 넣기
      const matchSys = _.cloneDeep(this.sysCalList)
      const matchExcel = _.cloneDeep(this.excelUploadData)
      if (this.compareRsvResult.length > 0) {
        this.compareRsvResult.forEach(item => {
          if (item.gubun === 'SYS') {
            const index = matchSys.findIndex(data => data.keyRsvNo === String(item.keyRsvNo))
            if (index > -1) matchSys.splice(index, 1)
          } else if (item.gubun === 'EXCEL') {
            const index = matchExcel.findIndex(data => data.keyRsvNo === String(item.keyRsvNo))
            if (index > -1) matchExcel.splice(index, 1)
          }
        })
      }

      if (matchExcel.length < 1) {
        this.$dialog.alert('수기 정산 내역 데이터가 없습니다.')
        return
      }
      if (matchSys.length < 1) {
        this.$dialog.alert('시스템 정산 내역 데이터가 없습니다.')
        return
      }

      const res = await calculateCompareService.compareAmtList(matchSys, matchExcel)
      this.compareAmtResult = res.data
    },
    /**
     * 정산 비교/대조 > 수기정산내역 초기화
     */
    resetExcelUploadData () {
      if (this.excelUploadData.length < 1) {
        this.$dialog.alert('초기화 할 데이터가 없습니다.')
        return
      }
      this.excelUploadData = []
    }
  }
}
</script>
