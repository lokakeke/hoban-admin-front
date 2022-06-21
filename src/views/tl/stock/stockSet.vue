<template>
  <div>
    <v-container fluid pt-0>
      <app-card xs12>
        <div v-show="!menuRoomType" :key="1">
          <v-layout row wrap>
            <v-flex xs12>
              <h4 class="headline">기간선택</h4>
              <v-divider></v-divider>
              <v-layout align-center>
                <div class="mt-1 ml-2">
                  <v-radio-group v-model="param.setStockYn" row @change="param.brcNo ? branchChange() : () => {}">
                    <v-radio label="재고" value="Y"></v-radio>
                    <v-radio label="금액" value="N"></v-radio>
                  </v-radio-group>
                </div>
                <branch-list :brcNo.sync="param.brcNo" :branchList.sync="branchList" :branchName.sync="param.branchName" @change="branchChange()"></branch-list>
                <vc-date-picker class="ml-2" :min-date="new Date()" :max-date="maxDate" :columns="2" @drag="getMaxDate($event)"
                                mode='range' v-model='param.selectDate' :popover="{visibility: 'focus'}">
                  <v-text-field slot-scope="{ inputProps, inputEvents }" v-bind="inputProps" v-on="inputEvents" @click:append-outer="param.selectDate = null"
                                append-icon="zmdi zmdi-calendar-note" placeholder="기간을 선택하세요."
                                :append-outer-icon="param.selectDate ? 'clear': ''" readonly></v-text-field>
                </vc-date-picker>
              </v-layout>
            </v-flex>
            <v-flex md12 xs12>
              <v-layout class="ml-2">
                <template v-for="day of days">
                  <v-checkbox :key="day.key" v-model="day.value" :label="day.text"
                              hide-details :color="day.color" class="mt-2"
                  ></v-checkbox>
                </template>
                <v-btn class="ml-4" rounded color="primary" @click="search()">
                  <v-icon>add</v-icon>
                  기간 적용
                </v-btn>
                <v-btn rounded outlined color="primary" @click="refresh()">
                  <v-icon>refresh</v-icon>
                  재설정
                </v-btn>
              </v-layout>
            </v-flex>
            <vc-date-picker is-inline :columns="$screens({xl:4, lg: 3, md: 2, sm:1})" :min-date="new Date()" :max-date="maxDate" mode="multiple" v-model="dates" class="mt-2"></vc-date-picker>
          </v-layout>
          <v-layout row wrap class="mt-2">
            <v-icon color="#3182ce">lens</v-icon>
            선택된 날짜
          </v-layout>
          <v-divider></v-divider>
          <v-layout row wrap>
            <v-btn middle rounded @click="setRoomType()" color="primary">
              <v-icon>navigate_next</v-icon>
              다음 단계
            </v-btn>
          </v-layout>
        </div>
        <div v-show="menuRoomType" :key="2">
          <v-layout row wrap class="ml-1 mr-1">
            <v-flex xs12 sm3>
              <div>
                <v-icon color="green" class="mr-2">done_outlined</v-icon>
                사업장
              </div>
              <div class="mt-2">[{{ param.pkgYn === 'N' ? '객실' : '패키지' }}] {{ param.branchName }}</div>
            </v-flex>
            <v-flex xs12 sm6>
              <div>
                <v-icon color="green" class="mr-2">done_outlined</v-icon>
                기간
              </div>
              <div class="mt-2" v-html="datesText"></div>
            </v-flex>
            <v-flex xs12 sm3>
              <v-layout>
                <v-spacer></v-spacer>
                <v-btn class="mt-3" rounded color="primary" @click="modifyPeriod()">
                  <v-icon left>edit</v-icon>
                  수정
                </v-btn>
              </v-layout>
            </v-flex>
          </v-layout>
        </div>
      </app-card>
      <app-card xs12 class="mt-3">
        <v-form ref="form" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12>
              <div class="ml-2">업데이트 선택</div>
              <template v-if="param.setStockYn === 'Y'">
                <v-subheader v-if="menuRoomType" class="mt-1">
                  <v-icon>priority_high</v-icon>
                  공백으로 비워둔 필드에는 변경이 적용되지 않습니다.
                </v-subheader>
                <v-subheader v-if="menuRoomType" class="mt-1">
                  <v-icon>priority_high</v-icon>
                  수동입력 시 직접 재고량을 입력할 수 있습니다.
                </v-subheader>
                <v-divider v-if="menuRoomType"></v-divider>
              </template>
              <template v-else>
                <v-subheader v-if="menuRoomType" class="mt-1">
                  <v-icon>priority_high</v-icon>
                  PLAN GROUP NAME 에 roomonly 또는 breakfast 로 등록된 PLAN GROUP 금액 정보만 업데이트 됩니다.
                </v-subheader>
                <v-divider v-if="menuRoomType"></v-divider>
              </template>
            </v-flex>
            <template v-if="menuRoomType">
              <template v-if="param.setStockYn === 'Y'">
                <v-flex xs12 sm6 md4 lg3 v-for="(room,index) of roomTypeList" :key="room.tlRmTypeCode" class="pa-2">
                  <v-hover>
                    <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 5 : 2}` + (room.active ? ' cyan lighten-4' : '')">
                      <v-card-text>
                        <span class="subtitle-1 font-weight-bold pa-0">
                          {{ room.tlRmTypeName }} - ({{ room.tlNetRmTypeGroupName }})
                        </span>
                      </v-card-text>
                      <v-card-text v-show="false">
                        <v-autocomplete
                          v-model="room.rsvBlockCode" :items="room.blockList" hide-details color="primary"
                          :item-text="'blockCode'"
                          :item-value="'blockCode'" label="재고 블럭" placeholder="재고 블럭을 선택해주세요."
                        ></v-autocomplete>
                      </v-card-text>
                      <v-card-text class="pt-0 pb-0">
                        <v-text-field type="number" :rules="rateRules" ref="rate" v-model="room.ratio" label="비율" suffix="%" :disabled="!room.autoYn"></v-text-field>
                        <v-spacer></v-spacer>
                        <v-text-field type="number" :rules="allotmentRules" ref="allotment" v-model="room.stock" label="재고량" suffix="건" :disabled="room.autoYn"></v-text-field>
                      </v-card-text>
                      <v-card-actions class="justify-end">
                        <v-btn rounded small :color="room.sellYn? 'light-blue lighten-2' : 'red lighten-3'" @click="room.sellYn = !room.sellYn">
                          <v-icon left>check_circle_outlined</v-icon>
                          {{ room.sellYn ? '판매' : '중지' }}
                        </v-btn>
                        <v-btn rounded small outlined :color="room.autoYn? 'indigo accent-4' : 'orange accent-4'" @click="manualChange(room, index)">
                          <v-icon left>check_circle_outlined</v-icon>
                          {{ room.autoYn ? '자동' : '수동' }}
                        </v-btn>
                        <v-btn rounded small outlined :color="room.rsvAutoYn? 'indigo accent-4' : 'orange accent-4'" @click="room.rsvAutoYn = !room.rsvAutoYn">
                          <v-icon left>check_circle_outlined</v-icon>
                          {{ room.rsvAutoYn ? '예약 자동' : '예약 수동' }}
                        </v-btn>
                      </v-card-actions>
                      <v-divider class="ma-0" v-if="index === 0"></v-divider>
                    </v-card>
                  </v-hover>
                </v-flex>
                <v-flex xs12>
                  <div class="mt-2">
                    <v-btn rounded color="warning" @click="showDialog">
                      <v-icon>zoom_in</v-icon>
                      미리보기
                    </v-btn>
                    <v-btn rounded color="primary" @click="validateStock">
                      <v-icon>check</v-icon>
                      저장
                    </v-btn>
                  </div>
                </v-flex>
              </template>
              <template v-else>
                <v-flex xs12 sm6 md4 lg3 v-for="room of roomTypeList" :key="room.tlRmTypeCode" class="pa-2">
                  <v-hover>
                    <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 5 : 2}`" :color="(room.priceYn ? 'cyan lighten-4' : (room.isVisible ? '' : 'grey lighten-3'))">
                      <v-card-text>
                        <span class="subtitle-1 font-weight-bold pa-0">
                          {{ room.tlRmTypeName }} - ({{ room.tlNetRmTypeGroupName }})
                        </span>
                      </v-card-text>
                      <v-card-actions class="justify-end">
                        <v-btn v-if="room.isVisible" rounded small :color="room.priceYn ? 'light-blue lighten-2' : 'red lighten-3'" @click="room.priceYn = !room.priceYn">
                          <v-icon left>{{ room.priceYn ? 'check_circle_outlined' : 'radio_button_unchecked' }}</v-icon>
                          {{ room.priceYn ? '선택' : '미선택' }}
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-hover>
                </v-flex>
                <v-flex xs12>
                  <div class="mt-2 ml-2">
                    <v-btn rounded color="primary" @click="validatePrice">
                      <v-icon>check</v-icon>
                      저장
                    </v-btn>
                  </div>
                </v-flex>
              </template>
            </template>
          </v-layout>
        </v-form>
      </app-card>
      <v-dialog fullscreen transition="dialog-bottom-transition" v-model="dialog">
        <v-card tile>
          <v-card-title class="pa-0">
            <v-toolbar dark color="primary">
              <v-btn icon dark @click="dialog = false">
                <v-icon>close</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-toolbar-title>대규모 업데이트 내역 미리보기</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark text @click="dialog = false">Close</v-btn>
              </v-toolbar-items>
            </v-toolbar>
          </v-card-title>
          <v-card-text class="pt-3">
            <v-layout wrap>
              <v-flex xs12 sm3>
                <div>
                  <v-icon color="green" class="mr-2">done_outlined</v-icon>
                  사업장
                </div>
                <div class="mt-2">[{{ param.pkgYn === 'N' ? '객실' : '패키지' }}] {{ param.branchName }}</div>
              </v-flex>
              <v-flex xs12 sm6>
                <div>
                  <v-icon color="green" class="mr-2">done_outlined</v-icon>
                  기간
                </div>
                <div class="mt-2" v-html="datesText"></div>
              </v-flex>
              <v-flex xs12 sm3>
                <v-layout>
                  <v-spacer></v-spacer>
                  <v-btn class="mt-3" rounded color="primary" @click="validateStock">
                    <v-icon>check</v-icon>
                    저장
                  </v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row wrap>
              <template v-for="room of filterData">
                <v-flex xs12 sm6 md4 lg3 :key="room.tlRmTypeCode" class="pa-2">
                  <v-hover>
                    <v-card color="cyan lighten-4" slot-scope="{ hover }" :class="`elevation-${hover ? 5 : 2}`">
                      <v-card-text>
                        <span class="subtitle-1 font-weight-bold pa-0">
                          {{ room.tlRmTypeName }} - ({{ room.tlNetRmTypeGroupName }})<!-- - {{room.rsvBlockCode}} 블럭-->
                        </span>
                      </v-card-text>
                      <v-card-actions class="pt-0">
                          <v-label>
                              {{ room.autoYn === 'N' && room.stock ? room.stock + ' 건 /&nbsp;' : room.ratio ? room.ratio + ' % /&nbsp;' : '' }}
                          </v-label>
                          <v-btn rounded small :color="room.sellYn === 'Y' ? 'light-blue lighten-2' : 'red lighten-3'">
                            <v-icon left>check_circle_outlined</v-icon>
                            {{ room.sellYn === 'Y' ? '판매' : '중지' }}
                          </v-btn>
                          &nbsp;&nbsp;/
                          <v-btn rounded small outlined :color="room.autoYn === 'N' ? 'orange accent-4' : 'indigo accent-4'">
                            <v-icon left>check_circle_outlined</v-icon>
                            {{ room.autoYn === 'N' ? '수동' : '자동' }}
                          </v-btn>
                          &nbsp;&nbsp;/
                          <v-btn rounded small outlined :color="room.rsvAutoYn === 'Y' ? 'indigo accent-4' : 'orange accent-4'">
                            <v-icon left>check_circle_outlined</v-icon>
                            {{ room.rsvAutoYn === 'Y' ? '예약 자동' : '수동' }}
                          </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-hover>
                </v-flex>
              </template>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import BranchList from '@/components/Branch/BranchList.vue'
