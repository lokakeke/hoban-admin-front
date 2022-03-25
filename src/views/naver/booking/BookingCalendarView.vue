<template>
  <v-row wrap>
    <app-card :heading="'예약 현황'" col-classes="col-12">
      <v-alert dense outlined type="error" class="mt-2 font-sm">
        확정 상태인 예약건만 표시됩니다.
      </v-alert>
      <v-form ref="form" lazy-validation autocomplete="off">
        <v-row>
          <v-col lg="6" md="4" sm="12">
            <div class="font-weight-bold subtitle-1 pa-1">서비스 선택</div>
            <v-autocomplete
              v-model="selectBusiness"
              :items="businessCodeList"
              item-value="dmStoreId"
              item-text="serviceName"
              @change="selectItemList"
              autocomplete="off"
              placeholder="서비스를 선택해 주세요."
              return-object dense hide-details
            ></v-autocomplete>
          </v-col>
          <v-col lg="6" md="8" sm="12" v-if="selectBusiness && selectItem.length > 0">
            <div class="font-weight-bold subtitle-1 pa-1">상품 선택<span class="font-sm font-weight-light"> (상품명, 패키지번호, 회원번호로 검색 가능합니다.)</span></div>
            <v-autocomplete
              v-model="selectedItem"
              :items="selectItem"
              item-value="dmItemId"
              :item-text="setItemText"
              autocomplete="off"
              placeholder="상품을 선택해 주세요."
              clearable multiple chips dense deletable-chips small-chips return-object hide-details
              @change="filterItemList"
              class="pt-1"
              no-data-text="데이터가 없습니다"
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
              @change="getEvents"
              @click:event="showEvent"
              v-if="itemList"
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
                <v-row align="center" no-gutters style="padding-top: 1px;">
                  <v-col cols="11" class="pl-1 text-ellipse">
                    {{ event.pkgYn === 'Y' ? '[패키지] ' : '[객실] '}}{{ event.name }}
                  </v-col>
                  <v-col cols="1" class="pr-1 font-weight-bold">
                    {{ event.saleCnt }}
                  </v-col>
                </v-row>
              </template>
            </v-calendar>
            <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
              <v-card color="grey lighten-4" min-width="350px" flat>
                <v-toolbar :color="selectedEvent.color" dark>
                  <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                  <v-btn @click="selectedOpen = false" icon>
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  <span>
                    <li>서비스명 : {{ selectedEvent.dmStoreName }}</li>
                    <li>상품명 : {{ selectedEvent.pkgYn === 'Y' ? '[패키지] ' : '[객실] ' }}{{ selectedEvent.name }}</li>
                    <li>수량 : {{ selectedEvent.saleCnt }}</li>
                  </span>
                </v-card-text>
              </v-card>
            </v-menu>
          </v-sheet>
        </v-col>
      </v-row>
    </app-card>
  </v-row>
</template>

<script>
import itemService from 'Api/modules/naver/item.service'
import service from 'Api/modules/naver/booking.service'

export default {
  name: 'BookingCalendarView',
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
      originEvents: [],
      colors: ['red lighten-1', 'deep-purple lighten-1', 'light-blue lighten-1', 'green lighten-1', 'deep-orange lighten-1', 'pink lighten-1',
        'indigo lighten-1', 'cyan lighten-1', 'light-green lighten-1', 'amber lighten-1', 'brown lighten-1', 'purple lighten-1',
        'blue lighten-1', 'teal lighten-1', 'lime', 'orange lighten-1', 'blue-grey lighten-1'],
      /**
       * 검색
       */
      businessCodeList: [],
      selectBusiness: '',
      itemList: [],
      selectItem: [],
      selectedItem: [],
      moment: moment
    }
  },
  computed: {
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
        const list = [{ serviceName: '전체', dmStoreId: '' }]
        this.businessCodeList = list.concat(res.data)
      })
    },
    /**
     * 상품 리스트 불러오기(월력)
     */
    selectBookingCalendar () {
      const yearMonth = this.start ? this.start.date.substr(0, 7) : moment().format('YYYY-MM')
      const params = {
        yearMonth: yearMonth,
        dmStoreId: this.selectBusiness.dmStoreId
      }
      service.selectBookingCalendar(params).then(res => {
        this.itemList = res.data
        const events = []
        this.itemList.forEach(item => {
          const dateSubtract = moment(item.endDate).diff(item.startDate, 'days')
          events.push({
            dmItemId: item.dmItemId,
            pkgYn: item.pkgYn,
            mid: item.mid,
            name: item.dmItemName,
            dmStoreName: item.dmStoreName,
            saleCnt: item.count,
            sum: null,
            start: moment(item.startDate).format('YYYY-MM-DD'),
            end: moment(item.startDate).add((dateSubtract - 1), 'days').format('YYYY-MM-DD'),
            color: this.colors[this.rnd(0, this.colors.length - 1)]
          })
        })
        this.events = events
        this.originEvents = _.cloneDeep(this.events)
      })
    },
    /**
     * 선택된 서비스 리스트에 대한 상품 리스트 불러오기
     */
    selectItemList () {
      if (this.selectBusiness.dmStoreId) {
        this.selectItem = []
        const param = {
          dmStoreId: this.selectBusiness.dmStoreId,
          filterItem: 'Y',
          sorts: 'recent'
        }
        itemService.selectItemList(param).then(res => {
          if (res.data && res.data.length > 0) {
            this.selectItem = _.sortBy(res.data, 'pkgYn', 'name').reverse()
            // 전체 상품을 가져온 후 예약 현황 조회
            this.$nextTick(() => {
              this.selectBookingCalendar()
            })
          } else {
            this.$dialog.alert('등록된 상품이 없습니다. 상품을 등록해주세요.')
            this.events = []
            this.originEvents = _.cloneDeep(this.events)
          }
        })
      } else {
        this.selectItem = []
        this.selectBookingCalendar()
      }
    },
    filterItemList (selectedItem) {
      if (selectedItem && selectedItem.length > 0) {
        const dmItemIds = _.map(selectedItem, 'dmItemId')
        this.events = []
        for (const item of dmItemIds) {
          this.events = this.events.concat(this.originEvents.filter((event) => {
            return event.dmItemId === item
          }))
        }
        this.events = _.cloneDeep(this.originEvents.filter(data => dmItemIds.some(item => data.dmItemId === item)))
      } else {
        this.events = _.cloneDeep(this.originEvents)
      }
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => {
          this.selectedOpen = true
        }, 10)
      }
      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }
      nativeEvent.stopPropagation()
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
    getEvents ({ start, end }) {
      this.start = start
      this.end = end
      this.$nextTick().then(() => {
        this.selectBookingCalendar()
      })
    },
    getEventColor (event) {
      return event.color
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    setItemText (item) {
      return `${item.pkgYn === 'Y' ? '[패키지]' : '[객실]'} ${item.name} (${item.mid})`
    },
    totalCount (date) {
      return _.sumBy(_.filter(this.events, (item) => {
        return item.start === date
      }), (item) => {
        return Number(item.saleCnt)
      })
    }
  },
  mounted () {
    this.selectServiceList()
    this.selectBookingCalendar()
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
  .v-autocomplete:not(.v-input--is-disabled).v-select.v-text-field input {
    padding: 10px 0px 10px;
  }
</style>
