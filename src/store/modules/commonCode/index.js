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
  setCommonCode (state, { parentCommCode, codeList }) {
    state.wrapper[parentCommCode] = codeList
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