import moment from 'moment'
import roomTypeService from '@/api/modules/tl/roomType.service'
import stockService from '@/api/modules/tl/stock.service'
import priceService from '@/api/modules/tl/price.service'

export default {
  name: 'stockSet',
  components: { BranchList },
  data () {
    return {
      // 검색조건
      param: {
        // 사업장
        brcNo: '',
        branchName: '',
        // 기간
        selectDate: {},
        pkgYn: 'N',
        setStockYn: 'Y'
      },
      rateRules: [
        v => (!v || (v > -1 && v <= 100)) || '0~100% 만 허용됩니다.'
      ],
      allotmentRules: [
        v => (!v || v > -1) || '0건 이상만 허용됩니다.'
      ],
      maxDate: null,
      menuRoomType: false,
      days: [
        { value: true, key: 0, text: '일요일', color: 'red' },
        { value: true, key: 1, text: '월요일', color: 'green' },
        { value: true, key: 2, text: '화요일', color: 'green' },
        { value: true, key: 3, text: '수요일', color: 'green' },
        { value: true, key: 4, text: '목요일', color: 'green' },
        { value: true, key: 5, text: '금요일', color: 'green' },
        { value: true, key: 6, text: '토요일', color: 'blue' }
      ],
      dates: [],
      // 사업장 목록
      branchList: [],
      // TL-LINCOLN 객실 타입
      roomTypeList: [],
      dialog: false
    }
  },
  computed: {
    datesText () {
      let text = ''
      this.dates.sort((d1, d2) => new Date(d1).getTime() - new Date(d2).getTime())
      text += moment(_.first(this.dates)).format('YYYY 년 MM월 DD일') + ' ~ ' + moment(_.last(this.dates)).format('YYYY 년 MM월 DD일') + ' / <span class="red--text lighten-4">' + this.dates.length + '일이 선택 되었습니다.</span>'
      return text
    },
    filterData () {
      const filterData = []
      for (const room of this.roomTypeList) {
        if (room.stock || room.ratio || !room.sellYn) {
          room.active = true
          filterData.push({
            brcNo: this.param.brcNo,
            tlRmTypeName: room.tlRmTypeName,
            tlRmTypeCode: room.tlRmTypeCode,
            tlNetRmTypeGroupCode: room.tlNetRmTypeGroupCode,
            tlNetRmTypeGroupName: room.tlNetRmTypeGroupName,
            rsvBlockCode: room.rsvBlockCode,
            rmTypeCd: room.rmTypeCd,
            stock: room.stock,
            ratio: room.ratio,
            autoYn: room.autoYn ? 'Y' : 'N',
            sellYn: room.sellYn ? 'Y' : 'N',
            rsvAutoYn: room.rsvAutoYn ? 'Y' : 'N'
          })
        } else {
          room.active = false
        }
      }
      return filterData
    }
  },
  methods: {
    init () {
      this.dates = []
      // TL-LINCOLN 객실 타입
      this.roomTypeList = []
      this.dialog = false
      this.menuRoomType = false
      this.param = {
        // 사업장
        brcNo: '',
        branchName: '',
        // 기간
        selectDate: { start: null, end: null },
        pkgYn: 'N',
        setStockYn: 'Y'
      }
    },
    branchChange () {
      // 초기화
      this.roomTypeList = []
      roomTypeService.selectRoomTypeSync(this.param.brcNo, this.param.pkgYn).then(res => {
        // 싱크가 맞으면 진행한다.
        if (!res.data) {
          // 초기화
          this.$dialog.alert('해당 사업장(' + this.param.branchName + ')의<br/>객실타입마스터 싱크가 맞지 않습니다.')
          this.init()
        } else {
          roomTypeService.selectRoomTypeList({
            brcNo: this.param.brcNo,
            useYn: 'Y',
            pkgYn: this.param.pkgYn
          }).then(res => {
            const roomTypeList = res.data
            if (roomTypeList && roomTypeList.length > 0) {
              for (const roomType of roomTypeList) {
                // 데이터를 셋팅해준다.
                if (this.param.setStockYn === 'Y') {
                  roomType.rsvBlockCode = roomType.blockList && roomType.blockList.length > 0 ? roomType.blockList[0].blockCode : ''
                  roomType.stock = ''
                  roomType.ratio = ''
                  roomType.autoYn = true
                  roomType.sellYn = true
                  roomType.rsvAutoYn = true
                } else {
                  roomType.priceYn = false
                  roomType.isVisible = _.some(roomType.planList, function (plan) {
                    return _.toLower(plan.planGroupName) === 'breakfast' || _.toLower(plan.planGroupName) === 'roomonly'
                  })
                }
              }
            }
            this.roomTypeList = roomTypeList
          })
        }
      })
    },
    showDialog () {
      if (this.filterData.length === 0) {
        this.$dialog.alert('입력할 데이터가 없습니다.')
      } else {
        this.dialog = true
      }
    },
    async validateStock () {
      await this.validForm(this.$refs.form)
      // 입력건 체크
      if (this.filterData.length === 0) {
        this.$dialog.alert('입력할 데이터가 없습니다.')
      } else {
        for (const type of this.filterData) {
          if (!type.rsvBlockCode) {
            this.$dialog.alert(type.tlRmTypeName + ' 의 재고 블럭을 지정해 주세요.')
            return
          }
        }
        this.$dialog.confirm('재고량을 입력하시겠습니까?').then(() => {
          // dates array 를 YYYYMMDD 형태로 만든다.
          const dateArray = []
          for (const date of this.dates) {
            dateArray.push(moment(date).format('YYYYMMDD'))
          }
          let tlRmTypeCodes = []
          for (const row of this.filterData) {
            tlRmTypeCodes.push(row.tlRmTypeCode)
          }
          tlRmTypeCodes = [...new Set(tlRmTypeCodes)]
          stockService.updateStockSet({
            stockList: this.filterData,
            dateList: dateArray,
            brcNo: this.param.brcNo,
            tlRmTypeCodes: tlRmTypeCodes,
            pkgYn: this.param.pkgYn
          }).then(res => {
            this.$dialog.alert('저장되었습니다.')
            this.init()
          })
        }, () => {
        })
      }
    },
    validatePrice () {
      const filterData = _.filter(this.roomTypeList, { priceYn: true })
      if (filterData.length === 0) {
        this.$dialog.alert('선택된 객실이 없습니다.')
      } else {
        this.$dialog.confirm('금액 데이터를 생성하시겠습니까?').then(() => {
          // dates array 를 YYYYMMDD 형태로 만든다.
          const dateArray = []
          for (const date of this.dates) {
            dateArray.push(moment(date).format('YYYYMMDD'))
          }
          let tlRmTypeCodes = []
          for (const row of filterData) {
            tlRmTypeCodes.push(row.tlRmTypeCode)
          }
          tlRmTypeCodes = [...new Set(tlRmTypeCodes)]
          priceService.updatePriceSet({
            dateList: dateArray,
            brcNo: this.param.brcNo,
            tlRmTypeCodes: tlRmTypeCodes,
            pkgYn: this.param.pkgYn
          }).then(res => {
            this.$dialog.alert('금액 데이터 생성 완료 후 알림이 옵니다. 알림이 오면 확인해주세요.')
            this.init()
          })
        }, () => {
        })
      }
    },
    getMaxDate (range) {
      if (range && range.start) {
        this.maxDate = moment(range.start).add(4, 'months').toDate()
      }
    },
    search () {
      // 데이터를 만든다.
      if (!this.param.brcNo) {
        this.$dialog.alert('사업장을 선택해 주세요.')
        return
      } else if (!this.param.selectDate || !this.param.selectDate.start || !this.param.selectDate.end) {
        this.$dialog.alert('기간을 선택해 주세요.')
        return
      }
      // 기간 설정
      let startDate = moment(this.param.selectDate.start)
      const endDate = moment(this.param.selectDate.end)
      // 날짜설정을 만든다.
      const dates = []
      for (let i = 0; startDate <= endDate; startDate = moment(startDate).add(1, 'days')) {
        const date = startDate.toDate()
        const selectDay = startDate.days()
        // 요일 분석
        for (const day of this.days) {
          if (day.value && day.key === selectDay) {
            dates.push(date)
          }
        }
      }
      this.dates = dates
    },
    refresh () {
      this.dates = []
    },
    setRoomType () {
      if (!this.param.setStockYn) {
        this.$dialog.alert('기초입력 타입을 선택해 주세요.')
        return
      } else if (!this.param.brcNo) {
        this.$dialog.alert('사업장을 선택해 주세요.')
        return
      } else if (!this.dates || this.dates.length === 0) {
        this.$dialog.alert('달력에 추가된 날짜가 없습니다.<br/>달력에 날짜를 추가해 주세요.')
        return
      }
      this.menuRoomType = true
    },
    modifyPeriod () {
      this.menuRoomType = false
    },
    manualChange (type, index) {
      type.autoYn = !type.autoYn
      type.stock = ''
      type.ratio = ''
      // focus
      this.$nextTick(() => {
        if (type.autoYn) {
          this.$refs.rate[index].focus()
        } else {
          this.$refs.allotment[index].focus()
        }
      })
    }
  }
}
</script>
