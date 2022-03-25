/**
 * 문자열 유틸
 */
const util = {
  /**
   * 좌측 문자열 채우기
   * @param {String} str
   * @param {Number} padLen
   * @param {String} padStr
   */
  lpad (str, padLen, padStr) {
    if (padStr.length >= padLen) {
      return str
    }
    str += ''
    padStr += ''
    while (str.length < padLen) str = padStr + str
    str = str.length >= padLen ? str.substring(0, padLen) : str
    return str
  },
  /**
   * 우측 문자열 채우기
   * @param {String} str
   * @param {Number} padLen
   * @param {String} padStr
   */
  rpad (str, padLen, padStr) {
    if (padStr.length >= padLen) {
      return str
    }
    str += ''
    padStr += ''
    while (str.length < padLen) str += padStr
    str = str.length >= padLen ? str.substring(0, padLen) : str
    return str
  },
  /**
   * 첫글자 대문자로 바꾸기
   * @param {String}} str
   */
  capitalize (str) {
    if (!str || str.length < 2) {
      return str
    }
    return str.charAt(0).toUpperCase() + str.slice(1)
  },
  /**
   * UUID 생성
   */
  guid () {
    function s4 () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
  },
  /**
   * 필터된 텍스트 칠하기 for vuetify
   * @param {String} text 대상 문자열
   * @param {String} fitlerText 필터할 문자열
   */
  getFilteredText (text, fitlerText) {
    try {
      const targetTextIndex = text.toLowerCase().indexOf(fitlerText.toLowerCase())
      if (targetTextIndex >= 0) {
        const targetText = text.substring(targetTextIndex, targetTextIndex + fitlerText.length)
        const replaceText = `<strong class="info--text">${targetText}</strong>`
        return text.replace(targetText, replaceText)
      }
      return text
    } catch {
      return text
    }
  }
}

export default util
