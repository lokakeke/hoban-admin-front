import api from "Api"

export default {

  /**
   * TPNE 정산 갑지 조회
   */
  selectCalculateTpneMain (param) {
    return api.get('/api/naver/calculate/tpne', { params: param })
  },
  /**
   * TPNE 정산 등록
   */
  insertCalculateTpne (calcStndMonth) {
    const param = {
      calcStndMonth: calcStndMonth
    }
    return api.post('/api/naver/calculate/tpne/insert', param)
  }
}
