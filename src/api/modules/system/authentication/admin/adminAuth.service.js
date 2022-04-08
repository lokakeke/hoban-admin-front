import api from '@/api'

const adminAuthService = {

  /**
   * 인증여부 조회
   */
  get () {
    return api.get('/api/cms/system/accountAuth/info')
  },
  /**
   * 2차 인증(아이디/비밀번호/인증코드)
   */
  login (params) {
    return api.post('/api/cms/system/admin/login', null, {
      params
    })
  },
  /**
   * 로그아웃
   */
  logout () {
    return api.post('/api/cms/system/admin/logout')
  },
  /**
     * 프로파일 정보조회
     */
  selectProfile () {
    return api.get('/api/cms/system/accountAuth/profile')
  },
  /**
   * 임시 패스워드 발급
   */
  createTemporaryPassword (loginId, type) {
    return api.get(`/api/cms/system/accountAuth/createTemporary/${loginId}/${type}`)
  },
  /**
   * 임시 패스워드 발급 - 로그인 화면
   */
  createTemporaryPasswordForLogin (form) {
    return api.post('/api/cms/system/accountAuth/createTemporary', form)
  },
  /**
     * 관리자 수정 - 개인 프로파일
     */
  updateAccountProfile (form) {
    return api.post('/api/cms/system/accountAuth/updateProfile', form)
  },
  /**
     * 관리자 비밀번호 수정
     */
  updateAccountPassword (form) {
    return api.post('/api/cms/system/accountAuth/updatePassword', form)
  },
  /**
   * 1차 로그인 인증 (id/password)
   */
  preLogin (param) {
    return api.post('/api/cms/system/accountAuth/preLogin', param)
  },
  /**
   * 인증번호 요청
   */
  requestCode (param) {
    return api.post('/api/cms/system/accountAuth/requestCode', param)
  },
  /**
   * 현재 비밀번호 확인
   * @param password 입력 비밀번호
   */
  confirmPassword (password) {
    return api.post('/api/cms/system/accountAuth/confirmPassword', password)
  }
}
export default adminAuthService
