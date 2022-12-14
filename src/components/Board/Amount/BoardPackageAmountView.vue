<template>
  <div>
    <v-row>
      <v-col md="6" cols="12">
        <v-label>패키지</v-label>
        <v-text-field
          :value="form.packageName"
          hide-details
          dense
          readonly
          placeholder="클릭하여 패키지를 선택해 주세요."
          @click="openPackagePopup"
        >
          <template v-slot:prepend-inner>
            <v-chip x-small class="mt-2" v-if="form.packageNo">{{ form.packageNo }}</v-chip>
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
          v-model="form.storeCodes"
          :items="storeList"
          item-value="storeCode"
          item-text="storeName"
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
                <v-chip x-small class="mr-1">{{ item.storeCode }}</v-chip>
              </v-list-item-action>
              <v-list-item-content>{{ item.storeName }}</v-list-item-content>
            </v-list-item>
          </template>
          <template v-slot:selection="{ item, index }">
            <template v-if="index === 0">
              <template v-if="form.storeCodes.length === storeList.length">
                <span>전체 영업장</span>
              </template>
              <template v-else>
                <v-chip x-small class="mt-1 mr-1">{{ item.storeCode }}</v-chip>
                <span class="body-2">{{ item.storeName }}</span>
              </template>
            </template>
            <span
              v-if="form.storeCodes.length !== storeList.length && index === 1"
              class="grey--text body-2 ml-1"
            >외 {{ form.storeCodes.length - 1 }}개 영업장</span>
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
      <div v-for="store in packageRoomAmount.storeList" :key="store.storeCode">
        <v-card class="pl-3 pr-3">
          <v-row class="mt-6 mb-1">
            <v-col md="9" cols="12" class="text-md-left text-center">
              <v-chip x-small class="mr-1">{{ packageRoomAmount.searchParam.packageNo }}</v-chip>
              <span class="body-2">{{ packageRoomAmount.searchParam.packageName }}</span>
              <span class="grey--text caption ml-2 mr-2">/</span>
              <v-chip x-small class="mr-1">{{ store.storeCode }}</v-chip>
              <span class="body-2">{{ store.storeName}}</span>
            </v-col>
            <v-col md="3" cols="12" class="text-md-right text-center">
              <span class="body-2">{{ packageRoomAmount.searchParam.startDate | date }} ~ {{ packageRoomAmount.searchParam.endDate | date }}</span>
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
              <tr :key="packageRoomAmountItem.rmTypeCode">
                <td class="text-right fixed_column" :class="{ 'grey lighten-2 grey--text': !packageRoomAmountItem.amount }">
                  {{ packageRoomAmountItem.rmTypeName }}
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
import excelMixin from '@/mixins/excelMixin'
import boardAmountService from '@/api/modules/system/boardAmount.service'
import roomReservation from '@/api/modules/ota/roomReservation.service'

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
        packageNo: null,
        // 패키지명
        packageName: null,
        // 영업장코드 목록
        storeCodes: [],
        // 객실유형코드 목록
        roomTypeCodes: [],
        // 조회기간
        dateRange: [
          moment(this.nowDate).format('YYYYMMDD'),
          moment(this.nowDate).add(14 - 1, 'days').format('YYYYMMDD')
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
      if (this.storeList.length === this.form.storeCodes.length) {
        return 'check_box'
      } else if (
        this.storeList.length > 0 &&
        this.form.storeCodes.length > 0
      ) {
        return 'indeterminate_check_box'
      }
      return 'check_box_outline_blank'
    },
    /**
     * 오늘 일자
     */
    nowDate () {
      return moment().format('YYYYMMDD')
    },
    /**
     * 조회기간 최소값
     */
    minDate () {
      return moment(this.nowDate).format('YYYY-MM-DD')
    },
    /**
     * 조회기간 최대값
     */
    maxDate () {
      if (this.form.dateRange.length !== 2 || !this.form.dateRange[0]) {
        return moment(this.nowDate).add(1, 'years').format('YYYY-MM-DD')
      }
      return moment(this.form.dateRange[0])
        .add(this.dayRange - 1, 'days')
        .format('YYYY-MM-DD')
    },
    /**
     * 이전 조회시작일 (moment 객체)
     */
    prevStartDate () {
      let prevStartDate = null
      if (this.packageRoomAmount) {
        prevStartDate = moment(this.packageRoomAmount.searchParam.startDate)
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
    prevEndDate () {
      let prevEndDate = null
      if (this.prevStartDate) {
        prevEndDate = moment(this.prevStartDate).add(this.dayRange - 1, 'days')
      }
      return prevEndDate ? prevEndDate.format('YYYYMMDD') : null
    },
    /**
     * 이전 기간 검색 가능 여부
     */
    isAllowPrevSearch () {
      return (
        this.packageRoomAmount != null &&
        this.prevStartDate !== this.packageRoomAmount.searchParam.startDate &&
        moment(this.prevStartDate).isSameOrAfter(moment(this.nowDate))
      )
    },
    /**
     * 다음 조회시작일
     */
    nextStartDate () {
      let nextStartDate = null
      if (this.nextEndDate) {
        nextStartDate = moment(this.nextEndDate).subtract(this.dayRange - 1, 'days')
      }
      return nextStartDate ? nextStartDate.format('YYYYMMDD') : null
    },
    /**
     * 다음 조회시작일
     */
    nextEndDate () {
      let nextEndDate = null
      if (this.packageRoomAmount) {
        nextEndDate = moment(this.packageRoomAmount.searchParam.endDate)
        const maxDate = moment(this.nowDate).add(1, 'years')
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
        this.nextEndDate !== null &&
        this.nextEndDate !== this.packageRoomAmount.searchParam.endDate &&
        moment(this.nextStartDate).isSameOrBefore(
          moment(this.nowDate).add(1, 'years')
        )
      )
    },
    /**
     * 조회결과 테이블 헤더 목록
     */
    headers () {
      const headers = []
      if (this.packageRoomAmount) {
        const startDate = moment(this.packageRoomAmount.searchParam.startDate)
        const endDate = moment(this.packageRoomAmount.searchParam.endDate)
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
            packageNo: null,
            groupFlag: 'ota'
          }
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 1400,
          closeCallback: async (params) => {
            if (params && params.data) {
              if (params.data.localCode) {
                this.$dialog.alert('네이버 패키지는 선택하실 수 없습니다.')
                this.form.packageNo = null
                this.form.packageName = null
                return false
              }
              this.form.packageNo = params.data.packageNo
              this.form.packageName = params.data.packageName
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
      this.form.storeCodes = []
      const params = {
        packageNo: this.form.packageNo,
        useYn: 'Y'
      }
      const res = await roomReservation.selectStoreInfoByPackageNo(params)
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
      if (this.form.storeCodes.length > 0) {
        this.form.storeCodes = []
      } else {
        this.form.storeCodes = []
        this.storeList.forEach((store) => {
          this.form.storeCodes.push(store.storeCode)
        })
      }
    },
    /**
     * 영업장 선택 아이콘 가져오기
     */
    getStoreSelectIcon (item) {
      let isSelected = false
      if (this.form.storeCodes) {
        this.form.storeCodes.some((storeCode) => {
          if (storeCode === item.storeCode) {
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
      if (!this.form.packageNo) {
        this.$dialog.alert('패키지를 선택해 주세요.')
        return
      }
      // 영업장
      if (this.form.storeCodes.length === 0) {
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
        packageNo: this.form.packageNo,
        storeCodes: this.form.storeCodes.join(','),
        startDate: this.form.dateRange[0],
        endDate: this.form.dateRange[1]
      }
      await this.selectBoardPackageRoomAmount(
        searchParam,
        this.form.packageName
      )
    },
    /**
     * 이전 기간으로 검색
     */
    prevSearch () {
      if (this.isAllowPrevSearch === true) {
        const searchParam = {
          packageNo: this.packageRoomAmount.searchParam.packageNo,
          storeCodes: this.packageRoomAmount.searchParam.storeCodes,
          startDate: this.prevStartDate,
          endDate: this.prevEndDate
        }
        this.selectBoardPackageRoomAmount(
          searchParam,
          this.packageRoomAmount.searchParam.packageName
        )
      }
    },
    /**
     * 다음 기간으로 검색
     */
    nextSearch () {
      if (this.isAllowNextSearch === true) {
        const searchParam = {
          packageNo: this.packageRoomAmount.searchParam.packageNo,
          storeCodes: this.packageRoomAmount.searchParam.storeCodes,
          startDate: this.nextStartDate,
          endDate: this.nextEndDate
        }
        this.selectBoardPackageRoomAmount(
          searchParam,
          this.packageRoomAmount.searchParam.packageName
        )
      }
    },
    /**
     * 패키지 요금 조회
     */
    async selectBoardPackageRoomAmount (searchParam, packageName) {
      const res = await boardAmountService.selectBoardPackageRoomAmount({
        q: searchParam
      })
      searchParam.packageName = packageName
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
        '/api/cms/system/board/amount/package/room/excel',
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
