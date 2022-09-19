import api from '@/api'

const facilityService = {

  /**
   * 부대시설 판매관리 목록 조회
  */
  selectFacilityManageList () {
    return api.get('/api/user/system/facility/list')
  },
  /**
   * 부대시설 판매관리 등록
   */
  insertFacilityMenu (form) {
    return api.post('/api/user/system/facility/insert', form)
  },
  /**
   * 부대시설 판매관리 수정
   */
  updateFacilityMenu (form) {
    return api.post('/api/user/system/facility/update', form)
  },
  /**
   * 부대시설 판매관리 목록 순서변경
   */
  updateFacilitySort (list) {
    return api.post('/api/user/system/facility/sort/update', list)
  },
  /**
   * 부대시설 판매관리 전체 설정 변경
   */
  updateFacilityChangeAllInfo (param) {
    return api.post('/api/user/system/facility/info/update', param)
  }
}
export default facilityService
