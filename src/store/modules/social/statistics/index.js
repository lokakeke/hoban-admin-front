// (woojung)


/**
 * Social - 통계
 */

// state
const state = {
  /**
   * 통계 검색 조건
   */
  searchCondition: null
}

// getters
const getters = {
  /**
   * 통계 검색 조건
   * @param {Object} state
   */
  searchCondition (state) {
    return state.searchCondition
  }
}

// actions
const actions = {
  /**
   * 데이터 초기화
   * @param {Object} context
   */
  initCondition ({ commit }) {
    const baseCondition = {
      // 검색타입 - D: 일자별, M: 월별, Y: 연도별
      // 검색구분 - 'A': 전체, 'O': 상시, 'S': 전략
      // 판매구분 - 'S': 판매, 'U': 사용, 'C': 취소
      // 일자별 - 2주전 ~ 오늘
      // 월별 - 6달전 ~ 이번달
      // 연도별 - 1년전 ~ 이번연도
      searchType: 'D',
      searchKind: 'A',
      saleKind: 'S',
      searchFromDate: moment().add(-2, 'weeks').format('YYYY-MM-DD'),
      searchToDate: moment().format('YYYY-MM-DD'),
      searchFromMonth: moment().add(-6, 'months').format('YYYY-MM'),
      searchToMonth: moment().format('YYYY-MM'),
      searchFromYear: moment().add(-1, 'years').format('YYYY'),
      searchToYear: moment().format('YYYY'),
      chrgList: [],
      chnnlList: [],
      ptnrList: [],
      ticketList: []
    }
    commit('setSearchCondition', baseCondition)
    return Promise.resolve(baseCondition)
  },
  /**
   * 검색 조건 입력
   * @param {Object} context
   * @param searchCondition 선택 조건
   */
  setCondition ({ commit }, searchCondition) {
    commit('setSearchCondition', searchCondition)
    return Promise.resolve()
  }
}

// mutations
const mutations = {
  setSearchCondition (state, searchCondition) {
    state.searchCondition = searchCondition
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
