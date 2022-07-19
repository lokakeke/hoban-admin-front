import api from '@/api'

const rateService = {

  /**
   * 요율 검색
   */
  selectRate (param) {
    return api.get(`/api/cms/tl/booking/rate/${param.branch}/${param.agentCode}`)
  },

  /**
   * 요율 등록
   */
  insertRate (param) {
    return api.post('/api/cms/tl/booking/rate/insert', param)
  },

  /**
   * 요율 업데이트
   */
  updateRate (param) {
    return api.post('/api/cms/tl/booking/rate/update', param)
  },

  /**
   * 요율 삭제
   */
  deleteRate (param) {
    return api.post('/api/cms/tl/booking/rate/delete', param)
  }
}
export default rateService
