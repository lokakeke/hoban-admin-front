import Full from 'Container/Full.vue'

// menu
const Menu = () => import('@/views/system/menu/Menu.vue')

// menu auth group
const menuAuthGroup = () => import('@/views/system/authentication/admin/AdminMenuAuthGroup.vue')

// 파트너 menu auth
const PartnerAuth = () =>
  import('@/views/system/authentication/partner/PartnerMenuAuthGroup.vue')

// account
const Account = () =>
  import('@/views/system/authentication/admin/AdminAccount.vue')

// 공통 코드
const CommonCode = () => import('@/views/system/commonCode/CommonCode.vue')

// 알림 설정
const Notification = () =>
  import('@/views/system/notification/Notification.vue')

// 문자 알림 설정
const SMSNotification = () =>
  import('@/views/system/notification/SMSNotification.vue')

// 내부 IP 관리
const Ip = () => import('@/views/system/ip/Ip.vue')

// 전체 알림 게시판
const NotificationBoard = () =>
  import('@/views/system/notification/NotificationBoard.vue')

// 예약 제한
const ReservationExcept = () =>
  import('@/views/system/reservationExcept/ReservationExcept.vue')

export default {
  path: '/system',
  name: 'system',
  component: Full,
  redirect: '/main',
  meta: {
    breadcrumb: 'System'
  },
  children: [
    {
      path: 'menu',
      component: Menu,
      name: 'menu',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '메뉴 관리',
        breadcrumb: 'Menu'
      }
    },
    {
      path: 'menuAuthGroup',
      component: menuAuthGroup,
      name: 'menuAuthGroup',
      meta: {
        auth: true,
        // requiresAuth: true,
        title: '메뉴 권한 관리',
        breadcrumb: 'Menu Auth'
      }
    },
    {
      path: 'account',
      component: Account,
      name: 'account',
      meta: {
        auth: true,
        title: '관리자 관리',
        checkPassword: false,
        breadcrumb: 'Account'
      }
    },
    {
      path: 'commonCode',
      component: CommonCode,
      name: 'commonCode',
      meta: {
        auth: true,
        title: '공통코드 관리',
        breadcrumb: 'Common Code'
      }
    },
    {
      path: 'notification',
      component: Notification,
      name: 'notification',
      meta: {
        auth: true,
        title: '알림 관리',
        breadcrumb: 'Notification'
      }
    },
    {
      path: 'smsNotification',
      component: SMSNotification,
      name: 'smsNotification',
      meta: {
        auth: true,
        title: '카카오 알림톡 관리',
        breadcrumb: 'SMS Notification'
      }
    },
    {
      path: 'partnerMenuAuth',
      component: PartnerAuth,
      name: 'partnerMenuAuth',
      meta: {
        auth: true,
        title: '파트너 메뉴권한 관리',
        breadcrumb: 'Partner Menu Auth '
      }
    },
    {
      path: 'ip',
      component: Ip,
      name: 'ip',
      meta: {
        auth: true,
        title: '내부 IP 관리',
        breadcrumb: 'Inbound Ip '
      }
    },
    {
      path: 'notificationBoard',
      component: NotificationBoard,
      name: 'notificationBoard',
      meta: {
        auth: true,
        requiresAuth: false,
        title: '전체 알림 게시판',
        breadcrumb: 'All Notification Board'
      }
    },
    {
      path: 'reservationExcept',
      component: ReservationExcept,
      name: 'reservationExcept',
      meta: {
        auth: true,
        title: '예약 제한',
        breadcrumb: 'Reservation Except'
      }
    }
  ]
}
