import api from '@/api'

const partnerAuthService = {

  /**
     * 2차 인증(아이디/비밀번호/인증코드)
     */
  login (params) {
    return api.post('/api/cms/system/partnerAuth/login', null, {
      params
    })
  },
  /**
     * 임시 패스워드 전송 정보 리스트
     * @param loginId
     */
  selectTargetList (loginId) {
    return api.get(`/api/cms/system/partnerAuth/targetList/${loginId}`)
  },
  /**
     * 추가 인증번호 생성
     * @returns {promise<any>}
     */
  createAddAuthNo () {
    return api.get('/api/cms/system/partnerAuth/createAddAuthNo')
  },

  /**
     * 파트너 담당자 프로파일 수정
     * @param form
     * @returns AxiosPromise<any>
     */
  updatePartnerManagerProfile (form) {
    return api.post('/api/cms/system/partnerAuth/manager/updateProfile', form)
  },

  requestCodeAddManager (form) {
    return api.post('/api/cms/system/partnerAuth/manager/requestCode', form)
  },

  addPartnerManagerInPreLogin (form) {
    return api.post('/api/cms/system/partnerAuth/manager', form)
  }
}
export default partnerAuthService
