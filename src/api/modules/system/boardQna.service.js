import api from '@/api'

const boardQnaService = {

  /**
   * 게시판 > 질문 목록 조회
   */
  selectBoardQuestionList (params) {
    return api.get('/api/cms/system/board/qna/question/list', {
      params
    })
  },

  /**
   * 게시판 > 질문 조회
   */
  selectBoardQuestion (qstnSeq) {
    return api.get(`/api/cms/system/board/qna/question/${qstnSeq}`)
  },

  /**
   * 게시판 > 질문 등록
   */
  insertBoardQuestion (form) {
    return api.post('/api/cms/system/board/qna/question/insert', form)
  },

  /**
   * 게시판 > 질문 수정
   */
  updateBoardQuestion (form) {
    return api.post(`/api/cms/system/board/qna/question/update/${form.qstnSeq}`, form)
  },

  /**
   * 게시판 > 질문 삭제
   */
  deleteBoardQuestion (qstnSeq) {
    return api.post(`/api/cms/system/board/qna/question/delete/${qstnSeq}`)
  },

  /**
   * 게시판 > 답변 목록 조회
   */
  selectBoardAnswerList (qstnSeq) {
    return api.get(`/api/cms/system/board/qna/answer/list/${qstnSeq}`)
  },

  /**
   * 게시판 > 답변 조회
   */
  selectBoardAnswer (qstnSeq, answSeq) {
    return api.get(`/api/cms/system/board/qna/answer/${qstnSeq}/${answSeq}`)
  },

  /**
   * 게시판 > 답변 등록
   */
  insertBoardAnswer (form) {
    return api.post(`/api/cms/system/board/qna/answer/insert/${form.qstnSeq}`, form)
  },

  /**
   * 게시판 > 답변 수정
   */
  updateBoardAnswer (form) {
    return api.post(`/api/cms/system/board/qna/answer/update/${form.qstnSeq}/${form.answSeq}`, form)
  },

  /**
   * 게시판 > 답변 삭제
   */
  deleteBoardAnswer (qstnSeq, answSeq) {
    return api.post(`/api/cms/system/board/qna/answer/delete/${qstnSeq}/${answSeq}`)
  }

}
export default boardQnaService
