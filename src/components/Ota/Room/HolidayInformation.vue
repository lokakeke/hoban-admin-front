<template>
  <v-container class="pa-0" fluid>
    <v-row>
      <v-col cols="12">
        <v-card flat>
          <v-card-title>
            <span class="heading">휴일정보 등록</span>
          </v-card-title>
          <v-card-text>
            <v-sheet>
              <v-toolbar color="white" flat>
                <v-btn @click="setToday"
                       class="mr-4"
                       color="grey darken-2"
                       outlined
                >
                  오늘
                </v-btn>
                <v-btn @click="prev"
                       color="grey darken-2"
                       fab
                       small
                       text
                >
                  <v-icon small>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn @click="next"
                       color="grey darken-2"
                       fab
                       small
                       text
                >
                  <v-icon small>mdi-chevron-right</v-icon>
                </v-btn>
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <v-spacer />
                <v-radio-group hide-details
                               row
                               v-model="radioType"
                >
                  <v-radio label="전체" value="all" />
                  <v-radio value="store">
                    <template v-slot:label>
                      <div>영업장 코드 <strong class="green--text font-md">■</strong></div>
                    </template>
                  </v-radio>
                  <v-radio value="room">
                    <template v-slot:label>
                      <div>객실유형 코드 <strong class="blue--text font-md">■</strong></div>
                    </template>
                  </v-radio>
                </v-radio-group>
                <v-btn @click="addHoliday" color="info" v-if="writeAuth">
                  휴일추가
                </v-btn>
                <v-btn
                    @click="deleteBatchHoliday"
                    color="error"
                    v-if="writeAuth"
                >
                  휴일삭제
                </v-btn>
                <v-btn @click="resetHoliday" color="accent" v-if="writeAuth">
                  원래대로
                </v-btn>
              </v-toolbar>
            </v-sheet>
            <v-sheet min-height="400">
              <v-calendar
                  :event-color="getEventColor"
                  :event-more="false"
                  :events="eventType"
                  :type="type"
                  @change="updateRange"
                  @click:event="showEvent"
                  locale="ko"
                  ref="calendar"
                  v-model="focus"
              />
            </v-sheet>
            <v-menu
                :activator="selectedElement"
                :close-on-content-click="false"
                min-width="500"
                offset-x
                v-model="selectedOpen"
            >
              <v-card
                  color="white"
                  flat
              >
                <v-toolbar
                    :color="selectedEvent.color"
                    dark
                    height="40"
                >
                  <v-spacer />
                  <v-toolbar-items>
                    <v-tooltip bottom v-if="writeAuth">
                      <template v-slot:activator="{ on }">
                        <v-btn @click="deleteHoliday(selectedEvent)" icon small v-on="on">
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </template>
                      <span>삭제</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn @click="selectedOpen = false" icon small v-on="on">
                          <v-icon>close</v-icon>
                        </v-btn>
                      </template>
                      <span>닫기</span>
                    </v-tooltip>
                  </v-toolbar-items>
                </v-toolbar>
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <span class="body-1 font-weight-bold">{{ selectedEvent.name }}</span>
                    </v-col>
                  </v-row>
                  <v-divider />
                  <v-row>
                    <v-col cols="12">
                      <span class="body-1 font-weight-bold">휴일 : {{ selectedEvent.start }}</span><br />
                    </v-col>
                    <v-col cols="12">
                      <span class="body-1 font-weight-bold">사유 : {{ selectedEvent.memo }}</span>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-menu>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <app-card col-classes="col-12">
        <div class="app-card-title px-0">
          <div class="title font-weight-bold">휴일 리스트</div>
          <v-spacer />
          <v-text-field
              append-icon="mdi-magnify"
              hide-details
              label="검색 (휴일타입, 영업장코드, 객실유형코드, 날짜, 사유)"
              single-line
              v-model="searchHoliday"
          />
        </div>
        <v-data-table :headers="headers"
                      :items="events"
                      :items-per-page="itemsPerPage"
                      :no-data-text="emptyText"
                      :no-results-text="emptyText"
                      :page.sync="page"
                      :search="searchHoliday"
                      @page-count="pageCount = $event"
                      class="bordered"
                      hide-default-footer
        >
          <template v-slot:item.type="{item}">
            {{ item.type === 'store' ? '영업장' : '객실' }}
          </template>
          <template v-slot:item.store="{item}">
            {{ item.storeName }} ({{ item.storeCode }})
          </template>
        </v-data-table>
        <v-pagination :length="pageCount"
                      class="mt-2"
                      v-model="page" />
      </app-card>
    </v-row>
  </v-container>
</template>

<script>
import roomTypeService from '@/api/modules/ota/roomType.service'

