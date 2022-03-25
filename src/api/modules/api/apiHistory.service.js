import api from "Api"

export default {

  /**
     * OTA & SOCIAL Api 이력 목록 조회
     */
  selectApiHistoryList (param) {
    return api.get('/api/history/apiLogList', { params: param })
  },

  /**
     * NAVER Api 이력 목록 조회
     */
  selectNaverApiHistoryList (param) {
    return api.get('/api/history/naver/apiLogList', { params: param })
  },

  /**
     * 상세화면에서 호출 버튼 클릭시 POST로 API 호출
     */
  selectPostApiCallAgain (url, token, param) {
    api.defaults.headers['X-AUTH-TOKEN'] = token
    return api.post(url, param)
  },

  /**
     * 상세화면에서 호출 버튼 클릭시 GET으로 API 호출
     */
  selectGetApiCallAgain (url, token, param) {
    api.defaults.headers['X-AUTH-TOKEN'] = token
    return api.get(url, { params: param })
  },

  /**
   * businessId OR 파트너명으로 리스트 조회
   */
  selectPartnerList (param) {
    return api.get('/api/system/apiLog/partnerInfoList', { params: param })
  },

  /**
   * 파트너 구분값 리스트 조회
   */
  selectCommCdForPartner () {
    return api.get('/api/system/apiLog/commCdForPartner')
  },
  /**
   *  Api 예약 이력 목록 조회
   */
  selectReservationHistoryList (param) {
    return api.get('/api/history/reservation/logList', { params: param })
  }
}
