import api from '@/api'

const partnerRequestService = {

  /**
   * 신청관리 > 위약환불신청 목록 조회
   */
  selectPartnerRequestList (params) {
    return api.get('/api/cms/system/partnerRequest/list', {
      params
    })
  },

  /**
   * 신청관리 > 위약환불신청 조회
   */
  selectPartnerRequest (requestSeq) {
    return api.get(`/api/cms/system/partnerRequest/${requestSeq}`)
  },

  /**
   * 신청관리 > 위약환불신청 수정
   */
  updatePartnerRequest (form) {
    return api.post(`/api/cms/system/partnerRequest/update/${form.requestSeq}`, form)
  },

  /**
   * 신청관리 > 위약환불신청 수정(관리자)
   */
  updatePartnerRequestForAdmin (form) {
    return api.post(`/api/cms/system/partnerRequest/updateForAdmin/${form.requestSeq}`, form)
  },

  /**
   * 신청관리 > 위약환불신청 등록
   */
  insertPartnerRequest (form) {
    return api.post('/api/cms/system/partnerRequest/insert', form)
  },

  /**
   * 신청관리 > 위약환불신청 신청취소
   */
  updatePartnerRequestCancel (requestSeq) {
    return api.post(`/api/cms/system/partnerRequest/cancel/${requestSeq}`)
  }

}
export default partnerRequestService
