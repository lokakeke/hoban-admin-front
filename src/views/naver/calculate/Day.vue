<template>
  <v-row wrap>
    <app-card :heading="'일정산'" col-classes="col-12">
      <v-row>
        <v-col class="text-right pt-0 pb-0">
          <v-btn outlined rounded color="green" @click="exportExcel(null, 'excelMst')">
            <v-icon left>dashboard</v-icon>목록다운로드
          </v-btn>
          <v-btn outlined rounded color="green" @click="exportExcel(null, 'excelDtl')">
            <v-icon left>dashboard</v-icon>상세내역다운로드
          </v-btn>
          <v-btn outlined rounded color="info" @click="openExcelUploadDialog">
            <v-icon left>note_add</v-icon>엑셀업로드
          </v-btn>
        </v-col>
      </v-row>
      <search-form
        class="search-form"
        init-search
        :search-param.sync="searchParam"
        :search-list="searchList"
        @search="search">
      </search-form>
      <v-row>
        <v-col cols="12" class="pb-0">
          <v-data-table
              v-dragscroll="{target: '.v-data-table__wrapper'}"
              :no-data-text="emptyText" :headers="headers"
              :items="list" item-key="dayCalcMstNo"
              hide-default-footer
              disable-pagination
              disable-sort
              :loading="isLoading"
              loading-text="조회 중입니다. 잠시만 기다려주세요..."
              class="bordered">
            <template v-slot:item.calcStndDate="{item}">
              <div @click="openCalDay(item)" class="pb-1 pointer" v-if="item.calcStndDate">
                <v-chip small v-for="(calcStndDateSet, idx) in item.calcStndDate.split(',')" :key="idx" class="d-block mt-1">
                  <v-icon left v-if="idx === 0">search</v-icon>
                  <v-icon left v-else small light>mdi-plus</v-icon>
                  {{ calcStndDateSet | date }}
                </v-chip>
              </div>
            </template>
            <template v-slot:item.dayCalcMstNo="{item}">
              <div @click="openCalDay(item)" class="pointer pa-3">
                <v-icon>search</v-icon>
                {{ item.dayCalcMstNo | textTruncate }}
              </div>
            </template>
            <template v-slot:item.payAmt="{item}">
              {{ item.payAmt | price }}
            </template>
            <template v-slot:item.payCmsn="{item}">
              {{ item.payCmsn | price }}
            </template>
            <template v-slot:item.saleIfCmsn="{item}">
              {{ item.saleIfCmsn | price }}
            </template>
            <template v-slot:item.pcpmnyAmt="{item}">
              {{ item.pcpmnyAmt | price }}
            </template>
            <template v-slot:item.calcAprlYn="{item}">
              <div class="d-flex justify-center">
                <v-switch v-model="item.calcAprlYn" true-value="Y" false-value="N" class="mt-0 ml-3"
                  hide-details dense inset color="info" @change="updateCalculateDayMstYn(item, 'calcAprlYn')"></v-switch>
              </div>
            </template>
            <template v-slot:item.calcAprlTime="{item}">
              {{ item.calcAprlTime | dateSet }}
            </template>
            <!--<template v-slot:item.dgnsSlipInpYn="{item}">
              <div class="d-flex justify-center">
                <v-switch v-model="item.dgnsSlipInpYn" true-value="Y" false-value="N" class="mt-0 ml-4"
                  hide-details dense inset color="info" @change="updateCalculateDayMstYn(item, 'dgnsSlipInpYn')"
                  :disabled="isNotEditor(item, 'dgnsSlipInpYn')"></v-switch>
              </div>
            </template>-->
            <template v-slot:item.memo="{item}">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon @click="openCalDayUpdate(item)" :color="item.memo ? '#2DB400' : 'grey lighten-1'">comment</v-icon>
                  </v-btn>
                </template>
                <span style="display:block; max-width: 400px;">{{ item.memo ? item.memo : '(없음)' }}</span>
              </v-tooltip>
            </template>
            <template v-slot:item.calcRegDate="{item}">
              {{ item.calcRegDate | date }}
            </template>
            <template v-slot:item.excel="{item}">
              <v-chip class="mx-2" outlined small color="green" @click="exportExcel(item, 'excelDtl', 'ALL')">
                <v-icon dark>dashboard</v-icon>
              </v-chip>
            </template>
            <template v-slot:item.crtDt="{ item }">
              {{ item.crtDt | dateSet }}
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <search-pagination
        v-model="searchParam"
        :total-visible="10" circle
        @change="search"
      ></search-pagination>
      <common-snackbars :text="snackbarText" v-model="isShowSnackbar" :type="snackbarType"></common-snackbars>
    </app-card>
  </v-row>
</template>

<script>
import excelMixin from 'Mixins/excelMixin'
import service from 'Api/modules/naver/calculateDay.service'
import CommonSnackbars from 'Components/Common/CommonSnackbars.vue'

