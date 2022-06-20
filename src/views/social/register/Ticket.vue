<template>
    <v-row wrap>
        <v-col sm="12">
            <app-card :heading="'우대번호 등록관리'">
                <search-form :search-param.sync="searchParam" :search-list="searchList" @search="search"
                             init-search></search-form>
                <v-data-table :no-data-text="'검색 결과가 없습니다.'" disable-pagination :headers="headers" :items="list"
                              hide-default-footer @click:row="openRegDialog($event)" class="click-row bordered">
                    <template v-slot:item.ticketNo={item}>
                        {{ item.ticketNo }} <span v-if="item.grupCnt > 0">({{ item.grupCnt }})</span>
                    </template>
                    <template v-slot:item.issuQty={item}>
                        {{ item.issuQty | price }}    <!-- 발행 수량 -->
                    </template>
                    <template v-slot:item.saleBgnYmd={item}>
                        {{ item.saleBgnYmd | date }}  <!-- 판매 시작일 -->
                    </template>
                    <template v-slot:item.saleEndYmd={item}>
                        {{ item.saleEndYmd | date }}  <!-- 판매 종료일 -->
                    </template>
                    <template v-slot:item.autoIssuLmt={item}>
                        {{ item.autoIssuLmt | price }}    <!-- 발행 총 제한 수량 -->
                    </template>
                    <template v-slot:item.autoIssuYn={item}>
                        {{ item.autoIssuYn === "Y" ? "발행" : "미발행" }}   <!-- 우대번호 자동발행 여부 -->
                    </template>
                    <template v-slot:item.depoApplyYn={item}>
                        {{ item.depoApplyYn === "Y" ? "적용" : "미적용" }}  <!-- 예치금 계산 여부 -->
                    </template>
                </v-data-table>
                <v-row>
                    <v-col colse="12" class="text-right">
                        <v-btn outlined rounded color="info" @click="openAddDialog()" v-if="writeAuth">
                            <v-icon small>add</v-icon>
                            추가발행
                        </v-btn>
                        <v-btn outlined rounded color="info" @click="openRegDialog()" v-if="writeAuth">
                            <v-icon small>add</v-icon>
                            우대번호 등록
                        </v-btn>
                    </v-col>
                </v-row>
                <search-pagination v-model="searchParam" :total-visible="10" circle
                                   @change="search"></search-pagination>
            </app-card>
        </v-col>
    </v-row>
</template>

<script>
import ticketService from '@/api/modules/social/ticket.service'
import {mapGetters} from 'vuex'

export default {
  name: 'Ticket',
  computed: {
    searchList () {
      return [
        { key: 'ticketNo', label: '우대번호', type: 'text' },
        { key: 'partnerName', label: '파트너명', type: 'text', disabled: this.isPartner }
      ]
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
      list: [],
      headers: [
        { text: '우대번호', value: 'ticketNo', align: 'center' },
        { text: '우대번호 명', value: 'ticketName', align: 'center' },
        { text: '업체', value: 'partnerName', align: 'center' },
        { text: '판매 시작일', value: 'saleBgnYmd', align: 'center' },
        { text: '판매 종료일', value: 'saleEndYmd', align: 'center' },
        { text: '우대번호 유효기간(시작)', value: 'vaildThruBgnYmd', align: 'center' },
        { text: '우대번호 유효기간(종료)', value: 'vaildThruEndYmd', align: 'center' },
        { text: '우대번호 자동발행 여부', value: 'autoIssuYn', align: 'center' },
        { text: '발행수량', value: 'issuQty', align: 'center' },
        { text: '발행 총 제한 수량', value: 'autoIssuLmt', align: 'center' },
        { text: '예치금 계산여부', value: 'depoApplyYn', align: 'center' }
      ],
      form: {}
    }
  },
  methods: {
    search () {
      // 파트너일 경우 파트너 번호 set
      if (this.isPartner) {
        this.searchParam.q.partnerSeq = this.user.number
      }
      ticketService.selectTicketRegistList(this.searchParam).then(res => {
        if (res.data) {
          this.list = res.data
          this.searchParam.total = res.pagination.total
        }
      })
    },
    openRegDialog (item) {
      let complete = false
      let data = {}
      if (item) {
        complete = true
        data = item
      }
      // dialog open
      this.isLoading = true
      this.$store.dispatch('dialog/open', {
        componentPath: '/Social/Register/TicketRegForm',
        params: {
          complete,
          info: data,
          search: this.search
        },
        options: {
          dense: true,
          fullscreen: true,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          closeCallback: () => {
            this.search()
          }
        }
      })
    },
    openAddDialog () {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Social/Register/TicketAddForm',
        params: {},
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1000
        }
      })
    }
  }

}
</script>
