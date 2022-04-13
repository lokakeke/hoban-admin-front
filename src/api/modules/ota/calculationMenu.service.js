import api from '@/api'

const calculationMenuService = {
  /**
   * 정산 > 메뉴 목록 조회
   */
  selectCalcMenuList () {
    return api.get('/api/ota/calculation/menu/list')
  },
  /**
   * 정산 > 메뉴 조회
   * @param partnerSeq 파트너 번호
   */
  selectCalcMenu (partnerSeq) {
    return api.get(`/api/ota/calculation/menu/${partnerSeq}`)
  },
  /**
   * 정산 > 메뉴 목록 열기/닫기
   * @param partnerSeq 파트너 번호
   * @param calcMenuCode 정산 메뉴 코드
   * @param openYn 열기 여부 [Y/N]
   */
  toggleCalcMenu (partnerSeq, calcMenuCode, openYn) {
    return api.post(`/api/ota/calculation/menu/toggle/${partnerSeq}/${calcMenuCode}/${openYn}`)
  }
}

export default calculationMenuService
