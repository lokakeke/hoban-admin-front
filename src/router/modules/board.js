import Full from "Container/Full.vue";

// 공지사항
const BoardNotice = () => import("Views/system/board/notice/BoardNotice.vue");
const BoardNoticeView = () =>
    import("Views/system/board/notice/BoardNoticeView.vue");

// 요금 조회
const BoardAmount = () => import("Views/system/board/amount/BoardAmount.vue");

// Q&A
const BoardQna = () => import("Views/system/board/qna/BoardQna.vue");

export default {
    path: "/board",
    name: "board",
    component: Full,
    redirect: "/main",
    meta: {
        breadcrumb: "Board",
    },
    children: [
        {
            path: "boardNotice",
            component: BoardNotice,
            name: "boardNotice",
            meta: {
                auth: true,
                title: "공지사항",
                breadcrumb: "Notice",
            },
        },
        {
            path: "boardNotice/:noticeSeq",
            component: BoardNoticeView,
            name: "boardNotice.view",
            props: true,
            meta: {
                auth: true,
                title: "공지사항 조회",
                breadcrumb: "Notice",
            },
        },
        {
            path: "boardAmount",
            component: BoardAmount,
            name: "boardAmount",
            meta: {
                auth: true,
                title: "요금 조회",
                breadcrumb: "Amount",
            },
        },
        {
            path: "boardQna",
            component: BoardQna,
            name: "boardQna",
            meta: {
                auth: true,
                title: "Q&A",
                breadcrumb: "Q&A",
            },
        },
    ],
};
