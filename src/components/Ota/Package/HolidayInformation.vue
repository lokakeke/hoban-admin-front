<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-sheet>
          <v-toolbar flat color="white">
            <v-btn outlined
                   class="mr-4"
                   color="grey darken-2"
                   @click="setToday"
            >
              오늘
            </v-btn>
            <v-btn fab
                   text
                   small
                   color="grey darken-2"
                   @click="prev"
            >
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab
                   text
                   small
                   color="grey darken-2"
                   @click="next"
            >
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer />
            <v-radio-group row
                           hide-details
                           v-model="radioType"
            >
              <v-radio label="전체" value="all" />
              <v-radio value="package">
                <template v-slot:label>
                  <div>패키지 번호 <strong class="red--text font-md">■</strong></div>
                </template>
              </v-radio>
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
            <v-btn
              color="info"
              @click="addHoliday"
              v-if="writeAuth"
            >
              휴일추가
            </v-btn>
            <v-btn
                @click="deleteBatchHoliday"
                color="error"
                v-if="writeAuth"
            >
              휴일삭제
            </v-btn>
            <v-btn
              color="accent"
              @click="resetHoliday"
              v-if="writeAuth"
            >
              원래대로
            </v-btn>
          </v-toolbar>
        </v-sheet>
        <v-sheet min-height="400">
          <v-calendar
            ref="calendar"
            locale="ko"
            v-model="focus"
            :events="eventType"
            :event-color="getEventColor"
            :type="type"
            :event-more="false"
            @click:event="showEvent"
            @change="updateRange"
          />
        </v-sheet>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          min-width="500"
          offset-x
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
                    <v-btn icon small v-on="on" @click="deleteHoliday(selectedEvent)">
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </template>
                  <span>삭제</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn icon small v-on="on" @click="selectedOpen = false">
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
              <template v-if="holidayEditMode">
                <v-row>
                  <v-col cols="12">
                    <vc-date-picker
                      v-model='holiday'
                      :popover="{visibility: 'focus', placement: 'auto', positionFixed: true}"
                      :min-date="packageInformation.saleStartDate"
                      :max-date="packageInformation.saleEndDate"
                    >
                      <v-text-field slot-scope="{ inputProps, inputEvents }"
                                    v-bind="inputProps"
                                    v-on="inputEvents"
                                    hide-details
                                    append-icon="event_note"
                                    label="휴일 수정"
                      >
                      </v-text-field>
                    </vc-date-picker>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field label="휴일지정사유" v-model="holidayMemo" />
                  </v-col>
                </v-row>
              </template>
              <template v-else>
                <v-row>
                  <v-col cols="12">
                    <span class="body-1 font-weight-bold">휴일 : {{ selectedEvent.start }}</span><br />
                  </v-col>
                  <v-col cols="12">
                    <span class="body-1 font-weight-bold">사유 : {{ selectedEvent.memo }}</span>
                  </v-col>
                </v-row>
              </template>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <app-card col-classes="col-12">
        <div class="app-card-title px-0">
            <div class="title font-weight-bold">휴일 리스트</div>
          <v-spacer />
          <v-text-field
              v-model="searchHoliday"
              append-icon="mdi-magnify"
              label="검색 (휴일타입, 영업장코드, 객실유형코드, 날짜, 사유)"
              single-line
              hide-details
          />
        </div>
        <v-data-table :no-data-text="emptyText"
                      :no-results-text="emptyText"
                      :headers="headers"
                      :items="events"
                      :search="searchHoliday"
                      hide-default-footer
                      class="bordered"
                      @page-count="pageCount = $event"
                      :items-per-page="itemsPerPage"
                      :page.sync="page"
        >
          <template v-slot:item.type="{item}">
            {{ item.type === 'package' ? '패키지' : item.type === 'store' ? '영업장' : '객실' }}
          </template>
        </v-data-table>
        <v-pagination v-model="page"
                      :length="pageCount"
                      :total-visible="totalVisible"
                      class="mt-2" />
      </app-card>
    </v-row>
  </v-container>
</template>

<script>
import packageService from '@/api/modules/ota/package.service'

