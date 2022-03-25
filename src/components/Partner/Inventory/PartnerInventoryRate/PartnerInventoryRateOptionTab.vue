<template>
  <v-row>
    <partner-inventory-rate-option-day></partner-inventory-rate-option-day>
    <partner-inventory-rate-option-type></partner-inventory-rate-option-type>
  </v-row>
</template>

<script>
import PartnerInventoryRateOptionDay
  from 'Components/Partner/Inventory/PartnerInventoryRate/PartnerInventoryRateOptionDay.vue'
import PartnerInventoryRateOptionType
  from 'Components/Partner/Inventory/PartnerInventoryRate/PartnerInventoryRateOptionType.vue'

export default {
  components: { PartnerInventoryRateOptionDay, PartnerInventoryRateOptionType },
  name: 'PartnerInventoryRateOptionTab'
}
</script>
