import api from "Api"

const kpiService = {

  /**
   * KPI 리스트 조회
   */
  async selectKpiList (param) {
    const res = await api.get('/api/social/kpi/kpiList', {
      params: param || {}
    })
    return res.data || []
  },

  async selectKpiCategory (kpiSeq) {
    const res = await api.get(`/api/social/kpi/category/${kpiSeq}`)
    return res.data || {
      kpiSeq: '',
      kpiIndNm: '',
      useYn: 'Y'
    }
  },

  /**
   * KPI 상세데이터 조회
   */
  async selectKpiDetail (param) {
    const res = await api.get('/api/social/kpi/kpiDetail', {
      params: param
    })
    return res.data || {
      kpiSeq: param.kpiSeq,
      stndYear: param.stndYear,
      kpi1: '',
      kpi2: '',
      kpi3: '',
      kpi4: '',
      kpi5: '',
      kpi6: '',
      kpi7: '',
      kpi8: '',
      kpi9: '',
      kpi10: '',
      kpi11: '',
      kpi12: ''
    }
  },

  /**
   * KPI 카테고리 입력
   */
  insertKpi (param) {
    return api.post('/api/social/kpi/insertKpi', param)
  },

  /**
   * KPI 카테고리 수정
   */
  updateKpi (param) {
    return api.post('/api/social/kpi/updateKpi', param)
  },

  /**
   * KPI 상세정보 입력
   */
  insertKpiDetail (param) {
    return api.post('/api/social/kpi/insertKpiDetail', param)
  }

}

export default kpiService
