import Vue from 'vue'
import Vuetify from 'vuetify'
// store
import store from '@/store'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: store.getters['settings/selectedTheme'].theme,
      dark: store.getters['settings/selectedTheme'].theme
    }
  }
})
