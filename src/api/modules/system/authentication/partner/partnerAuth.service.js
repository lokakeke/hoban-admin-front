import api from '@/api'

const partnerAuthService = {

  /**
     * 인증여부 조회
     */
  get () {
    return api.get('/api/cms/system/partnerAuth/info')
  },
  /**
     * 2차 인증(아이디/비밀번호/인증코드)
     */
  login (params) {
    return api.post('/api/cms/system/partner/login', null, {
      params
    })
  },
  /**
     * 로그아웃
     */
  logout () {
    return api.post('/api/cms/system/partner/logout')
  },
  /**
     * 프로파일 정보조회
     */
  selectProfile () {
    return api.get('/api/cms/system/partnerAuth/profile')
  },
  /**
     * 임시 패스워드 발급
     */
  createTemporaryPassword (loginId, type) {
    return api.get(`/api/cms/system/partnerAuth/createTemporary/${loginId}/${type}`)
  },
  /**
     * 임시 패스워드 발급 - 로그인 화면
     */
  createTemporaryPasswordForLogin (form) {
    return api.post('/api/cms/system/partnerAuth/createTemporary', form)
  },
  /**
     * 관리자 수정 - 개인 프로파일
     */
  updateAccountProfile (form) {
    return api.post('/api/cms/system/partnerAuth/updateProfile', form)
  },
  /**
     * 관리자 비밀번호 수정
     */
  updateAccountPassword (form) {
    return api.post('/api/cms/system/partnerAuth/updatePassword', form)
  },
  /**
     * 1차 로그인 인증 (id/password)
     */
  preLogin (param) {
    // return api.post('/api/cms/system/partnerAuth/preLogin', param)
    return api.post('/api/cms/system/accountAuth/preLogin', param)
  },
  /**
     * 인증번호 요청
     */
  requestCode (param) {
    // TODO 사용 하는지 안하는지 확인 필요 partnerManagerAuth 에서 확인하는 것으로 보인다.
    return api.post('/api/cms/system/partnerAuth/requestCode', param)
  },
  /**
     * 현재 비밀번호 확인
     * @param password 입력 비밀번호
     */
  confirmPassword (password) {
    return api.post('/api/cms/system/partnerAuth/confirmPassword', password)
  },

  /**
     * 임시 패스워드 전송 정보 리스트
     * @param loginId
     */
  selectTargetList (loginId) {
    return api.get(`/api/cms/system/partnerAuth/targetList/${loginId}`)
  },

  /**
     * 관리자가 파트너로 로그인 (관리자만 사용할 것)
     * @param loginId 로그인 아이디
     */
  loginForAdmin (loginId) {
    return api.get(`/api/cms/system/partnerAuth/loginForAdmin/${loginId}`)
  }
}
export default partnerAuthService
