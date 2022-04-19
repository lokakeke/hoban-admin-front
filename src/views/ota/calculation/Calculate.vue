<template>
  <v-row>
    <v-col cols="12">
      <app-card>
        <v-row>
          <v-col>
            <h1 class="h3">{{ title }}</h1>
          </v-col>
          <v-col class="text-end">
            <v-btn color="deep-purple"
                   dark
                   rounded
                   class="mr-2"
                   v-if="writeAuth"
                   @click.prevent.stop="showPartnersAllCalcStatus"
            >
              <v-icon class="pr-2">open_in_new</v-icon> 파트너 별 전체 정산현황 보기
            </v-btn>
            <v-btn color="success"
                   rounded
                   class="mr-2"
                   v-if="writeAuth"
                   @click="addHistory"
            >
              <v-icon>add</v-icon> 정산 이력 사전생성
            </v-btn>
            <v-menu
                ref="menu"
                v-model="calendarOpen"
                :close-on-content-click="false"
                offset-y
                max-width="290px"
                min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary"
                       rounded
                       v-on="on"
                       v-bind="attrs"
                       @click="showCalendar"
                >
                  <v-icon class="pr-2">calendar_today</v-icon> 이전 달 정산이력 보기
                </v-btn>
              </template>
              <v-date-picker
                  v-model="selectedDate"
                  type="month"
                  locale="kr"
                  no-title
                  scrollable
                  @change="move"
              >
                <v-spacer />
              </v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-divider />
        <v-row>
          <v-col>
            <v-data-iterator
                :items="calcItems"
                :no-results-text="emptyText"
                :no-data-text="emptyText"
                hide-default-footer
            >
              <template v-slot:default="props">
                <v-row>
                  <v-col
                      v-for="item in props.items"
                      :key="item.name"
                      cols="12"
                      sm="6"
                      md="3"
                      lg="3"
                      class="pointer"
                  >
                    <v-card hover @click="showDetail(item)">
                      <v-card-title class="subheading font-weight-bold">{{ item.name }}</v-card-title>

                      <v-divider></v-divider>

                      <v-list dense>
                        <v-list-item>
                          <v-list-item-content>상태</v-list-item-content>
                          <v-list-item-content class="align-end">{{ item.state }}</v-list-item-content>
                        </v-list-item>

                        <v-list-item>
                          <v-list-item-content>시작일</v-list-item-content>
                          <v-list-item-content class="align-end">{{ item.calcBgnYmd | date }}</v-list-item-content>
                        </v-list-item>

                        <v-list-item>
                          <v-list-item-content>종료일</v-list-item-content>
                          <v-list-item-content class="align-end">{{ item.calcEndYmd | date }}</v-list-item-content>
                        </v-list-item>

                        <v-list-item>
                          <v-list-item-content>생성일</v-list-item-content>
                          <v-list-item-content class="align-end">{{ item.crtDt | date }}</v-list-item-content>
                        </v-list-item>
                      </v-list>

                      <v-card-actions class="justify-content-end">
                        {{ /* calcInd = 정산유형, aprlCode = 정산상태 | TPNE 의 경우 관리자 승인만으로 정산 마감 */ }}
                        <template v-if="writeAuth && !isPartner">
                          <template v-if="item.calcInd !== '3' && item.aprlCode === aprlCode.calculation">
                            <v-btn color="blue-grey"
                                   dark
                                   rounded
                                   @click.prevent.stop="completeCalcForManager(item)"
                            >
                              <v-icon class="pr-2">done</v-icon> 정산확인
                            </v-btn>
                          </template>
                          <template v-else-if="item.calcInd !== '3' && item.aprlCode === aprlCode.manager">
                            <v-btn color="deep-purple"
                                   dark
                                   rounded
                                   @click.prevent.stop="showPartnersCalcStatus(item)"
                            >
                              <v-icon class="pr-2">open_in_new</v-icon> 파트너 정산현황 보기
                            </v-btn>
                          </template>
                          <template v-else-if="(item.calcInd === '3' && item.aprlCode === aprlCode.calculation) || item.aprlCode === aprlCode.partner">
                            <v-btn color="red"
                                   dark
                                   rounded
                                   @click.prevent.stop="completeCalc(item)"
                            >
                              <v-icon class="pr-2">done</v-icon> 정산 최종확인
                            </v-btn>
                          </template>
                          <v-btn color="blue"
                                 dark
                                 rounded
                                 class="ml-2"
                                 @click.prevent.stop="showMemo(item)"
                          >
                            <v-icon class="pr-2">sticky_note_2</v-icon> 메모
                          </v-btn>
                        </template>
                        <template v-else>
                          <template v-if="item.ptnrAprlYn === 'Y'">
                            <v-chip color="blue-grey" dark>
                              <v-icon>done</v-icon>  파트너 정산 완료
                            </v-chip>
                          </template>
                          <template v-else>
                            <v-btn color="blue-grey"
                                   dark
                                   rounded
                                   @click.prevent.stop="completeCalcForPartner(item)"
                            >
                              <v-icon class="pr-2">done</v-icon> 정산 확인
                            </v-btn>
                          </template>
                        </template>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </template>
            </v-data-iterator>
          </v-col>
        </v-row>
        <v-divider />
        <v-row v-if="writeAuth">
          <v-col>
            <v-row dense no-gutters>
              <v-col>
                <p class="text-body-2">
                  <v-icon>error_outline</v-icon> 총 {{ addPackageCount }}건의 패키지가 이번 달 정산에 추가로 포함되어 있습니다.
                </p>
              </v-col>
              <v-col class="text-end">
                <v-btn rounded
                       class="green lighten-1 white--text"
                       @click="showAddCalcClassDialog"
                >
                  <v-icon class="pr-2">category</v-icon> 사전 정산분류
                </v-btn>
                <v-btn rounded
                       color="blue"
                       class="mr-2 white--text"
                       @click="showAddPackageDialog"
                >
                  <v-icon class="pr-2">swap_horiz</v-icon> 패키지 정산 추가/삭제 관리
                </v-btn>
                <v-dialog v-model="dialog" persistent max-width="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="info"
                           rounded
                           v-bind="attrs"
                           v-on="on"
                    >
                      <v-icon class="pr-2">refresh</v-icon> 수동 정산
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-text>
                      <v-row>
                        <v-col cols="8">
                          <v-select
                              v-model="calcTargetSelected"
                              :items="targetSelectItems"
                              :item-text="targetSelectItems.text"
                              :item-value="targetSelectItems.value"
                              label="수동 정산 대상 선택"
                              persistent-hint
                              hide-details
                              return-object
                              single-line
                          />
                        </v-col>
                        <v-col cols="4" class="text-end align-self-end d-flex">
                          <v-btn rounded
                                 outlined
                                 color="info"
                                 @click="executeCalculate"
                          >실행</v-btn>
                          <v-btn rounded
                                 outlined
                                 color="error"
                                 @click="dialog = false"
                          >취소</v-btn>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </app-card>
    </v-col>
  </v-row>
