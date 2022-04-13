<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      파트너 별 전체 정산현황
    </template>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-data-table
              :headers="tableHeaders"
              :items="tableItems"
              :no-results-text="emptyText"
              :no-data-text="emptyText"
              disable-sort
              disable-pagination
              hide-default-footer
          >
            <template v-slot:item.roomAprlDt="{ item }">
              {{ item.roomAprlDt ? item.roomAprlDt : '-' }}
            </template>
            <template v-slot:item.pkgAprlDt="{ item }">
              {{ item.pkgAprlDt ? item.pkgAprlDt : '-' }}
            </template>
            <template v-slot:item.bkpmsAprlDt="{ item }">
              {{ item.bkpmsAprlDt ? item.bkpmsAprlDt : '-' }}
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
  name: 'PartnerAllCalcListDialog',
  data: function () {
    return {
      targetDate: '',

      tableHeaders: [
        { text: '파트너번호', value: 'partnerSeq', align: 'center', width: '20%' },
        { text: '파트너명', value: 'companyName', align: 'center', width: '60%' },
        { text: '객실 승인시간', value: 'roomAprlDt', align: 'center', width: '20%' },
        { text: '패키지 승인시간', value: 'pkgAprlDt', align: 'center', width: '20%' },
        { text: '위약 승인시간', value: 'bkpmsAprlDt', align: 'center', width: '20%' }
      ],
      tableItems: []
    }
  },
  mounted () {
    this.targetDate = this.instance.params.targetDate
    this.getPartnerAllCalcList()
  },
  methods: {
    async getPartnerAllCalcList () {
      const response = await calculationService.retrievePartnersAllCalcStatus(this.targetDate)
      const data = response.data

      if (data.resultCode !== '0000') {
        this.tableItems = []
      } else {
        this.tableItems = data.resultList
      }
    }
  }
}
</script>

<style scoped>
</style>
