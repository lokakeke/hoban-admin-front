<template>
  <div>
    <v-layout justify-space-between class="mt-3">
      <v-flex class="text-right">
        <div>
          <v-btn outlined rounded color="green" @click="approveSendPrice()">
            <v-icon>check</v-icon>
            전송
          </v-btn>
          <v-btn outlined rounded color="amber darken-4" @click="deleteSendPrice()">
            <v-icon>delete</v-icon>
            삭제
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
    <v-flex xs12 class="mt-3">
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn rounded outlined class="mr-4" @click="setToday">
            Today
          </v-btn>
          <v-btn icon dark color="white darken-2" @click="$refs.calendar.prev()">
            <v-icon left color="black">
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ selectMonthText }}
          </v-toolbar-title>
          <v-btn icon dark color="white darken-2" @click="$refs.calendar.next()">
            <v-icon right color="black">
              mdi-chevron-right
            </v-icon>
          </v-btn>
        </v-toolbar>
      </v-sheet>
      <v-sheet class="sendPriceDetail">
        <v-calendar
          ref="calendar"
          v-model="start"
          :color="'red'"
          :event-color="'rgba(255, 0, 0, 0.5)'"
          :event-text-color="'red'"
          :now="now"
          :weekday-format="weekday => setWeekday(weekday)"
        >
          <template v-slot:day="{ date }">
            <template v-for="priceInfo in priceMap[date]">
              <v-menu
                :key="priceInfo.idx"
                offset-x
              >
                <template v-slot:activator="{ on }">
                  <div v-ripple class="my-event" :class="priceInfo.color"
                       style="white-space: initial;">
                    <span slot="activator" class="font-weight-bold pointer" v-html="priceInfo.priceText"></span>
                  </div>
                </template>
              </v-menu>
            </template>
          </template>
        </v-calendar>
      </v-sheet>
    </v-flex>
  </div>
</template>

<script>
import sendPriceService from '@/api/modules/tl/sendPrice.service'
import moment from 'moment'

