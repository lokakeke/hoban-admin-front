<template>
    <app-card :heading="'재고예약 전송비율 요일 설정'" col-classes="col-md-4 col-12" :min-height="300" auto-height
              content-classes="py-1">
        <template v-slot:items>
            <v-row align="end">
                <v-col cols="12" class="text-left font-weight-bold pr-0 primary--text body-2">
                    <p class="mb-1 info--text">* 자동전송 일자의 요일이 체크되어있을 경우만 예약이 진행 됩니다.</p>
                    <p class="mb-1 info--text">* 자동전송을 중지하고 싶으시면 전체 해제하시고 저장하시면 됩니다.</p>
                    <p class="mb-0 red--text">* 자동 예약 예상 일자 : {{ expectDate }} 요일</p>
                </v-col>
            </v-row>
        </template>
        <v-divider></v-divider>
        <v-row>
            <v-col cols="12">
                <span @click="clickAll" class="pointer"><v-icon left>{{ icon }}</v-icon> 전체선택</span>
            </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
            <v-col v-for="day of dayList" :key="day.value"
                   class="text-center" cols="6" lg="4">
                <v-checkbox :label="day.label"
                            :value="day.value"
                            hide-details
                            class="mt-0" :class="day.color + '--text'"
                            :color="day.color"
                            v-model="dayCheckList" />
            </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row v-if="writeAuth">
            <v-col cols="12" class="text-right">
                <v-btn rounded color="info" @click="submit">
                    <v-icon left>check</v-icon>
                    저장 (F3)
                </v-btn>
            </v-col>
        </v-row>
    </app-card>
</template>

<script>
import partnerInventoryRateService from 'Api/modules/partner/partnerInventoryRate.service'

export default {
  name: 'PartnerInventoryRateOptionDay',
  data () {
    return {
      dayList: [
        { value: '1', label: '월요일', color: 'primary' },
        { value: '2', label: '화요일', color: 'primary' },
        { value: '3', label: '수요일', color: 'primary' },
        { value: '4', label: '목요일', color: 'primary' },
        { value: '5', label: '금요일', color: 'primary' },
        { value: '6', label: '토요일', color: 'blue' },
        { value: '7', label: '일요일', color: 'red' }
      ],
      dayCheckList: []
    }
  },
  async mounted () {
    const res = await partnerInventoryRateService.selectPartnerInventoryRateDayList()
    this.dayCheckList = res.data
    await this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [
        { target: 'F3', action: this.submit, writeAuth: true }
      ]
    })
  },
  computed: {
    expectDate () {
      // 당일 10시 인지 아닌지 판단.
      if (parseInt(moment().format('HH') < 10)) {
        // 당일 10시 일경우 오늘 + 30일
        return '오늘 오전 10시 -> ' + moment().add(30, 'days').format('YYYY 년 MM 월 DD 일 (ddd)')
      } else {
        // 당일 10시가 지났을 경우 오늘 + 31일
        return '내일 오전 10시 -> ' + moment().add(31, 'days').format('YYYY 년 MM 월 DD 일 (ddd)')
      }
    },
    icon () {
      if (this.dayList.length === this.dayCheckList.length) {
        return 'check_box'
      } else if (this.dayCheckList.length > 0) {
        return 'indeterminate_check_box'
      } else {
        return 'check_box_outline_blank'
      }
    }
  },
  methods: {
    clickAll () {
      if (this.dayList.length === this.dayCheckList.length) {
        this.dayCheckList = []
      } else {
        const dayCheckList = []
        for (const day of this.dayList) {
          dayCheckList.push(day.value)
        }
        this.dayCheckList = dayCheckList
      }
    },
    async submit () {
      try {
        await this.$dialog.confirm('파트너 재고예약 요일별 전송 설정을 입력하시겠습니까?')
        await partnerInventoryRateService.insertPartnerInventoryRateDayList(this.dayCheckList)
        this.$dialog.alert('요일설정 정보가 저장 되었습니다.')
      } catch (e) {
      }
    }
  }
}
</script>
