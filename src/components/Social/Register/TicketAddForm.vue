<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <span class="headline">우대번호 추가발행</span>
    </template>
    <v-row>
        <v-col sm="4" md="4">
            <v-label>담당자 사번</v-label>
            <v-text-field label="" disabled></v-text-field>
        </v-col>
        <v-col sm="4" md="4">
            <v-label>담당자 명</v-label>
            <v-text-field label="" disabled></v-text-field>
        </v-col>
    </v-row>
    <v-row>
        <v-col sm="12" md="12">
            <v-row justify="space-between">
                <v-col cols="6" align-self="end"><v-label>우대번호 추가발행 이력</v-label></v-col>
            </v-row>
            <v-data-table :no-data-text="emptyText" :headers="historyHeaders" :items="historyList"
                          disable-sort disable-pagination hide-default-footer
                          class="bordered">
                          <template v-slot:item.issuCnt="{item}">
                            {{ item.issuCnt | price }}
                          </template>
                          <template v-slot:item.bgnNo="{item}">
                            {{ item.bgnNo | price }}
                          </template>
                          <template v-slot:item.endNo="{item}">
                            {{ item.endNo | price }}
                          </template>
            </v-data-table>
        </v-col>
    </v-row>
    <v-row>
      <v-col sm="12" md="12">
        <v-row justify="space-between">
          <v-col cols="6" align-self="end"><v-label>우대번호 추가발행 목록</v-label></v-col>
          <v-col cols="6" class="text-right"><v-btn rounded outlined @click="add()" color="info"><v-icon>add</v-icon>우대번호 추가</v-btn></v-col>
        </v-row>
        <v-data-table :no-data-text="emptyText" :headers="headers" :items="list"
                      disable-sort disable-pagination hide-default-footer
                      class="bordered">
          <template v-slot:item.ticketNo="{item}">
            <span class="text-center font-weight-bold pointer" @click="ticketHistoryList(item)">{{item.ticketNo}}</span>
          </template>
          <template v-slot:item.issuCnt="{ item }">
            {{item.issuCnt | price}}
          </template>
          <template v-slot:item.issuResn="{ item }">
            {{item.issuResn}}
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn small color="info" rounded outlined @click="add(item)"><v-icon small>check</v-icon>수정</v-btn>
            <v-btn small color="accent" rounded outlined @click="remove(item)"><v-icon small>remove</v-icon>삭제</v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <template v-slot:actions>
      <v-btn color="info" rounded @click="submit()">추가발행</v-btn>
      <v-btn color="white" rounded  @click="close()">취소</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import ticketService from '@/api/modules/social/ticket.service'

export default {
  extends: DialogBase,
  name: 'TicketAddForm',
  data () {
    return {
      param: {},
      historyHeaders: [
        { text: '우대번호', value: 'ticketNo', align: 'center', sortable: false },
        { text: '발행 수', value: 'issuCnt', align: 'center', sortable: false },
        { text: '사유', value: 'issuResn', align: 'center', sortable: false },
        { text: '자동여부', value: 'autoYn', align: 'center', sortable: false },
        { text: '시작순번', value: 'bgnNo', align: 'center', sortable: false },
        { text: '종료순번', value: 'endNo', align: 'center', sortable: false }
      ],
      historyList: [],
      headers: [
        { text: '우대번호', value: 'ticketNo', align: 'center', sortable: false },
        { text: '발행 수', value: 'issuCnt', align: 'center', sortable: false },
        { text: '사유', value: 'issuResn', align: 'center', sortable: false },
        { text: '수정/삭제', value: 'action', align: 'center', sortable: false }
      ],
      list: []
    }
  },
  mounted () {
  },
  methods: {
    // 우대번호 추가 버튼
    add (row) {
      let isNew = true
      let form = { issuCnt: 1000, autoYn: 'N' }
      if (row) {
        isNew = false
        form = this.cloneDeep(row)
      }
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Social/Register/TicketAddDialog',
        params: {
          isNew,
          form
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1000,
          closeCallback: (params) => {
            if (params && params.data) {
              // 신규 추가
              if (isNew) {
                let key = 0
                if (this.list.length > 0) {
                  key = Number(_.maxBy(this.list, 'primaryKey').primaryKey) + 1
                } else {
                  key = this.list.length + 1
                }
                params.data.primaryKey = key
                this.list.push(params.data)
              } else { // 수정
                const list = []
                for (let row of this.list) {
                  if (params.data.primaryKey === row.primaryKey) {
                    row = params.data
                  }
                  list.push(row)
                }
                this.list = list
              }
              // 이전 우대번호 추가발행 이력 조회
              this.ticketHistoryList(params.data)
            }
          }
        }
      })
    },
    // 이전 우대번호 추가발행 이력 조회
    ticketHistoryList (params) {
      this.param.ticketNo = params.ticketNo
      this.historyList = []
      ticketService.selectAddTicketList(this.param).then(res => {
        if (res.data) {
          this.historyList = res.data
        }
      })
    },
    // 우대번호 삭제
    remove (data) {
      this.$dialog.confirm('선택한 우대번호를 삭제하시겠습니까?').then(() => {
        this.list.splice(this.list.indexOf(data), 1)
      }).catch(() => {})
    },
    // 우대번호 추가발행 버튼
    submit () {
      if (this.list.length > 0) {
        this.$dialog.confirm('우대번호를 추가발행 하시겠습니까?').then(() => {
          ticketService.insertAddTicket(this.list).then(() => {
            this.$dialog.alert('등록 되었습니다.').then(() => {
              this.close()
            })
          })
        })
      }
    }
  }
}
</script>
