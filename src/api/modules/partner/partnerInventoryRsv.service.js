import api from '@/api'

const partnerInventoryRsvService = {

  /**
   * 파트너 인벤토리 예약내역 조회
   */
  selectPartnerInventoryRsvList (param) {
    return api.get('/api/cms/system/partnerInventoryRsv/list', {
      params: param
    })
  }

}

export default partnerInventoryRsvService
