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
                        <v-text-field v-model="form.ptnrNm" :rules="emptyRules" label="* 파트너명" required></v-text-field>
                        <v-text-field v-model="form.addCrtfNo" :rules="emptyRules"
                                      label="* 추가 인증번호 (파트너 등록 시 생성된 추가 인증번호)" required></v-text-field>
                        <v-text-field v-model="form.ptnrChrgId" :rules="emptyRules" label="* 닉네임"
                                      required></v-text-field>
                    </template>
                    <template v-else>
                        <v-text-field v-model="form.emplNo" :rules="emptyRules" label="* 사원번호" required></v-text-field>
                        <v-text-field v-model="form.adminName" :rules="emptyRules" label="* 이름"
                                      required></v-text-field>
                    </template>
                    <v-radio-group v-model="form.type" row hide-details :rules="emptyRules">
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
import adminAuth from 'Api/modules/system/adminAuth.service'
import partnerAuthService from 'Api/modules/partner/partnerAuth.service'
import DialogBase from 'Components/Dialog/DialogBase.vue'
import { mapGetters } from 'vuex'

export default {
  extends: DialogBase,
  name: 'ForgotPassword',
  data () {
    return {
      form: {
        loginId: '',
        emplNo: '',
        addCrtfNo: '',
        ptnrChrgId: '',
        adminName: '',
        ptnrNm: '',
        type: 'E'
      }
    }
  },
  computed: {
    ...mapGetters({ isPartner: 'sidebar/partnerLogin' })
  },
  methods: {
    reset () {
      this.validForm(this.$refs.form).then(res => {
        if (this.isPartner) {
          partnerAuthService.createTemporaryPasswordForLogin(this.form).then(res => {
            console.log('임시 비밀번호 확인용 : ', res.data)
            this.$dialog.alert('임시 비밀번호가 발급되었습니다.')
            this.close()
          })
        } else {
          adminAuth.createTemporaryPasswordForLogin(this.form).then(res => {
            console.log('임시 비밀번호 확인용 : ', res.data)
            this.$dialog.alert('임시 비밀번호가 발급되었습니다.')
            this.close()
          })
        }
      })
    }
  }
}
</script>
