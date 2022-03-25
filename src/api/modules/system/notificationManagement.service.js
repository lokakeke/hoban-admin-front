import api from "Api"

const notificationManagementService = {

  /**
     * 리스트 조회
     */
  selectList (param) {
    return api.get('/api/system/notificationManagement/list', { params: param })
  },

  /**
   * 알림 ID 조회
   */
  newNotifyId () {
    return api.get('/api/system/notificationManagement/newNotifyId')
  },

  /**
     * 입력
     */
  insert (form) {
    return api.post('/api/system/notificationManagement', form)
  },

  /**
     * 수정
     */
  update (detail) {
    return api.post(`/api/system/notificationManagement/update/${detail.notifyId}`, detail)
  },

  /**
     * 순서 변경
     */
  updateSort (list) {
    return api.post('/api/system/notificationManagement/order', list)
  }

}
export default notificationManagementService
