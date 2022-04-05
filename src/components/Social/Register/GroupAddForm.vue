<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <span class="headline">정산 그룹번호 생성</span>
    </template>
    <v-form ref="form" lazy-validation autocomplete="off">
      <v-row>
        <v-col sm="4" md="4">
          <v-label>우대번호</v-label>
          <v-text-field v-model="form.ticketNo" label="" disabled></v-text-field>
        </v-col>
        <v-col sm="4" md="8">
          <v-label>우대번호 명</v-label>
          <v-text-field v-model="form.ticketName" label="" disabled></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="4" md="12">
          <v-label>정산 그룹 명</v-label>
          <v-text-field v-model="form.calcName" label="" @keypress.enter="add"></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <template v-slot:actions>
      <v-btn outlined rounded color="info" @click="add"><v-icon left>check</v-icon>생성</v-btn>
      <v-btn outlined rounded color="primary" @click="close"><v-icon left>close</v-icon>닫기</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import ticketCalcService from '@/api/modules/social/ticketCalc.service'

export default {
  extends: DialogBase,
  name: 'GroupAddForm',
  data () {
    return {
      data: {},
      form: {
        ticketNo: '',
        ticketName: ''
      }
    }
  },
  mounted () {
    if (this.instance.params.data) {
      this.form.ticketNo = this.instance.params.data.ticketNo
      this.form.ticketName = this.instance.params.data.ticketName
    }
  },
  methods: {
    // 그룹번호 추가 생성
    add () {
      this.$dialog.confirm('정산 그룹번호를 생성 하시겠습니까?').then(() => {
        ticketCalcService.insertCalcGroup(this.form).then(res => {
          this.close({ data: res.data })
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
