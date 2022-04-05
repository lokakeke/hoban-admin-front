import api from '@/api'

const commissionPromotionService = {
  /**
   * 프로모션 수수료 그룹 목록 조회
   */
  selectCommissionPromotionGroupList (param) {
    return api.get('/api/ota/commission/promotion/group/list', {
      params: param
    })
  },

  /**
   * 프로모션 수수료 목록 조회
   */
  selectCommissionPromotionList (memNo) {
    return api.get(`/api/ota/commission/promotion/list/${memNo}`)
  },

  /**
   * 프로모션 수수료 Map 조회
   */
  selectCommissionPromotionMap (memNo, applyBgnYmd, applyEndYmd) {
    return api.get(`/api/ota/commission/promotion/map/${memNo}/${applyBgnYmd}/${applyEndYmd}`)
  },

  /**
   * 프로모션 수수료 등록
   */
  insertCommissionPromotion (memNo, applyBgnYmd, applyEndYmd, commissionPromotionMap) {
    return api.post(`/api/ota/commission/promotion/insert/${memNo}/${applyBgnYmd}/${applyEndYmd}`, commissionPromotionMap)
  },

  /**
   * 프로모션 수수료 수정
   */
  updateCommissionPromotion (memNo, applyBgnYmd, applyEndYmd, commissionPromotionMap) {
    return api.post(`/api/ota/commission/promotion/update/${memNo}/${applyBgnYmd}/${applyEndYmd}`, commissionPromotionMap)
  },

  /**
   * 프로모션 수수료 사용여부 수정
   */
  updateCommissionPromotionUseYn (memNo, applyBgnYmd, applyEndYmd, useYn) {
    return api.post(`/api/ota/commission/promotion/update/use/${memNo}/${applyBgnYmd}/${applyEndYmd}/${useYn}`)
  },

  /**
   * 프로모션 수수료 삭제
   */
  deleteCommissionPromotion (memNo, applyBgnYmd, applyEndYmd) {
    return api.post(`/api/ota/commission/promotion/delete/${memNo}/${applyBgnYmd}/${applyEndYmd}`)
  }
}

export default commissionPromotionService
