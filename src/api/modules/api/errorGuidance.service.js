import api from "Api"

export default {
  /**
   * 오류 추천 목록 조회
   * @param taskType 업무유형 [ota|social]
   * @param params 인자값 객체
   */
  selectErrorGuidanceList (taskType, params) {
    return api.get(`/api/system/error/guidance/${taskType}/list`, { params })
  },
  /**
   * 오류 추천 상세 조회
   * @param taskType 업무유형 [ota|social]
   * @param errSeq 오류순번
   */
  selectErrorGuidance (taskType, errSeq) {
    return api.get(`/api/system/error/guidance/${taskType}/${errSeq}`)
  },
  /**
   * 오류 추천 처리
   * @param taskType 업무유형 [ota|social]
   * @param params 인자값 객체
   */
  processErrorGuidance (taskType, params) {
    return api.post(`/api/system/error/guidance/${taskType}/process`, params)
  }
}
