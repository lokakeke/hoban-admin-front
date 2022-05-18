import Full from '@/container/Full.vue'

// partner
const partner = () => import('@/views/partner/management/Partner.vue')

// 파트너 menu auth group
const PartnerMenuAuthGroup = () => import('@/views/partner/authentication/PartnerMenuAuthGroup.vue')

// deposit
const DepositAccount = () => import('@/views/partner/deposit/DepositAccount.vue')
const DepositTransaction = () => import('@/views/partner/deposit/DepositTransaction.vue')
const DepositFailure = () => import('@/views/partner/deposit/DepositFailure.vue')

// partner inventory rate
const partnerInventoryRate = () =>
  import('@/views/partner/inventory/PartnerInventoryRate.vue')

// partner inventory expect
const partnerInventoryExpect = () =>
  import('@/views/partner/inventory/PartnerInventoryExpect.vue')

// partner inventory detail set column
const partnerInventoryDetailSetCol = () =>
  import('@/views/partner/inventory/PartnerInventoryDetailSetCol.vue')

// partner inventory detail set row
const partnerInventoryDetailSetRow = () =>
  import('@/views/partner/inventory/PartnerInventoryDetailSetRow.vue')

// partner inventory rsv
const partnerInventoryRsv = () =>
  import('@/views/partner/inventory/PartnerInventoryRsv.vue')

// partner reservation app
const partnerReservationApp = () =>
  import('@/views/partner/reservation/PartnerReservationAppList.vue')

// partner package reservation app
const partnerPkgReservationApp = () =>
  import('@/views/partner/reservation/PartnerPkgReservationAppList.vue')

export default {
  path: '/ota/partner',
  name: 'partner',
  component: Full,
  redirect: '/main',
  meta: {
    breadcrumb: 'Partner'
  },
  children: [
    {
      path: '',
      component: partner,
      name: 'partner.partner',
      meta: {
        title: '파트너 등록관리',
        breadcrumb: 'Partner '
      }
    },
    {
      path: 'partnerMenuAuthGroup',
      component: PartnerMenuAuthGroup,
      name: 'partner.partnerMenuAuthGroup',
      meta: {
        auth: true,
        title: '파트너 메뉴권한 관리',
        breadcrumb: 'Partner Menu Auth '
      }
    },
    {
      path: 'depositAccount',
      component: DepositAccount,
      name: 'partner.depositAccount',
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
      name: 'partner.depositTransaction',
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
      name: 'partner.depositFailure',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '예치금 입출금 실패이력 조회',
        breadcrumb: 'Deposit Failure '
      }
    },
    {
      path: 'partnerInventoryRate',
      component: partnerInventoryRate,
      name: 'partner.partnerInventoryRate',
      meta: {
        title: '파트너 재고예약 비율관리',
        breadcrumb: 'Partner Inventory Rate'
      }
    },
    {
      path: 'partnerInventoryExpect',
      component: partnerInventoryExpect,
      name: 'partner.partnerInventoryExpect',
      meta: {
        title: '파트너 재고예약 예상내역',
        breadcrumb: 'Partner Inventory Expect'
      }
    },
    {
      path: 'partnerInventoryDetailSetCol',
      component: partnerInventoryDetailSetCol,
      name: 'partner.partnerInventoryDetailSetCol',
      meta: {
        title: '파트너 재고예약 상세할당 (세로)',
        breadcrumb: 'Partner Inventory Detail Set Column'
      }
    },
    {
      path: 'partnerInventoryDetailSetRow',
      component: partnerInventoryDetailSetRow,
      name: 'partner.partnerInventoryDetailSetRow',
      meta: {
        title: '파트너 재고예약 상세할당 (가로)',
        breadcrumb: 'Partner Inventory Detail Set Row'
      }
    },
    {
      path: 'partnerInventoryRsv',
      component: partnerInventoryRsv,
      name: 'partner.partnerInventoryRsv',
      meta: {
        title: '파트너 재고예약 리스트',
        breadcrumb: 'Partner Inventory Reservation List'
      }
    },
    {
      path: 'partnerReservationApp',
      component: partnerReservationApp,
      name: 'partner.partnerReservationApp',
      meta: {
        title: '파트너 객실예약 신청 리스트',
        breadcrumb: 'Partner Reservation Apply List'
      }
    },
    {
      path: 'partnerPkgReservationApp',
      component: partnerPkgReservationApp,
      name: 'partner.partnerPkgReservationApp',
      meta: {
        title: '파트너 패키지예약 신청 리스트',
        breadcrumb: 'Partner Package Reservation Apply List'
      }
    }
  ]
}
