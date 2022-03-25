<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      다중 예약 취소 결과
    </template>
    <v-simple-table dense class="bordered">
      <thead>
      <tr>
        <th class="text-center">예약상태</th>
        <th class="text-center">이용자명</th>
        <th class="text-center">예약번호(4자리)</th>
        <th class="text-center">결과 메시지</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) of list" :key="index">
        <td class="text-center">{{item.resultCode === '0000' ? '성공' : '실패'}}</td>
        <td class="text-center">{{item.guestNm}}</td>
        <td class="text-center">{{item.rsvNo}}</td>
        <td class="text-center" v-html="item.resultMsg"></td>
      </tr>
      </tbody>
    </v-simple-table>
    <template v-slot:actions>
      <v-btn outlined rounded color="primary" @click="close">닫기(ESC)</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'MultiCancelResultPopup',
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
