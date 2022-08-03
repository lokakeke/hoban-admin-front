import api from '@/api'

const packageService = {

  /**
   * 패키지 조회(테스트)
  */
  selectPackageList () {
    return api.get('/api/user/system/package/list')
  }
}
export default packageService
