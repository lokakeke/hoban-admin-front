<template>
  <div>
    <v-container fluid grid-list-md pt-0>
      <app-card colClasses="xl12 lg12 md12 sm12 xs12">
        <search-form ref="SearchForm" init-search :search-param.sync="searchParam"
                     :search-list.sync="searchList" @search="search"></search-form>
        <v-divider></v-divider>
        <v-layout row justify-end>
          <div>
            <v-btn outlined rounded color="green" @click="approveSendPrice()">
              <v-icon>check</v-icon>
              전송
            </v-btn>
            <v-btn outlined rounded color="amber darken-4" @click="deleteSendPrice()">
              <v-icon>delete</v-icon>
              삭제
            </v-btn>
          </div>
        </v-layout>
        <v-layout>
          <v-flex xs12>
            <v-data-table :headers="headers"
                          :items="list" :value="selected"
                          item-key="sendNo"
                          disable-pagination
                          hide-default-header
                          hide-default-footer
                          :no-data-text="'데이터가 없습니다.'" class="bordered">
              <template v-slot:header="props">
                <thead>
                  <tr>
                    <th>
                      <v-checkbox @click.stop="toggleAll"
                                  class="check-center"
                                  :input-value="selectedAll"
                                  :indeterminate="indeterminate"></v-checkbox>
                    </th>
                    <th v-for="header in props.props.headers" :key="header.value">
                      {{ header.text }}
                    </th>
                  </tr>
                </thead>
              </template>
              <template v-slot:item="props">
                <tr @click="showDetail(props.item)" class="pointer">
                  <td class="text-xs-right" @click="$event.cancelBubble=true">
                    <v-checkbox
                      class="check-center"
                      v-model="props.item.selected"
                      :disabled="props.item.sendStatus !== 'R'"
                    ></v-checkbox>
                  </td>
                  <td class="text-xs-right">{{ props.item.rnum }}</td>
                  <td class="text-xs-center">{{ props.item.brcName }} [{{ props.item.brcNo }}]</td>
                  <td class="text-xs-center">{{ props.item.storeName }} [{{props.item.storeCode}}]
                  </td>
                  <td class="text-xs-center">{{ props.item.tlRmTypeName || '---' }}[{{ props.item.tlNetRmTypeGroupCode }}]
                  </td>
                  <td class="text-xs-center">{{ props.item.rmTypeName }} [{{props.item.rmTypeCd}}]
                  </td>
                  <td class="text-xs-center">{{dateSet(props.item.startYmd, 'YYYYMMDD', 'YYYY-MM-DD')}}
                  </td>
                  <td class="text-xs-center">{{dateSet(props.item.endYmd, 'YYYYMMDD', 'YYYY-MM-DD')}}
                  </td>
                  <td class="text-xs-center">
                    <v-chip v-if="props.item.sendStatus === 'R'" small
                            :class="props.item.sendStatus === 'R' ? 'blue--text font-weight-bold' : ''">
                      {{ props.item.sendStatusName }}
                    </v-chip>
                    <v-chip v-else-if="props.item.sendStatus === 'C'" small
                            :class="props.item.sendStatus === 'C' ? 'green--text font-weight-bold' : ''">
                      {{ props.item.sendStatusName }}
                    </v-chip>
                    <v-chip v-else-if="props.item.sendStatus === 'D'" small
                            :class="props.item.sendStatus === 'D' ? 'red--text font-weight-bold' : ''">
                      {{ props.item.sendStatusName }}
                    </v-chip>
                    <v-chip v-else small class="gray--text font-weight-bold">
                      {{ props.item.sendStatusName }}
                    </v-chip>
                  </td>
                  <td class="text-xs-center">{{ props.item.sendDetailCnt }}</td>
                  <td class="text-xs-center">
                    {{ props.item.sendDetailSuccCnt ? props.item.sendDetailSuccCnt : 0 }}
                  </td>
                  <td class="text-xs-center">
                    {{ props.item.sendDetailFailCnt ? props.item.sendDetailFailCnt : 0 }}
                  </td>
                  <td class="text-xs-center">{{ props.item.createDatetime }}</td>
                </tr>
              </template>
            </v-data-table>
            <search-pagination v-model="searchParam" :total-visible="10" circle @change="search"></search-pagination>
          </v-flex>
        </v-layout>
      </app-card>
    </v-container>
    <send-price-detail v-if="dialog" :dialog.sync="dialog" @refresh="refresh" :form-data="form"></send-price-detail>
  </div>
</template>

<script>
import sendPriceDetail from './sendPriceDetail.vue'
import sendPriceService from '@/api/modules/tl/sendPrice.service'
import moment from 'moment'
import branchService from '@/api/modules/tl/branch.service'

