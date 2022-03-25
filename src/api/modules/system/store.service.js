import api from "Api"

const storeService = {
  /**
   * d.g.n.s 영업장 목록조회
   */
  selectStoreList () {
    return api.get('/api/system/store/list')
  },

  /**
   * d.g.n.s 영업장 간단 목록조회
   */
  selectStoreSimpleList () {
    return api.get('/api/system/store/simpleList')
  },

  /**
   * d.g.n.s 객실타입 간단 목록조회
   */
  selectRmTypeSimpleList () {
    return api.get('/api/system/store/rmTypeSimpleList')
  },

  /**
   * 파트너 재고관리 사용중인 영업장/객실 목록
   */
  selectPartnerInventoryStoreList () {
    return api.get('/api/system/store/partnerInventoryStoreList')
  },

  /**
   * 지역코드, 명
   */
  selectLcalCdList () {
    return api.get('/api/system/store/lcalCdList')
  },

  /**
   * 지역코드, 명 (영업장 정보, 객실타입 정보 포함)
   */
  selectLcalCdAllList () {
    return api.get('/api/system/store/lcalCdAllList')
  }
}

export default storeService
