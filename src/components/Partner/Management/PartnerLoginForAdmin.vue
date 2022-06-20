<template>
  <v-btn text rounded color="accent" @click.native.stop @click="loginForAdmin">
    <v-icon left>login</v-icon> 로그인
  </v-btn>
</template>

<script>
import adminAuthService from '@/api/modules/system/authentication/admin/adminAuth.service'

export default {
  name: 'PartnerLoginForAdmin',
  props: {
    /**
     * 파트너 정보
     */
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    /**
     * 관리자로 로그인
     */
    loginForAdmin () {
      if (this.isPartner === true) {
        this.$dialog.alert('잘못된 접근입니다.')
        return false
      }
      this.$dialog.confirm(`로그아웃하고 ${this.item.partnerName}(${this.item.loginId}) 파트너로 로그인합니다. 계속 진행하시겠습니까?`)
        .then(() => {
          // 사용자 메뉴 초기화
          this.$store.dispatch('sidebar/setMenus', null)
          adminAuthService.loginForAdmin(this.item.loginId).then(response => {
            // 사용자 정보 저장
            this.$store.commit('auth/setPartnerYn', 'Y')
            this.$store.commit('auth/setJWTToken', response.headers['jwt-header'])
            this.$store.commit('auth/setUser', response.data)
            this.$router.push(this.$store.getters['sidebar/redirectPath'])
          })
        })
    }
  }
}
</script>
