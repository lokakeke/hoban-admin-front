<template>
  <v-row wrap>
    <app-card :heading="'상세 조건 선택'" col-classes="col-12">
      <v-alert dense outlined type="success" class="font-sm mb-0">
        휴무일은 판매여부로 관리됩니다.
      </v-alert>
      <v-form ref="form" lazy-validation autocomplete="off">
        <v-row>
          <v-col cols="6">
            <div class="font-weight-bold subtitle-1">서비스 선택</div>
            <v-autocomplete
              v-model="selectBusiness"
              :items="businessCodeList"
              item-value="storeId"
              item-text="serviceName"
              :rules="emptyRules"
              @change="setInit"
              autocomplete="off"
              placeholder="서비스를 선택해 주세요."
              return-object hide-details
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" class="pb-0">
            <div class="font-weight-bold subtitle-1">날짜 선택</div>
          </v-col>
        </v-row>
      </v-form>
      <v-row>
        <v-col cols="3" class="pt-0">
          <v-radio-group v-model="dateType" row hide-details @change="changeDateType">
            <v-radio label="2주" value="w"></v-radio>
            <v-radio label="기간 선택" value="m"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="6" class="pt-0">
          <v-row v-if="dateType === 'w'" align="end" no-gutters>
            <v-col cols="2">
              <v-btn block text @click="changeDate(true)">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="8">
              <date-picker v-model="selectDay" placeholder="기준일을 선택해 주세요." hide-details :min="min" :max="max" @change="pickDate"></date-picker>
            </v-col>
            <v-col cols="2">
              <v-btn block text @click="changeDate(false)">
                <v-icon>chevron_right</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <date-range-picker v-else v-model="selectDate" hide-details :min="min" :max="max"></date-range-picker>
        </v-col>
        <v-col cols="3" class="text-right pb-0">
          <v-btn large rounded color="info" @click="search" :disabled="(!selectBusiness || Object.keys(selectBusiness).length === 0)"><v-icon left>search</v-icon>검색</v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="12" v-if="isSelect">
          <v-alert dense outlined type="error" class="font-sm">
            네이버에 연동되는 재고 정보입니다. PMS 재고와는 다를 수 있습니다.<br />
            상품노출, 판매여부 수정시 네이버 예약 파트너센터에 바로 적용됩니다.<br />
            수동 관리시 '오버부킹' 으로 예약되며 재고 차감만 이뤄집니다. '오버부킹 예약 취소'시 재고는 plus(+) 되지 않습니다.
          </v-alert>
          <v-row justify-content="between">
            <v-col class="pt-0">
              <v-chip color="grey lighten-1" :disabled="true" label small> </v-chip> 노출OFF / 판매마감
            </v-col>
            <v-col align="right" class="pt-0">
              상품노출 <common-tooltip :type="'info'" :position="'bottom'" max-width="245" :text="'상품의 노출 여부를 설정합니다. ‘노출’로 설정한 상품만 예약화면에 노출되며 설정을 off해 ‘미노출’로 설정한 상품은 예약화면에 노출되지 않습니다.'" />
              판매여부 <common-tooltip :type="'info'" :position="'bottom'" max-width="245" :text="'상품의 일자별 판매 여부를 설정합니다. ‘판매’로 설정한 날짜만 예약화면에 판매되며 설정을 off해 ‘중지’로 설정한 상품은 예약화면에 판매되지 않습니다.<br /><br />* 상품노출이 off인 경우 설정된 판매여부와 관계없이 예약화면에 상품이 노출되지 않습니다.'" />
            </v-col>
          </v-row>
          <v-row class="mb-3 px-3">
            <v-col cols="12" class="text-center subtitle-1 font-weight-bold teal white--text">
              {{ selectBusiness.serviceName }}
            </v-col>
          </v-row>
          <v-simple-table class="bordered" id="simpleScheduleList"
                          v-dragscroll="{target: '.v-data-table__wrapper'}"
          >
            <thead>
            <tr class="teal lighten-4">
              <th class="text-center">상품명</th>
              <th class="text-center">상품노출</th>
              <th class="text-center">판매/재고/가격</th>
              <th v-for="date in header" :key="date.date" class="text-center" :class="date.day === 0 ? 'red--text' : date.day === 6 ? 'blue--text': ''">
                <span v-html="date.label"></span>
              </th>
            </tr>
            </thead>
            <tbody>
            <template v-for="item of list">
              <tr v-for="(itemInfo, index) of item.detailList" :key="item.bizItemId + '_' + index">
                <td v-if="index === 0" :rowspan="item.detailList.length" class="text-center font-weight-bold"
                    :style="{ 'background-color': item.isImp === 'N' ? '#EEEEEE' : '#E0F2F1' }">
              <span>
                {{ (item.packageYn === 'Y' ? '[패키지] ' : '[객실] ') }} <br /> {{ item.name }} <br /> {{ ' (' + item.mid + ')' }}
              </span>
                </td>
                <td v-if="index === 0" :rowspan="item.detailList.length" class="text-center font-weight-bold"
                    :style="{ 'background-color': item.isImp === 'N' ? '#EEEEEE' : 'white' }">
                  <v-row justify="center">
                      <v-switch v-model="item.isImp" true-value="Y" false-value="N" class="ma-0 pl-5"
                                hide-details dense inset color="info" @change="changeImp(item)"></v-switch>
                  </v-row>
                </td>
                <td class="text-right"
                    :style="{ 'background-color': item.isImp === 'N' ? '#EEEEEE' : 'white' }"
                    :class="itemInfo.isImp === 'N' ? 'grey--text font-weight-black' : 'primary--text font-weight-black'">
                  {{ itemInfo.label }}
                </td>
                <td v-for="(data, dateIndex) of itemInfo.dateList" :key="item.bizItemId + '_' + index + '_' + dateIndex"
                    :style="{ 'background-color': item.isImp === 'N' ? '#EEEEEE' : data.isEmpty ? '#EEEEEE' : 'white' }" class="text-right">
                  <template v-if="data.isEmpty">
                    {{ data.value }}
                  </template>
                  <template v-else>
                    <template v-if="data.key === 'isBusinessDay'">
                      <v-row justify="center">
                        <v-switch v-model="data.value" :disabled="item.isImp === 'N'"
                                  true-value="Y" false-value="N" class="ma-0 pl-5"
                                  hide-details dense inset color="info" @change="changeIsBusinessDay(item.businessId, item.bizItemId, data.date, data.value)"></v-switch>
                      </v-row>
                    </template>
                    <template v-else-if="data.key === 'autoYn'">
                      <v-row justify="center">
                        <v-switch v-model="data.value" :disabled="item.isImp === 'N'"
                                  true-value="Y" false-value="N" class="ma-0 pl-5"
                                  hide-details dense inset color="info" @change="changeIsAutoYn(item.businessId, item.bizItemId, data.date, data.value)"></v-switch>
                      </v-row>
                    </template>
                    <span v-else-if="data.key === 'remainStock'">
                  <v-row v-if="data.autoYn === 'N' && item.isImp === 'Y'" justify="center" align="center">
                    <editable-text
                      v-if="data.value !== null"
                      :value="data.value"
                      :type="'number'"
                      :suffix="'개'"
                      @blur="changeValue => { changeRemainStock(item.businessId, item.bizItemId, data.date, data.value, changeValue, data) }"
                    >
                    </editable-text>
                    <v-icon right>mdi-pencil</v-icon>
                  </v-row>
                  <span v-else>{{ data.value | price }}개</span>
                </span>
                    <span v-else>{{ data.value | price }}원</span>
                  </template>
                </td>
              </tr>
            </template>
            </tbody>
          </v-simple-table>
        </v-col>
        <v-col cols="12" v-else class="text-center title font-weight-bold my-5">
          조회된 상품이 없습니다. 재검색 해주세요.
        </v-col>
      </v-row>
      <common-snackbars :text="snackbarText" v-model="isShowSnackbar" :type="snackbarType"></common-snackbars>
    </app-card>
  </v-row>
