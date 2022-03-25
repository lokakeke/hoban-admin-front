import Full from 'Container/Full.vue'

// Booking
const Booking = () => import('Views/naver/booking/BookingManagement.vue')

// Booking Calendar
const BookingCalendar = () => import('Views/naver/booking/BookingCalendarView.vue')

// Business
const Business = () => import('Views/naver/business/BusinessManagement.vue')

// Item
const Item = () => import('Views/naver/item/ItemManagement.vue')

// Option
const Option = () => import('Views/naver/item/OptionManagement.vue')

// Schedule
const Schedule = () => import('Views/naver/schedule/ScheduleManagement.vue')

// ScheduleTemp
const ScheduleTemp = () => import('Views/naver/schedule/ScheduleTempManagement.vue')

// SimpleSchedule
const SimpleSchedule = () => import('Views/naver/schedule/SimpleScheduleManagement.vue')

// naverTokenManagement
const NaverTokenManagement = () => import('Views/naver/token/NaverTokenManagement.vue')

// ScheduleSend
const ScheduleSend = () => import('Views/naver/scheduleSend/ScheduleSend.vue')

// RsvLog
const BookingLog = () => import('Views/naver/bookingLog/BookingLog.vue')

// 정산
const CalculateMonth = () => import('Views/naver/calculate/Month.vue')
const CalculateDay = () => import('Views/naver/calculate/Day.vue')
const CalculateSaleAdjust = () => import('Views/naver/calculate/SaleAdjust.vue')
const CalculateTpne = () => import('Views/naver/calculate/Tpne.vue')

export default {
    path: '/naver',
    name: 'naver',
    component: Full,
    redirect: '/main',
    meta: {
        breadcrumb: '네이버'
    },
    children: [
        {
            path: 'businessManagement',
            component: Business,
            name: 'businessManagement',
            meta: {
                auth: true,
                requiresAuth: true,
                title: '서비스 관리',
                breadcrumb: 'Business Management'
            }
        },
        {
            path: 'itemManagement',
            component: Item,
            name: 'itemManagement',
            meta: {
                auth: true,
                requiresAuth: true,
                title: '상품 관리',
                breadcrumb: 'Item Management'
            }
        },
        {
            path: 'optionManagement',
            component: Option,
            name: 'optionManagement',
            meta: {
                auth: true,
                requiresAuth: true,
                title: '옵션 관리',
                breadcrumb: 'Option Management'
            }
        },
        {
            path: 'scheduleManagement',
            component: Schedule,
            name: 'scheduleManagement',
            meta: {
                auth: true,
                requiresAuth: true,
                title: '일정 관리',
                breadcrumb: 'Schedule Management'
            }
        },
        {
            path: 'bookingCalendarView',
            component: BookingCalendar,
            name: 'bookingCalendarView',
            meta: {
                auth: true,
                requiresAuth: true,
                title: '예약현황',
                breadcrumb: 'Booking Calendar View'
            }
        },
        {
            path: 'bookingManagement',
            component: Booking,
            name: 'bookingManagement',
            meta: {
                auth: true,
                requiresAuth: true,
                title: '예약자 관리',
                breadcrumb: 'Booking Management'
            }
        },
        {
            path: 'scheduleTempManagement',
            component: ScheduleTemp,
            name: 'scheduleTempManagement',
            meta: {
                auth: true,
                requiresAuth: true,
                title: '임시 일정 관리',
                breadcrumb: 'Schedule Temp Management'
            }
        },
        {
            path: 'simpleScheduleManagement',
            component: SimpleSchedule,
            name: 'simpleScheduleManagement',
            meta: {
                auth: true,
                requiresAuth: true,
                title: '간단예약 관리',
                breadcrumb: 'Simple Schedule Management'
            }
        },
        {
            path: 'scheduleSend',
            component: ScheduleSend,
            name: 'scheduleSend',
            meta: {
                auth: true,
                requiresAuth: true,
                title: '전송 이력',
                breadcrumb: 'Schedule Send'
            }
        },
        {
            path: 'bookingLog',
            component: BookingLog,
            name: 'bookingLog',
            meta: {
                auth: true,
                requiresAuth: true,
                title: '예약 로그',
                breadcrumb: 'Rsv Log Calendar'
            }
        },
        {
            path: 'calculateDay',
            component: CalculateDay,
            name: 'calculateDay',
            meta: {
                auth: true,
                requiresAuth: true,
                title: '일정산',
                breadcrumb: 'Calculate Day'
            }
        },
        {
            path: 'calculateMonth',
            component: CalculateMonth,
            name: 'calculateMonth',
            meta: {
                auth: true,
                requiresAuth: true,
                title: '월정산',
                breadcrumb: 'Calculate Month'
            }
        },
        {
            path: 'calculateSaleAdjust',
            component: CalculateSaleAdjust,
            name: 'calculateSaleAdjust',
            meta: {
                auth: true,
                requiresAuth: true,
                title: '매출조정 관리',
                breadcrumb: 'Calculate Sale Adjust Management'
            }
        },
        {
            path: 'calculateTpne',
            component: CalculateTpne,
            name: 'calculateTpne',
            meta: {
                auth: true,
                requiresAuth: true,
                title: 'TPNE 정산 관리',
                breadcrumb: 'Calculate TPNE Management'
            }
        },
        {
            path: 'naverTokenManagement',
            component: NaverTokenManagement,
            name: 'naverTokenManagement',
            meta: {
                auth: true,
                requiresAuth: true,
                title: '토큰 관리',
                breadcrumb: 'Naver Token Management'
            }
        }
    ]
}
