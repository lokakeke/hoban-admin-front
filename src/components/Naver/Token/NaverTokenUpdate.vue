<template>
  <dialog-base :instance="instance" :title="`${instance.params.form.userId} 토큰 키 ${instance.params.val === 'new' ? '신규발급' : '갱신'}`">
    <template v-slot:buttons>
      <v-btn dark text>
        <v-icon left>check</v-icon>
        업데이트
      </v-btn>
    </template>
    <v-form ref="form" v-if="form" lazy-validation>
      <v-card-text class="pa-0">
        <v-row class="pa-5">
          <v-col cols="12" class="pt-2 pb-0 mb-3">
            <v-textarea outlined dense :rules="emptyRules"
              label="Cookie" v-model="form.cookie"
              placeholder="쿠키를 입력해 주세요."
            ></v-textarea>
          </v-col>
          <v-col cols="12" class="pt-2 pb-0 mb-3" v-if="instance.params.val === 'edit'">
            <v-textarea outlined dense readonly :rules="emptyRules"
              label="Refresh Token(갱신)" v-model="form.refreshToken"
              placeholder="리프레시 토큰을 입력해 주세요."
            ></v-textarea>
          </v-col>
          <v-col cols="12" class="pt-2 pb-0 mb-3" v-if="instance.params.val === 'new'">
            <v-textarea outlined dense :rules="emptyRules"
              label="Refresh Token(신규발급)" v-model="newRefreshToken"
              placeholder="리프레시 토큰을 입력해 주세요."
            ></v-textarea>
          </v-col>
          <v-col class="text-right">
            <v-btn outlined rounded color="info" @click="updateToken">
              <v-icon left>check</v-icon>
              업데이트
            </v-btn>
            <v-btn outlined rounded color="primary" @click="close()">
              <v-icon>close</v-icon>닫기
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-form>
    <common-snackbars :text="snackbarText" v-model="isShowSnackbar" :type="snackbarType"></common-snackbars>
  </dialog-base>
</template>

<script>
import DialogBase from 'Components/Dialog/DialogBase.vue'
import service from 'Api/modules/naver/token.service'
import CommonSnackbars from 'Components/Common/CommonSnackbars.vue'

export default {
  extends: DialogBase,
  name: 'NaverTokenUpdate',
  components: {
    CommonSnackbars
  },
  data: function () {
    return {
      test: '',
      /**
       * 전달받은 데이터
       */
      form: null,
      /**
       * 토큰 신규발급
       */
      newRefreshToken: '',
      /**
       * snack bar
       */
      isShowSnackbar: false,
      snackbarType: 'success',
      snackbarText: ''
    }
  },
  methods: {
    updateToken () {
      this.validForm(this.$refs.form).then(() => {
        this.$dialog.confirm(`토큰을 ${this.instance.params.val === 'new' ? '신규발급' : '갱신'} 하시겠습니까?`)
          .then(() => {
            /**
             * 수정하기
             */
            this.instance.params.val === 'new' ? this.form.refreshToken = this.newRefreshToken : this.newRefreshToken = ''
            service.updateToken(this.form).then(res => {
              if (res.data === 1) {
                this.showSnackbar('success', (this.instance.params.val === 'new' ? '신규발급' : '갱신') + '되었습니다. 잠시 후 자동으로 초기화면으로 이동합니다.')
                setTimeout(() => {
                  this.$router.go(0)
                }, 1000)
              } else {
                this.$dialog.confirm('오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
              }
            }).catch(() => {
            })
          })
      }).catch(() => {
      })
    },
    showSnackbar (type, text) {
      this.isShowSnackbar = true
      this.snackbarType = type
      this.snackbarText = text
    }
  },
  mounted () {
    // key press event match
    this.$store.dispatch('keypress/addKeyEventList', {
      eventList: [{
        target: 'escape',
        action: this.close
      }]
    })
    this.form = this.instance.params.form
    this.form.cookie = ''
  }
}
</script>

<style scoped>

</style>
