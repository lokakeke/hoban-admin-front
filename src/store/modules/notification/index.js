/**
 * 메뉴바 오른쪽 상단의 알림
 */
import Vue from "vue"
import router from "@/router"
import store from "@/store"
import systemService from "Api/modules/notification/notification.service"
import partnerService from "Api/modules/notification/partnerNotification.service"

// state
const state = {
  /**
   * 알림 화면 depth
   */
  depth: 1,
  /**
   * 선택된 타입
   */
  selectedType: {},
  /**
   * 선택된 메세지
   */
  selectedItem: {},
  /**
   * 타입별 리스트
   */
  typeNotiList: [],
  /**
   * 메세지별 리스트
   */
  notifications: [],
  /**
   * 알림 화면 노출 여부
   */
  openMenu: false,
  /**
   * interval 객체
   */
  interval: null
}

// getters
const getters = {
  isPartner () {
    return store.getters['auth/partnerYn'] === 'Y'
  },
  depth (state) {
    return state.depth
  },
  typeNotiList (state) {
    return state.typeNotiList
  },
  selectedType (state) {
    return state.selectedType
  },
  selectedItem (state) {
    return state.selectedItem
  },
  notifications (state) {
    return state.notifications
  },
  openMenu (state) {
    return state.openMenu
  }
}

// actions
const actions = {
  /**
   * 전체 알림 게시판으로 이동
   */
  showAllNotification ({ commit }) {
    commit('setOpenMenu', true)
    router.push({ name: 'notificationBoard' })
  },
  /**
   * depth 2 에서 1 로 이동
   */
  showTypeNotification ({ commit }) {
    commit('setDepth', 1)
  },
  /**
   * depth 3 으로 이동, 선택된 메세지에 따라 디테일 리스트 목록을 보여주는 메서드
   */
  showDetailNotifications ({ commit }, item) {
    commit('setSelectedItem', item)
    commit('setDepth', 3)
  },
  /**
   * depth 1 에서 2 로 이동, 선택된 타입에 따라 메세지 리스트 목록을 보여주는 메서드
   */
  showMessageNotifications ({ commit, dispatch }, type) {
    commit('setOpenMenu', false)
    dispatch('getNotificationGroup', type)
    commit('setSelectedType', type)
    commit('setDepth', 2)
  },
  /**
   * depth 3 에서 depth 2 로 이동
   */
  goBackToMessageNotifications ({ state, getters, commit, dispatch }, isRead) {
    // 알림을 읽었다면 다시 조회
    if (isRead) {
      dispatch('getNotificationType')
      dispatch('getNotificationGroup', state.selectedType)
    }
    commit('setDepth', 2)
  },
  /**
   * 타입별(OTA, Social, Naver) 조회
   * @param commit
   * @param getters
   */
  async getNotificationType ({ commit, getters }) {
    if (getters.isPartner) {
      const res = await partnerService.selectNotificationType()
      commit('setTypeNotiList', res.data)
    } else {
      const res = await systemService.selectNotificationType()
      commit('setTypeNotiList', res.data)
    }
  },
  /**
   * 메세지별(알림 내용) 조회
   * @param commit
   * @param dispatch
   * @param type
   */
  getNotificationGroup ({ commit, getters, dispatch }, type) {
    if (getters.isPartner) {
      partnerService.selectNotificationGroup(type).then(res => {
        if (res.data && res.data.length > 0) {
          commit('setNotifications', res.data)
        } else {
          dispatch('showTypeNotification')
        }
      })
    } else {
      systemService.selectNotificationGroup(type).then(res => {
        if (res.data && res.data.length > 0) {
          commit('setNotifications', res.data)
        } else {
          dispatch('showTypeNotification')
        }
      })
    }
  },
  /**
   * 이름별 알림 전체 읽음
   * @param state
   * @param getters
   * @param dispatch
   * @returns {Promise<void>}
   */
  async readAllByName ({ state, getters, dispatch }) {
    try {
      await Vue.dialog.confirm('[' + state.selectedItem.notifyNm + ']를(을) 전부 읽음 처리 하시겟습니까?', { confirmButtonText: '확인', cancelButtonText: '취소', type: 'info', dangerouslyUseHTMLString: true })
      if (getters.isPartner) {
        const res = await partnerService.readAllNotification(state.selectedItem)
        if (res.data) {
          Vue.dialog.alert('처리가 완료 되었습니다.', {
            confirmButtonText: '확인',
            type: 'warning'
          })
          dispatch('goBackToMessageNotifications', true)
        }
      } else {
        const res = await systemService.readAllNotification(state.selectedItem)
        if (res.data) {
          Vue.dialog.alert('처리가 완료 되었습니다.', {
            confirmButtonText: '확인',
            type: 'warning'
          })
          dispatch('goBackToMessageNotifications', true)
        }
      }
    } catch (e) {}
  },
  /**
   * 모든 알림 전체 읽음
   * @returns {Promise<void>}
   */
  async readAll ({ getters, dispatch }) {
    try {
      await Vue.dialog.confirm('알림을 전부 읽음 처리 하시겟습니까?', { confirmButtonText: '확인', cancelButtonText: '취소', type: 'info', dangerouslyUseHTMLString: true })
      if (getters.isPartner) {
        const res = await partnerService.readAllNotification({ ptnrChrgId: '' })
        if (res.data) {
          Vue.dialog.alert('처리가 완료 되었습니다.', {
            confirmButtonText: '확인',
            type: 'warning'
          })
          dispatch('getNotificationType')
        }
      } else {
        const res = await systemService.readAllNotification({ loginId: '' })
        if (res.data) {
          Vue.dialog.alert('처리가 완료 되었습니다.', {
            confirmButtonText: '확인',
            type: 'warning'
          })
          dispatch('getNotificationType')
        }
      }
      return Promise.resolve()
    } catch (e) {}
  },
  /**
   * 1분마다 알림 조회해오는 observer
   * @param getters
   * @param commit
   */
  addNotificationObserver ({ getters, commit, dispatch }) {
    const interval = setInterval(() => {
      dispatch('getNotificationType')
    }, 60 * 1000 * 2)
    commit('setInterval', interval)
  },
  /**
   * interval 종료
   * @param state
   */
  clearInterval ({ commit }) {
    commit('clearInterval')
  }
}

// mutations
const mutations = {
  setDepth (state, depth) {
    state.depth = depth
  },
  setSelectedType (state, selectedType) {
    state.selectedType = selectedType
  },
  setSelectedItem (state, selectedItem) {
    state.selectedItem = selectedItem
  },
  setTypeNotiList (state, typeNotiList) {
    state.typeNotiList = typeNotiList
  },
  setNotifications (state, notifications) {
    state.notifications = notifications
  },
  setOpenMenu (state, openMenu) {
    state.openMenu = openMenu
  },
  setInterval (state, interval) {
    state.interval = interval
  },
  clearInterval (state) {
    clearInterval(state.interval)
    state.interval = null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
