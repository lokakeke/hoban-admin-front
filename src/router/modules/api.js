import Full from 'Container/Full.vue'

// API 서비스 등록관리
const service = () => import('@/views/api/service/Service.vue')
const naver = () => import('@/views/api/history/NaverHistory.vue')
const history = () => import('@/views/api/history/History.vue')
const reservationHistory = () =>
  import('@/views/api/history/ReservationHistory.vue')
const resultCode = () =>
  import('@/views/api/resultCode/resultCode.vue')
const api = () => import('@/views/api/service/Api.vue')

export default {
  path: '/apiService',
  name: 'api',
  component: Full,
  redirect: '/main',
  meta: {
    breadcrumb: 'Api'
  },
  children: [
    {
      path: 'service',
      component: service,
      name: 'service',
      meta: {
        auth: true,
        requiresAuth: true,
        title: 'API 서비스 등록관리',
        breadcrumb: 'API Service '
      }
    },
    {
      path: 'naverHistory',
      component: naver,
      name: 'naverHistory',
      meta: {
        auth: true,
        requiresAuth: true,
        title: 'NAVER API 이력관리',
        breadcrumb: 'NAVER API History '
      }
    },
    {
      path: 'history',
      component: history,
      name: 'history',
      meta: {
        auth: true,
        requiresAuth: true,
        title: 'API 이력관리',
        breadcrumb: 'API History '
      }
    },
    {
      path: 'reservationHistory',
      component: reservationHistory,
      name: 'reservationHistory',
      meta: {
        auth: true,
        requiresAuth: true,
        title: 'API 예약 이력관리',
        breadcrumb: 'API Reservation History '
      }
    },
    {
      path: 'resultCode',
      component: resultCode,
      name: 'resultCode',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '결과 코드 조회',
        breadcrumb: 'API Result Code '
      }
    },
    {
      path: 'api',
      component: api,
      name: 'api',
      meta: {
        auth: true,
        requiresAuth: true,
        title: 'API 오픈관리',
        breadcrumb: 'API '
      }
    }
  ]
}
