import api from "Api"

const calculationMenuService = {
  /**
   * 정산 > 메뉴 목록 조회
   */
  selectCalcMenuList () {
    return api.get('/api/ota/calculation/menu/list')
  },
  /**
   * 정산 > 메뉴 조회
   * @param ptnrNo 파트너 번호
   */
  selectCalcMenu (ptnrNo) {
    return api.get(`/api/ota/calculation/menu/${ptnrNo}`)
  },
  /**
   * 정산 > 메뉴 목록 열기/닫기
   * @param ptnrNo 파트너 번호
   * @param calcMenuCd 정산 메뉴 코드
   * @param openYn 열기 여부 [Y/N]
   */
  toggleCalcMenu (ptnrNo, calcMenuCd, openYn) {
    return api.post(`/api/ota/calculation/menu/toggle/${ptnrNo}/${calcMenuCd}/${openYn}`)
  }
}

export default calculationMenuService
