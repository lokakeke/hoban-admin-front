<template>
  <app-card heading="월력 데이터 ( 예시 )" col-classes="col-7">
    <v-row align="center" no-gutters>
      <v-col cols="4" class="text-right">
        <v-btn small color="info" class="font-raise" text @click="changeDate(true)">
          <v-icon left>arrow_back_ios</v-icon>이전 달
        </v-btn>
      </v-col>
      <v-col cols="4" class="px-4">
        <v-menu
          v-model="month"
          offset-y
          max-width="290px"
          min-width="290px"
          :close-on-content-click="false">
          <template v-slot:activator="{ on }">
            <v-btn small v-on="on" block text color="info" class="font-raise">
              <v-icon left>event</v-icon>{{formatMonth}}
            </v-btn>
          </template>
          <v-date-picker
            v-model="form.selectDate"
            type="month"
            no-title
            locale="ko"
            @input="inputDate">
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="4" class="text-left">
        <v-btn small color="info" text class="font-raise" @click="changeDate(false)">
          다음 달<v-icon right>arrow_forward_ios</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <div class="pt-3 px-3">
      <v-row>
        <v-col cols="12" class="text-right py-0">
          <v-icon large :color="registerColor">stop</v-icon> 등록된 재고
          <v-icon large :color="expectColor">stop</v-icon> 예상 재고
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="day of dayList" :key="day.value"
               class="text-center py-1 border-col"
               :class="[day.color + '--text']">
          {{day.text}}
        </v-col>
      </v-row>
      <v-row v-for="(row, index) of calendar" :key="index" class="border-row">
        <v-col v-for="item of row.items" :key="item.date"
               class="text-center border-col py-1 px-0"
               :style="{ 'background': item.bg }">
          <v-row class="px-0 mx-1">
            <v-col cols="12" class="day-text">
              <v-row no-gutters justify="space-between"
                     class="primary--text"
                     :class="{'font-weight-black': item.isToday}">
                <span class="font-weight-bold">{{item.month}}</span>
                <span>{{item.label}}</span>
              </v-row>
            </v-col>
            <v-col cols="12" v-for="data of item.list" :key="data.ptnrNo"
                   class="body-text"
                   :style="{'background': item.color}">
              <v-row no-gutters justify="space-between">
                <span>{{data.label}} :</span>
                <span>{{data.count}} 개</span>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </app-card>
</template>

