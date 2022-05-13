import api from '@/api'

const priceService = {

  /**
   * 금액 기초입력
   */
  updatePriceSet(body) {
    return api.post('/api/cms/tl/booking/price/set', body)
  },

  /**
   * 금액 기간조회
   */
  selectPriceList(param) {
    return api.post('/api/cms/tl/booking/price/list', param)
  }
}
export default priceService
