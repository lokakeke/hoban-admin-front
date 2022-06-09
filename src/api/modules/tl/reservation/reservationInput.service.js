import api from '@/api'

const reservationInputService = {
  /**
     * 예약 정보 목록
     */
  selectReservationInputList (param) {
    return api.get('/api/cms/tl/booking/reservation/reservationInput/list', {
      params: param
    })
  },
  /**
     * 예약 정보 상세조회
     */
  selectReservationInputDetail (brcNo, inputNo, inputDtlNo) {
    console.log('selectReservationInputDetail')
    return api.get(`/api/cms/tl/booking/reservation/reservationInput/${brcNo}/${inputNo}/${inputDtlNo}`)
  },
  updateReservationNoHistorycConfirm (param) {
    return api.post('/api/cms/tl/booking/reservation/reservationInput/noHistoryConfirm', param)
  }
}
export default reservationInputService
