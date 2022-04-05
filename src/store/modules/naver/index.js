/**
 *  Naver Item Store
 */

// state
const state = {
  /**
   * 객실 정보
   */
  roomInfo: {
    dmStoreId: '',
    dmItemId: '',
    mid: '',
    storeCode: '',
    rmTypeCode: '',
    rsvBlckCode: ''
  },
  emptyRoomInfo: {
    dmStoreId: '',
    dmItemId: '',
    mid: '',
    storeCode: '',
    rmTypeCode: '',
    rsvBlckCode: ''
  },
  status: {
    confirmed: {
      text: '신청',
      refund: '신청',
      state: '신청완료',
      bgcolor: '#00897B',
      color: '#eee'
    },
    payCompleted: {
      text: '확정',
      refund: '확정',
      state: '결제완료',
      bgcolor: '#1565C0',
      color: '#eee'
    },
    cancelled: {
      text: '취소',
      refund: '예약취소',
      state: '환불완료',
      bgcolor: '#EF5350',
      color: '#eee'
    },
    completed: {
      text: '완료',
      refund: '이용완료',
      state: '결제완료',
      bgcolor: '#7C4DFF',
      color: '#eee'
    },
    noshow: {
      text: '노쇼',
      refund: '노쇼',
      state: '환불완료',
      bgcolor: '#F9A825',
      color: '#fff'
    },
    payFailed: {
      text: '결제실패',
      refund: '결제실패',
      state: '환불완료',
      bgcolor: '#9E9D24',
      color: '#eee'
    },
    paid: {
      text: '결제',
      refund: '결제완료',
      state: '결제완료',
      bgcolor: '#2E7D32',
      color: '#eee'
    }
  }
}

const getters = {
  /**
   * 객실 정보
   * @param {Object} state
   */
  roomInfo (state) {
    return state.roomInfo
  },
  emptyRoomInfo (state) {
    return state.emptyRoomInfo
  },
  /**
   * 예약 상태
   */
  setStatus (state) {
    return state.status
  }
}

// actions
const actions = {
  /**
   * 객실 정보
   * @param {Object} context
   */
  setRoomInfo ({ commit }, roomInfo) {
    commit('setRoomInfo', roomInfo)
  }
}

// mutations
const mutations = {
  setRoomInfo (state, roomInfo) {
    Object.assign(state.roomInfo, roomInfo)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
