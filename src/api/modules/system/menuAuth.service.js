import api from '@/api'

const menuAuthService = {

  /**
     * 메뉴 권한 그룹 목록조회
     */
  selectMenuAuthGroupList () {
    return api.get('/api/cms/system/menuAuthGroup/list')
  },

  /**
     * 메뉴 권한 그룹 상세 목록조회
     */
  selectMenuAuthGroupDetailList () {
    return api.get('/api/cms/system/menuAuthGroup/detailList')
  },

  /**
     * 유저별 메뉴 권한 목록 조회
     */
  selectUserAuthMenuList (emplNo) {
    return api.get(`/api/cms/system/menuAuthGroup/userAuth/${emplNo}`)
  },

  /**
     * 메뉴 권한 그룹 등록
     */
  insertMenuAuthGroup (form) {
    return api.post('/api/cms/system/menuAuthGroup', form)
  },

  /**
     * 메뉴 권한 그룹 수정
     */
  updateMenuAuthGroup (form) {
    return api.post(`/api/cms/system/menuAuthGroup/update/${form.grupId}`, form)
  },

  /**
     * 메뉴 권한 수정
     */
  updateMenuAuth (menuAuthGroup) {
    return api.post('/api/cms/system/menuAuthGroup/menu', menuAuthGroup)
  },

  /**
     * 개인별 메뉴 권한 수정
     */
  updateUserMenuAuth (authUser) {
    return api.post('/api/cms/system/menuAuthGroup/user', authUser)
  },

  /**
   * 메뉴권한 그룹 삭제
   * @param menuAuthGroupId
   */
  deleteMenuAuthGroup (menuAuthGroupId) {
    return api.get(`/api/cms/system/menuAuthGroup/delete/${menuAuthGroupId}`)
  }

}
export default menuAuthService
