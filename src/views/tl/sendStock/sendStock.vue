<template>
  <div>
    <v-container fluid grid-list-md pt-0>
      <app-card colClasses="xl12 lg12 md12 sm12 xs12">
        <search-form init-search :search-param.sync="searchParam" :search-list.sync="searchList" @search="search"></search-form>
        <v-layout>
          <v-flex xs12>
            <v-data-table
              disable-pagination
              disable-sort
              hide-default-footer
              :no-data-text="'데이터가 없습니다.'"
              class="pointer bordered"
              :headers="headers"
              :items="list"
              @click:row="showDetail($event)">
              <template v-slot:item.createDatetime="{ item }">
                <span :title="item.createDatetime">{{ item.createDatetime + ' ~ ' + (item.modifyDatetime ? (item.modifyDatetime + '  (' + item.timeGap + '분)') : '진행중') }}</span>
              </template>
            </v-data-table>
            <search-pagination :search-param="searchParam" :total-visible="10" circle @change="search"></search-pagination>
          </v-flex>
        </v-layout>
      </app-card>
    </v-container>
    <send-stock-detail :dialog.sync="dialog" :master-data="form"></send-stock-detail>
  </div>
</template>

<script>
import sendStockDetail from './sendStockDetail.vue'
import sendStockService from '@/api/modules/tl/sendStock.service'

export default {
  components: { sendStockDetail },
  name: 'sendStock',
  data() {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      list: [],
      headers: [
        { text: '전송 번호', value: 'sendNo', align: 'right' },
        { text: '사업장', value: 'brcName', align: 'center' },
        { text: '전송 상태', value: 'sendStatus', align: 'center' },
        { text: '총 횟수', value: 'totCount', align: 'right' },
        { text: '대기 횟수', value: 'standByCount', align: 'right' },
        { text: '성공 횟수', value: 'successCount', align: 'right' },
        { text: '실패 횟수', value: 'failCount', align: 'right' },
        { text: '기준 일자', value: 'stndYmd', align: 'center' },
        { text: '전송 시간', value: 'createDatetime', align: 'center' }
      ],
      searchList: [
        { key: 'brcNo', label: '사업장', type: 'branch' },
        { key: 'sendNo', label: '전송 번호', type: 'text' },
        { key: 'sendStatus', label: '전송 상태', type: 'code', commCd: 'send_status' },
        { key: 'searchDate', label: '전송 일자', type: 'date', format: 'YYYYMMDD' }
      ],
      form: {},
      dialog: false
    }
  },
  methods: {
    search() {
      if (this.searchParam.q.sendNo) {
        this.searchParam.q.sendNo = parseInt(this.searchParam.q.sendNo)
      }
      sendStockService.selectList(this.searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = res.pagination.total
      })
    },
    showDetail(info) {
      this.form = info
      this.dialog = true
    }
  }
}
</script>