export default {
  components: { sendPriceDetail },
  name: 'sendPrice',
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      list: [],
      // 영업장 목록
      businessList: [],
      headers: [
        { text: '번호', value: 'rnum', align: 'right' },
        { text: '사업장', value: 'brcName', align: 'center' },
        { text: '영업장', value: 'storeName', align: 'center' },
        { text: 'TL객실타입', value: 'tlRmTypeName', align: 'center' },
        { text: '객실타입', value: 'rmTypeName', align: 'center' },
        { text: '시작일자', value: 'startYmd', align: 'center' },
        { text: '종료일자', value: 'endYmd', align: 'center' },
        { text: '전송 상태', value: 'sendStatusName', align: 'center' },
        { text: '전송상세 갯수', value: 'sendDetailCnt', align: 'right' },
        { text: '상세 성공갯수', value: 'sendDetailSuccCnt', align: 'right' },
        { text: '상세 실패갯수', value: 'sendDetailFailCnt', align: 'right' },
        { text: '전송 일자', value: 'createDatetime', align: 'center' }
      ],
      sendStatusList: [
        { status: 'R', statusName: '전송대기' },
        { status: 'A', statusName: '전송승인' },
        { status: 'D', statusName: '전송삭제' },
        { status: 'P', statusName: '전송중' },
        { status: 'C', statusName: '전송완료' },
        { status: 'F', statusName: '전송실패' }
      ],
      form: {},
      dialog: false,
      selected: [],
      pagination: {
        sortBy: 'rnum',
        descending: true,
        rowsPerPage: -1
      }
    }
  },
  computed: {
    searchList () {
      return [
        { key: 'brcNo', label: '사업장', type: 'branch' },
        {
          key: 'storeCode',
          label: '영업장',
          type: 'select',
          list: this.businessList,
          listValue: 'storeCode',
          listText: 'storeName'
        },
        { key: 'rmTypeName', label: '객실타입', type: 'text' },
        {
          key: 'sendStatus',
          label: '전송 상태',
          type: 'select',
          list: this.sendStatusList,
          listValue: 'status',
          listText: 'statusName'
        },
        { key: 'searchDate', label: '전송 일자', type: 'date', format: 'YYYYMMDD' }
      ]
    },
    selectedAll () {
      return _.filter(this.list, { sendStatus: 'R' }).length === _.filter(this.list, { selected: true }).length
    },
    indeterminate () {
      return _.filter(this.list, { selected: true }).length > 0 && (_.filter(this.list, { sendStatus: 'R' }).length !== _.filter(this.list, { selected: true }).length)
    }
  },
  methods: {
    search () {
      this.selected = []
      this.list = []
      this.pagination = {
        sortBy: 'rnum',
        descending: true,
        rowsPerPage: -1
      }
      sendPriceService.selectList(this.searchParam).then(res => {
        res.data.forEach(item => {
          item.selected = false
        })
        this.list = res.data
        this.searchParam.total = res.pagination.total
      })
    },
    showDetail (info) {
      this.form = info
      this.dialog = true
    },
    dateSet (value, currFormat = moment.defaultFormat, format = 'YYYY.MM.DD HH:mm:ss') {
      if (!value) {
        return '-'
      } else if (!moment(value, currFormat).isValid()) {
        return '날짜 형식이 맞지 않습니다.'
      }
      return moment(value, currFormat).format(format)
    },
    toggleAll () {
      if (_.filter(this.list, { selected: true }).length === 0 || _.filter(this.list, { sendStatus: 'R' }).length !== _.filter(this.list, { selected: true }).length) {
        this.list.forEach(item => {
          if (item.sendStatus === 'R') {
            item.selected = true
          }
        })
      } else {
        this.list.forEach(item => {
          if (item.sendStatus === 'R') {
            item.selected = false
          }
        })
      }
    },
    approveSendPrice () {
      if (_.filter(this.list, { selected: true }).length === 0) {
        this.$dialog.alert('선택된 금액 정보가 없습니다.')
        return false
      }
      const checkedSendNo = _.map(_.filter(this.list, { selected: true }), 'sendNo')

      this.$dialog.confirm('선택한 금액 정보를 전송하시겠습니까?').then(() => {
        sendPriceService.approveSendPrice(checkedSendNo).then(res => {
          this.$dialog.alert('선택한 금액 정보를 전송 중입니다. 전송 상태는 알림을 확인해 주세요.')
          this.search()
        })
      })
    },
    deleteSendPrice () {
      if (_.filter(this.list, { selected: true }).length === 0) {
        this.$dialog.alert('선택된 금액 정보가 없습니다.')
        return false
      }
      const checkedSendNo = _.map(_.filter(this.list, { selected: true }), 'sendNo')

      this.$dialog.confirm('선택한 금액 정보를 삭제하시겠습니까?').then(() => {
        sendPriceService.deleteSendPrice(checkedSendNo).then(res => {
          this.$dialog.alert('선택한 금액 정보가 삭제되었습니다.')
          this.search()
        })
      })
    },
    refresh () {
      this.$refs.SearchForm.emit(true)
    }
  },
  mounted () {
    branchService.selectPmsStoreList().then(res => {
      this.businessList = res.data
    })
  }
}
</script>
