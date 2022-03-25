<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      <v-icon left>refresh</v-icon>우대번호 상태 일괄 변경
    </template>
    <v-form ref="form" lazy-validation autocomplete="off">
      <v-row>
        <v-col md="3">
          <v-label>우대번호 순번 시작</v-label>
          <v-text-field v-model="form.ticketSeqStart" label="" placeholder="000001" :rules="emptyRules.concat(numberRules)" maxlength="6" required></v-text-field>
        </v-col>
        <v-col md="1" class="text-center align-self-center">
          <span>~</span>
        </v-col>
        <v-col md="3">
          <v-label>우대번호 순번 종료</v-label>
          <v-text-field v-model="form.ticketSeqEnd" label="" placeholder="100000" :rules="emptyRules.concat(numberRules)" maxlength="6" required></v-text-field>
        </v-col>
        <v-col align-self="center" sm="2" md="1">
          <v-btn outlined color="info" @click="checkTicketSeq" tabindex="-1"><v-icon left>search</v-icon>변경 가능 확인</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="12" md="10" class="pt-0 pb-3">
          <span class="font-weight-bold red--text" v-if="msg && changeYn === 'N'">※ {{msg}}</span>
          <span class="font-weight-bold blue--text" v-else-if="msg && changeYn === 'Y'">※ {{msg}}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="12" md="10">
          <v-label>비고</v-label>
          <v-text-field v-model="form.etc" label="" :rules="emptyRules" required></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <template v-slot:actions>
      <v-btn outlined rounded color="info" @click="changeTicketSeq" :disabled="checkDisabled"><v-icon left>refresh</v-icon>일괄변경</v-btn>
      <v-btn outlined rounded color="primary" @click="close"><v-icon left>close</v-icon>닫기</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from "@/components/Dialog/DialogBase"
import ticketingUpdate from "Api/modules/social/ticketingUpdate.service"

export default {
  extends: DialogBase,
  name: 'TicketStatusChangeDialog',
  data () {
    return {
      form: {},
      msg: '',
      changeYn: 'N'
    }
  },
  watch: {
    'form.ticketSeqStart' () {
      this.changeYn = 'N'
      this.msg = ''
    },
    'form.ticketSeqEnd' () {
      this.changeYn = 'N'
      this.msg = ''
    }
  },
  computed: {
    checkDisabled () {
      return this.changeYn !== 'Y'
    }
  },
  mounted () {
    this.form.ticketNo = this.instance.params.ticketNo
  },
  methods: {
    // 입력받은 우대번호 순번 유효성 체크
    checkTicketSeq () {
      // ticketSeqEnd
      for (let i = this.form.ticketSeqStart.length; this.form.ticketSeqStart.length < 6; i++) {
        this.form.ticketSeqStart = '0' + this.form.ticketSeqStart
      }
      for (let i = this.form.ticketSeqEnd.length; this.form.ticketSeqEnd.length < 6; i++) {
        this.form.ticketSeqEnd = '0' + this.form.ticketSeqEnd
      }

      ticketingUpdate.checkTicketSeqStatus(this.form).then(res => {
        if (res.data) {
          const useInd = []
          res.data.forEach(item => {
            // 상태값이 2가지 이상 나왔을 경우
            if (res.data.length > 1) {
              useInd.push(this.setUseInd(item.useInd) + ' : ' + item.cnt + '개 ')
              this.msg = '순번내에 상태값이 달라 일괄 변경을 할 수 없습니다. [ ' + useInd + ' ]'
            } else if (item.useQty > 0) {
              // 사용한 우대번호가 있을경우
              this.msg = '순번내에 사용한 우대번호가 있습니다.'
            } else if (item.useInd === 'R') {
              // 환불 상태는 변경 불가능
              this.msg = '환불상태는 변경 할 수 없습니다.'
            } else {
              if (item.useInd === 'Z') {
                // Z -> Y로 변경 가능
                this.form.state = 'Y'
              } else if (item.useInd === 'Y') {
                // Y -> R로 변경 가능
                this.form.state = 'R'
              }
              this.changeYn = 'Y'
              this.msg = '상태 변경 가능 : [ ' + this.setUseInd(item.useInd) + ' -> ' + this.setUseInd(this.form.state) + ' ]'
              if (item.useInd === 'N') {
                this.msg = '상태 변경 불가능 [N]'
                this.changeYn = 'N'
              }
            }
          })
        }
      })
    },
    setUseInd (useInd) {
      let state
      if (useInd === 'Z') {
        state = '발권가능(Z)'
      } else if (useInd === 'Y') {
        state = '사용가능(Y)'
      } else if (useInd === 'R') {
        state = '환불(R)'
      } else if (useInd === 'N') {
        state = 'N'
      }
      return state
    },
    // 우대번호 상태 일괄 변경
    changeTicketSeq () {
      this.validForm(this.$refs.form).then(() => {
        this.$dialog.confirm('우대번호 상태를 ' + this.setUseInd(this.form.state) + '로 일괄변경 하시겠습니까?').then(() => {
          ticketingUpdate.updateTicketSeqStatus(this.form).then(() => {
            this.$dialog.alert('변경 되었습니다.').then(() => {
              this.close({ data: '1' })
            })
          })
        }).catch(() => {})
      })
    }
  }
}
</script>
