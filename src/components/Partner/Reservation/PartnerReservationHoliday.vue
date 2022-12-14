<template>
  <div>
    <v-row>
      <v-toolbar color="white" flat dense>
        <v-btn @click="setToday"
               class="mr-4"
               color="grey darken-2"
               outlined>
          오늘
        </v-btn>
        <v-btn @click="prev"
               color="grey darken-2"
               fab
               small
               text>
          <v-icon small>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn @click="next"
               color="grey darken-2"
               fab
               small
               text>
          <v-icon small>mdi-chevron-right</v-icon>
        </v-btn>
        <v-toolbar-title>{{ title }} , 휴일정보</v-toolbar-title>
      </v-toolbar>
    </v-row>
    <v-sheet min-height="auto">
      <v-calendar
        :event-color="getEventColor"
        :event-more="false"
        :events="events"
        :type="'month'"
        @change="updateRange"
        locale="ko"
        ref="calendar"
        v-model="focus"
      />
    </v-sheet>
  </div>
</template>

<script>
import roomTypeService from '@/api/modules/ota/roomType.service'

export default {
  props: {
    storeCode: {
      type: String,
      default () {
        return ''
      }
    },
    roomTypeCode: {
      type: String,
      default () {
        return ''
      }
    },
    checkInDate: {
      type: String,
      default () {
        return ''
      }
    }
  },
  name: 'PartnerReservationHoliday',
  data () {
    return {
      originEvents: [],
      focus: '',
      start: null,
      end: null,
      today: moment().format('YYYY-MM-DD')
    }
  },
  computed: {
    /**
     * 월력 타이틀 지정
     */
    title () {
      const { start, end } = this
      if (!start || !end) return ''
      const startMonth = this.monthFormatter(start)
      const startYear = start.year
      return `${startYear}년 ${startMonth}`
    },
    monthFormatter () {
      return this.$refs.calendar.getFormatter({ timeZone: 'UTC', month: 'long' })
    },
    /**
     * 객실타입 필터링
     */
    events () {
      if (this.originEvents && this.originEvents.length > 0) {
        // 객실타입 코드가 있다면 필터링 : 영업장 휴일 + 선택된 객실타입 만 보이기
        if (this.roomTypeCode) {
          return this.originEvents.filter(data => data.roomTypeCode === null || data.roomTypeCode === this.roomTypeCode)
        } else {
          return this.originEvents
        }
      } else {
        return []
      }
    }
  },
  mounted () {
    // 초기 진입시 검색
    this.searchHoliday()
  },
  watch: {
    /**
     * 영업장 코드가 변경되면 휴일을 다시 검색한다.
     */
    storeCode (newVal) {
      if (newVal) {
        this.searchHoliday()
      }
    },
    /**
     * 입실일자가 변경되면 해당 일자로 월력을 이동한다.
     */
    checkInDate (newVal) {
      if (newVal && moment(newVal).isValid()) {
        this.focus = moment(newVal).format('YYYY-MM-DD')
      }
    }
  },
  methods: {
    /**
     * 휴일 검색
     */
    async searchHoliday () {
      try {
        if (!this.storeCode) {
          return
        }
        const res = await roomTypeService.selectHolidayList(this.storeCode)
        const data = res.data
        const events = []
        data.forEach(event => {
          events.push({
            name: event.holidayCode === 'S' ? '영업장 휴일' : `${event.roomTypeName} 휴일`,
            start: moment(event.standardDate).format('YYYY-MM-DD'),
            color: event.holidayCode === 'S' ? 'green' : 'blue',
            type: event.holidayCode === 'S' ? 'store' : 'room',
            memo: event.memo,
            holidayCode: event.holidayCode,
            roomTypeCode: event.roomTypeCode,
            roomTypeName: event.roomTypeName,
            storeCode: event.storeCode,
            storeName: event.storeName,
            store: `${event.storeName} (${event.storeCode})`,
            roomType: event.roomTypeCode === null ? '-' : `${event.roomTypeName} (${event.roomTypeCode})`
          })
        })
        this.originEvents = events
      } catch (e) {}
    },
    /**
     * 이벤트 색상 지정
     * @param event
     */
    getEventColor (event) {
      return event.color
    },
    /**
     * 월력 이동
     * @param start
     * @param end
     */
    updateRange ({ start, end }) {
      this.start = start
      this.end = end
    },
    /**
     * 오늘 보기
     */
    setToday () {
      this.focus = this.today
    },
    /**
     * 이전달 이동
     */
    prev () {
      this.$refs.calendar.prev()
    },
    /**
     * 다음달 이동
     */
    next () {
      this.$refs.calendar.next()
    }
  }
}
</script>
