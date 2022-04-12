<template>
  <dialog-base :instance="instance">
    <template v-slot:title>
      관리자 - {{user.name}} 프로필
    </template>
    <template v-slot:buttons>
      <v-btn dark text @click="submit()">
        <v-icon left>check</v-icon>
        수정
      </v-btn>
    </template>
    <v-form ref="form" lazy-validation>
      <v-row>
        <v-col sm="6" md="3">
          <v-label>관리자 사원번호</v-label>
          <v-text-field v-model="form.adminSeq" label="" disabled></v-text-field>
        </v-col>
        <v-col sm="6" md="3">
          <v-label>관리자 이름</v-label>
          <v-text-field v-model="form.adminName" label="" :rules="emptyRules" required></v-text-field>
        </v-col>
        <v-col sm="6" md="3">
          <v-label>로그인 아이디</v-label>
          <v-text-field v-model="form.loginId" label="" disabled></v-text-field>
        </v-col>
        <v-col sm="6" md="3">
          <v-label>휴대폰 번호</v-label>
          <v-text-field v-model="form.telNo" v-mask="['###-####-####', '###-###-####']" label="" :rules="mobileRegex.concat(emptyRules)"></v-text-field>
        </v-col>
        <v-col sm="6" md="3">
          <v-label>이메일 주소</v-label>
          <v-text-field v-model="form.email" label="" :rules="emailRegex.concat(emptyRules)"></v-text-field>
        </v-col>
        <v-col sm="6" md="3">
          <v-label>메뉴 그룹 권한</v-label>
          <v-text-field :value="form.menuAuthGrupName" label="" disabled></v-text-field>
        </v-col>
        <v-col sm="6" md="3">
          <v-label>부서</v-label>
          <v-text-field :value="form.deptCodeName" label="" disabled></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="end">
        <v-btn outlined rounded color="info" @click="submit()"><v-icon>check</v-icon>수정</v-btn>
        <v-btn outlined rounded color="primary" @click="close()"><v-icon>close</v-icon>닫기</v-btn>
      </v-row>
    </v-form>
    <v-divider class="my-5"></v-divider>
    <div class="title font-weight-bold mb-5">비밀번호 변경</div>
    <v-form ref="passwordForm" lazy-validation>
      <v-row>
        <v-col sm="6" md="4">
          <v-label>현재 비밀번호<v-btn icon readonly color="white" style="cursor: default"></v-btn></v-label>
          <v-text-field type="password" v-model="passwordForm.loginPw" label="" :rules="emptyRules" :disabled="confirmPassword">
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
  </dialog-base>
</template>

<script>
import adminAuthService from '@/api/modules/system/authentication/admin/adminAuth.service'
import { mapGetters } from 'vuex'
import DialogBase from '@/components/Dialog/DialogBase.vue'

export default {
  extends: DialogBase,
  name: 'UserProfile',
  computed: {
    ...mapGetters({ user: 'auth/user' }),
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
      form: {},
      passwordForm: {},
      confirmPassword: false
    }
  },
  mounted () {
    this.getUserProfile()
  },
  methods: {
    getUserProfile () {
      this.form = {}
      adminAuthService.selectProfile().then(res => {
        this.passwordForm = {
          loginPw: '',
          newPw: '',
          newPwConfirm: '',
          loginId: ''
        }
        if (this.$refs.passwordForm) {
          this.$refs.passwordForm.resetValidation()
        }
        this.form = res.data
      }).catch(() => {
        this.close()
      })
    },
    async confirmCurrentPassword () {
      try {
        await this.validForm(this.$refs.passwordForm)
        await adminAuthService.confirmPassword(this.passwordForm.loginPw)
        this.confirmPassword = true
        this.$refs.passwordForm.resetValidation()
      } catch (e) {}
    },
    submit () {
      this.validForm(this.$refs.form).then(() => {
        this.$dialog.confirm('사용자 정보를 수정하시겠습니까?').then(() => {
          adminAuthService.updateAccountProfile(this.form).then(res => {
            this.$dialog.alert('저장되었습니다.')
            // 사용자 정보 저장
            this.$store.dispatch('auth/user', {
              loginId: this.form.loginId,
              name: this.form.adminName,
              number: this.form.adminSeq
            })
          })
        }).catch(() => {})
      })
    },
    passwordChange () {
      this.validForm(this.$refs.passwordForm).then(() => {
        this.$dialog.confirm('비밀번호를 수정하시겠습니까?<br/> 비밀번호 수정 시 다시 로그인 하셔야 합니다.').then(() => {
          this.passwordForm.loginId = this.form.loginId
          this.passwordForm.adminSeq = this.form.adminSeq
          adminAuthService.updateAccountPassword(this.passwordForm).then(res => {
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
    }
  }
}
</script>
