import api from '@/api'

export default {
  /**
   * 예약 목록 조회
   */
  selectBookingList (param) {
    return api.get('/api/naver/booking', { params: param })
  },

  /**
   * 예약 상세 조회
   */
  selectBooking (param) {
    const params = {
      rsvNo: param.rsvNo,
      keyRsvNo: param.keyRsvNo,
      mid: param.mid,
      businessId: param.businessId
    }
    return api.get(`/api/naver/booking/${param.bookingId}`, { params: params })
  },

  /**
   * 검색기준 조회
   */
  selectSearchList () {
    return api.get('/api/naver/booking/search')
  },

  /**
   * 예약상세 수정
   */
  updateDgnsBooking (param) {
    return api.post(`/api/naver/booking/update/dgns/${param.keyRsvNo}`, param)
  },
  updateNaverBooking (param) {
    return api.post(`/api/naver/booking/update/naver/${param.bookingId}`, param)
  },

  /**
   * 환불정책 조회
   */
  selectBookingRefundPolicies (param) {
    return api.get(`/api/naver/booking/selectBookingPolicy/${param.bookingId}`)
  },

  /**
   * 예약 수정 (대행사 -> 네이버)
   */
  updateBookingStates (param) {
    return api.post(`/api/naver/booking/updateBookingStates/${param.bookingId}`, param)
  },

  /**
   * 전체 상품에 대한 예약 정보 조회
   */
  selectBookingCalendar (params) {
    return api.get('/api/naver/booking/bookingCalendar', { params: params })
  },

  /**
   * 네이버 첨부파일 조회
   */
  selectNaverFile (params) {
    return api.get(`/api/cms/system/attach/${params.refFldCode}/${params.refNo}`)
  },

  /**
   * 네이버 첨부파일 등록
   */
  insertNaverFile (bookingId, attachBag) {
    return api.post(`/api/naver/booking/insertNaverFile/${bookingId}`, attachBag)
  },

  /**
   * 예약 전화번호 조회
   */
  selectBookingForPhone (bookingId) {
    return api.get(`/api/naver/booking/phone/${bookingId}`)
  }

}
