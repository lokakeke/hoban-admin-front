/**
 * @/store
 */
import Vue from "vue"
import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate"
import modules from "./modules"

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: [createPersistedState({
    key: 'sono-api-front',
    paths: [
      // vuex에서 localStorage와 동기화할 module, state
      'auth.jwtToken',
      'sidebar.partnerLogin',
      'settings.popUpCheckDate'
    ]
  })]
})
