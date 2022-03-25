import api from 'Api'

const roomTypeService = {
  /**
   * @returns 객실유형 리스트
   */
  selectRoomTypeInformationList (param) {
    return api.get('/api/ota/room', {
      params: param
    })
  },

  /**
   * @returns 등록되지 않은 영업장 리스트
   */
  selectUnRegisteredStoreList (param) {
    return api.get('/api/ota/room/stores/unregistered', {
      params: param
    })
  },

  /**
   * @returns 등록된 영업장 리스트
   */
  selectRegisteredStoreList (param) {
    return api.get('/api/ota/room/stores/registered', {
      params: param
    })
  },

  /**
   * @returns 블록코드 리스트
   */
  selectBlckCd () {
    return api.get('/api/ota/room/blocks')
  },

  /**
   * @returns 객실유형 기본정보 조회
   */
  selectRoomTypeInformation (storeCd) {
    return api.get(`/api/ota/room/store/${storeCd}`)
  },
  selectRoomTypeInformationPartner (storeCd, ptnrNo) {
    return api.get(`/api/ota/room/store/${storeCd}`, {
      params: {
        ptnrNo: ptnrNo
      }
    })
  },

  /**
   * @returns 객실유형 기본정보 등록
   */
  insertBasicInformation (param) {
    return api.post('/api/ota/room/store', param)
  },

  /**
   * @returns 객실유형 기본정보 수정
   */
  updateBasicInformation (param) {
    return api.post('/api/ota/room/store/modify', param)
  },

  /**
   * @returns 영업장 객실리스트 출력
   */
  selectStoreRoomUseList (storeCd) {
    const param = { storeCd: storeCd, useYn: 1 }
    return api.get('/api/ota/roomReservation/rmTypeAndDongInfo', { params: param })
  },
  /**
   * @returns 영업장 객실리스트 출력
   */
  selectStoreRoomList (storeCd) {
    return api.get(`/api/ota/room/store/${storeCd}/rooms`)
  },

  /**
   * @returns 영업장 객실리스트 판매 등록
   */
  insertStoreRoomList (storeCd, param) {
    return api.post(`/api/ota/room/store/${storeCd}/rooms`, param)
  },

  /**
   * @returns 영업장 객실리스트 수정
   */
  updateStoreRoomList (storeCd, param) {
    return api.post(`/api/ota/room/store/${storeCd}/rooms/modify`, param)
  },

  /**
   * @returns 휴일 조회
   */
  selectHolidayList (storeCd) {
    return api.get(`/api/ota/room/store/${storeCd}/holiday`)
  },

  /**
   * @returns 휴일 추가
   */
  insertHolidayList (storeCd, param) {
    return api.post(`/api/ota/room/store/${storeCd}/holiday`, param)
  },

  /**
   * @returns 휴일 수정
   */
  updateHolidayList (storeCd, param) {
    return api.post(`/api/ota/room/store/${storeCd}/holiday/modify`, param)
  },

  /**
   * 파트너 목록 조회
   */
  selectPartnerList () {
    return api.get('/api/ota/room/partners')
  },

  /**
   * 파트너 별 영업장 전체 기본 설정 예외적용
   */
  insertStoreAllPartnerExceptSetting (param) {
    return api.post('/api/ota/room/partner/setting/exception/stores', param)
  },

  /**
   * 파트너 목록 조회 (영업장 별)
   */
  selectStoreInPartnerList (storeCd) {
    return api.get(`/api/ota/room/partners/store/${storeCd}`)
  },

  /**
   * 파트너 별 영업장 기본 설정 예외적용
   */
  insertStorePartnerExceptSetting (storeCd, param) {
    return api.post(`/api/ota/room/partner/setting/exception/store/${storeCd}`, param)
  }
}

export default roomTypeService
