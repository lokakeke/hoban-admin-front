import api from "Api"

export default {

  /**
   * 우대번호 발권 변경 조회
   */
  selectTicketingUpdateList (param) {
    return api.get('/api/social/reservation/ticketingList', { params: param })
  },
  /**
   * 우대번호 발권 변경 우대번호 상태 조회
   */
  selectTicketingStatus (param) {
    return api.get('/api/social/reservation/ticketingStatus', { params: param })
  },
  /**
   * 우대번호 상태변경
   */
  updateTicketState (param) {
    return api.post('/api/social/reservation/stateUpdate', param)
  },
  /**
   * 우대번호 발권 변경 (상태 일괄 변경 가능 체크)
   */
  checkTicketSeqStatus (param) {
    return api.get('/api/social/reservation/checkStatus', { params: param })
  },
  /**
   * 우대번호 발권 변경 (상태 일괄 변경)
   */
  updateTicketSeqStatus (param) {
    return api.post('/api/social/reservation/stateAllUpdate', param)
  }

}
