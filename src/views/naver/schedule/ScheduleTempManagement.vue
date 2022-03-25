<template>
  <v-row>
    <app-card :heading="'임시 일정 선택'" col-classes="col-12">
      <v-col cols="10" class="ma-0 pa-0">
        <v-alert dense outlined type="error" class="font-sm mb-2">
          전송하지 않는 일정은 삭제해주세요.
        </v-alert>
        <v-data-table
          :no-data-text="'임시 일정을 생성해 주세요.'"
          :no-results-text="'검색 결과가 없습니다.'"
          :headers="headers"
          :items="scheduleTempMstList"
          disable-sort disable-pagination hide-default-footer
          class="bordered">
          <template v-slot:item.status="{ item }">
            <v-chip outlined small color="green">{{ item.status === 'I' ? '대기' : ''}}</v-chip>
          </template>
          <template v-slot:item.count="{ item }">
            {{ item.count | price }}
          </template>
          <template v-slot:item.crtDt="{ item }">
            {{ item.crtDt | dateSet }}
          </template>
          <template v-slot:item.select="{ item }">
            <v-btn v-if="item.status === 'I'" outlined rounded small color="info" @click="selectTemp(item)">
              선택
            </v-btn>
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn v-if="item.status === 'I'" outlined rounded small color="info" @click="approveTemp(item)">
              승인
            </v-btn>
            <v-btn v-if="item.status === 'I'" outlined rounded small color="red" @click="deleteTemp(item)">
              삭제
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
      <v-row v-if="isSelect">
        <v-col cols="12">
          <v-row>
            <v-col cols="4">
              <v-autocomplete
                v-model="selectDays"
                :items="selectDayList"
                item-value="startDate"
                :item-text="setDateText"
                autocomplete="off"
                label="날짜를 선택해 주세요."
                chips return-object dense hide-details
                @change="changeDate"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row justify-content="between">
            <v-col class="pt-0">
              <v-chip color="grey lighten-1" :disabled="true" label small> </v-chip> 미설정
            </v-col>
            <v-col align="right" class="pt-0">
              판매여부 <common-tooltip :type="'info'" :position="'bottom'" max-width="245" :text="'상품의 일자별 판매 여부를 설정합니다. ‘판매’로 설정한 날짜만 예약화면에 판매되며 설정을 off해 ‘중지’로 설정한 상품은 예약화면에 판매되지 않습니다.<br /><br />* 상품노출이 off인 경우 설정된 판매여부와 관계없이 예약화면에 상품이 노출되지 않습니다.'" />
            </v-col>
          </v-row>
          <v-row class="mb-3 px-3">
            <v-col cols="12" class="text-center subtitle-1 font-weight-bold teal white--text">
              {{ serviceName }}
            </v-col>
          </v-row>
          <v-simple-table class="bordered" id="scheduleTempList"
                          v-dragscroll="{target: '.v-data-table__wrapper'}"
          >
            <thead>
            <tr class="teal lighten-4">
              <th class="text-center">상품명</th>
              <th class="text-center">판매/재고/가격</th>
              <th v-for="date in header" :key="date.date" class="text-center" :class="date.day === 0 ? 'red--text' : date.day === 6 ? 'blue--text': ''">
                {{ date.label }}
              </th>
            </tr>
            </thead>
            <tbody>
            <template v-for="item of list">
              <tr v-for="(itemInfo, index) of item.detailList" :key="item.bizItemId + '_' + index">
                <td v-if="index === 0" rowspan="3" class="text-center font-weight-bold"
                    style="background-color: #E0F2F1;">
                  {{ (item.pkgYn === 'Y' ? '[패키지] ' : '[객실] ') }} <br /> {{ item.name }} <br /> {{ ' (' + item.mid + ')' }}
                </td>
                <td class="text-right grey--text font-weight-black">
                  {{ itemInfo.label }}
                </td>
                <td v-for="(data, dateIndex) of itemInfo.dateList" :key="item.bizItemId + '_' + index + '_' + dateIndex"
                    :style="{ 'background-color': data.isEmpty ? '#EEEEEE' : 'white' }" class="text-right">
                  <template v-if="data.isEmpty">
                    {{ data.value }}
                  </template>
                  <template v-else>
                    <span v-if="data.key === 'isBusinessDay'" :class="data.value === 'Y' ? 'blue--text' : 'grey--text'">{{ data.value === 'Y' ? '판매' : '휴무' }}</span>
                    <span v-else-if="data.key === 'remainStock'">{{ data.value | price }}개</span>
                    <span v-else>{{ data.value | price }}원</span>
                  </template>
                </td>
              </tr>
            </template>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
    </app-card>
  </v-row>
