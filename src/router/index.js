// Routes - 중간 모듈단위로 import 하여 사용
import MainRoutes from './modules/main'
import SystemRoutes from './modules/system'
import SocialRoutes from './modules/social'
import OtaRoutes from './modules/ota'
import ApiRoutes from './modules/serviceApi'
import PartnerRoutes from './modules/partner'
import NaverRoutes from './modules/naver'
import TlRoutes from './modules/tl'
import UserSystemRoutes from './modules/userSystem'

import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

// session components
const Login = () => import('@/views/common/Login.vue')
const LoginPartner = () => import('@/views/common/LoginPartner.vue')

// Error components
const error404 = () => import('@/views/common/404.vue')

Vue.use(Router)

/**
 * 메뉴 meta 셋팅에 따른 설명 (모든 타입은 boolean)
 *
 *  1. auth: 로그인 여부 체크 ( 로그인이 되어있으면 접근할 수 없는 경우 false 아닐경우 모두 체크 )
 *  2. requiresAuth: 메뉴 접근권한 여부 체크 ( main 메뉴 같이 메뉴접근권한이 필요 없는경우 false 아닐경우 모두 체크 )
 *  3 checkPassword: 메뉴 접근 전 비밀번호 확인이 필요한 경우 체크 ( true 인 경우만 비밀번호 확인 창 노출 아닐 경우 체크 안함 )
 */

export default new Router({
  mode: 'history',
  routes: [
    MainRoutes,
    SystemRoutes,
    SocialRoutes,
    OtaRoutes,
    ApiRoutes,
    PartnerRoutes,
    NaverRoutes,
    TlRoutes,
    UserSystemRoutes,
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        auth: false,
        requiresAuth: false
      }
    },
    {
      path: '/partnerLogin',
      name: 'partnerLogin',
      component: LoginPartner,
      meta: {
        auth: false,
        requiresAuth: false
      }
    },
    {
      path: '/404',
      name: '404',
      component: error404,
      meta: {
        requiresAuth: false
      }
    },
    // entry 페이지 : 시스템 메인대시보드
    { path: '/', redirect: '/main' },
    // router 에 등록되지 않은 404 페이지 : 시스템 error 404
    { path: '*', redirect: '/404' }
  ]
})
