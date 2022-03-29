<!-- Header Structure -->
<template>
    <div>
        <v-navigation-drawer
            v-model="isDrawSidebar"
            app
            fixed
            :width="250"
            class="Vuely-sidebar"
            :style="{backgroundImage: 'url('+ sidebarImages +')'}"
            :class="{'background-none': !backgroundImage}"
        >
            <app-sidebar></app-sidebar>
        </v-navigation-drawer>
        <v-app-bar class="Vuely-toolbar" app :color="activeHeaderFilter.class" fixed>
            <v-app-bar-nav-icon @click.stop="close" class="v-step-0 ml-1" title="메뉴 최소화"></v-app-bar-nav-icon>
            <v-container fluid class="py-0 pr-1">
                <v-row align="center" no-gutters>
                    <v-col>
                        <gnb-menu></gnb-menu>
                    </v-col>
                    <v-col lg="6" md="9" sm="8" cols="7">
                        <page-title-bar></page-title-bar>
                    </v-col>
                    <v-col lg="2" md="3" sm="4" cols="5" class="text-right">
                        <v-btn icon @click="getProfile" title="프로필" color="blue-grey">
                            <v-icon>person</v-icon>
                        </v-btn>
                        <notifications></notifications>
                        <v-btn icon @click="logout" title="로그 아웃" color="blue-grey">
                            <v-icon>exit_to_app</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-app-bar>
    </div>
</template>

<script>
import Sidebar from 'Components/Sidebar/Sidebar.vue'
import Notifications from 'Components/Header/Notifications.vue'
import PageTitleBar from 'Components/Header/PageTitleBar.vue'
import { mapActions, mapGetters } from 'vuex'
import GnbMenu from '@/components/Sidebar/GnbMenu'

export default {
  props: {
    horizontal: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      drawer: null,
      backgroundImage: true, // 사이드바 백그라운드 이미지 노출 여부
      sidebarImages: '/static/img/session/crop_solbeach.jpg' // 사이드바 백그라운드 이미지 URL
      /**
             * '/static/img/session/crop_solbeach.jpg'
             * '/static/img/session/crop_sonobelle.jpg'
             * '/static/img/session/crop_sonocalm.jpg'
             * '/static/img/session/crop_sonofelice.jpg'
             * '/static/img/session/crop_sonomoon.jpg'
             **/
    }
  },
  computed: {
    ...mapGetters({
      activeHeaderFilter: 'settings/activeHeaderFilter',
      partnerYn: 'auth/partnerYn'
    }),
    isDrawSidebar: {
      get () {
        return (
          Boolean(this.$store.getters['settings/collapseSidebar']) === false
        )
      },
      async set (newVal) {
        await this.$store.dispatch('settings/setMiniSidebarLayout', !newVal)
      }
    }
  },
  methods: {
    ...mapActions({
      onCollapseSidebar: 'settings/collapseSidebar'
    }),
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
            componentPath:
                            this.partnerYn === 'N'
                              ? '/Sidebar/UserProfile'
                              : '/Sidebar/PartnerProfile',
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
    close () {
      this.onCollapseSidebar()
    }
  },
  components: {
    GnbMenu,
    appSidebar: Sidebar,
    Notifications,
    PageTitleBar
  }
}
</script>
