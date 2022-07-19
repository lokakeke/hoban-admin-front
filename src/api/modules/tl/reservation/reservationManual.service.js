import api from '@/api'

const reservationManualService = {

  /**
     * 룸타입 목록조회
     */
  selectReservationManualList (param) {
    return api.get('/api/cms/tl/booking/reservation/reservationManual/list', {
      params: param
    })
  },

  selectReservationManualDetail (branchNo, manualNo) {
    return api.get(`/api/cms/tl/booking/reservation/reservationManual/${branchNo}/${manualNo}`)
  },

  updateReservationManual (param) {
    return api.post('/api/cms/tl/booking/reservation/reservationManual/update', param)
  },
  updateReservationManualConfirm (param) {
    return api.post('/api/cms/tl/booking/reservation/reservationManual/updateConfirm', param)
  }
}
export default reservationManualService
