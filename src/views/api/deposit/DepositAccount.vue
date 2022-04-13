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
                <template v-slot:[`item.insuranceAmt`]="{item}">
                    <span class="red--text">{{ item.insuranceAmt | price }}원</span>
                </template>
                <!-- 기타-입금현황 -->
                <template v-slot:[`item.uninsuranceAmt`]="{item}">
                    <span class="red--text">{{ item.uninsuranceAmt | price }}원</span>
                </template>
                <!-- 출금현황 -->
                <template v-slot:[`item.accmltWithdrawAmt`]="{item}">
                    <span class="blue--text">{{ item.accmltWithdrawAmt | price }}원</span>
                </template>
                <!-- 금액 -->
                <template v-slot:[`item.amt`]="{item}">
                    <strong>{{ item.amt | price }}원</strong>
                </template>
                <!-- 사용여부 -->
                <template v-slot:[`item.useYn`]="{item}">
                    <strong class="info--text" v-if="item.useYn === 'Y'">
                        <v-icon small color="info" left>mdi-check</v-icon>
                        사용</strong>
                    <strong class="error--text" v-else>
                        <v-icon small color="error" left>mdi-close</v-icon>
                        사용안함</strong>
                </template>
                <!-- 등록일시 -->
                <template v-slot:[`item.crtDt`]="{item}">{{ item.crtDt | dateSet }}</template>
            </v-data-table>
            <v-row>
                <v-col cols="12" class="text-right pb-0">
                    <v-btn outlined rounded color="info" @click="openDialog" v-if="writeAuth">
                        <v-icon left>add</v-icon>
                        예치금 계좌 등록
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
          value: 'depoKey',
          align: 'center',
          sortable: false
        },
        { text: '파트너명', value: 'companyName', align: 'center', sortable: false },
        { text: '업무유형명', value: 'taskTypeName', align: 'center', sortable: false },
        {
          text: '증권-입금현황',
          value: 'insuranceAmt',
          align: 'center',
          sortable: false
        },
        {
          text: '기타-입금현황',
          value: 'uninsuranceAmt',
          align: 'center',
          sortable: false
        },
        {
          text: '출금현황',
          value: 'accmltWithdrawAmt',
          align: 'center',
          sortable: false
        },
        { text: '예치금', value: 'amt', align: 'center', sortable: false },
        { text: '사용여부', value: 'useYn', align: 'center', sortable: false },
        { text: '등록일시', value: 'crtDt', align: 'center', sortable: false }
      ]
    }
  },
  computed: {
    searchList () {
      const searchList = [
        { key: 'depoKey', label: '예치금 KEY', type: 'text', cols: 2 },
        { key: 'companyName', label: '파트너명', type: 'text', cols: 2 },
        {
          key: 'taskType',
          label: '예치금 구분',
          type: 'code',
          commCode: 'COMM0009',
          cols: 2
        },
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
        componentPath: '@/api/Deposit/DepositAccountDialog',
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
