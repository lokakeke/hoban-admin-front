<template>
  <div>
    <v-sheet tile height="54" color="grey lighten-3" class="d-flex">
      <v-btn icon class="ma-2" @click="prevCalendar">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <h2 class="mt-4 text-center">
        {{ calendar.nowYmd | date('YYYY년 M월') }}
      </h2>
      <v-spacer></v-spacer>
      <v-btn icon class="ma-2" @click="nextCalendar">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        v-model="calendar.nowYmd"
        ref="calendar"
        locale="ko"
        type="month"
        :weekdays="[0, 1, 2, 3, 4, 5, 6]"
        :events="calendar.events"
        :event-overlap-threshold="30"
        :event-color="getEventColor"
        :event-more="false"
        @click:date="openCalcDayUpdateDialog"
        @click:event="openCalcDayRangeUpdateDialog"
      ></v-calendar>
    </v-sheet>
    <v-row class="mt-3">
      <v-col cols="6" class="body-2">
        <p class="grey--text">
          <v-icon small left>mdi-information</v-icon>
          날짜를 클릭하여 해당 날짜의 성수기, 주말 여부 값을 설정 할 수 있습니다.
        </p>
        <p class="grey--text">
          <v-icon small left>mdi-information</v-icon>
          성수기, 주말 항목을 클릭하여 기간을 설정 할 수 있습니다.
        </p>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-btn color="green" outlined rounded @click="refreshCalcDayList">
          <v-icon left>refresh</v-icon>다시 조회
        </v-btn>
        <v-btn color="info" outlined rounded @click="setAutoWeekend">
          <v-icon left>mdi-calendar-weekend</v-icon>자동 주말설정
        </v-btn>
        <v-btn
          color="info"
          outlined
          rounded
          :disabled="isChanged === false"
          @click="insertCalcDayList"
          v-if="writeAuth"
        >
          <v-icon left>check</v-icon>저장
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import calculationDayService from '@/api/modules/ota/calculationDay.service'

const EVENT_TYPES = [
  { value: 'peak', text: '성수기', color: 'orange' },
  { value: 'wkend', text: '주말', color: 'red' }
]

const DEFAULT_CALC_DAY = {
  ciYmd: null,
  peakYn: 'N',
  wkendYn: 'N'
}

