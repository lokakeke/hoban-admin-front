import api from '@/api'

const accountService = {

  /**
     * 관리자 목록조회
     */
  selectAccountList (param) {
    return api.get('/api/cms/system/accounts/list', {
      params: param
    })
  },

  /**
     * 관리자 정보조회
     */
  selectAccount (loginId) {
    return api.get(`/api/cms/system/accounts/detail/${loginId}`)
  },

  /**
     * 관리자 등록
     */
  insertAccount (form) {
    return api.post('/api/cms/system/accounts/insert', form)
  },

  /**
     * 관리자 수정
     */
  updateAccount (form) {
    return api.post(`/api/cms/system/accounts/update/${form.loginId}`, form)
  },

  /**
   * 관리자 로그인 아이디 자동생성
   */
  createLoginId () {
    return api.get('/api/cms/system/accounts/createLoginId')
  }

}
export default accountService
