<template>
  <v-row wrap>
    <app-card :heading="`${ calcStndMonthStr + ' 네이버N예약 매출보고' }`" col-classes="col-12">
      <v-row>
        <v-col cols="12">
          <v-alert dense outlined type="error" class="ma-1 font-sm">
            이미 생성한 월정산 데이터가 있을 경우 월정산 데이터 생성에 주의해주세요.<br />
            정산 확인이 완료되었을 경우 '정산 확인 완료'를 해주세요.
          </v-alert>
        </v-col>
        <v-col v-if="list && list.length > 0" cols="2" class="text-left pt-0 pb-0">
          <v-chip v-if="createCalcMonth === monthInfo.calcStndMonth && monthInfo.calcComptYn === 'N'" outlined rounded color="blue" class="text-subtitle-2" @click="updateCalculateMonthMst()"><v-icon left>check</v-icon>정산 확인 완료</v-chip>
          <v-chip v-if="monthInfo.calcComptYn === 'Y'" rounded color="blue" class="text-subtitle-2 white--text"><v-icon left>check</v-icon>정산 확인 완료</v-chip>
        </v-col>
        <v-col :cols="list && list.length > 0 ? 10 : 12" class="text-right pt-0 pb-0">
          <v-btn v-if="createCalcMonth === monthInfo.calcStndMonth && monthInfo.calcComptYn === 'N'" outlined rounded color="red" @click="createCalculateMonth()">
            <v-icon left>add</v-icon>월정산 데이터 생성
          </v-btn>
          <v-btn v-if="list && list.length > 0 && createCalcMonth === monthInfo.calcStndMonth && monthInfo.calcComptYn === 'N'" outlined rounded color="info" @click="openSaleAdjust()">
            <v-icon left>create</v-icon>매출조정 매핑
          </v-btn>
          <v-btn v-if="list && list.length > 0" outlined rounded color="green" @click="print">
            <v-icon left>local_printshop</v-icon>인쇄
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
          <v-data-table id="printMe"
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
            <template v-slot:group.header="{ group, headers, toggle, isOpen }">
              <td :colspan="headers.length">
                <v-btn @click="toggle" small icon :ref="group" :data-open="isOpen">
                  <v-icon v-if="isOpen">mdi-chevron-up</v-icon>
                  <v-icon v-else>mdi-chevron-down</v-icon>
                </v-btn>
                <v-chip outlined color="primary" class="ml-2 font-weight-bold">
                  {{ group }}
                </v-chip>
                <v-chip class="float-right font-weight-bold">소계 : {{ lcalTotalAmt(group) | price }}</v-chip>
              </td>
            </template>
            <template v-slot:item.pkgYn="{item}">
              {{ item.pkgYn === 'Y' ? '패키지' : '룸온리' }}
            </template>
            <template v-slot:item.aftpayAmt="{item}">
              <span :style="{'color': item.aftpayAmt < 0 ? 'red' : ''}" >{{ item.aftpayAmt | price }}</span>
            </template>
            <template v-slot:item.memo="{item}">
              <span style="display:block;text-align: left" v-html="item.memo"></span>
            </template>
            <template v-slot:item.delete="{item}">
              <v-btn class="mb-1" icon @click="deleteMonthPkgNo(item)" v-if="createCalcMonth === monthInfo.calcStndMonth && item.pkgYn === 'Y'">
                <v-icon>{{ deleteIconText }}</v-icon>
              </v-btn>
            </template>
            <template slot="body.append">
              <tr style="background-color: #eee;">
                <th colspan="3" class="title text-center font-weight-bold">합계</th>
                <th colspan="3" class="title text-right font-weight-bold">{{ totalAmt | price }}</th>
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
import calculateMonthService from 'Api/modules/naver/calculateMonth.service'

