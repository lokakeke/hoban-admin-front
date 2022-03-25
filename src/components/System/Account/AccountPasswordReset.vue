<template>
  <v-menu bottom
          offset-y
          v-model="expand"
          :close-on-content-click="false"
          transition="slide-y-transition">
    <template v-slot:activator="{ on }">
      <v-btn text block rounded color="accent" @click.native.stop v-on="on">
        <v-icon left>refresh</v-icon>비밀번호 초기화
      </v-btn>
    </template>
    <v-card>
      <v-card-text>
        <v-radio-group v-model="type" row hide-details :rules="emptyRules" class="mt-0">
          <v-radio label="S.M.S" value="S"></v-radio>
          <v-radio label="E-MAIL" value="E"></v-radio>
        </v-radio-group>
        <div class="text-right mt-3">
          <v-btn rounded small color="info" @click="passwordReset"><v-icon small left>check</v-icon>변경</v-btn>
          <v-btn rounded small color="primary" @click="expand = false"><v-icon small left>close</v-icon>닫기</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import authService from 'Api/modules/system/accountAuth.service'

export default {
  props: {
    item: Object
  },
  name: 'AccountPasswordReset',
  data () {
    return {
      expand: false,
      type: 'E'
    }
  },
  methods: {
    passwordReset () {
      let msg = ''
      if (this.type === 'S') {
        if (!this.item.telNo) {
          this.$dialog.alert(`${this.item.mngmUserNm} 의 전화 번호 정보가 없습니다.`)
          return
        }
        msg = `${this.item.mngmUserNm} 의 임시 비밀번호 발급을 진행하시겠습니까?<br/>`
        msg += '발송 타입 : S.M.S<br/>'
        msg += `발송 정보 : ${this.item.telNo}`
      } else {
        if (!this.item.email) {
          this.$dialog.alert(`${this.item.mngmUserNm} 의 이메일 정보가 없습니다.`)
          return
        }
        msg = `${this.item.mngmUserNm} 의 임시 비밀번호 발급을 진행하시겠습니까?<br/>`
        msg += '발송 타입 : E-MAIL<br/>'
        msg += `발송 정보 : ${this.item.email}`
      }
      this.$dialog.confirm(msg).then(() => {
        authService.createTemporaryPassword(this.item.loginId, this.type).then(res => {
          console.log('임시 비밀번호 확인용 : ', res.data)
          this.$dialog.alert('임시 비밀번호가 발급되었습니다.')
          this.expand = false
        })
      })
    }
  }
}
</script>
