import api from '@/api'

export default {

  /**
   * 패키지 재고 조회
   */
  selectPkgInventory (type, param) {
    return api.post(`/api/ota/roomReservation/pkgStatus/${type}`, param)
  },

  /**
   * 객실 재고 조회
   */
  selectRoomInventory (type, param) {
    return api.post(`/api/ota/roomReservation/roomStatus/${type}`, param)
  },

  /**
   * 영업장 정보 조회
   */
  selectStoreInfo (param) {
    return api.get('/api/ota/roomReservation/storeInfo', { params: param })
  },

  /**
   * 영업장 1개 정보 조회
   */
  selectOneStoreInfo (store, partnerSeq) {
    return api.get(`/api/ota/roomReservation/store/${store}`, {
      params: {
        partnerSeq: partnerSeq
      }
    })
  },

  /**
   * 검색창에서 영업장 정보 조회
   */
  selectStoreInfoForSearch (param) {
    return api.get('/api/ota/roomReservation/storeInfoForSearch', { params: param })
  },

  /**
   * 패키지에 따른 영업장 정보 조회
   */
  selectStoreInfoByPkgNo (param) {
    return api.get('/api/ota/roomReservation/storeInfoByPkgNo', { params: param })
  },

  /**
   * 예약 이관을 위한 패키지 정보 조회
   */
  selectPkgInfoForRsvTypeChange (param) {
    return api.get('/api/ota/roomReservation/pkgInfoForRsvTypeChange', { params: param })
  },

  /**
   * 패키지 정보 조회
   */
  selectPkgInfo (param) {
    return api.get('/api/ota/roomReservation/pkgInfo', { params: param })
  },

  /**
   * 네이버 패키지 정보 조회
   */
  selectNaverPkgInfo (param) {
    return api.get('/api/ota/roomReservation/naverPkgInfo', { params: param })
  },

  /**
   * 객실 유형 및 동 정보 조회
   */
  selectRmTypeAndDongInfo (param) {
    return api.get('/api/ota/roomReservation/rmTypeAndDongInfo', { params: param })
  },

  /**
   * 예약블럭 정보 조회
   */
  selectRsvBlockInfo (param) {
    return api.get('/api/ota/roomReservation/rsvBlockInfo', { params: param })
  },

  /**
   * 전체 객실 예약 목록 조회
   */
  selectReservationList (param) {
    return api.post('/api/ota/roomReservation/list', param.q, { timeout: 2 * 60 * 1000 })
  },

  /**
   * 객실 예약 상세 조회
   */
  selectReservationDetail (keyRsvNo) {
    return api.get(`/api/ota/roomReservation/detail/${keyRsvNo}`)
  },

  /**
   * 실제 이용자 연락처 조회
   */
  selectRealSmsphone (keyRsvNo) {
    return api.get(`/api/ota/roomReservation/smsPhone/${keyRsvNo}`)
  },

  /**
   * 파트너의 패키지 휴일 정보 조회
   */
  selectPkgHolidayInfo (pkgNo) {
    return api.get(`/api/ota/pack/holiday/${pkgNo}`)
  },

  /**
   * 당일예약 패키지 휴일 정보 조회
   */
  selectTodayPkgRsvInfo (pkgNo, stndYmd) {
    return api.get(`/api/ota/pack/holiday/${pkgNo}/${stndYmd}`)
  },

  /**
   * 패키지 요금 조회(ota-back쪽에서 Feign으로 요금 조회 후 0이나 null 처리 후 결과값 리턴)
   * groupFlag: ota인지 naver인지의 구분값
   */
  selectPkgAmount (groupFlag, param) {
    return api.post(`/api/ota/roomReservation/packageAmount/${groupFlag}`, param)
  },

  /**
   * 객실 요금 조회(ota-back쪽에서 Feign으로 요금 조회 후 0이나 null 처리 후 결과값 리턴)
   */
  selectRoomAmount (param) {
    return api.post('/api/ota/roomReservation/roomAmount', param)
  },

  /**
   * 패키지 신규 예약 입력(ota-back쪽으로 갔다가 Feign을 타고 예약이 입력됨.)
   */
  insertPkgNewRsv (path, param) {
    return api.post(`/api/ota/roomReservation/newPkgRsv/${path}`, param, { timeout: 2 * 60 * 1000 })
  },

  /**
   * 객실 신규 예약 입력(ota-back쪽으로 갔다가 Feign을 타고 예약이 입력됨.)
   */
  insertRoomNewRsv (path, param) {
    return api.post(`/api/ota/roomReservation/newRoomRsv/${path}`, param, { timeout: 2 * 60 * 1000 })
  },

  /**
   * 예약 후 요금 조회
   */
  selectAmountAfterRsv (type, keyRsvNo) {
    return api.post(`/api/ota/roomReservation/amountAfterRsv/${type}/${keyRsvNo}`)
  },

  /**
   * 취소 사유 변경
   */
  updateCancelResn (param) {
    return api.post('/api/ota/roomReservation/updateCancelResn', param)
  },

  /**
   * 객실 예약 취소
   */
  cancelRoomRsv (path, param) {
    return api.post(`/api/ota/roomReservation/cancelRoom/${path}`, param)
  },

  /**
   * 패키지 예약 취소
   */
  cancelPkgRsv (path, param) {
    return api.post(`/api/ota/roomReservation/cancelPkg/${path}`, param)
  },

  /**
   * 다중 취소 사유 변경
   */
  updateMultipleCancelResn (param) {
    return api.post('/api/ota/roomReservation/updateMultipleCancelResn', param)
  },

  /**
   * 다중 예약 취소(ota-back쪽으로 갔다가 Feign을 타고 취소됨.)
   */
  cancelMultipleRsv (path, param) {
    return api.post(`/api/ota/roomReservation/cancelMultipleRsv/${path}`, param)
  },

  /**
   * 실수 분리
   */
  splitRmCnt (path, keyRsvNo) {
    return api.get(`/api/ota/roomReservation/splitRmCnt/${path}/${keyRsvNo}`)
  },

  /**
   * 박수 분리
   */
  splitNights (path, keyRsvNo) {
    return api.get(`/api/ota/roomReservation/splitNights/${path}/${keyRsvNo}`)
  },

  /**
   * 고객 정보 변경
   */
  updateGuestInfo (param) {
    return api.post('/api/ota/roomReservation/updateGuestInfo', param)
  },

  /**
   * 객실 예약 정보 변경
   */
  updateRoomRsvInfo (path, param) {
    return api.post(`/api/ota/roomReservation/updateRoomRsvInfo/${path}`, param)
  },

  /**
   * 패키지 예약 정보 변경
   */
  updatePackageRsvInfo (path, param) {
    return api.post(`/api/ota/roomReservation/updatePackageRsvInfo/${path}`, param)
  },

  /**
   * 객실로 예약이관(패키지 > 객실 OR 객실 > 객실)
   */
  updateRsvChangeToRoom (path, param) {
    return api.post(`/api/ota/roomReservation/rsvChangeToRoom/${path}`, param, { timeout: 2 * 60 * 1000 })
  },

  /**
   * 패키지로 예약이관(패키지 > 패키지 OR 객실 > 패키지)
   */
  updateRsvChangeToPkg (path, param) {
    return api.post(`/api/ota/roomReservation/rsvChangeToPkg/${path}`, param, { timeout: 2 * 60 * 1000 })
  },

  /**
   * 변경Log 이력 조회
   */
  selectChangeLogs (keyRsvNo) {
    return api.get(`/api/ota/roomReservation/changeLogs/${keyRsvNo}`)
  }
}
