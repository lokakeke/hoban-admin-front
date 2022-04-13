import api from '@/api'

export default {

  /**
   * 파트너 정산 현황 데이터 목록 조회
   * @param selectedDate
   * @returns {파트너 정산 현황 데이터 목록}
   */
  selectMonthCalculationStatus (partnerSeq, selectedDate) {
    return api.get(`/api/ota/partnerCalcStatus/list/${selectedDate}/${partnerSeq}`)
  },

  /**
   * 선입금 금액 변경
   * @param selectedDate
   * @param calculationList
   * @returns {Void}
   */
  updatePrepayAmt (selectedDate, calculationList) {
    return api.post(`/api/ota/partnerCalcStatus/updatePrepayAmt/${selectedDate}`, calculationList)
  }
}
