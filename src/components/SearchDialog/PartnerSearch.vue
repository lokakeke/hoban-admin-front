<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <v-icon left>search</v-icon> 업체 조회
    </template>
    <search-form :search-param.sync="searchParam" :search-list="searchList" @search="search" :cols="4" init-search></search-form>
    <v-data-table :no-data-text="emptyText" :headers="headers" :items="list" item-key="ptnrNo" disable-sort
                  hide-default-footer class="click-row" @click:row="select($event)"></v-data-table>
    <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
    <template v-slot:actions>
      <v-btn outlined rounded color="primary" @click="close"><v-icon left>close</v-icon>닫기</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import service from 'Api/modules/partner/partner.service'
import DialogBase from 'Components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'PartnerSearch',
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
        { text: '파트너명', value: 'ptnrNm', align: 'center', sortable: false },
        { text: '대표자 성명', value: 'ceoNm', align: 'center', sortable: false },
        { text: '메뉴 권한 명', value: 'menuAuthGrupNm', align: 'center', sortable: false }
      ]
    }
  },
  computed: {
    searchList () {
      return [
        { key: 'ptnrNm', label: '파트너명', type: 'text' },
        { key: 'ceoNm', label: '대표자 명', type: 'text' },
        { key: 'menuAuthGrupNm', label: '메뉴 권한 명', type: 'text' }
      ]
    }
  },
  methods: {
    search () {
      // 조회
      service.selectPartnerList(this.searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = res.pagination.total
      })
    },
    select (row) {
      if (row.ptnrNo) {
        this.close({ data: row })
      }
    }
  }
}
</script>
