import api from '@/api'

const storeService = {
  /**
   * PMS 영업장 목록조회
   */
  selectStoreList () {
    return api.get('/api/pms/product/store/list')
  },

  /**
   * PMS 영업장 간단 목록조회
   */
  selectStoreSimpleList () {
    return api.get('/api/pms/product/store/simpleList')
  },

  /**
   * PMS 객실타입 간단 목록조회
   */
  selectRmTypeSimpleList () {
    return api.get('/api/pms/product/store/rmTypeSimpleList')
  },

  /**
   * 파트너 재고관리 사용중인 영업장/객실 목록
   */
  selectPartnerInventoryStoreList () {
    // FIXME '/api/pms/product/store/partnerInventoryStoreList' 를 호출 했지만, 일단 아래와 같이 변경함
    return api.get('/api/pms/product/store/roomTypeHierarchyList')
  },

  /**
   * 지역코드, 명
   */
  selectLcalCodeList () {
    return api.get('/api/pms/product/store/lcalCodeList')
  },

  /**
   * 지역코드, 명 (영업장 정보, 객실타입 정보 포함)
   */
  selectLcalCodeAllList () {
    return api.get('/api/pms/product/store/localCodeAllList')
  }

}

export default storeService
