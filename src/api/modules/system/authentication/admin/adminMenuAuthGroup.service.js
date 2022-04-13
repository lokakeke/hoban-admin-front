import api from '@/api'

const adminMenuAuthGroupService = {

  /**
   * 메뉴 권한 그룹 목록조회
   */
  selectMenuAuthGroupListInUse () {
    return api.get('/api/cms/system/adminMenuAuthGroup/use')
  },

  /**
   * 메뉴 권한 그룹 상세 목록조회
   */
  selectMenuAuthGroupList () {
    return api.get('/api/cms/system/adminMenuAuthGroup/group')
  },

  /**
   * 유저별 메뉴 권한 목록 조회
   */
  selectMenuAuthUserList (adminSeq) {
    return api.get(`/api/cms/system/adminMenuAuthGroup/user/${adminSeq}`)
  },

  /**
   * 메뉴 권한 그룹 등록
   */
  insertMenuAuthGroup (form) {
    return api.post('/api/cms/system/adminMenuAuthGroup/group', form)
  },

  /**
   * 메뉴 권한 그룹 수정
   */
  updateMenuAuthGroup (form) {
    return api.post(`/api/cms/system/adminMenuAuthGroup/group/${form.menuAuthGroupId}`, form)
  },

  /**
   * 메뉴 권한 수정
   */
  updateMenuAuth (menuAuthGroupId, adminMenuAuthList) {
    return api.post(`/api/cms/system/adminMenuAuthGroup/auth/${menuAuthGroupId}`, adminMenuAuthList)
  },

  /**
   * 개인별 메뉴 권한 수정
   */
  updateUserMenuAuth (adminSeq, adminMenuAuthUserList) {
    return api.post(`/api/cms/system/adminMenuAuthGroup/user/${adminSeq}`, adminMenuAuthUserList)
  },

  /**
   * 메뉴권한 그룹 삭제
   * @param menuAuthGroupId
   */
  deleteMenuAuthGroup (menuAuthGroupId) {
    return api.get(`/api/cms/system/adminMenuAuthGroup/delete/${menuAuthGroupId}`)
  }

}
export default adminMenuAuthGroupService
