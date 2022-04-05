import api from '@/api'

export default {

  /**
   * 파트너의 객실 예약 가능여부 조회
   */
  selectPossibleRoomInventory (rmTypeCode, param) {
    return api.post(`/api/product/room/${rmTypeCode}`, param)
  },

  /**
   * 패키지 객실 예약 가능 여부 조회
   */
  selectPossiblePkgInventory (rmTypeCode, param) {
    return api.post(`/api/product/package/room/${rmTypeCode}`, param)
  },

  /**
   * 잔여 객실 현황 조회
   */
  selectLeaveRooms (rsvBlckCode, param) {
    return api.post(`/api/product/room/block/${rsvBlckCode}`, param)
  },

  /**
   * 객실 유형 별 잔여 수량 확인
   */
  checkRoomLeaveCnt (param) {
    return api.post('/api/product/room/rooms', param)
  },

  /**
   * 패키지 유형 별 잔여 수량 확인
   */
  checkPackageLeaveCnt (param) {
    return api.post('/api/product/package/rooms', param)
  }
}
