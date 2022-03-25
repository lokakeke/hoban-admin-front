import api from "Api"

const partnerApiService = {

  /**
   * 파트너 API 리스트 조회
   * @param ptnrNo
   * @returns API 리스트
   */
  selectPartnerApiList (ptnrNo) {
    return api.get(`/api/system/partnerApi/list/${ptnrNo}`)
  },

  /**
   * 파트너 API 정보 조회
   * @param ptnrNo
   * @param apiInd
   * @return 파트너 API 정보
   */
  selectPartnerApi (ptnrNo, apiInd) {
    return api.get(`/api/system/partnerApi/info/${ptnrNo}/${apiInd}`)
  },

  /**
   * 파트너 API 생성
   * @param form
   * @returns AxiosPromise<any>
   */
  insertPartnerApi (form) {
    return api.post('/api/system/partnerApi/insert', form)
  },

  /**
   * 파트너 API 수정
   * @param form
   * @returns AxiosPromise<any>
   */
  updatePartnerApi (form) {
    return api.post('/api/system/partnerApi/update', form)
  },

  /**
   * 파트너 API 삭제
   * @param ptnrNo
   * @param apiInd
   */
  deletePartnerApi (ptnrNo, apiInd) {
    return api.get(`/api/system/partnerApi/delete/${ptnrNo}/${apiInd}`)
  },

  /**
   * 파트너 API 요금전송 테스트
   * @param form
   * @returns AxiosPromise<any>
   */
  testSendRoomAmount (form) {
    return api.post('/api/system/partnerApi/testSendRoomAmount', form)
  }
}

export default partnerApiService
