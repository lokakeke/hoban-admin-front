import Full from '@/container/Full.vue'

// API 서비스 등록관리
const service = () => import('@/views/ota/api/service/Service.vue')
const apiLogs = () => import('@/views/ota/api/logs/ApiLogs.vue')
const reservationLogs = () => import('@/views/ota/api/logs/ReservationApiLogs.vue')
const naverApiLogs = () => import('@/views/ota/api/logs/NaverApiLogs')
const resultCode = () => import('@/views/ota/api/resultCode/resultCode.vue')
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
      path: 'apiLogs',
      component: apiLogs,
      name: 'serviceApi.logs',
      meta: {
        auth: true,
        requiresAuth: true,
        title: 'API 이력관리',
        breadcrumb: 'API Logs '
      }
    },
    {
      path: 'reservations',
      component: reservationLogs,
      name: 'serviceApi.reservationLogs',
      meta: {
        auth: true,
        requiresAuth: true,
        title: 'API 예약 이력관리',
        breadcrumb: 'API Reservation Logs '
      }
    },
    {
      path: 'naverApiLogs',
      component: naverApiLogs,
      name: 'serviceApi.naverApiLogs',
      meta: {
        auth: true,
        requiresAuth: true,
        title: 'Naver API 예약 이력관리',
        breadcrumb: 'Naver API Reservation Logs '
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
