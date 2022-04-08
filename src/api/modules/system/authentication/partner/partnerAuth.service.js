import api from '@/api'

const partnerAuthService = {

  /**
   * 임시 패스워드 발급
   */
  createTemporaryPassword (loginId, ptnrChrgId, type) {
    return api.get('/api/cms/system/partnerAuth/createTemporary/', {
      params: {
        loginId,
        ptnrChrgId,
        type
      }
    })
  },

  /**
   * 임시 패스워드 발급 - 로그인 화면
   */
  createTemporaryPasswordForLogin (form) {
    return api.post('/api/cms/system/partnerAuth/createTemporary', form)
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
