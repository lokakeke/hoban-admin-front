import api from '@/api'

const sendPriceService = {

  /**
   * 리스트 조회
   */
  selectList(param) {
    return api.get('/api/cms/tl/booking/sendPrice/list', { params: param })
  },

  /**
   * 마스터 데이터 조회
   */
  selectMst(sendNo) {
    return api.get(`/api/cms/tl/booking/sendPrice/mst/${sendNo}`)
  },

  /**
   * 상세 데이터 조회
   */
  selectDetail(sendNo, param) {
    return api.get(`/api/cms/tl/booking/sendPrice/${sendNo}`, { params: param })
  },

  /**
   * 금액 전송 승인
   */
  approveSendPrice(sendNos) {
    return api.post('/api/cms/tl/booking/sendPrice/approve', sendNos)
  },

  /**
   * 금액 전송 삭제
   */
  deleteSendPrice(sendNos) {
    return api.post('/api/cms/tl/booking/sendPrice/delete', sendNos)
  }
}
export default sendPriceService
