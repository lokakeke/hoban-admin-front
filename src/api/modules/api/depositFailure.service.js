import api from '@/api'

export default {
  /**
   * 예치금 오류 목록 조회
   */
  selectDepositFailureList (params) {
    return api.get('/api/cms/system/deposit/failure/list', { params })
  }
}
