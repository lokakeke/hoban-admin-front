<template>
  <v-card flat>
    <v-card-text>
      <v-form ref="passwordForm" lazy-validation>
        <v-row>
          <v-col sm="6" md="4">
            <v-label>현재 비밀번호<v-btn icon readonly color="white" style="cursor: default"></v-btn></v-label>
            <v-text-field id="current" type="password" v-model="passwordForm.loginPw" label="" :rules="emptyRules" :disabled="confirmPassword">
              <template v-slot:append-outer>
                <v-btn outlined color="info" @click="confirmCurrentPassword" :disabled="confirmPassword">비밀번호 확인</v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col sm="6" md="4">
            <v-label>
              새로운 비밀번호
              <v-btn icon title="비밀번호 정책확인" color="info" @click="openPasswordPolicy">
                <v-icon>info</v-icon>
              </v-btn>
            </v-label>
            <v-text-field type="password" v-model="passwordForm.newPw" label="" :rules="confirmPassword ? emptyRules: undefined" :disabled="!confirmPassword"></v-text-field>
          </v-col>
          <v-col sm="6" md="4">
            <v-label>새로운 비밀번호 확인<v-btn icon readonly color="white" style="cursor: default"></v-btn></v-label>
            <v-text-field type="password" v-model="passwordForm.newPwConfirm" :rules="confirmPassword ? emptyRules.concat(newPasswordConfirmRule): undefined"
                          :disabled="!confirmPassword"></v-text-field>
          </v-col>
        </v-row>
        <v-row justify="end">
          <v-btn outlined rounded color="info" @click="passwordChange()"><v-icon>check</v-icon>비밀번호 수정</v-btn>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import adminAuthService from '@/api/modules/system/authentication/admin/adminAuth.service'

export default {
  props: {
    partner: Object
  },
  name: 'PartnerProfilePassword',
  computed: {
    newPasswordConfirmRule () {
      if (this.passwordForm.newPw === this.passwordForm.newPwConfirm) {
        return []
      } else {
        return ['새로운 비밀번호 확인값이 다릅니다.']
      }
    }
  },
  data () {
    return {
      passwordForm: {},
      confirmPassword: false
    }
  },
  methods: {
    passwordChange () {
      this.validForm(this.$refs.passwordForm).then(() => {
        this.$dialog.confirm('비밀번호를 수정하시겠습니까?<br/> 비밀번호 수정 시 다시 로그인 하셔야 합니다.').then(() => {
          this.passwordForm.loginId = this.partner.loginId
          this.passwordForm.partnerSeq = this.partner.partnerSeq
          adminAuthService.updateAccountPassword({ ...this.passwordForm, partnerYn: 'Y' }).then(res => {
            this.$dialog.alert('저장되었습니다.<br/>다시 로그인 해주세요.').then(() => {
              this.$store.dispatch('auth/logout').then(() => {
                this.close()
              })
            })
          })
        }).catch(() => {})
      })
    },
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
    async confirmCurrentPassword () {
      try {
        await this.validForm(this.$refs.passwordForm)
        await adminAuthService.confirmPassword(this.passwordForm.loginPw)
        this.confirmPassword = true
        this.$refs.passwordForm.resetValidation()
      } catch (e) {}
    }
  }
}
</script>
