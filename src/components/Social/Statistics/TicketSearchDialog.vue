<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <span class="headline">우대번호 검색</span>
    </template>
    <search-form
      init-search
      disable-pagination
      :search-param.sync="searchParam"
      :search-list="searchList"
      @search="search">
    </search-form>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="list"
      item-key="ticketNo"
      :no-data-text="'검색 결과가 없습니다.'"
      show-select
      disable-pagination
      hide-default-footer
      disable-sort
      dense
      fixed-header
      height="500"
      class="bordered">
      <template v-slot:header.data-table-select></template>
    </v-data-table>
    <template v-slot:actions>
      <v-btn outlined rounded color="info" @click="addTicket"><v-icon left>check</v-icon>우대번호 추가</v-btn>
      <v-btn outlined rounded color="default" @click="close"><v-icon left>close</v-icon>닫기</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import statisticsService from '@/api/modules/social/statistics.service'

export default {
  extends: DialogBase,
  name: 'TicketSearchDialog',
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      list: [],
      selected: [],
      headers: [
        { text: '우대번호', value: 'ticketNo', align: 'center' },
        { text: '우대번호 명', value: 'ticketName', align: 'center' },
        { text: '판매기간', value: 'saleYmd', align: 'center' },
        { text: '판매채널', value: 'saleChnnl', align: 'center' },
        { text: '파트너사', value: 'companyName', align: 'center' }
      ]
    }
  },
  computed: {
    searchList () {
      return [
        { key: 'ticketNo', label: '우대번호', type: 'text', cols: 3 },
        { key: 'ticketName', label: '우대번호명', type: 'text', cols: 3 },
        { key: 'companyName', label: '파트너명', type: 'text', cols: 3 },
        { key: 'saleChnnl', label: '채널명', type: 'text', cols: 3 }
      ]
    }
  },
  methods: {
    async search () {
      try {
        const res = await statisticsService.selectTicketList(this.searchParam.q)
        this.list = res.data
      } catch (e) {}
    },
    addTicket () {
      if (this.selected.length === 0) {
        this.$dialog.alert('추가할 우대번호를 선택해 주세요.')
      }
      this.close({ data: this.selected })
    }
  }
}
</script>
