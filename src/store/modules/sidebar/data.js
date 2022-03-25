// Sidebar Routers
export const menus = [
  {
    menuId: 2,
    menuNm: '파트너',
    iconFont: 'apartment',
    children: [
      { menuId: 21, menuNm: '파트너 등록관리', menuPath: '/partner/partnerManagement' }
    ]
  },
  {
    menuId: 3,
    menuNm: 'API 서비스',
    iconFont: 'http',
    children: [
      { menuId: 31, menuNm: 'API 서비스 등록관리', menuPath: '/apiService/serviceManagement' },
      { menuId: 32, menuNm: 'NAVER API 이력관리', menuPath: '/apiService/naverHistoryManagement' },
      { menuId: 33, menuNm: 'API 이력관리', menuPath: '/apiService/historyManagement' },
      { menuId: 34, menuNm: '결과 코드 조회', menuPath: '/apiService/resultCodeManagement' }
    ]
  },
  {
    menuId: 4,
    menuNm: '소셜',
    iconFont: 'supervisor_account',
    children: [
      {
        menuId: 41,
        menuNm: '등록 관리',
        children: [
          { menuId: 411, menuNm: '우대번호 등록관리', menuPath: '/social/ticketManagement' }
        ]
      },
      {
        menuId: 42,
        menuNm: '예약 관리',
        children: [
          { menuId: 421, menuNm: '우대번호 거래내역 조회', menuPath: '/social/ticketHistoryManagement' },
          { menuId: 422, menuNm: '우대번호 발권변경', menuPath: '/social/ticketingUpdateManagement' },
          { menuId: 423, menuNm: '판매중/종료예정/종료 별 우대번호 조회', menuPath: '/social/statusTicketManagement' },
          { menuId: 424, menuNm: 'DGNS 우대번호 조회', menuPath: '/social/dgnsTicketManagement' }
        ]
      }
    ]
  },
  {
    menuId: 5,
    menuNm: '국내 OTA',
    iconFont: 'location_city',
    children: [
      {
        menuId: 41,
        menuNm: '객실/패키지 관리',
        children: [
          { menuId: 411, menuNm: '객실(Room Only) 등록관리', menuPath: '/ota/roomTypeManagement' },
          { menuId: 412, menuNm: '객실(PKG) 등록관리', menuPath: '/ota/roomPackageManagement' },
          { menuId: 413, menuNm: '객실예약관리', menuPath: '/ota/roomReservationManagement' }
        ]
      }
    ]
  },
  {
    menuId: 6,
    menuNm: '네이버',
    iconFont: 'looks',
    children: [
      {
        menuId: 61,
        menuNm: '영업장 관리',
        menuPath: '/naver/businessManagement',
        children: [
          { menuId: 621, menuNm: '영업장 관리', menuPath: '/naver/businessManagement' }
        ]
      },
      {
        menuId: 62,
        menuNm: '상품 관리',
        children: [
          { menuId: 621, menuNm: '상품 관리', menuPath: '/naver/itemManagement' },
          { menuId: 622, menuNm: '옵션 관리', menuPath: '/naver/optionManagement' }
        ]
      },
      {
        menuId: 63,
        menuNm: '일정 관리',
        menuPath: '/naver/scheduleManagement',
        children: [
          { menuId: 631, menuNm: '블록 관리', menuPath: '/naver/blockManagement' },
          { menuId: 632, menuNm: '일정 관리', menuPath: '/naver/scheduleManagement' },
          // 스케줄 관리
          { menuId: 633, menuNm: '간단예약 관리', menuPath: '/naver/simpleScheduleManagement' }
        ]
      },
      {
        menuId: 64,
        menuNm: '예약 관리',
        children: [
          // 예약현황
          /* {menuId: 641, menuNm: '예약현황', menuPath: '/naver/roomTypeManagement'}, */
          { menuId: 642, menuNm: '예약내역 관리', menuPath: '/naver/bookingManagement' }
        ]
      }
    ]
  },
  {
    menuId: 1,
    menuNm: '시스템',
    iconFont: 'settings',
    children: [
      { menuId: 11, menuNm: '메뉴 관리', menuPath: '/system/menuManagement' },
      { menuId: 12, menuNm: '메뉴 권한 관리', menuPath: '/system/menuAuthManagement' },
      { menuId: 13, menuNm: '관리자 관리', menuPath: '/system/accountManagement' },
      { menuId: 14, menuNm: '공통코드 관리', menuPath: '/system/commonCodeManagement' },
      { menuId: 15, menuNm: '알림 관리', menuPath: '/system/notificationManagement' },
      { menuId: 16, menuNm: '문자 알림 관리', menuPath: '/system/smsNotificationManagement' },
      { menuId: 17, menuNm: '내부 IP 관리', menuPath: '/system/ipManagement' }
    ]
  }
]
