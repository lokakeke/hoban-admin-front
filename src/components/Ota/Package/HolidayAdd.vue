<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      휴일추가
    </template>
    <v-row no-gutters>
      <app-card col-classes="col-12 box-shadow-none">
        <v-form
            lazy-validation
            ref="form"
        >
          <v-row>
            <v-col>
              <v-radio-group :rules="emptyRules"
                             @change="selected = []"
                             class="mt-0"
                             hide-details
                             row
                             v-model="holidayType"
              >
                <v-radio :key="item.name"
                         :label="item.label"
                         :value="item.name"
                         v-for="item in holidayItems"
                />
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row v-if="holidayType !== 'package' || holidayType === ''">
            <v-col>
<!--              :item-value="holidayType === 'store' ? 'storeCode' : 'roomTypeCode'"-->
              <v-select :item-text="setItemText"
                        :item-value="setItemValue"
                        :items="items"
                        :rules="emptyRules"
                        chips
                        label="선택"
                        multiple
                        v-model="selected"
              >
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip
                      :input-value="selected"
                      @click="select"
                      @click:close="removeSelectedItem(item)"
                      close
                      v-bind="attrs"
                  >
                    <strong v-if="holidayType === 'store'">{{ item.storeName }}</strong>
                    <strong v-else>{{ item.roomTypeName }}</strong>
                  </v-chip>
                </template>
              </v-select>
            </v-col>
          </v-row>
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <date-range-picker
                      :max="packageInformation.saleEndYmd"
                      :min="packageInformation.saleBgnYmd"
                      :required="true"
                      full-width
                      hide-details
                      label="휴일 범위 지정"
                      v-model="holiday"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-btn
                      @click="getWeek"
                      color="info"
                  >
                    요일 지정
                  </v-btn>

                  <v-expand-transition>
                    <v-row no-gutters v-show="expand">
                      <v-col cols="12">
                        <v-row no-gutters>
                          <v-col :key="item.label"
                                 v-for="item in dayOfWeekItems"
                          >
                            <v-checkbox :label="item.label"
                                        :rules="emptyRules"
                                        :value="item.value"
                                        hide-details
                                        v-model="dayOfWeek"
                            />
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-expand-transition>
                </v-col>
              </v-row>
              <v-row>
                <v-col align-self="center" cols="5">
                  <v-select :items="reasonItems"
                            @change="selectReason"
                            hide-details
                            item-text="commonCodeDesc"
                            item-value="commCdDesc"
                            label="선택"
                            v-model="reasonItem"
                  >
                  </v-select>
                </v-col>
                <v-col align-self="center" cols="5">
                  <v-text-field hide-details label="휴일지정사유" v-model="holidayMemo" />
                </v-col>
                <v-col class="text-right align-self-end" cols="2">
                  <v-btn @click="addHoliday" color="info" rounded >
                    <v-icon>add</v-icon> 적용
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-form>
      </app-card>
    </v-row>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import commonCodeService from '@/api/modules/system/commonCode.service'

