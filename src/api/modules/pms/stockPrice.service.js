import api from '@/api'

export default {

  /**
   * 잔여 객실 현황 조회
   */
  selectLeaveRooms (blockCode, param) {
    return api.post(`/api/pms/stockPrice/room/block/${blockCode}`, param)
  },

  /**
   * 객실 유형 별 잔여 수량 확인
   */
  checkRoomLeaveCount (param) {
    return api.post('/api/pms/stockPrice/room/rooms', param)
  },

  /**
   * 패키지 유형 별 잔여 수량 확인
   */
  checkPackageLeaveCount (param) {
    return api.post('/api/pms/stockPrice/package/rooms', param)
  }

}
