// Sidebar Routers
export const menus = [
  {
    menuId: 2,
    menuName: '파트너',
    iconFont: 'apartment',
    children: [
      { menuId: 21, menuName: '파트너 등록관리', menuPath: '/partner/partner' }
    ]
  },
  {
    menuId: 3,
    menuName: 'API 서비스',
    iconFont: 'http',
    children: [
      { menuId: 31, menuName: 'API 서비스 등록관리', menuPath: '/apiService/service' },
      { menuId: 32, menuName: 'NAVER API 이력관리', menuPath: '/apiService/naverHistory' },
      { menuId: 33, menuName: 'API 이력관리', menuPath: '/apiService/logs' },
      { menuId: 34, menuName: '결과 코드 조회', menuPath: '/apiService/resultCode' }
    ]
  },
  {
    menuId: 4,
    menuName: '소셜',
    iconFont: 'supervisor_account',
    children: [
      {
        menuId: 41,
        menuName: '등록 관리',
        children: [
          { menuId: 411, menuName: '우대번호 등록관리', menuPath: '/social/ticket' }
        ]
      },
      {
        menuId: 42,
        menuName: '예약 관리',
        children: [
          { menuId: 421, menuName: '우대번호 거래내역 조회', menuPath: '/social/ticketHistory' },
          { menuId: 422, menuName: '우대번호 발권변경', menuPath: '/social/ticketingUpdate' },
          { menuId: 423, menuName: '판매중/종료예정/종료 별 우대번호 조회', menuPath: '/social/statusTicket' },
          { menuId: 424, menuName: 'DGNS 우대번호 조회', menuPath: '/social/dgnsTicket' }
        ]
      }
    ]
  },
  {
    menuId: 5,
    menuName: '국내 OTA',
    iconFont: 'location_city',
    children: [
      {
        menuId: 41,
        menuName: '객실/패키지 관리',
        children: [
          { menuId: 411, menuName: '객실(Room Only) 등록관리', menuPath: '/ota/roomType' },
          { menuId: 412, menuName: '객실(PKG) 등록관리', menuPath: '/ota/roomPackage' },
          { menuId: 413, menuName: '객실예약관리', menuPath: '/ota/roomReservation' }
        ]
      }
    ]
  },
  {
    menuId: 6,
    menuName: '네이버',
    iconFont: 'looks',
    children: [
      {
        menuId: 61,
        menuName: '영업장 관리',
        menuPath: '/naver/business',
        children: [
          { menuId: 621, menuName: '영업장 관리', menuPath: '/naver/business' }
        ]
      },
      {
        menuId: 62,
        menuName: '상품 관리',
        children: [
          { menuId: 621, menuName: '상품 관리', menuPath: '/naver/item' },
          { menuId: 622, menuName: '옵션 관리', menuPath: '/naver/option' }
        ]
      },
      {
        menuId: 63,
        menuName: '일정 관리',
        menuPath: '/naver/schedule',
        children: [
          { menuId: 631, menuName: '블록 관리', menuPath: '/naver/block' },
          { menuId: 632, menuName: '일정 관리', menuPath: '/naver/schedule' },
          // 스케줄 관리
          { menuId: 633, menuName: '간단예약 관리', menuPath: '/naver/simpleSchedule' }
        ]
      },
      {
        menuId: 64,
        menuName: '예약 관리',
        children: [
          // 예약현황
          /* {menuId: 641, menuName: '예약현황', menuPath: '/naver/roomType'}, */
          { menuId: 642, menuName: '예약내역 관리', menuPath: '/naver/booking' }
        ]
      }
    ]
  },
  {
    menuId: 1,
    menuName: '시스템',
    iconFont: 'settings',
    children: [
      { menuId: 11, menuName: '메뉴 관리', menuPath: '/system/menu' },
      { menuId: 12, menuName: '메뉴 권한 관리', menuPath: '/system/adminMenuAuthGroup' },
      { menuId: 13, menuName: '관리자 관리', menuPath: '/system/account' },
      { menuId: 14, menuName: '공통코드 관리', menuPath: '/system/commonCode' },
      { menuId: 15, menuName: '알림 관리', menuPath: '/system/message' },
      { menuId: 16, menuName: '문자 알림 관리', menuPath: '/system/smsNotification' },
      { menuId: 17, menuName: '내부 IP 관리', menuPath: '/system/ip' }
    ]
  }
]