export default {
  name: 'HolidayInformation',
  props: {
    isEdit: Boolean,
    packageNoProp: String
  },
  data: function () {
    return {
      selectedHolidayOpen: false,
      radioType: 'all',
      packageNo: '',

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

      packageInformation: [],
      storeRoomList: [],
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
      itemsPerPage: 5,
      totalVisible: 10
    }
  },
  mounted () {
    this.$refs.calendar.checkChange()
    this.packageNo = this.packageNoProp
    this.getPackageInformation()
    this.getStoreRoomList()
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
      return this.radioType === 'all' ? this.events
        : this.radioType === 'package' ? this.events.filter(event => event.type === 'package')
          : this.radioType === 'store' ? this.events.filter(event => event.type === 'store')
            : this.events.filter(event => event.type === 'room')
    }
  },
  methods: {
    getPackageInformation () {
      packageService.selectRoomPackageInformation(this.packageNo).then((response) => {
        this.packageInformation = response.data
        this.packageInformation.saleStartDate = moment(this.packageInformation.saleStartDate).format('YYYY-MM-DD')
        this.packageInformation.saleEndDate = moment(this.packageInformation.saleEndDate).format('YYYY-MM-DD')
      })
    },

    getStoreRoomList () {
      packageService.selectStoreRoomList(this.packageNo).then((response) => {
        response.data.forEach(data => {
          this.storeRoomList.push({
            ...data,
            roomTypeName: `${data.roomTypeName}`
          })
        })
      })
    },

    getEvents () {
      packageService.selectHolidayList(this.packageNo).then((response) => {
        response.data.forEach(event => {
          this.events.push({
            name: event.hldyCode === 'P' ? '패키지 휴일' : event.holidayCode === 'S' ? `${event.storeName} 휴일` : `${event.storeName} - ${event.roomTypeName} 휴일`,
            start: moment(event.standardDate).format('YYYY-MM-DD'),
            color: event.holidayCode === 'P' ? 'red' : event.holidayCode === 'S' ? 'green' : 'blue',
            type: event.holidayCode === 'P' ? 'package' : event.holidayCode === 'S' ? 'store' : 'room',
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

    dataProcessing () {
      const submitList = []
      this.events.forEach(event => {
        submitList.push({
          packageNo: this.packageNo,
          holidayCode: event.holidayCode,
          memo: event.memo,
          roomTypeCode: event.roomTypeCode,
          roomTypeName: event.roomTypeName,
          standardDate: moment(event.start).format('YYYYMMDD'),
          storeCode: event.storeCode,
          storeName: event.storeName,
          useYn: 'Y'
        })
      })

      if (submitList.length === 0) {
        submitList.push({
          packageNo: this.packageNo,
          holidayCode: '',
          memo: '',
          roomTypeCode: '',
          roomTypeName: '',
          standardDate: '',
          storeCode: '',
          storeName: '',
          useYn: 'Y'
        })
      }

      return submitList
    },

    addHoliday () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Package/HolidayAdd',
        params: {
          events: this.events,
          packageInformation: this.packageInformation,
          storeRoomList: this.storeRoomList,
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

    deleteHoliday (event) {
      this.$dialog.confirm('선택한 휴일을 삭제하시겠습니까?').then(() => {
        let index = -1
        if (event.holidayCode === 'P') {
          index = this.events.findIndex(e => e.start === event.start && e.holidayCode === event.holidayCode)
        } else if (event.holidayCode === 'S') {
          index = this.events.findIndex(e => e.start === event.start && e.holidayCode === event.holidayCode && e.storeCode === event.storeCode)
        } else {
          index = this.events.findIndex(e => e.start === event.start && e.holidayCode === event.holidayCode && e.storeCode === event.storeCode && e.roomTypeCode === event.roomTypeCode)
        }

        if (index === -1) return

        this.events.splice(index, 1)
        this.selectedOpen = false
      })
    },

    deleteBatchHoliday () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Package/HolidayDelete',
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

    modifyHoliday (event) {
      this.holiday = moment(event.start).toDate()
      this.holidayMemo = event.memo
      this.holidayEditMode = true
    },

    resetHoliday () {
      const allEqual = arr => arr.every((v, index) => v === this.originEvents[index])
      if (allEqual(this.events)) {
        this.$dialog.alert('변경된 정보가 없습니다.')
      } else {
        this.$dialog.confirm('수정 전 초기상태로 되돌립니다. 진행하시겠습니까?').then(() => {
          this.events = Object.assign([], this.originEvents)
        })
      }
    },

    async save () {
      if (this.events.length === 0) {
        this.originEvents = Object.assign([], this.events)
        this.$emit('nextStep', 'RoomPackageTypeForm')
        return
      }
      await packageService.insertHolidayList(this.dataProcessing())
      this.$emit('nextStep', 'RoomPackageTypeForm')
    },

    async update () {
      await packageService.updateHolidayList(this.dataProcessing())
      this.originEvents = Object.assign([], this.events)
      this.$dialog.alert('수정이 완료되었습니다.')
    }
  }
}
</script>

<style scoped>

</style>
