import Full from 'Container/Full.vue'

// room
const Room = () => import('Views/ota/room/RoomTypeManagement.vue')

// package
const Package = () => import('Views/ota/package/RoomPackageManagement.vue')

// room reservation
const RoomReservation = () =>
  import('Views/ota/roomReservation/RoomReservationManagement.vue')

// room reservation cancel
const MultipleRsvCancel = () =>
  import('Views/ota/roomReservation/MultipleRsvCancel.vue')

// deposit
const depositAccount = () =>
  import('Views/api/deposit/DepositAccountManagement.vue')
const depositTransaction = () =>
  import('Views/api/deposit/DepositTransactionManagement.vue')
const depositFailure = () =>
  import('Views/api/deposit/DepositFailureManagement.vue')

// commission
const commissionBasic = () =>
  import('Views/ota/commission/CommissionBasicManagement.vue')
const commissionPromotion = () =>
  import('Views/ota/commission/CommissionPromotionManagement.vue')

// calculation
const calculation = () =>
  import('Views/ota/calculation/CalculateManagement.vue')
const calculationPackage = () =>
  import('Views/ota/calculation/PackageCalculateManagement.vue')
const calculationRoomType = () =>
  import('Views/ota/calculation/RoomTypeCalculateManagement.vue')
const calculationPenaltyRule = () =>
  import('Views/ota/calculation/PenaltyRuleManagement.vue')
const calculationDay = () => import('Views/ota/calculation/DayManagement.vue')
const calculationMenu = () =>
  import('Views/ota/calculation/MenuManagement.vue')
const partnerCalculationStatus = () =>
  import('Views/ota/calculation/PartnerCalculationStatus.vue')
const monthlyUsedCalculation = () =>
  import('Views/ota/calculation/MonthlyUsedCalculation.vue')
const calculateComparativeContrast = () =>
  import('Views/ota/calculation/CalculateComparativeContrast.vue')

// errorGuidance
const errorGuidance = () => import('Views/api/error/ErrorGuidance.vue')

// request
const partnerRequest = () => import('Views/partner/request/PartnerRequest.vue')

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
      path: 'roomTypeManagement',
      component: Room,
      name: 'ota.roomTypeManagement',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '객실(Room Only) 등록관리',
        breadcrumb: 'RoomTypeManagement'
      }
    },
    {
      path: 'roomPackageManagement',
      component: Package,
      name: 'ota.roomPackageManagement',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '객실(PKG) 등록관리',
        breadcrumb: 'RoomPackageManagement'
      }
    },
    {
      path: 'roomReservationManagement',
      component: RoomReservation,
      name: 'ota.roomReservationManagement',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '객실예약관리',
        breadcrumb: 'roomReservationManagement'
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
      path: 'depositAccountManagement',
      component: depositAccount,
      name: 'ota.depositAccountManagement',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '예치금 계좌 관리',
        breadcrumb: 'Deposit Account Management'
      }
    },
    {
      path: 'depositTransactionManagement',
      component: depositTransaction,
      name: 'ota.depositTransactionManagement',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '예치금 입출금 관리',
        breadcrumb: 'Deposit Transaction Management'
      }
    },
    {
      path: 'depositFailureManagement',
      component: depositFailure,
      name: 'ota.depositFailureManagement',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '예치금 입출금 실패이력 조회',
        breadcrumb: 'Deposit Failure Management'
      }
    },
    {
      path: 'calculateManagement',
      component: calculation,
      name: 'ota.calculateManagement',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '정산',
        breadcrumb: 'Calculate Management'
      }
    },
    {
      path: 'packageCalculateManagement',
      component: calculationPackage,
      name: 'ota.packageCalculateManagement',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '패키지 정산',
        breadcrumb: 'Package Calculate Management'
      }
    },
    {
      path: 'roomTypeCalculateManagement',
      component: calculationRoomType,
      name: 'ota.roomTypeCalculateManagement',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '객실 정산',
        breadcrumb: 'RoomType Calculate Management'
      }
    },
    {
      path: 'commissionBasicManagement',
      component: commissionBasic,
      name: 'ota.commissionBasicManagement',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '기본 수수료 관리',
        breadcrumb: 'Commission Basic Management'
      }
    },
    {
      path: 'commissionPromotionManagement',
      component: commissionPromotion,
      name: 'ota.commissionPromotionManagement',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '프로모션 수수료 관리',
        breadcrumb: 'Commission Promotion Management'
      }
    },
    {
      path: 'penaltyRuleManagement',
      component: calculationPenaltyRule,
      name: 'ota.penaltyRuleManagement',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '위약 규정 관리',
        breadcrumb: 'Penalty Rule Management'
      }
    },
    {
      path: 'dayManagement',
      component: calculationDay,
      name: 'ota.dayManagement',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '정산 일자 관리',
        breadcrumb: 'Caculation Day Management'
      }
    },
    {
      path: 'menuManagement',
      component: calculationMenu,
      name: 'ota.menuManagement',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '정산 메뉴 관리',
        breadcrumb: 'Caculation Menu Management'
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
