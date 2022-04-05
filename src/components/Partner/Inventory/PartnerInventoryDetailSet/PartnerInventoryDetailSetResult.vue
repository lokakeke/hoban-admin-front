<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      파트너 잔여 재고 상세할당 결과
    </template>
    <v-simple-table dense class="bordered">
      <thead>
      <tr>
        <th class="text-center">파트너</th>
        <th class="text-center">예약상태</th>
        <th class="text-center">예약번호 (4)</th>
        <th class="text-center">예약번호 (10)</th>
        <th class="text-center">객실 수</th>
        <th class="text-center">실패 메시지</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) of list" :key="index">
        <td class="text-center">{{item.ptnrName}}</td>
        <td class="text-center">{{item.sendStatus === 'S' ? '성공' : '실패'}}</td>
        <td class="text-center">{{item.roomRsvNo}}</td>
        <td class="text-center">{{item.keyRsvNo}}</td>
        <td class="text-center">{{item.rmCnt}}</td>
        <td class="text-center" v-html="item.errMsg"></td>
      </tr>
      </tbody>
    </v-simple-table>
    <template v-slot:actions>
      <v-btn outlined rounded color="primary" @click="close"><v-icon left>close</v-icon>닫기</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'PartnerInventoryDetailSetResult',
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
