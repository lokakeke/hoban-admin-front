import api from "Api"

export default {
  /**
  * 우대번호 번호 등록관리 목록 조회
  */
  selectTicketRegistList (param) {
    return api.get('/api/social/ticket/manage/list', { params: param })
  },
  /**
   * 우대번호 추가발행 목록조회
   */
  selectAddTicketList (param) {
    return api.get('/api/social/ticket/add/list', { params: param })
  },
  /**
  * 우대번호 추가발행
  */
  insertAddTicket (param) {
    return api.post('/api/social/ticket/add/insert', param)
  },
  /**
   * 업체 상품 URL 조회
   */
  selectGoodsList (ticketNo) {
    return api.get(`/api/social/ticket/goods/${ticketNo}`)
  },
  /**
   * 업체 상품 URL 등록
   */
  insertGoodsList (param) {
    return api.post('/api/social/ticket/goods/insert', param)
  },
  /**
   * 통계 목록 조회
   */
  selectStatisList (param) {
    return api.get('/api/social/ticket/statis/list', { params: param })
  },
  /**
   * 통계 정보 저장
   */
  saveTicketStatis (param) {
    return api.post('/api/social/ticket/statis/insert', param)
  },
  /**
   * 영업장 목록 조회
   */
  selectLcalCdList () {
    return api.get('/api/social/ticket/statis/lcal/list')
  }
}
