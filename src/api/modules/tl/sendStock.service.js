import api from '@/api'

const sendStockService = {

  /**
   * 리스트 조회
   */
  selectList (param) {
    return api.get('/api/cms/tl/booking/sendStock/list', { params: param })
  },

  /**
   * 상세 데이터 조회
   */
  selectDetail (branchNo, sendNo) {
    return api.get(`/api/cms/tl/booking/sendStock/${branchNo}/${sendNo}`)
  }

}
export default sendStockService
