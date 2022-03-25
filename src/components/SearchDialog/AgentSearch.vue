<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <v-icon left>search</v-icon> Agent 조회
    </template>
    <search-form :search-param.sync="searchParam" :search-list="searchList" @search="search" :cols="4" init-search></search-form>
    <v-data-table :no-data-text="emptyText" :headers="headers" :items="list" item-key="partnerNo"
                  hide-default-footer class="click-row" @click:row="select($event)"></v-data-table>
    <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
    <template v-slot:actions>
      <v-btn outlined rounded color="primary" @click="close"><v-icon left>close</v-icon>닫기</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import service from 'Api/modules/api/serviceManagement.service'
import DialogBase from 'Components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'AgentSearch',
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
        { text: 'Agent 이름', value: 'custNm', align: 'center', sortable: false },
        { text: 'Agent 번호', value: 'grupCustNo', align: 'center', sortable: false },
        { text: '대표자 성명', value: 'ceoNm', align: 'center', sortable: false }
      ]
    }
  },
  computed: {
    searchList () {
      return [
        { key: 'custNm', label: 'Agent 이름', type: 'text' },
        { key: 'grupCustNo', label: 'Agent 번호', type: 'text' },
        { key: 'ceoNm', label: '대표자 성명', type: 'text' }
      ]
    }
  },
  mounted () {
  },
  methods: {
    search () {
      // 조회
      service.selectAgentCodeList(this.searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = res.pagination.total
      })
    },
    select (row) {
      if (row.grupCustNo) {
        this.$dialog.confirm(`${row.custNm} 를 선택 하시겠습니까?`).then(() => {
          this.close({ data: { agentCd: row.grupCustNo, agentCdNm: row.custNm } })
        })
      }
    }
  }
}
</script>