export default {
  name: 'HolidayInformation',
  props: {
    isEdit: Boolean,
    storeCodeProp: String
  },
  data: function () {
    return {
      storeInformation: {},

      selectedHolidayOpen: false,
      radioType: 'all',

      focus: '',
      today: moment(new Date()).format('YYYY-MM-DD'),
      type: 'month',
      start: null,
      end: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      originEvents: [],

      roomList: [],
      holidayEditMode: false,
      holiday: '',
      holidayMemo: '',
      searchHoliday: '',

      headers: [
        {
          text: '휴일타입',
          value: 'type',
          align: 'center',
          sortable: false,
          width: '10%'
        },
        {
          text: '영업장 코드',
          value: 'store',
          align: 'center',
          sortable: false,
          width: '15%'
        },
        {
          text: '객실유형 코드',
          value: 'roomType',
          align: 'center',
          sortable: false,
          width: '15%'
        },
        { text: '날짜', value: 'start', align: 'center', sortable: false, width: '20%' },
        { text: '사유', value: 'memo', align: 'center', sortable: false, width: '40%' }
      ],

      page: 1,
      pageCount: 5,
      itemsPerPage: 5
    }
  },
  mounted () {
    this.$refs.calendar.checkChange()
    this.getStoreInformation()
    this.getRoomList()
    if (this.isEdit) this.getEvents()
  },
  computed: {
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

    eventType () {
      return this.radioType === 'all' ? this.events : this.events.filter(event => event.type === this.radioType)
    }
  },
  methods: {
    async getEvents () {
      roomTypeService.selectHolidayList(this.storeCodeProp).then(res => {
        res.data.forEach(event => {
          this.events.push({
            name: event.holidayCode === 'S' ? '영업장 휴일' : `${event.roomTypeName} 휴일`,
            start: moment(event.standardDate).format('YYYY-MM-DD'),
            color: event.holidayCode === 'S' ? 'green' : 'blue',
            type: event.holidayCode === 'S' ? 'store' : 'room',
            memo: event.memo,
            holidayCode: event.holidayCode,
            roomTypeCode: event.roomTypeCode ? event.roomTypeCode : '',
            roomTypeName: event.roomTypeName ? event.roomTypeName : '',
            storeCode: event.storeCode ? event.storeCode : '',
            storeName: event.storeName ? event.storeName : '',
            store: event.storeCode ? `${event.storeName} (${event.storeCode})` : '-',
            roomType: event.roomTypeCode ? `${event.roomTypeName} (${event.roomTypeCode})` : '-'
          })
        })
        this.originEvents = Object.assign([], this.events)
      })
    },

    getEventColor (event) {
      return event.color
    },

    prev () {
      this.$refs.calendar.prev()
    },

    next () {
      this.$refs.calendar.next()
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

    updateRange ({ start, end }) {
      this.start = start
      this.end = end
    },

    setToday () {
      this.focus = this.today
    },

    addHoliday () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Room/HolidayAdd',
        params: {
          events: this.events,
          storeInformation: this.storeInformation,
          roomList: this.roomList,
          selectType: this.radioType
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          dense: true,
          maxWidth: '700'
        }
      })
    },

    deleteBatchHoliday () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Room/HolidayDelete',
        params: {
          events: this.events
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          dense: true,
          maxWidth: '700',
          closeCallback: (params) => {
            if (params) {
              this.events = params
            }
          }
        }
      })
    },

    async getStoreInformation () {
      const response = await roomTypeService.selectRoomTypeInformation(this.storeCodeProp)
      this.storeInformation = response.data
      this.storeInformation.saleStartDate = moment(this.storeInformation.saleStartDate).format('YYYY-MM-DD')
      this.storeInformation.saleEndDate = moment(this.storeInformation.saleEndDate).format('YYYY-MM-DD')
    },

    async getRoomList () {
      const response = await roomTypeService.selectRoomTypeInfoListByStoreCode(this.storeCodeProp)
      this.roomList = response.data.filter(item => item.existYn === 'Y')
    },

    async deleteHoliday (event) {
      try {
        await this.$dialog.confirm('선택한 휴일을 삭제하시겠습니까?')
        let index = -1

        if (event.type === 'store') {
          index = this.events.findIndex(e => e.start === event.start && e.type === event.type && e.storeCode === event.storeCode)
        } else {
          index = this.events.findIndex(e => e.start === event.start && e.type === event.type && e.storeCode === event.storeCode && e.roomTypeCode === event.roomTypeCode)
        }

        if (index === -1) return

        this.events.splice(index, 1)
        this.selectedOpen = false
      } catch {}
    },

    async resetHoliday () {
      const allEqual = arr => arr.every((v, index) => v === this.originEvents[index])
      if (allEqual(this.events)) {
        this.$dialog.alert('변경된 정보가 없습니다.')
      } else {
        await this.$dialog.confirm('수정 전 초기상태로 되돌립니다. 진행하시겠습니까?')
        this.events = Object.assign([], this.originEvents)
      }
    },

    dataProcessing () {
      const submitList = []
      this.events.forEach(event => {
        submitList.push({
          storeCode: this.storeCodeProp,
          standardDate: moment(event.start).format('YYYYMMDD'),
          holidayCode: event.type === 'store' ? 'S' : 'R',
          roomTypeCode: event.roomTypeCode,
          memo: event.memo,
          useYn: 'Y'
        })
      })

      return submitList
    },

    async save () {
      if (this.events.length === 0) {
        this.originEvents = Object.assign([], this.events)
        this.$emit('nextStep', null)
        return
      }

      await roomTypeService.insertHolidayList(this.storeCodeProp, this.dataProcessing())
      this.$emit('nextStep', null)
    },

    async update () {
      await roomTypeService.updateHolidayList(this.storeCodeProp, this.dataProcessing())
      this.originEvents = Object.assign([], this.events)
      this.$dialog.alert('수정이 완료되었습니다.')
    }
  }
}
</script>
