import api from '@/api'

/**
 * System Notification 관련
 */
const service = {

  /**
     * 모든 알림 조회(전체 알림 게시판쪽)
     */
  selectAllNotification (param) {
    return api.get('/api/cms/system/notification/allNotification', { params: param })
  },

  /**
     * 타입별 알림 조회
     */
  selectNotificationType () {
    api.disableProgress()

    return api.get('/api/cms/system/notification/notificationType')
  },

  /**
     * 메세지별 알림 조회
     */
  selectNotificationGroup (param) {
    api.disableProgress()

    return api.get('/api/cms/system/notification/notificationGroup', { params: param })
  },

  /**
     * 알림 목록
     */
  selectNotificationList (param) {
    api.disableProgress()

    return api.get('/api/cms/system/notification/notificationList', { params: param })
  },

  /**
     * 1개의 알림 읽음 처리
     */
  readNotification (param) {
    api.disableProgress()

    return api.post('/api/cms/system/notification/readNotification', param)
  },

  /**
     * 전체 알림 읽음 처리
     */
  readAllNotification (param) {
    api.disableProgress()

    return api.post('/api/cms/system/notification/readAllNotification', param)
  }
}
export default service
