<template>
  <v-row wrap>
    <app-card :heading="'예약 로그'" col-classes="col-12">
      <v-form ref="form" lazy-validation autocomplete="off">
        <v-row>
          <v-col lg="6" md="4" sm="12">
            <div class="font-weight-bold subtitle-1 pa-1">서비스 선택</div>
            <v-autocomplete
              v-model="selectBusiness"
              :items="businessCodeList"
              item-value="storeId"
              item-text="serviceName"
              @change="selectLogList"
              autocomplete="off"
              placeholder="서비스를 선택해 주세요."
              return-object dense hide-details
            ></v-autocomplete>
          </v-col>
        </v-row>
      </v-form>
      <v-row class="fill-height booking-calendar-view pt-7 pb-10">
        <v-col>
          <v-sheet height="74">
            <v-toolbar flat color="white">
              <v-btn fab small absolute left color="primary" @click="prev">
                <v-icon dark>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn outlined class="mr-4 font-weight-bold" color="primary" @click="setToday">
                <v-icon dark left>today</v-icon>
                오늘
              </v-btn>
              <v-toolbar-title>{{ currentDate }}</v-toolbar-title>
              <v-btn fab small absolute right color="primary" @click="next">
                <v-icon dark>mdi-chevron-right</v-icon>
              </v-btn>
            </v-toolbar>
          </v-sheet>
          <v-sheet min-width="900">
            <v-calendar
              ref="calendar"
              locale="ko"
              v-model="calendar"
              color="info"
              :now="today"
              :type="type"
              :events="events"
              :event-color="getEventColor"
              :event-more="false"
              v-if="businessCodeList.length > 0"
              @change="getEvents"
            >
              <template v-slot:day-label="{ date }">
                <div class="text--disabled pa-1 subtitle-2">
                  <v-chip small class="font-weight-bold">
                    전체 {{ totalCount(date) }}
                  </v-chip>
                  <span class="pa-3 pr-1">{{ moment(date).format('DD') }} 일</span>
                </div>
              </template>
              <template v-slot:event="{ event }">
                <v-row align="center" no-gutters style="padding-top: 1px;" @click="detail(event)">
                  <v-col cols="10" class="text-ellipse pl-2">
                    {{ '[' + event.failStatusName + ']에서 실패' }}
                  </v-col>
                  <v-col cols="2" class="font-weight-bold text-right pr-2">
                    {{ event.saleCnt }}
                  </v-col>
                </v-row>
              </template>
            </v-calendar>
          </v-sheet>
        </v-col>
      </v-row>
    </app-card>
  </v-row>
</template>

<script>
import itemService from '@/api/modules/naver/item.service'
import service from '@/api/modules/naver/bookingLog.service'
import { mapGetters } from 'vuex'

export default {
  name: 'BookingLog',
  data: function () {
    return {
      type: 'month',
      calendar: '',
      start: null,
      end: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [
        {
          name: '',
          saleCnt: 0,
          start: moment().format('YYYY-MM-DD'),
          end: moment().format('YYYY-MM-DD'),
          color: ''
        }
      ],
      colors: ['red lighten-1', 'deep-purple lighten-1', 'light-blue lighten-1', 'green lighten-1', 'deep-orange lighten-1', 'pink lighten-1',
        'indigo lighten-1', 'cyan lighten-1', 'light-green lighten-1', 'amber lighten-1', 'brown lighten-1', 'purple lighten-1',
        'blue lighten-1', 'teal lighten-1', 'lime', 'orange lighten-1', 'blue-grey lighten-1'],
      /**
       * 검색
       */
      businessCodeList: [],
      selectBusiness: '',
      itemList: [],
      moment: moment
    }
  },
  computed: {
    ...mapGetters({
      setStatus: 'naver/setStatus'
    }),
    today () {
      return moment().format('YYYY-MM-DD HH:mm:ss')
    },
    currentDate () {
      const { start, end } = this
      if (!start || !end) {
        return ''
      }
      return `${start.year}년 ${start.month}월 `
    }
  },
  methods: {
    /**
     * 서비스 리스트 불러오기
     */
    selectServiceList () {
      itemService.selectBusinessCodeList().then(res => {
        const list = [{ serviceName: '전체', storeId: '' }]
        this.businessCodeList = list.concat(res.data)
      })
    },
    /**
     * 로그 리스트 불러오기(월력)
     */
    selectLogList () {
      const yearMonth = this.start ? this.start.date.substr(0, 7) : moment().format('YYYY-MM')
      const events = []
      const params = {
        yearMonth: yearMonth,
        storeId: this.selectBusiness.storeId
      }
      service.selectBookingLogCalendar(params).then(res => {
        if (res.data.length <= 0) {
          this.events = []
        } else {
          this.itemList = res.data
          this.itemList.forEach(item => {
            events.push({
              failStatus: item.FAIL_STATUS,
              failStatusName: !item.FAIL_STATUS ? '(없음)' : this.setStatus[item.FAIL_STATUS].text,
              saleCnt: item.COUNT,
              sum: null,
              start: moment(item.FAIL_DATE).format('YYYY-MM-DD'),
              end: moment(item.FAIL_DATE).format('YYYY-MM-DD'),
              color: this.colors[this.rnd(0, this.colors.length - 1)]
            })
          })
          this.events = events
        }
      })
    },
    setToday () {
      this.calendar = this.today
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    /**
     * 날짜별, 예약로그 상태별 목록 조회(월력)
     */
    getEvents ({ start, end }) {
      this.start = start
      this.end = end
      this.$nextTick().then(() => {
        this.selectLogList()
      })
    },
    getEventColor (event) {
      return event.color
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    totalCount (date) {
      return _.sumBy(_.filter(this.events, (item) => {
        return item.start === date
      }), (item) => {
        return Number(item.saleCnt)
      })
    },
    /**
     * 상세 팝업
     */
    detail (event) {
      this.$nextTick(() => {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Naver/BookingLog/BookingLogForm',
          params: {
            form: event
          },
          options: {
            fullscreen: false,
            scrollable: true
          }
        })
      })
    }
  },
  mounted () {
    this.selectServiceList()
  }
}
</script>

<style>
  .v-calendar-weekly__head-weekday {
    padding: 10px;
    font-size: 13px;
    font-weight: bold;
  }
  .booking-calendar-view .v-calendar-weekly__day {
    min-height: 100px;
  }
  .booking-calendar-view .v-calendar-weekly__day-label {
    text-align: right;
  }
  .booking-calendar-view .v-toolbar__content {
    justify-content: center;
  }
</style>
