import api from '@/api'

const boardAmountService = {

  /**
   * 게시판 > 객실 요금 조회
   */
  selectBoardRoomAmount (params) {
    return api.get('/api/cms/system/board/amount/room', {
      params
    })
  },

  /**
   * 게시판 > 패키지 객실 요금 조회
   */
  selectBoardPackageRoomAmount (params) {
    return api.get('/api/cms/system/board/amount/package/room', {
      params
    })
  }

}
export default boardAmountService
