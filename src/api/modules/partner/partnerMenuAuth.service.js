import api from 'Api'

export default {

  /**
     * 파트너 메뉴 권한 그룹 조회
     */
  selectPartnerAuthGroup () {
    return api.get('/api/system/partnerMenuAuth/group')
  },

  /**
     * 파트너 메뉴 권한 그룹 상세목록 조회
     */
  selectPartnerAuthDetailedGroup () {
    return api.get('/api/system/partnerMenuAuth/detailedGroup')
  },

  /**
     * 파트너 메뉴권한 개인메뉴 조회
     */
  selectPartnerMenuAuthUser (ptnrNo) {
    return api.get(`/api/system/partnerMenuAuth/user/${ptnrNo}`)
  },

  /**
     * 파트너 메뉴 권한 그룹 등록
     */
  insertPartnerMenuAuthGroup (form) {
    return api.post('/api/system/partnerMenuAuth/group', form)
  },

  /**
     * 파트너 메뉴 권한 그룹 수정
     */
  updatePartnerMenuAuthGroup (form) {
    return api.post(`/api/system/partnerMenuAuth/group/${form.grupId}`, form)
  },

  /**
     * 파트너 메뉴권한 메뉴 등록
     */
  updatePartnerMenuAuthMenu (grupId, menuList) {
    return api.post(`/api/system/partnerMenuAuth/menu/${grupId}`, menuList)
  },

  /**
     * 파트너 메뉴권한 개인메뉴 등록
     */
  updatePartnerMenuAuthUser (ptnrNo, userList) {
    return api.post(`/api/system/partnerMenuAuth/user/${ptnrNo}`, userList)
  },

  /**
   * 메뉴권한 그룹 삭제
   * @param menuAuthGroupId
   */
  deleteMenuAuthGroup (menuAuthGroupId) {
    return api.get(`/api/system/partnerMenuAuth/delete/${menuAuthGroupId}`)
  }

}