export default {
  extends: DialogBase,
  name: 'HolidayAdd',
  data: function () {
    return {
      events: Array,
      packageInformation: Object,

      holidayType: 'package',
      holidayItems: [
        { name: 'package', color: 'red', label: '패키지 번호' },
        { name: 'store', color: 'green', label: '영업장 코드' },
        { name: 'room', color: 'blue', label: '객실유형 코드' }
      ],

      expand: false,

      items: Array,
      selected: [],

      holiday: [],

      dayOfWeek: [0, 1, 2, 3, 4, 5, 6],
      dayOfWeekItems: [
        { value: 0, label: '일' },
        { value: 1, label: '월' },
        { value: 2, label: '화' },
        { value: 3, label: '수' },
        { value: 4, label: '목' },
        { value: 5, label: '금' },
        { value: 6, label: '토' }
      ],

      holidayMemo: '',

      reasonItems: [],
      reasonItem: ''
    }
  },
  mounted () {
    this.events = this.instance.params.events
    this.packageInformation = this.instance.params.packageInformation
    this.items = this.instance.params.storeRoomList
    this.holidayType = this.instance.params.selectType === 'all' ? 'package' : this.instance.params.selectType
    this.getReasons()
  },
  methods: {
    getWeek () {
      this.dayOfWeek = []
      for (const day of this.dayOfWeekItems) {
        this.dayOfWeek.push(day.value)
      }

      this.expand = !this.expand
    },

    async getReasons () {
      const response = await commonCodeService.selectCommonCode('COMM0001')
      for (const data of response.data) {
        this.reasonItems.push(data)
      }
    },

    selectReason () {
      this.holidayMemo = this.reasonItem
    },

    addHoliday () {
      this.validForm(this.$refs.form).then(() => {
        const end = moment(this.holiday[1])
        const start = moment(this.holiday[0])
        const diff = end.diff(start, 'days')

        let isDayOfWeek = false // 해당 기간에 선택한 요일 존재 유무
        for (let i = 0; i <= diff; i++) {
          const resultDay = moment(start).add(i, 'd')
          const targetDay = resultDay.format('YYYY-MM-DD')
          const targetDayOfWeek = resultDay.day()

          this.dayOfWeek.forEach(day => {
            if (day === targetDayOfWeek) {
              isDayOfWeek = true

              if (this.holidayType !== 'package') {
                this.selected.forEach(selectItem => {
                  const isStore = this.holidayType === 'store'
                  const item = isStore ? this.items.find(item => selectItem === item.storeCode) : this.items.find(item => {
                    const itemArr = selectItem.split(',')
                    if (itemArr[0] === item.storeCode && itemArr[1] === item.roomTypeCode) {
                      return true
                    }
                  })
                  const finder = isStore ? this.events.find(event => event.start === targetDay && event.type === 'store' && event.storeCode === item.storeCode)
                    : this.events.find(event => event.start === targetDay && event.type === 'room' && event.storeCode === item.storeCode && event.roomTypeCode === item.roomTypeCode)

                  if (finder === undefined) {
                    this.events.push({
                      name: isStore ? `${item.storeName} 휴일` : `${item.storeName} - ${item.roomTypeName} 휴일`,
                      start: targetDay,
                      color: this.holidayItems.find(data => data.name === this.holidayType).color,
                      type: this.holidayType,
                      memo: this.holidayMemo,
                      holidayCode: isStore ? 'S' : 'R',
                      roomTypeCode: isStore ? null : item.roomTypeCode,
                      roomTypeName: isStore ? null : item.roomTypeName,
                      storeCode: item.storeCode,
                      storeName: item.storeName,
                      store: item.storeCode ? `${item.storeName} (${item.storeCode})` : '-',
                      roomType: isStore ? '-' : item.roomTypeCode ? `${item.roomTypeName} (${item.roomTypeCode})` : '-'
                    })
                  }
                })
              } else {
                // 추가 시 같은 날짜에 대한 예외처리
                const finder = this.events.find(event => {
                  return event.start === targetDay && event.type === 'package'
                })

                if (finder === undefined) {
                  this.events.push({
                    name: '패키지 휴일',
                    start: targetDay,
                    color: this.holidayItems.find(data => data.name === this.holidayType).color,
                    type: this.holidayType,
                    memo: this.holidayMemo,
                    holidayCode: 'P',
                    roomTypeCode: '',
                    roomTypeName: '',
                    storeCode: '',
                    storeName: ''
                  })
                }
              }
            }
          })
        }

        if (!isDayOfWeek) {
          this.$dialog.alert('해당기간에 지정한 요일이 없습니다.')
          return
        }

        this.close()
      })
    },
    setItemText (item) {
      const isStore = this.holidayType === 'store'
      return isStore ? `${item.storeName}` : `${item.storeName} (${item.storeCode}) - ${item.roomTypeName} (${item.roomTypeCode})`
    },
    setItemValue (item) {
      const isStore = this.holidayType === 'store'
      return isStore ? item.storeCode : `${item.storeCode},${item.roomTypeCode}`
    },
    removeSelectedItem (item) {
      this.selected.splice(this.selected.indexOf(item), 1)
      this.selected = [...this.selected]
    }
  }
}
</script>

<style scoped>

</style>
