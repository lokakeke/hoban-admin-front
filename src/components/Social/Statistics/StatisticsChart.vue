<template>
  <div v-if="loadChart">
    <v-row class="pt-4 border-top-primary" justify="space-between" align="center">
      <v-col cols="3">
        <v-radio-group v-model="chartType" @change="changeChartType" row class="pa-0 ma-0" hide-details>
          <v-radio label="막대 그래프" value="column" color="orange" on-icon="mdi-check-box-outline" off-icon="mdi-checkbox-blank-outline"></v-radio>
          <v-radio label="선 그래프" value="line" color="orange" on-icon="mdi-check-box-outline" off-icon="mdi-checkbox-blank-outline"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="3">
        <v-radio-group v-model="chartInverted" @change="changeChartInverted" row class="pa-0 ma-0" hide-details>
          <v-radio label="가로 보기" :value="false" color="green" on-icon="mdi-check-box-outline" off-icon="mdi-checkbox-blank-outline"></v-radio>
          <v-radio label="세로 보기" :value="true" color="green" on-icon="mdi-check-box-outline" off-icon="mdi-checkbox-blank-outline"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="2">
        <v-radio-group v-model="chartValue" @change="changeChartValue" row class="pa-0 ma-0" hide-details>
          <v-radio label="매출" value="amt" color="cyan" on-icon="mdi-check-box-outline" off-icon="mdi-checkbox-blank-outline"></v-radio>
          <v-radio label="수량" value="cnt" color="cyan" on-icon="mdi-check-box-outline" off-icon="mdi-checkbox-blank-outline"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="4" class="text-right">
        <v-btn outlined small :color="chartShow? 'blue': 'pink'" @click="chartShow = !chartShow">
          <v-icon>{{chartShow? 'expand_less': 'expand_more'}}</v-icon>
          차트 {{chartShow? '닫기': '보기'}}
        </v-btn>
        <slot name="table-btn" />
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-expand-transition>
      <v-row v-show="chartShow">
        <v-col cols="12" class="px-0 pb-0">
          <chart :options="chartOptions"></chart>
        </v-col>
      </v-row>
    </v-expand-transition>
  </div>
  <div v-else></div>
</template>

<script>
import { Chart } from 'highcharts-vue'

export default {
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  name: 'StatisticsChart',
  components: { Chart },
  mounted () {
    if (this.data.drilldown) {
      this.chartOptions.drilldown.series = this.data.drilldown
    } else {
      delete this.chartOptions.drilldown
    }
    this.chartOptions.series = this.data.series || []
    this.categories = this.data.categories || []
    this.changeChartValue()
  },
  data () {
    return {
      chartType: 'column',
      chartValue: 'amt',
      loadChart: false,
      chartShow: true,
      chartInverted: false,
      categories: [],
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
            text: '판매수량 (건)'
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
          borderWidth: 0,
          useHTML: true,
          formatter: function () {
            const isKpi = this.point.isKpi || false
            let format = `<span style="color:${this.point.color}">●</span> ${this.series.name}<br/>
                            ${this.key}<br/>`
            if (isKpi) {
              format += `KPI : <b>${Number(this.point.y).toLocaleString()}</b>`
            } else {
              format += `수량 : <b>${Number(this.point.options.cnt).toLocaleString()}</b><br/>
                         금액 : <b>${Number(this.point.options.amt).toLocaleString()}</b>`
            }
            return format
          }
        },
        series: [],
        drilldown: { series: [] }
      }
    }
  },
  methods: {
    async changeChartType () {
      await this.setLoadChart(false)
      this.chartOptions.chart.type = this.chartType
      await this.setLoadChart(true)
    },
    async changeChartInverted () {
      await this.setLoadChart(false)
      this.chartOptions.chart.inverted = this.chartInverted
      await this.setLoadChart(true)
    },
    async changeChartValue () {
      await this.setLoadChart(false)
      if (this.chartOptions.series.length > 0) {
        // 데이터 셋팅
        const series = []
        for (const row of this.chartOptions.series) {
          for (const data of row.data) {
            data.y = data[this.chartValue]
          }
          series.push(row)
        }
        // drill down 데이터 셋팅
        if (this.data.drilldown) {
          const drillSeries = []
          for (const row of this.data.drilldown) {
            const copyRow = Object.assign({}, row)
            const dataList = []
            for (const data of row.data) {
              data.y = data[this.chartValue]
              dataList.push(data)
            }
            copyRow.data = dataList
            drillSeries.push(copyRow)
          }
          this.chartOptions.drilldown.series = drillSeries
        }
        // 적용
        this.chartOptions.yAxis.title.text = this.data.kind + (this.chartValue === 'cnt' ? '수량 (건)' : '금액 (천원)')
        this.chartOptions.title.text = (this.data.title || '') + ' ' + this.chartOptions.yAxis.title.text
        this.chartOptions.series = series
        await this.setLoadChart(true)
      }
    },
    setLoadChart (value) {
      this.loadChart = value
      if (value === true) {
        // 세로 일 경우 높이 조절
        if (this.chartInverted === true) {
          // series 갯수 * category 갯수
          const barLength = this.chartOptions.series.length * this.categories.length
          this.chartOptions.chart.height = barLength * 30
        } else {
          delete this.chartOptions.chart.height
        }
      }
    }
  }
}
</script>
