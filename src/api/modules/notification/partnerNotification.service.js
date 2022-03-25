import api from 'Api'

/**
 * Partner Notification 관련
 */
const service = {

  /**
     * 모든 알림 조회
     */
  selectAllNotification (param) {
    return api.get('/api/system/partnerNotification/allNotification', { params: param })
  },

  /**
     * 타입별 알림 조회
     */
  selectNotificationType () {
    api.disableProgress()

    return api.get('/api/system/partnerNotification/notificationType')
  },

  /**
     * 알림 그룹 목록
     */
  selectNotificationGroup (param) {
    api.disableProgress()

    return api.get('/api/system/partnerNotification/notificationGroup', { params: param })
  },

  /**
     * 알림 목록
     */
  selectNotificationList (param) {
    api.disableProgress()

    return api.get('/api/system/partnerNotification/notificationList', { params: param })
  },

  /**
     * 1개의 알림 읽음 처리
     */
  readNotification (param) {
    api.disableProgress()

    return api.post('/api/system/partnerNotification/readNotification', param)
  },

  /**
     * 전체 알림 읽음 처리
     */
  readAllNotification (param) {
    api.disableProgress()

    return api.post('/api/system/partnerNotification/readAllNotification', param)
  }
}
export default service
