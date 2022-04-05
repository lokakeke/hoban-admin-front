import Full from 'Container/Full.vue'

// room
const Room = () => import('@/views/ota/room/RoomType.vue')

// package
const Package = () => import('@/views/ota/package/RoomPackage.vue')

// room reservation
const RoomReservation = () =>
  import('@/views/ota/roomReservation/RoomReservation.vue')

// room reservation cancel
const MultipleRsvCancel = () =>
  import('@/views/ota/roomReservation/MultipleRsvCancel.vue')

// deposit
const depositAccount = () =>
  import('@/views/api/deposit/DepositAccount.vue')
const depositTransaction = () =>
  import('@/views/api/deposit/DepositTransaction.vue')
const depositFailure = () =>
  import('@/views/api/deposit/DepositFailure.vue')

// commission
const commissionBasic = () =>
  import('@/views/ota/commission/CommissionBasic.vue')
const commissionPromotion = () =>
  import('@/views/ota/commission/CommissionPromotion.vue')

// calculation
const calculation = () =>
  import('@/views/ota/calculation/Calculate.vue')
const calculationPackage = () =>
  import('@/views/ota/calculation/PackageCalculate.vue')
const calculationRoomType = () =>
  import('@/views/ota/calculation/RoomTypeCalculate.vue')
const calculationPenaltyRule = () =>
  import('@/views/ota/calculation/PenaltyRule.vue')
const calculationDay = () => import('@/views/ota/calculation/Day.vue')
const calculationMenu = () =>
  import('@/views/ota/calculation/Menu.vue')
const partnerCalculationStatus = () =>
  import('@/views/ota/calculation/PartnerCalculationStatus.vue')
const monthlyUsedCalculation = () =>
  import('@/views/ota/calculation/MonthlyUsedCalculation.vue')
const calculateComparativeContrast = () =>
  import('@/views/ota/calculation/CalculateComparativeContrast.vue')

// errorGuidance
const errorGuidance = () => import('@/views/api/error/ErrorGuidance.vue')

// request
const partnerRequest = () => import('@/views/partner/request/PartnerRequest.vue')

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
      path: 'roomType',
      component: Room,
      name: 'ota.roomType',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '객실(Room Only) 등록관리',
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
        title: '객실(PKG) 등록관리',
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
      path: 'depositAccount',
      component: depositAccount,
      name: 'ota.depositAccount',
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
      name: 'ota.depositTransaction',
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
      name: 'ota.depositFailure',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '예치금 입출금 실패이력 조회',
        breadcrumb: 'Deposit Failure '
      }
    },
    {
      path: 'calculate',
      component: calculation,
      name: 'ota.calculate',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '정산',
        breadcrumb: 'Calculate '
      }
    },
    {
      path: 'packageCalculate',
      component: calculationPackage,
      name: 'ota.packageCalculate',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '패키지 정산',
        breadcrumb: 'Package Calculate '
      }
    },
    {
      path: 'roomTypeCalculate',
      component: calculationRoomType,
      name: 'ota.roomTypeCalculate',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '객실 정산',
        breadcrumb: 'RoomType Calculate '
      }
    },
    {
      path: 'commissionBasic',
      component: commissionBasic,
      name: 'ota.commissionBasic',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '기본 수수료 관리',
        breadcrumb: 'Commission Basic '
      }
    },
    {
      path: 'commissionPromotion',
      component: commissionPromotion,
      name: 'ota.commissionPromotion',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '프로모션 수수료 관리',
        breadcrumb: 'Commission Promotion '
      }
    },
    {
      path: 'penaltyRule',
      component: calculationPenaltyRule,
      name: 'ota.penaltyRule',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '위약 규정 관리',
        breadcrumb: 'Penalty Rule '
      }
    },
    {
      path: 'day',
      component: calculationDay,
      name: 'ota.day',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '정산 일자 관리',
        breadcrumb: 'Caculation Day '
      }
    },
    {
      path: 'menu',
      component: calculationMenu,
      name: 'ota.menu',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '정산 메뉴 관리',
        breadcrumb: 'Caculation Menu '
      }
    },
    {
      path: 'partnerCalculationStatus',
      component: partnerCalculationStatus,
      name: 'ota.partnerCalculationStatus',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '파트너 정산 현황',
        breadcrumb: 'Partner Calculation Status'
      }
    },
    {
      path: 'monthlyUsedCalculation',
      component: monthlyUsedCalculation,
      name: 'ota.monthlyUsedCalculation',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '월별 이용 내역',
        breadcrumb: 'Monthly Used Calculation'
      }
    },
    {
      path: 'errorGuidance',
      component: errorGuidance,
      name: 'ota.errorGuidance',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '오류 추천',
        breadcrumb: 'Error Guidance'
      }
    },
    {
      path: 'partnerRequest',
      component: partnerRequest,
      name: 'ota.partnerRequest',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '위약환불신청',
        breadcrumb: 'Partner Request'
      }
    },
    {
      path: 'calculateComparativeContrast',
      component: calculateComparativeContrast,
      name: 'ota.calculateComparativeContrast',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '정산 비교/대조',
        breadcrumb: 'Calculate Comparative Contrast'
      }
    }
  ]
}
