import api from "Api"

export default {
  /**
   * 상품 목록 조회
   */
  selectItemList (param) {
    return api.get('/api/naver/item', { params: param })
  },
  /**
   * 모든 상품 목록 조회
   */
  selectItemListAll (param) {
    return api.get('/api/naver/item/itemListAll', { params: param })
  },
  /**
   * 상품 상세 조회
   */
  selectItem (dmItemId) {
    return api.get(`/api/naver/item/${dmItemId}`)
  },
  /**
   * 상품 상세 비교
   */
  compareItem (dmItemId) {
    return api.get(`/api/naver/item/${dmItemId}/compare`)
  },
  /**
   * 상품 생성
   */
  insertItem (param) {
    return api.post('/api/naver/item/insert', param)
  },
  /**
   * 상품 다건 생성
   */
  insertItemList (param) {
    return api.post('/api/naver/item/list', param)
  },
  /**
   * 상품 수정
   */
  updateItem (param) {
    return api.post(`/api/naver/item/update/${param.dmItemId}`, param)
  },
  /**
   * 상품 부가속성 조회
   */
  selectAdditionalInfo () {
    return api.get('/api/naver/item/additionalInfo')
  },
  /**
   * 상품 조회시 사용하는 사업장 목록 조회
   */
  selectBusinessCodeList (param) {
    return api.get('/api/naver/item/businessCodeList')
  },
  /**
   * 상품 일부정보 수정
   */
  patchItem (param) {
    return api.post('/api/naver/item/patch', param)
  },
  /**
   * 상품 API 재전송
   */
  resendApiItem (dmItemId) {
    return api.post(`/api/naver/item/resendApi/${dmItemId}`)
  },
  /**
   * 상품 삭제
   */
  deleteItem (dmItemId) {
    return api.post(`/api/naver/item/deleteItem/${dmItemId}`)
  },
  /**
   * 상품 복사
   */
  copyItem (type, param) {
    let url = '/api/naver/item/copy'
    if (type !== 'info') {
      url = '/api/naver/item/copy/schedule'
    }
    return api.post(url, param)
  },
  /**
   * DGNS 패키지 마스터 정보 조회
   */
  selectPackageMasterInfo (pkgNo) {
    return api.get(`/api/naver/item/package/${pkgNo}`)
  },
  /**
   * DGNS 패키지의 객실 목록 조회
   */
  selectPackageRoomList (dmStoreId, pkgNo) {
    return api.get(`/api/naver/item/${dmStoreId}/package/roomList/${pkgNo}`)
  },
  /**
   * DGNS 사업장의 객실 목록 조회
   */
  selectOnlyRoomList () {
    return api.get('/api/naver/item/roomList')
  },
  /**
   * DGNS 상품 정보 업데이트
   */
  updateDgnsItemInfo (dmItemId, param) {
    return api.post(`/api/naver/item/dgns/${dmItemId}`, param)
  },
  /**
   * 회원번호 일괄 변경
   */
  updateRoomChangeMid (param) {
    return api.post('/api/naver/item/roomChangeMid', param)
  }
}
