import api from '@/api'

const calculationPenaltyRuleService = {
  /**
   * 정산 > 위약 규정 목록 조회
   */
  selectCalcPenaltyRuleList () {
    return api.get('/api/system/ota/calculation/penaltyRule/list')
  },
  /**
   * 정산 > 위약 규정 목록 등록
   */
  insertCalcPenaltyRuleList (params) {
    return api.post('/api/system/ota/calculation/penaltyRule/insert', params)
  }
}

export default calculationPenaltyRuleService
