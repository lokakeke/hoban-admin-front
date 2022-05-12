<template>
    <dialog-base :instance="instance" :title="'임시비밀번호 발급'">
        <v-row dense>
            <v-col cols="12">
                <v-card outlined>
                    <v-card-subtitle v-if="isPartner" class="primary--text">* 아이디 / 파트너명 / 추가 인증번호 / 담당자 아이디 를 입력하시면, 저장
                        된 정보로 임시비밀번호를 발송해 드립니다.
                    </v-card-subtitle>
                    <v-card-subtitle v-else class="primary--text">* 아이디 / 사원번호 / 이름 을 입력하시면, 저장 된 정보로 임시비밀번호를 발송해
                        드립니다.
                    </v-card-subtitle>
                </v-card>
            </v-col>
            <v-col cols="12" @keypress.enter="reset">
                <v-form ref="form" lazy-validation autocomplete="off">
                    <v-text-field v-model="form.loginId" :rules="emptyRules" label="* 아이디" required></v-text-field>
                    <template v-if="isPartner">
                        <v-text-field v-model="form.companyName" :rules="emptyRules" label="* 업체명" required></v-text-field>
                        <v-text-field v-model="form.addAuthNo" :rules="emptyRules"
                                      label="* 추가 인증번호 (파트너 등록 시 생성된 추가 인증번호)" required></v-text-field>
                        <v-text-field v-model="form.partnerManagerId" :rules="emptyRules" label="* 매니저 아이디"
                                      required></v-text-field>
                    </template>
                    <template v-else>
                        <v-text-field v-model="form.adminBusinessNo" :rules="emptyRules" label="* 사원번호" required></v-text-field>
                        <v-text-field v-model="form.adminName" :rules="emptyRules" label="* 이름"
                                      required></v-text-field>
                    </template>
                    <v-radio-group v-model="form.codeType" row hide-details :rules="emptyRules">
                        <v-radio label="S.M.S" value="S"></v-radio>
                        <v-radio label="E-MAIL" value="E"></v-radio>
                    </v-radio-group>
                </v-form>
            </v-col>
        </v-row>
        <template v-slot:actions>
            <v-btn outlined color="primary" @click="reset()">
                <v-icon left>check</v-icon>
                임시비밀번호 발급
            </v-btn>
            <v-btn outlined color="warning" @click="close">
                <v-icon left>close</v-icon>
                닫기
            </v-btn>
        </template>
    </dialog-base>
</template>

<script>
import adminAuth from '@/api/modules/system/authentication/admin/adminAuth.service'
import partnerAuthService from '@/api/modules/system/authentication/partner/partnerAuth.service'
import DialogBase from '@/components/Dialog/DialogBase.vue'
import { mapGetters } from 'vuex'

export default {
  extends: DialogBase,
  name: 'ForgotPassword',
  data () {
    return {
      form: {
        loginId: '',
        adminBusinessNo: '',
        addAuthNo: '',
        partnerManagerId: '',
        adminName: '',
        companyName: '',
        codeType: 'E'
      }
    }
  },
  computed: {
    ...mapGetters({ isPartner: 'sidebar/partnerLogin' })
  },
  methods: {
    reset () {
      this.validForm(this.$refs.form).then(res => {
        adminAuth.createTemporaryPasswordForLogin({ ...this.form, partnerYn: this.isPartner ? 'Y' : 'N' }).then(res => {
          console.log('임시 비밀번호 확인용 partner : ', res.data)
          this.$dialog.alert('임시 비밀번호가 발급되었습니다.')
          this.close()
        })
      })
    }
  }
}
</script>
