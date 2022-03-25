import api from "Api"

export default {

  /**
   * 파트너의 객실 예약 가능여부 조회
   */
  selectPossibleRoomInventory (rmTypeCd, param) {
    return api.post(`/api/product/room/${rmTypeCd}`, param)
  },

  /**
   * 패키지 객실 예약 가능 여부 조회
   */
  selectPossiblePkgInventory (rmTypeCd, param) {
    return api.post(`/api/product/package/room/${rmTypeCd}`, param)
  },

  /**
   * 잔여 객실 현황 조회
   */
  selectLeaveRooms (rsvBlckCd, param) {
    return api.post(`/api/product/room/block/${rsvBlckCd}`, param)
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
