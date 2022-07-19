import api from '@/api/index'

export default {
  /**
   * 스케줄 목록 조회
   */
  selectScheduleList (params) {
    return api.get('/api/cms/naver/booking/schedule', { params: params })
  },
  /**
   * 스케줄 수정
   */
  patchSchedule (params) {
    return api.post('/api/cms/naver/booking/schedule/update', params)
  },
  /**
   * 임시 스케줄 마스터 생성
   */
  insertScheduleTempMst (params) {
    return api.post('/api/cms/naver/booking/scheduleTemp/insert', params)
  },
  /**
   * 임시 스케줄 상태 변경
   */
  updateScheduleTempMst (tempNo, params) {
    return api.post(`/api/cms/naver/booking/scheduleTemp/update/${tempNo}`, params)
  },
  /**
   * 임시 스케줄 상태 개수
   */
  countScheduleTempMst (params) {
    return api.get('/api/cms/naver/booking/scheduleTemp/status', {
      params: params
    })
  },
  /**
   * 임시 스케줄 마스터 목록
   */
  selectScheduleTempMstList (params) {
    return api.get('/api/cms/naver/booking/scheduleTemp', {
      params: params
    })
  },
  /**
   * 임시 스케줄 목록
   */
  selectScheduleTempList (tempNo, params) {
    return api.get(`/api/cms/naver/booking/scheduleTemp/${tempNo}`, {
      params: params
    })
  }
}
