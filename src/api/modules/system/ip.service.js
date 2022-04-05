import api from '@/api'

export default {

  /**
     * 내부 관리 IP 목록 조회
     */
  selectList () {
    return api.get('/api/cms/system/ip/list')
  },

  /**
   * 새로운 IP 등록
   */
  insert (form) {
    return api.post('/api/cms/system/ip', form)
  },

  /**
   * IP 수정
   */
  update (ipInfo) {
    return api.post('/api/cms/system/ip/update', ipInfo)
  }
}
