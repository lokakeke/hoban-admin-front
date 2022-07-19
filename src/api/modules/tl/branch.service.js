import api from '@/api'

const branchService = {

  /**
   * TL 사업장 목록조회
   */
  selectTLBranchList (param) {
    return api.get('/api/cms/tl/booking/branch/list', { params: param })
  },

  /**
   * TL 전체 사업장 목록조회
   */
  selectTlAllBranchList (param) {
    return api.get('/api/cms/tl/booking/branch/allList', { params: param })
  },

  /**
   * PMS 영업장 목록 전체조회
   */
  selectPmsStoreList () {
    return api.get('/api/cms/tl/booking/branch/pmsStoreList')
  },

  /**
   * PMS 영업장/객실 목록 전체조회
   */
  selectPmsStoreRoomTypeList (storeCode) {
    return api.get('/api/cms/tl/booking/branch/pmsStoreRoomTypeList', { params: { storeCode: storeCode } })
  },

  /**
   * TL 사업장 등록
   */
  insertBranch (branch) {
    return api.post('/api/cms/tl/booking/branch/insertBranch', branch)
  },

  /**
   * TL 사업장 수정
   */
  updateBranch (branch) {
    return api.post('/api/cms/tl/booking/branch/updateBranch', branch)
  },

  /**
   * TL 사업장 순서변경
   */
  updateBranchOrder (branchList) {
    return api.post('/api/cms/tl/booking/branch/updateBranchOrder', branchList)
  }

}
export default branchService
