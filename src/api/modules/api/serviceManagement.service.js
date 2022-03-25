import api from 'Api'

export default {

  /**
     * 업체 API 서비스 목록 조회
     */
  selectServiceManagementList (param) {
    return api.get('/api/system/serviceManagement/list', { params: param })
  },

  /**
   * 업체 API 서비스에서 사용중인 업무구분/판매채널 코드 리스트
   */
  selectPartnerCodeList () {
    return api.get('/api/system/serviceManagement/codeList')
  },

  /**
     * 업체 Agent Code 목록 조회
     */
  selectAgentCodeList (param) {
    return api.get('/api/system/serviceManagement/agentList', { params: param })
  },

  /**
     * 업체 API 서비스 기본정보 조회
     */
  selectServiceInformation (businessId) {
    return api.get(`/api/system/serviceManagement/detail/${businessId}`)
  },

  /**
     * Business ID 자동생성
     */
  createBusinessID (ptnrNo) {
    return api.get(`/api/system/serviceManagement/createBusinessID/${ptnrNo}`)
  },

  /**
     * 인증토큰 재발행
     */
  createTokenKey (businessId) {
    return api.get(`/api/system/serviceManagement/createTokenKey/${businessId}`)
  },

  /**
     * Business ID 중복체크
     */
  checkBusinessID (businessId) {
    return api.get(`/api/system/serviceManagement/checkBusinessID/${businessId}`)
  },

  /**
     * 업체 API 서비스 입력
     */
  insertServiceManagement (serviceManagementForm) {
    return api.post('/api/system/serviceManagement/insert', serviceManagementForm)
  },

  /**
     * 업체 API 서비스 입력
     */
  updateServiceManagement (serviceManagementForm) {
    return api.post(`/api/system/serviceManagement/update/${serviceManagementForm.businessId}`, serviceManagementForm)
  }
}
