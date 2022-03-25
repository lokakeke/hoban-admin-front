import api from 'Api'

export default {

  /**
   * 월별 이용 현황
   * @param param
   */
  selectMonthlyUsedCaculation (param) {
    return api.get('/api/ota/monthlyUsedCalculation/list', { params: param })
  },

  /**
   * 전체 월별 이용현황
   * @param param
   */
  selectAllMonthlyUsedCaculation (param) {
    return api.get('/api/ota/monthlyUsedCalculation/allList', { params: param })
  },

  /**
   * 패키지 월별 이용현황 (백데이터용)
   * @param param
   */
  selectPkgBackDataList (param) {
    return api.get('/api/ota/monthlyUsedCalculation/pkgBackDataList', { params: param })
  }
}