export default {
  props: ['dialog', 'sendNo', 'maxPersonCnt'],
  name: 'sendPriceDetailMonthly',
  watch: {
    dialog: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.selectDetail(this.sendNo, this.searchParam)
          this.setToday()
        }
      }
    }
  },
  data() {
    return {
      searchParam: {
        q: {}
      },
      sendPriceList: [],
      pmsPriceList: [],
      start: '',
      now: '1980-01-01',
      priceMap: {},
      colors: ['light-blue lighten-1', 'green lighten-1', 'pink lighten-1',
        'indigo lighten-1', 'cyan lighten-1', 'light-green lighten-1', 'amber lighten-1', 'brown lighten-1',
        'blue lighten-1', 'teal lighten-1', 'lime', 'orange lighten-1', 'blue-grey lighten-1']
    }
  },
  computed: {
    selectMonthText() {
      return moment(this.start, 'YYYY-MM-DD').format('YYYY 년 MM 월')
    }
  },
  methods: {
    setWeekday(weekday) {
      return moment(weekday.date).locale('ko').format('ddd요일')
    },
    selectDetail(sendNo, searchParam) {
      this.sendPriceList = []
      this.pmsPriceList = []
      this.priceMap = {}
      sendPriceService.selectDetail(sendNo, searchParam).then(res => {
        this.sendPriceList = res.data.sendPriceList
        this.pmsPriceList = res.data.pmsPriceList
        this.$nextTick(() => {
          this.setSendPriceMap()
        })
      })
    },
    getPriceValue(value) {
      return this.$options.filters.price(value)
    },
    setToday() {
      this.start = moment().format('YYYY-MM-DD')
    },
    setSendPriceMap() {
      this.priceMap = {}
      let colorIndex = this.rnd(0, this.colors.length - 1)
      let color = this.colors[colorIndex]
      this.colors.splice(colorIndex, 1)

      _.each(this.sendPriceList, (sendPrice, index) => {
        const stndYmd = moment(sendPrice.stndYmd).format('YYYY-MM-DD')
        if (_.toLower(sendPrice.planGroupName) === 'roomonly') {
          let text = ''
          sendPrice.sendPricePersonDetailList.forEach(dtl => {
            text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
              + dtl.personCount + '명 ' + this.getPriceValue(dtl.sendPrice)
          });
          (this.priceMap[stndYmd] = this.priceMap[stndYmd] || []).push({
            idx: '1' + index,
            type: 'TL',
            planGroupName: 'roomonly',
            price: text,
            priceText: '[TL] 룸온리 판매가: ' + text,
            color: color
          })
        }
      })
      _.each(this.sendPriceList, (sendPrice, index) => {
        const stndYmd = moment(sendPrice.stndYmd).format('YYYY-MM-DD')
        if (_.toLower(sendPrice.planGroupName) === 'breakfast') {
          let text = ''
          sendPrice.sendPricePersonDetailList.forEach(dtl => {
            text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
              + dtl.personCount + '명 ' + this.getPriceValue(dtl.sendPrice)
          });
          (this.priceMap[stndYmd] = this.priceMap[stndYmd] || []).push({
            idx: '2' + index,
            type: 'TL',
            planGroupName: 'breakfast',
            price: text,
            priceText: '[TL] 조식포함 판매가: ' + text,
            color: color
          })
        }
      })

      colorIndex = this.rnd(0, this.colors.length - 1)
      color = this.colors[colorIndex]
      this.colors.splice(colorIndex, 1)

      _.each(this.pmsPriceList, (pmsPrice, index) => {
        const stndYmd = moment(pmsPrice.ciYmd).format('YYYY-MM-DD')

        const hasRoomOnly = _.filter(this.priceMap[stndYmd], function (dateInfo) {
          return dateInfo.type === 'TL' && dateInfo.planGroupName === 'roomonly'
        }).length
        const hasBreakfast = _.filter(this.priceMap[stndYmd], function (dateInfo) {
          return dateInfo.type === 'TL' && dateInfo.planGroupName === 'breakfast'
        }).length

        if (hasRoomOnly) {
          let text = ''
          pmsPrice.priceList.forEach(dtl => {
            text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
              + dtl.person + '명 ' + this.getPriceValue(dtl.adultRate)
          });
          (this.priceMap[stndYmd] = this.priceMap[stndYmd] || []).push({
            idx: '3' + index,
            type: 'PMS',
            planGroupName: 'roomonly',
            price: text,
            priceText: '[PMS] 룸온리 판매가: ' + text,
            color: color
          })
          const tlInfo = _.find(this.priceMap[stndYmd], function (dateInfo) {
            return dateInfo.type === 'TL' && dateInfo.planGroupName === 'roomonly'
          })
          const pmsInfo = _.find(this.priceMap[stndYmd], function (dateInfo) {
            return dateInfo.type === 'PMS' && dateInfo.planGroupName === 'roomonly'
          })
          // 금액이 다를 경우 빨간색
          if (tlInfo.price !== pmsInfo.price) {
            tlInfo.color = 'red lighten-1'
            pmsInfo.color = 'red lighten-1'
          }
        }
        if (hasBreakfast) {
          let text = ''
          pmsPrice.priceList.forEach(dtl => {
            text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
              + dtl.person + '명 ' + this.getPriceValue(dtl.adultRate + dtl.pkgAmt)
          });
          (this.priceMap[stndYmd] = this.priceMap[stndYmd] || []).push({
            idx: '4' + index,
            type: 'PMS',
            planGroupName: 'breakfast',
            price: text,
            priceText: '[PMS] 조식포함 판매가: ' + text,
            color: color
          })
          const tlInfo = _.find(this.priceMap[stndYmd], function (dateInfo) {
            return dateInfo.type === 'TL' && dateInfo.planGroupName === 'breakfast'
          })
          const pmsInfo = _.find(this.priceMap[stndYmd], function (dateInfo) {
            return dateInfo.type === 'PMS' && dateInfo.planGroupName === 'breakfast'
          })
          // 금액이 다를 경우 빨간색
          if (tlInfo.price !== pmsInfo.price) {
            tlInfo.color = 'red lighten-1'
            pmsInfo.color = 'red lighten-1'
          }
        }
      })
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    approveSendPrice() {
      this.$dialog.confirm('해당 금액 정보를 전송하시겠습니까?').then(() => {
        sendPriceService.approveSendPrice([this.sendNo]).then(res => {
          this.$dialog.alert('해당 금액 정보를 전송 중입니다. 전송 상태는 알림을 확인해 주세요.').then(() => {
            this.$emit('close')
            this.$emit('refresh')
          })
        })
      }).catch(() => {
      })
    },
    deleteSendPrice() {
      this.$dialog.confirm('해당 금액 정보를 삭제하시겠습니까?').then(() => {
        sendPriceService.deleteSendPrice([this.sendNo]).then(res => {
          this.$dialog.alert('해당 금액 정보가 삭제되었습니다.').then(() => {
            this.$emit('close')
            this.$emit('refresh')
          })
        })
      }).catch(() => {
      })
    }
  },
  mounted() {
    this.start = ''
    this.setToday()
  }
}
</script>

<style lang="scss">
.my-event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  background-color: #1867c0;
  color: #ffffff;
  border: 1px solid #1867c0;
  width: 100%;
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  margin-bottom: 1px;
}

.sendPriceDetail {
  .v-calendar-weekly__week {
    min-height: 150px;
  }
}
</style>
