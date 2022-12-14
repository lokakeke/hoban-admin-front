import api from '@/api'

/**
 * Partner Message 관련
 */
const service = {

  /**
     * 모든 메시지 조회
     */
  selectAllMessage (param) {
    return api.get('/api/cms/system/partnerMessage/allMessage', { params: param })
  },

  /**
     * 타입별 메시지 조회
     */
  selectMessageType () {
    api.disableProgress()

    return api.get('/api/cms/system/partnerMessage/messageType')
  },

  /**
     * 메시지 그룹 목록
     */
  selectMessageGroup (param) {
    api.disableProgress()

    return api.get('/api/cms/system/partnerMessage/messageGroup', { params: param })
  },

  /**
     * 메시지 목록
     */
  selectMessageList (param) {
    api.disableProgress()

    return api.get('/api/cms/system/partnerMessage/messageList', { params: param })
  },

  /**
     * 1개의 메시지 읽음 처리
     */
  readMessage (param) {
    api.disableProgress()

    return api.post('/api/cms/system/partnerMessage/readMessage', param)
  },

  /**
     * 전체 메시지 읽음 처리
     */
  readAllMessage (param) {
    api.disableProgress()
    return api.post('/api/cms/system/partnerMessage/readAllMessage', param)
  }
}
export default service
