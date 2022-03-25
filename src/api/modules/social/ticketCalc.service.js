import api from 'Api'

export default {
  /**
  * 정산 그룹번호 목록 조회
  */
  selectCalcGroupList (param) {
    return api.get('/api/social/ticket/calcGroup/list', { params: param })
  },
  /**
   * 정산 그룹번호 상세 조회
   */
  selectCalcGroupDetail (calcNo) {
    return api.get(`/api/social/ticket/calcGroup/${calcNo}`)
  },
  /**
   * 정산 그룹번호 생성
   */
  insertCalcGroup (param) {
    return api.post('/api/social/ticket/calcGroup/insert', param)
  },
  /**
   * 우대번호 정산 페이지 조회
   */
  selectTicketCalcInfo (ticketNo) {
    return api.get(`/api/social/ticket/calc/${ticketNo}`)
  },
  /**
   * 우대번호 정산 페이지 등록
   */
  insertTicketCalcInfo (param) {
    return api.post('/api/social/ticket/calc/insert', param)
  }
}
