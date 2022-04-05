import api from '@/api'
import store from '@/store'

const commonCodeService = {

  /**
   * 공통코드 전체 목록조회
   */
  selectCommonCodeList (param) {
    return api.get('/api/cms/system/commonCode', { params: param })
  },

  /**
   * 공통코드 코드 조회
   * @param parentCommCode 부모공통코드
   * @param noCache store cache 사용여부
   */
  selectCommonCode (parentCommonCode, noCache = false) {
    if (noCache !== true && store.getters['commonCode/wrapper'][parentCommonCode]) {
      return Promise.resolve({
        data: store.getters['commonCode/wrapper'][parentCommonCode]
      })
    } else {
      return api.get(`/api/cms/system/commonCode/${parentCommonCode}`).then(res => {
        store.commit('commonCode/setCommonCode', {
          parentCommonCode,
          codeList: res.data
        })
        return Promise.resolve(res)
      })
    }
  },

  /**
   * 공통코드 등록
   */
  insertCommonCode (form) {
    return api.post('/api/cms/system/commonCode', form)
  },

  /**
   * 공통코드 수정
   */
  updateCommonCode (form) {
    return api.post(`/api/cms/system/commonCode/update/${form.commonCodeSeq}`, form)
  },

  /**
   * 공통코드 삭제
   */
  deleteCommonCode (commonCodeSeq) {
    return api.post(`/api/cms/system/commonCode/delete/${commonCodeSeq}`)
  },

  /**
   * 공통코드 순서변경
   */
  updateCommonCodeOrder (orderList) {
    return api.post('/api/cms/system/commonCode/order', orderList)
  },

  /**
   * 가맹점 구분코드 조회
   */
  selectPtnrType (commonCode) {
    return api.get(`/api/cms/system/commonCode/ptnrType/${commonCode}`)
  },

  /**
   * 서비스 구분 전체 목록 조회(feign을 타게 됨)
   */
  selectServiceDivisionList (commonCode) {
    return api.get(`/api/cms/system/commonCode/serviceDivision/${commonCode}`)
  },

  /**
   * 상위 공통코드 등록 시 코드 자동 완성을 위한 조회
   */
  selectCommCodeOfCommCode (commonCode) {
    return api.get(`/api/cms/system/commonCode/${commonCode}/next`)
  },

  /**
   * 공통코드 여러개 조회
   */
  selectCommonCodeArray (codes) {
    return api.get(`/api/cms/system/commonCode/commonCodeArray/${codes}`)
  },

  /**
   * DGNS 공통코드 목록 조회
   */
  selectDGNSCommonCodeList (commTypeCode) {
    return api.get(`/api/cms/system/commonCode/dgnsCommonCodeList/${commTypeCode}`)
  }

}
export default commonCodeService
