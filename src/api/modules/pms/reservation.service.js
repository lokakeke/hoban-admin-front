import api from '@/api'

export default {

  /**
   * 파트너의 객실 예약 가능여부 조회
   */
  selectPossibleRoomInventory (roomTypeCode, param) {
    return api.post(`/api/pms/reservation/room/${roomTypeCode}`, param)
  },

  /**
   * 패키지 객실 예약 가능 여부 조회
   */
  selectPossiblePkgInventory (roomTypeCode, param) {
    return api.post(`/api/pms/reservation/package/room/${roomTypeCode}`, param)
  }

}
