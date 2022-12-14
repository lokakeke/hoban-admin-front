<template>
  <div>
    <v-row>
      <v-col md="6" cols="12">
        <v-label>회원</v-label>
        <v-text-field
          :value="form.memberName"
          hide-details
          dense
          readonly
          placeholder="클릭하여 회원을 선택해 주세요."
          @click="openPartnerInfo"
        >
          <template v-slot:prepend-inner>
            <v-chip x-small class="mt-2" v-if="form.memberNo">{{ form.memberNo }}</v-chip>
          </template>
          <template v-slot:append>
            <v-btn icon small color="primary" tabindex="-1" @click="openPartnerInfo">
              <v-icon>search</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
      <v-col md="6" cols="12">
        <v-label>영업장</v-label>
        <v-text-field
          :value="form.storeName"
          hide-details
          dense
          readonly
          placeholder="클릭하여 영업장을 선택해 주세요."
          @click="openStorePopup"
        >
          <template v-slot:prepend-inner>
            <v-chip x-small class="mt-2" v-if="form.storeCode">{{ form.storeCode }}</v-chip>
          </template>
          <template v-slot:append>
            <v-btn icon small color="primary" tabindex="-1" @click="openStorePopup">
              <v-icon>search</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
      <v-col md="6" cols="12">
        <v-label>객실유형</v-label>
        <v-select
          v-model="form.roomTypeCodes"
          :items="roomTypeList"
          item-value="roomTypeCode"
          item-text="rmTypeName"
          multiple
          required
          placeholder="객실유형을 선택해 주세요."
          v-if="roomTypeList.length > 0"
        >
          <template v-slot:prepend-item>
            <v-list-item @click="chooseAllRoomType">
              <v-list-item-action>
                <v-icon>{{ roomTypeSelectIcon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>전체 객실유형</v-list-item-content>
            </v-list-item>
          </template>
          <template v-slot:item="{ item, on }">
            <v-list-item v-on="on">
              <v-list-item-action>
                <v-icon>{{ getRoomTypeSelectIcon(item) }}</v-icon>
              </v-list-item-action>
              <v-list-item-action>
                <v-chip x-small class="mr-1">{{ item.roomTypeCode }}</v-chip>
              </v-list-item-action>
              <v-list-item-content>{{ item.rmTypeName }}</v-list-item-content>
            </v-list-item>
          </template>
          <template v-slot:selection="{ item, index }">
            <template v-if="index === 0">
              <template v-if="form.roomTypeCodes.length === roomTypeList.length">
                <span>전체 객실유형</span>
              </template>
              <template v-else>
                <v-chip x-small class="mt-1 mr-1">{{ item.roomTypeCode }}</v-chip>
                <span class="body-2">{{ item.rmTypeName }}</span>
              </template>
            </template>
            <span
              v-if="form.roomTypeCodes.length !== roomTypeList.length && index === 1"
              class="grey--text body-2 ml-1"
            >외 {{ form.roomTypeCodes.length - 1 }}개 객실유형</span>
          </template>
        </v-select>
        <v-text-field disabled placeholder="먼저 영업장을 선택해 주세요." v-else></v-text-field>
      </v-col>
      <v-col md="6" cols="12">
        <v-label>조회기간 (최대 2주)</v-label>
        <date-range-picker v-model="form.dateRange" :min="minDate" :max="maxDate" required></date-range-picker>
      </v-col>
    </v-row>
    <div class="text-right">
      <v-btn outlined rounded color="primary" @click="search">
        <v-icon left>search</v-icon>검색 (F3)
      </v-btn>
    </div>
    <!-- 검색 결과 -->
    <template v-if="roomAmount !== null && roomAmount.roomAmountList.length > 0">
      <hr class="mt-6 mb-6" />
      <v-row dense>
        <v-col md="5" cols="12" class="pt-3">
          <span class="h3">객실 요금 조회 결과</span>
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
      <v-card class="pl-3 pr-3">
        <v-row class="mt-6 mb-1">
          <v-col md="9" cols="12" class="text-md-left text-center">
            <v-chip x-small class="mr-1">{{ roomAmount.searchParam.memberNo }}</v-chip>
            <span class="body-2">{{ roomAmount.searchParam.memberName }}</span>
            <span class="grey--text caption ml-2 mr-2">/</span>
            <v-chip x-small class="mr-1">{{ roomAmount.searchParam.storeCode }}</v-chip>
            <span class="body-2">{{ roomAmount.searchParam.storeName}}</span>
          </v-col>
          <v-col md="3" cols="12" class="text-md-right text-center">
            <span
              class="body-2"
            >{{ roomAmount.searchParam.startDate | date }} ~ {{ roomAmount.searchParam.endDate | date }}</span>
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
            <template v-for="roomAmountItem in roomAmount.roomAmountList">
              <tr :key="roomAmountItem.roomTypeCode">
                <td
                  class="text-right fixed_column"
                  :class="{ 'grey lighten-2 grey--text': !roomAmountItem.amount }"
                >{{ roomAmountItem.rmTypeName }}</td>
                <template v-if="roomAmountItem.amount">
                  <td
                    class="text-right"
                    v-for="(amountItem, amountYmd) in roomAmountItem.amount"
                    :key="amountYmd"
                  >
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <div v-on="on">
                          <small class="grey--text">￦</small>
                          <strong class="primary--text">{{ amountItem.totalPrice | price }}</strong>
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
                    <span v-if="roomAmountItem.existYn === 'N'">(판매하지 않는 객실유형)</span>
                    <span v-else>(조회된 요금 없음)</span>
                  </td>
                </template>
              </tr>
            </template>
          </tbody>
        </template>
      </v-data-table>
    </template>
    <template v-else-if="roomAmount !== null && roomAmount.listMaxLength === 0">
      <hr class="mt-6 mb-6" />
      <h3 class="grey--text text-center mt-12 mb-12">조회된 객실 요금이 없습니다.</h3>
    </template>
  </div>
</template>

<script>
import excelMixin from '@/mixins/excelMixin'
import boardAmountService from '@/api/modules/system/boardAmount.service'
import roomTypeService from '@/api/modules/ota/roomType.service'

export default {
  name: 'BoardRoomAmountView',
  mixins: [excelMixin],
  data () {
    return {
      /**
       * 검색 폼
       */
      form: {
        // 회원번호
        memberNo: null,
        // 회원명
        memberName: null,
        // 영업장코드
        storeCode: null,
        // 영업장명
        storeName: null,
        // 객실유형코드 목록
        roomTypeCodes: [],
        // 조회기간
        dateRange: [
          moment(this.nowDate).format('YYYYMMDD'),
          moment(this.nowDate).add(14 - 1, 'days').format('YYYYMMDD')
        ]
      },
      /**
       * 객실유형 목록
       */
      roomTypeList: [],
      /**
       * 객실요금 데이터
       */
      roomAmount: null,
      /**
       * 조회 기준일
       */
      dayRange: 14
    }
  },
  computed: {
    /**
     * 객실유형 선택항목 체크박스 아이콘
     */
    roomTypeSelectIcon () {
      if (this.roomTypeList.length === this.form.roomTypeCodes.length) {
        return 'check_box'
      } else if (
        this.roomTypeList.length > 0 &&
        this.form.roomTypeCodes.length > 0
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
      if (this.roomAmount) {
        prevStartDate = moment(this.roomAmount.searchParam.startDate)
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
        this.roomAmount != null &&
        this.prevStartDate !== this.roomAmount.searchParam.startDate &&
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
      if (this.roomAmount) {
        nextEndDate = moment(this.roomAmount.searchParam.endDate)
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
        this.nextEndDate !== this.roomAmount.searchParam.endDate &&
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
      if (this.roomAmount) {
        const startDate = moment(this.roomAmount.searchParam.startDate)
        const endDate = moment(this.roomAmount.searchParam.endDate)
        let ymd = startDate.format('YYYYMMDD')
        while (ymd <= endDate.format('YYYYMMDD')) {
          const date = moment(ymd)
          headers.push({
            ymd,
            dayText: date.format('ddd'),
            dayClass:
              date.day() === 0
                ? 'red--text'
                : date.day() === 6
                  ? 'blue--text'
                  : null
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
        action: this.search
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
     * 회원 조회
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
          width: 1400,
          closeCallback: (params) => {
            if (params && params.data) {
              this.form.memberNo = params.data.memberNo
              this.form.memberName = params.data.memberName
            }
          }
        }
      })
    },
    /**
     * 영업장 검색창 오픈
     */
    openStorePopup () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/RoomReservation/popup/StoreSearchPopup',
        params: {
          item: {
            itemInfo: {},
            isSearch: true,
            roomType: { text: '객실', value: 'OTA_ROOM_API' }
          }
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 900,
          closeCallback: (params) => {
            if (params && params.data) {
              this.form.storeCode = params.data.storeCode
              this.form.storeName = params.data.storeName
              this.selectStoreRoomUseList()
            }
          }
        }
      })
    },
    /**
     * 영업장의 객실유형 목록 조회
     */
    async selectStoreRoomUseList () {
      this.form.roomTypeCodes = []
      const res = await roomTypeService.selectStoreRoomUseList(this.form.storeCode)
      this.roomTypeList = res.data
      this.chooseAllRoomType()
    },
    /**
     * 객실 요금 조회
     */
    async search () {
      // 회원번호 확인
      if (!this.form.memberNo) {
        this.$dialog.alert('회원을 선택해 주세요.')
        return
      }
      // 영업장코드
      if (!this.form.storeCode) {
        this.$dialog.alert('영업장을 선택해 주세요.')
        return
      }
      // 객실유형
      if (this.form.roomTypeCodes.length === 0) {
        this.$dialog.alert('객실유형을 하나 이상 선택해 주세요.')
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
      this.roomAmount = null
      const searchParam = {
        memberNo: this.form.memberNo,
        storeCode: this.form.storeCode,
        roomTypeCodes: this.form.roomTypeCodes.join(','),
        startDate: this.form.dateRange[0],
        endDate: this.form.dateRange[1]
      }
      await this.selectBoardRoomAmount(
        searchParam,
        this.form.memberName,
        this.form.storeName
      )
    },
    /**
     * 이전 기간으로 검색
     */
    prevSearch () {
      if (this.isAllowPrevSearch === true) {
        const searchParam = {
          memberNo: this.roomAmount.searchParam.memberNo,
          storeCode: this.roomAmount.searchParam.storeCode,
          roomTypeCodes: this.roomAmount.searchParam.roomTypeCodes,
          startDate: this.prevStartDate,
          endDate: this.prevEndDate
        }
        this.selectBoardRoomAmount(
          searchParam,
          this.roomAmount.searchParam.memberName,
          this.roomAmount.searchParam.storeName
        )
      }
    },
    /**
     * 다음 기간으로 검색
     */
    nextSearch () {
      if (this.isAllowNextSearch === true) {
        const searchParam = {
          memberNo: this.roomAmount.searchParam.memberNo,
          storeCode: this.roomAmount.searchParam.storeCode,
          roomTypeCodes: this.roomAmount.searchParam.roomTypeCodes,
          startDate: this.nextStartDate,
          endDate: this.nextEndDate
        }
        this.selectBoardRoomAmount(
          searchParam,
          this.roomAmount.searchParam.memberName,
          this.roomAmount.searchParam.storeName
        )
      }
    },
    /**
     * 객실 요금 조회
     */
    async selectBoardRoomAmount (searchParam, memberName, storeName) {
      const res = await boardAmountService.selectBoardRoomAmount({
        q: searchParam
      })
      searchParam.memberName = memberName
      searchParam.storeName = storeName
      this.roomAmount = Object.assign(
        {},
        {
          listMaxLength: 0,
          roomAmountList: [],
          searchParam
        },
        res.data
      )
    },
    /**
     * 객실 요금 엑셀 다운로드
     */
    async downloadRoomAmountExcel () {
      this.downLoadExcel(
        '/api/cms/system/board/amount/room/excel',
        '객실 요금 조회',
        {
          q: this.roomAmount.searchParam
        }
      )
    },
    /**
     * 모든 객실유형 선택
     */
    chooseAllRoomType () {
      if (!this.roomTypeList || this.roomTypeList.length === 0) {
        return false
      }
      if (this.form.roomTypeCodes.length > 0) {
        this.form.roomTypeCodes = []
      } else {
        this.form.roomTypeCodes = []
        this.roomTypeList.forEach((roomType) => {
          this.form.roomTypeCodes.push(roomType.roomTypeCode)
        })
      }
    },
    /**
     * 객실유형 선택 아이콘 가져오기
     */
    getRoomTypeSelectIcon (item) {
      let isSelected = false
      if (this.form.roomTypeCodes) {
        this.form.roomTypeCodes.some((roomTypeCode) => {
          if (roomTypeCode === item.roomTypeCode) {
            isSelected = true
          }
          return isSelected
        })
      }
      return isSelected === true ? 'check_box' : 'check_box_outline_blank'
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
