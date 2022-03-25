import api from 'Api'

const reservationExceptService = {

  /**
   * 리스트 조회
   */
  selectList (param) {
    return api.get('/api/system/reservationExcept/list', { params: param })
  },

  /**
   * 입력
   */
  insert (form) {
    return api.post('/api/system/reservationExcept', form)
  },

  /**
   * 수정
   */
  update (detail) {
    return api.post(`/api/system/reservationExcept/update/${detail.exclSeq}`, detail)
  }
}

export default reservationExceptService
