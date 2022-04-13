<template>
    <v-row wrap>
        <v-col sm="12">
            <app-card :heading="'우대번호 발권 변경'">
                <!--<search-form :search-param.sync="searchParam" :search-list.sync="searchList" @search="search" excel @export="exportExcel"></search-form>-->
                <search-form :search-param.sync="searchParam" :search-list.sync="searchList"
                             @search="search"></search-form>
                <v-row justify="space-between">
                    <v-col cols="7" align-self="center" class="pr-0 font-weight-bold">
                        <span>발권가능(Z) : {{ count.zcnt | price }}</span>
                        <span class="pl-5">사용가능(Y) : {{ count.ycnt | price }}</span>
                        <span class="pl-5">환불(R) : {{ count.rcnt | price }}</span>
                    </v-col>
                    <v-col cols="7" align-self="center" class="pr-0 font-weight-bold red--text">
                        객실 (51번으로 시작하는 번호) 상품은 API를 통해서만 변경이 가능합니다.
                    </v-col>
                    <v-col cols="5" align-self="center" class="text-right pl-0">
                        <v-btn outlined rounded color="info" @click="openChangeDialog" :disabled="changeDisabled">
                            <v-icon small>refresh</v-icon>
                            상태 일괄 변경
                        </v-btn>
                    </v-col>
                </v-row>
                <v-data-table
                    :no-data-text="'검색 결과가 없습니다.'"
                    :headers="headers"
                    :items="list"
                    hide-default-footer
                    item-key="b"
                    class="bordered"
                    disable-pagination
                >
                    <template v-slot:body="{ items }">
                        <tbody>
                        <template v-for="(item, index) in items">
                            <tr :key="item.ticketNo + index">
                                <td class="text-center pointer" @click="item.expand = !item.expand">
                                        <span v-if="item.size > 0">
                                            <v-icon>{{ item.expand ? "keyboard_arrow_up" : "keyboard_arrow_down" }}</v-icon>
                                            {{ item.ticketNo }} ({{ item.size }})
                                        </span>
                                    <span v-else>
                                            {{ item.ticketNo }}
                                        </span>
                                </td>
                                <td class="text-center">{{ item.ticketSeq }}</td>
                                <td class="text-center">{{ item.copnNo }}</td>
                                <td class="text-left">
                                    <pre v-if="item.exEtc">{{ item.exEtc }}</pre>
                                    <v-text-field v-model="item.etc" label=""></v-text-field>
                                </td>
                                <td class="text-center">
                                    <span v-if="item.useQty > 0">사용</span>
                                    <span v-else>
                                        <span v-if="item.useState === 'Z'">
                                          <v-btn text rounded color="accent" @click.native.stop
                                                 @click="ticketUpdate(item)" :disabled="checkUseState(item)">
                                            <v-icon left>cached</v-icon>사용가능으로 변경
                                          </v-btn>
                                        </span>
                                        <span v-else @click="changeStatus(item)" class="pointer">
                                          <v-icon
                                              :color="setUseStateDisabled(item) ? 'grey lighten-2 grey--text' : 'primary'">{{ item.useState === "Y" ? "radio_button_checked" : "radio_button_unchecked" }}</v-icon> 사용가능
                                          <v-icon
                                              :color="setUseStateDisabled(item) ? 'grey lighten-2 grey--text' : 'primary'">{{ item.useState === "R" ? "radio_button_checked" : "radio_button_unchecked" }}</v-icon> 환불
                                        </span>
                                      </span>
                                </td>
                                <td class="text-center">{{ item.updDt }}</td>
                            </tr>
                            <template v-if="item.expand">
                                <tr v-for="detail of item.groupList" :key="detail.ticketNo + index"
                                    class="green lighten-4">
                                    <td class="text-center">{{ detail.ticketNo }}</td>
                                    <td class="text-center">{{ detail.ticketSeq }}</td>
                                    <td class="text-center">{{ detail.copnNo }}</td>
                                    <td class="text-center">{{ detail.etc }}</td>
                                    <td class="text-center">
                                        <!-- 결합우대번호 상태가 Z인 경우 -->
                                        <span v-if="detail.useState === 'Z'">
                                            사용가능으로 변경가능
                                          </span>
                                        <span v-else-if="detail.useQty > 0">사용</span>
                                        <span v-else>
                                            {{ detail.useState == "Y" ? "사용가능" : "환불" }}
                                          </span>
                                    </td>
                                    <td class="text-center">{{ detail.updDt }}</td>
                                </tr>
                            </template>
                        </template>
                        </tbody>
                    </template>
                </v-data-table>
                <search-pagination v-model="searchParam" :total-visible="10" circle
                                   @change="search"></search-pagination>
            </app-card>
        </v-col>
    </v-row>
</template>

<script>
import ticketingUpdate from '@/api/modules/social/ticketingUpdate.service'
import excelMixin from '@/mixins/excelMixin'
import { mapGetters } from 'vuex'

