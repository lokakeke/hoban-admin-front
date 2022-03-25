import api from "Api"

const partnerInventoryExpectService = {

  /**
   * 파트너 인벤토리 재고현황 조회
   */
  selectPartnerInventoryExpectList (param) {
    return api.post('/api/system/partnerInventoryExpect/list', param)
  },

  /**
   * 파트너 인벤토리 예상 영업장 리스트
   */
  selectInventoryExpectStoreList () {
    return api.get('/api/system/partnerInventoryExpect/storeList')
  },

  /**
   * 파트너 인벤토리 재할당
   * @param selectDate
   */
  reassignPartnerInventory (selectDate) {
    return api.get('/api/system/partnerInventoryExpect/reassign', { params: { selectDate } })
  }
}

export default partnerInventoryExpectService
