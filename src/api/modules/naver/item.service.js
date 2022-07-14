import api from '@/api'

export default {
  /**
   * 상품 목록 조회
   */
  selectItemList (param) {
    return api.get('/api/cms/naver/booking/item', { params: { q: param } })
  },
  /**
   * 모든 상품 목록 조회
   */
  selectItemListAll (param) {
    return api.get('/api/cms/naver/booking/item/itemListAll', { params: param })
  },
  /**
   * 상품 상세 조회
   */
  selectItem (itemId) {
    return api.get(`/api/cms/naver/booking/item/${itemId}`)
  },
  /**
   * 상품 상세 비교
   */
  compareItem (itemId) {
    return api.get(`/api/cms/naver/booking/item/${itemId}/compare`)
  },
  /**
   * 상품 생성
   */
  insertItem (param) {
    return api.post('/api/cms/naver/booking/item/insert', param)
  },
  /**
   * 상품 다건 생성
   */
  insertItemList (param) {
    return api.post('/api/cms/naver/booking/item/list', param)
  },
  /**
   * 상품 수정
   */
  updateItem (param) {
    return api.post(`/api/cms/naver/booking/item/update/${param.itemId}`, param)
  },
  /**
   * 상품 부가속성 조회
   */
  selectAdditionalInfo () {
    return api.get('/api/cms/naver/booking/item/additionalInfo')
  },
  /**
   * 상품 조회시 사용하는 사업장 목록 조회
   */
  selectBusinessCodeList (param) {
    return api.get('/api/cms/naver/booking/item/businessCodeList')
  },
  /**
   * 상품 일부정보 수정
   */
  patchItem (param) {
    return api.post('/api/cms/naver/booking/item/patch', param)
  },
  /**
   * 상품 API 재전송
   */
  resendApiItem (itemId) {
    return api.post(`/api/cms/naver/booking/item/resendApi/${itemId}`)
  },
  /**
   * 상품 삭제
   */
  deleteItem (itemId) {
    return api.post(`/api/cms/naver/booking/item/deleteItem/${itemId}`)
  },
  /**
   * 상품 복사
   */
  copyItem (type, param) {
    let url = '/api/cms/naver/booking/item/copy'
    if (type !== 'info') {
      url = '/api/cms/naver/booking/item/copy/schedule'
    }
    return api.post(url, param)
  },
  /**
   * DGNS 패키지 마스터 정보 조회
   */
  selectPackageMasterInfo (pkgNo) {
    return api.get(`/api/cms/naver/booking/item/package/${pkgNo}`)
  },
  /**
   * DGNS 패키지의 객실 목록 조회
   */
  selectPackageRoomList (storeId, pkgNo) {
    return api.get(`/api/cms/naver/booking/item/${storeId}/package/roomList/${pkgNo}`)
  },
  /**
   * DGNS 사업장의 객실 목록 조회
   */
  selectOnlyRoomList () {
    return api.get('/api/cms/naver/booking/item/roomList')
  },
  /**
   * DGNS 상품 정보 업데이트
   */
  updateDgnsItemInfo (itemId, param) {
    return api.post(`/api/cms/naver/booking/item/dgns/${itemId}`, param)
  },
  /**
   * 회원번호 일괄 변경
   */
  updateRoomChangeMid (param) {
    return api.post('/api/cms/naver/booking/item/roomChangeMid', param)
  }
}
