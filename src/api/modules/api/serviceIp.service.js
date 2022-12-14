import api from '@/api'

export default {

  /**
     * 업체 Api 서비스 IP 조회
     */
  selectServiceIpList (businessId) {
    return api.get(`/api/cms/ota/booking/serviceIp/${businessId}`)
  },

  /**
     * 업체 Api 서비스 IP 수정
     */
  updateServiceIpList (businessId, list) {
    return api.post(`/api/cms/ota/booking/serviceIp/update/${businessId}`, list)
  },

  /**
   * 업체 등록된 IP 리스트 불러오기
   */
  selectPartnerIpList (partnerSeq) {
    return api.get(`/api/cms/ota/booking/serviceIp/ipList/${partnerSeq}`)
  }
}
