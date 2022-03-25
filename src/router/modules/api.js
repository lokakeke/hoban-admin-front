import Full from "Container/Full.vue";

// API 서비스 등록관리
const service = () => import("Views/api/service/ServiceManagement.vue");
const naver = () => import("Views/api/history/NaverHistoryManagement.vue");
const history = () => import("Views/api/history/HistoryManagement.vue");
const reservationHistory = () =>
    import("Views/api/history/ReservationHistoryManagement.vue");
const resultCode = () =>
    import("Views/api/resultCode/resultCodeManagement.vue");
const api = () => import("Views/api/service/ApiManagement.vue");

export default {
    path: "/apiService",
    name: "api",
    component: Full,
    redirect: "/main",
    meta: {
        breadcrumb: "Api",
    },
    children: [
        {
            path: "serviceManagement",
            component: service,
            name: "serviceManagement",
            meta: {
                auth: true,
                requiresAuth: true,
                title: "API 서비스 등록관리",
                breadcrumb: "API Service Management",
            },
        },
        {
            path: "naverHistoryManagement",
            component: naver,
            name: "naverHistoryManagement",
            meta: {
                auth: true,
                requiresAuth: true,
                title: "NAVER API 이력관리",
                breadcrumb: "NAVER API History Management",
            },
        },
        {
            path: "historyManagement",
            component: history,
            name: "historyManagement",
            meta: {
                auth: true,
                requiresAuth: true,
                title: "API 이력관리",
                breadcrumb: "API History Management",
            },
        },
        {
            path: "reservationHistoryManagement",
            component: reservationHistory,
            name: "reservationHistoryManagement",
            meta: {
                auth: true,
                requiresAuth: true,
                title: "API 예약 이력관리",
                breadcrumb: "API Reservation History Management",
            },
        },
        {
            path: "resultCodeManagement",
            component: resultCode,
            name: "resultCodeManagement",
            meta: {
                auth: true,
                requiresAuth: true,
                title: "결과 코드 조회",
                breadcrumb: "API Result Code Management",
            },
        },
        {
            path: "apiManagement",
            component: api,
            name: "apiManagement",
            meta: {
                auth: true,
                requiresAuth: true,
                title: "API 오픈관리",
                breadcrumb: "API Management",
            },
        },
    ],
};
