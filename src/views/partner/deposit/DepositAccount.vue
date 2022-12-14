<template>
  <v-row wrap>
    <app-card heading="예치금 계좌 리스트" col-classes="col-12">
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
        @click:row="openDialog"
        class="click-row bordered"
      >
        <!-- 증권-입금현황 -->
        <template v-slot:[`item.insurancePrice`]="{item}">
          <span class="red--text">{{item.insurancePrice | price}}원</span>
        </template>
        <!-- 기타-입금현황 -->
        <template v-slot:[`item.uninsurancePrice`]="{item}">
          <span class="red--text">{{item.uninsurancePrice | price}}원</span>
        </template>
        <!-- 출금현황 -->
        <template v-slot:[`item.accmltWithdrawPrice`]="{item}">
          <span class="blue--text">{{item.accmltWithdrawPrice | price}}원</span>
        </template>
        <!-- 금액 -->
        <template v-slot:[`item.price`]="{item}">
          <strong>{{item.price | price}}원</strong>
        </template>
        <!-- 사용여부 -->
        <template v-slot:[`item.useYn`]="{item}">
          <strong class="info--text" v-if="item.useYn === 'Y'"><v-icon small color="info" left>mdi-check</v-icon>사용</strong>
          <strong class="error--text" v-else><v-icon small color="error" left>mdi-close</v-icon>사용안함</strong>
        </template>
        <!-- 등록일시 -->
        <template v-slot:[`item.createDatetime`]="{item}">{{item.createDatetime | dateSet}}</template>
      </v-data-table>
      <v-row>
        <v-col cols="12" class="text-right pb-0">
          <v-btn outlined rounded color="info" @click="openDialog" v-if="writeAuth">
            <v-icon left>add</v-icon>예치금 계좌 등록
          </v-btn>
        </v-col>
      </v-row>
      <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
    </app-card>
  </v-row>
</template>

<script>
import depositAccountService from '@/api/modules/api/depositAccount.service'

export default {
  name: 'DepositAccount',
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      list: [],
      headers: [
        {
          text: '예치금 KEY',
          value: 'depositKey',
          align: 'center',
          sortable: false
        },
        { text: '파트너명', value: 'partnerName', align: 'center', sortable: false },
        { text: '업무유형명', value: 'taskTypeName', align: 'center', sortable: false },
        {
          text: '증권-입금현황',
          value: 'insurancePrice',
          align: 'center',
          sortable: false
        },
        {
          text: '기타-입금현황',
          value: 'uninsurancePrice',
          align: 'center',
          sortable: false
        },
        {
          text: '출금현황',
          value: 'accmltWithdrawPrice',
          align: 'center',
          sortable: false
        },
        { text: '예치금', value: 'price', align: 'center', sortable: false },
        { text: '사용여부', value: 'useYn', align: 'center', sortable: false },
        { text: '등록일시', value: 'createDatetime', align: 'center', sortable: false }
      ]
    }
  },
  computed: {
    searchList () {
      const searchList = [
        { key: 'depositKey', label: '예치금 KEY', type: 'text', cols: 2 },
        { key: 'partnerName', label: '파트너명', type: 'text', cols: 2 },
        { key: 'agentCode', label: 'agent코드', type: 'text', cols: 2 },
        { key: 'useYn', label: '사용여부', type: 'boolean', cols: 2 }
      ]
      if (this.isPartner) {
        // 파트너의 경우 파트너명 검색을 제거
        searchList.splice(1, 1)
      }
      return searchList
    }
  },
  methods: {
    /**
     * 검색
     */
    search () {
      if (this.$route.path.indexOf('/social') === 0) {
        this.searchParam.q.taskType = 'SOCIAL'
      } else if (this.$route.path.indexOf('/ota') === 0) {
        this.searchParam.q.taskType = 'OTA'
      }
      const searchParam = _.cloneDeep(this.searchParam)
      if (this.searchParam.q.useYn === true) {
        searchParam.q.useYn = 'Y'
      } else if (this.searchParam.q.useYn === false) {
        searchParam.q.useYn = 'N'
      }
      depositAccountService.selectDepositAccountList(searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = res.pagination.total
      })
    },
    /**
     * 등록/수정 Dialog 열기
     */
    openDialog (item = {}) {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Api/Deposit/DepositAccountDialog',
        params: {
          item
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
