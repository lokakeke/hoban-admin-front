import api from "Api"

const calculationDayService = {
  /**
   * 정산 > 일자 목록 조회
   */
  selectCalcDayList (yearMonth) {
    return api.get(`/api/ota/calculation/day/list/${yearMonth}`)
  },
  /**
   * 정산 > 일자 목록 등록
   */
  insertCalcDayList (yearMonth, params) {
    return api.post(`/api/ota/calculation/day/insert/${yearMonth}`, params)
  }
}

export default calculationDayService
