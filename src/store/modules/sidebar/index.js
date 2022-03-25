/**
 * Sidebar Module
 */
import menuService from 'Api/modules/system/menu.service'

const state = {
  menus: null,
  sideMenus: null,
  writeAuth: null,
  redirectPath: null,
  partnerLogin: null
}

const getters = {
  menus: state => {
    return state.menus
  },
  sideMenus: state => {
    return state.sideMenus || state.menus
  },
  writeAuth: state => {
    return state.writeAuth || false
  },
  redirectPath: state => {
    return state.redirectPath || '/'
  },
  partnerLogin: state => {
    return state.partnerLogin || false
  }
}

const actions = {
  /**
   * 나의 메뉴 저장
   * @param {Object} context
   * @param {Object} menus
   */
  setMenus ({ commit }, menus) {
    commit('setMenusHandler', menus)
  },
  setSideMenus ({ commit }, sideMenus) {
    commit('setSideMenusHandler', sideMenus)
  },
  /**
   * 라우팅 이동 체크
   *  1. 나의메뉴가 존재하는지 체크 후 없으면 조회하여 저장
   *  2. 라우터 to 정보를 기준으로 이동 여부 판단
   * @param {Object} context
   * @param {Object} to 라우터 to 정보
   * @description 나의 메뉴가 null 일 경우(나의 메뉴가 없을 경우) 서버에서 불러온다.
   */
  checkMenus ({ getters, commit }, to) {
    if (getters.menus == null) {
      return menuService.selectMyMenuList().then(res => {
        commit('setMenusHandler', res.data)
        return Promise.resolve(menuService.checkRouterAuth(res.data, to))
      }).catch(e => {
        commit('setMenusHandler', [])
        return Promise.resolve(menuService.checkRouterAuth([], to))
      })
    } else {
      return Promise.resolve(menuService.checkRouterAuth(getters.menus, to))
    }
  },
  /**
   * 메뉴 쓰기권한 셋팅
   * @param {Object} context
   * @param {Object} writeAuthYn 메뉴 쓰기권한 여부
   */
  setWriteAuth ({ commit }, writeAuthYn) {
    commit('setWriteAuthHandler', writeAuthYn)
  },
  /**
   * 파트너 로그인 화면접근 여부
   * @param {Object} context
   * @param {Object} partnerLogin 파트너 로그인 화면 접근여부
   */
  setPartnerLogin ({ commit }, partnerLogin) {
    commit('setPartnerLoginHandler', partnerLogin)
  },
  /**
   * 로그인 성공 시 redirect Path 저장
   * @param {Object} context
   * @param {Object} path 로그인 후 이동 될 path
   */
  setRedirectPath ({ commit }, path) {
    commit('setRedirectPathHandler', path)
  }
}

const mutations = {
  setMenusHandler (state, menus) {
    state.menus = menus || null
  },
  setSideMenusHandler (state, sideMenus) {
    state.sideMenus = sideMenus || null
  },
  setWriteAuthHandler (state, writeAuthYn) {
    state.writeAuth = writeAuthYn !== 'N'
  },
  setRedirectPathHandler (state, path) {
    state.redirectPath = path
  },
  setPartnerLoginHandler (state, partnerLogin) {
    state.partnerLogin = partnerLogin
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
