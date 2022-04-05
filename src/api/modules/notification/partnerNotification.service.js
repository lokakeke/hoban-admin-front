import api from '@/api'

/**
 * Partner Notification 관련
 */
const service = {

  /**
     * 모든 알림 조회
     */
  selectAllNotification (param) {
    return api.get('/api/cms/system/partnerNotification/allNotification', { params: param })
  },

  /**
     * 타입별 알림 조회
     */
  selectNotificationType () {
    api.disableProgress()

    return api.get('/api/cms/system/partnerNotification/notificationType')
  },

  /**
     * 알림 그룹 목록
     */
  selectNotificationGroup (param) {
    api.disableProgress()

    return api.get('/api/cms/system/partnerNotification/notificationGroup', { params: param })
  },

  /**
     * 알림 목록
     */
  selectNotificationList (param) {
    api.disableProgress()

    return api.get('/api/cms/system/partnerNotification/notificationList', { params: param })
  },

  /**
     * 1개의 알림 읽음 처리
     */
  readNotification (param) {
    api.disableProgress()

    return api.post('/api/cms/system/partnerNotification/readNotification', param)
  },

  /**
     * 전체 알림 읽음 처리
     */
  readAllNotification (param) {
    api.disableProgress()

    return api.post('/api/cms/system/partnerNotification/readAllNotification', param)
  }
}
export default service
