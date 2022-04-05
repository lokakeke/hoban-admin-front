<template>
  <dialog-base :instance="instance" :title="'로그인 추가 인증'">
    <v-row dense>
      <v-col cols="12">
        <v-card outlined pa-1>
          <v-card-subtitle class="text-center">
            <p class="mb-0">정보통신망 이용촉진 및 정보보호 등에 관한 법률 제 28조에 제 1항 제 2호 </p>
            <p class="mb-0">개인정보의 보호조치에 따라 `로그인 추가인증` 이 필요하게 되었습니다.</p>
            <p class="mb-0">따라서 추가인증 수단을 사전에 등록하신 후</p>
            <p class="mb-0">로그인시 해당 수단을 선택하여 인증하여 주시기 바랍니다.</p>
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12" class="text-center">
        아래 인증 수단 중 택일하여 추가인증을 진행하여 주시기 바랍니다.
      </v-col>
      <v-col cols="12">
      <v-simple-table class="bordered">
        <tbody>
          <tr>
            <th class="text-center pointer" @click="changeType('S')">
              <v-row justify="center" align="center">
                <v-icon left :color="type === 'S' ? 'info' : ''">{{type === 'S'? 'check_box': 'check_box_outline_blank'}}</v-icon>
                <span :class="type === 'S' ? 'info--text' : ''">휴대폰 인증</span>
              </v-row>
            </th>
            <th>
              <mask-tel-number :text="data.telNo" />
            </th>
          </tr>
          <tr>
            <th class="text-center pointer" @click="changeType('E')">
              <v-row justify="center" align="center">
                <v-icon left :color="type === 'E' ? 'info' : ''">{{type === 'E'? 'check_box': 'check_box_outline_blank'}}</v-icon>
                <span :class="type === 'E' ? 'info--text' : ''">이메일 인증</span>
              </v-row>
            </th>
            <th class="text-center font-weight-medium">
              {{data.email}}
            </th>
          </tr>
        </tbody>
      </v-simple-table>
      </v-col>
      <v-col cols="12">
        <v-label>* 선택 된 정보로 3분간 유효한 인증번호(4자리)가 발송됩니다.</v-label>
      </v-col>
      <v-col v-if="!request" cols="12" class="text-center">
        <v-btn color="info" @click="send"><v-icon left>near_me</v-icon>인증번호 발송</v-btn>
      </v-col>
    </v-row>
    <template v-slot:actions v-if="request">
      <v-form lazy-validation ref="form" autocomplete="off" @submit.prevent="{login, reSend}">
        <v-simple-table dense class="bordered">
          <tbody>
          <tr>
            <th class="font-weight-bold text-center">
              인증번호 <small>(4자리)</small><br/>
              <div v-html="resTimeData"></div>
            </th>
            <th>
              <v-text-field id="requestCode" v-model="requestCode" :rules="emptyRules.concat(codeRule)" @keypress.enter="login">
                <template v-slot:append-outer>
                  <v-btn color="primary" @click="login"><v-icon left>person</v-icon>로그인</v-btn>
                  <v-btn color="accent" @click="reSend"><v-icon left>refresh</v-icon>재발송</v-btn>
                </template>
              </v-text-field>
            </th>
          </tr>
          </tbody>
        </v-simple-table>
      </v-form>
    </template>
  </dialog-base>
</template>

<script>
import adminAuthService from '@/api/modules/system/adminAuth.service'
import maskTelNumber from '@/components/Mask/MaskTelNumber.vue'
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  components: { maskTelNumber },
  name: 'AdditionalCertification',
  data () {
    return {
      type: '',
      data: {},
      request: false,
      requestCode: '',
      timeCounter: 180,
      resTimeData: '',
      polling: Function,
      codeRule: [
        v => (!v || /^[0-9]{4}$/.test(v)) || '인증번호는 4자리 숫자 입니다.'
      ]
    }
  },
  mounted () {
    // 초기화 진행
    this.data = this.instance.params.data
    this.request = false
    this.requestCode = ''
    this.resTimeData = '03:00'
    this.changeType('E')
  },
  methods: {
    changeType (type) {
      if (type !== this.type) {
        this.type = type
      }
    },
    async send () {
      try {
        if ((this.type === 'S' && !this.data.telNo) || (this.type === 'E' && !this.data.email)) {
          this.$dialog.alert('발송 정보가 존재하지 않습니다.')
        } else {
          const res = await adminAuthService.requestCode({
            loginId: this.data.loginId,
            loginPw: this.data.loginPw,
            partnerYn: 'N',
            requestType: this.type
          })
          clearInterval(this.polling)
          this.timeCounter = 180
          this.request = true
          // 시간체크 시작
          this.startInterval()
          this.requestCode = res.data.requestCode
          await this.$nextTick()
          document.getElementById('requestCode').focus()
        }
      } catch (e) {}
    },
    startInterval () {
      this.polling = setInterval(() => {
        // 1찍 감소
        this.timeCounter--
        if (this.timeCounter <= 0) {
          clearInterval(this.polling)
          this.resTimeData = '<span class="red--text">00:00</span>'
        } else {
          // mm:ss 형태로 변경
          const mm = '0' + Math.floor(this.timeCounter / 60)
          const ss = this.timeCounter % 60
          this.resTimeData = mm + ':' + (ss > 9 ? ss : '0' + ss)
        }
      }, 1000)
    },
    reSend () {
      this.$dialog.confirm('인증코드를 다시 요청 하시겠습니까?').then(() => {
        this.send()
      })
    },
    async login () {
      try {
        await this.validForm(this.$refs.form)
        if (this.timeCounter <= 0) {
          this.$dialog.alert({ title: '유효시간 만료', body: '인증번호 재전송 후 진행하여 주세요.' })
        } else {
          await this.$store.dispatch('auth/login', {
            loginId: this.data.loginId,
            loginPw: this.data.loginPw,
            partnerYn: 'N',
            requestCode: this.requestCode
          })
          // redirect path
          await this.$router.push(this.$store.getters['sidebar/redirectPath'])
          if (this.$store.getters['auth/user'].tempYn === 'Y') {
            this.$dialog.alert('임시 비밀번호를 사용중입니다.<br/>비밀번호를 변경해 주세요.')
          } else if (this.$store.getters['auth/user'].expireYn === 'Y') {
            this.$dialog.alert('비밀번호 변경주기를 초과하셨습니다.<br/>비밀번호를 변경해 주세요.')
          }
          this.close()
        }
      } catch (e) {}
    }
  },
  beforeDestroy () {
    clearInterval(this.polling)
  }
}
</script>
