import api from '@/api'

const roomTypeService = {

  /**
   * 룸타입 목록조회
   */
  selectRoomTypeList(param) {
    return api.get('/api/cms/tl/booking/roomType/list', { params: param })
  },

  /**
   * TL 룸타입 목록조회
   */
  selectTLRoomTypeList(brcNo, pkgYn) {
    return api.get('/api/cms/tl/booking/roomTypeMasterSearch', { params: { brcNo: brcNo, pkgYn: pkgYn } })
  },

  /**
   * 룸타입 싱크확인
   */
  selectRoomTypeSync(brcNo, pkgYn) {
    return api.get('/api/cms/tl/booking/roomType/sync', { params: { brcNo: brcNo, pkgYn: pkgYn } })
  },

  /**
   * 룸타입 싱크 동기화 입력
   */
  insertRoomTypeSync(brcNo, pkgYn, roomTypeArray) {
    return api.post(`/api/cms/tl/booking/roomType/insertSync/${brcNo}/pkgYn/${pkgYn}`, roomTypeArray)
  },

  /**
   * 룸타입 PMS 정보 업데이트
   */
  updateRoomType(form) {
    return api.post('/api/cms/tl/booking/roomType/update', form)
  }
}
export default roomTypeService
