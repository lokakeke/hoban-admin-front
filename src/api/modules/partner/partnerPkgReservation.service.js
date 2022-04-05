import api from '@/api'

const partnerPkgReservationService = {

  /**
   * 파트너 패키지예약 요청 리스트
   */
  selectPartnerPkgReservationApplyList (param) {
    return api.get('/api/cms/system/partnerPkgReservation/applyList', {
      params: param
    })
  },

  /**
   * 파트너 객실예약 요청정보
   * @param appSeq 요청번호
   */
  selectPartnerPkgReservationApply (appSeq) {
    return api.get(`/api/cms/system/partnerPkgReservation/applyData/${appSeq}`)
  },

  /**
   * 파트너 객실예약 요청정보 (객실유형 포함)
   * @param appSeq 요청번호
   */
  selectPartnerPkgRsvApplyDataList (appSeq) {
    return api.get(`/api/cms/system/partnerPkgReservation/applyDataList/${appSeq}`)
  },

  /**
   * 파트너 판매가능 패키지 리스트
   */
  selectPartnerPkgList () {
    return api.get('/api/cms/system/partnerPkgReservation/pkgList')
  },

  /**
   * 파트너 패키지 정보 조회
   */
  selectPartnerPkgInfo (param) {
    return api.get('/api/cms/system/partnerPkgReservation/pkgInfo', {
      params: param
    })
  },

  /**
   * 파트너 패키지예약 판매가능 대매사 리스트
   */
  selectPartnerPkgAgentList () {
    return api.get('/api/cms/system/partnerPkgReservation/agentList')
  },

  /**
   * 파트너 패키지예약 신청
   * @param form 신청내용
   * 추후 삭제 처리(20201124-구지훈 / 신규개발(insertPartnerPkgApply 따른 사용정지)
   */
  insertPartnerPkgReservationApply (form) {
    return api.post('/api/cms/system/partnerPkgReservation/insertApply', form)
  },

  /**
   * 파트너 패키지예약 수정
   * @param appSeq 신청 키번호
   * @param form 수정내용
   * 추후 삭제 처리(20201130-구지훈 / 신규개발(updatePartnerPkgApply 따른 사용정지)
   */
  updatePartnerPkgReservationApply (appSeq, form) {
    return api.post(`/api/cms/system/partnerPkgReservation/updateApply/${appSeq}`, form)
  },

  /**
   * 파트너 패키지예약 신청내역 처리
   * @param appSeq
   * @param form
   * 추후 삭제 처리(20210113-구지훈 / 신규개발(processPartnerPkgRsvApply 따른 사용정지)
   */
  processPartnerPkgReservationApply (appSeq, form) {
    return api.post(`/api/cms/system/partnerPkgReservation/processApply/${appSeq}`, form)
  },

  /**
   * 파트너 패키지예약 신청내역 처리
   * @param appSeq
   * @param form
   */
  processPartnerPkgRsvApply (appSeq, form) {
    return api.post(`/api/cms/system/partnerPkgReservation/processPkgApply/${appSeq}`, form)
  },

  /**
   * 파트너 패키지예약 취소
   * @param appSeq
   */
  cancelPartnerPkgReservation (appSeq) {
    return api.get(`/api/cms/system/partnerPkgReservation/cancel/${appSeq}`)
  },

  /**
   * 파트너 패키지예약 재신청
   * @param appSeq 신청번호
   */
  updatePartnerPkgReApply (appSeq) {
    return api.get(`/api/cms/system/partnerPkgReservation/reApply/${appSeq}`)
  },

  /**
   * 파트너 패키지예약 신청
   * @param form 신청내용
   */
  insertPartnerPkgApply (form) {
    return api.post('/api/cms/system/partnerPkgReservation/insertPkgApply', form)
  },

  /**
   * 파트너 패키지예약 수정
   * @param appSeq 신청 키번호
   * @param form 수정내용
   */
  updatePartnerPkgApply (appSeq, form) {
    return api.post(`/api/cms/system/partnerPkgReservation/updatePkgApply/${appSeq}`, form)
  }

}

export default partnerPkgReservationService
