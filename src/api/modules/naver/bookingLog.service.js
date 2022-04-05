import api from '@/api'

export default {
  /**
   * 날짜별, 예약로그 상태별 목록 조회
   */
  selectBookingLogCalendar (param) {
    return api.get('/api/naver/bookingLog/calendar', { params: param })
  },
  /**
   * 예약로그 상세조회
   */
  selectBookingLogList (param) {
    return api.get('/api/naver/bookingLog', { params: param })
  },
  /**
   * 예약로그 전화번호 조회
   */
  selectBookingLogForPhone (logNo) {
    return api.get(`/api/naver/bookingLog/phone/${logNo}`)
  }
}
