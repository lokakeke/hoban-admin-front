import api from "Api"

const packageService = {
  /**
     * 패키지 등록관리 목록 조회
     */
  selectRoomPackageRegisterList (param) {
    return api.get('/api/ota/pack/list', {
      params: param
    })
  },

  /**
   * DGNS 마스터 정보 조회
   * @param flag
   * 1 : 공통 코드에 등록된 패키지 판매 유형에 대해서만 조회 가능
   * 2 : 모든 패키지 판매 유형에 대해 조회 가능
   */
  selectPackageMasterInformation (packageNumber, flag) {
    return api.get(`/api/ota/pack/${packageNumber}`, {
      params: {
        flag: flag
      }
    })
  },

  /**
     * 객실패키지 정보 조회
     */
  selectRoomPackageInformation (packageNumber) {
    return api.get(`/api/ota/pack/detail/${packageNumber}`)
  },

  /**
     * 통계용 패키지 분류 리스트 조회
     */
  selectPackageTypeList () {
    return api.get('/api/ota/pack/types')
  },

  /**
     * 객실패키지 기본정보 등록
     */
  insertRoomPackageInformation (packageDataObject) {
    return api.post('/api/ota/pack/insert', packageDataObject)
  },

  /**
     * 객실패키지 기본정보 수정
     */
  updateRoomPackageInformation (packageDataObject) {
    return api.post('/api/ota/pack/update', packageDataObject)
  },

  /**
     * 객실패키지 판매여부 수정
     */
  updateRoomPackageUseYn (packageDataObject) {
    return api.post('/api/ota/pack/update/useYn', packageDataObject)
  },

  /**
     * 객실패키지 객실유형 정보 조회
     */
  selectPackageRoomTypeList (packageNumber) {
    return api.get(`/api/ota/pack/roomList/${packageNumber}`)
  },

  /**
     * 객실패키지 영업장 정보 조회(객실유형 포함)
     */
  selectPackageStoreList (packageNumber) {
    return api.get(`/api/ota/pack/storeList/${packageNumber}`)
  },

  /**
     * 객실패키지 객실유형 정보 등록
     */
  insertPackageRoomTypeList (roomTypeList) {
    return api.post('/api/ota/pack/insert/room', roomTypeList)
  },

  /**
     * 객실패키지 객실유형 정보 수정
     */
  updatePackageRoomTypeList (roomTypeList) {
    return api.post('/api/ota/pack/update/detail', roomTypeList)
  },

  /**
     * 판매대상 업체목록 조회
     */
  selectPartnerList (packageNumber, ptnrNo = null) {
    if (ptnrNo !== null) {
      return api.get(`/api/ota/partner/list/${packageNumber}?ptnrNo=${ptnrNo}`)
    } else {
      return api.get(`/api/ota/partner/list/${packageNumber}`)
    }
  },

  /**
     * 객실패키지 전체판매 여부 수정 - 전체 업체가 모두 판매가 가능한 경우
     */
  updateRoomPackageSaleType (packageNumber, flag) {
    return api.post(`/api/ota/pack/update/allSale/${packageNumber}/${flag}`)
  },

  /**
     * 객실패키지 판매업체 등록 - 특정 업체만 판매가 가능한 경우
     */
  insertSalePartnerList (partnerList) {
    return api.post('/api/ota/partner/insert', partnerList)
  },

  /**
     * 객실패키지 판매업체 수정
     */
  updateSalePartnerList (partnerList) {
    return api.post('/api/ota/partner/update', partnerList)
  },

  /**
     * 객실패키지 판매업체 삭제
     */
  deleteSalePartnerList (packageNumber) {
    return api.post(`/api/ota/partner/delete/${packageNumber}`)
  },

  /**
     * 객실패키지 사업장 & 객실 리스트
     */
  selectStoreRoomList (packageNumber) {
    return api.get(`/api/ota/holiday/room/list/${packageNumber}`)
  },

  /**
     * 객실패키지 휴일 리스트 조회
     */
  selectHolidayList (packageNumber) {
    return api.get(`/api/ota/holiday/list/${packageNumber}`)
  },

  /**
     * 객실패키지 휴일 리스트 등록
     */
  insertHolidayList (holidayList) {
    return api.post('/api/ota/holiday/insert', holidayList)
  },

  /**
     * 객실패키지 휴일 리스트 수정
     */
  updateHolidayList (holidayList) {
    return api.post('/api/ota/holiday/update', holidayList)
  },

  /**
     * 객실패키지 분류 등록
     */
  insertRoomPackageType (pkgNo, form, packTypeCdList) {
    return api.post(`/api/ota/pack/classify/insert/${pkgNo}`, {
      title: form.title,
      typeCd: form.typeCd,
      packTypeCdList: packTypeCdList
    })
  },

  /**
     * 객실패키지 분류 수정
     */
  updateRoomPackageType (pkgNo, form, packTypeCdList) {
    // return api.post('/api/ota/pack/classify/update', packageType)
    return api.post(`/api/ota/pack/classify/update/${pkgNo}`, {
      title: form.title,
      typeCd: form.typeCd,
      packTypeCdList: packTypeCdList
    })
  },

  /**
   * 객실패키지 설정 복제
   */
  insertCopyPackageInformation (pkgNo, targetPkgNo) {
    return api.post(`/api/ota/pack/${pkgNo}/information/copy/${targetPkgNo}/insert`)
  }
}

export default packageService
