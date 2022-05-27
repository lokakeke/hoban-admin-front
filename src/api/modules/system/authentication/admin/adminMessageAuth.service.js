import api from '@/api'

const adminMessageAuth = {
  /**
   * 메시지 권한 그룹 조회
   */
  selectAllGroupByMenuAuthGroup () {
    return api.get('/api/cms/system/messageAuth/admin/group')
  },
  /**
     * 메시지 권한 수정
     */
  updateMessageAuth ({ menuAuthGroupId, messageAuths }) {
    return api.post(`/api/cms/system/messageAuth/admin/group/${menuAuthGroupId}/update`, messageAuths)
  }

}
export default adminMessageAuth
