import Full from '@/container/Full.vue'

// 공지사항
const BoardNotice = () => import('@/views/ota/board/notice/BoardNotice.vue')
const BoardNoticeView = () => import('@/views/ota/board/notice/BoardNoticeView.vue')

// room
const Room = () => import('@/views/ota/room/RoomType.vue')

// package
const Package = () => import('@/views/ota/package/RoomPackage.vue')

// room reservation
const RoomReservation = () => import('@/views/ota/roomReservation/RoomReservation.vue')

// room reservation cancel
const MultipleRsvCancel = () => import('@/views/ota/roomReservation/MultipleRsvCancel.vue')

// 객실 예약 신청
const RoomReservationApply = () => import('@/views/partner/reservation/PartnerReservationAppList.vue')

// 패키지 예약 신청
const PackageReservationApply = () => import('@/views/partner/reservation/PartnerPkgReservationAppList.vue')


export default {
  path: '/ota',
  name: 'ota',
  component: Full,
  redirect: '/main',
  meta: {
    breadcrumb: 'OTA'
  },
  children: [
    {
      path: 'boardNotice',
      component: BoardNotice,
      name: 'ota.boardNotice',
      meta: {
        auth: true,
        title: '공지사항',
        breadcrumb: 'Notice'
      }
    },
    {
      path: 'boardNotice/:noticeSeq',
      component: BoardNoticeView,
      name: 'ota.boardNotice.view',
      props: true,
      meta: {
        auth: true,
        title: '공지사항 조회',
        breadcrumb: 'Notice'
      }
    },
    {
      path: 'roomType',
      component: Room,
      name: 'ota.roomType',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '객실 등록관리',
        breadcrumb: 'RoomType'
      }
    },
    {
      path: 'roomPackage',
      component: Package,
      name: 'ota.roomPackage',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '패키지 등록관리',
        breadcrumb: 'RoomPackage'
      }
    },
    {
      path: 'roomReservation',
      component: RoomReservation,
      name: 'ota.roomReservation',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '객실예약관리',
        breadcrumb: 'roomReservation'
      }
    },
    {
      path: 'multipleRsvCancel',
      component: MultipleRsvCancel,
      name: 'ota.multipleRsvCancel',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '다중예약취소',
        breadcrumb: 'multipleRsvCancel'
      }
    },
    {
      path: 'roomReservationApply',
      component: RoomReservationApply,
      name: 'ota.roomReservationApply',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '객실예약신청',
        breadcrumb: 'roomReservationApply'
      }
    },
    {
      path: 'packageReservationApply',
      component: PackageReservationApply,
      name: 'ota.packageReservationApply',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '패키지예약신청',
        breadcrumb: 'packageReservationApply'
      }
    }
  ]
}
