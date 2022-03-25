import Full from "Container/Full.vue";

// register
const Ticket = () => import("Views/social/register/TicketManagement.vue");

// reservation
const history = () =>
    import("Views/social/reservation/TicketHistoryManagement.vue");
const ticketing = () =>
    import("Views/social/reservation/TicketingUpdateManagement.vue");
const status = () =>
    import("Views/social/reservation/StatusTicketManagement.vue");
const dgnsTicket = () =>
    import("Views/social/reservation/DgnsTicketManagement.vue");

// deposit
const depositAccount = () =>
    import("Views/api/deposit/DepositAccountManagement.vue");
const depositTransaction = () =>
    import("Views/api/deposit/DepositTransactionManagement.vue");
const depositFailure = () =>
    import("Views/api/deposit/DepositFailureManagement.vue");
const calculate = () =>
    import("Views/social/calculate/CalculateManagement.vue");
const calculateHistory = () =>
    import("Views/social/calculate/CalculateHistory.vue");

// statistics
const kpiManagement = () => import("Views/social/statistics/KpiManagement.vue");
const statistics = () => import("Views/social/statistics/SocialStatistics.vue");
const totalStatistics = () =>
    import("Views/social/statistics/TotalStatistics.vue");

// errorGuidance
const errorGuidance = () => import("Views/api/error/ErrorGuidance.vue");

export default {
    path: "/social",
    name: "social",
    component: Full,
    redirect: "/main",
    meta: {
        breadcrumb: "Social",
    },
    children: [
        {
            path: "ticketManagement",
            component: Ticket,
            name: "social.ticketManagement",
            meta: {
                auth: true,
                requiresAuth: true,
                title: "우대번호 등록관리",
                breadcrumb: "Pvl Ticket Management",
            },
        },
        {
            path: "ticketHistoryManagement",
            component: history,
            name: "social.ticketHistoryManagement",
            meta: {
                auth: true,
                requiresAuth: true,
                title: "우대번호 거래내역 조회",
                breadcrumb: "Pvl Ticket History",
            },
        },
        {
            path: "ticketingUpdateManagement",
            component: ticketing,
            name: "social.ticketingUpdateManagement",
            meta: {
                auth: true,
                requiresAuth: true,
                title: "우대번호 발권 변경",
                breadcrumb: "Ticketing Update",
            },
        },
        {
            path: "statusTicketManagement",
            component: status,
            name: "social.statusTicketManagement",
            meta: {
                auth: true,
                requiresAuth: true,
                title: "판매중/종료예정/종료 별 우대번호 조회",
                breadcrumb: "Status Ticket Management",
            },
        },
        {
            path: "dgnsTicketManagement",
            component: dgnsTicket,
            name: "social.dgnsTicketManagement",
            meta: {
                auth: true,
                requiresAuth: true,
                title: "DGNS 우대번호 조회",
                breadcrumb: "Dgns Ticket Management",
            },
        },
        {
            path: "depositAccountManagement",
            component: depositAccount,
            name: "social.depositAccountManagement",
            meta: {
                auth: true,
                requiresAuth: true,
                title: "예치금 계좌 관리",
                breadcrumb: "Deposit Account Management",
            },
        },
        {
            path: "depositTransactionManagement",
            component: depositTransaction,
            name: "social.depositTransactionManagement",
            meta: {
                auth: true,
                requiresAuth: true,
                title: "예치금 입출금 관리",
                breadcrumb: "Deposit Transaction Management",
            },
        },
        {
            path: "depositFailureManagement",
            component: depositFailure,
            name: "social.depositFailureManagement",
            meta: {
                auth: true,
                requiresAuth: true,
                title: "예치금 입출금 실패이력 조회",
                breadcrumb: "Deposit Failure Management",
            },
        },
        {
            path: "calculateManagement",
            component: calculate,
            name: "social.calculateManagement",
            meta: {
                auth: true,
                requiresAuth: true,
                title: "정산 관리",
                breadcrumb: "Calculate Management",
            },
        },
        {
            path: "calculateHistory",
            component: calculateHistory,
            name: "social.calculateHistory",
            meta: {
                auth: true,
                requiresAuth: true,
                title: "이전 정산 이력",
                breadcrumb: "Calculate History",
            },
        },
        {
            path: "kpiManagement",
            component: kpiManagement,
            name: "social.kpiManagement",
            meta: {
                auth: true,
                requiresAuth: true,
                title: "KPI 관리",
                breadcrumb: "Kpi Management",
            },
        },
        {
            path: "statistics",
            component: statistics,
            name: "social.statistics",
            meta: {
                auth: true,
                requiresAuth: true,
                title: "카테고리별 통계",
                breadcrumb: "Statistics",
            },
        },
        {
            path: "totalStatistics",
            component: totalStatistics,
            name: "social.totalStatistics",
            meta: {
                auth: true,
                requiresAuth: true,
                title: "전체 통계",
                breadcrumb: "Total Statistics",
            },
        },
        {
            path: "errorGuidance",
            component: errorGuidance,
            name: "social.errorGuidance",
            meta: {
                auth: true,
                requiresAuth: true,
                title: "오류 추천",
                breadcrumb: "Error Guidance",
            },
        },
    ],
};
