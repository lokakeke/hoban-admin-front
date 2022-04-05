import api from '@/api'

const notificationService = {

  /**
     * 리스트 조회
     */
  selectList (param) {
    return api.get('/api/cms/system/notification/list', { params: param })
  },

  /**
   * 알림 ID 조회
   */
  newNotifyId () {
    return api.get('/api/cms/system/notification/newNotifyId')
  },

  /**
     * 입력
     */
  insert (form) {
    return api.post('/api/cms/system/notification', form)
  },

  /**
     * 수정
     */
  update (detail) {
    return api.post(`/api/cms/system/notification/update/${detail.notifyId}`, detail)
  },

  /**
     * 순서 변경
     */
  updateSort (list) {
    return api.post('/api/cms/system/notification/order', list)
  }

}
export default notificationService
