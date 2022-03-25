<template>
  <div>
    <v-row justify="end">
      <v-col cols="2">
        <v-radio-group v-model="chartValue" @change="makeChart" row class="pa-0 ma-0 dg-pull-right" hide-details>
          <v-radio label="매출" value="amt" color="cyan" on-icon="mdi-check-box-outline" off-icon="mdi-checkbox-blank-outline"></v-radio>
          <v-radio label="수량" value="qty" color="cyan" on-icon="mdi-check-box-outline" off-icon="mdi-checkbox-blank-outline"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="4" class="text-right">
        <v-btn outlined small :color="chartShow? 'info': 'primary'" @click="chartShow = !chartShow">
          <v-icon>{{chartShow? 'expand_less': 'expand_more'}}</v-icon>
          차트 {{chartShow? '닫기': '보기'}}
        </v-btn>
        <v-btn outlined small :color="tableShow? 'info': 'primary'" @click="tableShow = !tableShow">
          <v-icon>{{tableShow? 'expand_less': 'expand_more'}}</v-icon>
          표 {{tableShow? '닫기': '보기'}}
        </v-btn>
        <v-btn color="green" small outlined @click="exportExcel"><v-icon left>dashboard</v-icon>엑셀 다운로드</v-btn>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-expand-transition v-if="loadChart">
      <v-row v-show="chartShow">
        <v-col cols="12" class="px-0 pb-0">
          <chart :options="chartOptions"></chart>
        </v-col>
      </v-row>
    </v-expand-transition>
    <v-expand-transition>
      <div v-show="tableShow" class="text-right">
        <v-simple-table v-dragscroll="{target: '.v-data-table__wrapper'}"
                        dense class="bordered sticky-table"
                        :class="list.length > 0? 'grab-row': ''">
          <thead>
            <tr>
              <th class="text-center">연도</th>
              <th class="text-center">구분</th>
              <th v-for="item of periodList" :key="item.value" class="text-center">{{item.label}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) of list" :key="index">
              <td v-if="row.parent" :rowspan="row.rowSpan" class="text-center" v-html="row.parent"></td>
              <td class="text-center">{{row.name}}</td>
              <td v-for="(data, dataIndex) of row.data" :key="index + '_' + dataIndex" class="text-right">{{data | price}}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import { Chart } from "highcharts-vue"
import excelMixin from "Mixins/excelMixin"

