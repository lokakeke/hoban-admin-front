<template>
  <div>
    <v-row>
      <v-col md="6" cols="12">
        <v-label>패키지</v-label>
        <v-text-field
          :value="form.pkgNm"
          hide-details
          dense
          readonly
          placeholder="클릭하여 패키지를 선택해 주세요."
          @click="openPackagePopup"
        >
          <template v-slot:prepend-inner>
            <v-chip x-small class="mt-2" v-if="form.pkgNo">{{ form.pkgNo }}</v-chip>
          </template>
          <template v-slot:append>
            <v-btn icon small color="primary" tabindex="-1" @click="openPackagePopup">
              <v-icon>search</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
      <v-col md="6" cols="12">
        <v-label>영업장</v-label>
        <v-select
          v-model="form.storeCds"
          :items="storeList"
          item-value="storeCd"
          item-text="storeNm"
          dense
          multiple
          required
          placeholder="영업장을 선택해 주세요."
          v-if="storeList.length > 0"
        >
          <template v-slot:prepend-item>
            <v-list-item @click="chooseAllStore">
              <v-list-item-action>
                <v-icon>{{ storeSelectIcon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>전체 영업장</v-list-item-content>
            </v-list-item>
          </template>
          <template v-slot:item="{ item, on }">
            <v-list-item v-on="on">
              <v-list-item-action>
                <v-icon>{{ getStoreSelectIcon(item) }}</v-icon>
              </v-list-item-action>
              <v-list-item-action>
                <v-chip x-small class="mr-1">{{ item.storeCd }}</v-chip>
              </v-list-item-action>
              <v-list-item-content>{{ item.storeNm }}</v-list-item-content>
            </v-list-item>
          </template>
          <template v-slot:selection="{ item, index }">
            <template v-if="index === 0">
              <template v-if="form.storeCds.length === storeList.length">
                <span>전체 영업장</span>
              </template>
              <template v-else>
                <v-chip x-small class="mt-1 mr-1">{{ item.storeCd }}</v-chip>
                <span class="body-2">{{ item.storeNm }}</span>
              </template>
            </template>
            <span
              v-if="form.storeCds.length !== storeList.length && index === 1"
              class="grey--text body-2 ml-1"
            >외 {{ form.storeCds.length - 1 }}개 영업장</span>
          </template>
        </v-select>
        <v-text-field dense disabled placeholder="먼저 패키지를 선택해 주세요." v-else></v-text-field>
      </v-col>
      <v-col md="6" cols="12">
        <v-label>객실유형</v-label>
        <v-text-field value="전체 객실유형" dense readonly></v-text-field>
      </v-col>
      <v-col md="6" cols="12">
        <v-label>조회기간 (최대 2주)</v-label>
        <date-range-picker v-model="form.dateRange" :min="minDate" :max="maxDate" dense required></date-range-picker>
      </v-col>
    </v-row>
    <div class="text-right">
      <v-btn outlined rounded color="primary" @click="selectRoomAmount">
        <v-icon left>search</v-icon>검색 (F3)
      </v-btn>
    </div>
    <!-- 검색 결과 -->
    <template v-if="packageRoomAmount !== null && packageRoomAmount.storeList.length > 0">
      <hr class="mt-6 mb-6" />
      <v-row dense>
        <v-col md="5" cols="12" class="pt-3">
          <span class="h3">패키지 요금 조회 결과</span>
        </v-col>
        <v-col md="7" cols="12" class="text-right">
          <v-btn
            outlined
            rounded
            color="primary"
            @click="prevSearch"
            :disabled="isAllowPrevSearch === false"
          >
            <v-icon left>mdi-arrow-left-bold</v-icon>이전 2주 조회
          </v-btn>
          <v-btn
            outlined
            rounded
            color="primary"
            @click="nextSearch"
            :disabled="isAllowNextSearch === false"
          >
            <v-icon left>mdi-arrow-right-bold</v-icon>다음 2주 조회
          </v-btn>
          <v-btn outlined rounded color="green" @click="downloadRoomAmountExcel">
            <v-icon left>dashboard</v-icon>엑셀 다운로드 (F2)
          </v-btn>
        </v-col>
      </v-row>
      <div v-for="store in packageRoomAmount.storeList" :key="store.storeCd">
        <v-card class="pl-3 pr-3">
          <v-row class="mt-6 mb-1">
            <v-col md="9" cols="12" class="text-md-left text-center">
              <v-chip x-small class="mr-1">{{ packageRoomAmount.searchParam.pkgNo }}</v-chip>
              <span class="body-2">{{ packageRoomAmount.searchParam.pkgNm }}</span>
              <span class="grey--text caption ml-2 mr-2">/</span>
              <v-chip x-small class="mr-1">{{ store.storeCd }}</v-chip>
              <span class="body-2">{{ store.storeNm}}</span>
            </v-col>
            <v-col md="3" cols="12" class="text-md-right text-center">
              <span class="body-2">{{ packageRoomAmount.searchParam.startYmd | date }} ~ {{ packageRoomAmount.searchParam.endYmd | date }}</span>
            </v-col>
          </v-row>
        </v-card>
        <v-data-table
          hide-default-footer
          hide-default-header
          disable-pagination
          class="bordered condensed"
        >
          <template v-slot:header>
            <thead class="thead_point">
            <tr class="row_divider">
              <th class="text-right fixed_column">객실유형</th>
              <th
                v-for="header in headers"
                :key="header.ymd"
                class="text-center"
                :class="header.dayClass"
              >
                {{ header.ymd | date('MM/DD') }}
                ({{ header.dayText }})
              </th>
            </tr>
            </thead>
          </template>
          <template v-slot:body>
            <tbody>
            <template v-for="packageRoomAmountItem in store.roomAmountList">
              <tr :key="packageRoomAmountItem.rmTypeCd">
                <td class="text-right fixed_column" :class="{ 'grey lighten-2 grey--text': !packageRoomAmountItem.amount }">
                  {{ packageRoomAmountItem.rmTypeNm }}
                </td>
                <template v-if="packageRoomAmountItem.amount">
                  <td class="text-right" v-for="(amountItem, amountYmd) in packageRoomAmountItem.amount" :key="amountYmd">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <div v-on="on">
                          <small class="grey--text">￦</small>
                          <strong class="primary--text">{{ amountItem.saleAmt | price }}</strong>
                        </div>
                      </template>
                      <span>판매가</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <div v-on="on">
                    <small class="grey--text">￦</small>
                    <strong class="grey--text">{{ amountItem.rcpmnyAmt | price }}</strong>
                    </div>
                      </template>
                      <span>입금가</span>
                    </v-tooltip>
                  </td>
                </template>
                <template v-else>
                  <td :colspan="headers.length" class="grey lighten-2 grey--text">
                    <span v-if="packageRoomAmountItem.existYn === 'N'">(판매하지 않는 객실유형)</span>
                    <span v-else>(조회된 요금 없음)</span>
                  </td>
                </template>
              </tr>
            </template>
            </tbody>
          </template>
        </v-data-table>
      </div>
    </template>
  </div>
</template>

<script>
import excelMixin from "Mixins/excelMixin"
import boardAmountService from "Api/modules/system/boardAmount.service"
import roomReservation from "Api/modules/ota/roomReservation.service"

export default {
  name: 'BoardPackageAmountView',
  mixins: [excelMixin],
  data () {
    return {
      /**
       * 검색 폼
       */
      form: {
        // 패키지번호
        pkgNo: null,
        // 패키지명
        pkgNm: null,
        // 영업장코드 목록
        storeCds: [],
        // 객실유형코드 목록
        rmTypeCds: [],
        // 조회기간
        dateRange: [
          moment(this.nowYmd).format('YYYYMMDD'),
          moment(this.nowYmd).add(14 - 1, 'days').format('YYYYMMDD')
        ]
      },
      /**
       * 영업장 목록
       */
      storeList: [],
      /**
       * 객실유형 목록
       */
      roomTypeList: [],
      /**
       * 패키지요금 데이터
       */
      packageRoomAmount: null,

      /**
       * 조회 기준일
       */
      dayRange: 14
    }
  },
  computed: {
    /**
     * 영업장 선택항목 체크박스 아이콘
     */
    storeSelectIcon () {
      if (this.storeList.length === this.form.storeCds.length) {
        return 'check_box'
      } else if (
        this.storeList.length > 0 &&
        this.form.storeCds.length > 0
      ) {
        return 'indeterminate_check_box'
      }
      return 'check_box_outline_blank'
    },
    /**
     * 오늘 일자
     */
    nowYmd () {
      return moment().format('YYYYMMDD')
    },
    /**
     * 조회기간 최소값
     */
    minDate () {
      return moment(this.nowYmd).format('YYYY-MM-DD')
    },
    /**
     * 조회기간 최대값
     */
    maxDate () {
      if (this.form.dateRange.length !== 2 || !this.form.dateRange[0]) {
        return moment(this.nowYmd).add(1, 'years').format('YYYY-MM-DD')
      }
      return moment(this.form.dateRange[0])
        .add(this.dayRange - 1, 'days')
        .format('YYYY-MM-DD')
    },
    /**
     * 이전 조회시작일 (moment 객체)
     */
    prevStartYmd () {
      let prevStartDate = null
      if (this.packageRoomAmount) {
        prevStartDate = moment(this.packageRoomAmount.searchParam.startYmd)
        const minDate = moment(this.minDate)
        prevStartDate = prevStartDate.subtract(this.dayRange, 'days')
        if (prevStartDate.isBefore(minDate)) {
          prevStartDate = minDate
        }
      }
      return prevStartDate ? prevStartDate.format('YYYYMMDD') : null
    },
    /**
     * 다음 조회시작일
     */
    prevEndYmd () {
      let prevEndDate = null
      if (this.prevStartYmd) {
        prevEndDate = moment(this.prevStartYmd).add(this.dayRange - 1, 'days')
      }
      return prevEndDate ? prevEndDate.format('YYYYMMDD') : null
    },
    /**
     * 이전 기간 검색 가능 여부
     */
    isAllowPrevSearch () {
      return (
        this.packageRoomAmount != null &&
        this.prevStartYmd !== this.packageRoomAmount.searchParam.startYmd &&
        moment(this.prevStartYmd).isSameOrAfter(moment(this.nowYmd))
      )
    },
    /**
     * 다음 조회시작일
     */
    nextStartYmd () {
      let nextStartDate = null
      if (this.nextEndYmd) {
        nextStartDate = moment(this.nextEndYmd).subtract(this.dayRange - 1, 'days')
      }
      return nextStartDate ? nextStartDate.format('YYYYMMDD') : null
    },
    /**
     * 다음 조회시작일
     */
    nextEndYmd () {
      let nextEndDate = null
      if (this.packageRoomAmount) {
        nextEndDate = moment(this.packageRoomAmount.searchParam.endYmd)
        const maxDate = moment(this.nowYmd).add(1, 'years')
        nextEndDate = nextEndDate.add(this.dayRange, 'days')
        if (nextEndDate.isAfter(maxDate)) {
          nextEndDate = maxDate
        }
      }
      return nextEndDate ? nextEndDate.format('YYYYMMDD') : null
    },
    /**
     * 다음 기간 검색 가능 여부
     */
    isAllowNextSearch () {
      return (
        this.nextEndYmd !== null &&
        this.nextEndYmd !== this.packageRoomAmount.searchParam.endYmd &&
        moment(this.nextStartYmd).isSameOrBefore(
          moment(this.nowYmd).add(1, 'years')
        )
      )
    },
    /**
     * 조회결과 테이블 헤더 목록
     */
    headers () {
      const headers = []
      if (this.packageRoomAmount) {
        const startDate = moment(this.packageRoomAmount.searchParam.startYmd)
        const endDate = moment(this.packageRoomAmount.searchParam.endYmd)
        let ymd = startDate.format('YYYYMMDD')
        while (ymd <= endDate.format('YYYYMMDD')) {
          const date = moment(ymd)
          headers.push({
            ymd,
            dayText: date.format('ddd'),
            dayClass: date.day() === 0 ? 'red--text' : date.day() === 6 ? 'blue--text' : null
          })
          ymd = date.add(1, 'days').format('YYYYMMDD')
        }
      }
      return headers
    }
  },
  mounted () {
    // key press event match
    const eventList = [
      {
        target: 'F3',
        action: this.selectRoomAmount
      },
      {
        target: 'F2',
        action: this.downloadRoomAmountExcel
      }
    ]
    this.$store.dispatch('keypress/addKeyEventList', { eventList })
  },
  methods: {
    /**
     * 패키지 조회
     */
    openPackagePopup () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/RoomReservation/popup/PackSearchPopup',
        params: {
          item: {
            pkgNo: null,
            groupFlag: 'ota'
          }
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 1400,
          closeCallback: async (params) => {
            if (params && params.data) {
              if (params.data.localCd) {
                this.$dialog.alert('네이버 패키지는 선택하실 수 없습니다.')
                this.form.pkgNo = null
                this.form.pkgNm = null
                return false
              }
              this.form.pkgNo = params.data.pkgNo
              this.form.pkgNm = params.data.pkgNm
              await this.selectPackageStoreList()
            }
          }
        }
      })
    },
    /**
     * 패키지의 영업장 목록 조회
     */
    async selectPackageStoreList () {
      this.form.storeCds = []
      const params = {
        pkgNo: this.form.pkgNo,
        useYn: 'Y'
      }
      const res = await roomReservation.selectStoreInfoByPkgNo(params)
      this.storeList = res.data
      this.chooseAllStore()
    },
    /**
     * 모든 영업장 선택
     */
    chooseAllStore () {
      if (!this.storeList || this.storeList.length === 0) {
        return false
      }
      if (this.form.storeCds.length > 0) {
        this.form.storeCds = []
      } else {
        this.form.storeCds = []
        this.storeList.forEach((store) => {
          this.form.storeCds.push(store.storeCd)
        })
      }
    },
    /**
     * 영업장 선택 아이콘 가져오기
     */
    getStoreSelectIcon (item) {
      let isSelected = false
      if (this.form.storeCds) {
        this.form.storeCds.some((storeCd) => {
          if (storeCd === item.storeCd) {
            isSelected = true
          }
          return isSelected
        })
      }
      return isSelected === true ? 'check_box' : 'check_box_outline_blank'
    },
    /**
     * 객실 요금 조회
     */
    async selectRoomAmount () {
      // 패키지번호 확인
      if (!this.form.pkgNo) {
        this.$dialog.alert('패키지를 선택해 주세요.')
        return
      }
      // 영업장
      if (this.form.storeCds.length === 0) {
        this.$dialog.alert('영업장을 하나 이상 선택해 주세요.')
        return
      }
      // 조회기간
      if (this.form.dateRange.length !== 2) {
        this.$dialog.alert('조회기간을 선택해 주세요.')
        return
      }
      if (!this.form.dateRange[0]) {
        this.$dialog.alert('조회시작기간을 선택해 주세요.')
        return
      }
      if (!this.form.dateRange[1]) {
        this.$dialog.alert('조회종료기간을 선택해 주세요.')
        return
      }
      this.packageRoomAmount = null
      const searchParam = {
        pkgNo: this.form.pkgNo,
        storeCds: this.form.storeCds.join(','),
        startYmd: this.form.dateRange[0],
        endYmd: this.form.dateRange[1]
      }
      await this.selectBoardPackageRoomAmount(
        searchParam,
        this.form.pkgNm
      )
    },
    /**
     * 이전 기간으로 검색
     */
    prevSearch () {
      if (this.isAllowPrevSearch === true) {
        const searchParam = {
          pkgNo: this.packageRoomAmount.searchParam.pkgNo,
          storeCds: this.packageRoomAmount.searchParam.storeCds,
          startYmd: this.prevStartYmd,
          endYmd: this.prevEndYmd
        }
        this.selectBoardPackageRoomAmount(
          searchParam,
          this.packageRoomAmount.searchParam.pkgNm
        )
      }
    },
    /**
     * 다음 기간으로 검색
     */
    nextSearch () {
      if (this.isAllowNextSearch === true) {
        const searchParam = {
          pkgNo: this.packageRoomAmount.searchParam.pkgNo,
          storeCds: this.packageRoomAmount.searchParam.storeCds,
          startYmd: this.nextStartYmd,
          endYmd: this.nextEndYmd
        }
        this.selectBoardPackageRoomAmount(
          searchParam,
          this.packageRoomAmount.searchParam.pkgNm
        )
      }
    },
    /**
     * 패키지 요금 조회
     */
    async selectBoardPackageRoomAmount (searchParam, pkgNm) {
      const res = await boardAmountService.selectBoardPackageRoomAmount({
        q: searchParam
      })
      searchParam.pkgNm = pkgNm
      this.packageRoomAmount = Object.assign(
        {},
        {
          roomAmountList: [],
          searchParam
        },
        res.data
      )
    },
    /**
     * 패키지 요금 엑셀 다운로드
     */
    async downloadRoomAmountExcel () {
      this.downLoadExcel(
        '/api/system/board/amount/package/room/excel',
        '패키지 요금 조회',
        {
          q: this.packageRoomAmount.searchParam
        }
      )
    }
  }
}
</script>

<style scoped>
.v-data-table >>> td:not(.fixed_column) {
  z-index: 3;
}

.v-data-table >>> .thead_point td:not(.fixed_column),
.v-data-table >>> .thead_point th:not(.fixed_column) {
  z-index: 6 !important;
  background-color: #fafafa !important;
}

.v-data-table >>> .fixed_column {
  position: sticky;
  left: 0;
  z-index: 7 !important;
  background: #fafafa;
  text-align: center;
  font-weight: 700 !important;
  border-right: 1px solid #ccc !important;
}
</style>
