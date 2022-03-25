import api from 'Api'

const partnerInventoryDetailSetService = {

  /**
   * 파트너 인벤토리 상세설정 조회
   */
  selectPartnerInventoryDetailSetList (param) {
    return api.get('/api/system/partnerInventoryDetailSet/list', {
      params: param
    })
  },

  /**
   * 파트너 인벤토리 상세설정 입력
   */
  insertPartnerInventoryDetailSetList (param) {
    return api.post('/api/system/partnerInventoryDetailSet/insert', param)
  }

}

export default partnerInventoryDetailSetService