export default {
  name: 'Month',
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
        { text: '상품유형', value: 'pkgYn', align: 'center', sortable: false },
        { text: '패키지번호', value: 'mid', align: 'center', sortable: false },
        { text: '상품명', value: 'dgnsItemName', align: 'center', sortable: false },
        { text: '총매출', value: 'aftpayAmt', align: 'right', sortable: false },
        { text: '비고', value: 'memo', align: 'center', sortable: false },
        { text: '삭제', value: 'delete', align: 'center', sortable: false }
      ],
      isLoading: true,
      createCalcMonthStr: moment().add(-1, 'months').format('YYYY-MM'),
      createCalcMonth: moment().add(-1, 'months').format('YYYYMM'),
      totalAmt: 0,
      monthInfo: {
        calcStndMonth: moment().add(-1, 'months').format('YYYYMM'),
        seq: 0,
        calcComptYn: 'N'
      },
      deleteIconText: 'delete'
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
      if (this.monthInfo.calcStndMonth) {
        const date = moment(this.monthInfo.calcStndMonth, 'YYYYMM')
        return moment(date).format('YYYY-MM')
      } else {
        return moment().add(-1, 'months').format('YYYY-MM')
      }
    }
  },
  methods: {
    search () {
      this.totalAmt = 0
      this.list = []
      calculateMonthService.selectCalculateMonthMain(this.searchParam).then(res => {
        if (res.data && res.data.subList) {
          this.monthInfo = res.data
          this.list = res.data.subList
          this.totalAmt = _.sumBy(res.data.subList, 'aftpayAmt')
        } else {
          this.monthInfo = {
            calcStndMonth: moment().add(-1, 'months').format('YYYYMM'),
            seq: 0,
            calcComptYn: 'N'
          }
        }
      })
      // 로딩 stop
      this.isLoading = false
    },
    lcalTotalAmt (group) {
      return _.sumBy(_.filter(this.list, (item) => {
        return item.lcalNm === group
      }), 'aftpayAmt')
    },
    /**
     * 매출조정 추가
     */
    openSaleAdjust () {
      if (this.createCalcMonth === this.monthInfo.calcStndMonth && this.monthInfo.calcComptYn === 'N') {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Naver/Calculate/SaleAdjustMapping',
          params: {
            calcStndMonth: this.monthInfo.calcStndMonth
          },
          options: {
            fullscreen: false,
            scrollable: true,
            width: 1400,
            closeCallback: (params) => {
              if (params) {
                this.search()
              }
            }
          }
        })
      }
    },
    /**
     * 엑셀 다운로드
     */
    exportExcel () {
      this.downLoadExcel('/api/naver/calculate/month/excel', '(주) 호반호텔앤리조트_월정산_상세', this.searchParam, '.csv')
    },
    /**
     * 월정산 데이터 생성
     */
    createCalculateMonth () {
      this.$dialog.confirm(`${this.createCalcMonthStr} 월정산 데이터를 생성하시겠습니까? 정산 완료 후 알림이 전송됩니다.`).then(() => {
        calculateMonthService.insertCalculateMonth(this.createCalcMonth)
      })
    },
    updateCalculateMonthMst () {
      if (this.createCalcMonth === this.monthInfo.calcStndMonth && this.monthInfo.calcComptYn === 'N') {
        this.$dialog.confirm(`${this.calcStndMonthStr} 정산 확인 완료를 하시겠습니까?`).then(() => {
          const param = {
            calcStndMonth: this.monthInfo.calcStndMonth,
            seq: this.monthInfo.seq,
            calcComptYn: 'Y'
          }
          calculateMonthService.updateCalculateMonthMst(param).then(() => {
            this.$dialog.alert('완료되었습니다.')
            this.search()
          })
        })
      }
    },
    deleteMonthPkgNo (item) {
      if (this.createCalcMonth === this.monthInfo.calcStndMonth && this.monthInfo.calcComptYn === 'N') {
        this.$dialog.confirm(`${this.calcStndMonthStr} 패키지 삭제를 하시겠습니까?`).then(() => {
          const param = {
            calcStndMonth: this.monthInfo.calcStndMonth,
            seq: this.monthInfo.seq,
            mid: item.mid,
            pkgYn: item.pkgYn,
            delYn: 'Y'
          }
          calculateMonthService.deleteCalculateMonthDtl(param).then(() => {
            this.$dialog.alert('삭제되었습니다.')
            this.search()
          })
        })
      }
    },
    print () {
      this.deleteIconText = ''
      this.$nextTick(() => {
        this.$htmlToPaper('printMe')
        this.$nextTick(() => {
          this.deleteIconText = 'delete'
        })
      })
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
