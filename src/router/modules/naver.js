import Full from '@/container/Full.vue'

// Booking
const Booking = () => import('@/views/naver/booking/Booking.vue')

// Booking Calendar
const BookingCalendar = () => import('@/views/naver/booking/BookingCalendarView.vue')

// Business
const Business = () => import('@/views/naver/business/Business.vue')

// Item
const Item = () => import('@/views/naver/item/Item.vue')

// Schedule
const Schedule = () => import('@/views/naver/schedule/Schedule.vue')

// ScheduleTemp
const ScheduleTemp = () => import('@/views/naver/schedule/ScheduleTemp.vue')

// SimpleSchedule
const SimpleSchedule = () => import('@/views/naver/schedule/SimpleSchedule.vue')

// naverToken
const NaverToken = () => import('@/views/naver/token/NaverToken.vue')

// ScheduleSend
const ScheduleSend = () => import('@/views/naver/scheduleSend/ScheduleSend.vue')

// RsvLog
const BookingLog = () => import('@/views/naver/bookingLog/BookingLog.vue')

// NaverApiLog
const NaverApiLogs = () => import('@/views/naver/log/NaverApiLogs.vue')

export default {
  path: '/naver',
  name: 'naver',
  component: Full,
  redirect: '/main',
  meta: {
    breadcrumb: '네이버'
  },
  children: [
    {
      path: 'business',
      component: Business,
      name: 'business',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '서비스 관리',
        breadcrumb: 'Business '
      }
    },
    {
      path: 'item',
      component: Item,
      name: 'item',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '상품 관리',
        breadcrumb: 'Item '
      }
    },
    {
      path: 'schedule',
      component: Schedule,
      name: 'schedule',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '일정 관리',
        breadcrumb: 'Schedule '
      }
    },
    {
      path: 'bookingCalendarView',
      component: BookingCalendar,
      name: 'bookingCalendarView',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '예약현황',
        breadcrumb: 'Booking Calendar View'
      }
    },
    {
      path: 'booking',
      component: Booking,
      name: 'booking',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '예약자 관리',
        breadcrumb: 'Booking '
      }
    },
    {
      path: 'scheduleTemp',
      component: ScheduleTemp,
      name: 'scheduleTemp',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '임시 일정 관리',
        breadcrumb: 'Schedule Temp '
      }
    },
    {
      path: 'simpleSchedule',
      component: SimpleSchedule,
      name: 'simpleSchedule',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '간단예약 관리',
        breadcrumb: 'Simple Schedule '
      }
    },
    {
      path: 'scheduleSend',
      component: ScheduleSend,
      name: 'scheduleSend',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '전송 이력',
        breadcrumb: 'Schedule Send'
      }
    },
    {
      path: 'bookingLog',
      component: BookingLog,
      name: 'bookingLog',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '예약 로그',
        breadcrumb: 'Rsv Log Calendar'
      }
    },
    {
      path: 'naverToken',
      component: NaverToken,
      name: 'naverToken',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '토큰 관리',
        breadcrumb: 'Naver Token '
      }
    },
    {
      path: 'naverApiLogs',
      component: NaverApiLogs,
      name: 'naverApiLogs',
      meta: {
        auth: true,
        requiresAuth: true,
        title: 'API 통신 이력 조회 (NAVER)',
        breadcrumb: 'Naver API Log'
      }
    }
  ]
}
