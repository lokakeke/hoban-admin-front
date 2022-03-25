<template>
    <div class="vld-parent">
        <loading :active.sync="nowLoading" :loader="options.loader" :color="options.color"
                 :height="options.height" :width="options.width" :backgroundColor="options.backgroundColor">
            <!--<slot>
                <div class="display-2">Loading...</div>
            </slot>-->
        </loading>
    </div>
</template>

<script>
import { mapGetters } from "vuex"
import Loading from "vue-loading-overlay"
import "vue-loading-overlay/dist/vue-loading.css"

export default {
  name: 'VueLoadingOverlay',
  components: {
    Loading
  },
  computed: {
    ...mapGetters({
      nowLoading: 'settings/nowLoading'
    })
  },
  data () {
    return {
      options: {
        loader: 'dots', // 'spinner', 'bars', 'dots'
        height: 85,
        width: 85,
        color: '#6D4C41',
        backgroundColor: '#FFFFFF'
      }
    }
  }
}
</script>
