import api from '@/api'

const MESSAGE_URL_PREFIX = '/api/cms/system/message'

const messageService = {

  /**
     * 리스트 조회
     */
  selectList (param) {
    return api.get(MESSAGE_URL_PREFIX + '/list', { params: param })
  },

  /**
   * 알림 ID 조회
   */
  newNotifyId () {
    return api.get(MESSAGE_URL_PREFIX + '/newMessageId')
  },

  /**
     * 입력
     */
  insert (form) {
    return api.post(MESSAGE_URL_PREFIX, form)
  },

  /**
     * 수정
     */
  update (detail) {
    return api.post(`/api/cms/system/message/update/${detail.messageId}`, detail)
  },

  /**
     * 순서 변경
     */
  updateSort (list) {
    return api.post(MESSAGE_URL_PREFIX + '/order', list)
  }

}
export default messageService
