import api from '@/api'

const partnerReservationService = {

  /**
   * 파트너 객실예약 요청 리스트
   */
  selectPartnerReservationApplyList (param) {
    return api.get('/api/cms/ota/booking/partnerReservation/applyList', {
      params: param
    })
  },

  /**
   * 파트너 객실예약 요청정보
   * @param appSeq 요청번호
   */
  selectPartnerReservationApply (appSeq) {
    return api.get(`/api/cms/ota/booking/partnerReservation/applyData/${appSeq}`)
  },

  /**
   * 파트너 객실이용정보 리스트 조회
   */
  selectPartnerRoomUseInfo () {
    return api.get('/api/cms/ota/booking/partnerReservation/roomUseInfoList')
  },

  /**
   * 파트너 객실예약 재신청
   * @param appSeq 신청번호
   */
  updatePartnerReApply (appSeq) {
    return api.get(`/api/cms/system/partnerReservation/reApply/${appSeq}`)
  },

  /**
   * 파트너 객실예약 신청 취소
   * @param appSeq 신청번호
   */
  cancelPartnerReservation (appSeq) {
    return api.get(`/api/cms/ota/booking/partnerReservation/cancel/${appSeq}`)
  },

  /**
   * 파트너 객실예약 신청
   * @param form 신청내용
   */
  insertPartnerReservationApply (form) {
    return api.post('/api/cms/ota/booking/partnerReservation/insertApply', form)
  },

  /**
   * 파트너 객실예약 수정
   * @param appSeq 신청 키번호
   * @param form 수정내용
   */
  updatePartnerReservationApply (appSeq, form) {
    return api.post(`/api/cms/ota/booking/partnerReservation/updateApply/${appSeq}`, form)
  },

  /**
   * 파트너 객실예약 신청내역 처리
   * @param appSeq
   * @param form
   */
  processPartnerReservationApply (appSeq, form) {
    return api.post(`/api/cms/ota/booking/partnerReservation/processApply/${appSeq}`, form)
  }
}

export default partnerReservationService
