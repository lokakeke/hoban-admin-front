<template>
    <v-row wrap>
        <v-col sm="12">
            <app-card :heading="'정산 목록'">
                <search-form :search-param.sync="searchParam" :search-list="searchList" @search="search"></search-form>
                <v-data-table
                    :no-data-text="emptyText"
                    :headers="headers"
                    :items="list"
                    class="bordered"
                    hide-default-footer
                    disable-pagination
                    item-key="calcSeq"
                >
                    <template v-slot:item.ticketCnt="{ item }">
                        <v-tooltip right>
                            <template v-slot:activator="{ on, attrs }">
                                <!-- 월정산 완료 개수-->
                                <v-btn text block rounded color="blue" v-bind="attrs" v-on="on"
                                       v-if="item.calcInd === 'A'">{{ item.monthCnt }}
                                </v-btn>
                                <!-- 딜정산 진행수 / 완료 수 -->
                                <v-btn text block rounded v-bind="attrs" v-on="on" v-if="item.calcInd === 'B'"
                                       color="blue">{{ item.nowCnt }} / {{ item.totalCnt }}
                                </v-btn>
                            </template>
                            <span v-for="detail of item.ticketList" :key="item.calcSeq+detail.ticketNo">
                [ {{ detail.ticketNo }} ] / {{ detail.calcInd }} / {{ detail.ticketName }} /
                <span>{{ detail.vaildThruBgnYmd | date("YYYY.MM.DD")
                    }} ~ {{ detail.vaildThruEndYmd | date("YYYY.MM.DD") }} / </span>
                <span v-if="item.calcInd === 'A'">
                  [정산월 : {{ detail.calcYmd }}]
                </span>
                <span v-else>
                  <span v-if="detail.comptYn === 'Y'"><span
                      class="font-weight-bold blue--text">정산완료</span> / [정산일 : </span>
                  <span v-else><span
                      class="font-weight-bold orange--text">진행중</span> / [예정일 : </span> {{ detail.calcYmd }}]
                </span>
                <br />
              </span>
                        </v-tooltip>
                    </template>
                    <template v-slot:item.calcYmd="{ item }">
                        <span
                            v-if="item.calcInd === 'A' && item.calcEndYmd">{{ item.calcEndYmd | date("YYYY.MM") }}</span>
                        <span
                            v-else-if="item.calcInd === 'B'">{{ item.calcBgnYmd | date("YYYY.MM.DD") }} ~ {{ item.calcEndYmd | date("YYYY.MM.DD") }}</span>
                    </template>
                    <template v-slot:item.calcInd="{ item }">
                        <v-btn text block rounded color="green" @click="openDetail(item)">
                            <span v-if="item.calcInd === 'A'">월정산</span>
                            <span v-else-if="item.calcInd === 'B'">딜정산</span>
                        </v-btn>
                    </template>
                    <template v-slot:item.mngmAprlId="{ item }">
            <span v-if="item.comptYn === 'Y' && !item.mngmAprlId">
              <v-btn outlined rounded color="deep-purple" @click="updateMngmAprl(item)">승인대기</v-btn>
            </span>
                        <span v-else-if="item.mngmAprlId"
                              class="font-weight-bold red--text">승인완료<br>({{ item.mngmAprlDt | date("YYYY.MM.DD") }})</span>
                        <span v-else>정산 진행중</span>
                    </template>
                    <template v-slot:item.ptnrAprlId="{ item }">
            <span v-if="item.comptYn === 'Y'">
              <span v-if="!item.mngmAprlId"></span>
              <span v-else-if="!item.ptnrAprlId && isPartner">
                <v-btn outlined rounded color="deep-purple" @click="updatePtnrAprl(item)">승인대기</v-btn>
              </span>
              <span v-else-if="!item.ptnrAprlId && !isPartner" class="font-weight-bold red--text">파트너 담당자<br>승인대기</span>
              <span v-else
                    class="font-weight-bold red--text">승인완료<br>({{ item.ptnrAprlDt | date("YYYY.MM.DD") }})</span>
            </span>
                        <span v-else>정산 진행중</span>
                    </template>
                    <template v-slot:item.lockYn="{ item }">
            <span v-if="writeAuth && item.mngmAprlId && item.ptnrAprlId && item.lockYn !== 'Y'">
              <v-btn outlined rounded color="deep-purple" @click="updateLockYn(item)">잠금</v-btn>
            </span>
                        <span v-else-if="item.lockYn === 'Y'" class="font-weight-bold red--text">잠금</span>
                        <span v-else>승인대기</span>
                    </template>
                    <template v-slot:item.reCalc="{ item }">
                        <v-btn text block rounded color="green" @click="reCalculate(item)"
                               :disabled="(item.calcInd === 'B' && item.comptYn === 'N') || item.lockYn === 'Y'">
                            <v-icon small>refresh</v-icon>
                            재정산
                        </v-btn>
                    </template>
                    <template v-slot:item.useYn="{ item }">
                        <v-btn text block rounded color="accent" @click="deleteCalc(item)"
                               :disabled="item.lockYn === 'Y'">
                            <v-icon small>remove</v-icon>
                            삭제
                        </v-btn>
                    </template>
                </v-data-table>
                <v-row v-if="writeAuth">
                    <v-col cols="8">
                    </v-col>
                    <v-col cols="1" class="text-right">
            <span>
              <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon color="primary" v-on="on" size="21" class="mb-0">help_outline</v-icon>
              </template>
              <span>월정산은 매달 1일에 지난달 데이터가 정산됩니다.<br>
                    2020.08월 데이터를 정산 할 경우 다음 달을 입력해주세요. Ex) 202009
              </span>
            </v-tooltip>
            </span>
                        <v-text-field v-model="monthDt" label="Ex) 202009" hide-details dense class="mt-0 pt-0"
                                      style="width: 150px" maxlength="6"></v-text-field>
                    </v-col>
                    <v-col cols="1" class="pl-0" align-self="end">
                        <v-btn outlined rounded color="info" @click="monthCalc()">월정산 수동</v-btn>
                    </v-col>
                    <v-col cols="1" class="text-right">
            <span>
              <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon color="primary" v-on="on" size="21" class="mb-0">help_outline</v-icon>
              </template>
              <span>우대번호 유효기간이 종료된 다음날 딜정산이 진행됩니다.<br>
                    2020.07.31일에 종료된 우대번호를 정산 할 경우<br>
                    하루 지난날짜를 입력해주세요 Ex) 20200801
              </span>
            </v-tooltip>
            </span>
                        <v-text-field v-model="dealDt" label="Ex) 20200801" hide-details dense class="mt-0 pt-0"
                                      style="width: 150px" maxlength="8"></v-text-field>
                    </v-col>
                    <v-col cols="1" class="pl-0" align-self="end">
                        <v-btn outlined rounded color="info" @click="dealCalc()">딜정산 수동</v-btn>
                    </v-col>
                </v-row>
                <search-pagination v-model="searchParam" :total-visible="10" circle
                                   @change="search"></search-pagination>
            </app-card>
        </v-col>
    </v-row>
