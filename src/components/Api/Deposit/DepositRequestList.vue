<template>
  <v-row wrap>
    <app-card heading="예치금 신청 리스트" col-classes="col-12">
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
        <template v-slot:[`item.depositPlanDate`]="{item}">
          {{item.depositPlanDate | date}}
        </template>
        <!-- 금액 -->
        <template v-slot:[`item.price`]="{item}">
          {{item.price | price}}원
        </template>
        <!-- 등록일시 -->
        <template v-slot:[`item.createDatetime`]="{item}">
          {{item.createDatetime | dateSet}}
        </template>
        <!-- 승인상태 -->
        <template v-slot:[`item.approveCodeName`]="{item}">
          <template v-if="item.approveCode === 'A' && !isPartner">
            <v-btn @click="approval(item)"
                   color="primary"
                   rounded
            >
              {{ item.approveCodeName }}
            </v-btn>
          </template>
          <template v-else>
            {{ item.approveCodeName }}
          </template>
        </template>
        <!-- 승인일시 -->
        <template v-slot:item.processDatetime="{item}">
          {{item.processDatetime | dateSet}}
        </template>
      </v-data-table>
      <v-row>
        <v-col cols="12" class="text-right pb-0">
            <!-- fixme 나중에 구현
          <v-btn outlined rounded color="info" @click="openViewDepositInit" v-if="writeAuth && !isPartner" >
            <v-icon left>refresh</v-icon>예치금 초기화
          </v-btn>
          -->
          <v-btn outlined rounded color="info" @click="open" v-if="writeAuth">
            <v-icon left>add</v-icon>예치금 신청
          </v-btn>
        </v-col>
      </v-row>
      <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
    </app-card>
  </v-row>
</template>

<script>
import service from '@/api/modules/api/depositRequest.service'

export default {
  name: 'DepositRequest',
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
        { text: '신청순번', value: 'reqSeq', align: 'center', sortable: false },
        { text: '예치금KEY', value: 'depositKey', align: 'center', sortable: false },
        { text: '파트너명', value: 'partnerName', align: 'center', sortable: false },
        { text: '업무유형', value: 'taskTypeName', align: 'center', sortable: false },
        { text: '입금구분', value: 'depositAccountName', align: 'center', sortable: false },
        { text: '입금예정일', value: 'depositPlanDate', align: 'center', sortable: false },
        { text: '금액', value: 'price', align: 'center', sortable: false },
        { text: '입금내용', value: 'depositSenderName', align: 'center', sortable: false },
        { text: '등록일시', value: 'createDatetime', align: 'center', sortable: false },
        { text: '승인상태', value: 'approveCodeName', align: 'center', sortable: false },
        { text: '처리일시', value: 'processDatetime', align: 'center', sortable: false }
      ]
    }
  },
  computed: {
    searchList () {
      const searchList = [
        { key: 'depositKey', label: '예치금 KEY', type: 'text', cols: 2 },
        { key: 'partnerName', label: '파트너명', type: 'text', cols: 2 },
        { key: 'depositAccount', label: '입금구분', type: 'code', commonCode: 'COMM0004', cols: 2 },
        { key: 'accountNo', label: '입금계좌번호', type: 'text', cols: 2 },
        { key: 'depositSenderName', label: '입금내용', type: 'text', cols: 2 },
        { key: 'approveCode', label: '승인상태', type: 'code', commonCode: 'COMM0003', cols: 2 }
      ]
      if (this.isPartner) {
        // 파트너의 경우 파트너명 검색을 제거
        searchList.splice(1, 1)
      }
      return searchList
    }
  },
  methods: {
    search () {
      if (this.$route.path.indexOf('/social') === 0) {
        this.searchParam.q.taskType = 'SOCIAL'
      } else if (this.$route.path.indexOf('/ota') === 0) {
        this.searchParam.q.taskType = 'OTA'
      }

      // 조회
      service.selectDepositRequestList(this.searchParam).then(res => {
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
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Api/Deposit/DepositRequestDialog',
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
    },
    /**
     * 예치금 초기화
     */
    openViewDepositInit () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Api/Deposit/DepositInitDialog',
        params: {
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
    },
    /**
     * 승인/반려
     */
    approval (item) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Api/Deposit/DepositRequestApprovalDialog',
        params: {
          depositRequest: item
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 600,
          closeCallback: () => {
            this.search()
          }
        }
      })
    }
  }
}
</script>
