<template>
  <v-row wrap>
    <app-card heading="예치금 이력 리스트" col-classes="col-12">
      <search-form
        :search-param.sync="searchParam"
        :search-list="searchList"
        @search="search"
        init-search
      ></search-form>
      <v-data-table
        :no-data-text="emptyText"
        :headers="headers"
        :items="list"
        disable-sort
        hide-default-footer
        disable-pagination
        @click:row="open"
        class="click-row bordered"
      >
        <!-- 입금예정일 -->
        <template v-slot:[`item.dipositPlanDate`]="{item}">
          {{item.dipositPlanDate | date}}
        </template>
        <!-- 금액 -->
        <template v-slot:[`item.price`]="{item}">
          <span :class="item.price > 0 ? 'red--text' : 'blue--text'">{{item.price | price}}원</span>
        </template>
        <!-- 변경 후 금액 -->
        <template v-slot:[`item.originPrice`]="{item}">
          <strong>{{item.originPrice | price}}원</strong>
        </template>
        <!-- 이용일자 -->
        <template v-slot:[`item.checkInDate`]="{item}">
          {{item.checkInDate | date}}
        </template>
        <!-- 등록일시 -->
        <template v-slot:[`item.createDatetime`]="{item}">
          {{item.createDatetime | dateSet}}
        </template>
        <!-- 승인일시 -->
        <template v-slot:[`item.processDatetime`]="{item}">
          {{item.processDatetime | dateSet}}
        </template>
      </v-data-table>
      <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
    </app-card>
  </v-row>
</template>

<script>
import service from '@/api/modules/api/depositHistory.service'

export default {
  name: 'DepositHistory',
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      list: []
    }
  },
  computed: {
    headers () {
      const headers = [
        { text: '이력순번', value: 'historySeq', align: 'center', sortable: false },
        { text: '예치금KEY', value: 'depositKey', align: 'center', sortable: false },
        { text: '파트너명', value: 'partnerName', align: 'center', sortable: false },
        { text: '금액구분', value: 'rsvTypeName', align: 'center', sortable: false },
        { text: '금액', value: 'price', align: 'center', sortable: false },
        { text: '변경 후 금액', value: 'originPrice', align: 'center', sortable: false }
      ]
      if (this.$route.path.indexOf('/ticket') === 0) {
        // 소셜
        headers.push({ text: '우대번호', value: 'ticketNo', align: 'center', sortable: false })
        headers.push({ text: '우대순번', value: 'ticketSeq', align: 'center', sortable: false })
        headers.push({ text: '업체번호', value: 'partnerRsvNo', align: 'center', sortable: false })
      } else if (this.$route.path.indexOf('/ota') === 0) {
        // OTA
        headers.push({ text: '회원번호', value: 'memberNo', align: 'center', sortable: false })
        headers.push({ text: '예약번호', value: 'rsvNo', align: 'center', sortable: false })
        headers.push({ text: '예약KEY번호', value: 'keyRsvNo', align: 'center', sortable: false })
        headers.push({ text: '이용일자', value: 'checkInDate', align: 'center', sortable: false })
      }
      headers.push({ text: '처리일자', value: 'createDatetime', align: 'center', sortable: false })
      return headers
    },
    searchList () {
      const searchList = []
      searchList.push({ key: 'depositKey', label: '예치금 KEY', type: 'text', cols: 2 })
      searchList.push({ key: 'partnerName', label: '파트너명', type: 'text', cols: 2 })
      searchList.push({ key: 'rsvType', label: '금액구분', type: 'code', commonCode: 'COMM0005', cols: 2 })

      if (this.$route.path.indexOf('/ticket') === 0) {
        searchList.push({ key: 'ticketNo', label: '우대번호', type: 'text', cols: 2 })
      } else if (this.$route.path.indexOf('/ota') === 0) {
        searchList.push({ key: 'rsvNo', label: '예약번호', type: 'text', cols: 2 })
        searchList.push({ key: 'keyRsvNo', label: '예약KEY번호', type: 'text', cols: 2 })
      }
      searchList.push({ key: 'createDatetime', label: '처리일자', format: 'YYYYMMDD', type: 'dateRange', startField: 'createDatetimeStart', endField: 'createDatetimeEnd', cols: 2 })
      /*
      searchList.push({
        key: 'useYn',
        label: '초기화 여부',
        type: 'select',
        list: [
          { text: '초기화 후 데이터(현재)', value: 'N' },
          { text: '초기화 전 데이터', value: 'Y' }
        ],
        cols: 2
      })
         */

      if (this.isPartner) {
        // 파트너의 경우 파트너명 검색을 제거
        searchList.splice(1, 1)
      }
      return searchList
    }
  },
  methods: {
    search () {
      if (this.$route.path.indexOf('/ticket') === 0) {
        this.searchParam.q.taskType = 'TICKET'
      } else if (this.$route.path.indexOf('/ota') === 0) {
        this.searchParam.q.taskType = 'OTA'
      }
      // 조회
      service.selectDepositHistoryList(this.searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = res.pagination.total
      })
    },
    open (row) {
      let isNew = true
      let item = {}
      if (row) {
        isNew = false
        item = row
      }

      let path = ''
      if (this.searchParam.q.taskType === 'OTA') {
        path = '/Api/Deposit/DepositBookingHistoryDialog'
      } else if (this.searchParam.q.taskType === 'TICKET') {
        path = '/Api/Deposit/DepositTicketHistoryDialog'
      } else {
      }

      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: path,
        params: {
          isNew,
          item,
          search: this.search
        },
        options: {
          fullscreen: true,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          closeCallback: () => {
            this.search()
          }
        }
      })
    }
  }
}
</script>
