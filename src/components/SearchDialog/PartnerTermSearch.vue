<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <v-icon left>search</v-icon> 업체 이용정보 조회
    </template>
    <search-form :search-param.sync="searchParam" :search-list="searchList" @search="search" :cols="3" init-search></search-form>
    <v-data-table :no-data-text="emptyText" :headers="headers" :items="list" item-key="ptnrNo+termSeq" disable-sort
                  hide-default-footer class="click-row" @click:row="select($event)">
        <template v-slot:item.amt="{item}">
          {{item.amt | price}}원
        </template>
        <template v-slot:item.useYmd="{item}">
            {{item.useBgnYmd | date}}  ~ {{item.useEndYmd | date}}
        </template>
    </v-data-table>
    <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"/>
    <template v-slot:actions>
      <v-btn outlined rounded color="primary" @click="close">닫기(ESC)</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import service from 'Api/modules/partner/partnerTerm.service'
import DialogBase from 'Components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'PartnerTermSearch',
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      taskType: '',
      memNo: '',
      disabled: false,
      list: [],
      headers: [
        { text: '파트너명', value: 'ptnrNm', align: 'center' },
        { text: '업무구분', value: 'taskTypeCdNm', align: 'center' },
        { text: '회원번호', value: 'memNo', align: 'center' },
        { text: '업무구분명', value: 'taskTypeNm', align: 'center' },
        { text: '판매채널', value: 'saleChnnlNm', align: 'center' },
        { text: '대매사', value: 'agentCdNm', align: 'center' },
        { text: '대매사코드', value: 'agentCd', align: 'center' },
        { text: '예치금 Key', value: 'depoKey', align: 'center' },
        { text: '예치금', value: 'amt', align: 'center' },
        { text: '계약기간', value: 'useYmd', align: 'center' },
        { text: '예치금 계산여부', value: 'depoYn', align: 'center' }
      ]
    }
  },
  computed: {
    searchList () {
      return [
        { key: 'taskType', label: '업무 구분', type: 'code', commCd: 'TASK_TYPE', defaultValue: this.taskType, disabled: this.disabled },
        { key: 'memNo', label: '회원번호', type: 'text', defaultValue: this.memNo },
        { key: 'ptnrNm', label: '파트너명', type: 'text' },
        { key: 'saleChnnl', label: '판매 채널', type: 'code', commCd: 'CHANNEL' },
        { key: 'useYmd', label: '계약 기간', type: 'dateRange', startField: 'useBgnYmd', endField: 'useEndYmd', format: 'YYYYMMDD' },
        { key: 'agentCdNm', label: '대매사', type: 'text' },
        { key: 'agentCd', label: '대매사코드', type: 'text' }
      ]
    }
  },
  mounted () {
    if (this.instance.params.taskType) {
      this.taskType = this.instance.params.taskType
      this.disabled = true
    }
    let memNo = this.instance.params.memNo
    if (memNo && memNo.length === 6) {
      memNo = memNo + '00'
      this.searchParam.q.memNo = memNo
    }
    this.memNo = memNo
  },
  methods: {
    search () {
      // 조회
      service.selectPartnerTermList(this.searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = res.pagination.total
      })
    },
    select (row) {
      if (row.ptnrNo && row.termSeq) {
        this.close({ data: row })
      }
    }
  }
}
</script>