<script>
export default {
  name: 'Calendar',
  data () {
    return {
      dayList: [
        { value: 0, text: '일요일', color: 'red' },
        { value: 1, text: '월요일', color: 'black' },
        { value: 2, text: '화요일', color: 'black' },
        { value: 3, text: '수요일', color: 'black' },
        { value: 4, text: '목요일', color: 'black' },
        { value: 5, text: '금요일', color: 'black' },
        { value: 6, text: '토요일', color: 'blue' }
      ],
      calendar: [],
      today: moment().format('YYYY-MM-DD'),
      registerColor: '#2196F3',
      expectColor: '#4CAF50',
      noMonthColor: '#ECEFF1',
      month: false,
      form: {
        selectDate: moment().startOf('month')
      }
    }
  },
  computed: {
    formatMonth () {
      const selectDate = this.form.selectDate || moment().startOf('month')
      return moment(selectDate).format('YYYY 년 MM 월')
    }
  },
  mounted () {
    this.setData()
  },
  methods: {
    /**
     * 이전 / 다음 달 이동
     * @param isPrev 이전 달 클릭 여부
     */
    async changeDate (isPrev = false) {
      try {
        const selectDate = this.form.selectDate || moment().startOf('month').format('YYYY-MM')
        if (isPrev) {
          this.form.selectDate = moment(selectDate).add(-1, 'month').format('YYYY-MM')
        } else {
          this.form.selectDate = moment(selectDate).add(+1, 'month').format('YYYY-MM')
        }
        this.search()
      } catch (e) {}
    },
    /**
     * 검색
     */
    async search () {
      try {
        // 이전 선택값 저장
        this.beforeSelectDate = this.form.selectDate
        this.setData()
      } catch (e) {}
    },
    /**
     * date picker 선택 이벤트
     */
    async inputDate (value) {
      try {
        if (value !== this.beforeSelectDate) {
          this.month = false
          this.search()
        } else {
          this.month = false
        }
      } catch (e) {
        // 이전 값으로 돌린다.
        this.form.selectDate = this.beforeSelectDate
      }
    },
    /**
     * 데이터 조회 - 월력
     */
    async setData () {
      // 월력 데이터 저장 변수선언
      const calendar = [{ items: [] }]
      // 기준일자
      let selectDate = moment().format('YYYY-MM')
      // 기준일자 셋팅
      selectDate = this.form.selectDate || moment().format('YYYY-MM')
      // 월력 첫째 날짜
      const firstDate = moment(selectDate).startOf('month')
      // 월력 첫째 날짜 요일
      const firstDay = moment(firstDate).day()
      // 월력 첫째줄 이전달 계산
      for (let index = 0; index < firstDay; index++) {
        // 이전달 날짜 계산
        const date = moment(moment(firstDate).add(index - firstDay, 'days'))
        let month = ''
        if (index === 0) {
          month = date.format('MMM')
        }
        const isToday = this.today === date.format('YYYY-MM-DD')
        calendar[0].items.push({ date: date.format('YYYY-MM-DD'), label: date.format('D'), month, isToday, bg: this.noMonthColor })
      }
      // 월력 마지막 날짜
      const lastDate = moment(selectDate).endOf('month')
      // 월력 날짜 차이
      const days = moment(lastDate).diff(moment(firstDate), 'days')
      // 월력 만들기
      for (let index = 0; index <= days; index++) {
        // 날짜 계산
        const date = moment(moment(firstDate).add(index, 'days'))
        const day = date.day()
        let month = ''
        if (index === 0) {
          month = date.format('MMM')
        }
        const isToday = this.today === date.format('YYYY-MM-DD')
        // 데이터 조회
        const list = []
        let color = ''
        if (this.form.ptnrList) {
          list.push({ ptnrNo: 0, label: '본사재고', count: Math.floor(Math.random() * 25) })
          for (const ptnr of this.form.ptnrList.ptnrList) {
            list.push({ ptnrNo: ptnr.ptnrNo, label: ptnr.ptnrName, count: Math.floor(Math.random() * 25) })
          }
          // 등록 / 예상 판단 후 bg 다르게 먹임
          color = Math.random() >= 0.5 ? this.registerColor : this.expectColor
        }
        const row = { date: date.format('YYYY-MM-DD'), label: date.format('D'), month, isToday, list: list, color }
        // 일요일 : 0 이면 다음 row 생성
        if (day === 0) {
          calendar.push({ items: [row] })
        } else {
          calendar[calendar.length - 1].items.push(row)
        }
      }
      // 월력 마지막 날짜 요일
      const lastDay = lastDate.day()
      const lastDayGap = 6 - lastDay
      // 월력 마지막줄 다음달 계산
      for (let index = 1; index <= lastDayGap; index++) {
        // 이전달 날짜 계산
        const date = moment(moment(lastDate).add(index, 'days'))
        let month = ''
        if (index === 1) {
          month = date.format('MMM')
        }
        const isToday = this.today === date.format('YYYY-MM-DD')
        calendar[calendar.length - 1].items.push({ date: date.format('YYYY-MM-DD'), label: date.format('D'), month, isToday, bg: this.noMonthColor })
      }
      // 월력 바인딩
      this.calendar = calendar
    }
  }
}
</script>

<style scoped>
  .font-raise {
    font-size: 1rem;
  }
  .border-col:first-child {
    border-top: 1px solid #e0e0e0;
    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
  }
  .border-col:not(:first-child) {
    border-top: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
  }
  .border-row:last-child {
    border-bottom: 1px solid #e0e0e0;
  }
  .day-text {
    padding: 5px 12px 5px 12px;
    font-size: 14px;
  }
  .body-text {
    font-size: 13px;
    border-radius: 5px;
    color: white;
    padding: 1px 8px 1px 8px;
    margin-bottom: 2px;
  }
</style>
