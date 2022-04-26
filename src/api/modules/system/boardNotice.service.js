import api from '@/api'

const URL_PREFIX = '/api/cms/ota/ota/booking/board/notice'

const boardNoticeService = {

  /**
   * 게시판 > 공지사항 목록 조회
   */
  selectBoardNoticeList (params) {
    return api.get('/api/cms/ota/booking/board/notice/list', {
      params
    })
  },

  /**
   * 게시판 > 고정된 공지사항 목록 조회
   */
  selectBoardNoticeFixedList () {
    return api.get('/api/cms/ota/booking/board/notice/fixed/list')
  },

  /**
   * 게시판 > 공지사항 유형 목록 조회
   */
  selectBoardNoticeTypeList () {
    return api.get('/api/cms/ota/booking/board/notice/type/list')
  },

  /**
   * 게시판 > 공지사항 조회
   */
  selectBoardNotice (noticeSeq, readYn) {
    const params = {}
    if (readYn === 'Y') {
      params.readYn = readYn
    }
    return api.get(`/api/cms/ota/booking/board/notice/${noticeSeq}`, {
      params
    })
  },

  /**
   * 게시판 > 공지사항 등록
   */
  insertBoardNotice (form) {
    return api.post('/api/cms/ota/booking/board/notice/insert', form)
  },

  /**
   * 게시판 > 공지사항 수정
   */
  updateBoardNotice (form) {
    return api.post(`/api/cms/ota/booking/board/notice/update/${form.noticeSeq}`, form)
  },

  /**
   * 게시판 > 공지사항 사용여부 수정
   */
  updateBoardNoticeUseYn (noticeSeq, useYn) {
    return api.post(`/api/cms/ota/booking/board/notice/update/use/${noticeSeq}/${useYn}`)
  },

  /**
   * 게시판 > 공지사항 삭제
   */
  deleteBoardNotice (noticeSeq) {
    return api.post(`/api/cms/ota/booking/board/notice/delete/${noticeSeq}`)
  },

  /**
   *  게시판 > 팝업 공지사항 목록 조회
   */
  selectBoardNoticePopUpList () {
    return api.get('/api/cms/ota/booking/board/notice/popUp/list')
  },

  /**
   * 게시판 > 공지사항 알림톡 발송
   */
  sendBoardNoticeTalk (noticeSeq, talkTitle, talkContents) {
    return api.post(`/api/cms/ota/booking/board/notice/talk/send/${noticeSeq}`, {
      talkTitle,
      talkContents
    })
  }

}
export default boardNoticeService