export default {
  name: 'TotalStatisticsChart',
  props: {
    data: {
      type: Object,
      default () {
        return {
          basicData: [],
          basicKpi: {},
          compareData: [],
          compareKpi: {}
        }
      }
    },
    searchCondition: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  mixins: [excelMixin],
  components: { Chart },
  data () {
    return {
      chartValue: 'amt',
      loadChart: false,
      chartShow: true,
      tableShow: true,
      list: [],
      categories: [],
      periodList: [],
      chartOptions: {
        chart: {
          type: 'column',
          inverted: false,
          events: {
            load: function () {
              this.reflow()
            }
          }
        },
        title: {
          text: ''
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          title: {
            text: ''
          }
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          series: {
            borderWidth: 0,
            dataLabels: {
              allowOverlap: true,
              enabled: true
            }
          }
        },
        tooltip: {
          crosshairs: true,
          shared: true,
          borderWidth: 0,
          useHTML: true,
          formatter: function () {
            let format = `<div style="text-align: center; margin-bottom: 0; padding-bottom: 0"><b>${this.points[0].key || ''}</b></div><br/>`
            let firstRow = true
            for (const point of this.points) {
              const isKpi = point.series.userOptions.isKpi || false
              if (isKpi) {
                format += `  KPI (천원) : <b>${Number(point.point.y).toLocaleString()}</b><br/>`
              } else {
                if (firstRow) {
                  firstRow = false
                } else {
                  format += '<br/>'
                }
                format += `<span style="color:${point.point.color}">●</span><b>${point.series.name}</b><br/>`
                format += `  매출 (천원) : <b>${Number(point.point.options.amt).toLocaleString()}</b><br/>`
                format += `  수량 (건) : <b>${Number(point.point.options.qty).toLocaleString()}</b><br/>`
              }
            }
            return format
          }
        },
        series: []
      }
    }
  },
  mounted () {
    // 1 ~ 12월 period 데이터를 만든다.
    const periodList = []
    for (let i = 1; i <= 12; i++) {
      periodList.push({ value: i < 10 ? '0' + i : i + '', label: i + '월', month: i })
    }
    this.periodList = periodList
    // 차트 데이터를 만든다.
    this.makeChart()
  },
  methods: {
    async makeChart () {
      this.loadChart = false
      const series = []
      const list = []
      const chartValue = this.chartValue === 'amt' ? '매출 (천원)' : '수량 (건)'
      // 매출 - 판매일 경우 KPI/ 달성률 추가해준다.
      const isKpi = this.searchCondition.saleKind === 'S' && this.chartValue === 'amt'
      // 기준연도 데이터 셋팅
      const basicChart = { name: `${this.searchCondition.basicYear} 년`, data: [], type: 'column' }
      const basicRow = { parent: `${this.searchCondition.basicYear} 년`, name: `${chartValue}`, data: [], rowSpan: isKpi ? 3 : 1 }
      // 비교년도 데이터 셋팅
      const compareChart = { name: `${this.searchCondition.compareYear} 년`, data: [], type: 'column' }
      const compareRow = { parent: `${this.searchCondition.compareYear} 년`, name: `${chartValue}`, data: [], rowSpan: isKpi ? 3 : 1 }
      // 기준연도 KPI 셋팅
      const basicKpiChart = { name: `${this.searchCondition.basicYear}년 KPI`, data: [], type: 'line', isKpi: true }
      const basicKpiRow = { name: 'KPI (천원)', data: [] }
      const basicKpiRowAchievement = { name: '달성률', data: [], rowSpan: isKpi ? 3 : 1 }
      // 비교년도 KPI 셋팅
      const compareKpiChart = { name: `${this.searchCondition.compareYear}년 KPI`, data: [], type: 'line', isKpi: true }
      const compareKpiRow = { name: 'KPI (천원)', data: [], rowSpan: isKpi ? 3 : 1 }
      const compareKpiRowAchievement = { name: '달성률', data: [] }
      for (const period of this.periodList) {
        // 해당 데이터 filter
        const stndYmd = `${this.searchCondition.basicYear}${period.value}`
        const filterBasicData = this.data.basicData.find(data => data.stndYmd === stndYmd) || { qty: 0, amt: 0 }
        const addBasicRow = {
          name: period.label,
          qty: filterBasicData.qty,
          amt: Math.floor(filterBasicData.amt / 1000)
        }
        addBasicRow.y = addBasicRow[this.chartValue]
        basicChart.data.push(addBasicRow)
        basicRow.data.push(addBasicRow.y)

        const filterCompareData = this.data.compareData.find(data => data.stndYmd === stndYmd) || { qty: 0, amt: 0 }
        const addCompareRow = {
          name: period.label,
          qty: filterCompareData.qty,
          amt: Math.floor(filterCompareData.amt / 1000)
        }
        addCompareRow.y = addCompareRow[this.chartValue]
        compareChart.data.push(addCompareRow)
        compareRow.data.push(addCompareRow.y)

        // KPI 포함일 경우 셋팅
        if (isKpi) {
          const kpiKey = 'kpi' + period.month
          // 기준연도
          const filterBasicKpi = this.data.basicKpi[kpiKey] && this.data.basicKpi[kpiKey] > 0 ? Math.floor(this.data.basicKpi[kpiKey] / 1000) : ' - '
          basicKpiChart.data.push({
            name: period.label,
            y: filterBasicKpi
          })
          basicKpiRow.data.push(filterBasicKpi)
          const basicAchievement = this.data.basicKpi[kpiKey] && this.data.basicKpi[kpiKey] > 0 ? Math.floor(filterBasicData.amt / this.data.basicKpi[kpiKey] * 100) + ' %' : ' - '
          basicKpiRowAchievement.data.push(basicAchievement)
          // 비교연도
          const filterCompareKpi = this.data.compareKpi[kpiKey] && this.data.compareKpi[kpiKey] > 0 ? Math.floor(this.data.compareKpi[kpiKey] / 1000) : ' - '
          compareKpiChart.data.push({
            name: period.label,
            y: filterCompareKpi
          })
          compareKpiRow.data.push(filterCompareKpi)
          const compareAchievement = this.data.compareKpi[kpiKey] && this.data.compareKpi[kpiKey] > 0 ? Math.floor(filterCompareData.amt / this.data.compareKpi[kpiKey] * 100) + ' %' : ' - '
          compareKpiRowAchievement.data.push(compareAchievement)
        }
      }

      // Kpi 여부에 따른 데이터 push 순서 셋팅
      series.push(basicChart)
      list.push(basicRow)
      if (isKpi) {
        list.push(basicKpiRow)
        list.push(basicKpiRowAchievement)
        list.push(compareRow)
        list.push(compareKpiRow)
        list.push(compareKpiRowAchievement)
        series.push(basicKpiChart)
        series.push(compareChart)
        series.push(compareKpiChart)
      } else {
        list.push(compareRow)
        series.push(compareChart)
      }

      // 차트데이터에 적용
      this.chartOptions.series = series
      this.chartOptions.title.text = `소셜 ${this.searchCondition.saleKind === 'S' ? '판매' : this.searchCondition.saleKind === 'U' ? '사용' : '취소'} 전체 통계 - ${chartValue}`
      this.chartOptions.yAxis.title.text = chartValue
      this.list = list
      await this.$nextTick()
      this.loadChart = true
    },
    exportExcel () {
      this.downLoadExcelPost('/api/social/statistics/totalExcel',
        `소셜 전체 ${this.searchCondition.saleKind === 'S' ? '판매' : this.searchCondition.saleKind === 'U' ? '사용' : '취소'}통계_(${this.searchCondition.searchKind === 'A' ? '전체' : this.searchCondition.searchKind === 'O' ? '상시' : '전략'})`, this.searchCondition)
    }
  }
}
</script>
