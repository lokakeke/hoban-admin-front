import Full from '@/container/Full.vue'

// register
const Ticket = () => import('@/views/social/register/Ticket.vue')

// reservation
const history = () =>
  import('@/views/social/reservation/TicketHistory.vue')
const ticketing = () =>
  import('@/views/social/reservation/TicketingUpdate.vue')
const status = () =>
  import('@/views/social/reservation/StatusTicket.vue')
const dgnsTicket = () =>
  import('@/views/social/reservation/DgnsTicket.vue')

// deposit
const depositAccount = () =>
  import('@/views/partner/deposit/DepositAccount.vue')
const depositTransaction = () =>
  import('@/views/partner/deposit/DepositTransaction.vue')
const depositFailure = () =>
  import('@/views/partner/deposit/DepositFailure.vue')
const calculate = () =>
  import('@/views/social/calculate/Calculate.vue')
const calculateHistory = () =>
  import('@/views/social/calculate/CalculateHistory.vue')

// statistics
const kpi = () => import('@/views/social/statistics/Kpi.vue')
const statistics = () => import('@/views/social/statistics/SocialStatistics.vue')
const totalStatistics = () =>
  import('@/views/social/statistics/TotalStatistics.vue')

// errorGuidance
const errorGuidance = () => import('@/views/ota/api/error/ErrorGuidance.vue')

export default {
  path: '/social',
  name: 'social',
  component: Full,
  redirect: '/main',
  meta: {
    breadcrumb: 'Social'
  },
  children: [
    {
      path: 'ticket',
      component: Ticket,
      name: 'social.ticket',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '우대번호 등록관리',
        breadcrumb: 'Pvl Ticket '
      }
    },
    {
      path: 'ticketHistory',
      component: history,
      name: 'social.ticketHistory',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '우대번호 거래내역 조회',
        breadcrumb: 'Pvl Ticket History'
      }
    },
    {
      path: 'ticketingUpdate',
      component: ticketing,
      name: 'social.ticketingUpdate',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '우대번호 발권 변경',
        breadcrumb: 'Ticketing Update'
      }
    },
    {
      path: 'statusTicket',
      component: status,
      name: 'social.statusTicket',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '판매중/종료예정/종료 별 우대번호 조회',
        breadcrumb: 'Status Ticket '
      }
    },
    {
      path: 'dgnsTicket',
      component: dgnsTicket,
      name: 'social.dgnsTicket',
      meta: {
        auth: true,
        requiresAuth: true,
        title: 'DGNS 우대번호 조회',
        breadcrumb: 'Dgns Ticket '
      }
    },
    {
      path: 'depositAccount',
      component: depositAccount,
      name: 'social.depositAccount',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '예치금 계좌 관리',
        breadcrumb: 'Deposit Account '
      }
    },
    {
      path: 'depositTransaction',
      component: depositTransaction,
      name: 'social.depositTransaction',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '예치금 입출금 관리',
        breadcrumb: 'Deposit Transaction '
      }
    },
    {
      path: 'depositFailure',
      component: depositFailure,
      name: 'social.depositFailure',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '예치금 입출금 실패이력 조회',
        breadcrumb: 'Deposit Failure '
      }
    },
    {
      path: 'calculate',
      component: calculate,
      name: 'social.calculate',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '정산 관리',
        breadcrumb: 'Calculate '
      }
    },
    {
      path: 'calculateHistory',
      component: calculateHistory,
      name: 'social.calculateHistory',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '이전 정산 이력',
        breadcrumb: 'Calculate History'
      }
    },
    {
      path: 'kpi',
      component: kpi,
      name: 'social.kpi',
      meta: {
        auth: true,
        requiresAuth: true,
        title: 'KPI 관리',
        breadcrumb: 'Kpi '
      }
    },
    {
      path: 'statistics',
      component: statistics,
      name: 'social.statistics',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '카테고리별 통계',
        breadcrumb: 'Statistics'
      }
    },
    {
      path: 'totalStatistics',
      component: totalStatistics,
      name: 'social.totalStatistics',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '전체 통계',
        breadcrumb: 'Total Statistics'
      }
    },
    {
      path: 'errorGuidance',
      component: errorGuidance,
      name: 'social.errorGuidance',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '오류 추천',
        breadcrumb: 'Error Guidance'
      }
    }
  ]
}
