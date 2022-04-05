<template>
  <dialog-base :instance="instance" :title="`월정산 상세정보`">
    <template v-slot:buttons>
      <!--      <v-btn dark text @click="policy (`completed`)">-->
      <!--        <v-icon left>check</v-icon>-->
      <!--        이용완료-->
      <!--      </v-btn>-->
    </template>
    <v-card-text class="pa-0">
      <v-row>
        <v-col cols="12" class="pb-0">
          <v-data-table dense
            v-dragscroll="{target: '.v-data-table__wrapper'}"
            :no-data-text="emptyText" :headers="headers"
            :items="list" item-key="pkgNo"
            hide-default-footer
            disable-pagination
            disable-sort
            :loading="isLoading"
            loading-text="조회 중입니다. 잠시만 기다려주세요..."
            class="bordered">
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'MonthForm',
  data: function () {
    return {
      list: null,
      headers: [
        { text: '서비스', value: 'id', align: 'center', sortable: false },
        { text: '지역', value: 'name', align: 'center', sortable: false },
        { text: '회원번호', value: 'pkgNo', align: 'center', sortable: false },
        { text: '예약번호', value: 'name3', align: 'center', sortable: false },
        { text: '회원명', value: 'price', align: 'center', sortable: false },
        { text: '예약번호(N)', value: 'memo', align: 'center', sortable: false },
        { text: '예약자', value: 'memo', align: 'center', sortable: false },
        { text: '종류', value: 'memo', align: 'center', sortable: false },
        { text: '(총)금액', value: 'memo', align: 'center', sortable: false },
        { text: '후불금액', value: 'memo', align: 'center', sortable: false },
        { text: '메모', value: 'memo', align: 'center', sortable: false }
      ],
      isLoading: true
    }
  },
  mounted () {
    this.list = this.instance.params.form
  }
}
</script>

<style scoped>

</style>
