import api from '@/api'

const sendStockService = {

  /**
   * 리스트 조회
   */
  selectList(param) {
    return api.get('/api/cms/tl/booking/sendStock/list', { params: param })
  },

  /**
   * 상세 데이터 조회
   */
  selectDetail(brcNo, sendNo) {
    return api.get(`/api/cms/tl/booking/sendStock/${brcNo}/${sendNo}`)
  }

}
export default sendStockService