export default {
  name: 'CalcDayCalendar',
  data () {
    return {
      /**
       * 달력 설정
       */
      calendar: {
        // 현재 달력 년월일
        nowYmd: moment().format('YYYY-MM-DD'),
        // 정산 일자 이벤트
        events: []
      },
      /**
       * 정산 일자 목록
       */
      calcDayList: [],
      /**
       * 서버에 저장된 정산 일자 목록
       */
      orgCalcDayList: [],
      /**
       * 변경되었는지 여부
       */
      isChanged: false
    }
  },
  created () {
    this.selectCalcDayList()
  },
  methods: {
    /**
     * 정산 일자 목록 조회
     */
    async selectCalcDayList () {
      const res = await calculationDayService.selectCalcDayList(moment(this.calendar.nowYmd).format('YYYYMM'))
      this.calcDayList = res.data || []
      this.orgCalcDayList = _.cloneDeep(this.calcDayList)
      this.isChanged = false
      this.setCalendarEvents()
    },
    /**
     * 정산 일자 목록 다시 조회
     */
    async refreshCalcDayList () {
      try {
        await this.$dialog.confirm('설정된 정산 일자를 다시 조회하시겠습니까?')
        this.selectCalcDayList()
        this.$dialog.alert('정산 일자를 다시 조회하였습니다.')
      } catch {
        // no action
      }
    },
    /**
     * 정산 일자 이벤트 설정
     */
    setCalendarEvents () {
      const events = []
      const tempEvent = {
        peak: null,
        wkend: null
      }
      this.calcDayList.forEach((calcDay, calcDayIndex) => {
        EVENT_TYPES.forEach(eventType => {
          if (tempEvent[eventType.value]) {
            const endDate = moment(tempEvent[eventType.value].end).format('D')
            const itemDate = moment(calcDay.ciYmd).format('D')
            const isPushEvent = itemDate - endDate > 1
            if (isPushEvent) {
              events.push(tempEvent[eventType.value])
              tempEvent[eventType.value] = null
            }
          }
          if (calcDay[`${eventType.value}Yn`] === 'Y') {
            if (!tempEvent[eventType.value]) {
              tempEvent[eventType.value] = {
                name: eventType.text,
                start: moment(calcDay.ciYmd).format('YYYY-MM-DD'),
                color: eventType.color,
                timed: false
              }
            }
            tempEvent[eventType.value].end = moment(calcDay.ciYmd).format('YYYY-MM-DD')
          } else if (tempEvent[eventType.value]) {
            events.push(tempEvent[eventType.value])
            tempEvent[eventType.value] = null
          }
        })
        if (this.calcDayList.length === calcDayIndex + 1) {
          if (tempEvent.peak) {
            events.push(tempEvent.peak)
          }
          if (tempEvent.wkend) {
            events.push(tempEvent.wkend)
          }
        }
      })
      this.calendar.events = events
    },
    /**
     * 이전 달력
     */
    async prevCalendar () {
      try {
        if (this.isChanged === true) {
          await this.$dialog.confirm('수정된 일정이 있습니다. 달력을 이동하면 수정된 항목이 사라집니다. 정말 이동하시겠습니까?')
        }
        this.$refs.calendar.prev()
        this.selectCalcDayList()
      } catch {
        // no action
      }
    },
    /**
     * 다음 달력
     */
    async nextCalendar () {
      try {
        if (this.isChanged === true) {
          await this.$dialog.confirm('수정된 일정이 있습니다. 달력을 이동하면 수정된 항목이 사라집니다. 정말 이동하시겠습니까?')
        }
        this.$refs.calendar.next()
        this.selectCalcDayList()
      } catch {
        // no action
      }
    },
    /**
     * 이벤트 색상 가져오기
     */
    getEventColor (event) {
      return event.color
    },
    /**
     * 정산 일자 수정 Dialog 열기
     */
    openCalcDayUpdateDialog ({ date }) {
      const ciYmd = moment(date).format('YYYYMMDD')
      const calcDay = this.calcDayList.find(calcDayItem => {
        return calcDayItem.ciYmd === ciYmd
      }) || {
        ciYmd,
        peakYn: 'N',
        wkendYn: 'N'
      }
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Calculation/Day/CalcDayUpdateDialog.vue',
        params: {
          calcDay
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 300,
          closeCallback: (params) => {
            if (params && params.calcDay) {
              if (params.calcDay.peakYn === 'N' && params.calcDay.wkendYn === 'N') {
                const deleteIdx = this.calcDayList.findIndex(calcDay => calcDay.ciYmd === params.calcDay.ciYmd)
                if (deleteIdx > -1) this.calcDayList.splice(deleteIdx, 1)
              } else {
                let isExist = false
                this.calcDayList.some(calcDay => {
                  if (calcDay.ciYmd === params.calcDay.ciYmd) {
                    isExist = true
                    calcDay.peakYn = params.calcDay.peakYn
                    calcDay.wkendYn = params.calcDay.wkendYn
                  }
                  return isExist
                })
                if (isExist === false) {
                  this.calcDayList.push(params.calcDay)
                  this.calcDayList.sort((a, b) => a.ciYmd - b.ciYmd)
                }
              }
              this.setCalendarEvents()
              this.checkChangeCalcDayList()
            }
          }
        }
      })
    },
    /**
     * 정산 일자 기간 수정 Dialog 열기
     */
    openCalcDayRangeUpdateDialog ({ event }) {
      const orgEventStartYmd = moment(event.start).format('YYYYMMDD')
      const orgEventEndYmd = moment(event.end).format('YYYYMMDD')
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Calculation/Day/CalcDayRangeUpdateDialog.vue',
        params: {
          ciYmdRange: [orgEventStartYmd, orgEventEndYmd],
          typeText: event.name
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 300,
          closeCallback: (params) => {
            if (params && params.ciYmdRange) {
              const eventValue = EVENT_TYPES.find(type => {
                return type.text === event.name
              }).value
              for (let eventYmd = orgEventStartYmd; eventYmd <= orgEventEndYmd; eventYmd = moment(eventYmd).add(1, 'days').format('YYYYMMDD')) {
                this.calcDayList.some((calcDay, calcDayIndex) => {
                  if (calcDay.ciYmd === eventYmd) {
                    calcDay[`${eventValue}Yn`] = 'N'
                    if (calcDay.peakYn === 'N' && calcDay.wkendYn === 'N') {
                      this.calcDayList.splice(calcDayIndex, 1)
                    }
                    return true
                  }
                  return false
                })
              }
              const eventStartYmd = moment(params.ciYmdRange[0]).format('YYYYMMDD')
              const eventEndYmd = moment(params.ciYmdRange[1]).format('YYYYMMDD')
              for (let eventYmd = eventStartYmd; eventYmd <= eventEndYmd; eventYmd = moment(eventYmd).add(1, 'days').format('YYYYMMDD')) {
                let isExist = false
                this.calcDayList.some(calcDay => {
                  if (calcDay.ciYmd === eventYmd) {
                    isExist = true
                    calcDay[`${eventValue}Yn`] = 'Y'
                  }
                  return isExist
                })
                if (isExist === false) {
                  const calcDay = _.cloneDeep(DEFAULT_CALC_DAY)
                  calcDay.ciYmd = eventYmd
                  calcDay[`${eventValue}Yn`] = 'Y'
                  this.calcDayList.push(calcDay)
                  this.calcDayList.sort((a, b) => a.ciYmd - b.ciYmd)
                }
              }
              this.setCalendarEvents()
              this.checkChangeCalcDayList()
            }
          }
        }
      })
    },
    /**
     * 정산 일자가 변경되었는지 확인
     */
    checkChangeCalcDayList () {
      let isChanged = false
      this.calcDayList.sort((a, b) => a.ciYmd - b.ciYmd)
      this.orgCalcDayList.sort((a, b) => a.ciYmd - b.ciYmd)
      if (this.calcDayList.length !== this.orgCalcDayList.length) {
        isChanged = true
      } else {
        this.calcDayList.some((calcDay, calcDayIndex) => {
          const orgCalcDay = this.orgCalcDayList[calcDayIndex]
          isChanged = Boolean(!orgCalcDay || calcDay.ciYmd !== orgCalcDay.ciYmd || calcDay.peakYn !== orgCalcDay.peakYn || calcDay.wkendYn !== orgCalcDay.wkendYn)
          return isChanged
        })
      }
      this.isChanged = isChanged
    },
    /**
     * 정산 일자 목록 등록
     */
    async insertCalcDayList () {
      const res = await calculationDayService.insertCalcDayList(moment(this.calendar.nowYmd).format('YYYYMM'), this.calcDayList)
      if (res.data) {
        this.$dialog.alert('정산 일자가 저장되었습니다.')
        this.selectCalcDayList()
      }
    },
    /**
     * 주말 자동 설정하기
     */
    async setAutoWeekend () {
      try {
        await this.$dialog.confirm('현재 달력의 금, 토요일을 주말로 자동 설정합니다. 계속 진행하시겠습니까?')
        this.calcDayList.forEach(calcDay => {
          calcDay.wkendYn = 'N'
        })
        _.remove(this.calcDayList, calcDay => {
          return calcDay.peakYn === 'N' && calcDay.wkendYn === 'N'
        })
        const calcDayMap = {}
        this.calcDayList.forEach(calcDay => {
          calcDayMap[calcDay.ciYmd] = calcDay
        })
        const nowYm = moment(this.calendar.nowYmd).format('YYYYMM')
        const tempDateObj = moment(nowYm + '01')
        while (tempDateObj.format('YYYYMM') === nowYm) {
          if (tempDateObj.day() >= 5) {
            const ciYmd = tempDateObj.format('YYYYMMDD')
            if (calcDayMap[ciYmd]) {
              calcDayMap[ciYmd].wkendYn = 'Y'
            } else {
              calcDayMap[ciYmd] = {
                ciYmd,
                peakYn: 'N',
                wkendYn: 'Y'
              }
            }
          }
          tempDateObj.add(1, 'days')
        }
        this.calcDayList = []
        Object.keys(calcDayMap).forEach(ciYmd => {
          this.calcDayList.push(calcDayMap[ciYmd])
        })
        this.calcDayList.sort((a, b) => a.ciYmd - b.ciYmd)
        this.setCalendarEvents()
        this.checkChangeCalcDayList()
        this.$dialog.alert('자동으로 주말이 설정되었습니다. 우측 하단의 "저장" 버튼을 눌러야 서버에 반영됩니다.')
      } catch {
        // no action
      }
    }
  }
}
</script>
