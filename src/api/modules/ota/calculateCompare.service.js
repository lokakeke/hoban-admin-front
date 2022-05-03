import api from '@/api'

const calculateComparetiveContrastService = {
  /**
   * @Method convertSheetsToTables
   * @description 엑셀 데이터 읽기
   * @param targetDate -> YYYYMMDD
   * @returns [{정산 데이터}]
   */
  convertSheetsToTables (sheets) {
    return api.post('/api/system/ota/calcCompare/convertSheetsToTables', sheets)
  },

  /**
   * @Method convertPkgSheetsToTables
   * @description 엑셀 데이터 읽기
   * @param targetDate -> YYYYMMDD
   * @returns [{정산 데이터}]
   */
  convertPkgSheetsToTables (sheets) {
    return api.post('/api/system/ota/calcCompare/convertPkgSheetsToTables', sheets)
  },

  /**
   * @Method compareRsvList
   * @description 예약내역 비교
   * @param sysData -> Array
   * * @param excelData -> Array
   * @returns [{비교결과}]
   */
  compareRsvList (sysData, excelData) {
    return api.post('/api/system/ota/calcCompare/compareRsvList', {
      sysData: sysData,
      excelData: excelData
    })
  },

  /**
   * @Method compareAmtList
   * @description 금액 비교
   * @param sysData -> Array
   * * @param excelData -> Array
   * @returns [{비교결과}]
   */
  compareAmtList (sysData, excelData) {
    return api.post('/api/system/ota/calcCompare/compareAmtList', {
      sysData: sysData,
      excelData: excelData
    })
  }
}

export default calculateComparetiveContrastService
