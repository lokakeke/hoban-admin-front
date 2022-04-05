import api from '@/api'

const smsNotiService = {

  /**
   * 리스트 조회
   */
  selectList (param) {
    return api.get('/api/cms/system/smsNoti/list', { params: param })
  },

  /**
   * 입력
   */
  insert (form) {
    return api.post('/api/cms/system/smsNoti', form)
  },

  /**
   * 수정
   */
  update (detail) {
    return api.post(`/api/cms/system/smsNoti/update/${detail.notifyId}`, detail)
  },

  /**
   * 순서 변경
   */
  updateSort (list) {
    return api.post('/api/cms/system/smsNoti/order', list)
  },

  /**
   * 서비스 번호 리스트 조회
   */
  selectSvcList () {
    return api.get('/api/cms/system/smsNoti/svcList')
  }

}
export default smsNotiService
