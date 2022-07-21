<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    persistent
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable>
    <v-card tile>
      <v-card-title class="pa-0">
        <v-toolbar dark flat color="primary">
          <v-toolbar-title>
            <v-row align="center" class="mx-0">
              <span>{{ branchName }} ( {{ startDate }} ~ {{ endDate }} ) 미리보기</span>
            </v-row>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon dark @click="save()">
              <v-icon>check</v-icon>
              저장
            </v-btn>
            <v-btn dark text @click="closeCheck()" title="닫기">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-card-title>
      <v-card-text class="pt-3">
        <v-layout wrap>
          <v-flex xs4 offset-xs4>
            <v-item-group class="text-center">
              <v-item>
                <v-btn icon dark v-if="checkPrev" @click="$refs.calendar.prev()">
                  <v-icon left color="black">
                    keyboard_arrow_left
                  </v-icon>
                </v-btn>
                <v-btn v-else icon dark disabled></v-btn>
              </v-item>
              <v-item>
                <label>{{ selectMonth }}</label>
              </v-item>
              <v-item>
                <v-btn icon dark v-if="checkNext" @click="$refs.calendar.next()">
                  <v-icon left color="black">
                    keyboard_arrow_right
                  </v-icon>
                </v-btn>
                <v-btn v-else icon dark disabled></v-btn>
              </v-item>
            </v-item-group>
          </v-flex>
          <v-flex xs4></v-flex>
          <v-layout justify-center>
            <v-btn rounded color="light-blue lighten-5" @click="condition.useTrue = !condition.useTrue">
              <v-icon left>{{ condition.useTrue ? 'check_circle_outlined' : 'radio_button_unchecked' }}</v-icon>
              판매
            </v-btn>
            <v-btn rounded small color="red lighten-5" @click="condition.useFalse = !condition.useFalse">
              <v-icon left>{{ condition.useFalse ? 'check_circle_outlined' : 'radio_button_unchecked' }}</v-icon>
              중지
            </v-btn>
            <v-divider vertical inset light></v-divider>
            <v-btn rounded small color="indigo accent-4" outlined @click="condition.manualFalse = !condition.manualFalse">
              <v-icon left>{{ condition.manualFalse ? 'check_circle_outlined' : 'radio_button_unchecked' }}</v-icon>
              자동
            </v-btn>
            <v-btn rounded small color="orange accent-4" outlined @click="condition.manualTrue = !condition.manualTrue">
              <v-icon left>{{ condition.manualTrue ? 'check_circle_outlined' : 'radio_button_unchecked' }}</v-icon>
              수동
            </v-btn>
          </v-layout>
          <v-flex xs12 class="mt-3">
            <v-sheet>
              <v-calendar
                ref="calendar"
                v-model="start"
                :start="start"
                :show-month-on-first="false"
                :day-format="date => date.day"
                :weekday-format="weekday => setWeekday(weekday)"
                locale="ko"
                color="primary">
                <template v-slot:day="{ date }">
                  <template v-if="previewData && previewData[date]">
                    <v-list dense>
                      <template v-for="(roomType, roomIndex) in previewData[date]" v-if="checkDisplay(roomType)">
                        <v-divider v-if="roomIndex !== 0" :key="roomType.text + roomIndex" class="ma-0"></v-divider>
                        <v-list-item :key="roomType.text" :class="roomType.sellYn === 'Y' ? 'light-blue lighten-5' : 'red lighten-5'">
                          <v-list-item-content>
                            <v-list-item-title>{{ roomType.text }}-({{ roomType.blockCode }})</v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-action>
                            <v-menu v-model="roomType.focus" bottom left offset-y :close-on-content-click="false" transition="slide-y-transition">
                              <template v-slot:activator="{ on }">
                                <v-btn style="min-width: 50px" v-on="on" rounded outlined small :color="roomType.autoYn === 'Y' ? 'indigo accent-4' : 'orange accent-4'">
                                  {{ roomType.expectStock }}
                                </v-btn>
                              </template>
                              <v-card>
                                <v-flex class="pa-1">
                                  <v-flex v-for="block in roomType.pmsStock" :key="block.blockCode">
                                    재고량 : {{ block.cnt }}
                                  </v-flex>
                                  <v-divider></v-divider>
                                  <template v-if="false">
                                    <v-autocomplete
                                      v-model="roomType.blockCode" :items="roomType.blockList" hide-details color="primary"
                                      label="전송 블럭"
                                      :item-text="'blockCode'"
                                      :item-value="'blockCode'"
                                      @change="blockChange(roomType)"
                                    ></v-autocomplete>
                                  </template>
                                  <v-text-field type="number" label="전송 수량" :disabled="roomType.autoYn === 'Y'" @change="checkAllotment(roomType)" hide-details v-model="roomType.expectStock" suffix="건"></v-text-field>
                                  <v-text-field type="number" label="설정 비율" :disabled="roomType.autoYn === 'N'" @change="setAllotment(roomType)" hide-details v-model="roomType.ratio" suffix="%"></v-text-field>
                                </v-flex>
                                <v-card-actions>
                                  <v-btn rounded small :color="roomType.sellYn === 'Y' ? 'light-blue lighten-5' : 'red lighten-5'" @click="roomType.sellYn = (roomType.sellYn === 'Y'? 'N':'Y')">
                                    {{ roomType.sellYn === 'Y' ? '판매' : '중지' }}
                                  </v-btn>
                                  <v-btn rounded small outlined :color="roomType.autoYn === 'Y' ? 'indigo accent-4' : 'orange accent-4'" @click="roomType.autoYn = (roomType.autoYn === 'Y'? 'N':'Y')">
                                    {{ roomType.autoYn === 'Y' ? '자동' : '수동' }}
                                  </v-btn>
                                  <v-btn rounded small outlined :color="roomType.rsvAutoYn === 'Y' ? 'green lighten-2' : 'brown lighten-2'" @click="roomType.rsvAutoYn = (roomType.rsvAutoYn === 'Y'? 'N':'Y')">
                                    예약 {{ roomType.rsvAutoYn === 'Y' ? '자동' : '수동' }}
                                  </v-btn>
                                </v-card-actions>
                              </v-card>
                            </v-menu>
                          </v-list-item-action>
                        </v-list-item>
                      </template>
                    </v-list>
                  </template>
                </template>
              </v-calendar>
            </v-sheet>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment'
