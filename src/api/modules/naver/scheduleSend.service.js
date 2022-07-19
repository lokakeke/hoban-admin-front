import api from '@/api'

export default {

  /**
   * 검색기준 조회
   */
  selectSearchList (param) {
    return api.get(`/api/cms/naver/booking/scheduleSend/search/${param}`)
  },

  /**
   * 전송이력 목록 조회
   */
  selectScheduleSendMstList (param) {
    return api.get('/api/cms/naver/booking/scheduleSend', { params: param })
  },

  /**
   * 전송이력 상세 조회
   */
  selectScheduleSendDtlList (sendNo, param) {
    return api.get(`/api/cms/naver/booking/scheduleSend/${sendNo}`, { params: param })
  }

}
