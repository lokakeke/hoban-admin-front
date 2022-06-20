<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <v-icon left>search</v-icon>예치금 계좌 조회
    </template>
    <search-form
      :search-param.sync="searchParam"
      :search-list="searchList"
      @search="search"
      :cols="3"
      init-search
    ></search-form>
    <v-data-table
      :no-data-text="emptyText"
      :headers="headers"
      :items="list"
      item-key="depositKey"
      disable-sort
      hide-default-footer
      class="click-row"
      @click:row="select"
    >
      <!-- 누적 입금액 -->
      <template v-slot:item.accmltRcpmnyPrice="{item}">
        <span class="red--text">{{item.accmltRcpmnyPrice | price}}원</span>
      </template>
      <!-- 누적 출금액 -->
      <template v-slot:item.accmltWithdrawPrice="{item}">
        <span class="blue--text">{{item.accmltWithdrawPrice | price}}원</span>
      </template>
      <!-- 금액 -->
      <template v-slot:item.price="{item}">
        <strong>{{item.price | price}}원</strong>
      </template>
      <!-- 등록일시 -->
      <template v-slot:item.createDatetime="{item}">{{item.createDatetime | dateSet}}</template>
    </v-data-table>
    <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
    <template v-slot:actions>
      <v-btn outlined rounded color="primary" @click="close">
        <v-icon left>close</v-icon>닫기
      </v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import depositAccountService from '@/api/modules/api/depositAccount.service'

export default {
  name: 'DepositAccountSearch',
  extends: DialogBase,
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
          text: '누적 입금액',
          value: 'accmltRcpmnyPrice',
          align: 'center',
          sortable: false
        },
        {
          text: '누적 출금액',
          value: 'accmltWithdrawPrice',
          align: 'center',
          sortable: false
        },
        { text: '예치금', value: 'price', align: 'center', sortable: false },
        { text: '메모', value: 'memo', align: 'center', sortable: false },
        { text: '등록일시', value: 'createDatetime', align: 'center', sortable: false }
      ]
    }
  },
  computed: {
    searchList () {
      const searchList = [
        { key: 'depositKey', label: '예치금 KEY', type: 'text', cols: 2 },
        { key: 'partnerName', label: '파트너명', type: 'text', cols: 2 },
        {
          key: 'taskType',
          label: '예치금 구분',
          type: 'code',
          commCode: 'COMM0009',
          cols: 2
        },
        { key: 'agentCode', label: 'agent코드', type: 'text', cols: 2 }
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
      searchParam.q.useYn = 'Y'
      searchParam.q.partnerSeq = this.instance.params.partnerSeq
      depositAccountService.selectDepositAccountList(searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = res.pagination.total
      })
    },
    select (row) {
      if (row.depositKey) {
        this.$dialog
          .confirm(
            `${row.partnerName} - ${row.depositKey} 예치금 계좌를 선택 하시겠습니까?`
          )
          .then(() => {
            this.close({ data: row })
          })
      }
    }
  }
}
</script>
