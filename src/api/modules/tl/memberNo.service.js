import api from '@/api'

const memberNoService = {

  /**
   * 회원 목록 검색
   */
  selectMemberNoList (param) {
    return api.get(`/api/cms/tl/booking/memberNo/${param.agentCode}`)
  },
  /**
   * 회원 검색
   */
  selectMemberNo (param) {
    return api.get(`/api/cms/tl/booking/memberNo/${param.agentCode}/${param.memberNo}`)
  },
  /**
   * 회원 업데이트
   */
  updateMemberNo (param) {
    return api.post('/api/cms/tl/booking/memberNo/update', param)
  },
  /**
   * 회원 삭제
   */
  deleteMemberNo (param) {
    return api.post('/api/cms/tl/booking/memberNo/delete', param)
  }
}
export default memberNoService
