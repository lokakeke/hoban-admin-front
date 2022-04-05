import api from '@/api'

export default {

  /**
   * 정산 목록 조회
   */
  selectCalculateList (param) {
    return api.get('/api/social/calc/list', { params: param })
  },

  /**
   * 정산 상세조회 전 - 가장 최신 정산순번인지 확인(정산 완료 유무 확인)
   */
  checkLastCalcNo (param) {
    return api.get('/api/social/calc/checkCalcNo', { params: param })
  },

  /**
   * 총계 조회
   */
  selectCalculateSumList (param) {
    return api.get('/api/social/calc/sum/list', { params: param })
  },

  /**
  * 우대번호, 순번 상태확인
  */
  checkTicketStatus (param) {
    return api.get('/api/social/calc/add/status/list', { params: param })
  },

  /**
   * 추가정산 저장
   */
  saveAddInvoiceCalc (param) {
    return api.post('/api/social/calc/add/insert', param)
  },

  /**
   * 추가정산 삭제
   */
  deleteAddInvoiceCalc (param) {
    return api.post('/api/social/calc/add/delete', param)
  },

  /**
   * 우대번호 사용내역 상세 조회
   */
  selectTicketNoSeq (param) {
    return api.get('/api/history/social/list', { params: param })
  },

  /**
   * 인보이스 목록 조회(월정산, 딜정산)
   */
  selectInvoiceList (param) {
    return api.get('/api/social/calc/invoice/list', { params: param })
  },

  /**
   * 입장권 갑지 목록
   */
  selectTicketBlackacreList (param) {
    return api.get('/api/social/calc/ticketBlackacre/list', { params: param })
  },

  /**
   * 입장권 배분(지역 목록 조회)
   */
  selectDstbTabList (param) {
    return api.get('/api/social/calc/ticketDist/tabList', { params: param })
  },

  /**
   * 입장권 배분 목록
   */
  selectTicketDistList (param) {
    return api.get('/api/social/calc/ticketDist/list', { params: param })
  },

  /**
   * 객실 배분 목록
   */
  selectRoomDistList (param) {
    return api.get('/api/social/calc/roomDist/list', { params: param })
  },

  /**
   * 월정산
   */
  monthCalc (param) {
    return api.get('/api/social/calc/monthCalc', { params: param })
  },
  /**
   * 딜정산
   */
  dealCalc (param) {
    return api.get('/api/social/calc/dealCalc', { params: param })
  },
  /**
   * 재정산
   */
  reCalculate (param) {
    return api.post('/api/social/calc/reCalculate', param)
  },

  /**
   * 정산 삭제
   */
  deleteCalculate (param) {
    return api.post('/api/social/calc/deleteCalculate', param)
  },

  /**
   * 인보이스 정보 저장
   */
  saveInvoiceInfo (param) {
    return api.post('/api/social/calc/invoice/saveInfo', param)
  },

  /**
   * 담당자 정산 승인
   */
  updateMngmAprlCalc (param) {
    return api.post('/api/social/calc/mngmAprl/update', param)
  },

  /**
   * 파트너 정산 승인
   */
  updatePtnrAprlCalc (param) {
    return api.post('/api/social/calc/ptnrAprl/update', param)
  },

  /**
   * 정산 잠금
   */
  updateLockYn (param) {
    return api.post('/api/social/calc/lock/update', param)
  },

  /**
   * 이전 정산 목록 조회
   */
  selectCalculateHistoryList (param) {
    return api.get('/api/social/calc/history/list', { params: param })
  }

}
