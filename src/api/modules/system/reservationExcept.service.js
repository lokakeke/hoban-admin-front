import api from '@/api'

const reservationExceptService = {

  /**
   * 리스트 조회
   */
  selectList (param) {
    return api.get('/api/cms/system/reservationExcept/list', { params: param })
  },

  /**
   * 입력
   */
  insert (form) {
    return api.post('/api/cms/system/reservationExcept', form)
  },

  /**
   * 수정
   */
  update (detail) {
    return api.post(`/api/cms/system/reservationExcept/update/${detail.exclSeq}`, detail)
  }
}

export default reservationExceptService
