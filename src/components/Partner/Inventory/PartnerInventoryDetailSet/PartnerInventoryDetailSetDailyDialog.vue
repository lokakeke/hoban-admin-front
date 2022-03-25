<template>
    <dialog-base :instance="instance" :title="'* 일자별 잔여재고 상세할당'">
        <partner-inventory-detail-set-daily v-model="select" :partner-origin="partnerOrigin" @refresh="refresh"
                                            is-dialog></partner-inventory-detail-set-daily>
    </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase'
import PartnerInventoryDetailSetDaily
  from 'Components/Partner/Inventory/PartnerInventoryDetailSet/PartnerInventoryDetailSetDaily.vue'

export default {
  components: { PartnerInventoryDetailSetDaily },
  extends: DialogBase,
  name: 'PartnerInventoryDetailSetDailyDialog',
  data () {
    return {
      select: null,
      partnerOrigin: []
    }
  },
  mounted () {
    this.partnerOrigin = this.instance.params.partnerOrigin
    this.select = this.instance.params.select
  },
  methods: {
    refresh () {
      this.close({ search: true })
    }
  }
}
</script>
