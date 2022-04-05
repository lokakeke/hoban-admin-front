<template>
  <v-row wrap>
    <partner-inventory-rate-none-manage-list></partner-inventory-rate-none-manage-list>
    <partner-inventory-rate-manage-list :company="companyData" :refresh="getPartnerList"></partner-inventory-rate-manage-list>
  </v-row>
</template>

<script>
import PartnerInventoryRateManageList
  from '@/components/Partner/Inventory/PartnerInventoryRate/PartnerInventoryRateManageList.vue'
import PartnerInventoryRateNoneManageList
  from '@/components/Partner/Inventory/PartnerInventoryRate/PartnerInventoryRateNoneManageList.vue'
import partnerInventoryRateService from '@/api/modules/partner/partnerInventoryRate.service'

export default {
  components: { PartnerInventoryRateManageList, PartnerInventoryRateNoneManageList },
  name: 'PartnerInventoryRateTab',
  data () {
    return {
      companyData: {
        rate: ''
      }
    }
  },
  mounted () {
    this.getPartnerList()
  },
  methods: {
    /**
     * 파트너 전체 리스트 조회
     */
    async getPartnerList () {
      try {
        await this.$store.dispatch('partner/inventory/initList')
        const inventory = await partnerInventoryRateService.selectPartnerInventoryRateList()
        this.companyData = inventory.data.companyData || { rate: '' }
        await this.$store.dispatch('partner/inventory/setList', inventory.data.managementList || [])
        await this.$store.dispatch('partner/inventory/setNoneList', inventory.data.noneList.map(data => {
          data.add = false
          return data
        }) || [])
      } catch (e) {}
    }
  }
}
</script>
