import store from '@/store'
import adminAuthService from '@/api/modules/system/authentication/admin/adminAuth.service'
import router from '@/router'
import Nprogress from 'nprogress'
import util from '@/utils/cookie.util'
import partnerAuthService from '@/api/modules/system/authentication/partner/partnerAuth.service'

/**
 * Auth Module
 */
const state = {
  user: null,
  jwtToken: null,
  partnerYn: null,
  mainAuthYn: null
}

// getters
const getters = {
  jwtToken: state => {
    return state.jwtToken
  },
  user: state => {
    return state.user
  },
  /**
   * 로그인 여부
   */
  isLoggedIn: state => {
    return Boolean(state.user && state.partnerYn && state.jwtToken)
  },
  partnerYn: state => {
    return state.partnerYn
  },
  isSupervisor: state => {
    return state.mainAuthYn === 'Y'
  }
}

// actions
const actions = {
  /**
   * 인증여부 확인
   * @param {Object} context
   */
  async check ({ getters, commit }) {
    // N progress bar active
    Nprogress.start()
    // keypress 이벤트 초기화 후 진행
    await store.dispatch('keypress/init')
    // 메뉴 쓰기권한 초기화
    await store.dispatch('sidebar/setWriteAuth', 'N')
    // 로그인 체크
    console.log('isLoginedIn')
    console.log(getters.isLoggedIn)
    if (getters.isLoggedIn === true) {
      // Case 1. 사용자 로그인 된 경우 :
      return Promise.resolve()
    } else if (getters.jwtToken && (!getters.user || !getters.partnerYn)) {
      // Case 2. 토큰만 존재하는 경우 : 서버에서 사용자 정보 가져오기
      try {
        let res = null
        const isPartner = getters.partnerYn
        console.log('isPartner')
        console.log(isPartner)
        if (isPartner === 'Y') {
          res = await partnerAuthService.get()
        } else {
          res = await adminAuthService.get()
        }
        // 사용자 정보 저장
        commit('setPartnerYn', res.data.partnerYn)
        commit('setUser', res.data)
        commit('setSupervisor', res.data.mainAuthYn || 'N')
        return Promise.resolve()
      } catch (e) {
        // 서버 조회 에러
        commit('setPartnerYn', null)
        commit('setUser', null)
        commit('setJWTToken', null)
        return Promise.reject(e)
      }
    } else {
      // Case 3. 그 외
      commit('setPartnerYn', null)
      commit('setUser', null)
      commit('setJWTToken', null)
      return Promise.reject(new Error('not login'))
    }
  },
  /**
   * 1차 로그인 : ID / Password 검증
   * @param {Object} context
   * @param {Object} params
   * @param {String} loginId 로그인 아이디
   * @param {String} loginPw 로그인 비밀번호
   * @param {String} partnerYn 파트너 로그인 여부
   */
  async preLogin ({ commit }, { loginId, loginPw, partnerYn }) {
    // 1차 로그인 인증(id/password)
    if (partnerYn && partnerYn === 'Y') { // Partner
      const res = await partnerAuthService.preLogin({ loginId, loginPw, partnerYn })
      return Promise.resolve(res)
    } else { // Admin
      const res = await adminAuthService.preLogin({ loginId, loginPw, partnerYn })
      return Promise.resolve(res)
    }
  },
  /**
   * 2차 로그인 : ID / Password / 인증번호 검증
   * @param {Object} context
   * @param {Object} params
   * @param {String} loginId 로그인 아이디
   * @param {String} loginPw 로그인 비밀번호
   * @param {String} partnerYn 파트너 로그인 여부
   * @param {String} requestCode 인증번호
   * @param {String} requestId 파트너 담당자 ID
   */
  async login ({ commit }, { loginId, loginPw, partnerYn, requestCode, requestId }) {
    // 사용자 메뉴 초기화
    await store.dispatch('sidebar/setMenus', null)
    let res = null
    if (partnerYn && partnerYn === 'Y') {
      res = await partnerAuthService.login({ loginId, loginPw, partnerYn, requestCode, requestId })
    } else {
      res = await adminAuthService.login({ loginId, loginPw, partnerYn, requestCode, requestId })
      partnerYn = 'N'
    }
    commit('setPartnerYn', partnerYn)
    commit('setJWTToken', res.headers['jwt-header'])
    commit('setUser', res.data)
    commit('setSupervisor', res.data.mainAuthYn || 'N')
    return Promise.resolve()
  },
  /**
   * 로그아웃
   * @param {Object} context
   */
  async logout ({ commit }) {
    commit('setPartnerYn', null)
    commit('setJWTToken', null)
    commit('setUser', null)
    await adminAuthService.logout()
    // 파트너로그인 페이지 에서 로그인 하였을 경우 파트너 로그인 페이지로 보낸다.
    const partnerLogin = store.getters['sidebar/partnerLogin']
    router.push({ path: partnerLogin ? '/partnerLogin' : '/login' })
    return Promise.resolve()
  },
  /**
   * 사용자 정보 저장
   * @param {Object} context
   * @param {object} user 사용자 정보
   */
  user ({ commit }, user) {
    commit('setUser', user)
  },
  /**
   * 메뉴 접근전 비밀번호 확인
   * @param commit
   * @param passFunc 비밀번호 확인 성공 후 실행될 함수
   * @param closeFunc 비밀번호 확인 취소 시 실행될 함수
   */
  checkPassword ({ commit }, { passFunc, closeFunc }) {
    store.dispatch('dialog/open', {
      componentPath: '/Session/PasswordConfirm',
      params: {},
      options: {
        fullscreen: false,
        width: 600,
        closeCallback: (params) => {
          if (params && params.check) {
            passFunc()
          } else if (closeFunc !== undefined) {
            closeFunc()
          }
        }
      }
    })
  }
}

// mutations
const mutations = {
  setJWTToken (state, token) {
    state.jwtToken = token || null
    if (token == null) {
      util.delCookie('jwt-header')
    } else {
      util.setCookie('jwt-header', token)
    }
  },
  setUser (state, user) {
    state.user = user || {
      loginId: null,
      name: null,
      number: null,
      partnerManagerId: null
    }
  },
  setPartnerYn (state, partnerYn) {
    state.partnerYn = partnerYn || null
  },
  setSupervisor (state, mainAuthYn) {
    state.mainAuthYn = mainAuthYn
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
