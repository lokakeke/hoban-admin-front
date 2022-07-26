import api from '@/api'

export default {
  /**
   * 부킹 예치금 오류 목록 조회
   */
  selectBookingDepositFailureList (params) {
    return api.get('/api/cms/ota/booking/deposit/failure/list', { params })
  },

  /**
   * 입장권 예치금 오류 목록 조회
   */
  selectTicketDepositFailureList (params) {
    return api.get('/api/cms/ota/ticket/deposit/failure/list', { params })
  }
}
