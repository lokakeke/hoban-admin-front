import api from "Api"

export default {

  /**
   * 사업장 목록 조회
   */
  selectBusinessList (param) {
    return api.get('/api/naver/business', { params: param })
  },

  /**
   * 사업장 상세 조회
   */
  selectBusiness (dmStoreId) {
    return api.get(`/api/naver/business/${dmStoreId}`)
  },

  /**
   * 사업장 부가속성 조회
   */
  selectAdditionalItem () {
    return api.get('/api/naver/business/additionalItem')
  },

  /**
   * 사업장 등록
   */
  insertBusiness (param) {
    return api.post('/api/naver/business/insert', param)
  },

  /**
   * 영업장 수정
   */
  updateBusiness (param) {
    return api.post(`/api/naver/business/update/${param.dmStoreId}`, param)
  },

  /**
   * 영업장 복사
   */
  copyBusiness (param) {
    return api.post('/api/naver/business/copy', param)
  },

  /**
   * 영업장 상세 비교
   */
  compareBusiness (dmStroeId) {
    return api.get(`/api/naver/business/compare/${dmStroeId}`)
  },
  /**
   * 영업장 API 재전송
   */
  resendApiBusiness (dmStoreId) {
    return api.post(`/api/naver/business/resendApi/${dmStoreId}`)
  },

  /**
   * 주소 위도, 경도 불러오기
   */
  getAddress (addressText) {
    const param = {
      query: addressText
    }
    return api.get('/api/naver/business/address', { params: param })
  },

  /**
   * 영업장 삭제
   */
  deleteBusiness (dmStroeId) {
    return api.get(`/api/naver/business/deleteBusiness/${dmStroeId}`)
  }

}
