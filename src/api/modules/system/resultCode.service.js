import api from '@/api'

const resultCodeService = {
  /**
     * ApiMessage 조회
     */
  selectApiMessage () {
    return api.get('/api/cms/system/apiMessage')
  }
}

export default resultCodeService
