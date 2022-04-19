import api from '@/api'

const adminAccountService = {

  /**
     * 관리자 목록조회
     */
  selectAdminAccountList (param) {
    return api.get('/api/cms/system/adminAccount/list', {
      params: param
    })
  },

  /**
     * 관리자 정보조회
     */
  selectAdminAccount (loginId) {
    return api.get(`/api/cms/system/adminAccount/detail/${loginId}`)
  },

  /**
     * 관리자 등록
     */
  insertAdminAccount (form) {
    return api.post('/api/cms/system/adminAccount/insert', form)
  },

  /**
     * 관리자 수정
     */
  updateAdminAccount (form) {
    return api.post(`/api/cms/system/adminAccount/update/${form.loginId}`, form)
  },

  /**
   * 관리자 로그인 아이디 자동생성
   */
  createLoginId () {
    return api.get('/api/cms/system/adminAccount/createLoginId')
  }
}
export default adminAccountService
