import api from "Api"

export default {
  /**
   * 예치금 계좌 목록 조회
   */
  selectDepositAccountList (params) {
    return api.get('/api/system/deposit/account/list', { params })
  },
  /**
   * 예치금 계좌 상세 조회
   */
  selectDepositAccount (depoKey) {
    return api.get(`/api/system/deposit/account/${depoKey}`)
  },
  /**
   * 예치금 계좌 등록
   */
  insertDepositAccount (params) {
    return api.post('/api/system/deposit/account/insert', params)
  },
  /**
   * 예치금 계좌 수정
   */
  updateDepositAccount (params) {
    return api.post('/api/system/deposit/account/update', params)
  },
  /**
   * 파트너 예치금 부족상태 조회
   */
  selectPartnerDepositCheck () {
    return api.get('/api/system/deposit/account/partner/check')
  },
  /**
   * 예치금 초기화 (증권 기준)
   */
  updateScheduleDepositInitList (params) {
    return api.post('/api/system/deposit/account/schedule/update', params)
  },
  /**
   * 예치금 초기화 (사용자 정의 기준-미리보기)
   */
  getDepositInitCustomPreView (params) {
    return api.post('/api/system/deposit/schedule/init/custom/get/preView', params)
  },
  /**
   * 예치금 초기화 (사용자 정의 기준)
   */
  updateScheduleDepositInitCustomList (params) {
    return api.post('/api/system/deposit/account/schedule/update/custom', params)
  }
}
