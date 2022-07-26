import api from '@/api'

export default {
  /**
   * 예치금 이력 목록 조회
   */
  selectDepositHistoryList (params) {
    return api.get('/api/cms/ota/booking/deposit/history/list', { params })
  },
  /**
   * 부킹 예치금 이력 상세 조회
   */
  selectBookingDepositHistory (historySeq) {
    return api.get(`/api/cms/ota/booking/deposit/history/${historySeq}`)
  },
  /**
   * 입장권 예치금 이력 상세 조회
   */
  selectTicketDepositHistory (historySeq) {
    return api.get(`/api/cms/ota/ticket/deposit/history/${historySeq}`)
  }
}
