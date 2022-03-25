import api from "Api"

const calculationService = {
  /**
   * @Method retrieveMonthCalcHistory
   * @description 특정 달의 정산 데이터 조회 (객실, 패키지, 위약금, TPNE)
   * @param targetDate -> YYYYMMDD
   * @returns [{정산 데이터}]
   */
  retrieveMonthCalcHistory (targetDate) {
    return api.get('/api/ota/calculation', {
      params: {
        targetDate: targetDate
      }
    })
  },

  /**
   * @Method retrievePartnerMonthCalcHistory
   * @description 특정 달의 파트너 별 정산 데이터 조회 List (객실, 패키지, 위약금)
   * @param targetDate -> YYYYMMDD
   * @param ptnrNo -> 파트너 번호
   * @returns [{정산 데이터}]
   */
  retrievePartnerMonthCalcHistory (targetDate, ptnrNo) {
    return api.get('/api/ota/calculation/partner', {
      params: {
        targetDate: targetDate,
        ptnrNo: ptnrNo
      }
    })
  },

  /**
   * @Method modifyMonthCalcHistoryStatus
   * @description 특정 달의 정산 데이터 정산상태 변경
   * @param calcSeq -> history seq
   * @param aprlCd -> 정산이력 상태코드
   * @returns [{정산 데이터}]
   */
  modifyMonthCalcHistoryStatus (calcSeq, aprlCd) {
    return api.post(`/api/ota/calculation/${calcSeq}/status/update/${aprlCd}`, {
      aprlCd: aprlCd
    })
  },

  /**
   * @Method retrieveMonthCalcDetail
   * @description 특정 달의 정산 데이터 상세 조회 (객실, 패키지, 위약금, TPNE)
   * @pathParam calcSeq -> history seq
   * @returns [{정산 상세 데이터}]
   */
  retrieveMonthCalcDetail (calcSeq, searchParam) {
    return api.get(`/api/ota/calculation/detail/${calcSeq}`, {
      params: searchParam
    })
  },

  /**
   * @Method modifyDetailMemo
   * @description 정산 데이터 메모 수정
   * @pathParam calcSeq -> history seq
   * @pathParam keyRsvNo -> 키예약번호
   * @Param memo -> 정산 데이터 메모
   * @returns {수정된 정산 상세 데이터}
   */
  modifyDetailMemo (calcItem, isAddCalc = 'N') {
    return api.post(`/api/ota/calculation/detail/${calcItem.calcSeq}/${calcItem.keyRsvNo}/memo/update`, {
      add: isAddCalc,
      memo: calcItem.memo
    })
  },

  /**
   * @Method modifyDetailCalcClass
   * @description 정산 데이터 분류 수정
   * @pathParam calcSeq -> history seq
   * @Param keyRsvNoList -> Selected keyRsvNo list
   * @Param calcClass -> 정산 분류
   * @returns {수정된 정산 상세 데이터}
   */
  modifyDetailCalcClass (calcSeq, keyRsvNoList, calcClass) {
    return api.post(`/api/ota/calculation/detail/${calcSeq}/calc-class/update`, {
      keyRsvNoList,
      calcClass
    })
  },

  /**
   * @Method removeMonthCalcDetails
   * @description 정산 데이터 삭제 (제외 탭에서만 삭제 가능)
   * @pathParam calcSeq -> history seq
   * @Param keyRsvNoList
   * @returns {수정된 정산 상세 데이터}
   */
  removeMonthCalcDetails (calcSeq, keyRsvNoList) {
    return api.post(`/api/ota/calculation/detail/${calcSeq}/delete`, {
      keyRsvNoList
    })
  },

  /**
   * @Method downloadExcel
   * @description 정산 데이터 다운로드
   * @pathParam calcSeq -> history seq
   * @returns excel
   */
  downloadExcel (calcSeq, searchParam) {
    return api.get(`/api/ota/calculation/detail/${calcSeq}/excel`, {
      params: searchParam
    })
  },

  /**
   * @Method retrieveReserveInformation
   * @description 예약 정보 조회
   * @pathParam keyRsvNo -> 예약 키 번호
   * @returns {예약정보}
   */
  retrieveReserveInformation (calcSeq, keyRsvNo) {
    return api.get(`/api/ota/calculation/detail/${calcSeq}/${keyRsvNo}/information`)
  },

  /**
   * @Method addMonthAddCalcDetail
   * @description 추가정산 탭에 정산데이터 추가
   * @pathParam calcSeq -> history seq
   * @param rsvInfo -> 예약 정보 Object
   * @return
   */
  addMonthAddCalcDetail (calcSeq, rsvInfo) {
    return api.post(`/api/ota/calculation/detail/${calcSeq}/addCalc/${rsvInfo.keyRsvNo}/insert`, rsvInfo)
  },

  /**
   * @Method addMonthAddCalcDetails
   * @description 추가정산 탭에 정산데이터 추가
   * @pathParam calcSeq -> history seq
   * @param keyRsvNoList -> KEY 예약 번호 List
   * @return
   */
  addMonthAddCalcDetails (calcSeq, keyRsvNoList) {
    return api.post(`/api/ota/calculation/detail/${calcSeq}/addCalc/insert`, keyRsvNoList)
  },

  /**
   * @Method includeSelectedAddCalcDetailAsCalcDetail
   * @description 선택된 추가정산 데이터를 이번달 정산으로 포함 (insert)
   * @pathParam calcSeq -> history seq
   * @pathParam showInd -> 노출구분
   * @param rsvInfoList -> 예약 정보 리스트
   * @return
   */
  includeSelectedAddCalcDetailAsCalcDetail (calcSeq, showInd, rsvInfoList) {
    return api.post(`/api/ota/calculation/detail/${calcSeq}/inclusion/${showInd}`, rsvInfoList)
  },

  /**
   * @Method modifyDetailSaleAdjustAmt
   * @description 매출조정 금액 수정
   * @param rsvInfo -> calcSeq, keyRsvNo, saleAdjustAmt
   * calcSeq -> history seq
   * keyRsvNo -> calc seq
   * saleAdjustAmt -> 매출조정 금액
   * @return
   */
  modifyDetailSaleAdjustAmt (rsvInfo) {
    return api.post(`/api/ota/calculation/detail/${rsvInfo.calcSeq}/${rsvInfo.keyRsvNo}/sale-adjust-amt/update`, rsvInfo.saleAdjustAmt)
  },

  /**
   * @Method retrieveMonthCalcHistoryMemo
   * @description 월 정산 메모 정보 조회
   * @pathParam calcSeq -> history seq
   * @return
   */
  retrieveMonthCalcHistoryMemo (calcSeq) {
    return api.get(`/api/ota/calculation/${calcSeq}/memo`)
  },

  /**
   * @Method modifyMonthCalcHistoryMemo
   * @description 월 정산 메모 수정
   * @pathParam calcSeq -> history seq
   * @param memo -> 메모 입력 내용
   * @return 성공여부
   */
  modifyMonthCalcHistoryMemo (calcSeq, memo) {
    return api.post(`/api/ota/calculation/${calcSeq}/memo`, memo)
  },

  /**
   * @Method modifyMonthCalcHistoryMemo
   * @description 월 정산 메모 수정
   * @pathParam calcSeq -> history seq
   * @param memo -> 메모 입력 내용
   * @return 성공여부
   */
  executeCalculate (executeParam) {
    return api.post('/api/ota/calculation/schedule', executeParam)
  },

  /**
   * @Method retrieveMonthCalcAddPackage
   * @description 요청달에 추가 된 패키지 조회
   * @pathParam pkgNo -> 패키지 번호
   * @param targetMonth -> 조회 할 달 (YYYYMM)
   * @return 성공여부
   */
  retrieveMonthCalcAddPackage (pkgNo, targetMonth) {
    return api.get(`/api/ota/calculation/add-package/${pkgNo}`, {
      params: {
        targetMonth
      }
    })
  },

  /**
   * @Method retrieveMonthCalcAddPackageList
   * @description 요청달에 추가 된 패키지 조회 (List)
   * @param targetMonth -> 조회 할 달 (YYYYMM)
   * @return 성공여부
   */
  retrieveMonthCalcAddPackageList (targetMonth) {
    return api.get('/api/ota/calculation/add-package', {
      params: {
        targetMonth
      }
    })
  },

  /**
   * @Method addMonthCalcAddPackage
   * @description 요청달에 추가 된 패키지 조회 (List)
   * @param param -> pkgNo, targetMonth
   * @return 성공여부
   */
  addMonthCalcAddPackage (param) {
    return api.post('/api/ota/calculation/add-package/insert', param)
  },

  /**
   * @Method countMonthCalcAddPackage
   * @description 요청 달에 추가 된 패키지 개수
   * @param targetMonth -> 조회 할 달 (YYYYMM)
   * @return 추가 정산으로 등록된 패키지 총 개수
   */
  countMonthCalcAddPackage (targetMonth) {
    return api.get('/api/ota/calculation/add-package/count', {
      params: {
        targetMonth
      }
    })
  },

  /**
   * @Method deleteMonthCalcAddPackage
   * @description 요청달에 추가 된 패키지 삭제
   * @param param -> pkgNo, targetMonth
   * @return 성공여부
   */
  deleteMonthCalcAddPackage (param) {
    return api.post('/api/ota/calculation/add-package/delete', param)
  },

  /**
   * @Method retrievePartnerMenuAuth
   * @description 파트너 메뉴 접근 권한 확인
   * @param ptnrNo -> 파트너 번호
   * @return 접근 메뉴 리스트
   */
  retrievePartnerMenuAuth (ptnrNo) {
    return api.get(`/api/ota/calculation/${ptnrNo}/auth/menu`)
  },

  /**
   * @Method retrieveMonthCalcTotAmt
   * @description 특정 달의 정산 데이터 총 금액 조회 (객실, 패키지, 위약금)
   * @param searchParam
   * @return 후불 금액 합계
   */
  retrieveMonthCalcTotAmt (calcSeq, searchParam) {
    return api.get(`/api/ota/calculation/detail/${calcSeq}/total-amount`, {
      params: searchParam
    })
  },

  /**
   * @Method retrieveMonthCalcAddClassList
   * @description 특정 달의 사전 정산분류 리스트 조회
   * @param targetMonth -> YYYYMM
   * @return 사전 정산분류 리스트
   */
  retrieveMonthCalcAddClassList (targetMonth) {
    return api.get('/api/ota/calculation/add-class', {
      params: {
        targetMonth
      }
    })
  },

  /**
   * @Method addMonthCalcAddClass
   * @description 특정 달의 사전 정산분류 등록
   * @param param -> calcYm, keyRsvNo, calcClass, memo
   * @return 사전 정산분류 리스트
   */
  addMonthCalcAddClass (param) {
    return api.post('/api/ota/calculation/add-class/insert', param)
  },

  /**
   * @Method retrieveReservationInformation
   * @description 예약 이력 확인
   * @param keyRsvNo -> KEY 예약번호
   * @return 가능여부
   */
  retrieveReservationInformation (keyRsvNo) {
    return api.get(`/api/ota/calculation/dgns/${keyRsvNo}`)
  },

  /**
   * @Method retrieveMonthCalcAddClass
   * @description 특정 달의 사전 정산분류 조회
   * @param targetMonth -> YYYYMM
   * @param keyRsvNo -> KEY 예약번호
   * @return
   */
  retrieveMonthCalcAddClass (targetMonth, keyRsvNo) {
    return api.get(`/api/ota/calculation/add-class/${keyRsvNo}`, {
      params: {
        targetMonth
      }
    })
  },

  /**
   * @Method removeMonthCalcAddClass
   * @description 특정 달의 사전 정산분류 삭제
   * @param param -> calcYm, keyRsvNo
   * calcYm -> YYYYMM
   * keyRsvNo -> KEY 예약 번호
   * @return 삭제 성공여부
   */
  removeMonthCalcAddClass (param) {
    return api.post('/api/ota/calculation/add-class/delete', param)
  },

  /**
   * @Method retrieveDgnsPackageStatusByDepositDate
   * @description 입금일자별 패키지 현황조회
   * @param calcSeq -> history Seq
   * @param pkgNo -> 패키지번호
   * @return
   */
  retrieveDgnsPackageStatusByDepositDate (calcSeq, pkgNo) {
    return api.get(`/api/ota/calculation/dgns/package/deposit/${pkgNo}`, {
      params: {
        calcSeq
      }
    })
  },

  /**
   * @Method retrievePartnersCalcStatus
   * @description 파트너들의 정산현황 확인
   * @param calcSeq -> history Seq
   * @return 파트너 List
   */
  retrievePartnersCalcStatus (calcSeq) {
    return api.get(`/api/ota/calculation/${calcSeq}/partners/status`)
  },

  /**
   * @Method addPartnerCalcStatus
   * @description 파트너사 정산 확인여부 추가
   * @param calcSeq -> history Seq
   * @param ptnrNo -> 파트너 번호
   * @param ptnrChrgId -> 파트너 담당자 ID
   * @return
   */
  addPartnerCalcStatus (calcSeq, ptnrNo, ptnrChrgId) {
    return api.post(`/api/ota/calculation/${calcSeq}/partners/${ptnrNo}/status`, ptnrChrgId)
  },

  /**
   * @Method retrieveCouponUseStatus
   * @description KEY 예약번호의 쿠폰 사용상태 확인
   * @param keyRsvNo -> KEY 예약번호
   * @return
   */
  retrieveCouponUseStatus (keyRsvNo) {
    return api.get(`/api/ota/calculation/dgns/${keyRsvNo}/coupon`)
  },

  /**
   * @Method addMonthCalcHistory
   * @description 정산 데이터 생성 (API_OTA_CALC_HIS)
   * @param targetDate -> YYYYMMDD
   * @return
   */
  addMonthCalcHistory (targetDate) {
    return api.post('/api/ota/calculation/history/create', targetDate)
  },

  /**
   * @Method retrievePartnersAllCalcStatus
   * @description 파트너들의 모든 정산현황 확인
   * @param startDate -> YYYYMMDD
   * @return 파트너 List
   */
  retrievePartnersAllCalcStatus (startDate) {
    return api.get('/api/ota/calculation/partners/status', {
      params: {
        startDate
      }
    })
  }
}

export default calculationService
