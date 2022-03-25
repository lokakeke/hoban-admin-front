import api from "Api"

const partnerService = {

  /**
     * 가맹점 목록 조회
     */
  selectPartnerList (param) {
    return api.get('/api/system/partnerManagement/list', { params: param })
  },

  /**
   * 가맹점 전체 목록 조회
   */
  selectPartnerFullList () {
    return api.get('/api/system/partnerManagement/fullList')
  },

  /**
     * 가맹점 기본정보 등록
     */
  insertPartnerManagement (param) {
    return api.post('/api/system/partnerManagement/insert', param)
  },

  /**
     * 가맹점 기본정보 수정
     */
  updatePartnerManagement (param) {
    return api.post(`/api/system/partnerManagement/update/${param.ptnrNo}`, param)
  },

  /**
   * 파트너 로그인 아이디 중복체크
   * @param id
   */
  checkLoginId (id) {
    return api.get(`/api/system/partnerManagement/check/${id}`)
  },

  /**
   * 가맹점 기본정보 수정 - 프로필 화면
   * @param param
   */
  updatePartnerManagementBasicInfo (param) {
    return api.post(`/api/system/partnerManagement/updateBasic/${param.ptnrNo}`, param)
  },

  /**
     * 가맹점 상세(기본정보) 조회
     */
  selectPartnerDetails (partnerNo) {
    return api.get(`/api/system/partnerManagement/detail/${partnerNo}`)
  },

  /**
   * 추가 인증번호 생성
   * @returns {promise<any>}
   */
  createAddCrtfNo () {
    return api.get('/api/system/partnerManagement/createAddCrtfNo')
  },

  /**
   * 예약을 위한 파트너 기본정보 조회
   * @returns {promise<any>}
   */
  selectPtnrInfoForRsv (param) {
    return api.get('/api/system/partnerManagement/ptnrInfoForRsv', { params: param })
  }
}

export default partnerService
