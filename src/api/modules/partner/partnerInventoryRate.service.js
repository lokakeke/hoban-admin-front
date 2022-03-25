import api from "Api"

const partnerInventoryRateService = {

  /**
   * 파트너 인벤토리 재고설정 정보 조회
   */
  selectPartnerInventoryRateList () {
    return api.get('/api/system/partnerInventoryRate/list')
  },

  /**
   * 파트너 인벤토리 재고설정 입력
   * @param list
   */
  insertPartnerInventoryRateList (list) {
    return api.post('/api/system/partnerInventoryRate/insert', list)
  },

  /**
   * 파트너 인벤토리 재고설정 요일 설정 정보 조회
   */
  selectPartnerInventoryRateDayList () {
    return api.get('/api/system/partnerInventoryRate/dayList')
  },

  /**
   * 파트너 인벤토리 재고설정 요일 설정 정보 입력
   * @param list
   */
  insertPartnerInventoryRateDayList (list) {
    return api.post('/api/system/partnerInventoryRate/dayInsert', list)
  },

  /**
   * 파트너 인벤토리 재고설정 객실 설정 정보 조회
   */
  selectPartnerInventoryRateTypeList () {
    return api.get('/api/system/partnerInventoryRate/typeList')
  },

  /**
   * 파트너 인벤토리 재고설정 객실 설정 정보 입력
   * @param list
   */
  insertPartnerInventoryRateTypeList (list) {
    return api.post('/api/system/partnerInventoryRate/typeInsert', list)
  }
}

export default partnerInventoryRateService
