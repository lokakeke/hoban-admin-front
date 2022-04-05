import api from '@/api'

export default {

  /**
     * 업체 API 서비스 목록 조회
     */
  selectServiceList (param) {
    return api.get('/api/cms/system/service/list', { params: param })
  },

  /**
   * 업체 API 서비스에서 사용중인 업무구분/판매채널 코드 리스트
   */
  selectPartnerCodeList () {
    return api.get('/api/cms/system/service/codeList')
  },

  /**
     * 업체 Agent Code 목록 조회
     */
  selectAgentCodeList (param) {
    return api.get('/api/cms/system/service/agentList', { params: param })
  },

  /**
     * 업체 API 서비스 기본정보 조회
     */
  selectServiceInformation (businessId) {
    return api.get(`/api/cms/system/service/detail/${businessId}`)
  },

  /**
     * Business ID 자동생성
     */
  createBusinessID (ptnrNo) {
    return api.get(`/api/cms/system/service/createBusinessID/${ptnrNo}`)
  },

  /**
     * 인증토큰 재발행
     */
  createTokenKey (businessId) {
    return api.get(`/api/cms/system/service/createTokenKey/${businessId}`)
  },

  /**
     * Business ID 중복체크
     */
  checkBusinessID (businessId) {
    return api.get(`/api/cms/system/service/checkBusinessID/${businessId}`)
  },

  /**
     * 업체 API 서비스 입력
     */
  insertService (serviceForm) {
    return api.post('/api/cms/system/service/insert', serviceForm)
  },

  /**
     * 업체 API 서비스 입력
     */
  updateService (serviceForm) {
    return api.post(`/api/cms/system/service/update/${serviceForm.businessId}`, serviceForm)
  }
}
