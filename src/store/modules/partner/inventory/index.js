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
  noneManagementList: []
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
  noneManagementList (state) {
    return state.noneManagementList
  }
}

// actions
const actions = {
  /**
   * 데이터 초기화
   * @param {Object} context
   */
  initList ({ commit }) {
    commit('setManagementList', [])
    commit('setNoneManagementList', [])
    return Promise.resolve()
  },
  /**
   * 전송 관리중인 파트너 리스트 셋팅
   * @param {Object} context
   * @param managementList 전송 관리중인 파트너 리스트
   */
  setManagementList ({ commit }, managementList = []) {
    commit('setManagementList', managementList)
    return Promise.resolve()
  },
  /**
   * 전송 미관리중인 파트너 리스트 셋팅
   * @param {Object} context
   * @param noneManagementList 전송 미관리중인 파트너 리스트
   */
  setNoneManagementList ({ commit }, noneManagementList = []) {
    commit('setNoneManagementList', noneManagementList)
    return Promise.resolve()
  }
}

// mutations
const mutations = {
  setManagementList (state, managementList) {
    state.managementList = managementList
  },
  setNoneManagementList (state, noneManagementList) {
    state.noneManagementList = noneManagementList
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