import stockService from '@/api/modules/tl/stock.service'

export default {
  name: 'stockPreview',
  props: ['previewData', 'startDate', 'endDate', 'branchName', 'dialog'],
  data () {
    return {
      start: '',
      originData: {},
      condition: {
        useTrue: true,
        useFalse: true,
        manualTrue: true,
        manualFalse: true
      },
      branchNameInfo: ''
    }
  },
  computed: {
    selectMonth () {
      let text = ''
      if (this.start) {
        text = moment(this.start).format('YYYY 년 MM 월')
      } else {
        text = moment(this.startDate).format('YYYY 년 MM 월')
      }
      return text
    },
    checkPrev () {
      let check = true
      if (moment(this.startDate).startOf('month') >= moment(this.start).startOf('month')) {
        check = false
      }
      return check
    },
    checkNext () {
      let check = true
      if (moment(this.endDate).startOf('month') <= moment(this.start).startOf('month')) {
        check = false
      }
      return check
    }
  },
  watch: {
    startDate: function () {
      this.start = this.startDate
    },
    previewData: function () {
      this.originData = _.cloneDeep(this.previewData)
    }
  },
  methods: {
    setWeekday (weekday) {
      return moment(weekday.date).format('ddd요일')
    },
    blockChange (preview) {
      // 수동인지 자동인지 구분한다.
      if (preview.autoYn === 'Y') {
        this.checkAllotment(preview)
      } else if (preview.autoYn === 'N') {
        this.setAllotment(preview)
      }
    },
    checkAllotment (preview) {
      // pmsStock 를 구한다.
      const pmsStockCount = _.find(preview.pmsStock, { blockCode: preview.blockCode }).cnt
      // 입력 재고가 pms 재고보다 많은지 체크한다.
      if (parseInt(preview.expectStock) > parseInt(pmsStockCount)) {
        this.$dialog.alert('PMS 재고보다 크게 설정할 수 없습니다.<br/>최대 재고량 (' + pmsStockCount + ') 으로 자동 설정됩니다.')
        preview.expectStock = pmsStockCount
      }
    },
    setAllotment (preview) {
      // pmsStockCount 를 구한다.
      const pmsStockCount = _.find(preview.pmsStock, { blockCode: preview.blockCode }).cnt
      preview.expectStock = Math.floor(pmsStockCount * (preview.ratio / 100)) + ''
    },
    checkDisplay (item) {
      let use = false; let manual = false
      // 사용여부
      if (this.condition.useTrue && item.sellYn === 'Y') {
        use = true
      } else if (this.condition.useFalse && item.sellYn === 'N') {
        use = true
      }
      // 수동여부
      if (this.condition.manualTrue && item.autoYn === 'N') {
        manual = true
      } else if (this.condition.manualFalse && item.autoYn === 'Y') {
        manual = true
      }
      return use && manual
    },
    closeCheck () {
      // 변경 내역이 있으면 닫을 것 인지 물어 본다.
      if (!_.isEqual(this.originData, this.previewData)) {
        this.$dialog.confirm('변경된 내용은 저장하지 않으면 반영되지 않습니다.\n미리보기 창을 저장하지 않고 닫으시겠습니까?').then(() => {
          this.$emit('update:dialog', false)
        }, () => {
        })
      } else {
        this.$emit('update:dialog', false)
      }
    },
    save () {
      // 변경 내역이 있으면 저장을 진행한다.
      if (!_.isEqual(this.originData, this.previewData)) {
        this.$dialog.confirm('변경된 내역을 저장 하시겠습니까?').then(() => {
          // 데이터를 만든다.
          // Master : branchNo, tlRmTypeCode, tlNetRmTypeGroupCode, blockCode, roomTypeCode, standardDate, stock, ratio, autoYn, sellYn, rsvAutoYn
          // Detail : branchNo, tlRmTypeCode, tlNetRmTypeGroupCode, blockCode, standardDate, agentCode, agtRmTypeCd, agentSellYn
          const stockData = []
          for (const [key, value] of Object.entries(this.previewData)) {
            for (const room of value) {
              const pmsStockCount = _.find(room.pmsStock, { blockCode: room.blockCode }).cnt
              stockData.push({
                branchNo: room.branchNo,
                tlRmTypeCode: room.tlRmTypeCode,
                tlNetRmTypeGroupCode: room.tlNetRmTypeGroupCode,
                blockCode: room.blockCode,
                roomTypeCode: room.roomTypeCode,
                standardDate: room.standardDate,
                stock: room.expectStock,
                ratio: room.ratio,
                autoYn: room.autoYn,
                sellYn: room.sellYn,
                rsvAutoYn: room.rsvAutoYn,
                pmsStock: pmsStockCount
              })
            }
          }
          stockService.insertStock(stockData).then(res => {
            this.$dialog.alert('재고를 입력하였습니다.')
            this.$emit('reload')
            this.originData = _.cloneDeep(this.previewData)
          })
        }, () => {
        })
      } else {
        this.$dialog.alert('변경된 내역이 없습니다.')
      }
    }
  }
}
</script>
