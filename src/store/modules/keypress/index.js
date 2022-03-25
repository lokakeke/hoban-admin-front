/**
 *  Keypress event Module
 */

// state
const state = {
  /**
   * 화면 번호 : 최종화면에서만 이벤트 동작진행을 진행하기위해 저장
   */
  sequence: null,
  /**
   * 키 입력 이벤트 리스트
   */
  keyEventList: null,
  /**
   * 멀티 키 입력여부 : control 키 입력상태 인지 아닌지
   */
  keyMulti: false
}

const getters = {
  /**
   * 화면 순서
   * @param {Object} state
   */
  sequence (state) {
    return state.sequence || 0
  },
  /**
   * 키 입력 이벤트 리스트
   * @param {Object} state
   */
  keyEventList (state) {
    return state.keyEventList || []
  },
  /**
   * 멀티 키 입력여부 : control 키 입력상태 인지 아닌지
   * @param state
   * @returns boolean
   */
  keyMulti (state) {
    return state.keyMulti
  }
}

// actions
const actions = {
  /**
   * 초기화 - router 이동 시 초기화 해준다.
   * @param {Object} context
   */
  init ({ commit }) {
    commit('setSequence', 0)
    commit('setKeyEventList', [])
  },

  /**
   * 화면 번호 증가
   * @param {Object} context
   */
  increaseSequence ({ getters, commit }) {
    const sequence = getters.sequence + 1
    commit('setSequence', sequence)
    return Promise.resolve()
  },

  /**
   * 화면 번호 직접 셋팅
   * @param commit
   * @param sequence 지정 화면번호
   */
  setSequence ({ commit }, sequence) {
    commit('setSequence', sequence)
    return Promise.resolve()
  },

  /**
   * 화면 번호 감소
   * @param {Object} context
   */
  decreaseSequence ({ getters, commit }) {
    const sequence = getters.sequence
    const keyEventList = getters.keyEventList
    const keyIndex = keyEventList.findIndex(data => data.sequence === sequence)
    if (keyIndex > -1) {
      keyEventList.splice(keyIndex, 1)
    }
    commit('setSequence', sequence - 1)
    commit('setKeyEventList', keyEventList)
    return Promise.resolve()
  },

  /**
   * 키 입력 이벤트 추가
   * @param {Object} context
   * @param {Array} eventList
   * @param {Boolean} increaseSequence 모달 증가가 아닌 강제로 증가시켜야 할 경우를 위한 변수
   */
  addKeyEventList ({ getters, commit }, { eventList = [], increaseSequence = false }) {
    if (eventList.length > 0) {
      const keyEventList = getters.keyEventList
      let sequence = getters.sequence
      if (increaseSequence) {
        sequence += 1
        commit('setSequence', sequence)
      }
      // 멀티 키 이벤트 true 가 아닐경우 false 셋팅
      eventList.forEach(data => {
        data.multi = data.multi === true
      })
      const keyEvent = keyEventList.find(data => data.sequence === sequence)
      if (keyEvent) {
        // 신규 이벤트를 넣어준다. 중복 키는 최신 이벤트로 덮어준다.
        for (const event of eventList) {
          // 멀티키 이벤트 인지 체크한다.
          let findIndex = -1
          if (event.multi) {
            findIndex = keyEvent.eventList.findIndex(data => data.target === event.target && data.multi === true)
          } else {
            findIndex = keyEvent.eventList.findIndex(data => data.target === event.target && data.multi === false)
          }
          if (findIndex > -1) {
            keyEvent.eventList[findIndex] = event
          } else {
            keyEvent.eventList.push(event)
          }
        }
      } else {
        keyEventList.push({ sequence: sequence, eventList: eventList })
      }
      commit('setKeyEventList', keyEventList)
    }
  },
  /**
   * 멀티 키 입력 체크 (control 키)
   * @param getters
   * @param commit
   * @param target e.key
   * @param isPress 눌려진 상태인지 체크
   */
  toggleKeyMulti ({ getters, commit }, { target = '', isPress = false }) {
    if (target.toLowerCase() === 'control') {
      commit('setKeyMulti', isPress)
    }
  }
}

// mutations
const mutations = {
  setSequence (state, sequence) {
    state.sequence = sequence || 0
  },
  setKeyEventList (state, event) {
    state.keyEventList = event || []
  },
  setKeyMulti (state, keyMulti) {
    state.keyMulti = keyMulti
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
