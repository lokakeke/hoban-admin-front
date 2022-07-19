import api from '@/api'

const reservationErrorService = {

  /**
     * 룸타입 목록조회
     */
  selectReservationErrorList (param) {
    return api.get('/api/cms/tl/booking/reservation/reservationError/list', {
      params: param
    })
  },
  selectReservationErrorDetail (branchNo, historyNo) {
    return api.get(`/api/cms/tl/booking/reservation/reservationError/${branchNo}/${historyNo}`)
  },

  updateReservationErrorConfirm (param) {
    return api.post('/api/cms/tl/booking/reservation/reservationError/update', param)
  }

}
export default reservationErrorService
