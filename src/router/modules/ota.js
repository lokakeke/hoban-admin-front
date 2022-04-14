import Full from '@/container/Full.vue'

// room
const Room = () => import('@/views/ota/room/RoomType.vue')

// package
const Package = () => import('@/views/ota/package/RoomPackage.vue')

// room reservation
const RoomReservation = () => import('@/views/ota/roomReservation/RoomReservation.vue')

// room reservation cancel
const MultipleRsvCancel = () => import('@/views/ota/roomReservation/MultipleRsvCancel.vue')

// deposit
const DepositAccount = () => import('@/views/api/deposit/DepositAccount.vue')
const DepositTransaction = () => import('@/views/api/deposit/DepositTransaction.vue')
const DepositFailure = () => import('@/views/api/deposit/DepositFailure.vue')

// commission
const CommissionBasic = () => import('@/views/ota/commission/CommissionBasic.vue')
const CommissionPromotion = () => import('@/views/ota/commission/CommissionPromotion.vue')

// calculation
const Calculation = () => import('@/views/ota/calculation/Calculate.vue')
const CalculationPackage = () => import('@/views/ota/calculation/PackageCalculate.vue')
const CalculationRoomType = () => import('@/views/ota/calculation/RoomTypeCalculate.vue')
const CalculationPenaltyRule = () => import('@/views/ota/calculation/PenaltyRule.vue')
const CalculationDay = () => import('@/views/ota/calculation/CalculationDay.vue')
const CalculationMenu = () => import('@/views/ota/calculation/CalculationMenu.vue')
const PartnerCalculationStatus = () => import('@/views/ota/calculation/PartnerCalculationStatus.vue')
const MonthlyUsedCalculation = () => import('@/views/ota/calculation/MonthlyUsedCalculation.vue')
const CalculateComparativeContrast = () => import('@/views/ota/calculation/CalculateComparativeContrast.vue')

// errorGuidance
const ErrorGuidance = () => import('@/views/api/error/ErrorGuidance.vue')

// request
const PartnerRequest = () => import('@/views/partner/request/PartnerRequest.vue')

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
      component: DepositAccount,
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
      component: DepositTransaction,
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
      component: DepositFailure,
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
      component: Calculation,
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
      component: CalculationPackage,
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
      component: CalculationRoomType,
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
      component: CommissionBasic,
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
      component: CommissionPromotion,
      name: 'ota.commissionPromotion',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '프로모션 수수료 관리',
        breadcrumb: 'Commission Promotion '
      }
    },
    {
      path: 'calculationPenaltyRule',
      component: CalculationPenaltyRule,
      name: 'ota.calculationPenaltyRule',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '위약 규정 관리',
        breadcrumb: 'Penalty Rule '
      }
    },
    {
      path: 'calculationDay',
      component: CalculationDay,
      name: 'ota.calculationDay',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '정산 일자 관리',
        breadcrumb: 'Caculation Day '
      }
    },
    {
      path: 'calculationMenu',
      component: CalculationMenu,
      name: 'ota.calculationMenu',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '정산 메뉴 관리',
        breadcrumb: 'Calculation Menu '
      }
    },
    {
      path: 'partnerCalculationStatus',
      component: PartnerCalculationStatus,
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
      component: MonthlyUsedCalculation,
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
      component: ErrorGuidance,
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
      component: PartnerRequest,
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
      component: CalculateComparativeContrast,
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
