<template>
  <v-row wrap>
    <app-card :heading="'TPNE 정산 관리'" col-classes="col-12">
      <v-row>
        <v-col cols="12">
          <v-alert dense outlined type="error" class="ma-1 font-sm">
            이미 생성한 TPNE 정산 데이터가 있을 경우 TPNE 정산 데이터 생성에 주의해주세요.
          </v-alert>
        </v-col>
        <v-col class="text-right pt-0 pb-0">
          <v-btn outlined rounded color="red" @click="createCalculateTpne()">
            <v-icon left>add</v-icon>TPNE 정산 데이터 생성
          </v-btn>
          <v-btn outlined fab x-small color="accent" @click="toggleAll">
            <v-icon>unfold_more</v-icon>
          </v-btn>
          <v-btn outlined fab x-small color="accent" @click="closeAll">
            <v-icon>arrow_upward</v-icon>
          </v-btn>
          <v-btn outlined fab x-small color="accent" @click="openAll">
            <v-icon>arrow_downward</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <search-form
        class="search-form"
        init-search
        :search-param.sync="searchParam"
        :search-list="searchList"
        disable-pagination
        @search="search" excel @export="exportExcel">
      </search-form>
      <v-row>
        <v-col cols="12" class="pb-0">
          <v-data-table
            v-dragscroll="{target: '.v-data-table__wrapper'}"
            :no-data-text="'정산 데이터가 없습니다.'"
            :headers="headers"
            :items="list" item-key="id"
            hide-default-footer
            disable-pagination
            disable-sort
            :loading="isLoading"
            group-by="lcalNm"
            loading-text="조회 중입니다. 잠시만 기다려주세요..."
            class="bordered">
            <template v-slot:group.header="{ group, toggle, isOpen }">
              <td>
                <v-btn @click="toggle" small icon :ref="group" :data-open="isOpen">
                  <v-icon v-if="isOpen">mdi-chevron-up</v-icon>
                  <v-icon v-else>mdi-chevron-down</v-icon>
                </v-btn>
                <v-chip outlined color="primary" class="ml-2 font-weight-bold">
                  {{ group }}
                </v-chip>
              </td>
              <td>
                <v-chip class="float-right font-weight-bold">총계 : {{ lcalTotalAftpayAmt(group) | price }}</v-chip>
              </td>
              <td>
                <v-chip class="float-right font-weight-bold">총계 : {{ lcalTotalSoneAmt(group) | price }}</v-chip>
              </td>
              <td>
                <v-chip class="float-right font-weight-bold">총계 : {{ lcalTotalTpneAmt(group) | price }}</v-chip>
              </td>
            </template>
            <template v-slot:item.aftpayAmt="{item}">
              {{ item.aftpayAmt | price }}
            </template>
            <template v-slot:item.sonoAmt="{item}">
              {{ item.sonoAmt | price }}
            </template>
            <template v-slot:item.tpneAmt="{item}">
              {{ item.tpneAmt | price }}
            </template>
            <template slot="body.append">
              <tr style="background-color: #eee;">
                <th class="title text-center font-weight-bold">합계</th>
                <th class="title text-right font-weight-bold">{{ totalAftpayAmt | price }}</th>
                <th class="title text-right font-weight-bold">{{ totalSonoAmt | price }}</th>
                <th class="title text-right font-weight-bold">{{ totalTpneAmt | price }}</th>
              </tr>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </app-card>
  </v-row>
</template>

<script>
import excelMixin from 'Mixins/excelMixin'
import calculateTpneService from 'Api/modules/naver/calculateTpne.service'

