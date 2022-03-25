<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <span class="headline">정산 그룹번호 상세</span>
    </template>
    <v-row>
      <v-col cols="12" class="pt-0 pb-5">
        <v-card tile>
            <v-card-text class="subtitle-1">
              <span class="mr-10">정산 그룹번호 : <span class="font-weight-bold">{{calcNo}}</span></span>
              <span class="mr-10">정산 그룹번호 명 : <span class="font-weight-bold">{{calcNm}}</span></span>
            </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-data-table
      :no-data-text="'데이터가 없습니다.'"
      :no-result-text="'데이터가 없습니다..'"
      :headers="headers"
      :items="detailList"
      class="bordered"
      hide-default-footer>
    </v-data-table>
    <template v-slot:actions>
      <v-btn outlined rounded color="primary" @click="close"><v-icon left>close</v-icon>닫기</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import ticketCalcService from 'Api/modules/social/ticketCalc.service'

export default {
  extends: DialogBase,
  name: 'GroupDetailForm',
  data () {
    return {
      headers: [
        { text: '우대번호', value: 'ticketNo', align: 'center', sortable: false },
        { text: '우대번호 명', value: 'ticketNm', align: 'center', sortable: false },
        { text: '우대번호 유효기간', value: 'vaildThruYmd', align: 'center', sortable: false },
        { text: '등록자', value: 'crtId', align: 'center', sortable: false }
      ],
      calcNo: String,
      calcNm: String,
      detailList: []
    }
  },
  mounted () {
    if (this.instance.params.data) {
      this.calcNo = this.instance.params.data.calcNo
      this.calcNm = this.instance.params.data.calcNm
    }
    this.search()
  },
  methods: {
    search () {
      ticketCalcService.selectCalcGroupDetail(this.calcNo).then(res => {
        if (res.data) {
          this.detailList = res.data
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
