<!-- App Main Structure -->
<template>
  <div class="app-default-layout">
    <!-- App Header -->
    <app-header></app-header>
    <!-- App Main Content -->
    <v-main>
      <v-container fluid class="py-3">
          <!-- page title +  bread crumb -->
          <page-title-bar></page-title-bar>
        <router-view :key="$router.currentRoute.path"></router-view>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Header from '@/components/Header/Header.vue'
import PageTitleBar from '@/components/Header/PageTitleBar'

export default {
  components: {
    appHeader: Header,
    PageTitleBar
  },
  computed: {
    ...mapGetters({
      selectedRouterAnimation: 'settings/selectedRouterAnimation'
    })
  },
  mounted () {
    // 리사이즈 이벤트 바인딩
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  methods: {
    handleResize () {
      const height = window.innerHeight
      const width = window.innerWidth
      this.$store.dispatch('settings/setWindow', {
        width,
        height
      })
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style>
main.v-main {
  height: 100vh;
}

div.v-main__wrap {
  overflow: auto;
}
</style>
