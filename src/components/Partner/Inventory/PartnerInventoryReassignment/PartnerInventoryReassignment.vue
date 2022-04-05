<template>
  <dialog-base :instance="instance" :title="'잔여재고 일자별 재할당'">
    <v-row align="center">
      <v-col cols="5">
        <p class="pb-0 mb-0 mt-1 font-weight-bold">일자 선택</p>
        <date-picker
          v-model="selectDate"
          format="YYYY-MM-DD"
          :min="min"
          required/>
      </v-col>
      <v-col cols="7" class="text-left font-weight-bold pr-0 primary--text body-2">
        <p class="mb-1 success--text">* 재할당 기능은 오늘 이후의 데이터만 가능합니다.</p>
        <p class="mb-1 success--text">* 전송 조건 설정 하신 객실만<br/>전송비율 관리중인 파트너별 비율로 예약됩니다.</p>
      </v-col>
    </v-row>
    <template v-slot:actions>
      <v-btn outlined rounded color="primary" @click="viewInventory">
        <v-icon left>search</v-icon>
        전지역 객실 현황  (F2)
      </v-btn>
      <v-btn outlined rounded color="info" @click="reassignment" v-if="writeAuth"><v-icon left>check</v-icon>재할당 (F3)</v-btn>
      <v-btn outlined rounded color="primary" @click="close"><v-icon left>close</v-icon>닫기</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import partnerInventoryExpectService from '@/api/modules/partner/partnerInventoryExpect.service'

export default {
  extends: DialogBase,
  name: 'PartnerInventoryReassignment',
  data () {
    return {
      list: [],
      selectDate: moment().format('YYYY-MM-DD'),
      min: moment().format('YYYY-MM-DD')
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [
        { target: 'F2', action: this.viewInventory },
        { target: 'F3', action: this.reassignment, writeAuth: true }
      ]
    })
  },
  methods: {
    async reassignment () {
      try {
        // 날짜 validation
        if (!this.selectDate) {
          this.$dialog.alert('일자를 선택해 주새요.')
        } else if (moment(this.selectDate) < moment(this.min)) {
          this.$dialog.alert('오늘 이전 일자는 선택할 수 없습니다.')
        } else {
          await this.$dialog.confirm(`${this.selectDate} 날짜를 재할당 하시겠습니까?<br/>전송 조건 설정 하신 객실만<br/>전송비율 관리중인 파트너별 비율로 예약됩니다.`)
          const res = await partnerInventoryExpectService.reassignPartnerInventory(this.selectDate)
          // 결과 팝업 호출
          await this.$store.dispatch('dialog/open', {
            componentPath: '/Partner/Inventory/PartnerInventoryReassignment/PartnerInventoryReassignmentResult',
            params: {
              list: res.data
            },
            options: {
              fullscreen: false,
              scrollable: true,
              width: 1200
            }
          })
        }
      } catch (e) {}
    },
    viewInventory () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/SearchDialog/InventorySearch',
        params: {},
        options: {
          fullscreen: false,
          scrollable: true,
          width: 1200
        }
      })
    }
  }
}
</script>
