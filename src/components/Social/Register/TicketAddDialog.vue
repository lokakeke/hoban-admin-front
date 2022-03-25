<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <v-icon left>add</v-icon>우대번호 {{isNew ? '추가' : '상세/수정'}}
    </template>
    <v-form ref="form" lazy-validation autocomplete="off">
      <v-row>
        <v-col md="auto">
          <v-label>우대번호</v-label>
          <v-text-field v-model="form.ticketNo" label="" @keypress.enter="openDialog" :rules="emptyRules.concat(numberRules)" maxlength="8" required :disabled="disabled"></v-text-field>
        </v-col>
        <v-col align-self="center" sm="2" md="1" class="pl-0 mr-1">
          <v-btn outlined color="info" @click="openDialog" tabindex="-1"><v-icon left>search</v-icon> 조회</v-btn><!--우대번호 조회-->
        </v-col>
        <v-col sm="12" md="6" class="pl-10">
          <v-label>우대번호 명</v-label>
          <v-text-field v-model="form.ticketNm" label="" disabled></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="12" md="10">
          <v-label>발행 수 <span class="font-weight-bold" v-if="form.issuQty"> [ 현재 발행 매수 : {{form.issuQty | price}}
            <span v-if="form.autoIssuYn === 'Y' && form.autoIssuLmt > 0"> / 총 제한 수량 : {{form.autoIssuLmt | price}}</span> ] </span></v-label>
          <v-select v-model="form.issuCnt" :items="amtList"></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="12" md="10">
          <v-label>발행 사유</v-label>
          <v-text-field v-model="form.issuResn" label="" @keypress.enter="addTicket" :rules="emptyRules" required></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <template v-slot:actions>
      <v-btn outlined rounded color="info" @click="addTicket"><v-icon left>{{isNew ? 'check' : 'create'}}</v-icon>{{isNew? '추가': '수정'}}</v-btn>
      <v-btn outlined rounded color="primary" @click="close"><v-icon left>close</v-icon>닫기</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'TicketAddDialog',
  data () {
    return {
      isNew: Boolean,
      form: Object,
      amtList: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
      disabled: false
    }
  },
  mounted () {
    this.isNew = this.instance.params.isNew
    this.form = this.instance.params.form
  },
  methods: {
    // 추가 버튼
    addTicket () {
      if (this.form.ticketNm === undefined) {
        this.$dialog.alert('우대번호를 조회해 주세요.')
        return
      }
      this.validForm(this.$refs.form).then(() => {
        this.$dialog.confirm(this.isNew ? '우대번호를 목록에 추가하시겠습니까?' : '우대번호를 수정하시겠습니까?').then(() => {
          this.close({ data: this.form })
        })
      })
    },
    openDialog () {
      // dialog open
      this.$store.dispatch('dialog/open', {
        componentPath: '/Social/Register/TicketSearchForm',
        params: {
          ticketNo: this.form.ticketNo,
          ticketMngmYn: 'Y' // API_SOCIAL_TICKET_MNGM 에 있는 우대번호 조회
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 1000,
          closeCallback: (params) => {
            if (params && params.data) {
              const rowArr = ['ticketNo', 'ticketNm', 'issuQty', 'autoIssuYn', 'autoIssuLmt']
              for (const arr of rowArr) {
                this.$set(this.form, arr, params.data[arr])
              }
              // 우대번호 조회 후 input disabled
              this.disabled = true
            }
          }
        }
      })
    }
  }
}
</script>
