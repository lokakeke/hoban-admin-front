import Vue from 'vue'
import axios from 'axios'

import NProgress from 'nprogress'
import store from '@/store'

// 알림쪽 spinner 삭제
NProgress.configure({ showSpinner: false })

const service = axios.create({
  baseURL: '', // api의 base_url
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
    Progress: true // default 는 true 로 돌게 한다.
  },
  timeout: process.env.NODE_ENV === 'production' ? 60000 : 60000 // 요청 제한 시간 (운영: 15초 | 개발: 1분)
})

// 에러 카운트
let errorCount = 0

// 로딩 카운트
let loadingCount = 0

// 로딩 시작
const startLoading = function () {
  NProgress.start()
  loadingCount++
  if (loadingCount > 0) {
    store.dispatch('settings/setNowLoading', true)
  }
}

// 로딩 종료
const endLoading = function () {
  NProgress.done()
  if (loadingCount > 0) {
    loadingCount--
  }
  if (loadingCount < 1) {
    store.dispatch('settings/setNowLoading', false)
  }
}

// 요청(request) 인터셉터
service.interceptors.request.use(
  (config) => {
    // Progress 를 돌려야되는 경우  true (default)
    if (config.headers.Progress === true) {
      startLoading()
    } else {
      service.defaults.headers.Progress = true
    }

    if (store.getters['auth/jwtToken']) {
      config.headers['jwt-header'] = store.getters['auth/jwtToken'] // 각 요청에 실제 상황에 따라 사용자 지정 토큰을 전달하게 합니다.
    } else {
      // 사용자 토큰이 없을 경우
    }
    if (store.getters['auth/user']) {
      const user = store.getters['auth/user']
      if (user.loginId) {
        config.headers['login-id'] = user.loginId
      }
      if (user.number) {
        if (store.getters['auth/partnerYn'] === 'Y') {
          config.headers['partner-seq'] = user.number
          config.headers['partner-manager-id'] = user.partnerManagerId
        } else {
          config.headers['admin-seq'] = user.number
        }
      }
    }

    return config
  },
  (error) => {
    endLoading()
    // Do something with request error
    Promise.reject(error)
  }
)

// 응답(response) 인터셉터
service.interceptors.response.use(
  (response) => {
    endLoading()
    // 페이징 객체 설정
    if (response.headers) {
      response.pagination = {
        page: parseInt(response.headers['X-Current-Page'.toLowerCase()] || '1', 10),
        total: parseInt(response.headers['X-Total-Count'.toLowerCase()] || '0', 10),
        pageSize: parseInt(response.headers['X-Data-Per-Page'.toLowerCase()] || '10', 10)
      }
    }
    return Promise.resolve(response)
  },
  (error) => {
    endLoading()
    try {
      if (error.response.config.url.indexOf('build-date.html') >= 0) {
        return Promise.reject(error)
      }
    } catch (e) {
    }
    let authFail = false
    // 인증 토큰을 확인해야될 로직 추가
    let errorTitle = '오류'
    let errorMsg = '일시적인 오류가 발생하였습니다.<br />문제가 지속되면 관리자에게 문의부탁드립니다.'
    if (!error.response || error.response.status === 504 || error.message.indexOf('timeout') === 0) {
      errorMsg = '서버가 응답하고 있지 않습니다.<br />먼저 인터넷 연결을 확인해 주시고 문제가 계속되면 관리자에게 문의바랍니다.'
    } else if (error.response.status === 401) {
      errorTitle = '인증 불가'
      errorMsg = '인증 정보가 존재하지 않습니다.<br />다시 로그인 해 주세요.'
      if (error.response.data && error.response.data.msg) {
        errorMsg = error.response.data.msg
      }
      authFail = true
    } else if (error.response.status === 406) {
      errorMsg = '해당 요청에 대한 권한이 없습니다.'
    } else if (error.response.status === 400 && error.response.data && error.response.data.message) {
      errorMsg = error.response.data.message
    } else if (error.response.status === 422 && error.response.data && error.response.data.message) {
      errorMsg = error.response.data.message
    } else if (error.response.status === 403 && error.response.data && error.response.data.message) {
      errorTitle = '접근권한 오류'
      errorMsg = error.response.data.message
    }
    if (errorCount === 0) {
      errorCount++
      if (authFail) {
        store.dispatch('auth/logout')
        errorCount = 0
      } else {
        Vue.dialog.alert({
          title: errorTitle,
          body: errorMsg
        }).then(() => {
          errorCount = 0
        }).catch(() => {})
      }
    }
    return Promise.reject(error)
  }
)

/**
 * API 호출시 Progress 를 돌지 않도록 한다.
 */
service.disableProgress = function () {
  service.defaults.headers.Progress = false
}

export default service
