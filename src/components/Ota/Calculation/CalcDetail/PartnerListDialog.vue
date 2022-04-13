<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      파트너 정산현황
    </template>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-data-table
              :headers="tableHeaders"
              :items="tableItems"
              disable-sort
              disable-pagination
              hide-default-footer
          >
            <template v-slot:item.calcYn="{ item }">
              <v-chip v-if="item.calcYn === 'Y'" color="secondary">완료</v-chip>
              <v-chip v-else dark color="red">미완료</v-chip>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import calculationService from '@/api/modules/ota/calculation.service'

export default {
  extends: DialogBase,
  name: 'PartnerListDialog',
  data: function () {
    return {
      calcItem: '',

      tableHeaders: [
        { text: '파트너번호', value: 'partnerSeq', align: 'center', width: '20%' },
        { text: '파트너명', value: 'companyName', align: 'center', width: '60%' },
        { text: '승인시간', value: 'ptnrAprlDt', align: 'center', width: '20%' },
        { text: '정산유무', value: 'calcYn', align: 'center', width: '20%' }
      ],
      tableItems: []
    }
  },
  mounted () {
    this.calcItem = this.instance.params.calcItem
    this.getPartnerList()
  },
  methods: {
    async getPartnerList () {
      const response = await calculationService.retrievePartnersCalcStatus(this.calcItem.calcSeq)
      const data = response.data

      if (data.resultCode !== '0000') {
        this.$dialog.alert(data.resultMsg)
      } else {
        this.tableItems = data.resultList
      }
    }
  }
}
</script>

<style scoped>
</style>