</template>

<script>
import scheduleTempService from 'Api/modules/naver/schedule.service'
import CommonTooltip from 'Components/Common/CommonTooltip.vue'

export default {
  name: 'ScheduleTempManagement',
  components: { CommonTooltip },
  data: function () {
    return {
      headers: [
        { text: '선택', value: 'select', align: 'center', sortable: false },
        { text: 'No', value: 'tempNo', align: 'center', sortable: false },
        { text: '서비스명', value: 'serviceName', align: 'center', sortable: false },
        { text: '상태', value: 'status', align: 'center', sortable: false },
        { text: '개수', value: 'count', align: 'center', sortable: false },
        { text: '생성일시', value: 'crtDt', align: 'center', sortable: false },
        { text: 'Action', value: 'action', align: 'center', sortable: false }
      ],
      scheduleTempMstList: [],
      isSelect: false,
      serviceName: '',
      header: [],
      list: [],
      selectDayList: [],
      selectDays: {},
      tempNo: ''
    }
  },
  mounted () {
    this.selectScheduleTempMstList()
  },
  methods: {
    setInit () {
      this.header = []
      this.list = []
      this.selectDayList = []
      this.selectDays = {}
      this.isSelect = false
    },
    setDateText (item) {
      return `${item.startDate} ~ ${item.endDate}`
    },
    // 임시 일정 마스터 목록 - 대기중 상태만
    selectScheduleTempMstList () {
      scheduleTempService.selectScheduleTempMstList({ status: 'I' }).then((res) => {
        this.scheduleTempMstList = res.data
      })
    },
    async selectScheduleTempList (tempNo, param) {
      if (!tempNo) {
        this.$dialog.alert('임시 일정을 선택해주세요.')
        return
      }
      try {
        const response = await scheduleTempService.selectScheduleTempList(tempNo, param)
        const dateArray = []
        for (const date of response.data.header) {
          const row = {
            day: moment(date).day(),
            label: moment(date).format('MM월 DD일 (ddd)'),
            date: date
          }
          dateArray.push(row)
        }
        this.header = dateArray
        this.list = response.data.body
        this.selectDayList = response.data.selectDayList
        if (Object.keys(this.selectDays).length === 0) {
          this.selectDays = this.selectDayList[0]
        }
        this.isSelect = true
      } catch (error) {
        console.log(error)
      }
    },
    changeDate () {
      if (this.selectDays && Object.keys(this.selectDays).length === 2) {
        const param = _.cloneDeep(this.selectDays)
        this.selectScheduleTempList(this.tempNo, param)
      }
    },
    selectTemp (item) {
      this.tempNo = item.tempNo
      this.serviceName = item.serviceName
      this.setInit()
      this.selectScheduleTempList(item.tempNo)
    },
    approveTemp (item) {
      if (!item.count || item.count === 0) {
        this.$dialog.alert('아직 임시 스케줄 목록이 생성되지 않았습니다. 알림이 오면 새로고침 후 다시 시도해주세요.')
        return
      }
      this.$dialog.confirm('승인하시겠습니까?').then(() => {
        scheduleTempService.updateScheduleTempMst(item.tempNo, { status: 'A' }).then(() => {
          this.$dialog.alert('승인되었습니다. 일정 전송 결과는 알림에서 확인해주세요.').then(() => {
            this.setInit()
            this.selectScheduleTempMstList()
          })
        })
      })
    },
    deleteTemp (item) {
      if (!item.count || item.count === 0) {
        this.$dialog.alert('아직 임시 스케줄 목록이 생성되지 않았습니다. 알림이 오면 새로고침 후 다시 시도해주세요.')
        return
      }
      this.$dialog.confirm('삭제하시겠습니까?').then(() => {
        scheduleTempService.updateScheduleTempMst(item.tempNo, { status: 'D' }).then(() => {
          this.$dialog.alert('삭제되었습니다.').then(() => {
            this.setInit()
            this.selectScheduleTempMstList()
          })
        })
      })
    }
  }
}
</script>
<style>
#scheduleTempList .v-data-table__wrapper {
  cursor : grab;
}

#scheduleTempList .v-data-table__wrapper:active {
  cursor : grabbing;
}

#scheduleTempList table tbody td, #scheduleTempList table tbody th {
  background-color: white;
}
</style>
