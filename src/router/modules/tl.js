import Full from '@/container/Full.vue'

// 재고 관리
const Stock = () => import('@/views/tl/stock/stock.vue')

// 재고 & 금액 관리
const StockSet = () => import('@/views/tl/stock/stockSet.vue')

// 객실 관리
const RoomType = () => import('@/views/tl/roomType/RoomType.vue')

// 사업장 관리
const Branch = () => import('@/views/tl/branch/Branch.vue')

// 예약 수동 관리
// const ReservationManual = () => import('@/views/tl/reservation/reservationManual/reservationManual.vue')

// 예약 오류 목록
// const ReservationError = () => import('@/views/tl/reservation/reservationError/reservationError.vue')

// 신규 예약 목록
// const ReservationInput = () => import('@/views/tl/reservation/reservationInput/reservationInput.vue')

// 예약 성공 목록
// const ReservationSuccess = () => import('@/views/tl/reservation/reservationSuccess/reservationSuccess.vue')

// 재고 전송이력
const SendStock = () => import('@/views/tl/sendStock/sendStock.vue')

// 요율 관리
const Rate = () => import('@/views/tl/rate/rate.vue')

// 회원번호 관리
const MemberNo = () => import('@/views/tl/memberNo/memberNo.vue')

// 금액 관리
const Price = () => import('@/views/tl/price/price.vue')

// 금액 전송이력
const SendPrice = () => import('@/views/tl/sendPrice/sendPrice.vue')

export default {
  path: '/tl',
  name: 'tl',
  component: Full,
  redirect: '/main',
  meta: {
    breadcrumb: 'TL'
  },
  children: [
    {
      path: 'stock',
      component: Stock,
      name: 'tl.stock',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '재고 관리',
        breadcrumb: 'Stock'
      }
    },
    {
      path: 'stockSet',
      component: StockSet,
      name: 'tl.stockSet',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '재고 & 금액 기초입력',
        breadcrumb: 'StockSet'
      }
    },
    {
      path: 'roomType',
      component: RoomType,
      name: 'tl.roomType',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '객실 관리',
        breadcrumb: 'RoomType'
      }
    },
    {
      path: 'branch',
      component: Branch,
      name: 'tl.branch',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '사업장 관리',
        breadcrumb: 'branch'
      }
    },
    // {
    //   path: 'reservation/reservationManual',
    //   component: ReservationManual,
    //   name: 'tl.reservationManual',
    //   meta: {
    //     auth: true,
    //     requiresAuth: true,
    //     title: '예약 수동 관리',
    //     breadcrumb: 'ReservationManual'
    //   }
    // },
    // {
    //   path: 'reservation/reservationError',
    //   component: ReservationError,
    //   name: 'tl.reservationError',
    //   meta: {
    //     auth: true,
    //     requiresAuth: true,
    //     title: '예약 오류 목록',
    //     breadcrumb: 'ReservationError'
    //   }
    // },
    // {
    //   path: 'reservation/reservationInput',
    //   component: ReservationInput,
    //   name: 'tl.reservationInput',
    //   meta: {
    //     auth: true,
    //     requiresAuth: true,
    //     title: '신규 예약 목록',
    //     breadcrumb: 'ReservationInput'
    //   }
    // },
    // {
    //   path: 'reservation/reservationSuccess',
    //   component: ReservationSuccess,
    //   name: 'tl.reservationSuccess',
    //   meta: {
    //     auth: true,
    //     requiresAuth: true,
    //     title: '예약 성공 목록',
    //     breadcrumb: 'ReservationSuccess'
    //   }
    // },
    {
      path: 'sendStock',
      component: SendStock,
      name: 'tl.sendStock',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '재고 전송이력',
        breadcrumb: 'SendStock'
      }
    },
    {
      path: 'rate',
      component: Rate,
      name: 'tl.rate',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '요율 관리',
        breadcrumb: 'Rate'
      }
    },
    {
      path: 'memberNo',
      component: MemberNo,
      name: 'tl.memberNo',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '회원번호 관리',
        breadcrumb: 'memberNo'
      }
    },
    {
      path: 'price',
      component: Price,
      name: 'tl.price',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '금액 관리',
        breadcrumb: 'Price'
      }
    },
    {
      path: 'sendPrice',
      component: SendPrice,
      name: 'tl.sendPrice',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '금액 전송이력',
        breadcrumb: 'SendPrice'
      }
    }
  ]
}