</template>

<script>

import calculateService from '@/api/modules/social/calculate.service'
import { mapGetters } from 'vuex'

export default {
  name: 'Calculate',
  data: function () {
    return {
      searchParam: {
        q: {},
        page: 1,
        size: 10,
        total: 0
      },
      list: [],
      param: {
        stndDt: '',
        crtId: 'SYSTEM',
        autoYn: 'N'
      },
      monthDt: '',
      dealDt: ''
    }
  },
  computed: {
    searchList () {
      return [
        { key: 'ticketNo', label: '우대번호', type: 'text' },
        { key: 'companyName', label: '파트너명', type: 'text' },
        { key: 'calcInd', label: '정산구분', type: 'text' },
        { key: 'progress', label: '진행단계', type: 'text' },
        { key: 'crtDt', label: '생성일자', type: 'text' }
      ]
    },
    headers () {
      if (this.isPartner) {
        return [
          { text: '정산 번호', value: 'calcNo', align: 'center', sortable: false },
          { text: '정산 명', value: 'calcName', align: 'center', sortable: false },
          { text: '정산기간', value: 'calcYmd', align: 'center', sortable: false },
          { text: '파트너명', value: 'companyName', align: 'center', sortable: false },
          { text: '진행 중 / 전체', value: 'ticketCnt', align: 'center', sortable: false },
          { text: '정산 구분', value: 'calcInd', align: 'center', sortable: false },
          { text: '생성 일자', value: 'crtDt', align: 'center', sortable: false },
          { text: '담당자 승인(일자)', value: 'mngmAprlId', align: 'center', sortable: false },
          { text: '파트너 승인(일자)', value: 'ptnrAprlId', align: 'center', sortable: false },
          { text: '잠금 여부', value: 'lockYn', align: 'center', sortable: false }
        ]
      } else {
        return [
          { text: '정산 번호', value: 'calcNo', align: 'center', sortable: false },
          { text: '정산 명', value: 'calcName', align: 'center', sortable: false },
          { text: '정산기간', value: 'calcYmd', align: 'center', sortable: false },
          { text: '파트너명', value: 'companyName', align: 'center', sortable: false },
          { text: '진행 중 / 전체', value: 'ticketCnt', align: 'center', sortable: false },
          { text: '정산 구분', value: 'calcInd', align: 'center', sortable: false },
          { text: '생성 일자', value: 'crtDt', align: 'center', sortable: false },
          { text: '담당자 승인(일자)', value: 'mngmAprlId', align: 'center', sortable: false },
          { text: '파트너 승인(일자)', value: 'ptnrAprlId', align: 'center', sortable: false },
          { text: '잠금 여부', value: 'lockYn', align: 'center', sortable: false },
          { text: '재정산', value: 'reCalc', align: 'center', sortable: false },
          { text: '삭제', value: 'useYn', align: 'center', sortable: false }
        ]
      }
    },
    ...mapGetters({ user: 'auth/user' })
  },
  mounted () {
    this.search()
  },
  methods: {
    // 목록 조회
    search () {
      if (this.isPartner) {
        this.searchParam.q.partnerSeq = this.user.number
        this.searchParam.q.ptnrYn = 'Y'
      }
      calculateService.selectCalculateList(this.searchParam).then(res => {
        if (res.data) {
          this.list = res.data
          this.searchParam.total = res.pagination.total
        }
      })
    },
    // 정산 상세
    openDetail (item) {
      const param = {}
      param.calcNo = item.calcNo
      param.calcInd = item.calcInd
      // 정산순번이 가장 최신번호인지 확인
      calculateService.checkLastCalcNo(param).then(res => {
        const calcSeq = res.data
        if (calcSeq !== item.calcSeq) {
          this.$dialog.alert('정산이 진행중입니다. 재검색 후 조회해 주세요.')
        } else {
          // dialog open
          item.historyYn = 'N'
          this.isLoading = true
          this.$store.dispatch('dialog/open', {
            componentPath: '/Social/Calculate/CalculateForm',
            params: {
              info: item
            },
            options: {
              dense: true,
              retainFocus: false,
              persistent: true,
              scrollable: true,
              fullscreen: true
            }
          })
        }
      })
    },
    // 담당자 정산 승인
    updateMngmAprl (item) {
      this.$dialog.confirm('승인하시겠습니까?').then(() => {
        calculateService.updateMngmAprlCalc(item).then(() => {
          this.$dialog.alert('담당자 승인이 완료되었습니다.')
          this.search()
        })
      })
    },
    // 파트너 정산 승인
    updatePtnrAprl (item) {
      item.partnerManagerId = this.user.partnerManagerId
      this.$dialog.confirm('승인하시겠습니까?').then(() => {
        calculateService.updatePtnrAprlCalc(item).then(() => {
          this.$dialog.alert('승인이 완료되었습니다.')
          this.search()
        })
      })
    },
    // 잠김 승인
    updateLockYn (item) {
      this.$dialog.confirm('잠금 이후에는 재정산, 삭제가 불가능합니다.<br>잠금 설정 하시겠습니까?').then(() => {
        calculateService.updateLockYn(item).then(() => {
          this.$dialog.alert('잠금 설정이 완료되었습니다.')
          this.search()
        })
      })
    },
    // 정산 삭제
    deleteCalc (item) {
      calculateService.deleteCalculate(item).then(res => {
        if (res.data) {
          this.search()
        }
      })
    },
    // 재정산
    reCalculate (item) {
      calculateService.reCalculate(item)
      this.$dialog.alert('정산 완료 후 알림이 전송됩니다.')
    },
    monthCalc () {
      if (!this.monthDt) {
        this.$dialog.alert('날짜를 입력해주세요.')
        return
      }
      this.param.stndDt = this.monthDt
      calculateService.monthCalc(this.param)
      this.$dialog.alert('정산 완료 후 알림이 전송됩니다.')
    },
    dealCalc () {
      if (!this.dealDt) {
        this.$dialog.alert('날짜를 입력해주세요.')
        return
      }
      this.param.stndDt = this.dealDt
      calculateService.dealCalc(this.param)
      this.$dialog.alert('정산 완료 후 알림이 전송됩니다.')
    }
  }
}
</script>
