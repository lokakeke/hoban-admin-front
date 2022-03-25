<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      쿠폰 사용 현황
    </template>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-data-table
              :no-data-text="emptyText"
              :no-results-text="emptyText"
              :headers="headers"
              :items="items"
              disable-sort
              disable-pagination
              hide-default-footer
          >
            <template v-slot:item.copnIssuYmd="{ item }">
              {{ item.copnIssuYmd | date }}
            </template>
            <template v-slot:item.useYmd="{ item }">
              {{ item.useYmd | date }}
            </template>
            <template v-slot:item.cancelYmd="{ item }">
              {{ item.cancelYmd | date }}
            </template>
            <template v-slot:item.validYmd="{ item }">
              {{ item.validYmd | date }}
            </template>
            <template v-slot:item.saleAmt="{ item }">
              {{ item.saleAmt | price }}
            </template>
            <template v-slot:item.addAmt="{ item }">
              {{ item.addAmt | price }}
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </dialog-base>
</template>

<script>
import DialogBase from "@/components/Dialog/DialogBase"
import calculationService from "Api/modules/ota/calculation.service"

export default {
  extends: DialogBase,
  name: 'CouponStatusDialog',
  data: function () {
    return {
      headers: [
        { text: '패키지번호', value: 'pkgNo', align: 'center' },
        { text: '패키지순번', value: 'pkgSeq', align: 'center' },
        { text: '판매순번', value: 'saleSeq', align: 'center' },
        { text: '쿠폰발행일', value: 'copnIssuYmd', align: 'center' },
        { text: '쿠폰사용일', value: 'useYmd', align: 'center' },
        { text: '쿠폰취소일', value: 'cancelYmd', align: 'center' },
        { text: '쿠폰유효일', value: 'validYmd', align: 'center' },
        { text: '사용여부', value: 'useYn', align: 'center' },
        { text: '추가여부', value: 'addYn', align: 'center' },
        { text: '사용금액', value: 'saleAmt', align: 'center' },
        { text: '추가금액', value: 'addAmt', align: 'center' },
        { text: '메뉴명', value: 'pkgMenuNm', align: 'center' }
      ],
      items: []
    }
  },
  mounted () {
    this.getCouponUseStatus()
  },
  methods: {
    async getCouponUseStatus () {
      try {
        const response = await calculationService.retrieveCouponUseStatus(this.instance.params.keyRsvNo)
        const data = response.data

        if (data.resultCode !== '0000') {
          this.items = []
        } else {
          this.items = data.resultList
        }
      } catch (e) {
        console.log('알 수 없는 오류가 발생했습니다.', e)
      }
    }
  }
}
</script>

<style scoped>

</style>
