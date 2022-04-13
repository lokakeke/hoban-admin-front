<template>
    <v-row wrap>
        <app-card col-classes="col-12" heading="예치금 입출금 실패이력">
            <search-form
                :search-list="searchList"
                :search-param.sync="searchParam"
                @search="search"
                init-search
            ></search-form>
            <v-data-table
                :headers="filterHeaders"
                :items="list"
                :no-data-text="emptyText"
                :no-results-text="emptyText"
                class="bordered"
                disable-pagination
                disable-sort
                hide-default-footer
            >
                <template v-slot:item.depoKey="{item}">
                    <span v-if="item.depoKey">{{ item.depoKey }}</span>
                    <span v-else>-</span>
                </template>
                <template v-slot:item.amtInd="{item}">
                    <span class="red--text" v-if="item.amtInd === 'R'">차감</span>
                    <span class="blue--text" v-else-if="item.amtInd === 'C'">반환</span>
                    <span v-else>-</span>
                </template>
                <template v-slot:item.amt="{item}">
                    <span v-if="typeof item.amt === 'number'">{{ item.amt | price }}원</span>
                    <span v-else>-</span>
                </template>
                <template v-slot:item.keyRsvNo="{item}">
                    <v-row v-if="item.keyRsvNo" @click.stop="openReservation(item.keyRsvNo)" align="center">
                        <v-btn small color="info" text block>
                            <v-icon small>search</v-icon>
                            {{ item.keyRsvNo }}
                        </v-btn>
                    </v-row>
                    <span v-else>-</span>
                </template>
                <template v-slot:item.rsvNo="{item}">
                    <span v-if="item.rsvNo">{{ item.rsvNo }}</span>
                    <span v-else>-</span>
                </template>
                <template v-slot:item.ticketNo="{item}">
                    <span v-if="item.ticketNo">{{ item.ticketNo }}</span>
                    <span v-else>-</span>
                </template>
                <template v-slot:item.ticketSeq="{item}">
                    <span v-if="item.ticketSeq">{{ item.ticketSeq }}</span>
                    <span v-else>-</span>
                </template>
                <template v-slot:item.prcpAmt="{item}">
                    <span v-if="typeof item.prcpAmt === 'number'">{{ item.prcpAmt | price }}원</span>
                    <span v-else>-</span>
                </template>
            </v-data-table>
            <search-pagination :total-visible="10" @change="search" circle v-model="searchParam" />
        </app-card>
    </v-row>
</template>

<script>
import service from '@/api/modules/api/depositFailure.service'

export default {
  name: 'DepositFailure',
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
        { text: '실패순번', value: 'failrSeq', align: 'center', sortable: false },
        { text: '예치금 키', value: 'depoKey', align: 'center', sortable: false },
        { text: '금액구분', value: 'amtInd', align: 'center', sortable: false },
        { text: '금액', value: 'amt', align: 'center', sortable: false },
        { text: '예약키번호', value: 'keyRsvNo', align: 'center', sortable: false },
        { text: '예약번호', value: 'rsvNo', align: 'center', sortable: false },
        { text: '우대번호', value: 'ticketNo', align: 'center', sortable: false },
        { text: '우대순번', value: 'ticketSeq', align: 'center', sortable: false },
        { text: '원금금액', value: 'prcpAmt', align: 'center', sortable: false },
        { text: '오류 메시지', value: 'errorMsg', align: 'center', sortable: false },
        { text: '등록 ID', value: 'crtName', align: 'center', sortable: false },
        { text: '등록 IP', value: 'crtIp', align: 'center', sortable: false },
        { text: '발생일시', value: 'crtDt', align: 'center', sortable: false }
      ]
    }
  },
  computed: {
    searchList () {
      const searchList = []
      if (!this.isPartner) {
        searchList.push({ key: 'depoKey', label: '예치금 KEY', type: 'text', cols: 2 })
        searchList.push({ key: 'keyRsvNo', label: '예약키번호', type: 'text', cols: 2 })
        searchList.push({ key: 'rsvNo', label: '예약번호', type: 'text', cols: 2 })
        searchList.push({ key: 'ticketNo', label: '우대번호', type: 'text', cols: 2 })
        searchList.push({ key: 'ticketSeq', label: '우대순번', type: 'text', cols: 2 })
        searchList.push({ key: 'partnerSeq', label: '파트너', type: 'partner', cols: 2 })
      } else {
        searchList.push({ key: 'depoKey', label: '예치금 KEY', type: 'text', cols: 2 })
        searchList.push({ key: 'keyRsvNo', label: '예약키번호', type: 'text', cols: 2 })
        searchList.push({ key: 'rsvNo', label: '예약번호', type: 'text', cols: 2 })
        searchList.push({ key: 'ticketNo', label: '우대번호', type: 'text', cols: 2 })
        searchList.push({ key: 'ticketSeq', label: '우대순번', type: 'text', cols: 2 })
      }

      if (this.$route.path.indexOf('/social') === 0) {
        searchList.splice(1, 2)
      } else if (this.$route.path.indexOf('/ota') === 0) {
        searchList.splice(3, 2)
      }

      return searchList
    },
    /**
         *  메뉴에 따라 보여지는 테이블 헤더 변경
         *  소셜 : 예약키번호, 예약번호 제거
         *  OTA : 우대번호, 우대순번 제거
         */
    filterHeaders () {
      const headers = _.cloneDeep(this.headers)
      if (this.$route.path.indexOf('/social') === 0) {
        headers.splice(4, 2)
      } else if (this.$route.path.indexOf('/ota') === 0) {
        headers.splice(6, 2)
      }

      return headers
    }
  },
  methods: {
    search () {
      if (this.$route.path.indexOf('/social') === 0) {
        this.searchParam.q.taskType = 'S'
      } else if (this.$route.path.indexOf('/ota') === 0) {
        this.searchParam.q.taskType = 'O'
      }

      // 조회
      service.selectDepositFailureList(this.searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = res.pagination.total
      })
    },

    /**
         * 예약내역 팝업창 호출
         * @param keyRsvNo 예약 번호
         */
    openReservation (keyRsvNo) {
      if (keyRsvNo) {
        this.$store.dispatch('dialog/open', {
          componentPath: '/SearchDialog/ReservationSearch',
          params: {
            keyRsvNo: keyRsvNo
          },
          options: {
            fullscreen: false,
            scrollable: true,
            width: 800
          }
        })
      }
    }
  }
}
</script>
