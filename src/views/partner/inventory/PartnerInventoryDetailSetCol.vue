<template>
  <v-row>
    <app-card :heading="'파트너 재고 상세할당'" col-classes="col-12">
      <partner-inventory-detail-set-form v-model="searchCondition"></partner-inventory-detail-set-form>
      <v-divider></v-divider>
      <p class="mb-2 info--text">* 파트너 재고관리 중인 영업장, 객실타입, 판매중 일자 의 재고만 예약 가능합니다.</p>
      <partner-inventory-detail-set-list v-if="searchCondition" v-model="searchCondition" :partner-origin="partnerOrigin"></partner-inventory-detail-set-list>
      <div v-else>
        <v-row justify="center" class="title font-weight-bold mt-5 py-10">
          조건 선택 후 검색(F3) 을 진행해 주세요.
        </v-row>
      </div>
    </app-card>
  </v-row>
</template>

<script>
import PartnerInventoryDetailSetForm
  from 'Components/Partner/Inventory/PartnerInventoryDetailSet/PartnerInventoryDetailSetForm.vue'
import PartnerInventoryDetailSetList
  from 'Components/Partner/Inventory/PartnerInventoryDetailSet/PartnerInventoryDetailSetList.vue'
import partnerInventoryRateService from '@/api/modules/partner/partnerInventoryRate.service'

export default {
  components: { PartnerInventoryDetailSetForm, PartnerInventoryDetailSetList },
  name: 'PartnerInventoryDetailSet',
  data () {
    return {
      searchCondition: null,
      // 파트너 리스트
      partnerOrigin: []
    }
  },
  async mounted () {
    // 전체 파트너 리스트 조회
    const res = await partnerInventoryRateService.selectPartnerInventoryRateList()
    this.partnerOrigin = res.data.managementList.concat(res.data.noneManagementList)
  }
}
</script>
