<template>
  <div>
    <v-alert
      dense
      border="left"
      type="info"
      v-if="isChanged"
    >수정된 항목이 있습니다. 우측 하단의 "저장" 버튼을 눌러야 수정된 항목이 서버에 반영됩니다.</v-alert>
    <v-data-table
      :headers="headers"
      :items="tableList"
      disable-sort
      disable-pagination
      hide-default-footer
      class="bordered mt-3"
      v-if="headers.length > 0"
    >
      <!-- 시즌 -->
      <template v-slot:[`item.peakYn`]="{ item }">
        <span class="subtitle-1" v-if="item.peakYn === 'Y'">
          <v-icon color="orange">mdi-star-circle</v-icon>
          {{ item.seasonInd }}
        </span>
        <span class="subtitle-1" v-else>
          <v-icon color="grey">mdi-star-circle</v-icon>
          {{ item.seasonInd }}
        </span>
      </template>
      <!-- 주중/주말 -->
      <template v-slot:[`item.wkendYn`]="{ item }">
        <v-chip color="red" text-color="white" v-if="item.wkendYn === 'Y'">주말</v-chip>
        <v-chip color="blue" text-color="white" v-else>주중</v-chip>
      </template>
      <!-- 위약률 -->
      <template
        v-for="bkpmsStndDay in getBkpmsStndDayList()"
        v-slot:[`item.bkpmsRate${bkpmsStndDay}`]="{ item }"
      >
        <div :key="bkpmsStndDay">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <span
                v-on="on"
                @click="openUpdateBkpmsRateDialog(item, bkpmsStndDay, item[`bkpmsRate${bkpmsStndDay}`])"
                style="cursor: pointer;"
              >
                <strong
                  v-if="item[`bkpmsRate${bkpmsStndDay}`]"
                >{{ item[`bkpmsRate${bkpmsStndDay}`] }}%</strong>
                <span class="grey--text" v-else>(없음)</span>
              </span>
            </template>
            <span>위약률: 클릭하여 수정할 수 있습니다.</span>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>
    <v-row class="mt-3">
      <v-col cols="6">
        <v-btn color="info" outlined rounded @click="openUpdateBkpmsStndDayList" v-if="writeAuth">
          <v-icon left>mdi-cogs</v-icon>위약일기준 수정
        </v-btn>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-btn color="green" outlined rounded @click="refreshCalcPenaltyRuleList">
          <v-icon left>refresh</v-icon>다시 조회
        </v-btn>
        <v-btn
          color="info"
          outlined
          rounded
          :disabled="isChanged === false"
          @click="insertCalcPenaltyRuleList"
        >
          <v-icon left>check</v-icon>저장
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import calcPenaltyRuleService from '@/api/modules/ota/calculationPenaltyRule.service'

