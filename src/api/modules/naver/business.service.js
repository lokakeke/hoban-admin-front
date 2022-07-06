import api from '@/api'

export default {

  /**
   * 사업장 목록 조회
   */
  selectBusinessList (param) {
    return api.get('/api/cms/naver/booking/business', { params: param })
  },

  /**
   * 사업장 상세 조회
   */
  selectBusiness (storeId) {
    return api.get(`/api/cms/naver/booking/business/${storeId}`)
  },

  /**
   * 사업장 부가속성 조회
   */
  selectAdditionalItem () {
    return api.get('/api/cms/naver/booking/business/additionalItem')
  },

  /**
   * 사업장 등록
   */
  insertBusiness (param) {
    return api.post('/api/cms/naver/booking/business/insert', param)
  },

  /**
   * 영업장 수정
   */
  updateBusiness (param) {
    return api.post(`/api/cms/naver/booking/business/update/${param.storeId}`, param)
  },

  /**
   * 영업장 복사
   */
  copyBusiness (param) {
    return api.post('/api/cms/naver/booking/business/copy', param)
  },

  /**
   * 영업장 상세 비교
   */
  compareBusiness (dmStroeId) {
    return api.get(`/api/cms/naver/booking/business/compare/${dmStroeId}`)
  },
  /**
   * 영업장 API 재전송
   */
  resendApiBusiness (storeId) {
    return api.post(`/api/cms/naver/booking/business/resendApi/${storeId}`)
  },

  /**
   * 주소 위도, 경도 불러오기
   */
  getAddress (addressText) {
    const param = {
      query: addressText
    }
    return api.get('/api/cms/naver/booking/business/address', { params: param })
  },

  /**
   * 영업장 삭제
   */
  deleteBusiness (dmStroeId) {
    return api.get(`/api/cms/naver/booking/business/deleteBusiness/${dmStroeId}`)
  }

}
