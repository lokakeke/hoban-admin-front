import api from '@/api'

const commissionBasicService = {
  /**
   * 기본 수수료 그룹 목록 조회
   */
  selectCommissionBasicGroupList (param) {
    return api.get('/api/system/ota/commission/basic/group/list', {
      params: param
    })
  },

  /**
   * 기본 수수료 목록 조회
   */
  selectCommissionBasicList (memNo) {
    return api.get(`/api/system/ota/commission/basic/list/${memNo}`)
  },

  /**
   * 기본 수수료 Map 조회
   */
  selectCommissionBasicMap (memNo, applyYmd) {
    return api.get(`/api/system/ota/commission/basic/map/${memNo}/${applyYmd}`)
  },

  /**
   * 기본 수수료 등록
   */
  insertCommissionBasic (memNo, applyYmd, commissionBasicMap) {
    return api.post(`/api/system/ota/commission/basic/insert/${memNo}/${applyYmd}`, commissionBasicMap)
  },

  /**
   * 기본 수수료 수정
   */
  updateCommissionBasic (memNo, applyYmd, commissionBasicMap) {
    return api.post(`/api/system/ota/commission/basic/update/${memNo}/${applyYmd}`, commissionBasicMap)
  },

  /**
   * 기본 수수료 사용여부 수정
   */
  updateCommissionBasicUseYn (memNo, applyYmd, useYn) {
    return api.post(`/api/system/ota/commission/basic/update/use/${memNo}/${applyYmd}/${useYn}`)
  },

  /**
   * 기본 수수료 삭제
   */
  deleteCommissionBasic (memNo, applyYmd) {
    return api.post(`/api/system/ota/commission/basic/delete/${memNo}/${applyYmd}`)
  }
}

export default commissionBasicService
