import api from '@/api'

export default {

  /**
     * 업체 Api 서비스 OPEN 조회
     */
  selectServiceOpenList (taskType, businessId) {
    return api.get(`/api/cms/system/serviceOpen/${taskType}/${businessId}`)
  },

  /**
     * 업체 Api 서비스 OPEN 수정
     */
  updateServiceOpenList (businessId, list) {
    return api.post(`/api/cms/system/serviceOpen/update/${businessId}`, list)
  },

  /**
   * 서비스 타입별 업체 사용목록 전체조회
   * @param taskType
   * @param svcCode
   */
  selectServiceOpenFullList (taskType, svcCode) {
    return api.get(`/api/cms/system/serviceOpen/list/${taskType}/${svcCode}`)
  },

  updateServiceOpenFullList (list) {
    return api.post('/api/cms/system/serviceOpen/updateFullList', list)
  }
}
