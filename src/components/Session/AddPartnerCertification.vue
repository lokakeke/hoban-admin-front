<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      인증 정보 추가
    </template>
    <v-row dense>
      <v-col cols="12">
        <v-card outlined pa-1>
          <v-card-subtitle class="text-center">
            <p class="mb-0">등록된 담당자 정보 이외에 추가로 담당자 정보를 등록 하실 수 있습니다. </p>
            <p class="mb-0 font-weight-black">파트너 아이디 생성 시 발급된 추가 인증번호가 필요 합니다.</p>
            <p class="mb-0 font-weight-black">최초 등록담당자일 경우 메인관리 권한이 자동으로 부여됩니다.</p>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
    <v-form ref="form" lazy-validation autocomplete="off">
      <v-row>
        <v-col cols="4">
          <v-label>* 닉네임</v-label>
          <v-text-field v-model="form.chrgName" label="" :rules="emptyRules"></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-label>* 파트너 추가 인증번호</v-label>
          <v-text-field v-model="data.addCrtfNo" label="" :rules="emptyRules"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="7">
          <v-label>휴대폰 번호</v-label>
          <v-text-field v-model="form.telNo" v-mask="['###-####-####', '###-###-####']" label="" :rules="mobileRegex">
            <template v-slot:append-outer>
              <v-btn v-if="!requestTel" outlined color="info" @click="requestTelCode()">인증번호 발송</v-btn>
              <v-btn v-else outlined color="accent" v-confirm="{ok: requestTelCode, message: '인증번호를 재발송 하시겠습니까?'}">
                <v-icon left>refresh</v-icon>재발송
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="5" v-if="requestTel">
          <v-label>인증번호</v-label>
          <v-text-field v-model="data.requestTelNo" :rules="emptyRules.concat(codeRule)">
            <template v-slot:append>
              <span v-html="telResTimeData"></span>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="7">
          <v-label>이메일 주소</v-label>
          <v-text-field v-model="form.email" label="" :rules="emailRegex">
            <template v-slot:append-outer>
              <v-btn v-if="!requestEmail" outlined color="info" @click="requestEmailCode()">인증번호 발송</v-btn>
              <v-btn v-else outlined color="accent" v-confirm="{ok: requestEmailCode, message: '인증번호를 재발송 하시겠습니까?'}">
                <v-icon left>refresh</v-icon>재발송
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="5" v-if="requestEmail">
          <v-label>인증번호</v-label>
          <v-text-field v-model="data.requestEmail" :rules="emptyRules.concat(codeRule)">
            <template v-slot:append>
              <span v-html="emailResTimeData"></span>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <v-label>* 인증 번호는 3분간 유효합니다.</v-label>
        </v-col>
      </v-row>
    </v-form>
    <template v-slot:actions>
      <v-btn outlined rounded color="info" @click="add"><v-icon left>add</v-icon>추가</v-btn>
      <v-btn outlined rounded color="primary" @click="close"><v-icon left>close</v-icon>닫기</v-btn>
    </template>
  </dialog-base>
</template>

<script>
import DialogBase from '@/components/Dialog/DialogBase.vue'
import partnerChargeService from '@/api/modules/partner/partnerCharge.service'

export default {
  extends: DialogBase,
  name: 'AddPartnerCertification',
  data () {
    return {
      form: {
        chrgName: '',
        telNo: '',
        email: '',
        useYn: 'Y'
      },
      data: {
        addCrtfNo: '',
        requestTelNo: '',
        requestEmail: ''
      },
      codeRule: [
        v => (!v || /^[0-9]{4}$/.test(v)) || '인증번호는 4자리 숫자 입니다.'
      ],
      // 전화 번호 인증 관련
      requestTel: false,
      telPolling: Function,
      telTimeCounter: 180,
      telResTimeData: '',
      // 이메일 인증 관련
      requestEmail: false,
      emailPolling: Function,
      emailTimeCounter: 180,
      emailResTimeData: ''
    }
  },
  mounted () {
    this.data = Object.assign({}, this.data, this.instance.params.data)
  },
  methods: {
    add () {
      this.validForm(this.$refs.form).then(() => {
        // 둘중에 하나는 필수
        if (!this.form.telNo && !this.form.email) {
          this.$dialog.alert('휴대전화, 이메일 중 하나는 필수로 입력하여 주세요.')
          return
        }
        const form = _.cloneDeep(this.data)
        form.partnerCharge = this.form
        partnerChargeService.addPartnerCharge(form).then(res => {
          this.$dialog.alert('추가 담당자 정보가 등록되었습니다.')
          this.close({ change: true })
        })
      })
    },
    requestTelCode () {
      // this.$dialog.alert('S.M.S 서비스는 준비중 입니다.')
      if (!this.form.telNo || !/(01[016789])[-](\d{4}|\d{3})[-]\d{4}$/.test(this.form.telNo)) {
        this.$dialog.alert('올바른 전화번호 정보를 입력해 주세요.')
        return
      }
      this.requestTel = false
      this.telTimeCounter = 180
      this.telResTimeData = ''
      clearInterval(this.telPolling)
      partnerChargeService.requestCode({
        loginId: this.data.loginId,
        loginPw: this.data.loginPw,
        requestTelNo: this.form.telNo,
        type: 'S'
      }).then(res => {
        console.log(res.data)
        this.requestTel = true
        // 셋팅 해준다.
        this.data.requestTelNo = res.data.requestCode
        this.telResTimeData = '03:00'
        this.telPolling = setInterval(() => {
          // 1찍 감소
          this.telTimeCounter--
          if (this.telTimeCounter <= 0) {
            clearInterval(this.telPolling)
            this.telResTimeData = '<span class="red--text">00:00</span>'
          } else {
            // mm:ss 형태로 변경
            const mm = '0' + Math.floor(this.telTimeCounter / 60)
            const ss = this.telTimeCounter % 60
            this.telResTimeData = mm + ':' + (ss > 9 ? ss : '0' + ss)
          }
        }, 1000)
      })
    },
    requestEmailCode () {
      if (!this.form.email || !/^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+\.[a-zA-Z]{2,3}$/.test(this.form.email)) {
        this.$dialog.alert('올바른 이메일 정보를 입력해 주세요.')
        return
      }
      this.requestEmail = false
      this.emailTimeCounter = 180
      this.emailResTimeData = ''
      clearInterval(this.emailPolling)
      partnerChargeService.requestCode({
        loginId: this.data.loginId,
        loginPw: this.data.loginPw,
        requestEmail: this.form.email,
        type: 'E'
      }).then(res => {
        this.requestEmail = true
        // 셋팅 해준다.
        this.data.requestEmail = res.data.requestCode
        this.emailResTimeData = '03:00'
        this.emailPolling = setInterval(() => {
          // 1찍 감소
          this.emailTimeCounter--
          if (this.emailTimeCounter <= 0) {
            clearInterval(this.emailPolling)
            this.emailResTimeData = '<span class="red--text">00:00</span>'
          } else {
            // mm:ss 형태로 변경
            const mm = '0' + Math.floor(this.emailTimeCounter / 60)
            const ss = this.emailTimeCounter % 60
            this.emailResTimeData = mm + ':' + (ss > 9 ? ss : '0' + ss)
          }
        }, 1000)
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.telPolling)
    clearInterval(this.emailPolling)
  }
}
</script>
