/**
 *  partner inventory
 */

// state
const state = {
  /**
   * 전송 관리중인 파트너 리스트
   */
  managementList: [],
  /**
   * 전송 미관리중인 파트너 리스트
   */
  noneList: []
}

// getters
const getters = {
  /**
   * 전송 관리중인 파트너 리스트
   * @param {Object} state
   */
  managementList (state) {
    return state.managementList
  },
  /**
   * 전송 미관리중인 파트너 리스트
   * @param state
   */
  noneList (state) {
    return state.noneList
  }
}

// actions
const actions = {
  /**
   * 데이터 초기화
   * @param {Object} context
   */
  initList ({ commit }) {
    commit('setList', [])
    commit('setNoneList', [])
    return Promise.resolve()
  },
  /**
   * 전송 관리중인 파트너 리스트 셋팅
   * @param {Object} context
   * @param managementList 전송 관리중인 파트너 리스트
   */
  setList ({ commit }, managementList = []) {
    commit('setList', managementList)
    return Promise.resolve()
  },
  /**
   * 전송 미관리중인 파트너 리스트 셋팅
   * @param {Object} context
   * @param noneList 전송 미관리중인 파트너 리스트
   */
  setNoneList ({ commit }, noneList = []) {
    commit('setNoneList', noneList)
    return Promise.resolve()
  }
}

// mutations
const mutations = {
  setList (state, managementList) {
    state.managementList = managementList
  },
  setNoneList (state, noneList) {
    state.noneList = noneList
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
