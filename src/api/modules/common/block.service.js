import api from '@/api'

const blockService = {
  /**
   * PMS 블럭별 재고 조회
   */
  selectBlockInventoryList (param) {
    return api.get('/api/cms/system/block/inventoryList', {
      params: param
    })
  }
}

export default blockService
