import api from '@/api'

/**
 * Admin Message 관련
 */
const URL_PREFIX = '/api/cms/system/messageAdmin'

const service = {

  /**
     * 모든 알림 조회(전체 메시지 게시판쪽)
     */
  selectAllMessage (param) {
    return api.get(URL_PREFIX + '/allMessage', { params: param })
  },

  /**
     * 타입별 메시지 조회
     */
  selectMessageType () {
    api.disableProgress()
    return api.get(URL_PREFIX + '/messageType')
  },

  /**
     * 메세지별 메시지 조회
     */
  selectMessageGroup (param) {
    api.disableProgress()
    return api.get(URL_PREFIX + '/messageGroup', { params: param })
  },

  /**
     * 메시지 목록
     */
  selectMessageList (param) {
    api.disableProgress()
    return api.get(URL_PREFIX + '/messageList', { params: param })
  },

  /**
     * 1개의 메시지 읽음 처리
     */
  readMessage (param) {
    api.disableProgress()
    return api.post(URL_PREFIX + '/readMessage', param)
  },

  /**
     * 전체 메시지 읽음 처리
     */
  readAllMessage (param) {
    api.disableProgress()
    return api.post(URL_PREFIX + '/readAllMessage', param)
  }
}
export default service
