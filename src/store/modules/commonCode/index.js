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
  setCommonCode (state, { parentCommCd, codeList }) {
    state.wrapper[parentCommCd] = codeList
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