export default {
  name: 'Tpne',
  mixins: [excelMixin],
  components: {},
  data: function () {
    return {
      searchParam: {
        q: {}
      },
      list: [],
      headers: [
        { text: '사업장', value: 'lcalNm', align: 'center', sortable: false },
        { text: '패키지번호', value: 'mid', align: 'center', sortable: false },
        { text: '후불금액', value: 'aftpayAmt', align: 'right', sortable: false },
        { text: '호텔앤리조트 금액', value: 'sonoAmt', align: 'right', sortable: false },
        { text: '티피앤이 금액', value: 'tpneAmt', align: 'right', sortable: false }
      ],
      isLoading: true,
      createCalcMonthStr: moment().add(-1, 'months').format('YYYY-MM'),
      createCalcMonth: moment().add(-1, 'months').format('YYYYMM'),
      totalAftpayAmt: 0,
      totalSonoAmt: 0,
      totalTpneAmt: 0
    }
  },
  computed: {
    /**
     * 검색기능
     */
    searchList () {
      return [
        {
          key: 'calcStndMonth',
          label: '기간 선택',
          type: 'date',
          startField: 'useBgnYmd',
          endField: 'useEndYmd',
          format: 'YYYYMM',
          calendarType: 'month',
          viewFormat: 'YYYY-MM',
          defaultValue: moment().add(-1, 'months').format('YYYYMMDD'),
          cols: 6
        }
      ]
    },
    calcStndMonthStr () {
      if (this.searchParam.q.calcStndMonth) {
        const date = moment(this.searchParam.q.calcStndMonth, 'YYYYMM')
        return moment(date).format('YYYY-MM')
      } else {
        return moment().add(-1, 'months').format('YYYY-MM')
      }
    }
  },
  methods: {
    search () {
      this.totalAftpayAmt = 0
      this.totalSonoAmt = 0
      this.totalTpneAmt = 0
      this.list = []
      calculateTpneService.selectCalculateTpneMain(this.searchParam).then(res => {
        if (res.data && res.data.subList) {
          this.list = res.data.subList
          this.totalAftpayAmt = _.sumBy(res.data.subList, 'aftpayAmt')
          this.totalSonoAmt = _.sumBy(res.data.subList, 'sonoAmt')
          this.totalTpneAmt = _.sumBy(res.data.subList, 'tpneAmt')
        }
        // 로딩 stop
        this.isLoading = false
      })
    },
    lcalTotalAftpayAmt (group) {
      return _.sumBy(_.filter(this.list, (item) => {
        return item.lcalNm === group
      }), 'aftpayAmt')
    },
    lcalTotalSoneAmt (group) {
      return _.sumBy(_.filter(this.list, (item) => {
        return item.lcalNm === group
      }), 'sonoAmt')
    },
    lcalTotalTpneAmt (group) {
      return _.sumBy(_.filter(this.list, (item) => {
        return item.lcalNm === group
      }), 'tpneAmt')
    },
    /**
     * TPNE 정산 데이터 생성
     */
    createCalculateTpne () {
      this.$dialog.confirm(`${this.createCalcMonthStr} TPNE 정산 데이터를 생성하시겠습니까? 정산 완료 후 알림이 전송됩니다.`).then(() => {
        calculateTpneService.insertCalculateTpne(this.createCalcMonth)
      })
    },
    /**
     * 엑셀 다운로드
     */
    exportExcel () {
      this.downLoadExcel('/api/naver/calculate/tpne/excel', '(주) 호반호텔앤리조트_TPNE정산_상세', this.searchParam, '.csv')
    },
    /**
     * headers button
     */
    toggleAll () {
      Object.keys(this.$refs).forEach(k => {
        this.$refs[k].$el.click()
      })
    },
    closeAll () {
      Object.keys(this.$refs).forEach(k => {
        if (this.$refs[k] && this.$refs[k].$attrs['data-open']) {
          this.$refs[k].$el.click()
        }
      })
    },
    openAll () {
      Object.keys(this.$refs).forEach(k => {
        if (this.$refs[k] && !this.$refs[k].$attrs['data-open']) {
          this.$refs[k].$el.click()
        }
      })
    }
  }
}
</script>
