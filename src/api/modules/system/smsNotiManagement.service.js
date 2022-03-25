import api from "Api"

const smsNotiManagementService = {

  /**
   * 리스트 조회
   */
  selectList (param) {
    return api.get('/api/system/smsNotiManagement/list', { params: param })
  },

  /**
   * 입력
   */
  insert (form) {
    return api.post('/api/system/smsNotiManagement', form)
  },

  /**
   * 수정
   */
  update (detail) {
    return api.post(`/api/system/smsNotiManagement/update/${detail.notifyId}`, detail)
  },

  /**
   * 순서 변경
   */
  updateSort (list) {
    return api.post('/api/system/smsNotiManagement/order', list)
  },

  /**
   * 서비스 번호 리스트 조회
   */
  selectSvcList () {
    return api.get('/api/system/smsNotiManagement/svcList')
  }

}
export default smsNotiManagementService
