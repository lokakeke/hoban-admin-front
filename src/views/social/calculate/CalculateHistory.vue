<template>
    <v-row wrap>
        <v-col sm="12">
            <app-card :heading="'이전 정산 목록'">
                <search-form :search-param.sync="searchParam" :search-list="searchList" @search="search"></search-form>
                <v-data-table
                    :no-data-text="emptyText"
                    :headers="headers"
                    :items="list"
                    class="bordered click-row"
                    @click:row="openDetail($event)"
                    hide-default-footer
                    disable-pagination
                    item-key="calcSeq"
                >
                    <!--<template v-slot:item.ticketCnt="{ item }">
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                          &lt;!&ndash; 월정산 완료 개수&ndash;&gt;
                          <v-btn text block rounded color="blue" v-bind="attrs" v-on="on" v-if="item.calcInd === 'A'">{{item.monthCnt}}</v-btn>
                          &lt;!&ndash; 딜정산 진행수 / 완료 수 &ndash;&gt;
                          <v-btn text block rounded v-bind="attrs" v-on="on" v-if="item.calcInd === 'B'" color="blue">{{item.nowCnt}} / {{item.totalCnt}}</v-btn>
                        </template>
                        <span v-for="detail of item.ticketList" :key="item.calcSeq+detail.ticketNo">
                          [ {{detail.ticketNo}} ] / {{detail.calcInd}} / {{detail.ticketName}} /
                          <span>{{detail.vaildThruBgnYmd | date('YYYY.MM.DD') }} ~ {{detail.vaildThruEndYmd | date('YYYY.MM.DD')}} / </span>
                          <span v-if="item.calcInd === 'A'">
                            [정산월 : {{detail.calcYmd}}]
                          </span>
                          <span v-else>
                            <span v-if="detail.comptYn === 'Y'"><span class="font-weight-bold blue&#45;&#45;text">정산완료</span> / [정산일 : </span>
                            <span v-else><span class="font-weight-bold orange&#45;&#45;text">진행중</span> / [예정일 : </span> {{detail.calcYmd}}]
                          </span>
                          <br/>
                        </span>
                      </v-tooltip>
                    </template>-->
                    <template v-slot:item.calcYmd="{ item }">
                        <span
                            v-if="item.calcInd === 'A' && item.calcEndYmd">{{ item.calcEndYmd | date("YYYY.MM") }}</span>
                        <span
                            v-else-if="item.calcInd === 'B'">{{ item.calcBgnYmd | date("YYYY.MM.DD") }} ~ {{ item.calcEndYmd | date("YYYY.MM.DD") }}</span>
                    </template>
                    <template v-slot:item.calcInd="{ item }">
                        <v-btn text block rounded color="green" @click="openDetail(item)">
                            <span v-if="item.calcInd === 'A'">월정산</span>
                            <span v-else-if="item.calcInd === 'B'">딜정산</span>
                        </v-btn>
                    </template>
                </v-data-table>
                <search-pagination v-model="searchParam" :total-visible="10" circle
                                   @change="search"></search-pagination>
            </app-card>
        </v-col>
    </v-row>
</template>

<script>

import calculateService from '@/api/modules/social/calculate.service'
import { mapGetters } from 'vuex'

export default {
  name: 'CalculateHistory',
  data: function () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      list: []
    }
  },
  computed: {
    searchList () {
      return [
        { key: 'ticketNo', label: '우대번호', type: 'text' },
        { key: 'ptnrName', label: '파트너명', type: 'text' },
        { key: 'calcInd', label: '정산구분', type: 'text' },
        { key: 'progress', label: '진행단계', type: 'text' },
        { key: 'crtDt', label: '생성일자', type: 'text' }
      ]
    },
    headers () {
      return [
        { text: '정산 순번', value: 'calcSeq', align: 'center', sortable: false },
        { text: '정산 번호', value: 'calcNo', align: 'center', sortable: false },
        { text: '정산 명', value: 'calcName', align: 'center', sortable: false },
        { text: '정산기간', value: 'calcYmd', align: 'center', sortable: false },
        { text: '파트너명', value: 'ptnrName', align: 'center', sortable: false },
        { text: '정산 구분', value: 'calcInd', align: 'center', sortable: false },
        { text: '생성 일자', value: 'crtDt', align: 'center', sortable: false }
      ]
    },
    ...mapGetters({ user: 'auth/user' })
  },
  mounted () {
    this.search()
  },
  methods: {
    // 목록 조회
    search () {
      if (this.isPartner) {
        this.searchParam.q.ptnrNo = this.user.number
        this.searchParam.q.ptnrYn = 'Y'
      }
      calculateService.selectCalculateHistoryList(this.searchParam).then(res => {
        if (res.data) {
          this.list = res.data
          this.searchParam.total = res.pagination.total
        }
      })
    },
    // 정산 상세
    openDetail (item) {
      item.historyYn = 'Y'
      // dialog open
      this.isLoading = true
      this.$store.dispatch('dialog/open', {
        componentPath: '/Social/Calculate/CalculateForm',
        params: {
          info: item
        },
        options: {
          dense: true,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          fullscreen: true
        }
      })
    }
  }
}
</script>
