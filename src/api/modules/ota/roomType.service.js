import api from '@/api'

const roomTypeService = {
  /**
   * @returns 객실유형 리스트
   */
  selectRoomTypeInformationList (param) {
    return api.get('/api/system/ota/room', {
      params: param
    })
  },

  /**
   * @returns 등록되지 않은 영업장 리스트
   */
  selectUnRegisteredStoreList (param) {
    return api.get('/api/system/ota/room/stores/unregistered', {
      params: param
    })
  },

  /**
   * @returns 등록된 영업장 리스트
   */
  selectRegisteredStoreList (param) {
    return api.get('/api/system/ota/room/stores/registered', {
      params: param
    })
  },

  /**
   * @returns 블록코드 리스트
   */
  selectBlckCode () {
    return api.get('/api/system/ota/room/blocks')
  },

  /**
   * @returns 객실유형 기본정보 조회
   */
  selectRoomTypeInformation (storeCode) {
    return api.get(`/api/system/ota/room/store/${storeCode}`)
  },
  selectRoomTypeInformationPartner (storeCode, partnerSeq) {
    return api.get(`/api/system/ota/room/store/${storeCode}`, {
      params: {
        partnerSeq: partnerSeq
      }
    })
  },

  /**
   * @returns 객실유형 기본정보 등록
   */
  insertBasicInformation (param) {
    return api.post('/api/system/ota/room/store', param)
  },

  /**
   * @returns 객실유형 기본정보 수정
   */
  updateBasicInformation (param) {
    return api.post('/api/system/ota/room/store/modify', param)
  },

  /**
   * @returns 영업장 객실리스트 출력
   */
  selectStoreRoomUseList (storeCode) {
    const param = { storeCode: storeCode, useYn: 1 }
    return api.get('/api/system/ota/roomReservation/rmTypeAndDongInfo', { params: param })
  },
  /**
   * @returns 영업장 객실리스트 출력
   */
  selectStoreRoomList (storeCode) {
    return api.get(`/api/system/ota/room/store/${storeCode}/rooms`)
  },

  /**
   * @returns 영업장 객실리스트 판매 등록
   */
  insertStoreRoomList (storeCode, param) {
    return api.post(`/api/system/ota/room/store/${storeCode}/rooms`, param)
  },

  /**
   * @returns 영업장 객실리스트 수정
   */
  updateStoreRoomList (storeCode, param) {
    return api.post(`/api/system/ota/room/store/${storeCode}/rooms/modify`, param)
  },

  /**
   * @returns 휴일 조회
   */
  selectHolidayList (storeCode) {
    return api.get(`/api/system/ota/room/store/${storeCode}/holiday`)
  },

  /**
   * @returns 휴일 추가
   */
  insertHolidayList (storeCode, param) {
    return api.post(`/api/system/ota/room/store/${storeCode}/holiday`, param)
  },

  /**
   * @returns 휴일 수정
   */
  updateHolidayList (storeCode, param) {
    return api.post(`/api/system/ota/room/store/${storeCode}/holiday/modify`, param)
  },

  /**
   * 파트너 목록 조회
   */
  selectPartnerList () {
    return api.get('/api/system/ota/room/partners')
  },

  /**
   * 파트너 별 영업장 전체 기본 설정 예외적용
   */
  insertStoreAllPartnerExceptSetting (param) {
    return api.post('/api/system/ota/room/partner/setting/exception/stores', param)
  },

  /**
   * 파트너 목록 조회 (영업장 별)
   */
  selectStoreInPartnerList (storeCode) {
    return api.get(`/api/system/ota/room/partners/store/${storeCode}`)
  },

  /**
   * 파트너 별 영업장 기본 설정 예외적용
   */
  insertStorePartnerExceptSetting (storeCode, param) {
    return api.post(`/api/system/ota/room/partner/setting/exception/store/${storeCode}`, param)
  }
}

export default roomTypeService
