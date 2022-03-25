import api from 'Api'

const blockService = {
  /**
   * d.g.n.s 블럭별 재고 조회
   */
  selectBlockInventoryList (param) {
    return api.get('/api/system/block/inventoryList', {
      params: param
    })
  }
}

export default blockService
