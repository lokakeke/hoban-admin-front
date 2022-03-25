import api from "Api"
import store from "@/store"

const commonCodeService = {

  /**
   * 공통코드 전체 목록조회
   */
  selectCommonCodeList (param) {
    return api.get('/api/system/commonCode', { params: param })
  },

  /**
   * 공통코드 코드 조회
   * @param parentCommCd 부모공통코드
   * @param noCache store cache 사용여부
   */
  selectCommonCode (parentCommCd, noCache = false) {
    if (noCache !== true && store.getters['commonCode/wrapper'][parentCommCd]) {
      return Promise.resolve({
        data: store.getters['commonCode/wrapper'][parentCommCd]
      })
    } else {
      return api.get(`/api/system/commonCode/${parentCommCd}`).then(res => {
        store.commit('commonCode/setCommonCode', {
          parentCommCd,
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
    return api.post('/api/system/commonCode', form)
  },

  /**
   * 공통코드 수정
   */
  updateCommonCode (form) {
    return api.post(`/api/system/commonCode/update/${form.commCdNo}`, form)
  },

  /**
   * 공통코드 삭제
   */
  deleteCommonCode (commCdNo) {
    return api.post(`/api/system/commonCode/delete/${commCdNo}`)
  },

  /**
   * 공통코드 순서변경
   */
  updateCommonCodeOrder (orderList) {
    return api.post('/api/system/commonCode/order', orderList)
  },

  /**
   * 가맹점 구분코드 조회
   */
  selectPtnrType (commCd) {
    return api.get(`/api/system/commonCode/ptnrType/${commCd}`)
  },

  /**
   * 서비스 구분 전체 목록 조회(feign을 타게 됨)
   */
  selectServiceDivisionList (commCd) {
    return api.get(`/api/system/commonCode/serviceDivision/${commCd}`)
  },

  /**
   * 상위 공통코드 등록 시 코드 자동 완성을 위한 조회
   */
  selectCommCdOfCommCd (commCd) {
    return api.get(`/api/system/commonCode/commCdOfCommCd/${commCd}`)
  },

  /**
   * 공통코드 여러개 조회
   */
  selectCommonCodeArray (codes) {
    return api.get(`/api/system/commonCode/commonCodeArray/${codes}`)
  },

  /**
   * DGNS 공통코드 목록 조회
   */
  selectDGNSCommonCodeList (commTypeCd) {
    return api.get(`/api/system/commonCode/dgnsCommonCodeList/${commTypeCd}`)
  }

}
export default commonCodeService
