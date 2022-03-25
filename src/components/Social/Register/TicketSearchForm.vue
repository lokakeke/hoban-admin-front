<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <span class="headline">우대번호 검색</span>
    </template>
      <v-row>
          <v-col cols="12">
              <v-row @keypress.enter="search">
                <v-col cols="6">
                  <label>우대번호</label>
                  <v-text-field maxlength="8" v-model="param.ticketNo" append-icon="search" clearable :rules="emptyRules.concat(numberRules)" required></v-text-field>
                </v-col>
                <v-col cols="6" class="text-right" align-self="center">
                  <v-btn outlined rounded color="primary" @click="search">
                    <v-icon>search</v-icon>
                    검색
                  </v-btn>
                </v-col>
              </v-row>
              <v-data-table class="pointer" :no-data-text="'데이터가 없습니다.'" :no-result-text="'데이터가 없습니다..'" @click:row="setTicket($event)" :headers="headers" :items="ticketList" hide-default-footer>
                <template v-slot:item.issuQty = {item}>
                  {{item.issuQty | price}}    <!-- 발행 수량 -->
                </template>
                <template v-slot:item.groupList="{ item }">
                  <span>{{item.groupList.length > 1 ? 'O' : 'X'}}</span>
                </template>
              </v-data-table>
          </v-col>
      </v-row>
    <template v-slot:actions>
      <v-btn color="white" rounded @click="close">닫기</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import ticketSearchService from 'Api/modules/social/ticketSearch.service'
import DialogBase from 'Components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'TicketSearchForm',
  data () {
    return {
      headers: [
        { text: '우대번호', value: 'ticketNo', align: 'center', sortable: false },
        { text: '우대번호 명', value: 'ticketNm', align: 'center', sortable: false },
        { text: '우대번호 유효기간', value: 'vaildThruYmd', align: 'center', sortable: false },
        { text: '발행매수', value: 'issuQty', align: 'center', sortable: false },
        { text: '그룹상품', value: 'groupList', align: 'center', sortable: false }
      ],
      param: {
        ticketNo: '',
        ticketMngmYn: 'N'
      },
      ticketList: []
    }
  },
  mounted () {
    // API_SOCIAL_TICKET_MNGM 에 있는 우대번호만 조회
    if (this.instance.params.ticketMngmYn) {
      this.param.ticketMngmYn = this.instance.params.ticketMngmYn
    }
    // 부모창에서 우대번호 입력 후 조회버튼 클릭 시, ticketNo set
    if (this.instance.params.ticketNo) {
      this.param.ticketNo = this.instance.params.ticketNo
      this.search()
    }
  },
  methods: {
    // 우대번호 검색
    search () {
      this.param.ticketNo = this.param.ticketNo.trim()
      if (this.param.ticketNo === '') {
        this.$dialog.alert('우대번호를 입력해주세요.')
      } else {
        // 입장권(4), 객실(5), 할인권(9) 이 아닌경우 등록 금지
        const pattern = new RegExp('^[4|5|9]')
        if (pattern.test(this.param.ticketNo)) {
          ticketSearchService.selectTicketList(this.param).then(res => {
            if (res.data) {
              this.ticketList = res.data
            }
          })
        } else {
          this.$dialog.alert('등록할 수 없는 우대번호 입니다.')
        }
      }
    },
    // 선택한 우대번호 부모창에 값 넘김
    setTicket (info) {
      // 결합 상품이 없을경우 초기화
      if (info != null && !info.groupList) {
        info.groupList = []
      }
      // 이미 등록 되어있는 우대번호일 경우
      if (info && info.registYn === 'Y') {
        this.$dialog.alert('이미 등록된 우대번호 입니다.')
        return
      }
      this.close({ data: info })
    }
  }
}
</script>
