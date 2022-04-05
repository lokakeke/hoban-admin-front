import api from '@/api'

export default {

  /**
  * 우대번호 거래내역 조회
  */
  selectTicketHistoryList (param) {
    return api.get('/api/social/reservation/historyList', { params: param })
  },
  /**
   * 우대번호 상태변경
   */
  updateTicketState (param) {
    return api.post('/api/social/reservation/stateUpdate', param)
  },
  /**
   * 전화번호 가져오기
   */
  selectPhoneNo (param) {
    return api.get('/api/social/reservation/phoneNo', { params: param })
  }

}
