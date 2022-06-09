import api from '@/api'

const reservationHistoryService = {

  /**
     * 룸타입 목록조회
     */
  selectReservationHistoryList (param) {
    return api.get('/api/cms/tl/booking/reservation/reservationHistory/list', {
      params: param
    })
  }
}
export default reservationHistoryService
