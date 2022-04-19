<template>
    <div class="site-logo pointer" @click="$router.push('/')">
        <img :src="appLogo" alt="site logo" height="27px">
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
