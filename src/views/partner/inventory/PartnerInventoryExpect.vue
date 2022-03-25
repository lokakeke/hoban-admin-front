<template>
  <v-row>
    <app-card :heading="'파트너 재고예약 예상내역'" col-classes="col-12">
      <partner-inventory-expect-form v-model="searchCondition"></partner-inventory-expect-form>
      <v-row>
        <v-col cols="12" class="font-weight-bold primary--text">
          * 파트너 재고예약 자동전송 예상내역이 보여집니다. (설정 요일/ 선택 객실유형/ 사용기간 이 포함된 결과 데이터가 노출 됩니다.)
        </v-col>
      </v-row>
      <partner-inventory-expect-list v-if="searchCondition" v-model="searchCondition"></partner-inventory-expect-list>
      <div v-else>
        <v-row justify="center" class="title font-weight-bold mt-5 py-10">
          조건 선택 후 검색(F3) 을 진행해 주세요.
        </v-row>
      </div>
    </app-card>
  </v-row>
</template>

<script>
import PartnerInventoryExpectForm
  from 'Components/Partner/Inventory/PartnerInventoryExpect/PartnerInventoryExpectForm.vue'
import PartnerInventoryExpectList
  from 'Components/Partner/Inventory/PartnerInventoryExpect/PartnerInventoryExpectList.vue'

export default {
  components: { PartnerInventoryExpectForm, PartnerInventoryExpectList },
  name: 'PartnerInventoryStatus',
  data () {
    return {
      searchCondition: null
    }
  },
  methods: {
  }
}
</script>