export default {
  name: 'PenaltyRuleTable',
  data () {
    return {
      /**
       * 위약 규정 목록
       */
      calcPenaltyRuleList: [],
      /**
       * 변경된 항목 수
       */
      changeCount: false
    }
  },
  computed: {
    /**
     * 테이블 헤더 배열
     */
    headers () {
      const headers = [
        {
          text: '시즌',
          value: 'peakYn',
          align: 'center',
          sortable: false
        },
        {
          text: '주중/주말',
          value: 'wkendYn',
          align: 'center',
          sortable: false
        }
      ]
      this.getBkpmsStndDayList().forEach((bkpmsStndDay) => {
        let text = `${bkpmsStndDay}일 전 취소`
        if (Number(bkpmsStndDay) === 0) {
          text = '당일취소'
        } else if (Number(bkpmsStndDay) === -1) {
          text = 'NO SHOW'
        }
        headers.push({
          text,
          value: `bkpmsRate${bkpmsStndDay}`,
          align: 'center',
          sortable: false
        })
      })
      return headers
    },
    /**
     * 테이블에 표시할 목록
     */
    tableList () {
      const tableList = [
        {
          seasonInd: '비수기',
          peakYn: 'N',
          wkendYn: 'N'
        },
        {
          seasonInd: '비수기',
          peakYn: 'N',
          wkendYn: 'Y'
        },
        {
          seasonInd: '성수기',
          peakYn: 'Y',
          wkendYn: 'N'
        },
        {
          seasonInd: '성수기',
          peakYn: 'Y',
          wkendYn: 'Y'
        }
      ]
      this.calcPenaltyRuleList.forEach((calcPenaltyRule) => {
        tableList.forEach((tableItem) => {
          if (
            tableItem.peakYn === calcPenaltyRule.peakYn &&
            tableItem.wkendYn === calcPenaltyRule.wkendYn
          ) {
            tableItem[`bkpmsRate${calcPenaltyRule.bkpmsStndDay}`] =
              calcPenaltyRule.bkpmsRate
          }
        })
      })
      return tableList
    },
    /**
     * 수정 여부
     */
    isChanged () {
      return this.changeCount > 0
    }
  },
  created () {
    this.selectCalcPenaltyRuleList()
  },
  methods: {
    /**
     * 정산 > 위약 규정 목록 조회
     */
    async selectCalcPenaltyRuleList () {
      const res = await calcPenaltyRuleService.selectCalcPenaltyRuleList()
      this.calcPenaltyRuleList = res.data
      const bkpmsStndDayList = this.getBkpmsStndDayList()
      if (this.calcPenaltyRuleList.length < bkpmsStndDayList.length * 4) {
        bkpmsStndDayList.forEach((bkpmsStndDay) => {
          for (let i = 0; i < 4; i++) {
            this.calcPenaltyRuleList.push({
              bkpmsStndDay,
              peakYn: i < 2 ? 'N' : 'Y',
              wkendYn: i % 2 === 1 ? 'N' : 'Y',
              bkpmsRate: 0
            })
          }
        })
      }
      this.changeCount = 0
    },
    /**
     * 위약기준일 목록 가져오기
     */
    getBkpmsStndDayList () {
      if (this.calcPenaltyRuleList.length > 0) {
        const bkpmsStndDayObj = {}
        this.calcPenaltyRuleList.forEach((calcPenaltyRule) => {
          bkpmsStndDayObj[calcPenaltyRule.bkpmsStndDay] = true
        })
        const bkpmsStndDayList = Object.keys(bkpmsStndDayObj)
        bkpmsStndDayList.sort((a, b) => b - a)
        return bkpmsStndDayList
      }
      return [6, 4, 1, 0, -1] // 기본 위약기준일 목록
    },
    /**
     * 위약 규정 > 위약률 수정 팝업 열기
     */
    openUpdateBkpmsRateDialog ({ peakYn, wkendYn }, bkpmsStndDay, bkpmsRate) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Calculation/PenaltyRule/BkpmsRateUpdateDialog.vue',
        params: {
          calcPenaltyRule: {
            bkpmsStndDay,
            peakYn,
            wkendYn,
            bkpmsRate
          }
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 300,
          closeCallback: (params) => {
            if (params && params.calcPenaltyRule) {
              this.calcPenaltyRuleList.forEach((calcPenaltyRule) => {
                if (
                  calcPenaltyRule.bkpmsStndDay ===
                    params.calcPenaltyRule.bkpmsStndDay &&
                  calcPenaltyRule.peakYn === params.calcPenaltyRule.peakYn &&
                  calcPenaltyRule.wkendYn === params.calcPenaltyRule.wkendYn
                ) {
                  if (calcPenaltyRule.orgBkpmsRate === undefined) {
                    calcPenaltyRule.orgBkpmsRate = Number(
                      calcPenaltyRule.bkpmsRate || 0
                    )
                  }
                  calcPenaltyRule.bkpmsRate = Number(
                    params.calcPenaltyRule.bkpmsRate || 0
                  )
                  const isChanged =
                    Number(calcPenaltyRule.orgBkpmsRate) !==
                    Number(params.calcPenaltyRule.bkpmsRate)
                  if (isChanged) {
                    this.changeCount++
                  } else {
                    this.changeCount--
                  }
                }
              })
            }
          }
        }
      })
    },
    /**
     * 위약일기준 수정 팝업 열기
     */
    openUpdateBkpmsStndDayList () {
      const bkpmsStndDayObj = {}
      this.calcPenaltyRuleList.forEach(calcPenaltyRule => {
        bkpmsStndDayObj[calcPenaltyRule.bkpmsStndDay] = true
      })
      delete bkpmsStndDayObj[0] // 당일 취소 항목 삭제
      delete bkpmsStndDayObj[-1] // NO SHOW 항목 삭제
      const bkpmsStndDayList = []
      Object.keys(bkpmsStndDayObj).forEach((bkpmsStndDay) => {
        bkpmsStndDayList.push({
          value: Number(bkpmsStndDay),
          orgValue: Number(bkpmsStndDay)
        })
      })
      this.$store.dispatch('dialog/open', {
        componentPath:
          '/Ota/Calculation/PenaltyRule/BkpmsStndDayListUpdateDialog.vue',
        params: {
          bkpmsStndDayList
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 500,
          closeCallback: (params) => {
            if (params && params.bkpmsStndDayList) {
              // 등록/수정 항목 처리
              params.bkpmsStndDayList.forEach(bkpmsStndDay => {
                if (bkpmsStndDay.value !== bkpmsStndDay.orgValue) {
                  this.changeCount++
                  if (bkpmsStndDay.orgValue) {
                    // 기존 위약일기준 수정
                    this.calcPenaltyRuleList.forEach(calcPenaltyRule => {
                      if (Number(bkpmsStndDay.orgValue) === Number(calcPenaltyRule.bkpmsStndDay)) {
                        calcPenaltyRule.bkpmsStndDay = bkpmsStndDay.value
                      }
                    })
                  } else {
                    // 신규 위약일기준 등록
                    for (let i = 0; i < 4; i++) {
                      this.calcPenaltyRuleList.push({
                        bkpmsStndDay: bkpmsStndDay.value,
                        peakYn: i < 2 ? 'N' : 'Y',
                        wkendYn: i % 2 === 1 ? 'N' : 'Y',
                        bkpmsRate: 0
                      })
                    }
                  }
                }
              })
              // 삭제 항목 처리
              bkpmsStndDayList.forEach(orgBkpmsStndDay => {
                let isExist = false
                params.bkpmsStndDayList.some(bkpmsStndDay => {
                  if (orgBkpmsStndDay.value === bkpmsStndDay.orgValue) {
                    isExist = true
                  }
                  return isExist
                })
                if (isExist === false) {
                  this.changeCount++
                  this.calcPenaltyRuleList = _.remove(this.calcPenaltyRuleList, calcPenaltyRule => {
                    return Number(orgBkpmsStndDay.value) !== Number(calcPenaltyRule.bkpmsStndDay)
                  })
                }
              })
            }
          }
        }
      })
    },
    /**
     * 정산 > 위약 규정 목록 다시 조회
     */
    async refreshCalcPenaltyRuleList () {
      try {
        await this.$dialog.confirm('설정된 위약 규정을 다시 조회하시겠습니까?')
        this.selectCalcPenaltyRuleList()
        this.$dialog.alert('위약 규정을 다시 조회하였습니다.')
      } catch {
        // no action
      }
    },
    /**
     * 정산 > 위약 규정 목록 등록
     */
    async insertCalcPenaltyRuleList () {
      const res = await calcPenaltyRuleService.insertCalcPenaltyRuleList(
        this.calcPenaltyRuleList
      )
      if (res.data) {
        this.$dialog.alert('위약 규정이 저장되었습니다.')
        this.selectCalcPenaltyRuleList()
      }
    }
  }
}
</script>
