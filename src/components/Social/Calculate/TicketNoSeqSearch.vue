<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <v-icon left>search</v-icon>우대번호 이용 상세 목록
    </template>
    <search-form :search-param.sync="searchParam" :search-list="searchList" @search="search" excel @export="exportExcel"></search-form>
    <v-data-table :no-data-text="emptyText" :headers="headers" :items="list" item-key="ticketSeq"
                  hide-default-footer>
    </v-data-table>
    <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
    <template v-slot:actions>
      <v-btn outlined rounded color="primary" @click="close"><v-icon left>close</v-icon>닫기</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import calculateService from 'Api/modules/social/calculate.service'
import excelMixin from 'Mixins/excelMixin'

export default {
  extends: DialogBase,
  name: 'TicketNoSeqSearch',
  mixins: [excelMixin],
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 20,
        total: 0,
        sort: ''
      },
      calcSeq: '',
      ticketNo: '',
      list: [],
      headers: [
        { text: '우대번호', value: 'ticketNo', align: 'center', sortable: false },
        { text: '순번', value: 'ticketSeq', align: 'center', sortable: false },
        { text: '우대번호 명', value: 'ticketNm', align: 'center', sortable: false },
        { text: '사용수량', value: 'useQty', align: 'center', sortable: false },
        { text: '사용일', value: 'useDt', align: 'center', sortable: false },
        { text: '쿠폰번호', value: 'copnNo', align: 'center', sortable: false }
      ]
    }
  },
  computed: {
    searchList () {
      return [
        { key: 'ticketSeq', label: '순번', type: 'text', maxlength: 6 }
      ]
    }
  },
  mounted () {
    if (this.instance.params.ticketNo) {
      this.calcSeq = this.instance.params.calcSeq
      this.ticketNo = this.instance.params.ticketNo
    }
    if (this.instance.params.lcalCd) {
      this.searchParam.q.lcalCd = this.instance.params.lcalCd
    }
    this.search()
  },
  methods: {
    search () {
      this.searchParam.q.calcSeq = this.calcSeq
      this.searchParam.q.ticketNo = this.ticketNo
      calculateService.selectTicketNoSeq(this.searchParam).then(res => {
        if (res.data) {
          this.list = res.data.list
          this.searchParam.total = res.data.total
        }
      })
    },
    // 엑셀 다운로드
    exportExcel () {
      this.downLoadExcel('/api/history/social/excel', '사용 우대번호 목록', this.searchParam, '.csv')
    }
  }
}
</script>
