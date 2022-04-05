<template>
    <div class="site-logo">
        <router-link to="/">
            <img :src="appLogo" alt="site logo" width="100" class="mt-3">
        </router-link>
    </div>
</template>

<script>
import AppConfig from '@/constants/AppConfig'

export default {
  data () {
    return {
      appLogo: AppConfig.hobanLogo
    }
  }
}
</script>
