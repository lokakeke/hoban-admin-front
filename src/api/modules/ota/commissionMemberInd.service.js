import api from 'Api'

const commissionMemberIndService = {
  /**
   * 회원구분 수수료 그룹 목록 조회
   */
  selectCommissionMemberIndGroupList (param) {
    return api.get('/api/ota/commission/member-ind/group/list')
  },

  /**
   * 회원구분 수수료 목록 조회
   */
  selectCommissionMemberIndList (memInd) {
    return api.get(`/api/ota/commission/member-ind/list/${memInd}`)
  },

  /**
   * 회원구분 수수료 Map 조회
   */
  selectCommissionMemberIndMap (memInd, applyYmd) {
    return api.get(`/api/ota/commission/member-ind/map/${memInd}/${applyYmd}`)
  },

  /**
   * 회원구분 수수료 등록
   */
  insertCommissionMemberInd (memInd, applyYmd, commissionMemberIndMap) {
    return api.post(`/api/ota/commission/member-ind/insert/${memInd}/${applyYmd}`, commissionMemberIndMap)
  },

  /**
   * 회원구분 수수료 수정
   */
  updateCommissionMemberInd (memInd, applyYmd, commissionMemberIndMap) {
    return api.post(`/api/ota/commission/member-ind/update/${memInd}/${applyYmd}`, commissionMemberIndMap)
  },

  /**
   * 회원구분 수수료 사용여부 수정
   */
  updateCommissionMemberIndUseYn (memInd, applyYmd, useYn) {
    return api.post(`/api/ota/commission/member-ind/update/use/${memInd}/${applyYmd}/${useYn}`)
  },

  /**
   * 회원구분 수수료 삭제
   */
  deleteCommissionMemberInd (memInd, applyYmd) {
    return api.post(`/api/ota/commission/member-ind/delete/${memInd}/${applyYmd}`)
  }
}

export default commissionMemberIndService
