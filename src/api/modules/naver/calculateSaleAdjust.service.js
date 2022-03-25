import api from "Api"

export default {

  /**
   * 매출조정 목록 조회
   */
  selectSaleAdjustList (param) {
    return api.get('/api/naver/calculate/saleAdjust', { params: param })
  },

  /**
   * 매출조정 등록
   */
  insertSaleAdjust (param) {
    return api.post('/api/naver/calculate/saleAdjust/insertSaleAdjust', param)
  },

  /**
   * 매출조정 수정
   */
  updateSaleAdjust (param) {
    return api.post('/api/naver/calculate/saleAdjust/updateSaleAdjust', param)
  },

  /**
   * 매출조정 매핑
   */
  updateSaleAdjustMapping (param) {
    return api.post('/api/naver/calculate/saleAdjust/updateSaleAdjustMapping', param)
  },

  /**
   * 예약 목록 조회
   */
  selectBookingSaleAdjust (param) {
    return api.get(`/api/naver/calculate/saleAdjust/selectBookingSaleAdjust/${param.bookingId}`)
  },

  /**
   * 패키지명 조회
   */
  selectPkgNmSaleAdjust (param) {
    return api.get(`/api/naver/calculate/saleAdjust/selectPkgNmSaleAdjust/${param.mid}`)
  },

  /**
   * 매출조정 삭제
   */
  deleteSaleAdjust (param) {
    return api.post('/api/naver/calculate/saleAdjust/deleteSaleAdjust', param)
  }

}