</template>

<script>
import itemService from '@/api/modules/naver/item.service'
import scheduleService from '@/api/modules/naver/schedule.service'
import CommonTooltip from '@/components/Common/CommonTooltip.vue'
import EditableText from '@/components/Common/EditableText.vue'
import CommonSnackbars from '@/components/Common/CommonSnackbars.vue'

export default {
  name: 'SimpleSchedule',
  components: {
    CommonTooltip,
    EditableText,
    CommonSnackbars
  },
  data: function () {
    return {
      format: 'YYYYMMDD',
      dateType: 'w',
      selectDay: moment().format('YYYYMMDD'),
      selectDate: [
        moment().format('YYYYMMDD'),
        moment().add(13, 'days').format('YYYYMMDD')
      ],
      min: moment().format('YYYY-MM-DD'),
      max: moment().add(12, 'months').format('YYYY-MM-DD'),
      businessCodeList: [],
      selectBusiness: {},
      itemList: [],
      isSelect: false,
      serviceName: '',
      header: [],
      list: [],
      isShowSnackbar: false,
      snackbarType: 'success',
      snackbarText: ''
    }
  },
  mounted () {
    /**
     * 사업장 리스트 조회
     */
    itemService.selectBusinessCodeList().then(res => {
      this.businessCodeList = res.data
    })
  },
  methods: {
    setInit () {
      this.header = []
      this.list = []
      this.isSelect = false
    },
    pickDate () {
      this.selectDate = [
        moment(this.selectDay).format(this.format),
        moment(this.selectDay).add(13, 'days').format(this.format)
      ]
    },
    changeDateType () {
      this.selectDay = moment(this.min).format(this.format)
      this.selectDate = [
        moment(this.min).format(this.format),
        moment(this.min).add(13, 'days').format(this.format)
      ]
    },
    changeDate (isPrev = Boolean) {
      const day = moment(this.selectDay).add(isPrev ? -13 : 13, 'days')
      if (isPrev && day.isBefore(moment(this.min))) {
        this.showSnackbar('error', '오늘 보다 이전날짜는 선택 하실 수 없습니다.')
        return
      } else if (!isPrev && day.isAfter(moment(this.max))) {
        this.showSnackbar('error', '12달 이후 데이터는 선택 하실 수 없습니다.')
        return
      }
      if (!isPrev) {
        this.selectDay = day.add(1, 'days').format(this.format)
      } else {
        this.selectDay = day.add(-1, 'days').format(this.format)
      }
      this.selectDate = [
        day.format(this.format),
        day.add(13, 'days').format(this.format)
      ]
    },
    changeImp (item) {
      const param = {
        storeId: item.storeId,
        itemIds: item.itemId,
        isImp: item.isImp
      }
      itemService.patchItem(param).then(() => {
        this.showSnackbar('success', `[${item.name}] 예약서비스에 [${item.isImp === 'Y' ? '노출' : '미노출'}] 됩니다.`)
        this.search()
      }).catch(() => {
        this.search()
      })
    },
    changeIsBusinessDay (businessId, bizItemId, startDate, isBusinessDay) {
      const param = {
        businessId: businessId,
        bizItemId: bizItemId,
        startDate: startDate,
        type: 'isBusinessDay',
        isBusinessDay: isBusinessDay
      }
      scheduleService.patchSchedule(param).then(() => {
        this.showSnackbar('success', '수정되었습니다. 일정 전송 결과는 알림에서 확인해주세요.')
        this.search()
      }).catch(() => {
        this.search()
      })
    },
    changeIsAutoYn (businessId, bizItemId, startDate, autoYn) {
      const param = {
        businessId: businessId,
        bizItemId: bizItemId,
        startDate: startDate,
        type: 'autoYn',
        autoYn: autoYn
      }
      scheduleService.patchSchedule(param).then(() => {
        this.showSnackbar('success', `수정되었습니다.${autoYn === 'Y' ? ' 일정 전송 결과는 알림에서 확인해주세요.' : ''}`)
        this.search()
      }).catch(() => {
        this.search()
      })
    },
    changeRemainStock (businessId, bizItemId, startDate, originValue, changeValue, data) {
      if (changeValue < 0) {
        this.showSnackbar('error', '음수는 설정할 수 없습니다.')
        return
      }
      if (originValue !== changeValue) {
        this.$dialog.confirm('재고수를 변경하시겠습니까?').then(() => {
          const param = {
            businessId: businessId,
            bizItemId: bizItemId,
            startDate: startDate,
            type: 'remainStock',
            remainStock: changeValue
          }
          scheduleService.patchSchedule(param).then(() => {
            this.showSnackbar('success', '수정되었습니다. 일정 전송 결과는 알림에서 확인해주세요.')
            this.search()
          }).catch(() => {
            this.search()
          })
        }).catch(() => {
          data.value = null
          this.$nextTick(() => {
            data.value = originValue
          })
        })
      }
    },
    async search () {
      try {
        await this.validForm(this.$refs.form)
        if (this.selectDate.length !== 2 || this.selectDate[0] == null || this.selectDate[1] == null) {
          this.showSnackbar('error', '날짜를 선택해 주세요.')
        } else if (moment(this.selectDate[1]).diff(moment(this.selectDate[0]), 'month') > 0) {
          this.showSnackbar('error', '날짜는 한달 이상 선택하실 수 없습니다.')
        } else {
          try {
            this.setInit()
            const params = {
              startDate: moment(this.selectDate[0]).format('YYYY-MM-DD'),
              endDate: moment(this.selectDate[1]).format('YYYY-MM-DD'),
              businessId: this.selectBusiness.businessId
            }
            const response = await scheduleService.selectScheduleList({ params: params })
            if (response.data && response.data.body && response.data.body.length > 0) {
              if (response.data.header) {
                const dateArray = []
                for (const date of response.data.header) {
                  const row = {
                    day: moment(date).day(),
                    label: moment(date).format('MM월 DD일') + '<br/>' + moment(date).format('(ddd)'),
                    date: date
                  }
                  dateArray.push(row)
                }
                this.header = dateArray
                this.list = response.data.body
                this.isSelect = true
              }
            }
          } catch (error) {
            console.log(error)
          }
        }
      } catch (err) {}
    },
    showSnackbar (type, text) {
      this.isShowSnackbar = true
      this.snackbarType = type
      this.snackbarText = text
    }
  }
}
</script>
<style>
#simpleScheduleList .v-data-table__wrapper {
  cursor : grab;
}

#simpleScheduleList .v-data-table__wrapper:active {
  cursor : grabbing;
}

#simpleScheduleList table tbody td, #simpleScheduleList table tbody th {
  background-color: white;
}
</style>
