<template>
  <v-row justify="center">
    <img :src="logo" width="800px" height="800px" alt="site logo">
  </v-row>
</template>

<script>
import AppConfig from 'Constants/AppConfig'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      logo: AppConfig.sonoHnrLogo
    }
  },
  computed: {
    ...mapGetters({ menus: 'sidebar/menus' })
  },
  async mounted () {
    // 첫번째 메뉴를 찾아 이동한다.
    this.findFirstRoute(this.menus)
  },
  methods: {
    /**
     * 로그인 사용자의 첫번째 메뉴가 메인 페이지 이다.
     */
    findFirstRoute (menus) {
      if (menus && _.isArray(menus)) {
        for (const menu of menus) {
          if (menu.menuPath) {
            this.$router.push(menu.menuPath)
            return true
          } else if (menu.children) {
            if (this.findFirstRoute(menu.children)) {
              return true
            }
          }
        }
      }
      return false
    }
  }
}
</script>
