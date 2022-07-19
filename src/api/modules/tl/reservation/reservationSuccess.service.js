import api from '@/api'

const reservationSuccessService = {

  /**
     * 룸타입 목록조회
     */
  selectReservationSuccessList (param) {
    return api.get('/api/cms/tl/booking/reservation/reservationSuccess/list', {
      params: param
    })
  },

  selectReservationSuccessDetail (branchNo, successNo) {
    return api.get(`/api/cms/tl/booking/reservation/reservationSuccess/${branchNo}/${successNo}`)
  }
}
export default reservationSuccessService
