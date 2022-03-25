<template>
  <div v-if="loading">
    <div v-if="list && list.length > 0">
      <statistics-chart :data="data">
        <template v-slot:table-btn>
          <v-btn outlined small :color="tableShow? 'blue': 'pink'" @click="tableShow = !tableShow">
            <v-icon>{{tableShow? 'expand_less': 'expand_more'}}</v-icon>
            표 {{tableShow? '닫기': '보기'}}
          </v-btn>
          <v-btn color="green" small outlined @click="exportExcel"><v-icon left>dashboard</v-icon>엑셀 다운로드</v-btn>
        </template>
      </statistics-chart>
      <v-expand-transition>
        <div v-show="tableShow" class="text-right">
          <v-simple-table v-dragscroll="{target: '.v-data-table__wrapper'}"
                          dense class="bordered sticky-table"
                          :fixed-header="list.length > 0"
                          :class="list.length > 0? 'grab-row': ''"
                          :height="list.length > 4? 400: 'auto'">
            <thead>
              <tr>
                <th colspan="2" class="text-center sticky" style="left: 0">사업장</th>
                <th class="text-center sticky" :style="{'left': firstPoint + secondPoint + 'px'}">구분</th>
                <th v-for="item of categories" :key="item" class="text-center">{{item}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) of list" :key="index">
                <td v-if="row.parent" :id="index === 0 ? 'region_firstCol': ''" :rowspan="row.rowSpan" class="text-center sticky" style="left: 0" >{{row.parent}}</td>
                <td v-if="row.name" :id="index === 0 ? 'region_secondCol': ''" rowspan="2" class="text-center sticky"
                    :style="{'left': firstPoint + 'px', 'borderLeft': 'none!important'}" >
                  {{row.name}}
                </td>
                <td class="text-center sticky" :style="{'left': firstPoint + secondPoint + 'px', 'borderLeft': 'none!important'}">{{row.label}}</td>
                <td v-for="(item, itemIndex) of row.data" :key="index + '_' + itemIndex" class="text-right">{{item | price}}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </div>
      </v-expand-transition>
    </div>
    <div v-else class="title font-weight-bold text-center py-10 border-top-primary">
      검색 결과가 없습니다.
    </div>
  </div>
  <div v-else class="title font-weight-bold text-center py-10 border-top-primary">
    조건 선택 후 검색(F4) 하여 주세요.
  </div>
</template>

<script>
import { ResizeObserver as Polyfill } from '@juggle/resize-observer'
import statisticsService from 'Api/modules/social/statistics.service'
import StatisticsChart from 'Components/Social/Statistics/StatisticsChart.vue'
import excelMixin from 'Mixins/excelMixin'
import { mapGetters } from 'vuex'

export default {
  name: 'PersonalStatistics',
  props: {
    value: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  mixins: [excelMixin],
  components: { StatisticsChart },
  computed: {
    ...mapGetters({ searchCondition: 'social/statistics/searchCondition' })
  },
  watch: {
    value (newVal) {
      if (newVal === true) {
        this.loading = false
        this.search()
        this.$emit('input', false)
      }
    }
  },
  data () {
    return {
      tableShow: true,
      loading: false,
      categories: [],
      list: [],
      firstPoint: 0,
      secondPoint: 0,
      observerTable: null,
      data: {}
    }
  },
  methods: {
    async search () {
      try {
        console.log('fire : region')
        const data = await statisticsService.selectSocialRegionStatistics(this.searchCondition)
        this.data = data
        this.categories = data.categories
        this.list = data.list
        this.loading = true
        if (this.list.length > 0) {
          // 테이블 resize observe
          await this.$nextTick()
          this.observeSize()
        }
      } catch (e) {}
    },
    /**
     * 테이블 column 이 resize 될 경우 resize 된 값을 고정 width 에 저장해 준다.
     */
    observeSize () {
      if (this.observerTable) {
        this.observerTable.disconnect()
      }
      const ResizeObserver = Polyfill
      // 테이블 width 변경 체크
      const observerTable = new ResizeObserver(entries => {
        entries.forEach(entry => {
          const inlineSize = entry.borderBoxSize[0].inlineSize
          if (entry.target.getAttribute('id') === 'region_firstCol') {
            this.firstPoint = inlineSize
          } else {
            this.secondPoint = inlineSize
          }
        })
      })
      if (document.getElementById('region_firstCol')) {
        observerTable.observe(document.getElementById('region_firstCol'))
      }
      if (document.getElementById('region_secondCol')) {
        observerTable.observe(document.getElementById('region_secondCol'))
      }
      this.observerTable = observerTable
    },
    exportExcel () {
      this.downLoadExcelPost('/api/social/statistics/regionExcel',
        `소셜 개인별 ${this.searchCondition.saleKind === 'S' ? '판매' : this.searchCondition.saleKind === 'U' ? '사용' : '취소'} 통계`, this.searchCondition)
    }
  },
  /**
   * component 제거 시 resize observer 제거
   */
  beforeDestroy () {
    if (this.observerTable) {
      this.observerTable.disconnect()
    }
  }
}
</script>
