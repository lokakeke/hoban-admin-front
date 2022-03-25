import Full from 'Container/Full.vue'

// menu
const Menu = () => import('Views/system/menu/MenuManagement.vue')

// menu auth
const MenuAuth = () => import('Views/system/menu/MenuAuthGroupManagement.vue')

// 파크너 menu auth
const PartnerAuth = () =>
  import('Views/partner/menu/PartnerMenuAuthManagement.vue')

// account
const AccountManagement = () =>
  import('Views/system/account/AccountManagement.vue')

// 공통 코드
const CommonCode = () => import('Views/system/commonCode/CommonCode.vue')

// 알림 설정
const Notification = () =>
  import('Views/system/notification/NotificationManagement.vue')

// 문자 알림 설정
const SMSNotification = () =>
  import('Views/system/notification/SMSNotificationManagement.vue')

// 내부 IP 관리
const IpManagement = () => import('Views/system/ip/IpManagement.vue')

// 전체 알림 게시판
const NotificationBoard = () =>
  import('Views/system/notification/NotificationBoard.vue')

// 예약 제한
const ReservationExcept = () =>
  import('Views/system/reservationExcept/ReservationExcept.vue')

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
      path: 'menuManagement',
      component: Menu,
      name: 'menuManagement',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '메뉴 관리',
        breadcrumb: 'Menu Management'
      }
    },
    {
      path: 'menuAuthManagement',
      component: MenuAuth,
      name: 'menuAuthManagement',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '메뉴 권한 관리',
        breadcrumb: 'Menu Auth Management'
      }
    },
    {
      path: 'accountManagement',
      component: AccountManagement,
      name: 'accountManagement',
      meta: {
        auth: true,
        title: '관리자 관리',
        checkPassword: false,
        breadcrumb: 'Account Management'
      }
    },
    {
      path: 'commonCodeManagement',
      component: CommonCode,
      name: 'commonCodeManagement',
      meta: {
        auth: true,
        title: '공통코드 관리',
        breadcrumb: 'Common Code Management'
      }
    },
    {
      path: 'notificationManagement',
      component: Notification,
      name: 'notificationManagement',
      meta: {
        auth: true,
        title: '알림 관리',
        breadcrumb: 'Notification Management'
      }
    },
    {
      path: 'smsNotificationManagement',
      component: SMSNotification,
      name: 'smsNotificationManagement',
      meta: {
        auth: true,
        title: '카카오 알림톡 관리',
        breadcrumb: 'SMS Notification Management'
      }
    },
    {
      path: 'partnerMenuAuthManagement',
      component: PartnerAuth,
      name: 'partnerMenuAuthManagement',
      meta: {
        auth: true,
        title: '파트너 메뉴권한 관리',
        breadcrumb: 'Partner Menu Auth Management'
      }
    },
    {
      path: 'ipManagement',
      component: IpManagement,
      name: 'ipManagement',
      meta: {
        auth: true,
        title: '내부 IP 관리',
        breadcrumb: 'Inbound Ip Management'
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
