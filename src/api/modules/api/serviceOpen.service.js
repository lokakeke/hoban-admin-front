import api from 'Api'

export default {

  /**
     * 업체 Api 서비스 OPEN 조회
     */
  selectServiceOpenList (taskType, businessId) {
    return api.get(`/api/system/serviceOpen/${taskType}/${businessId}`)
  },

  /**
     * 업체 Api 서비스 OPEN 수정
     */
  updateServiceOpenList (businessId, list) {
    return api.post(`/api/system/serviceOpen/update/${businessId}`, list)
  },

  /**
   * 서비스 타입별 업체 사용목록 전체조회
   * @param taskType
   * @param svcCd
   */
  selectServiceOpenFullList (taskType, svcCd) {
    return api.get(`/api/system/serviceOpen/list/${taskType}/${svcCd}`)
  },

  updateServiceOpenFullList (list) {
    return api.post('/api/system/serviceOpen/updateFullList', list)
  }
}
