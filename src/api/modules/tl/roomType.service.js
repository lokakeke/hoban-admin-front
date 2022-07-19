import api from '@/api'

const roomTypeService = {

  /**
   * 룸타입 목록조회
   */
  selectRoomTypeList (param) {
    return api.get('/api/cms/tl/booking/roomType/list', { params: param })
  },

  /**
   * TL 룸타입 목록조회
   */
  selectTLRoomTypeList (branchNo, packageYn) {
    return api.get('/api/cms/tl/api/roomTypeMasterSearch', { params: { branchNo: branchNo, packageYn: packageYn } })
  },

  /**
   * 룸타입 싱크확인
   */
  selectRoomTypeSync (branchNo, packageYn) {
    return api.get('/api/cms/tl/booking/roomType/sync', { params: { branchNo: branchNo, packageYn: packageYn } })
  },

  /**
   * 룸타입 싱크 동기화 입력
   */
  insertRoomTypeSync (branchNo, packageYn, roomTypeArray) {
    return api.post(`/api/cms/tl/booking/roomType/insertSync/${branchNo}/packageYn/${packageYn}`, roomTypeArray)
  },

  /**
   * 룸타입 PMS 정보 업데이트
   */
  updateRoomType (form) {
    return api.post('/api/cms/tl/booking/roomType/update', form)
  }
}
export default roomTypeService