export default {
  name: 'Day',
  mixins: [excelMixin],
  components: {
    CommonSnackbars
  },
  data: function () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      list: [],
      headers: [
        { text: '정산기준일', align: 'center', value: 'calcStndDate' },
        { text: '결제금액', align: 'center', value: 'payAmt' },
        { text: '결제수수료', align: 'center', value: 'payCmsn' },
        { text: '매출연동수수료', align: 'center', value: 'saleIfCmsn' },
        { text: '입금액', align: 'center', value: 'pcpmnyAmt' },
        { text: '정산승인여부', align: 'center', value: 'calcAprlYn', maxWidth: 100 },
        { text: '정산승인시간', align: 'center', value: 'calcAprlTime' },
        /* { text: 'DGNS전표입력여부', value: 'dgnsSlipInpYn', align: 'center', maxWidth: 100 }, */
        { text: '메모', align: 'center', value: 'memo' },
        { text: '정산등록일', align: 'center', value: 'calcRegDate' },
        { text: '엑셀다운로드', align: 'center', value: 'excel' },
        { text: '등록일시', align: 'center', value: 'crtDt' }
      ],
      isLoading: true,
      /**
       * 검색
       */
      calcAprlYn: [
        {
          text: '승인',
          value: 'Y'
        },
        {
          text: '미승인',
          value: 'N'
        }
      ],
      /**
       * snackbar
       */
      isShowSnackbar: false,
      snackbarType: 'success',
      snackbarText: ''
    }
  },
  computed: {
    /**
       * 검색기능
       */
    searchList () {
      return [
        {
          key: 'useYmd',
          label: '기간 선택(기준일이 여러개일 시, 가장 빠른 날짜를 기준으로 조회됩니다)',
          type: 'date',
          startField: 'useBgnYmd',
          endField: 'useEndYmd',
          format: 'YYYY-MM',
          calendarType: 'month',
          viewFormat: 'YYYY-MM',
          defaultValue: moment().format('YYYY-MM-DD'),
          cols: 6
        },
        { key: 'calcAprlYn', label: '승인여부', type: 'select', list: this.calcAprlYn, listValue: 'value', listText: 'text', cols: 6 }
      ]
    }
  },
  methods: {
    search () {
      this.searchParam.q.completedYn = 'Y'
      service.selectCalculateDayMst(this.searchParam).then(res => {
        this.list = res.data
        this.searchParam.total = res.pagination.total
        // 로딩 stop
        this.isLoading = false
      })
    },
    /**
     * 상세 팝업 열기
     */
    openCalDay (item) {
      this.$nextTick(() => {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Naver/Calculate/DayForm',
          params: {
            form: item
          },
          options: {
            fullscreen: false,
            scrollable: true
          }
        })
      })
    },
    /**
     * 메모 업데이트 팝업 열기
     */
    openCalDayUpdate (item) {
      this.$nextTick(() => {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Naver/Calculate/DayFormUpdate',
          params: {
            form: item
          },
          options: {
            fullscreen: false,
            scrollable: true,
            width: 1000,
            closeCallback: (params) => {
              if (params && params.data) {
                this.search()
              }
            }
          }
        })
      })
    },
    /**
     * 엑셀 업로드 Dialog 열기
     */
    openExcelUploadDialog () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Naver/Calculate/ExcelUploadDialog',
        options: {
          fullscreen: false,
          maxWidth: 1200,
          closeCallback: (params) => {
            if (params && params.data) {
              this.showSnackbar(params.data.type, params.data.text)
              this.search()
            }
          }
        }
      })
    },
    /**
     * snack bar
     */
    showSnackbar (type, text) {
      this.isShowSnackbar = true
      this.snackbarType = type
      this.snackbarText = text
    },
    /**
     * switch
     */
    isNotEditor (item, property) {
      return (item[property] === 'Y')
    },
    updateCalculateDayMstYn (item, property) {
      const param = {}
      param[property] = item[property]
      service.updateCalculateDayMstYn(item.dayCalcMstNo, param).then(res => {
        this.showSnackbar('success', `${property === 'calcAprlYn' ? '정산승인상태' : 'DGNS전표입력여부'}가 변경됩니다.`)
        this.search()
      }).catch(() => {
        this.search()
      })
    },
    /**
     * 엑셀 다운로드
     */
    exportExcel (item, value, isCalcAprlYn) {
      this.searchParam.q.dayCalcMstNo = (item ? item.dayCalcMstNo : null)
      if (isCalcAprlYn) {
        this.searchParam.q.calcAprlYn = null // 개별 다운로드는 승인여부에 관계없으므로 null
      }
      if (value === 'excelMst') {
        this.searchParam.q.completedYn = 'Y'
      }
      this.downLoadExcel(`/api/naver/calculate/${value}`, `(주) 호반호텔앤리조트_일정산${value === 'excelMst' ? '' : '_상세'}`, this.searchParam, '.csv')
    }
  }
}
</script>

<style>
  .v-data-table__wrapper {
    cursor : grab;
  }
  .v-data-table__wrapper:active {
    cursor : grabbing;
  }
  .v-chip__content {
    cursor: pointer;
  }
</style>
