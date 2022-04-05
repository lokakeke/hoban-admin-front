<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      파트너 일자별 재할당 결과
    </template>
    <v-row justify="space-between" class="px-3">
      <span class="subtitle-1 font-weight-bold mb-2">
        총 {{list.length}} 건
      </span>
      <div class="subtitle-1 font-weight-bold mb-2 info--text">
        * 예약은 진행 중이며, 결과는 파트너 재고예약 리스트에서 확인 하실수 있습니다.
      </div>
    </v-row>
    <v-simple-table dense class="bordered" fixed-header height="450">
      <thead>
      <tr>
        <th class="text-center">영업장</th>
        <th class="text-center">객실타입</th>
        <th class="text-center">기준일자</th>
        <th class="text-center">파트너</th>
        <th class="text-center">수량</th>
        <th class="text-center">예약블럭</th>
        <th class="text-center">블럭재고</th>
        <th class="text-center">본사재고</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) of list" :key="index">
        <td class="text-center">{{item.storeName}} - {{item.storeCode}}</td>
        <td class="text-center">{{item.rmTypeName}} - {{item.rmTypeCode}}</td>
        <td class="text-center">{{item.ciYmd | date}}</td>
        <td class="text-center">{{item.ptnrName}}</td>
        <td class="text-center">{{item.rmCnt}}</td>
        <td class="text-center">{{item.rsvBlckCode}}</td>
        <td class="text-center">{{item.rsvBlckCnt}}</td>
        <td class="text-center">{{item.companyCnt}}</td>
      </tr>
      </tbody>
    </v-simple-table>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'PartnerInventoryReassignmentResult',
  data () {
    return {
      list: []
    }
  },
  mounted () {
    this.list = this.instance.params.list
  }
}
</script>
