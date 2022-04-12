import api from '@/api'
import store from '@/store'

const menuService = {

  /**
     * 메뉴 전체 목록조회
     */
  selectMenuList () {
    return api.get('/api/cms/system/menu/list')
  },

  /**
     * 사용자 메뉴 목록조회
     */
  selectMyMenuList () {
    return api.get('/api/cms/system/menu/myList')
  },

  /**
     * 메뉴 등록
     */
  insertMenu (form) {
    return api.post('/api/cms/system/menu/insert', form)
  },

  /**
     * 메뉴 수정
     */
  updateMenu (form) {
    return api.post(`/api/cms/system/menu/update/${form.menuId}`, form)
  },

  /**
     * 메뉴 순서변경
     */
  updateMenuOrder (orderList) {
    return api.post('/api/cms/system/menu/order', orderList)
  },

  /**
   * 메뉴 삭제
   * @param menuId
   */
  deleteMenu (menuId) {
    return api.get(`/api/cms/system/menu/delete/${menuId}`)
  },

  /**
   * 라우팅 이동가능여부 체크
   * @param menus 나의 메뉴
   * @param to 라우팅 To
   * @returns {{success: boolean, redirectPath: string, title: string, message: string}}
   */
  checkRouterAuth (menus, to) {
    const rtn = {
      success: true,
      title: '',
      message: '',
      redirectPath: ''
    }
    // 메뉴 접근권한 : 로그인 필요여부
    const checkAuth = to.meta.auth !== false
    // 메뉴 접근권한 : 나의 메뉴 필요여부
    const checkRequiresAuth = to.meta.requiresAuth !== false
    // 권한 체크
    if (checkAuth) {
      if (checkRequiresAuth) {
        const target = to.path
        const match = this.checkRoute(menus, target)
        if (!match) {
          rtn.success = false
          rtn.title = '권한 없음'
          rtn.message = '메뉴 접근권한이 없습니다.'
          rtn.redirectPath = '/'
        }
      }
    } else {
      // 로그인 권한 필요없는 화면 (ex: login) 접근 시 메인화면으로 보낸다.
      rtn.success = false
      rtn.title = '잘못된 접근'
      rtn.message = '잘못된 경로로 접근하여 메인페이지로 이동합니다.'
      rtn.redirectPath = '/'
    }
    return rtn
  },

  /**
   * 이동 라우터가 나의 메뉴에 포함되는지 체크
   * @param menus 나의 메뉴
   * @param target 이동 라우터 주소
   * @returns {boolean}
   */
  checkRoute (menus, target) {
    for (const menu of menus) {
      const isBoardNoticeDetail = menu.menuPath === '/board/boardNotice' && target.indexOf(menu.menuPath) === 0
      if (menu.menuPath === target || isBoardNoticeDetail) {
        // 쓰기 권한 맵핑
        store.dispatch('sidebar/setWriteAuth', menu.writeYn)
        return true
      } else if (menu.children && menu.children.length > 0) {
        const check = this.checkRoute(menu.children, target)
        if (check) {
          return true
        }
      }
    }
    return false
  },

  /**
   * 나의 API 권한 리스트 재조회 요청
   */
  memoryMyMenu () {
    return api.get('/api/cms/system/menu/memoryMyApiList')
  }
}
export default menuService
