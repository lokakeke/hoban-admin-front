<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <v-icon left>search</v-icon> 업체 이용정보 조회
    </template>
    <search-form :search-param.sync="searchParam" :search-list="searchList" @search="search" :cols="3" init-search></search-form>
    <v-data-table :no-data-text="emptyText" :headers="headers" :items="list" item-key="partnerSeq+termSeq" disable-sort
                  hide-default-footer class="click-row" @click:row="select($event)">
        <template v-slot:item.price="{item}">
          {{item.price | price}}원
        </template>
        <template v-slot:item.useDate="{item}">
            {{item.useStartDate | date}}  ~ {{item.useEndDate | date}}
        </template>
    </v-data-table>
    <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"/>
    <template v-slot:actions>
      <v-btn outlined rounded color="primary" @click="close">닫기(ESC)</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import service from '@/api/modules/partner/partnerTerm.service'
import DialogBase from '@/components/Dialog/DialogBase.vue'

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
      memberNo: '',
      disabled: false,
      list: [],
      headers: [
        { text: '파트너명', value: 'partnerName', align: 'center' },
        { text: '업무구분', value: 'taskTypeCodeName', align: 'center' },
        { text: '회원번호', value: 'memberNo', align: 'center' },
        { text: '업무구분명', value: 'taskTypeName', align: 'center' },
        { text: '대매사코드', value: 'agentCode', align: 'center' },
        { text: '예치금 Key', value: 'depositKey', align: 'center' },
        { text: '예치금', value: 'price', align: 'center' },
        { text: '계약기간', value: 'useDate', align: 'center' },
        { text: '예치금 계산여부', value: 'depositYn', align: 'center' }
      ]
    }
  },
  computed: {
    searchList () {
      return [
        { key: 'taskType', label: '업무 구분', type: 'code', commonCode: 'TASK_TYPE', defaultValue: this.taskType, disabled: this.disabled },
        { key: 'memberNo', label: '회원번호', type: 'text', defaultValue: this.memberNo },
        { key: 'partnerName', label: '파트너명', type: 'text' },
        { key: 'useDate', label: '계약 기간', type: 'dateRange', startField: 'useStartDate', endField: 'useEndDate', format: 'YYYYMMDD' },
        { key: 'agentCode', label: '대매사코드', type: 'text' }
      ]
    }
  },
  mounted () {
    if (this.instance.params.taskType) {
      this.taskType = this.instance.params.taskType
      this.disabled = true
    }
    let memberNo = this.instance.params.memberNo
    if (memberNo && memberNo.length === 6) {
      memberNo = memberNo + '00'
      this.searchParam.q.memberNo = memberNo
    }
    this.memberNo = memberNo
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
      if (row.partnerSeq && row.termSeq) {
        this.close({ data: row })
      }
    }
  }
}
</script>