export default {
  name: 'TicketingUpdate',
  mixins: [excelMixin],
  computed: {
    searchList () {
      return [
        { key: 'ticketNo', label: '우대번호', type: 'text', maxlength: 8 },
        { key: 'ticketSeq', label: '순번', type: 'text', maxlength: 6 },
        { key: 'copnNo', label: '난수번호', type: 'text' },
        {
          key: 'useInd',
          label: '상태',
          type: 'select',
          list: this.useIndList,
          listText: 'text',
          listValue: 'value'
        }
      ]
    },
    // 상태 일괄 변경 disabled
    changeDisabled () {
      return !(this.ticketNo !== undefined && this.ticketNo !== '')
    },
    ...mapGetters({ user: 'auth/user' })
  },
  data () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      ticketNo: '',
      useIndList: [
        { text: '발권가능', value: 'Z' },
        { text: '사용가능', value: 'Y' },
        { text: '환불', value: 'R' }
      ],
      list: [],
      headers: [
        { text: '우대번호', value: 'ticketNo', align: 'center', width: '10%' },
        { text: '순번', value: 'ticketSeq', align: 'center', width: '10%' },
        { text: '난수번호', value: 'copnNo', align: 'center', width: '15%' },
        { text: '비고', value: 'etc', align: 'center', width: '35%' },
        { text: '상태', value: 'useState', align: 'center', width: '15%' },
        { text: '수정일자', value: 'updDt', align: 'center', width: '15%' }
      ],
      form: {},
      count: {
        zcnt: 0,
        ycnt: 0,
        rcnt: 0
      }
    }
  },
  mounted () {
  },
  methods: {
    checkUseState (item) {
      let disabled = false
      // 1개라도 상태값이 Z가 아닌경우 사용가능으로 변경 X
      if (item.groupList.length > 0) {
        item.groupList.forEach(item => {
          if (item.useState !== 'Z') disabled = true
        })
      }
      if (_.startsWith(item.ticketNo, '5')) {
        disabled = true
      }
      return disabled
    },
    // 상태값 disabled
    setUseStateDisabled (item) {
      let disabled = false
      // 결합상품 중 1개라도 사용했을경우 상태변경 불가
      if (item.groupList.length > 0) {
        item.groupList.forEach(item => {
          if (item.useQty > 0) disabled = true
        })
      }
      return disabled
    },
    // 비고란 입력 체크
    checkEtc (etc) {
      if (!etc) {
        this.$dialog.alert('비고는 필수 입력입니다.')
      } else {
        return true
      }
    },
    // Z -> 사용 가능으로 변경
    ticketUpdate (item) {
      // 비고란 확인
      if (this.checkEtc(item.etc)) {
        item.state = 'Y'
        this.$dialog.confirm('사용가능 상태로 변경 하시겠습니까?').then(() => {
          // 상태값 사용가능으로 update
          ticketingUpdate.updateTicketState(item).then(res => {
            this.search()
          })
        })
      }
    },
    // 사용가능 <-> 환불 상태값 변경
    changeStatus (item) {
      // 사용가능, 환불 disabled
      if (this.setUseStateDisabled(item)) {
        return
      }
      // 비고 필수값 확인
      if (!this.checkEtc(item.etc)) {
        return
      }
      const status = item.useState === 'Y' ? '환불' : '사용가능'
      this.$dialog.confirm(status + ' 상태로 일괄변경 하시겠습니까?').then(() => {
        if (item.useState === 'Y') {
          item.state = 'R'
        } else if (item.useState === 'R') {
          item.state = 'Y'
        }
        // 상태값 update
        ticketingUpdate.updateTicketState(item).then(res => {
          item.useState = item.state
          this.search()
        })
      })
    },
    // 목록 조회
    search () {
      this.ticketNo = this.searchParam.q.ticketNo
      if (this.ticketNo === undefined || this.ticketNo.trim() === '') {
        this.$dialog.alert('우대번호를 입력해 주세요.')
      } else {
        // 파트너일 경우 파트너 번호 set
        if (this.isPartner) {
          this.searchParam.q.partnerSeq = this.user.number
        }
        ticketingUpdate.selectTicketingUpdateList(this.searchParam).then(res => {
          if (res.data.length > 0) {
            for (const list of res.data) {
              const length = _.size(list.groupList)
              if (length > 0) {
                list.size = length
              }
              list.expand = false
            }
          }
          this.list = res.data
          this.searchParam.total = res.pagination.total
          ticketingUpdate.selectTicketingStatus(this.searchParam).then(res => {
            if (res.data) {
              this.count = res.data
            } else {
              this.count = { zcnt: 0, ycnt: 0, rcnt: 0 }
            }
          })
        })
      }
    },
    // 엑셀 다운로드
    exportExcel () {
      const ticketNo = this.searchParam.q.ticketNo
      if (ticketNo === undefined || ticketNo.trim() === '') {
        this.$dialog.alert('우대번호 검색 후 엑셀 다운로드를 해주세요.')
      } else {
        this.downLoadExcel('/api/social/reservation/ticketingExcel', '우대번호 발권 변경 목록', this.searchParam, '.csv')
      }
    },
    // 상태 일괄 변경 Dialog
    openChangeDialog () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Social/Reservation/TicketStatusChangeDialog',
        params: {
          ticketNo: this.ticketNo
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 800,
          closeCallback: (params) => {
            // 정상 변경이 됐을경우 재조회
            if (params && params.data === '1') {
              this.search()
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
