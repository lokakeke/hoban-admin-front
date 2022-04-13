import api from '@/api'

const partnerManagerService = {

  /**
   * 파트너 담당자 리스트 조회
   * @param ptnrNo
   * @returns 담당자 리스트
   */
  selectPartnerManagerList (ptnrNo) {
    return api.get(`/api/cms/system/partnerCharge/list/${ptnrNo}`)
  },

  /**
   * 로그인 파트너 담당자 정보 조회
   * @return 로그인 파트너 담당자 정보
   */
  selectPartnerManager () {
    return api.get('/api/cms/system/partnerCharge/info')
  },

  /**
   * 파트너 담당자 정보 조회
   * @param param 파트너 담당자 정보
   */
  selectPartnerManagerDetail (param) {
    return api.get('/api/cms/system/partnerCharge/detail', {
      params: param
    })
  },

  /**
   * 파트너 담당자 ID 사용가능 여부 체크
   * @param ptnrChrgId
   * @returns 파트너 담당자 ID 사용가능 여부
   */
  checkPartnerChargeId (ptnrChrgId) {
    return api.get(`/api/cms/system/partnerCharge/check/${ptnrChrgId}`)
  },

  /**
   * 파트너 담당자 생성
   * @param form
   * @returns AxiosPromise<any>
   */
  insertPartnerManager (form) {
    return api.post('/api/cms/system/partnerCharge/insert', form)
  },

  /**
   * 로그인 파트너 담당자 추가
   * @param form
   * @returns AxiosPromise<any>
   */
  addPartnerManager (form) {
    return api.post('/api/cms/system/partnerCharge/add', form)
  },

  /**
   * 로그인 파트너 담당자 연락처 추가 인증번호 요청
   * @param param
   * @returns Promise<any>
   */
  requestCode (param) {
    return api.get('api/cms/system/partner/manager/requestCode', {
      params: param
    })
  },

  /**
   * 파트너 담당자 수정
   * @param form
   * @returns AxiosPromise<any>
   */
  updatePartnerManager (form) {
    return api.post('/api/cms/system/partnerCharge/update', form)
  },

  /**
   * 파트너 담당자 프로파일 수정
   * @param form
   * @returns AxiosPromise<any>
   */
  updatePartnerManagerProfile (form) {
    return api.post('/api/cms/system/partnerCharge/updateProfile', form)
  },

  /**
   * 파트너 담당자 삭제
   * @param ptnrNo
   * @param ptnrChrgId
   */
  deletePartnerManager (ptnrNo, ptnrChrgId) {
    return api.get(`/api/cms/system/partnerCharge/delete/${ptnrNo}/${ptnrChrgId}`)
  }

}

export default partnerManagerService
