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
  selectReservationErrorDetail (brcNo, hstNo) {
    return api.get(`/api/cms/tl/booking/reservation/reservationError/${brcNo}/${hstNo}`)
  },

  updateReservationErrorConfirm (param) {
    return api.post('/api/cms/tl/booking/reservation/reservationError/update', param)
  }

}
export default reservationErrorService
