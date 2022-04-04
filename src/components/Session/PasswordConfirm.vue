<template>
    <dialog-base :instance="instance" :title="'비밀번호 확인'">
        <v-form ref="form" lazy-validation autocomplete="off" @submit.prevent="{confirm, close}">
            <v-row @keypress.enter="confirm">
                <v-col cols="12">
                    <v-label>* 비밀번호 입력</v-label>
                    <v-text-field type="password" v-model="password" :rules="emptyRules"></v-text-field>
                </v-col>
            </v-row>
        </v-form>
        <template v-slot:actions>
            <v-btn outlined color="info" @click="confirm">
                <v-icon left>check</v-icon>
                확인
            </v-btn>
            <v-btn outlined color="primary" @click="close">
                <v-icon left>close</v-icon>
                닫기
            </v-btn>
        </template>
    </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import adminAuthService from 'Api/modules/system/adminAuth.service'

export default {
  extends: DialogBase,
  name: 'PasswordConfirm',
  data () {
    return {
      password: ''
    }
  },
  mounted () {
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{ target: 'escape', action: this.close }]
    })
  },
  methods: {
    async confirm () {
      try {
        await this.validForm(this.$refs.form)
        await adminAuthService.confirmPassword(this.password)
        this.close({ check: true })
      } catch (e) {
      }
    }
  }
}
</script>
