<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    persistent
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable>
    <v-card tile>
      <v-card-title class="pa-0">
        <v-toolbar dark flat color="primary">
          <v-toolbar-title>
            <v-row align="center" class="mx-0">
              <span>재고 전송 이력 상세</span>
            </v-row>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="close()" title="닫기">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-layout class="headline mb-2">
            <v-icon>business</v-icon>&nbsp;사업장 : {{ form.branchName }}
            <v-spacer></v-spacer>
            <v-icon>format_list_numbered</v-icon>&nbsp;전송번호 : {{ form.sendNo }}
            <v-spacer></v-spacer>
            <v-icon>settings_input_antenna</v-icon>&nbsp;전송상태 : {{ form.sendStatusName }}
          </v-layout>
          <div v-if="listOrigin.length > 0" class="mb-2">
            <v-layout @keypress.enter="doFilter()">
              <v-flex xs4 pl-2 pr-2>
                <v-text-field v-model="searchFilter.tlRmTypeCode" append-icon="search" label="TL 객실타입" hide-details clearable></v-text-field>
              </v-flex>
              <v-flex xs4 pl-2 pr-2>
                <v-text-field v-model="searchFilter.standardDate" append-icon="search" label="기준일자 (YYYY-MM-DD)" hide-details clearable></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-layout justify-end>
                  <v-btn outlined rounded color="warning" @click="refreshFilter()">
                    <v-icon>refresh</v-icon>
                    초기화
                  </v-btn>
                  <v-btn outlined rounded color="green" @click="doFilter()">
                    <v-icon>youtube_searched_for</v-icon>
                    검색결과 필터
                  </v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
          </div>
          <v-data-table v-dragscroll="{target: '.v-data-table__wrapper'}"
                        disable-pagination
                        hide-default-footer
                        :no-data-text="'데이터가 없습니다.'"
                        :headers="headers"
                        item-key="sendDetailNo"
                        :expand="true"
                        :items="list"
                        class="condensed bordered pointer">
            <template v-slot:item="props">
              <tr :class="props.item.sendStatus === '9' ? 'red lighten-2': ''">
                <td class="text-xs-center">{{ props.index + 1 }}</td>
                <td class="text-xs-center">{{ props.item.standardDate }}</td>
                <td class="text-xs-center">{{ props.item.roomTypeName }} [{{ props.item.roomTypeCode }}]</td>
                <td class="text-xs-center">{{ props.item.storeName }} [{{ props.item.storeCode }}]</td>
                <td class="text-xs-center">{{ props.item.sellStatus === '1' ? '판매' : '중지' }}</td>
                <td class="text-xs-center">{{ props.item.sendStatusName }}</td>
                <td class="text-xs-center">{{ props.item.tlRmTypeCode }}</td>
                <td class="text-xs-center">{{ props.item.tlNetRmTypeGroupCode }}</td>
                <td class="text-xs-right">{{ props.item.stock }}</td>
                <td v-show="false" class="text-xs-center">{{ props.item.blockCode }} 블럭</td>
                <td class="text-xs-right">{{ props.item.pmsStock }}</td>
                <td class="text-xs-right">{{ props.item.sendCount }}</td>
                <td class="text-xs-right">{{ props.item.tlSellStock }}</td>
                <td class="text-xs-center">
                  <template v-if="!props.item.sendStockAgentDetailList || props.item.sendStockAgentDetailList.length === 0">
                    없음
                  </template>
                  <template v-else>
                    <v-btn small rounded @click="props.expanded = !props.expanded">
                      {{ props.item.sendStockAgentDetailList.length }} 건
                      <v-icon>{{ props.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}</v-icon>
                    </v-btn>
                  </template>
                </td>
                <td class="text-xs-center">{{ props.item.errorCode }}</td>
                <td class="text-xs-center">{{ props.item.errorMessage }}</td>
              </tr>
              <template v-if="props.expanded && props.item.sendStockAgentDetailList && props.item.sendStockAgentDetailList.length > 0">
                <tr>
                  <td colspan="16" class="pr-2 pl-2">
                    <div class="condensed pt-2 pb-2">
                      <table class="bordered" style="width: 100%">
                        <thead>
                          <tr>
                            <th>판매처</th>
                            <th>AGENT 객실타입 코드</th>
                            <th>AGENT 판매상태</th>
                            <th>AGENT 전송상태</th>
                            <th>AGENT 판매수량</th>
                            <th>에러코드</th>
                            <th>에러메시지</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="agt of props.item.sendStockAgentDetailList" :class="agt.agentSendStatus === '9' ? 'red lighten-2': ''">
                            <td class="text-center">{{ agt.agentName + '(' + agt.agentCode + ')' }}</td>
                            <td class="text-center">{{ agt.netAgtRmTypeCode }}</td>
                            <td class="text-center">{{ agt.agentSellStatus === '1' ? '판매' : '중지' }}</td>
                            <td class="text-center">{{ agt.agentSendStatusName }}</td>
                            <td class="text-right">{{ agt.agentSellStock }}</td>
                            <td class="text-center">{{ agt.agentErrorCode }}</td>
                            <td class="text-center">{{ agt.agentErrorMessage }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </template>
            </template>
          </v-data-table>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import sendStockService from '@/api/modules/tl/sendStock.service'

export default {
  props: ['dialog', 'masterData', 'toastData'],
  name: 'sendStockDetail',
  watch: {
    dialog (newVal) {
      if (newVal) {
        this.refreshFilter()
        this.selectDetail(this.masterData)
      }
    }
  },
  data () {
    return {
      expand: false,
      form: {},
      list: [],
      listOrigin: [],
      searchFilter: {
        standardDate: '',
        tlRmTypeCode: ''
      },
      headers: [
        { text: '번호', value: 'sendDetailNo', align: 'center' },
        { text: '일자', value: 'standardDate', align: 'center' },
        { text: '객실타입 코드', value: 'roomTypeCode', align: 'center' },
        { text: '영업장 코드', value: 'storeCode', align: 'center' },
        { text: '판매여부', value: 'sellStatus', align: 'center' },
        { text: '전송상태', value: 'sendStatus', align: 'center' },
        { text: 'TL 객실타입', value: 'tlRmTypeCode', align: 'center' },
        { text: 'TL 객실그룹', value: 'tlNetRmTypeGroupCode', align: 'center' },
        { text: '재고 전송수량', value: 'stock', align: 'center' },
        /* { text: '재고 전송블럭', value: 'blockCode', align: 'center' }, */
        { text: 'PMS 수량', value: 'pmsStock', align: 'center' },
        { text: '전송횟수', value: 'sendCount', align: 'center' },
        { text: 'TL 판매수량', value: 'tlSellStock', align: 'center' },
        { text: 'AGENT 전송데이터', value: 'agent', align: 'center' },
        { text: '에러 코드', value: 'errorCode', align: 'center' },
        { text: '에러 메시지', value: 'errorMessage', align: 'center' }
      ]
    }
  },
  methods: {
    close () {
      this.$emit('update:dialog', false)
    },
    selectDetail (param) {
      if (this.toastData) {
        param = { branchNo: this.toastData.bindParam1, sendNo: this.toastData.bindParam2 }
      }
      this.form = {}
      this.list = []
      this.listOrigin = []
      sendStockService.selectDetail(parseInt(param.branchNo), parseInt(param.sendNo)).then(res => {
        this.form = res.data
        if (this.form.sendStockDetailList && this.form.sendStockDetailList.length > 0) {
          this.list = this.form.sendStockDetailList
          this.listOrigin = this.form.sendStockDetailList
          // agt cd 정보가 있으면 열어준다.
          if (this.toastData && this.toastData.bindParam4) {
            for (const detail of this.list) {
              if (detail.branchNo === this.toastData.bindParam1 && detail.sendNo + '' === this.toastData.bindParam2 &&
                detail.sendDetailNo === this.toastData.bindParam3) {
                this.$set(this.$refs.detail.expanded, detail.sendDetailNo, true)
              }
            }
          }
        }
      })
    },
    doFilter () {
      if (this.searchFilter.standardDate || this.searchFilter.tlRmTypeCode) {
        this.list = this.listOrigin.filter(data => {
          return (this.searchFilter.standardDate ? data.standardDate.includes(this.searchFilter.standardDate) : true) &&
            (this.searchFilter.tlRmTypeCode ? this.parseTrimLowerCase(data.tlRmTypeCode).includes(this.parseTrimLowerCase(this.searchFilter.tlRmTypeCode)) : true)
        })
      } else {
        this.list = this.listOrigin
      }
    },
    refreshFilter () {
      this.searchFilter = {
        standardDate: '',
        tlRmTypeCode: ''
      }
      this.doFilter()
    }
  }
}
</script>
