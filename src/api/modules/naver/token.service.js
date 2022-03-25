import api from 'Api'

export default {
  /**
   * 토큰 목록 조회
   */
  selectTokenList () {
    return api.get('/api/naver/token')
  },

  /**
   * 토큰 갱신
   */
  updateToken (param) {
    return api.post(`/api/naver/token/update/${param.userId}`, param)
  }

}
