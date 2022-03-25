import api from 'Api'

const resultCodeService = {
  /**
     * ApiMessage 조회
     */
  selectApiMessage () {
    return api.get('/api/system/apiMessage')
  }
}

export default resultCodeService
