import api from '@/api'

export default {

  /**
   * 월정산 갑지 조회
   */
  selectCalculateMonthMain (param) {
    return api.get('/api/naver/calculate/month', { params: param })
  },
  /**
   * 월정산 등록
   */
  insertCalculateMonth (calcStndMonth) {
    const param = {
      calcStndMonth: calcStndMonth
    }
    return api.post('/api/naver/calculate/month/insert', param)
  },
  /**
   * 월정산 마스터 수정
   */
  updateCalculateMonthMst (param) {
    return api.post('/api/naver/calculate/month/update', param)
  },
  /**
   * 월정산 삭제
   */
  deleteCalculateMonthDtl (param) {
    return api.post('/api/naver/calculate/month/delete', param)
  }
}
