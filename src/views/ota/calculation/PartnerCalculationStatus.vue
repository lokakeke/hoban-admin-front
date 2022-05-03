<template>
  <app-card>
    <v-row>
      <v-col>
        <h1 class="h3">{{ title }}</h1>
      </v-col>
      <v-col class="text-end">
        <v-menu
          ref="menu"
          v-model="isCalendarOpen"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn rounded color="green" class="white--text mr-2" @click="exportExcel">
              <v-icon left>dashboard</v-icon>엑셀 다운로드(F2)
            </v-btn>
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
            v-model="selectedMonth"
            type="month"
            locale="kr"
            no-title
            @change="changeMonth($event)"
          />
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          no-data-text="검색 결과가 없습니다."
          :headers="computedHeaders"
          :items="calculationList"
          fixed-header
          disable-pagination
          dense
          hide-default-footer
        >
          <template v-slot:item.roomAftpayAmt="{item}">
            <span>{{ item.roomAftpayAmt | price }}</span>
          </template>
          <template v-slot:item.pkgAftpayAmt="{item}">
            <span>{{ item.pkgAftpayAmt | price }}</span>
          </template>
          <template v-slot:item.bkpmsAftpayAmt="{item}">
            <span>{{ item.bkpmsAftpayAmt | price }}</span>
          </template>
          <template v-slot:item.totalAmt="{item}">
            <span class="font-weight-bold">{{ item.totAmt | price }}</span>
          </template>
          <template v-slot:item.ptnrRoomAftpayAmt="{item}">
            <span>{{ item.ptnrRoomAftpayAmt | price }}</span>
          </template>
          <template v-slot:item.ptnrPkgAftpayAmt="{item}">
            <span>{{ item.ptnrPkgAftpayAmt | price }}</span>
          </template>
          <template v-slot:item.ptnrBkpmsAftpayAmt="{item}">
            <span>{{ item.ptnrBkpmsAftpayAmt | price }}</span>
          </template>
          <template v-slot:item.ptnrTotalAmt="{item}">
            <span class="font-weight-bold">{{ item.ptnrTotAmt | price }}</span>
          </template>
          <template v-slot:item.prepayAmt="{item}">
            <v-text-field
              v-model="item.prepayAmt"
              class="centered-input"
              hide-details
              dense
              :disabled="isPartner"
            />
          </template>
          <template v-slot:item.totAmt="{item}">
            <span class="font-weight-bold">{{ item.totAmt - item.prepayAmt | price }}</span>
          </template>
          <template v-slot:item.ptnrTotAmt="{item}">
            <span class="font-weight-bold">{{ item.ptnrTotAmt - item.prepayAmt | price }}</span>
          </template>
          <template v-slot:item.minusAmt="{item}">
            <span class="font-weight-bold red--text">{{ parseInt(item.totAmt) - parseInt(item.ptnrTotAmt) | price }}</span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col align-self="center" class="text-right" v-if="writeAuth && !isPartner">
        <v-btn rounded color="blue" class="white--text" @click="updatePrepayAmt">저장(F10)</v-btn>
      </v-col>
    </v-row>
  </app-card>
</template>

<script>
import ptnrCalcStatusService from '@/api/modules/ota/partnerCalculationStatus.service'
import { mapGetters } from 'vuex'
import excelMixin from '@/mixins/excelMixin'

export default {
  name: 'PartnerCalculationStatus',
  mixins: [excelMixin],
  data () {
    return {
      selectedDate: moment().format('YYYYMMDD'),
      selectedMonth: null, // 선택된 달
      isCalendarOpen: false,
      calculationList: [],
      headers: [
        {
          text: '파트너사',
          value: 'companyName',
          align: 'center',
          sortable: true
        },
        {
          text: '객실료 후불금액',
          value: 'roomAftpayAmt',
          align: 'center',
          sortable: true
        },
        {
          text: '패키지 후불금액',
          value: 'pkgAftpayAmt',
          align: 'center',
          sortable: true
        },
        {
          text: '위약금',
          value: 'bkpmsAftpayAmt',
          align: 'center',
          sortable: true
        },
        {
          text: '총금액',
          value: 'totalAmt',
          align: 'center',
          sortable: true
        },
        {
          text: '파트너 객실료 후불금액',
          value: 'ptnrRoomAftpayAmt',
          align: 'center',
          sortable: true
        },
        {
          text: '파트너 패키지 후불금액',
          value: 'ptnrPkgAftpayAmt',
          align: 'center',
          sortable: true
        },
        {
          text: '파트너 위약금',
          value: 'ptnrBkpmsAftpayAmt',
          align: 'center',
          sortable: true
        },
        {
          text: '파트너 총금액',
          value: 'ptnrTotalAmt',
          align: 'center',
          sortable: true
        },
        {
          text: '선입금액',
          value: 'prepayAmt',
          align: 'center',
          sortable: true
        },
        {
          text: '총금액',
          value: 'totAmt',
          align: 'center',
          sortable: true
        },
        {
          text: '파트너 총금액',
          value: 'ptnrTotAmt',
          align: 'center',
          sortable: true
        },
        {
          text: '차액',
          value: 'minusAmt',
          align: 'center',
          sortable: true
        }
      ]
    }
  },
  computed: {
    ...mapGetters({ user: 'auth/user' }),
    title () {
      const titleDate = moment(this.selectedDate).format('YYYY년 MM월')
      return `${titleDate} 정산 현황`
    },
    computedHeaders () {
      return this.headers
    }
  },
  mounted () {
    this.selectMonthCalculationStatus(this.selectedDate)
  },
  methods: {
    /**
     * 월별 캘린더 오픈
     */
    showCalendar () {
      this.isCalendarOpen = true
      this.selectedMonth = moment(this.selectedDate).format('YYYY-MM')
    },
    /**
     * 새로운 월에 대한 정보 추가
     * @param date
     */
    changeMonth (date) {
      this.selectedDate = moment(date).format('YYYYMMDD')
      this.selectMonthCalculationStatus(this.selectedDate)
    },
    /**
     * 월별 파트너 정산 현황 목록 조회
     */
    async selectMonthCalculationStatus (selectedDate) {
      let partnerSeq = 0
      if (this.isPartner) {
        partnerSeq = this.user.number
      }
      const res = await ptnrCalcStatusService.selectMonthCalculationStatus(partnerSeq, selectedDate)
      this.calculationList = res.data
    },
    /**
     * 선입금 금액 변경
     */
    async updatePrepayAmt () {
      if (this.calculationList.length > 0) {
        const res = await ptnrCalcStatusService.updatePrepayAmt(this.selectedDate, this.calculationList)
        if (res) {
          this.$dialog.alert('성공적으로 저장되었습니다.')
        }
      } else {
        this.$dialog.alert('저장할 내용이 없습니다.')
      }
    },
    /**
     * 엑셀 다운로드
     */
    exportExcel () {
      if (this.calculationList.length > 0) {
        const excelParam = {}
        excelParam.partnerSeq = this.isPartner ? this.user.number : 0
        excelParam.selectedDate = this.selectedDate
        this.downLoadExcel('/api/system/ota/partnerCalcStatus/excel', '파트너 정산 현황', excelParam)
      } else {
        this.$dialog.alert('다운로드할 현황이 없습니다.')
      }
    }
  }
}
</script>

<style scoped>
  .centered-input >>> input {
    text-align: right
  }
</style>
