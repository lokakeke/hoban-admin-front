import api from '@/api'

export default {

  /**
     * 사용중인 파트너 메뉴 권한 그룹 조회
     */
  selectPartnerMenuAuthGroupListInUse () {
    return api.get('/api/cms/ota/booking/partnerMenuAuthGroup/use')
  },

  /**
     * 파트너 메뉴 권한 그룹 상세목록 조회
     */
  selectPartnerAuthDetailedGroupList () {
    return api.get('/api/cms/ota/booking/partnerMenuAuthGroup/group')
  },

  /**
     * 파트너 메뉴권한 개인메뉴 조회
     */
  selectPartnerMenuAuthUser (partnerSeq) {
    return api.get(`/api/cms/ota/booking/partnerMenuAuthGroup/user/${partnerSeq}`)
  },

  /**
     * 파트너 메뉴 권한 그룹 등록
     */
  insertPartnerMenuAuthGroup (form) {
    return api.post('/api/cms/ota/booking/partnerMenuAuthGroup/group', form)
  },

  /**
     * 파트너 메뉴 권한 그룹 수정
     */
  updatePartnerMenuAuthGroup (form) {
    return api.post(`/api/cms/ota/booking/partnerMenuAuthGroup/group/${form.menuAuthGroupId}`, form)
  },

  /**
     * 파트너 메뉴권한 메뉴 등록
     */
  updatePartnerMenuAuth (menuAuthGroupId, menuList) {
    return api.post(`/api/cms/ota/booking/partnerMenuAuthGroup/auth/${menuAuthGroupId}`, menuList)
  },

  /**
     * 파트너 메뉴권한 개인메뉴 등록
     */
  updatePartnerMenuAuthUser (partnerSeq, userList) {
    return api.post(`/api/cms/ota/booking/partnerMenuAuthGroup/user/${partnerSeq}`, userList)
  },

  /**
   * 메뉴권한 그룹 삭제
   * @param menuAuthGroupId
   */
  deleteMenuAuthGroup (menuAuthGroupId) {
    return api.get(`/api/cms/ota/booking/partnerMenuAuthGroup/delete/${menuAuthGroupId}`)
  }

}
