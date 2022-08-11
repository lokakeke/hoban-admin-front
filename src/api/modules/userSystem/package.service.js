import api from '@/api'

const packageService = {

  /**
   * 패키지 조회(테스트)
  */
  selectPackageList () {
    return api.get('/api/user/system/package/list')
  },
  /**
   * 패키지 번호 조회(테스트용)
   */
  selectPackageNo (packageNo) {
    return api.get(`/api/user/system/package/${packageNo}`)
  }
}
export default packageService
