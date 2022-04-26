import api from '@/api'

const partnerAccountService = {

  /**
     * 가맹점 목록 조회
     */
  selectPartnerList (param) {
    return api.get('/api/cms/system/partner/list', { params: param })
  },

  /**
   * 가맹점 전체 목록 조회
   */
  selectPartnerFullList () {
    return api.get('/api/cms/system/partnerAccount/fullList')
  },

  /**
     * 가맹점 기본정보 등록
     */
  insertPartner (param) {
    return api.post('/api/cms/system/partner/insert', param)
  },

  /**
     * 가맹점 기본정보 수정
     */
  updatePartner (param) {
    return api.post(`/api/cms/system/partner/update/${param.partnerSeq}`, param)
  },

  /**
   * 파트너 로그인 아이디 중복체크
   * @param id
   */
  checkLoginId (id) {
    return api.get(`/api/cms/system/partner/check/${id}`)
  },

  /**
   * 가맹점 기본정보 수정 - 프로필 화면
   * @param param
   */
  updatePartnerBasicInfo (param) {
    return api.post(`/api/cms/system/partner/updateBasic/${param.partnerSeq}`, param)
  },

  /**
     * 가맹점 상세(기본정보) 조회
     */
  selectPartnerDetails (partnerNo) {
    return api.get(`/api/cms/system/partner/detail/${partnerNo}`)
  },

  /**
   * 추가 인증번호 생성
   * @returns {promise<any>}
   */
  createAddCrtfNo () {
    return api.get('/api/cms/system/partner/createAddCrtfNo')
  },

  /**
   * 예약을 위한 파트너 기본정보 조회
   * @returns {promise<any>}
   */
  selectPtnrInfoForRsv (param) {
    return api.get('/api/cms/system/partner/ptnrInfoForRsv', { params: param })
  }
}

export default partnerAccountService
