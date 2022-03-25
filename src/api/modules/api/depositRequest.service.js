import api from 'Api'

export default {
  /**
   * 예치금 신청 목록 조회
   */
  selectDepositRequestList (params) {
    return api.get('/api/system/deposit/request/list', { params })
  },
  /**
   * 예치금 신청 상세 조회
   */
  selectDepositRequest (appSeq) {
    return api.get(`/api/system/deposit/request/${appSeq}`)
  },
  /**
   * 예치금 신청 등록
   */
  insertDepositRequest (params) {
    return api.post('/api/system/deposit/request/insert', params)
  },
  /**
   * 예치금 신청 수정
   */
  updateDepositRequest (params) {
    return api.post('/api/system/deposit/request/update', params)
  },
  /**
   * 예치금 신청 승인/반려
   */
  approvalDepositRequest (params) {
    return api.post('/api/system/deposit/request/approval', params)
  }
}
