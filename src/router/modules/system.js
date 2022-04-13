import Full from '@/container/Full.vue'

// menu
const Menu = () => import('@/views/system/menu/Menu.vue')

// 관리자 menu auth group
const AdminMenuAuthGroup = () => import('@/views/system/authentication/admin/AdminMenuAuthGroup.vue')

// 파트너 menu auth group
const PartnerMenuAuthGroup = () =>
  import('@/views/system/authentication/partner/PartnerMenuAuthGroup.vue')

// account
const Account = () =>
  import('@/views/system/authentication/admin/AdminAccount.vue')

// 공통 코드
const CommonCode = () => import('@/views/system/commonCode/CommonCode.vue')

// 알림 설정
const Message = () =>
  import('@/views/system/message/Message.vue')

// 문자 알림 설정
const SMSNotification = () =>
  import('@/views/system/message/SMSNotification.vue')

// 내부 IP 관리
const Ip = () => import('@/views/system/ip/Ip.vue')

// 전체 알림 게시판
const MessageBoard = () =>
  import('@/views/system/message/MessageBoard.vue')

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
      path: 'adminMenuAuthGroup',
      component: AdminMenuAuthGroup,
      name: 'adminMenuAuthGroup',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '어드민 메뉴 권한 관리',
        breadcrumb: 'Admin Menu Auth'
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
      path: 'message',
      component: Message,
      name: 'message',
      meta: {
        auth: true,
        title: '메시지 관리',
        breadcrumb: 'Message'
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
      path: 'partnerMenuAuthGroup',
      component: PartnerMenuAuthGroup,
      name: 'partnerMenuAuthGroup',
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
      path: 'messageBoard',
      component: MessageBoard,
      name: 'messageBoard',
      meta: {
        auth: true,
        requiresAuth: false,
        title: '전체 메시지 게시판',
        breadcrumb: 'All Message Board'
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
