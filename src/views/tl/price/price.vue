<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-container fluid pt-0>
      <app-card colClasses="xl12 lg12 md12 sm12 xs12">
        <v-row>
          <v-col cols="10" class="text-left">
            <branch-list :branchNo.sync="param.branchNo" :branchList.sync="branchList" :branchName.sync="param.branchName"
                         @change="branchChange()" class="mb-2"></branch-list>
            <v-menu v-model="menu" bottom offset-y :close-on-content-click="false" transition="slide-y-transition">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" outlined rounded :color="param.tlRmTypeCodeList && param.tlRmTypeCodeList.length > 0 ? 'green' : 'grey'" class="mb-2">
                  {{roomTypeArray | textTruncate(60, '..')}}
                  <v-icon>{{menu ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-toolbar color="green" dark dense>
                  <v-toolbar-title>TL-LINCOLN 객실타입 선택</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="menu = false">
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text class="pa-0">
                  <select-list :selected.sync="param.tlRmTypeCodeList" :array="roomTypeList" :itemValue="'tlRmTypeCode'"
                               :itemText="'tlRmTypeName'"></select-list>
                </v-card-text>
                <v-divider class="ma-0"></v-divider>
                <v-card-actions>
                  <v-label icon>
                    <v-icon>error_outline</v-icon>
                    중복선택이 가능합니다.
                  </v-label>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-col>
          <v-col align-self="center" class="text-right">
            <v-btn outlined middle rounded @click="search()" color="primary" class="mb-2">
              <v-icon>search</v-icon>
              {{$t('message.search')}}
            </v-btn>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col cols="4" align-self="center">
            <v-radio-group v-model="param.periodType" row @change="periodChange()" hide-details class="mt-0">
              <v-radio label="2주일" value="2w"></v-radio>
              <v-radio label="기간선택" value="p"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="4" align-self="center">
            <date-picker v-if="param.periodType === 'p'" :shortcuts="false" :value-type="'format'" :not-before="new Date()"
                         append-to-body v-model="param.selectDate" :lang="lang" range @change="checkDate()">
            </date-picker>
            <v-item-group v-else>
              <v-item>
                <v-btn icon dark @click="weekChange(true)">
                  <v-icon left color="black">
                    keyboard_arrow_left
                  </v-icon>
                </v-btn>
              </v-item>
              <v-item>
                <date-picker @change="weekChange()" append-to-body :clearable="false" format="YYYY 년 MM 월 DD 일"
                             v-model="param.selectDate" :lang="lang" :not-before="new Date()"></date-picker>
              </v-item>
              <v-item>
                <v-btn icon dark @click="weekChange(false)">
                  <v-icon right color="black">
                    keyboard_arrow_right
                  </v-icon>
                </v-btn>
              </v-item>
            </v-item-group>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <template v-if="!body || body.length === 0">
          <v-layout row wrap>
            <v-flex xs12>
              <h2 class="mt-4 text-center font-weight-regular">조건을 선택해 주세요.</h2>
            </v-flex>
          </v-layout>
        </template>
        <template v-else>
          <v-layout justify-space-between>
            <v-btn v-if="loading" outlined small rounded @click="closeAll()" color="primary">
              전체 {{menuClose ? '접기' : '펼치기' }}
              <v-icon>{{menuClose ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</v-icon>
            </v-btn>
          </v-layout>
          <v-divider></v-divider>
        </template>
        <template v-for="(room, bodyIndex) in body">
          <v-layout justify-space-between row wrap class="mb-1" :class="bodyIndex !== 0 ? 'mt-3' : ''">
            <h5 class="font-weight-bold mb-0">
              <v-icon color="orange darken-2" class="mb-1">
                play_circle_filled
              </v-icon>
              {{room.tlRmTypeName}}
              <v-btn icon dark @click="room.isView = !room.isView">
                <v-icon color="black">
                  {{!room.isView ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}}
                </v-icon>
              </v-btn>
            </h5>
          </v-layout>
          <v-layout wrap>
            <v-flex xs12 class="pt-0" v-if="room.isView">
              <v-form ref="form" lazy-validation>
                <v-data-table
                  :headers="headers"
                  :items="room.data"
                  class="condensed bordered"
                  disable-pagination
                  disable-sort
                  hide-default-header
                  hide-default-footer
                  :no-data-text="'데이터가 없습니다.'">
                  <template v-slot:header="props">
                    <thead>
                      <tr>
                        <th v-for="header in props.props.headers"
                            :key="header.value"
                            :class="[header.day === 6 ? 'blue--text' : header.day === 7 ? 'red--text' : '']">
                          <span v-html="header.text"></span>
                        </th>
                      </tr>
                    </thead>
                  </template>
                  <template v-slot:item="props">
                    <tr>
                      <th :rowspan="props.item.rows.length + 1" class="text-center" v-html="props.item.planGroupName"></th>
                      <th :rowspan="props.item.rows.length + 1" class="text-center" v-html="props.item.title"></th>
                    </tr>
                    <tr v-for="(row, rowIndex) in props.item.rows" :key="props.index + '' + rowIndex">
                      <th class="text-center" v-html="row.label"></th>
                      <td v-for="(col, colIndex) in row.cols" :key="rowIndex + '' + colIndex" class="text-center" :class="{'no_data': !col.value}">
                        <span>{{ getPriceValue(col.value) }}</span>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-form>
            </v-flex>
          </v-layout>
        </template>
      </app-card>
    </v-container>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import moment from 'moment'
import BranchList from '@/components/Branch/BranchList.vue'
import SelectList from '@/components/SelectAll/SelectList.vue'
import roomTypeService from '@/api/modules/tl/roomType.service'
import priceService from '@/api/modules/tl/price.service'

moment.locale('ko')
export default {
  name: 'price',
  components: { BranchList, SelectList, DatePicker },
  data () {
    return {
      // 검색기간
      start: '',
      end: '',
      menuClose: true,
      // 검색조건
      param: {
        // 사업장
        branch: '',
        branchName: '',
        // 객실타입
        tlRmTypeCodeList: [],
        // 기간타입
        periodType: '2w',
        // 선택기간
        selectDate: '',
        packageYn: 'N'
      },
      headers: [],
      dates: [],
      body: [],
      menu: false,
      loading: false,
      // custom lang
      lang: {
        days: ['일', '월', '화', '수', '목', '금', '토'],
        months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        placeholder: {
          date: '날짜를 선택하세요.',
          dateRange: '기간을 선택하세요.'
        }
      },
      // 사업장 목록
      branchList: [],
      // TL-LINCOLN 객실 타입
      roomTypeList: []
    }
  },
  mounted () {
    this.param.selectDate = moment().toDate()
  },
  computed: {
    roomTypeArray () {
      let text = ''
      let index = 1
      const length = this.param.tlRmTypeCodeList.length
      if (length === 0) {
        text = '객실 타입을 선택하세요.'
      } else {
        for (const type of this.param.tlRmTypeCodeList) {
          text += _.find(this.roomTypeList, { tlRmTypeCode: type }).tlRmTypeName
          if (index !== length) {
            text += ' , '
          }
          index++
        }
      }
      return text
    }
  },
  methods: {
    branchChange () {
      if (!this.param.branchNo) {
        this.$dialog.alert('사업장을 선택 후 진행하여 주세요.')
        return
      }
      // 초기화
      this.param.tlRmTypeCodeList = []
      this.roomTypeList = []
      this.body = []
      roomTypeService.selectRoomTypeSync(this.param.branchNo, this.param.packageYn).then(res => {
        // 싱크가 맞으면 진행한다.
        if (!res.data) {
          this.$dialog.alert('해당 사업장(' + this.param.branchName + ')의<br/>객실타입마스터 싱크가 맞지 않습니다.')
        } else {
          roomTypeService.selectRoomTypeList({
            branchNo: this.param.branchNo,
            useYn: 'Y',
            packageYn: this.param.packageYn
          }).then(res => {
            this.roomTypeList = res.data
          })
        }
      })
    },
    closeAll () {
      this.menuClose = !this.menuClose
      for (const room of this.body) {
        room.isView = this.menuClose
      }
    },
    checkDate () {
      // 시작일 90일 초과 시 disable
      if (this.param.selectDate[0] && this.param.selectDate[1]) {
        if (moment(this.param.selectDate[1], 'YYYY-MM-DD').diff(this.param.selectDate[0], 'day') > 90) {
          this.$dialog.alert('선택기간은 90일을 초과할 수 없습니다.')
          this.param.selectDate = []
        }
      }
    },
    periodChange () {
      if (this.param.periodType === 'p') {
        this.param.selectDate = []
      } else {
        this.param.selectDate = moment().toDate()
      }
    },
    weekChange (isPrev) {
      const addWeeks = this.param.periodType === '2w' ? 2 : 1
      if (isPrev === undefined) {
        this.param.selectDate = moment(this.param.selectDate)
      } else if (isPrev) {
        // 오늘 날짜 이전인지 확인한다.
        if (moment().format('YYYYMMDD') > moment(this.param.selectDate).add(-addWeeks, 'weeks').format('YYYYMMDD')) {
          this.$dialog.alert('과거의 데이터는 조회할 수 없습니다.')
        } else {
          this.param.selectDate = moment(this.param.selectDate).add(-addWeeks, 'weeks')
        }
      } else {
        this.param.selectDate = moment(this.param.selectDate).add(+addWeeks, 'weeks')
      }
    },
    search () {
      if (!this.param.branchNo) {
        this.$dialog.alert('사업장을 선택해 주세요.')
        return
      } else if (!this.param.tlRmTypeCodeList || this.param.tlRmTypeCodeList.length === 0) {
        this.$dialog.alert('객실타입을 선택해 주세요.')
        return
      } else if (this.param.periodType === 'p' && !(this.param.selectDate[0] && this.param.selectDate[1])) {
        this.$dialog.alert('기간을 선택해 주세요.')
        return
      }
      this.loading = false
      let startDate, endDate
      if (this.param.periodType === '2w') {
        startDate = moment(this.param.selectDate)
        endDate = moment(this.param.selectDate).add(2, 'weeks')
      } else if (this.param.periodType === 'p') {
        startDate = moment(this.param.selectDate[0])
        endDate = moment(this.param.selectDate[1])
      }
      this.param.startDate = startDate
      this.param.endDate = endDate
      // 파라미터를 만든다.
      const nights = moment(endDate).diff(startDate, 'day')
      const params = {
        branchNo: this.param.branchNo,
        nights: nights,
        standardDate: moment(startDate).format('YYYYMMDD'),
        tlRmTypeCodes: this.param.tlRmTypeCodeList,
        packageYn: this.param.packageYn
      }
      // 조회
      this.headers = []
      this.body = []
      this.dates = []
      priceService.selectPriceList(params).then(res => {
        // 테이블을 만든다.
        const headers = [{ text: '플랜그룹명', sortable: false }, { text: '-', sortable: false }, {
          text: '인원수',
          sortable: false
        }]
        for (let i = 0; startDate <= endDate; startDate = moment(startDate).add(1, 'days')) {
          const date = {
            text: startDate.format('MM/DD') + '<br/>(' + startDate.format('ddd') + ')',
            value: startDate.format('YYYYMMDD'),
            day: startDate.isoWeekday(),
            sortable: false
          }
          headers.push(date)
          this.dates.push(date)
        }
        this.headers = headers
        for (const room of res.data) {
          room.isView = true
          // 금액 없는 인원 ROW 제거
          _.forEach(room.data, function (planGroup) {
            planGroup.rows = _.filter(planGroup.rows, function (row) {
              return _.some(row.cols, function (col) {
                return col.value
              })
            })
          })
        }
        this.body = res.data
        this.loading = true
      })
    },
    getPriceValue (value) {
      return value ? this.$options.filters.price(value) + '원' : '-'
    }
  }
}
</script>

<style scoped>
thead th {
  background-color: #F5F5F5;
}

tbody th {
  background-color: #EFEBE9;
}

td.no_data {
  background-color: #FFCCBC;
}
</style>
