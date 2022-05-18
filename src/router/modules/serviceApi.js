import Full from '@/container/Full.vue'

// API 서비스 등록관리
const service = () => import('@/views/ota/api/service/Service.vue')
const history = () => import('@/views/ota/api/history/History.vue')
const reservationHistory = () =>
  import('@/views/ota/api/history/ReservationHistory.vue')
const resultCode = () =>
  import('@/views/ota/api/resultCode/resultCode.vue')
const serviceApi = () => import('@/views/ota/api/service/Api.vue')

export default {
  path: '/serviceApi',
  name: 'serviceApi',
  component: Full,
  redirect: '/main',
  meta: {
    breadcrumb: 'serviceApi'
  },
  children: [
    {
      path: 'service',
      component: service,
      name: 'serviceApi.service',
      meta: {
        auth: true,
        requiresAuth: true,
        title: 'API 서비스 등록관리',
        breadcrumb: 'API Service '
      }
    },
    {
      path: 'history',
      component: history,
      name: 'serviceApi.history',
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
      name: 'serviceApi.reservationHistory',
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
      name: 'serviceApi.resultCode',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '결과 코드 조회',
        breadcrumb: 'API Result Code '
      }
    },
    {
      path: 'openApi',
      component: serviceApi,
      name: 'serviceApi.serviceApi',
      meta: {
        auth: true,
        requiresAuth: true,
        title: 'API 오픈관리',
        breadcrumb: 'API '
      }
    }
  ]
}
