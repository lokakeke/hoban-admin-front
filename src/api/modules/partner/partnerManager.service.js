import api from '@/api'

const partnerManagerService = {

  /**
   * 파트너 담당자 리스트 조회
   * @param partnerSeq
   * @returns 담당자 리스트
   */
  selectPartnerManagerList (partnerSeq) {
    return api.get(`/api/cms/ota/booking/partnerManager/list/${partnerSeq}`)
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
   * @param partnerManagerId
   * @returns 파트너 담당자 ID 사용가능 여부
   */
  checkPartnerChargeId (partnerManagerId) {
    return api.get(`/api/cms/system/partnerCharge/check/${partnerManagerId}`)
  },

  /**
   * 파트너 담당자 생성
   * @param form
   * @returns AxiosPromise<any>
   */
  insertPartnerManager (form) {
    return api.post('/api/cms/ota/booking/partnerManager/insert', form)
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
    return api.post('api/cms/system/accountAuth/requestCode', param)
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
   * @param partnerSeq
   * @param partnerManagerId
   */
  deletePartnerManager (partnerSeq, partnerManagerId) {
    return api.get(`/api/cms/system/partnerCharge/delete/${partnerSeq}/${partnerManagerId}`)
  }

}

export default partnerManagerService
