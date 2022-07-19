import api from '@/api'

export default {
  /**
   * 토큰 목록 조회
   */
  selectTokenList () {
    return api.get('/api/cms/naver/booking/token')
  },

  /**
   * 토큰 갱신
   */
  updateToken (param) {
    return api.post(`/api/cms/naver/booking/token/update/${param.userId}`, param)
  }

}