</template>

<script>
import calculationService from '@/api/modules/ota/calculation.service'
import { mapGetters } from 'vuex'

export default {
  name: 'Calculate',
  data () {
    return {
      targetDate: moment().format('YYYYMMDD'),
      selectedDate: null,
      calendarOpen: false,
      dateFormatter: 'YYYY-MM',
      calcItems: [],
      dialog: false,
      addPackageCount: 0,

      calcTargetSelected: '',
      targetSelectItems: [
        { text: '전체', value: 'ALL' },
        { text: '객실', value: 'ROOM' },
        { text: '패키지', value: 'PACKAGE' },
        { text: '위약', value: 'PENALTY' },
        { text: 'TPNE', value: 'TPNE' }
      ],

      aprlCode: {
        collect: '0',
        calculation: '1',
        manager: '2',
        partner: '3',
        finish: '9'
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    }),
    title () {
      const titleDate = moment(this.targetDate).format(this.dateFormatter)
      return `${titleDate}월 정산`
    }
  },
  mounted () {
    this.getCalcHistory()
    this.getAddPackageCount()
  },
  methods: {
    showCalendar () {
      this.calendarOpen = true
      this.selectedDate = moment(this.targetDate).format(this.dateFormatter)
    },

    async move () {
      if (this.selectedDate === null) {
        this.$dialog.alert('이동할 날짜를 선택해주세요.')
        return
      }

      this.targetDate = moment(this.selectedDate).format('YYYYMMDD')
      this.calendarOpen = false

      this.getCalcHistory()
      this.getAddPackageCount()
    },

    async executeCalculate () {
      if (this.calcTargetSelected === '' || this.calcTargetSelected === null) {
        return await this.$dialog.alert('대상을 선택해주세요')
      }

      try {
        await this.$dialog.confirm('선택한 대상에 대해 수동 정산을 진행하시겠습니까?')

        const submitData = {
          flag: this.calcTargetSelected.value,
          targetDate: moment(this.targetDate).format('YYYYMMDD'),
          autoYn: 'N'
        }

        await calculationService.executeCalculate(submitData)

        this.calcTargetSelected = ''
        await this.$dialog.alert('수동 정산이 실행되었습니다.')
        this.dialog = false
        this.move() // 정산 후 목록 갱싱
      } catch (e) {
        console.log(e)
      }
    },

    async getCalcHistory () {
      this.calcItems = []

      const targetDate = moment(this.targetDate).format('YYYYMMDD')
      const response = this.isPartner
        ? await calculationService.retrievePartnerMonthCalcHistory(targetDate, this.user.number)
        : await calculationService.retrieveMonthCalcHistory(targetDate)
      const data = response.data

      if (data.resultCode !== '0000') return

      data.resultList.forEach((data) => {
        data.name = data.calcInd === '0' ? '객실' : data.calcInd === '1' ? '패키지' : data.calcInd === '2' ? '위약금' : 'TPNE'

        switch (data.aprlCode) {
          case '0':
            data.state = '수집대기'
            break
          case '1':
            data.state = '정산대기'
            break
          case '2':
            data.state = '담당자 정산완료'
            break
          case '3':
            data.state = '파트너 정산완료'
            break
          case '9':
            data.state = '최종완료'
            break
        }

        this.calcItems.push(data)
      })
    },

    showMemo (target) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Calculation/CalcDetail/MemoDialog',
        params: {
          calcItem: target
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 800
        }
      })
    },

    showDetail (target) {
      // 수집대기 상태에서는 열리지 않음
      if (target.aprlCode !== '0') {
        this.$store.dispatch('dialog/open', {
          componentPath: '/Ota/Calculation/CalcDetail/Container',
          params: {
            calcItem: target
          },
          options: {
            fullscreen: true,
            retainFocus: false,
            persistent: true,
            scrollable: true,
            dense: true
          }
        })
      }
    },

    showAddPackageDialog () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Calculation/CalcDetail/PackageAddDialog',
        params: {
          targetDate: this.targetDate
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          dense: true,
          width: '500',
          closeCallback: (flag) => {
            if (flag) {
              this.getAddPackageCount()
            }
          }
        }
      })
    },

    async getAddPackageCount () {
      if (!this.isPartner) {
        const targetMonth = moment(this.targetDate).format('YYYYMM')
        const response = await calculationService.countMonthCalcAddPackage(targetMonth)
        const data = response.data

        if (data.resultCode !== '0000') {
          this.addPackageCount = 0
        } else {
          this.addPackageCount = data.resultData
        }
      }
    },

    showAddCalcClassDialog () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Calculation/CalcDetail/CalcClassAddDialog',
        params: {
          targetDate: this.targetDate
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          dense: true,
          width: '1000'
        }
      })
    },

    async completeCalcForManager (item) {
      try {
        await this.$dialog.confirm('정산을 완료하시겠습니까? 완료이후에는 파트너사에 정산 내용이 노출됩니다.')

        const response = await calculationService.modifyMonthCalcHistoryStatus(item.calcSeq, this.aprlCode.manager)
        const data = response.data

        if (data.resultCode !== '0000') {
          await this.$dialog.alert(data.resultMsg)
        } else {
          await this.$dialog.alert('상태가 변경되었습니다.')
          this.getCalcHistory()
          this.getAddPackageCount()
        }
      } catch (e) {
        console.log('취소', e)
      }
    },

    async showPartnersCalcStatus (item) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Calculation/CalcDetail/PartnerListDialog',
        params: {
          calcItem: item
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          dense: true,
          width: '1000'
        }
      })
    },

    async completeCalc (item) {
      try {
        await this.$dialog.confirm('정산을 완료하시겠습니까? 완료이후 모든 기능의 추가/삭제 및 수정이 불가능합니다.')

        const response = await calculationService.modifyMonthCalcHistoryStatus(item.calcSeq, this.aprlCode.finish)
        const data = response.data

        if (data.resultCode !== '0000') {
          await this.$dialog.alert(data.resultMsg)
        } else {
          await this.$dialog.alert('상태가 변경되었습니다.')
          this.getCalcHistory()
          this.getAddPackageCount()
        }
      } catch (e) {
        console.log('취소', e)
      }
    },

    async completeCalcForPartner (item) {
      try {
        await this.$dialog.confirm('정산을 완료하시겠습니까?')

        const response = await calculationService.addPartnerCalcStatus(item.calcSeq, this.user.number, this.user.partnerManagerId)
        const data = response.data

        if (data.resultCode !== '0000') {
          await this.$dialog.alert(data.resultMsg)
        } else {
          await this.$dialog.alert('상태가 변경되었습니다.')
          this.getCalcHistory()
          this.getAddPackageCount()
        }
      } catch (e) {
        console.log('취소', e)
      }
    },

    async addHistory () {
      await this.$dialog.confirm('정산 이력을 생성하시겠습니까?')

      const targetDate = moment(this.targetDate).format('YYYYMMDD')
      const response = await calculationService.addMonthCalcHistory(targetDate)
      const data = response.data

      if (data.resultCode !== '0000') {
        await this.$dialog.alert(data.resultMsg)
      } else {
        await this.$dialog.alert('생성되었습니다.')
        this.getCalcHistory()
        this.getAddPackageCount()
      }
    },

    showPartnersAllCalcStatus () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Ota/Calculation/CalcDetail/PartnerAllCalcListDialog',
        params: {
          targetDate: this.targetDate
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          dense: true,
          width: '1000'
        }
      })
    }
  }
}
</script>
