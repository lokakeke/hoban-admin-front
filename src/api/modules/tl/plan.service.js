import api from '@/api'

const planService = {

  /**
   * TL 사업장별 요금 Plan 리스트 조회
   */
  selectBranchPlanGroupInfo (branchNo = '') {
    return api.get('/api/cms/tl/api/planMasterSearch', { params: { branchNo: branchNo } })
  }
}
export default planService
