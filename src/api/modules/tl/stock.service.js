import api from '@/api'

const stockService = {

  /**
   * 재고 기초입력
   */
  updateStockSet(body) {
    return api.post('/api/cms/tl/booking/stock/set', body)
  },

  /**
   * 재고 기간조회
   */
  selectStockList(param) {
    return api.post('/api/cms/tl/booking/stock/list', param)
  },

  /**
   * 재고 입력
   */
  insertStock(masterList) {
    return api.post('/api/cms/tl/booking/stock/insert', masterList)
  },

  /**
   * 재고 입력 진행상황조회
   */
  selectStockProgress() {
    api.disableProgress()
    return api.get('/api/cms/tl/api/processList')
  }

}
export default stockService
