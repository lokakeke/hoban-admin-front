import Full from '@/container/Full.vue'

// partner
const partner = () => import('@/views/partner/management/Partner.vue')

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
  path: '/partner',
  name: 'partner',
  component: Full,
  redirect: '/main',
  meta: {
    breadcrumb: 'Partner'
  },
  children: [
    {
      path: 'partner',
      component: partner,
      name: 'partner.partner',
      meta: {
        title: '파트너 등록관리',
        breadcrumb: 'Partner '
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
