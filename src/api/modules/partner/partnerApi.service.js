import api from '@/api'

const partnerApiService = {

  /**
   * 파트너 API 리스트 조회
   * @param partnerSeq
   * @returns API 리스트
   */
  selectPartnerApiList (partnerSeq) {
    return api.get(`/api/cms/system/partnerApi/list/${partnerSeq}`)
  },

  /**
   * 파트너 API 정보 조회
   * @param partnerSeq
   * @param apiInd
   * @return 파트너 API 정보
   */
  selectPartnerApi (partnerSeq, apiInd) {
    return api.get(`/api/cms/system/partnerApi/info/${partnerSeq}/${apiInd}`)
  },

  /**
   * 파트너 API 생성
   * @param form
   * @returns AxiosPromise<any>
   */
  insertPartnerApi (form) {
    return api.post('/api/cms/system/partnerApi/insert', form)
  },

  /**
   * 파트너 API 수정
   * @param form
   * @returns AxiosPromise<any>
   */
  updatePartnerApi (form) {
    return api.post('/api/cms/system/partnerApi/update', form)
  },

  /**
   * 파트너 API 삭제
   * @param partnerSeq
   * @param apiInd
   */
  deletePartnerApi (partnerSeq, apiInd) {
    return api.get(`/api/cms/system/partnerApi/delete/${partnerSeq}/${apiInd}`)
  },

  /**
   * 파트너 API 요금전송 테스트
   * @param form
   * @returns AxiosPromise<any>
   */
  testSendRoomAmount (form) {
    return api.post('/api/cms/system/partnerApi/testSendRoomAmount', form)
  }
}

export default partnerApiService
