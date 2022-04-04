<template>
  <div class="session-wrapper">
    <div class="session-table-cell">
      <div class="session-content text-center" @keypress.enter="submit">
        <img :src="appLogo" class="img-responsive mb-0" alt="logo" />
        <h2 class="mt-8 mb-4">관리자 홈페이지에 오신걸 환영합니다.</h2>
        <p class="fs-14">{{$t('message.enterUsernameAndPasswordToAccessControlPanelOf')}}</p>
        <v-form class="mb-5" ref="form" lazy-validation autocomplete="off">
          <v-text-field label="아이디" v-model="loginId" :rules="emptyRules"></v-text-field>
          <password-input v-model="loginPw" required></password-input>
          <!--<v-text-field label="비밀번호" v-model="loginPw" type="password" :rules="emptyRules"></v-text-field>-->
          <v-btn block large @click="submit" class="my-2" color="primary">{{$t('message.loginNow')}}</v-btn>
          <v-btn block text large @click="openTempPassword" color="primary">
            <v-icon left>priority_high</v-icon>
            <span class="subtitle-2 font-weight-bold">{{$t('message.forgotPassword')}}?</span>
            <span class="body-2 ml-1">(임시비밀번호 발급)</span>
          </v-btn>
          <v-btn block text large @click="openPasswordPolicy" color="primary">
            <v-icon left>search</v-icon>
            <span class="subtitle-2 font-weight-bold">비밀번호 정책</span>
          </v-btn>

          <v-btn block large @click="goPartner()" class="my-2" color="success">파트너센터 로그인 이동</v-btn>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
import AppConfig from 'Constants/AppConfig'
import PasswordInput from 'Components/Common/PasswordInput.vue'

export default {
  components: { PasswordInput },
  data () {
    return {
      loginId: '',
      loginPw: '',
      appLogo: AppConfig.hobanHnrLogo
    }
  },
  mounted () {
    // 파트너 로그인인지 여부 판단
    this.$store.dispatch('sidebar/setPartnerLogin', false)
  },
  methods: {
    // 1차 로그인
    async submit () {
      try {
        // valid check
        await this.validForm(this.$refs.form)
        // pre login
        const res = await this.$store.dispatch('auth/preLogin', {
          loginId: this.loginId,
          loginPw: this.loginPw,
          partnerYn: 'N'
        })
        // focus out
        document.activeElement.blur()
        // 2차 인증 dialog open
        await this.$store.dispatch('dialog/open', {
          componentPath: '/Session/AdditionalCertification',
          params: {
            data: res.data
          },
          options: {
            fullscreen: false,
            scrollable: true,
            width: 600
          }
        })
      } catch (e) {}
    },
    // 임시 비밀번호 발송 dialog open
    openTempPassword () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Session/ForgotPassword',
        params: {},
        options: {
          fullscreen: false,
          scrollable: true,
          width: 500
        }
      })
    },
    // 비밀번호 정책 dialog open
    openPasswordPolicy () {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Session/PasswordPolicy',
        params: {},
        options: {
          fullscreen: false,
          scrollable: true,
          width: 700
        }
      })
    },
    goPartner () {
      this.$router.push('/partnerLogin')
    }
  }
}
</script>
