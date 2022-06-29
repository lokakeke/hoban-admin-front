/**
 *  CommonCode Store
 */

// state
const state = {
  wrapper: {}
}

// getters
const getters = {
  wrapper (state) {
    return state.wrapper
  }
}

// mutations
const mutations = {
  setCommonCode (state, { parentCommonCode, codeList }) {
    state.wrapper[parentCommonCode] = codeList
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
