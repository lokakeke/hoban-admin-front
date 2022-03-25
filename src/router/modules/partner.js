import Full from "Container/Full.vue";

// partner
const partner = () => import("Views/partner/management/PartnerManagement.vue");

// partner inventory rate
const partnerInventoryRate = () =>
    import("Views/partner/inventory/PartnerInventoryRate.vue");

// partner inventory expect
const partnerInventoryExpect = () =>
    import("Views/partner/inventory/PartnerInventoryExpect.vue");

// partner inventory detail set column
const partnerInventoryDetailSetCol = () =>
    import("Views/partner/inventory/PartnerInventoryDetailSetCol.vue");

// partner inventory detail set row
const partnerInventoryDetailSetRow = () =>
    import("Views/partner/inventory/PartnerInventoryDetailSetRow.vue");

// partner inventory rsv
const partnerInventoryRsv = () =>
    import("Views/partner/inventory/PartnerInventoryRsv.vue");

// partner reservation app
const partnerReservationApp = () =>
    import("Views/partner/reservation/PartnerReservationAppList.vue");

// partner package reservation app
const partnerPkgReservationApp = () =>
    import("Views/partner/reservation/PartnerPkgReservationAppList.vue");

export default {
    path: "/partner",
    name: "partner",
    component: Full,
    redirect: "/main",
    meta: {
        breadcrumb: "Partner",
    },
    children: [
        {
            path: "partnerManagement",
            component: partner,
            name: "partnerManagement",
            meta: {
                title: "파트너 등록관리",
                breadcrumb: "Partner Management",
            },
        },
        {
            path: "partnerInventoryRate",
            component: partnerInventoryRate,
            name: "partnerInventoryRate",
            meta: {
                title: "파트너 재고예약 비율관리",
                breadcrumb: "Partner Inventory Rate",
            },
        },
        {
            path: "partnerInventoryExpect",
            component: partnerInventoryExpect,
            name: "partnerInventoryExpect",
            meta: {
                title: "파트너 재고예약 예상내역",
                breadcrumb: "Partner Inventory Expect",
            },
        },
        {
            path: "partnerInventoryDetailSetCol",
            component: partnerInventoryDetailSetCol,
            name: "partnerInventoryDetailSetCol",
            meta: {
                title: "파트너 재고예약 상세할당 (세로)",
                breadcrumb: "Partner Inventory Detail Set Column",
            },
        },
        {
            path: "partnerInventoryDetailSetRow",
            component: partnerInventoryDetailSetRow,
            name: "partnerInventoryDetailSetRow",
            meta: {
                title: "파트너 재고예약 상세할당 (가로)",
                breadcrumb: "Partner Inventory Detail Set Row",
            },
        },
        {
            path: "partnerInventoryRsv",
            component: partnerInventoryRsv,
            name: "partnerInventoryRsv",
            meta: {
                title: "파트너 재고예약 리스트",
                breadcrumb: "Partner Inventory Reservation List",
            },
        },
        {
            path: "partnerReservationApp",
            component: partnerReservationApp,
            name: "partnerReservationApp",
            meta: {
                title: "파트너 객실예약 신청 리스트",
                breadcrumb: "Partner Reservation Apply List",
            },
        },
        {
            path: "partnerPkgReservationApp",
            component: partnerPkgReservationApp,
            name: "partnerPkgReservationApp",
            meta: {
                title: "파트너 패키지예약 신청 리스트",
                breadcrumb: "Partner Package Reservation Apply List",
            },
        },
    ],
};
