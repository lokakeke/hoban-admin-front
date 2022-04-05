import api from '@/api'

export default {
  /**
     * 가맹점 이용정보 목록 조회
     */
  selectPartnerTermList (param) {
    return api.get('/api/cms/system/partnerTerm/list', { params: param })
  },

  /**
   * 회원번호 및 회원명 조회
   */
  selectDefaultPtnrInfo () {
    return api.get('/api/cms/system/partnerTerm/defaultPtnrInfo')
  }
}
