import api from '@/api'

export default {
  /**
   * 예치금 이력 목록 조회
   */
  selectDepositHistoryList (params) {
    return api.get('/api/cms/system/deposit/history/list', { params })
  },
  /**
   * 예치금 이력 상세 조회
   */
  selectDepositHistory (hisSeq) {
    return api.get(`/api/cms/system/deposit/history/${hisSeq}`)
  }
}
