import api from '@/api'

const packageService = {
  /**
     * 패키지 등록관리 목록 조회
     */
  selectRoomPackageRegisterList (param) {
    return api.get('/api/cms/ota/booking/pack/list', {
      params: param
    })
  },

  /**
   * DGNS 마스터 정보 조회
   * @param flag
   * 1 : 공통 코드에 등록된 패키지 판매 유형에 대해서만 조회 가능
   * 2 : 모든 패키지 판매 유형에 대해 조회 가능
   */
  selectPackageMasterInformation (packageNo, flag) {
    return api.get(`/api/cms/ota/booking/pack/${packageNo}`, {
      params: {
        flag: flag
      }
    })
  },

  /**
     * 객실패키지 정보 조회
     */
  selectRoomPackageInformation (packageNo) {
    return api.get(`/api/cms/ota/booking/pack/detail/${packageNo}`)
  },

  /**
     * 통계용 패키지 분류 리스트 조회
     */
  selectPackageTypeList () {
    return api.get('/api/cms/ota/booking/pack/types')
  },

  /**
     * 객실패키지 기본정보 등록
     */
  insertRoomPackageInformation (packageOta) {
    return api.post('/api/cms/ota/booking/pack/insert', packageOta)
  },

  /**
     * 객실패키지 기본정보 수정
     */
  updateRoomPackageInformation (packageOta) {
    return api.post('/api/cms/ota/booking/pack/update', packageOta)
  },

  /**
     * 객실패키지 판매여부 수정
     */
  updateRoomPackageUseYn (packageOta) {
    return api.post('/api/cms/ota/booking/pack/update/useYn', packageOta)
  },

  /**
     * 객실패키지 객실유형 정보 조회
     */
  selectPackageRoomTypeList (packageNo) {
    return api.get(`/api/cms/ota/booking/pack/roomList/${packageNo}`)
  },

  /**
     * 객실패키지 영업장 정보 조회(객실유형 포함)
     */
  selectPackageStoreList (packageNo) {
    return api.get(`/api/cms/ota/booking/pack/storeList/${packageNo}`)
  },

  /**
     * 객실패키지 객실유형 정보 등록
     */
  insertPackageRoomTypeList (roomTypeList) {
    return api.post('/api/cms/ota/booking/pack/insert/room', roomTypeList)
  },

  /**
     * 객실패키지 객실유형 정보 수정
     */
  updatePackageRoomTypeList (roomTypeList) {
    return api.post('/api/cms/ota/booking/pack/update/detail', roomTypeList)
  },

  /**
     * 판매대상 업체목록 조회
     */
  selectPartnerList (packageNo, partnerSeq = null) {
    if (partnerSeq !== null) {
      return api.get(`/api/cms/ota/booking/packagePartner/list/${packageNo}`, {
        params: {
          partnerSeq: partnerSeq
        }
      })
    } else {
      return api.get(`/api/cms/ota/booking/packagePartner/list/${packageNo}`)
    }
  },

  /**
     * 객실패키지 전체판매 여부 수정 - 전체 업체가 모두 판매가 가능한 경우
     */
  updateRoomPackageSaleType (packageNo, flag) {
    return api.post(`/api/cms/ota/booking/pack/update/allSale/${packageNo}/${flag}`)
  },

  /**
     * 객실패키지 판매업체 등록 - 특정 업체만 판매가 가능한 경우
     */
  insertSalePartnerList (partnerList) {
    return api.post('/api/cms/ota/booking/packagePartner/insert', partnerList)
  },

  /**
     * 객실패키지 판매업체 수정
     */
  updateSalePartnerList (partnerList) {
    return api.post('/api/cms/ota/booking/packagePartner/update', partnerList)
  },

  /**
     * 객실패키지 판매업체 삭제
     */
  deleteSalePartnerList (packageNo) {
    return api.post(`/api/cms/ota/booking/packagePartner/delete/${packageNo}`)
  },

  /**
     * 객실패키지 사업장 & 객실 리스트
     */
  selectStoreRoomList (packageNo) {
    return api.get(`/api/cms/ota/booking/holiday/room/list/${packageNo}`)
  },

  /**
     * 객실패키지 휴일 리스트 조회
     */
  selectHolidayList (packageNo) {
    return api.get(`/api/cms/ota/booking/holiday/list/${packageNo}`)
  },

  /**
     * 객실패키지 휴일 리스트 등록
     */
  insertHolidayList (holidayList) {
    return api.post('/api/cms/ota/booking/holiday/insert', holidayList)
  },

  /**
     * 객실패키지 휴일 리스트 수정
     */
  updateHolidayList (holidayList) {
    return api.post('/api/cms/ota/booking/holiday/update', holidayList)
  },

  /**
     * 객실패키지 분류 등록
     */
  insertRoomPackageType (packageNo, form, packTypeCodeList) {
    return api.post(`/api/cms/ota/booking/pack/classify/insert/${packageNo}`, {
      title: form.title,
      typeCode: form.typeCode,
      packTypeCodeList: packTypeCodeList
    })
  },

  /**
     * 객실패키지 분류 수정
     */
  updateRoomPackageType (packTypeCodeList) {
    // return api.post('/api/cms/ota/booking/pack/classify/update', packageType)
    return api.post('/api/cms/ota/booking/pack/classify/update', packTypeCodeList)
  },

  /**
   * 객실패키지 설정 복제
   */
  insertCopyPackageInformation (packageNo, targetPackageNo) {
    return api.post(`/api/cms/ota/booking/pack/${packageNo}/information/copy/${targetPackageNo}/insert`)
  }
}

export default packageService
