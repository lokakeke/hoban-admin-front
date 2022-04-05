<template>
    <div>
        <v-list-item class="sidebar-profile">
            <v-list-item-avatar>
                <v-icon color="white">person</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
                <v-list-item-title>
                    <span class="font-weight-bold">{{ user.name }}</span>
                </v-list-item-title>
            </v-list-item-content>
            <v-menu
                bottom
                offset-y
                left
                content-class="userblock-dropdown"
                nudge-top="-10"
                nudge-right="0"
                transition="slide-y-transition"
            >
                <template v-slot:activator="{ on }">
                    <v-btn dark icon v-on="on" class="ma-0">
                        <v-icon>more_vert</v-icon>
                    </v-btn>
                </template>
                <div class="dropdown-content">
                    <div class="dropdown-top white--text primary">
                        <span class="white--text fs-14 fw-bold d-block">{{ user.name }}</span>
                        <span
                            class="d-block fs-12 fw-normal"
                        >{{ partnerYn === "Y" ? "업체번호: " : "사원번호: " }} {{ user.number }}</span>
                    </div>
                    <v-list class="dropdown-list">
                        <v-list-item @click="getProfile">
                            <i :class="userLinks[0].icon"></i>
                            <span>{{ $t(userLinks[0].title) }}</span>
                        </v-list-item>
                        <v-list-item @click="setMyMenuMemory">
                            <i :class="userLinks[1].icon"></i>
                            <span>{{ userLinks[1].title }}</span>
                        </v-list-item>
                        <v-list-item @click="logout">
                            <i :class="userLinks[2].icon"></i>
                            <span>{{ $t(userLinks[2].title) }}</span>
                        </v-list-item>
                    </v-list>
                </div>
            </v-menu>
        </v-list-item>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import menuService from '@/api/modules/system/menu.service'
import cookieUtil from '@/utils/cookie.util'

export default {
  data () {
    return {
      userLinks: [
        {
          id: 1,
          title: 'message.userProfile',
          icon: 'ti-user mr-3 info--text',
          font: 'ti-user'
        },
        {
          id: 2,
          title: '권한 재조회',
          icon: 'ti-reload mr-3 blue--text',
          font: 'ti-reload'
        },
        {
          id: 3,
          title: 'message.logOut',
          icon: 'ti-power-off mr-3 error--text',
          font: 'ti-power-off'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({ user: 'auth/user', partnerYn: 'auth/partnerYn', jwtToken: 'auth/jwtToken' })
  },
  methods: {
    logout () {
      this.$dialog
        .confirm('로그아웃 하시겠습니까?')
        .then(() => {
          this.$store.dispatch('auth/logout')
        })
        .catch(() => {
        })
    },
    getProfile () {
      this.$store.dispatch('auth/checkPassword', {
        passFunc: () => {
          this.$store.dispatch('dialog/open', {
            componentPath: this.partnerYn === 'N' ? '/Sidebar/UserProfile' : '/Sidebar/PartnerProfile',
            params: {},
            options: {
              fullscreen: true,
              retainFocus: false,
              persistent: true,
              scrollable: true
            }
          })
        }
      })
    },
    async setMyMenuMemory () {
      try {
        await this.$dialog.confirm('API 권한을 재조회 하시겠습니까?')
        await menuService.memoryMyMenu()
        // jwt-token 강제로 cookie 에 삽입
        cookieUtil.setCookie('jwt-header', this.jwtToken)
      } catch (e) {
      }
    }
  }
}
</script>
