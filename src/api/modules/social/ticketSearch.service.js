import api from "Api"

export default {

  /**
   * 우대번호 목록 조회
   */
  selectTicketList (param) {
    return api.get('/api/social/ticket/list', { params: param })
  },
  /**
   * 우대번호 상세 조회
   */
  selectTicketDetail (ticketNo) {
    return api.get(`/api/social/ticket/${ticketNo}`)
  },
  /**
   * 판매채널 목록조회
   */
  selectSaleChnnlList () {
    return api.get('/api/social/ticket/chnnl/list')
  },
  /**
  * 우대번호 정보 등록
  */
  insertTicketInfo (param) {
    return api.post('/api/social/ticket/insert', param)
  },
  /**
  * 우대번호 정보 수정
  */
  updateTicketInfo (param) {
    return api.post('/api/social/ticket/update', param)
  },
  /**
   * 운영 담당자 삭제
   */
  deleteProdChrg (param) {
    return api.post('/api/social/ticket/deleteProdChrg', param)
  }
}
