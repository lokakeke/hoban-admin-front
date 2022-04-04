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
      <template v-if="!request">
        <v-col cols="12" class="text-center">
          아래 인증 수단 중 택일하여 추가인증을 진행하여 주시기 바랍니다.
        </v-col>
        <v-col cols="12" class="text-center">
          <v-btn color="primary" :outlined="type !== 'S'" @click="changeType('S')">
            <v-icon v-if="type === 'S'" left>check</v-icon>휴대폰 인증
          </v-btn>
          <v-btn color="primary" :outlined="type !== 'E'" @click="changeType('E')">
            <v-icon v-if="type === 'E'" left>check</v-icon>이메일 인증
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-label>* 선택 된 정보로 3분간 유효한 인증번호(4자리)가 발송됩니다.</v-label>
          <v-data-table :headers="headers" :items="list" no-data-text="인증 담당자가 없습니다."
                        v-model="selected" single-select show-select item-key="value"
                        fixed-header height="150"
                        class="bordered" dense hide-default-footer disable-pagination disable-sort>
            <template v-slot:item.value="{item}">
              <mask-tel-number v-if="type === 'S'" :text="item.value" />
              <span v-else>{{item.value}}</span>
            </template>
          </v-data-table>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-btn color="info" @click="send"><v-icon left>near_me</v-icon>인증번호 발송</v-btn>
          <v-btn color="info" outlined @click="add"><v-icon left>add</v-icon>추가 인증 등록</v-btn>
        </v-col>
      </template>
      <template v-else>
        <v-col cols="12">
          <v-card outlined pa-1>
            <v-card-subtitle class="text-center">
              <p class="mb-0">발송 타입 : <span class="font-weight-bold">{{type === 'S' ? 'S.M.S' : 'E-MAIL'}}</span></p>
              <p class="mb-0">발송 주소 : <span class="font-weight-bold">{{selected[0].value}}</span></p>
              <p class="mb-0">담당자 닉네임: <span class="font-weight-bold">{{selected[0].name}}</span></p>
            </v-card-subtitle>
          </v-card>
        </v-col>
      </template>
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
                  <v-btn color="info" @click="refresh"><v-icon left>refresh</v-icon>재선택</v-btn>
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
import adminAuthService from 'Api/modules/system/adminAuth.service'
import maskTelNumber from 'Components/Mask/MaskTelNumber.vue'
import DialogBase from 'Components/Dialog/DialogBase.vue'
import Vue from 'vue'

export default {
  extends: DialogBase,
  components: { maskTelNumber },
  name: 'AdditionalCertificationPartner',
  data () {
    return {
      type: '',
      list: [],
      selected: [],
      data: {},
      headers: [
        { value: 'data-table-select', width: false, align: 'center' },
        { text: '닉네임', value: 'name', width: '30%', align: 'center' },
        { text: '번호', value: 'value', width: '35%', align: 'center' }
      ],
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
    this.selected = []
    this.resTimeData = '03:00'
    this.changeType('E')
  },
  methods: {
    changeType (type) {
      if (type !== this.type) {
        this.type = type
        this.list = this.type === 'S' ? this.data.smsList : this.data.emailList
        this.selected = []
      }
    },
    send () {
      if (this.selected.length === 0) {
        this.$dialog.alert('발송 정보를 선택해 주세요.')
      } else {
        adminAuthService.requestCode({
          loginId: this.data.loginId,
          loginPw: this.data.loginPw,
          partnerYn: 'Y',
          requestType: this.type,
          requestId: this.selected[0].id
        }).then(res => {
          clearInterval(this.polling)
          this.timeCounter = 180
          this.request = true
          // 시간체크 시작
          this.startInterval()
          console.log('인증번호 :' + res.data.requestCode)
          this.requestCode = res.data.requestCode
          this.$nextTick(() => {
            document.getElementById('requestCode').focus()
          })
        })
      }
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
    add () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Session/AddPartnerCertification',
        params: {
          data: { loginId: this.data.loginId, loginPw: this.data.loginPw }
        },
        options: {
          fullscreen: false,
          scrollable: true,
          width: 800,
          closeCallback: (param) => {
            if (param && param.change) {
              // 변동 사항이 있으면 데이터를 다시 불러온다.
              this.$store.dispatch('auth/preLogin', {
                loginId: this.data.loginId,
                loginPw: this.data.loginPw,
                partnerYn: 'Y'
              }).then(res => {
                this.data = res.data
                this.list = this.type === 'S' ? this.data.smsList : this.data.emailList
              })
            }
          }
        }
      })
    },
    reSend () {
      this.$dialog.confirm('인증코드를 다시 요청 하시겠습니까?').then(() => {
        this.requestCode = ''
        this.resTimeData = '03:00'
        this.send()
      })
    },
    refresh () {
      this.$dialog.confirm('인증 요청정보를 다시 선택 하시겠습니까?').then(() => {
        this.request = false
        this.requestCode = ''
        this.selected = []
        this.resTimeData = '03:00'
      })
    },
    login () {
      this.validForm(this.$refs.form).then(() => {
        if (this.timeCounter <= 0) {
          this.$dialog.alert({ title: '유효시간 만료', body: '인증번호 재전송 후 진행하여 주세요.' })
        } else {
          this.$store.dispatch('auth/login', {
            loginId: this.data.loginId,
            loginPw: this.data.loginPw,
            partnerYn: 'Y',
            requestCode: this.requestCode,
            requestId: this.selected[0].id
          }).then(() => {
            // redirect path
            this.$router.push(this.$store.getters['sidebar/redirectPath']).then(() => {
              if (this.$store.getters['auth/user'].tempYn === 'Y') {
                Vue.dialog.alert('임시 비밀번호를 사용중입니다.<br/>비밀번호를 변경해 주세요.')
              } else if (this.$store.getters['auth/user'].expireYn === 'Y') {
                Vue.dialog.alert('비밀번호 변경주기를 초과하셨습니다.<br/>비밀번호를 변경해 주세요.')
              }
              this.close()
            })
          })
        }
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.polling)
  }
}
</script>
