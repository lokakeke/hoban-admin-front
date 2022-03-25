import api from 'Api'

export default {

  /**
   * 일정산 마스터 목록 조회
   */
  selectCalculateDayMst (param) {
    return api.get('/api/naver/calculate', { params: param })
  },

  /**
   * 일정산 상세 목록 조회
   */
  selectCalculateDayDtl (param) {
    return api.get('/api/naver/calculate/detail', { params: param })
  },

  /**
   * 일정산 등록
   */
  insertCalculateDay (daySetTable) {
    return api.post('/api/naver/calculate/insertCalculateDay', daySetTable)
  },

  /**
   * 일정산 엑셀 데이터 읽기
   */
  convertSheetsToTables (sheets) {
    return api.post('/api/naver/calculate/convertSheetsToTables', sheets)
  },

  /**
   * 일정산 마스터 정산승인여부, DGNS전표입력여부 수정
   */
  updateCalculateDayMstYn (dayCalcMstNo, param) {
    return api.post(`/api/naver/calculate/updateCalculateDayMstYn/${dayCalcMstNo}`, param)
  },

  /**
   * 일정산 마스터 수정
   */
  updateCalculateDayMst (param) {
    return api.post('/api/naver/calculate/updateCalculateDayMst', param)
  }

}
