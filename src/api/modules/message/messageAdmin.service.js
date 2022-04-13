import api from '@/api'

/**
 * Admin Message 관련
 */
const service = {

  /**
     * 모든 알림 조회(전체 메시지 게시판쪽)
     */
  selectAllNotification (param) {
    return api.get('/api/cms/system/messageAdmin/allMessage', { params: param })
  },

  /**
     * 타입별 메시지 조회
     */
  selectNotificationType () {
    api.disableProgress()

    return api.get('/api/cms/system/messageAdmin/messageType')
  },

  /**
     * 메세지별 메시지 조회
     */
  selectNotificationGroup (param) {
    api.disableProgress()

    return api.get('/api/cms/system/messageAdmin/messageGroup', { params: param })
  },

  /**
     * 메시지 목록
     */
  selectNotificationList (param) {
    api.disableProgress()

    return api.get('/api/cms/system/messageAdmin/messageList', { params: param })
  },

  /**
     * 1개의 메시지 읽음 처리
     */
  readNotification (param) {
    api.disableProgress()

    return api.post('/api/cms/system/messageAdmin/readMessage', param)
  },

  /**
     * 전체 메시지 읽음 처리
     */
  readAllNotification (param) {
    api.disableProgress()

    return api.post('/api/cms/system/messageAdmin/readAllMessage', param)
  }
}
export default service
